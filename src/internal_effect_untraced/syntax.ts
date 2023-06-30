import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import type { LazyArg } from "@effect/data/Function"
import { dual, pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import { tuple } from "@effect/data/Tuple"
import * as _parser from "@effect/parser/internal_effect_untraced/parser"
import * as _printer from "@effect/parser/internal_effect_untraced/printer"
import * as _regex from "@effect/parser/internal_effect_untraced/regex"
import type * as Parser from "@effect/parser/Parser"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Printer from "@effect/parser/Printer"
import type * as Regex from "@effect/parser/Regex"
import type * as Syntax from "@effect/parser/Syntax"

/** @internal */
const SyntaxSymbolKey = "@effect/Syntax/Syntax"

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
  make(_parser.anything(), _printer.anything())

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
>(2, (self, value) =>
  make(
    _parser.as(self.parser, value),
    _printer.asPrinted(self.printer, value, void 0 as void)
  ))

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
    _parser.as(self.parser, value),
    _printer.asPrinted(self.printer, value, from)
  ))

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
>(2, (self, from) =>
  make(
    _parser.asUnit(self.parser),
    _printer.asPrinted(self.printer, void 0 as void, from)
  ))

/** @internal */
export const atLeast = dual<
  (
    min: number
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>,
  <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    min: number
  ) => Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>>
>(2, (self, min) => make(_parser.atLeast(self.parser, min), _printer.repeat(self.printer)))

/** @internal */
export const autoBacktracking = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(
    _parser.autoBacktracking(self.parser),
    self.printer
  )

/** @internal */
export const backtrack = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(
    _parser.backtrack(self.parser),
    self.printer
  )

/** @internal */
export const between = dual<
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
export const captureString = <Error, Output, Value>(
  self: Syntax.Syntax<string, Error, Output, Value>
): Syntax.Syntax<string, Error, string, string> =>
  make(
    _parser.captureString(self.parser),
    _printer.anyString
  )

/** @internal */
export const char = <Error = string>(char: string, error?: Error): Syntax.Syntax<string, Error, string, void> =>
  regexDiscard(_regex.charIn([char]), error ?? (`not '${char}'` as any), [char])

/** @internal */
export const charIn = (chars: Iterable<string>): Syntax.Syntax<string, string, string, string> =>
  regexChar(_regex.charIn(chars), `not one of the expected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const charNotIn = (chars: Iterable<string>): Syntax.Syntax<string, string, string, string> =>
  regexChar(_regex.charNotIn(chars), `one of the unexpected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const fail = <Error>(error: Error): Syntax.Syntax<unknown, Error, never, unknown> =>
  make(_parser.fail(error), _printer.fail(error))

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
): Syntax.Syntax<string, Error, string, string> => regexChar(_regex.filter(predicate), error)

/** @internal */
export const flatten = <Input, Error, Output>(
  self: Syntax.Syntax<Input, Error, Output, Chunk.Chunk<string>>
): Syntax.Syntax<Input, Error, Output, string> => transform(self, Chunk.join(""), Chunk.of)

/** @internal */
export const flattenNonEmpty = <Input, Error, Output>(
  self: Syntax.Syntax<Input, Error, Output, Chunk.NonEmptyChunk<string>>
): Syntax.Syntax<Input, Error, Output, string> => transform(self, Chunk.join(""), Chunk.of)

/** @internal */
export const flattenZippedStrings = <Input, Error, Output>(
  self: Syntax.Syntax<Input, Error, Output, readonly [string, string]>
): Syntax.Syntax<Input, Error, Output, string> => transform(self, ReadonlyArray.join(""), (from) => tuple("", from))

/** @internal */
export const manualBacktracking = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(
    _parser.manualBacktracking(self.parser),
    self.printer
  )

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
    _parser.mapError(self.parser, f),
    _printer.mapError(self.printer, f)
  ))

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
>(2, (self, name) => make(_parser.named(self.parser, name), self.printer))

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
>(2, (self, error) => make(_parser.not(self.parser, error), _printer.unit()))

/** @internal */
export const notChar = <Error>(char: string, error: Error): Syntax.Syntax<string, Error, string, string> =>
  regexChar(_regex.charNotIn([char]), error)

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
    _parser.orElse(self.parser, () => that().parser),
    _printer.orElse(self.printer, () => that().printer)
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
    _parser.orElseEither(self.parser, () => that().parser),
    _printer.orElseEither(self.printer, () => that().printer)
  ))

/** @internal */
export const optional = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Option.Option<Value>> =>
  make(_parser.optional(self.parser), _printer.optional(self.printer))

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
>(2, (self, input) => _parser.parseString(self.parser, input))

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
>(3, (self, input, implementation) => _parser.parseStringWith(self.parser, input, implementation))

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
>(2, (self, value) => _printer.printToString(self.printer, value))

/** @internal */
export const regex = <Error>(
  regex: Regex.Regex,
  error: Error
): Syntax.Syntax<string, Error, string, Chunk.Chunk<string>> =>
  make(_parser.regex(regex, error), _printer.regex(regex, error))

/** @internal */
export const regexChar = <Error>(regex: Regex.Regex, error: Error): Syntax.Syntax<string, Error, string, string> =>
  make(_parser.regexChar(regex, error), _printer.regexChar(regex, error))

/** @internal */
export const regexDiscard = <Error>(
  regex: Regex.Regex,
  error: Error,
  chars: Iterable<string>
): Syntax.Syntax<string, Error, string, void> =>
  make(_parser.regexDiscard(regex, error), _printer.regexDiscard(regex, chars))

/** @internal */
export const repeat = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Chunk.Chunk<Value>> =>
  make(_parser.repeat(self.parser), _printer.repeat(self.printer))

/** @internal */
export const repeat1 = <Input, Error, Output, Value>(
  self: Syntax.Syntax<Input, Error, Output, Value>
): Syntax.Syntax<Input, Error, Output, Chunk.NonEmptyChunk<Value>> =>
  make(_parser.repeat1(self.parser), _printer.repeat1(self.printer))

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
    _parser.repeatUntil(self.parser, stopCondition.parser),
    _printer.repeatUntil(self.printer, stopCondition.printer)
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
    zip(self, repeat(zipRight(separator, self))),
    optional,
    transform(
      Option.match(
        () => Chunk.empty(),
        ([head, tail]) => Chunk.prepend(tail, head)
      ),
      (a) =>
        Chunk.isNonEmpty(a) ?
          Option.some(
            tuple(
              Chunk.headNonEmpty(a),
              Chunk.drop(a, 1)
            )
          ) :
          Option.none()
    )
  ))

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
    zip(self, repeat(zipRight(separator, self))),
    // readonly [Value, readonly Value[]] => => readonly Value[]
    ([head, tail]) => Chunk.prepend(tail, head) as Chunk.NonEmptyChunk<Syntax.V<typeof self>>,
    (a) =>
      tuple(
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
    _parser.setAutoBacktracking(self.parser, enabled),
    self.printer
  ))

/** @internal */
export const string = <Value>(str: string, value: Value): Syntax.Syntax<string, string, string, Value> =>
  asPrinted(regexDiscard(_regex.string(str), `not '${str}'`, str.split("")), value, void 0)

/** @internal */
export const succeed = <Value>(value: Value): Syntax.Syntax<unknown, never, never, Value> =>
  make(_parser.succeed(value), _printer.succeed(value))

/** @internal */
export const surroundedBy = dual<
  <Input2, Error2, Output2>(
    other: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => <Input, Error, Output, Value>(
    self: Syntax.Syntax<Input, Error, Output, Value>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>,
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax.Syntax<Input, Error, Output, Value>,
    other: Syntax.Syntax<Input2, Error2, Output2, void>
  ) => Syntax.Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
>(2, (self, other) => zipRight(other, zipLeft(self, other)))

/** @internal */
export const suspend = <Input, Error, Output, Value>(
  self: LazyArg<Syntax.Syntax<Input, Error, Output, Value>>
): Syntax.Syntax<Input, Error, Output, Value> =>
  make(_parser.suspend(() => self().parser), _printer.suspend(() => self().printer))

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
    _parser.map(self.parser, to),
    _printer.contramap(self.printer, from)
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
    _parser.transformEither(self.parser, to),
    _printer.contramapEither(self.printer, from)
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
    _parser.transformEither(
      self.parser,
      (value) => Either.fromOption(to(value), () => Option.none())
    ),
    _printer.contramapEither(
      self.printer,
      (value) => Either.fromOption(from(value), () => Option.none())
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
      Option.match(
        from(value),
        () => Either.left<Error | Error2>(error),
        Either.right
      )
  ))

/** @internal */
export const unsafeRegex = (regex: Regex.Regex): Syntax.Syntax<string, never, string, Chunk.Chunk<string>> =>
  make(_parser.unsafeRegex(regex), _printer.unsafeRegex(regex))

/** @internal */
export const unsafeRegexChar = (regex: Regex.Regex): Syntax.Syntax<string, never, string, string> =>
  make(_parser.unsafeRegexChar(regex), _printer.unsafeRegexChar(regex))

/** @internal */
export const unsafeRegexDiscard = (
  regex: Regex.Regex,
  chars: Iterable<string>
): Syntax.Syntax<string, never, string, void> =>
  make(_parser.unsafeRegexDiscard(regex), _printer.regexDiscard(regex, chars))

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
    _parser.zipLeft(self.parser, that.parser),
    _printer.zipLeft(self.printer, that.printer)
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
    _parser.zipRight(self.parser, that.parser),
    _printer.zipRight(self.printer, that.printer)
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
    _parser.zip(self.parser, that.parser),
    _printer.zip(self.printer, that.printer)
  ))

/** @internal */
export const anyChar: Syntax.Syntax<string, never, string, string> = unsafeRegexChar(_regex.anyChar)

/** @internal */
export const anyString: Syntax.Syntax<string, never, string, string> = make(_parser.anyString, _printer.anyString)

/** @internal */
export const unit = (): Syntax.Syntax<unknown, never, never, void> => succeed<void>(void 0)

/** @internal */
export const alphaNumeric: Syntax.Syntax<string, string, string, string> = regexChar(
  _regex.anyAlphaNumeric,
  "not alphanumeric"
)

/** @internal */
export const digit: Syntax.Syntax<string, string, string, string> = regexChar(_regex.anyDigit, "not a digit")

/** @internal */
export const letter: Syntax.Syntax<string, string, string, string> = regexChar(_regex.anyLetter, "not a letter")

/** @internal */
export const whitespace: Syntax.Syntax<string, string, string, string> = regexChar(
  _regex.anyWhitespace,
  "not a whitespace character"
)

/** @internal */
export const index: Syntax.Syntax<unknown, never, never, number> = make(_parser.index, _printer.succeed(0))

/** @internal */
export const end: Syntax.Syntax<unknown, never, never, void> = make(_parser.end, _printer.succeed(void 0))
