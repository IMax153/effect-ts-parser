import { Chunk, Either, Option, Tuple } from "effect"
import type { LazyArg } from "effect/Function"
import { dual, pipe } from "effect/Function"
import { pipeArguments } from "effect/Pipeable"
import type { Predicate } from "effect/Predicate"
import type * as Parser from "./../Parser.js"
import type * as ParserError from "./../ParserError.js"
import type * as Printer from "./../Printer.js"
import type * as Regex from "./../Regex.js"
import type * as Syntax from "./../Syntax.js"
import * as InternalParser from "./parser.js"
import * as InternalPrinter from "./printer.js"
import * as InternalRegex from "./regex.js"

/** @internal */
const SyntaxSymbolKey = "@effect/parser/Syntax"

/** @internal */
export const SyntaxTypeId: Syntax.SyntaxTypeId = Symbol.for(
  SyntaxSymbolKey
) as Syntax.SyntaxTypeId

/** @internal */
const proto = {
  [SyntaxTypeId]: {
    _Input: (_: unknown) => _,
    _Error: (_: never) => _,
    _Output: (_: never) => _,
    _Value: (_: never) => _
  },
  pipe() {
    return pipeArguments(this, arguments)
  }
}

/** @internal */
const make = <Input, Error, Output, Value>(
  parser: Parser.Parser<Input, Error, Value>,
  printer: Printer.Printer<Value, Error, Output>
): Syntax.Syntax<Input, Error, Output, Value> => {
  const syntax = Object.create(proto)
  syntax.parser = parser
  syntax.printer = printer
  return syntax
}

/** @internal */
export const anything = <Input>(): Syntax.Syntax<Input, never, Input, Input> =>
  make(InternalParser.anything(), InternalPrinter.anything())

/** @internal */
export const asPrinted = dual<
  <Value, Value2>(
    value: Value2,
    from: Value
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value2>,
  <Input, Error, Output, Value, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    value: Value2,
    from: Value
  ) => Syntax.Syntax<Input, Error, Output, Value2>
>(3, (self, value, from) =>
  make(
    InternalParser.as(self.parser, value),
    InternalPrinter.asPrinted(self.printer, value, from)
  ))

/** @internal */
export const as = dual<
  <Value2>(
    value: Value2
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, void>
  ) => Syntax.Syntax<Input, Error, Output, Value2>,
  <Input, Error, Output, Value2>(
    self: Syntax.Syntax<Input, Error, Output, void>,
    value: Value2
  ) => Syntax.Syntax<Input, Error, Output, Value2>
>(2, (self, value) => asPrinted(self, value, void 0 as void))

/** @internal */
export const asUnit = dual<
  <Value>(
    from: Value
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, void>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    from: Value
  ) => Syntax.Syntax<Input, Error, Output, void>
>(2, (self, from) => asPrinted(self, void 0 as void, from))

/** @internal */
export const succeed = <Value>(value: Value): Syntax.Syntax<unknown, never, never, Value> =>
  make(InternalParser.succeed(value), InternalPrinter.succeed(value))

/** @internal */
export const unit = (): Syntax.Syntax<unknown, never, never, void> => succeed<void>(void 0)

/** @internal */
export const fail = <Error>(error: Error): Syntax.Syntax<unknown, Error, never, unknown> =>
  make(InternalParser.fail(error), InternalPrinter.fail(error))

/** @internal */
export const optional = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Option.Option<Value>> =>
  make(InternalParser.optional(self.parser), InternalPrinter.optional(self.printer))

/** @internal */
export const suspend = <Input, Error, Output, Value>(
  self: LazyArg<Syntax.Syntax<Input, Error, Output, Value>>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(InternalParser.suspend(() => self().parser), InternalPrinter.suspend(() => self().printer))

/** @internal */
export const orElse = dual<
  <Input2, Error2, Output2, Value>(
    that: LazyArg<Syntax.Syntax<Input2, Error2, Output2, Value>>
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    that: LazyArg<Syntax.Syntax<Input2, Error2, Output2, Value>>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
>(2, (self, that) =>
  make(
    InternalParser.orElse(self.parser, () => that().parser),
    InternalPrinter.orElse(self.printer, () => that().printer)
  ))

/** @internal */
export const orElseEither = dual<
  <Input2, Error2, Output2, Value2>(
    that: LazyArg<Syntax.Syntax<Input2, Error2, Output2, Value2>>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Either.Either<Value, Value2>>,
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    that: LazyArg<Syntax.Syntax<Input2, Error2, Output2, Value2>>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Either.Either<Value, Value2>>
>(2, (self, that) =>
  make(
    InternalParser.orElseEither(self.parser, () => that().parser),
    InternalPrinter.orElseEither(self.printer, () => that().printer)
  ))

/** @internal */
export const transform = dual<
  <Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value2>,
  <Input, Error, Output, Value, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ) => Syntax.Syntax<Input, Error, Output, Value2>
>(3, (self, to, from) =>
  make(
    InternalParser.map(self.parser, to),
    InternalPrinter.contramap(self.printer, from)
  ))

/** @internal */
export const transformEither = dual<
  <Error, Value, Value2>(
    to: (value: Value) => Either.Either<Error, Value2>,
    from: (value: Value2) => Either.Either<Error, Value>
  ) => <Input, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value2>,
  <Input, Error, Output, Value, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Either.Either<Error, Value2>,
    from: (value: Value2) => Either.Either<Error, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value2>
>(3, (self, to, from) =>
  make(
    InternalParser.transformEither(self.parser, to),
    InternalPrinter.contramapEither(self.printer, from)
  ))

/** @internal */
export const transformOption = dual<
  <Value, Value2>(
    to: (value: Value) => Option.Option<Value2>,
    from: (value: Value2) => Option.Option<Value>
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Option.Option<Error>, Output, Value2>,
  <Input, Error, Output, Value, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Option.Option<Value2>,
    from: (value: Value2) => Option.Option<Value>
  ) => Syntax.Syntax<Input, Option.Option<Error>, Output, Value2>
>(3, (self, to, from) =>
  make(
    InternalParser.transformEither(
      self.parser,
      (value) =>
        Option.match(to(value), {
          onNone: () => Either.left(Option.none()),
          onSome: Either.right
        })
    ),
    InternalPrinter.contramapEither(
      self.printer,
      (value) =>
        Option.match(from(value), {
          onNone: () => Either.left(Option.none()),
          onSome: Either.right
        })
    )
  ))

/** @internal */
export const transformTo = dual<
  <Error2, Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Option.Option<Value>,
    error: Error2
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error | Error2, Output, Value2>,
  <Input, Error, Output, Value, Error2, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Option.Option<Value>,
    error: Error2
  ) => Syntax.Syntax<Input, Error | Error2, Output, Value2>
>(4, <Input, Error, Output, Value, Error2, Value2>(
  self: Syntax.Syntax<Input, Error, Output, Value>,
  to: (value: Value) => Value2,
  from: (value: Value2) => Option.Option<Value>,
  error: Error2
) =>
  transformEither(
    self,
    (value) => Either.right(to(value)),
    (value) =>
      Option.match(from(value), {
        onNone: () => Either.left<Error | Error2>(error),
        onSome: Either.right
      })
  ))

/** @internal */
export const filter = dual<
  <Value, Error2>(
    predicate: Predicate<Value>,
    error: Error2
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error | Error2, Output, Value>,
  <Input, Error, Output, Value, Error2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    predicate: Predicate<Value>,
    error: Error2
  ) => Syntax.Syntax<Input, Error | Error2, Output, Value>
>(3, <Input, Error, Output, Value, Error2>(
  self: Syntax.Syntax<Input, Error, Output, Value>,
  predicate: Predicate<Value>,
  error: Error2
) =>
  transformEither(
    self,
    (value) => predicate(value) ? Either.right(value) : Either.left<Error | Error2>(error),
    (value) => predicate(value) ? Either.right(value) : Either.left<Error | Error2>(error)
  ))

/** @internal */
export const filterChar = <Error>(
  predicate: Predicate<string>,
  error: Error
): Syntax.Syntax<string, Error, string, string> => regexChar(InternalRegex.filter(predicate), error)

/** @internal */
export const flatten = <Input, Error, Output>(
  self: Syntax.Syntax<Input, Error, Output, Chunk.Chunk<string>>
): Syntax.Syntax<Input, Error, Output, string> => transform(self, Chunk.join(""), Chunk.of)

/** @internal */
export const flattenNonEmpty = <Input, Error, Output>(
  self: Syntax.Syntax<Input, Error, Output, Chunk.NonEmptyChunk<string>>
): Syntax.Syntax<Input, Error, Output, string> => transform(self, Chunk.join(""), Chunk.of)

/** @internal */
export const mapError = dual<
  <Error, Error2>(
    f: (error: Error) => Error2
  ) => <Input, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error2, Output, Value>,
  <Input, Error, Output, Value, Error2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    f: (error: Error) => Error2
  ) => Syntax.Syntax<Input, Error2, Output, Value>
>(2, (self, f) =>
  make(
    InternalParser.mapError(self.parser, f),
    InternalPrinter.mapError(self.printer, f)
  ))

/** @internal */
export const zip = dual<
  <Input2, Error2, Output2, Value2>(
    that: Syntax.Syntax<Input2, Error2, Output2, Value2>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, readonly [Value, Value2]>,
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    that: Syntax.Syntax<Input2, Error2, Output2, Value2>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, readonly [Value, Value2]>
>(2, (self, that) =>
  make(
    InternalParser.zip(self.parser, that.parser),
    InternalPrinter.zip(self.printer, that.printer)
  ))

/** @internal */
export const zipLeft = dual<
  <Input2, Error2, Output2>(
    that: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    that: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
>(2, (self, that) =>
  make(
    InternalParser.zipLeft(self.parser, that.parser),
    InternalPrinter.zipLeft(self.printer, that.printer)
  ))

/** @internal */
export const zipRight = dual<
  <Input2, Error2, Output2, Value2>(
    that: Syntax.Syntax<Input2, Error2, Output2, Value2>
  ) => <Input, Error, Output>(
    self: Syntax.Syntax<Input, Error, Output, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value2>,
  <Input, Error, Output, Input2, Error2, Output2, Value2>(
    self: Syntax.Syntax<Input, Error, Output, void>,
    that: Syntax.Syntax<Input2, Error2, Output2, Value2>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value2>
>(2, (self, that) =>
  make(
    InternalParser.zipRight(self.parser, that.parser),
    InternalPrinter.zipRight(self.printer, that.printer)
  ))

/** @internal */
export const zipBetween = dual<
  <Input2, Error2, Output2, Input3, Error3, Output3>(
    left: Syntax.Syntax<Input2, Error2, Output2, void>,
    right: Syntax.Syntax<Input3, Error3, Output3, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2 & Input3, Error | Error2 | Error3, Output | Output2 | Output3, Value>,
  <Input, Error, Output, Value, Input2, Error2, Output2, Input3, Error3, Output3>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    left: Syntax.Syntax<Input2, Error2, Output2, void>,
    right: Syntax.Syntax<Input3, Error3, Output3, void>
  ) => Syntax.Syntax<Input & Input2 & Input3, Error | Error2 | Error3, Output | Output2 | Output3, Value>
>(3, (self, left, right) => zipRight(left, zipLeft(self, right)))

/** @internal */
export const zipSurrounded = dual<
  <Input2, Error2, Output2>(
    other: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    other: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
>(2, (self, other) => zipBetween(self, other, other))

/** @internal */
export const repeatMin = dual<
  (
    min: number
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    min: number
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>
>(2, (self, min) => make(InternalParser.repeatMin(self.parser, min), InternalPrinter.repeatMin(self.printer, min)))

/** @internal */
export const repeatMin0 = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>> =>
  make(InternalParser.repeatMin0(self.parser), InternalPrinter.repeatMin0(self.printer))

/** @internal */
export const repeatMin1 = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Chunk.NonEmptyChunk<Value>> =>
  make(InternalParser.repeatMin1(self.parser), InternalPrinter.repeatMin1(self.printer))

/** @internal */
export const repeatMax = dual<
  (
    max: number
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    max: number
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>
>(2, (self, max) => make(InternalParser.repeatMax(self.parser, max), InternalPrinter.repeatMin0(self.printer)))

/** @internal */
export const repeatUntil = dual<
  <Input2, Error2, Output2>(
    stopCondition: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    stopCondition: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>
>(2, (self, stopCondition) =>
  make(
    InternalParser.repeatUntil(self.parser, stopCondition.parser),
    InternalPrinter.repeatUntil(self.printer, stopCondition.printer)
  ))

/** @internal */
export const repeatWithSeparator = dual<
  <Input2, Error2, Output2>(
    separator: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    separator: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>
>(2, (self, separator) =>
  pipe(
    zip(self, repeatMin0(zipRight(separator, self))),
    optional,
    transform(
      Option.match({
        onNone: () => Chunk.empty(),
        onSome: ([head, tail]) => Chunk.prepend(tail, head)
      }),
      (a) =>
        Chunk.isNonEmpty(a) ?
          Option.some(
            Tuple.make(
              Chunk.headNonEmpty(a),
              Chunk.drop(a, 1)
            )
          ) :
          Option.none()
    )
  ))

type V<S extends { readonly [SyntaxTypeId]: { _Value: (..._: any) => any } }> = Parameters<
  S[Syntax.SyntaxTypeId]["_Value"]
>[0]

/** @internal */
export const repeatWithSeparator1 = dual<
  <Input2, Error2, Output2>(
    separator: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.NonEmptyChunk<Value>>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    separator: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.NonEmptyChunk<Value>>
>(2, <Input, Error, Output, Value, Input2, Error2, Output2>(
  self: Syntax.Syntax<Input, Error, Output, Value>,
  separator: Syntax.Syntax<Input2, Error2, Output2, void>
) =>
  transform(
    zip(self, repeatMin0(zipRight(separator, self))),
    // readonly [Value, readonly Value[]] => => readonly Value[]
    ([head, tail]) => Chunk.prepend(tail, head) as Chunk.NonEmptyChunk<V<typeof self>>,
    (a) =>
      Tuple.make(
        Chunk.headNonEmpty(a),
        Chunk.tailNonEmpty(a)
      )
  ))

/** @internal */
export const setAutoBacktracking = dual<
  (
    enabled: boolean
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    enabled: boolean
  ) => Syntax.Syntax<Input, Error, Output, Value>
>(2, (self, enabled) =>
  make(
    InternalParser.setAutoBacktracking(self.parser, enabled),
    self.printer
  ))

/** @internal */
export const autoBacktracking = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> => setAutoBacktracking(self, true)

/** @internal */
export const manualBacktracking = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> => setAutoBacktracking(self, false)

/** @internal */
export const backtrack = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(
    InternalParser.backtrack(self.parser),
    self.printer
  )

/** @internal */
export const captureString = <Error, Output, Value>(
  self: Syntax.Syntax<string, Error, Output, Value>
): Syntax.Syntax<string, Error, string, string> =>
  make(
    InternalParser.captureString(self.parser),
    InternalPrinter.anyString
  )

/** @internal */
export const regex = <Error>(
  regex: Regex.Regex,
  error: Error
): Syntax.Syntax<string, Error, string, Chunk.Chunk<string>> =>
  make(InternalParser.regex(regex, error), InternalPrinter.regex(regex, error))

/** @internal */
export const regexChar = <Error>(regex: Regex.Regex, error: Error): Syntax.Syntax<string, Error, string, string> =>
  make(InternalParser.regexChar(regex, error), InternalPrinter.regexChar(regex, error))

/** @internal */
export const regexDiscard = <Error>(
  regex: Regex.Regex,
  error: Error,
  chars: Iterable<string>
): Syntax.Syntax<string, Error, string, void> =>
  make(InternalParser.regexDiscard(regex, error), InternalPrinter.regexDiscard(regex, chars))

/** @internal */
export const char = <Error = string>(char: string, error?: Error): Syntax.Syntax<string, Error, string, void> =>
  regexDiscard(InternalRegex.charIn([char]), error ?? (`not '${char}'` as any), [char])

/** @internal */
export const charNot = <Error>(char: string, error: Error): Syntax.Syntax<string, Error, string, string> =>
  regexChar(InternalRegex.charNotIn([char]), error)

/** @internal */
export const charIn = (chars: Iterable<string>): Syntax.Syntax<string, string, string, string> =>
  regexChar(InternalRegex.charIn(chars), `not one of the expected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const charNotIn = (chars: Iterable<string>): Syntax.Syntax<string, string, string, string> =>
  regexChar(InternalRegex.charNotIn(chars), `one of the unexpected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const string = <Value>(str: string, value: Value): Syntax.Syntax<string, string, string, Value> =>
  asPrinted(regexDiscard(InternalRegex.string(str), `not '${str}'`, str.split("")), value, void 0)

/** @internal */
export const digit: Syntax.Syntax<string, string, string, string> = regexChar(InternalRegex.anyDigit, "not a digit")

/** @internal */
export const letter: Syntax.Syntax<string, string, string, string> = regexChar(InternalRegex.anyLetter, "not a letter")

/** @internal */
export const alphaNumeric: Syntax.Syntax<string, string, string, string> = regexChar(
  InternalRegex.anyAlphaNumeric,
  "not alphanumeric"
)

/** @internal */
export const whitespace: Syntax.Syntax<string, string, string, string> = regexChar(
  InternalRegex.anyWhitespace,
  "not a whitespace character"
)

/** @internal */
export const unsafeRegex = (regex: Regex.Regex): Syntax.Syntax<string, never, string, Chunk.Chunk<string>> =>
  make(InternalParser.unsafeRegex(regex), InternalPrinter.unsafeRegex(regex))

/** @internal */
export const unsafeRegexChar = (regex: Regex.Regex): Syntax.Syntax<string, never, string, string> =>
  make(InternalParser.unsafeRegexChar(regex), InternalPrinter.unsafeRegexChar(regex))

/** @internal */
export const unsafeRegexDiscard = (
  regex: Regex.Regex,
  chars: Iterable<string>
): Syntax.Syntax<string, never, string, void> =>
  make(InternalParser.unsafeRegexDiscard(regex), InternalPrinter.regexDiscard(regex, chars))

/** @internal */
export const anyChar: Syntax.Syntax<string, never, string, string> = unsafeRegexChar(InternalRegex.anyChar)

/** @internal */
export const anyString: Syntax.Syntax<string, never, string, string> = make(
  InternalParser.anyString,
  InternalPrinter.anyString
)

/** @internal */
export const named = dual<
  (
    name: string
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Value>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    name: string
  ) => Syntax.Syntax<Input, Error, Output, Value>
>(2, (self, name) => make(InternalParser.named(self.parser, name), self.printer))

/** @internal */
export const not = dual<
  <Error2>(
    error: Error2
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error | Error2, Output, void>,
  <Input, Error, Output, Value, Error2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    error: Error2
  ) => Syntax.Syntax<Input, Error | Error2, Output, void>
>(2, (self, error) => make(InternalParser.not(self.parser, error), InternalPrinter.unit()))

/** @internal */
export const index: Syntax.Syntax<unknown, never, never, number> = make(
  InternalParser.index,
  InternalPrinter.succeed(0)
)

/** @internal */
export const end: Syntax.Syntax<unknown, never, never, void> = make(InternalParser.end, InternalPrinter.succeed(void 0))

/** @internal */
export const parseString = dual<
  (
    input: string
  ) => <Error, Output, Value>(
    self: Syntax.Syntax<string, Error, Output, Value>
  ) => Either.Either<ParserError.ParserError<Error>, Value>,
  <Error, Output, Value>(
    self: Syntax.Syntax<string, Error, Output, Value>,
    input: string
  ) => Either.Either<ParserError.ParserError<Error>, Value>
>(2, (self, input) => InternalParser.parseString(self.parser, input))

/** @internal */
export const parseStringWith = dual<
  (
    input: string,
    implementation: Parser.Parser.Implementation
  ) => <Error, Output, Value>(
    self: Syntax.Syntax<string, Error, Output, Value>
  ) => Either.Either<ParserError.ParserError<Error>, Value>,
  <Error, Output, Value>(
    self: Syntax.Syntax<string, Error, Output, Value>,
    input: string,
    implementation: Parser.Parser.Implementation
  ) => Either.Either<ParserError.ParserError<Error>, Value>
>(3, (self, input, implementation) => InternalParser.parseStringWith(self.parser, input, implementation))

/** @internal */
export const printString = dual<
  <Value>(
    value: Value
  ) => <Input, Error>(
    self: Syntax.Syntax<Input, Error, string, Value>
  ) => Either.Either<Error, string>,
  <Input, Error, Value>(
    self: Syntax.Syntax<Input, Error, string, Value>,
    value: Value
  ) => Either.Either<Error, string>
>(2, (self, value) => InternalPrinter.printToString(self.printer, value))
