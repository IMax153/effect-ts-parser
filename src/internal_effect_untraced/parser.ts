import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import type { LazyArg } from "@effect/data/Function"
import { dual, pipe } from "@effect/data/Function"
import * as List from "@effect/data/List"
import * as Option from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import * as common from "@effect/parser/internal_effect_untraced/common"
import * as parserError from "@effect/parser/internal_effect_untraced/parserError"
import * as _regex from "@effect/parser/internal_effect_untraced/regex"
import type * as Parser from "@effect/parser/Parser"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Regex from "@effect/parser/Regex"

/** @internal */
const ParserSymbolKey = "@effect/parser/Parser"

/** @internal */
export const ParserTypeId: Parser.ParserTypeId = Symbol.for(
  ParserSymbolKey
) as Parser.ParserTypeId

/** @internal */
const proto = {
  [ParserTypeId]: {
    _Input: (_: unknown) => _,
    _Error: (_: never) => _,
    _Result: (_: never) => _
  }
}

/** @internal */
export type Op<Tag extends string, Body = {}> = Parser.Parser<unknown, never, never> & Body & {
  readonly _tag: Tag
}

/** @internal */
export type Primitive =
  | Backtrack
  | CaptureString
  | End
  | Fail
  | Failed
  | FlatMap
  | Ignore
  | Index
  | MapError
  | Named
  | Not
  | Optional
  | OrElse
  | OrElseEither
  | ParseRegex
  | ParseRegexLastChar
  | Passthrough
  | Repeat
  | SetAutoBacktrack
  | SkipRegex
  | Succeed
  | Suspend
  | Transform
  | TransformEither
  | ZipLeft
  | ZipRight
  | ZipWith

/** @internal */
export interface Backtrack extends
  Op<"Backtrack", {
    readonly parser: Primitive
  }>
{}

/** @internal */
export interface CaptureString extends
  Op<"CaptureString", {
    readonly parser: Primitive
  }>
{}

/** @internal */
export interface End extends Op<"End"> {}

/** @internal */
export interface Fail extends
  Op<"Fail", {
    readonly error: unknown
  }>
{}

/** @internal */
export interface Failed extends
  Op<"Failed", {
    readonly error: ParserError.ParserError<unknown>
  }>
{}

/** @internal */
export interface FlatMap extends
  Op<"FlatMap", {
    readonly parser: Primitive
    readonly f: (result: unknown) => Primitive
  }>
{}

/** @internal */
export interface Ignore extends
  Op<"Ignore", {
    readonly parser: Primitive
    readonly to: unknown
  }>
{}

/** @internal */
export interface Index extends Op<"Index"> {}

/** @internal */
export interface MapError extends
  Op<"MapError", {
    readonly parser: Primitive
    readonly mapError: (error: ParserError.ParserError<unknown>) => ParserError.ParserError<unknown>
  }>
{}

/** @internal */
export interface Named extends
  Op<"Named", {
    readonly parser: Primitive
    readonly name: string
  }>
{}

/** @internal */
export interface Not extends
  Op<"Not", {
    readonly parser: Primitive
    readonly error: unknown
  }>
{}

/** @internal */
export interface Optional extends
  Op<"Optional", {
    readonly parser: Primitive
  }>
{}

/** @internal */
export interface OrElse extends
  Op<"OrElse", {
    readonly left: Primitive
    readonly right: LazyArg<Primitive>
  }>
{}

/** @internal */
export interface OrElseEither extends
  Op<"OrElseEither", {
    readonly left: Primitive
    readonly right: LazyArg<Primitive>
  }>
{}

/** @internal */
export interface ParseRegex extends
  Op<"ParseRegex", {
    readonly regex: Regex.Regex
    readonly onFailure: Option.Option<unknown>
  }>
{}

/** @internal */
export interface ParseRegexLastChar extends
  Op<"ParseRegexLastChar", {
    readonly regex: Regex.Regex
    readonly onFailure: Option.Option<unknown>
  }>
{}

/** @internal */
export interface Passthrough extends Op<"Passthrough"> {}

/** @internal */
export interface Repeat extends
  Op<"Repeat", {
    readonly parser: Primitive
    readonly min: number
    readonly max: Option.Option<number>
  }>
{}

/** @internal */
export interface SetAutoBacktrack extends
  Op<"SetAutoBacktrack", {
    readonly parser: Primitive
    readonly enabled: boolean
  }>
{}

/** @internal */
export interface SkipRegex extends
  Op<"SkipRegex", {
    readonly regex: Regex.Regex
    readonly onFailure: Option.Option<unknown>
  }>
{}

/** @internal */
export interface Succeed extends
  Op<"Succeed", {
    readonly result: unknown
  }>
{}

/** @internal */
export interface Suspend extends
  Op<"Suspend", {
    readonly parser: LazyArg<Primitive>
  }>
{}

/** @internal */
export interface Transform extends
  Op<"Transform", {
    readonly parser: Primitive
    readonly to: (result: unknown) => unknown
  }>
{}

/** @internal */
export interface TransformEither extends
  Op<"TransformEither", {
    readonly parser: Primitive
    readonly to: (result: unknown) => Either.Either<unknown, unknown>
  }>
{}

/** @internal */
export interface ZipLeft extends
  Op<"ZipLeft", {
    readonly left: Primitive
    readonly right: Primitive
  }>
{}

/** @internal */
export interface ZipRight extends
  Op<"ZipRight", {
    readonly left: Primitive
    readonly right: Primitive
  }>
{}

/** @internal */
export interface ZipWith extends
  Op<"ZipWith", {
    readonly left: Primitive
    readonly right: Primitive
    readonly zip: (left: unknown, right: unknown) => unknown
  }>
{}

/** @internal */
export const anything = <Input>(): Parser.Parser<Input, never, Input> => {
  const op = Object.create(proto)
  op._tag = "Passthrough"
  return op
}

/** @internal */
export const as = dual<
  <Result, Result2>(
    result: Result2
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Result2>,
  <Input, Error, Result, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    result: Result2
  ) => Parser.Parser<Input, Error, Result2>
>(2, (self, result) => {
  const op = Object.create(proto)
  op._tag = "Ignore"
  op.parser = self
  op.to = result
  return op
})

/** @internal */
export const asUnit = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, void> => as(self, void 0)

/** @internal */
export const atLeast = dual<
  (
    min: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    min: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(2, (self, min) => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.parser = self
  op.min = min
  op.max = Option.none()
  return op
})

/** @internal */
export const autoBacktracking = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Result> => setAutoBacktracking(self, true)

/** @internal */
export const backtrack = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Result> => {
  const op = Object.create(proto)
  op._tag = "Backtrack"
  op.parser = self
  return op
}

/** @internal */
export const between = dual<
  <Input2, Error2, Result2, Input3, Error3, Result3>(
    left: Parser.Parser<Input2, Error2, Result2>,
    right: Parser.Parser<Input3, Error3, Result3>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2 & Input3, Error | Error2 | Error3, Result>,
  <Input, Error, Result, Input2, Error2, Result2, Input3, Error3, Result3>(
    self: Parser.Parser<Input, Error, Result>,
    left: Parser.Parser<Input2, Error2, Result2>,
    right: Parser.Parser<Input3, Error3, Result3>
  ) => Parser.Parser<Input & Input2 & Input3, Error | Error2 | Error3, Result>
>(3, (self, left, right) => zipRight(left, zipLeft(self, right)))

/** @internal */
export const captureString = <Error, Result>(
  self: Parser.Parser<string, Error, Result>
): Parser.Parser<string, Error, string> => {
  const op = Object.create(proto)
  op._tag = "CaptureString"
  op.parser = self
  return op
}

/** @internal */
export const char = <Error = string>(char: string, error?: Error): Parser.Parser<string, Error, void> =>
  regexDiscard(_regex.charIn(char), error ?? (`expected '${char}'` as any))

/** @internal */
export const charIn = (chars: Iterable<string>): Parser.Parser<string, string, string> =>
  regexChar(_regex.charIn(chars), `not one of the expected characters (${Array.from(chars).join(", ")})`)

/**
 * Constructs a `Parser` that consumes a single character and succeeds with it
 * if it is **NOT** one of the specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charNotIn = (chars: Iterable<string>): Parser.Parser<string, string, string> =>
  regexChar(_regex.charNotIn(chars), `one of the unexpected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const exactly = dual<
  (
    times: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    times: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(2, (self, times) => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.parser = self
  op.min = times
  op.max = Option.some(times)
  return op
})

/** @internal */
export const fail = <Error>(error: Error): Parser.Parser<unknown, Error, never> => {
  const op = Object.create(proto)
  op._tag = "Fail"
  op.error = error
  return op
}

/** @internal */
export const filter = dual<
  <Result, Error2>(
    predicate: Predicate<Result>,
    error: Error2
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error | Error2, Result>,
  <Input, Error, Result, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    predicate: Predicate<Result>,
    error: Error2
  ) => Parser.Parser<Input, Error | Error2, Result>
>(3, (self, predicate, error) =>
  transformEither(self, (result) =>
    predicate(result)
      ? Either.right(result)
      : Either.left(error)))

/** @internal */
export const flatMap = dual<
  <Result, Input2, Error2, Result2>(
    f: (result: Result) => Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result2>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    f: (result: Result) => Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result2>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "FlatMap"
  op.parser = self
  op.f = f
  return op
})

/** @internal */
export const flatten = <Input, Error>(
  self: Parser.Parser<Input, Error, Chunk.Chunk<string>>
): Parser.Parser<Input, Error, string> => map(self, Chunk.join(""))

/** @internal */
export const manualBacktracking = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Result> => setAutoBacktracking(self, false)

/** @internal */
export const map = dual<
  <Result, Result2>(
    f: (result: Result) => Result2
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Result2>,
  <Input, Error, Result, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    f: (result: Result) => Result2
  ) => Parser.Parser<Input, Error, Result2>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "Transform"
  op.parser = self
  op.to = f
  return op
})

/** @internal */
export const mapError = dual<
  <Error, Error2>(
    f: (error: Error) => Error2
  ) => <Input, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error2, Result>,
  <Input, Error, Result, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    f: (error: Error) => Error2
  ) => Parser.Parser<Input, Error2, Result>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "MapError"
  op.parser = self
  op.mapError = parserError.map(f)
  return op
})

/** @internal */
export const named = dual<
  (
    name: string
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Result>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    name: string
  ) => Parser.Parser<Input, Error, Result>
>(2, (self, name) => {
  const op = Object.create(proto)
  op._tag = "Named"
  op.parser = self
  op.name = name
  return op
})

/** @internal */
export const not = dual<
  <Error2>(
    error: Error2
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error2, void>,
  <Input, Error, Result, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    error: Error2
  ) => Parser.Parser<Input, Error2, void>
>(2, (self, error) => {
  const op = Object.create(proto)
  op._tag = "Not"
  op.parser = self
  op.error = error
  return op
})

/** @internal */
export const notChar = <Error = string>(char: string, error?: Error): Parser.Parser<string, Error, string> =>
  regexChar(_regex.charNotIn([char]), error ?? (`cannot be '${char}'` as any))

/** @internal */
export const optional = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Option.Option<Result>> => {
  const op = Object.create(proto)
  op._tag = "Optional"
  op.parser = self
  return op
}

/** @internal */
export const orElse = dual<
  <Input2, Error2, Result2>(
    that: LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result | Result2>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result | Result2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "OrElse"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const orElseEither = dual<
  <Input2, Error2, Result2>(
    that: LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Either.Either<Result, Result2>>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => Parser.Parser<Input & Input2, Error | Error2, Either.Either<Result, Result2>>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "OrElseEither"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const regex = <Error>(regex: Regex.Regex, error: Error): Parser.Parser<string, Error, Chunk.Chunk<string>> => {
  const op = Object.create(proto)
  op._tag = "ParseRegex"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const regexChar = <Error>(regex: Regex.Regex, error: Error): Parser.Parser<unknown, Error, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const regexDiscard = <Error>(regex: Regex.Regex, error: Error): Parser.Parser<string, Error, void> => {
  const op = Object.create(proto)
  op._tag = "SkipRegex"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const repeat = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Chunk.Chunk<Result>> => atLeast(self, 0)

/** @internal */
export const repeat1 = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Chunk.NonEmptyChunk<Result>> =>
  atLeast(self, 1) as Parser.Parser<Input, Error, Chunk.NonEmptyChunk<Result>>

/** @internal */
export const repeatWithSeparator = dual<
  <Input2, Error2>(
    separator: Parser.Parser<Input2, Error2, void>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.Chunk<Result>>,
  <Input, Error, Result, Input2, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    separator: Parser.Parser<Input2, Error2, void>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.Chunk<Result>>
>(2, (self, separator) =>
  pipe(
    zip(self, repeat(zipRight(separator, self))),
    optional,
    map(Option.match(
      () => Chunk.empty(),
      ([head, tail]) => Chunk.prepend(tail, head)
    ))
  ))

/** @internal */
export const repeatWithSeparator1 = dual<
  <Input2, Error2>(
    separator: Parser.Parser<Input2, Error2, void>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.NonEmptyChunk<Result>>,
  <Input, Error, Result, Input2, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    separator: Parser.Parser<Input2, Error2, void>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.NonEmptyChunk<Result>>
>(2, <Input, Error, Result, Input2, Error2>(
  self: Parser.Parser<Input, Error, Result>,
  separator: Parser.Parser<Input2, Error2, void>
) =>
  pipe(
    zip(self, repeat(zipRight(separator, self))),
    map(([head, tail]) => Chunk.prepend(tail, head) as Chunk.NonEmptyChunk<Result>)
  ))

/** @internal */
export const setAutoBacktracking = dual<
  (
    enabled: boolean
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Result>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    enabled: boolean
  ) => Parser.Parser<Input, Error, Result>
>(2, (self, enabled) => {
  const op = Object.create(proto)
  op._tag = "SetAutoBacktrack"
  op.parser = self
  op.enabled = enabled
  return op
})

/** @internal */
export const string = <Result>(str: string, result: Result): Parser.Parser<string, string, Result> =>
  as(regexDiscard(_regex.string(str), `not '${str}'`), result)

/** @internal */
export const succeed = <Result>(result: Result): Parser.Parser<unknown, never, Result> => {
  const op = Object.create(proto)
  op._tag = "Succeed"
  op.result = result
  return op
}

/** @internal */
export const surroundedBy = dual<
  <Input2, Error2, Result2>(
    other: Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    other: Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>
>(2, (self, other) => zipRight(other, zipLeft(self, other)))

/** @internal */
export const transformEither = dual<
  <Result, Error2, Result2>(
    f: (result: Result) => Either.Either<Error2, Result2>
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error2, Result2>,
  <Input, Error, Result, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    f: (result: Result) => Either.Either<Error2, Result2>
  ) => Parser.Parser<Input, Error2, Result2>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "TransformEither"
  op.printer = self
  op.to = f
  return op
})

/** @internal */
export const transformOption = dual<
  <Result, Result2>(
    pf: (result: Result) => Option.Option<Result2>
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Option.Option<Error>, Result2>,
  <Input, Error, Result, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    pf: (result: Result) => Option.Option<Result2>
  ) => Parser.Parser<Input, Option.Option<Error>, Result2>
>(2, (self, pf) => transformEither(self, (value) => Either.fromOption(pf(value), () => Option.none())))

/** @internal */
export const unsafeRegex = (regex: Regex.Regex): Parser.Parser<string, never, Chunk.Chunk<string>> => {
  const op = Object.create(proto)
  op._tag = "ParseRegex"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const unsafeRegexChar = (regex: Regex.Regex): Parser.Parser<string, never, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const unsafeRegexDiscard = (regex: Regex.Regex): Parser.Parser<string, never, void> => {
  const op = Object.create(proto)
  op._tag = "SkipRegex"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const zip = dual<
  <Input2, Error2, Result2>(
    that: Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, readonly [Result, Result2]>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, readonly [Result, Result2]>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "Zip"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const zipLeft = dual<
  <Input2, Error2, Result2>(
    that: Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "ZipLeft"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const zipRight = dual<
  <Input2, Error2, Result2>(
    that: Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result2>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "ZipRight"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const alphaNumeric: Parser.Parser<string, string, string> = regexChar(_regex.anyAlphaNumeric, `not alphanumeric`)

/** @internal */
export const anyChar: Parser.Parser<string, never, string> = unsafeRegexChar(_regex.anyChar)

/** @internal */
export const anyString: Parser.Parser<string, never, string> = captureString(
  unsafeRegexDiscard(_regex.atLeast(_regex.anyChar, 0))
)

/** @internal */
export const digit: Parser.Parser<string, string, string> = regexChar(_regex.anyDigit, `not a digit`)

/** @internal */
export const end: Parser.Parser<unknown, never, void> = (() => {
  const op = Object.create(proto)
  op._tag = "End"
  return op
})()

/** @internal */
export const ignoreRest: Parser.Parser<string, never, void> = unsafeRegexDiscard(_regex.atLeast(_regex.anyChar, 0))

/** @internal */
export const index: Parser.Parser<unknown, never, number> = (() => {
  const op = Object.create(proto)
  op._tag = "Index"
  return op
})()

/** @internal */
export const letter: Parser.Parser<string, string, string> = regexChar(_regex.anyLetter, `not a letter`)

/** @internal */
export const unit = (): Parser.Parser<unknown, never, void> => succeed(void 0)

/** @internal */
export const whitespace: Parser.Parser<string, string, string> = regexChar(_regex.whitespace, `not a whitespace`)

/**
 * The state of the recursive parser implementation.
 */
abstract class ParserState<Input> {
  abstract readonly length: number
  abstract at(position: number): Input
  abstract sliceToChunk(position: number, until: number): Chunk.Chunk<Input>
  abstract sliceToString(position: number, until: number): string
  abstract regex(compiledRegex: Regex.Regex.Compiled): number

  public position = 0
  public discard = false
  public nameStack = List.empty<string>()
  public error: ParserError.ParserError<unknown> | undefined = undefined

  charAt(position: number): string {
    return this.at(position) as string
  }

  pushName(name: string): void {
    this.nameStack = List.prepend(this.nameStack, name)
  }

  popName(): void {
    if (List.isCons(this.nameStack)) {
      this.nameStack = this.nameStack.tail
    }
  }
}

class StringParserState extends ParserState<string> {
  readonly length: number
  constructor(readonly source: string) {
    super()
    this.length = source.length
  }
  at(position: number): string {
    return this.source[position]
  }
  sliceToChunk(position: number, until: number): Chunk.Chunk<string> {
    return Chunk.unsafeFromArray(this.source.slice(position, until).split(""))
  }
  sliceToString(position: number, until: number): string {
    return this.source.slice(position, until)
  }
  regex(compiledRegex: Regex.Regex.Compiled): number {
    return compiledRegex.test(this.position, this.source)
  }
}

export const parse = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>,
  input: string
): Either.Either<ParserError.ParserError<Error>, Result> => {
  const state = new StringParserState(input)
  const result = parseRecursive(optimize(self) as Primitive, state)
  if (state.error !== undefined) {
    return Either.left(state.error as ParserError.ParserError<Error>)
  }
  return Either.right(result as Result)
}

const parseRecursive: {
  <Input>(state: ParserState<Input>): (self: Primitive) => unknown | undefined
  <Input>(self: Primitive, state: ParserState<Input>): unknown | undefined
} = dual<
  <Input>(state: ParserState<Input>) => (self: Primitive) => unknown | undefined,
  <Input>(self: Primitive, state: ParserState<Input>) => unknown | undefined
>(2, (self, state) => {
  switch (self._tag) {
    case "Backtrack": {
      const position = state.position
      const result = parseRecursive(self.parser, state)
      if (state.error !== undefined) {
        state.position = position
      }
      return result
    }
    case "CaptureString": {
      const discard = state.discard
      const startPosition = state.position
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      if (!discard && state.error === undefined) {
        const endPosition = state.position
        return state.sliceToString(startPosition, endPosition)
      }
      return undefined
    }
    case "End": {
      if (state.position < state.length) {
        state.error = parserError.notConsumedAll(Option.none())
      }
      return undefined
    }
    case "Fail": {
      state.error = parserError.failure(state.nameStack, state.position, self.error)
      return undefined
    }
    case "Failed": {
      state.error = self.error
      return undefined
    }
    case "FlatMap": {
      const discard = state.discard
      state.discard = false
      const result = parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        const next = self.f(result)
        return parseRecursive(next, state)
      }
      return undefined
    }
    case "Ignore": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      return self.to
    }
    case "Index": {
      return state.position
    }
    case "MapError": {
      const result = parseRecursive(self.parser, state)
      if (state.error !== undefined) {
        state.error = self.mapError(state.error)
      }
      return result
    }
    case "Named": {
      state.pushName(self.name)
      const result = parseRecursive(self.parser, state)
      state.popName()
      return result
    }
    case "Not": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        state.error = parserError.failure(state.nameStack, state.position, self.error)
      } else {
        state.error = undefined
      }
      return undefined
    }
    case "Optional": {
      const startPosition = state.position
      const result = parseRecursive(self.parser, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return Option.some(result)
        }
        return undefined
      }
      if (state.position !== startPosition) {
        return undefined
      }
      state.error = undefined
      return Option.none()
    }
    case "OrElse": {
      const startPosition = state.position
      const leftResult = parseRecursive(self.left, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return Either.left(leftResult)
        }
        return undefined
      }
      if (state.position === startPosition) {
        const leftFailure = state.error
        state.error = undefined
        const rightResult = parseRecursive(self.right(), state)
        if (state.error === undefined) {
          if (!state.discard) {
            return Either.right(rightResult)
          }
          return undefined
        }
        state.error = parserError.addFailedBranch(leftFailure, state.error)
        return undefined
      }
      return undefined
    }
    case "OrElseEither": {
      const startPosition = state.position
      const leftResult = parseRecursive(self.left, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return Either.left(leftResult)
        }
        return undefined
      }
      if (state.position === startPosition) {
        const leftFailure = state.error
        state.error = undefined
        const rightResult = parseRecursive(self.right(), state)
        if (state.error === undefined) {
          if (!state.discard) {
            return Either.right(rightResult)
          }
          return undefined
        }
        state.error = parserError.addFailedBranch(leftFailure, state.error)
        return undefined
      }
      return undefined
    }
    case "ParseRegex": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
        return undefined
      }
      if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
        return undefined
      }
      state.position = result
      if (!state.discard) {
        return state.sliceToChunk(position, result)
      }
      return undefined
    }
    case "ParseRegexLastChar": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
        return undefined
      }
      if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
        return undefined
      }
      state.position = result
      if (!state.discard) {
        return state.charAt(result - 1)
      }
      return undefined
    }
    case "Passthrough": {
      if (state.position < state.length) {
        const result = state.at(state.position)
        state.position = state.position + 1
        return result
      }
      state.error = parserError.unexpectedEndOfInput
      return undefined
    }
    case "Repeat": {
      const maxCount = Option.getOrElse(self.max, () => Infinity)
      const discard = state.discard
      const builder: Array<unknown> | undefined = discard ? undefined : []
      let count = 0
      let lastItemStart = -1
      const sourceLength = state.length
      while (state.error === undefined && count < maxCount && lastItemStart < sourceLength) {
        lastItemStart = state.position
        const item = parseRecursive(self.parser, state)
        if (state.error === undefined) {
          count = count + 1
          if (!discard) {
            builder!.push(item)
          }
        }
      }
      if (count < self.min && state.error === undefined) {
        state.error = parserError.unexpectedEndOfInput
      } else {
        if (count >= self.min) {
          state.error = undefined
        }
      }
      if (!discard && state.error === undefined) {
        return Chunk.unsafeFromArray(builder!)
      }
      return undefined
    }
    case "SetAutoBacktrack": {
      // optimize will always remove this node
      return undefined
    }
    case "SkipRegex": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
      } else if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
      } else {
        state.position = result
      }
      return undefined
    }
    case "Succeed": {
      return self.result
    }
    case "Suspend": {
      return parseRecursive(self.parser(), state)
    }
    case "Transform": {
      const result = parseRecursive(self.parser, state)
      if (!state.discard && state.error === undefined) {
        return self.to(result)
      }
      return undefined
    }
    case "TransformEither": {
      // NOTE: cannot skip in discard mode, we need to detect failures
      const discard = state.discard
      state.discard = false
      const innerResult = parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        const result = self.to(innerResult)
        return Either.getOrElse(result, (error) => {
          state.error = parserError.failure(state.nameStack, state.position, error)
          return undefined
        })
      }
      return undefined
    }
    case "ZipLeft": {
      const left = parseRecursive(self.left, state)
      if (state.error === undefined) {
        const discard = state.discard
        state.discard = true
        parseRecursive(self.right, state)
        state.discard = discard
        if (state.error === undefined) {
          return left
        }
      }
      return undefined
    }
    case "ZipRight": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.left, state)
      state.discard = discard
      if (state.error === undefined) {
        const right = parseRecursive(self.right, state)
        if (state.error === undefined) {
          return right
        }
      }
      return undefined
    }
    case "ZipWith": {
      const left = parseRecursive(self.left, state)
      if (state.error === undefined) {
        const right = parseRecursive(self.right, state)
        if (!state.discard && state.error === undefined) {
          return self.zip(left, right)
        }
      }
      return undefined
    }
  }
})

const getParserError = (
  position: number,
  nameStack: List.List<string>,
  onFailure: Option.Option<unknown>
): ParserError.ParserError<unknown> =>
  Option.match(
    onFailure,
    () => parserError.unknownFailure(nameStack, position),
    (error) => parserError.failure(nameStack, position, error)
  )

interface OptimizerState {
  optimized: Map<Primitive, Primitive>
  visited: Map<Primitive, number>
  autoBacktrack: boolean
}

const optimize = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Result> => {
  const optimizedNodes: OptimizerState = {
    optimized: new Map(),
    visited: new Map(),
    autoBacktrack: true // Default auto-backtrack state
  }
  return optimizeNode(self as Primitive, optimizedNodes)
}

const optimizeNode = (
  self: Primitive,
  state: OptimizerState
): Primitive => {
  const alreadyOptimized = state.optimized.get(self)
  if (alreadyOptimized !== undefined) {
    return alreadyOptimized
  }
  const visited = state.visited.get(self)
  state.visited.set(self, visited === undefined ? 1 : visited + 1)
  switch (self._tag) {
    case "Backtrack": {
      const inner = optimizeNode(self.parser, state)
      if (needsBacktrack(inner)) {
        const op = Object.create(proto)
        op._tag = "Backtrack"
        op.parser = inner
        state.optimized.set(self, op)
        return op
      }
      state.optimized.set(self, inner)
      return inner
    }
    case "CaptureString": {
      const inner = optimizeNode(self.parser, state)
      const op = Object.create(proto)
      op._tag = "CaptureString"
      if (inner._tag === "CaptureString" || inner._tag === "Ignore" || inner._tag === "Transform") {
        op.parser = inner.parser
      } else if (inner._tag === "ParseRegex" || inner._tag === "ParseRegexLastChar") {
        const innerOp = Object.create(proto)
        innerOp._tag = "SkipRegex"
        innerOp.regex = inner.regex
        innerOp.onFailure = inner.onFailure
        op.parser = innerOp
      } else {
        op.parser = inner
      }
      state.optimized.set(self, op)
      return op
    }
    case "FlatMap": {
      const op = Object.create(proto)
      op._tag = "FlatMap"
      op.parser = optimizeNode(self.parser, state)
      op.f = (result: unknown) => optimize(self.f(result))
      state.optimized.set(self, op)
      return op
    }
    case "Ignore": {
      const inner = optimizeNode(self.parser, state)
      const op = Object.create(proto)
      if (inner._tag === "TransformEither") {
        op._tag = "TransformEither"
        op.parser = inner.parser
        op.to = (result: unknown) => Either.map(inner.to(result), () => self.to)
      } else if (inner._tag === "CaptureString" || inner._tag === "Ignore" || inner._tag === "Transform") {
        op._tag = "Ignore"
        op.parser = inner.parser
        op.to = self.to
      } else if (inner._tag === "ParseRegex" || inner._tag === "ParseRegexLastChar") {
        const innerOp = Object.create(proto)
        innerOp._tag = "SkipRegex"
        innerOp.regex = inner.regex
        innerOp.onFailure = inner.onFailure
        op._tag = "Ignore"
        op.parser = innerOp
        op.to = self.to
      } else {
        op._tag = "Ignore"
        op.parser = inner
        op.to = self.to
      }
      state.optimized.set(self, op)
      return op
    }
    case "MapError": {
      const op = Object.create(proto)
      op._tag = "MapError"
      op.parser = optimizeNode(self.parser, state)
      op.mapError = self.mapError
      state.optimized.set(self, op)
      return op
    }
    case "Named": {
      const op = Object.create(proto)
      op._tag = "Named"
      op.parser = optimizeNode(self.parser, state)
      op.name = self.name
      state.optimized.set(self, op)
      return op
    }
    case "Not": {
      const op = Object.create(proto)
      op._tag = "Not"
      op.parser = optimizeNode(self.parser, state)
      op.error = self.error
      state.optimized.set(self, op)
      return op
    }
    case "Optional": {
      const inner = (state.autoBacktrack ? backtrack(self.parser) : self.parser) as Primitive
      const op = Object.create(proto)
      op._tag = "Optional"
      op.parser = optimizeNode(inner, state)
      state.optimized.set(self, op)
      return op
    }
    case "OrElse": {
      const innerLeft = (state.autoBacktrack ? backtrack(self.left) : self.left) as Primitive
      const optimizedLeft = optimizeNode(innerLeft, state)
      const optimizedRight = optimizeNode(self.right(), state)
      const op = Object.create(proto)
      if (optimizedLeft._tag === "CaptureString" && optimizedRight._tag === "CaptureString") {
        if (optimizedLeft.parser._tag === "SkipRegex" && optimizedRight.parser._tag === "SkipRegex") {
          const skipRegexLeft = optimizedLeft.parser
          const skipRegexRight = optimizedRight.parser
          const innerOp = Object.create(proto)
          innerOp._tag = "SkipRegex"
          innerOp.regex = _regex.or(skipRegexLeft.regex, skipRegexRight.regex)
          innerOp.onFailure = Option.orElse(skipRegexRight.onFailure, () => skipRegexLeft.onFailure)
          op._tag = "CaptureString"
          op.parser = innerOp
        }
      } else {
        op._tag = "OrElse"
        op.left = optimizedLeft
        op.right = optimizedRight
      }
      state.optimized.set(self, op)
      return op
    }
    case "OrElseEither": {
      const innerLeft = (state.autoBacktrack ? backtrack(self.left) : self.left) as Primitive
      const optimizedLeft = optimizeNode(innerLeft, state)
      const optimizedRight = optimizeNode(self.right(), state)
      const op = Object.create(proto)
      op._tag = "OrElseEither"
      op.left = optimizedLeft
      op.right = optimizedRight
      state.optimized.set(self, op)
      return op
    }
    case "Repeat": {
      const inner = (state.autoBacktrack ? backtrack(self.parser) : self.parser) as Primitive
      const optimizedInner = optimizeNode(inner, state)
      const op = Object.create(proto)
      if (optimizedInner._tag === "ParseRegexLastChar") {
        if (Option.isSome(self.max)) {
          op._tag = "ParseRegex"
          op.regex = _regex.between(optimizedInner.regex, self.min, self.max.value)
          op.onFailure = optimizedInner.onFailure
        } else {
          op._tag = "ParseRegex"
          op.regex = _regex.atLeast(optimizedInner.regex, self.min)
          op.onFailure = optimizedInner.onFailure
        }
        state.optimized.set(self, op)
        return op
      }
      op._tag = "Repeat"
      op.parser = optimizedInner
      op.min = self.min
      op.max = self.max
      state.optimized.set(self, op)
      return op
    }
    case "SetAutoBacktrack": {
      const op = optimizeNode(self.parser, { ...state, autoBacktrack: self.enabled })
      state.optimized.set(self, op)
      return op
    }
    case "Suspend": {
      const visited = state.visited.get(self)
      if (visited !== undefined && visited > 1) {
        const op = Object.create(proto)
        op._tag = "Suspend"
        op.parser = () => state.optimized.get(self)
        state.optimized.set(self, op)
        return op
      } else {
        const op = optimizeNode(self.parser(), state)
        state.optimized.set(self, op)
        return op
      }
    }
    case "Transform": {
      const inner = optimizeNode(self.parser, state)
      const op = Object.create(proto)
      if (inner._tag === "TransformEither") {
        op._tag = "TransformEither"
        op.parser = inner.parser
        op.to = (result: unknown) => Either.map(inner.to(result), self.to)
      } else if (inner._tag === "Transform") {
        op._tag = "Transform"
        op.parser = inner.parser
        op.to = (result: unknown) => self.to(inner.to(result))
      } else {
        op._tag = "Transform"
        op.parser = inner
        op.to = self.to
      }
      state.optimized.set(self, op)
      return op
    }
    case "TransformEither": {
      const inner = optimizeNode(self.parser, state)
      const op = Object.create(proto)
      if (inner._tag === "TransformEither") {
        op._tag = "TransformEither"
        op.parser = inner.parser
        op.to = (result: unknown) => Either.flatMap(inner.to(result), self.to)
      } else if (inner._tag === "Transform") {
        op._tag = "TransformEither"
        op.parser = inner.parser
        op.to = (result: unknown) => self.to(inner.to(result))
      } else {
        op._tag = "TransformEither"
        op.parser = inner
        op.to = self.to
      }
      state.optimized.set(self, op)
      return op
    }
    case "ZipLeft": {
      const op = Object.create(proto)
      op._tag = "ZipLeft"
      op.left = optimizeNode(self.left, state)
      op.right = optimizeNode(self.right, state)
      state.optimized.set(self, op)
      return op
    }
    case "ZipRight": {
      const op = Object.create(proto)
      op._tag = "ZipRight"
      op.left = optimizeNode(self.left, state)
      op.right = optimizeNode(self.right, state)
      state.optimized.set(self, op)
      return op
    }
    case "ZipWith": {
      const op = Object.create(proto)
      op._tag = "ZipWith"
      op.left = optimizeNode(self.left, state)
      op.right = optimizeNode(self.right, state)
      op.zip = self.zip
      state.optimized.set(self, op)
      return op
    }
    default: {
      return self
    }
  }
}

const needsBacktrack = (self: Primitive): boolean => {
  switch (self._tag) {
    case "CaptureString":
    case "Ignore":
    case "Optional":
    case "MapError":
    case "Named":
    case "Not":
    case "SetAutoBacktrack":
    case "Transform":
    case "TransformEither": {
      return needsBacktrack(self.parser)
    }
    case "OrElse":
    case "OrElseEither": {
      return needsBacktrack(self.left) || needsBacktrack(self.right())
    }
    case "Backtrack":
    case "End":
    case "Fail":
    case "Failed":
    case "Index":
    case "ParseRegex":
    case "ParseRegexLastChar":
    case "Passthrough":
    case "SkipRegex":
    case "Succeed": {
      return false
    }
    case "FlatMap":
    case "Repeat":
    case "Suspend":
    case "ZipLeft":
    case "ZipRight":
    case "ZipWith": {
      return true
    }
  }
}
