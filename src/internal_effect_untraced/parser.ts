import type * as Parser from "@effect/parser/Parser"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Regex from "@effect/parser/Regex"
import * as Chunk from "effect/Chunk"
import * as Either from "effect/Either"
import type * as Function from "effect/Function"
import { dual, pipe } from "effect/Function"
import * as Option from "effect/Option"
import type * as Predicate from "effect/Predicate"
import * as recursive from "../internal_effect_untraced/parser/recursive"
import * as stackSafe from "../internal_effect_untraced/parser/stack-safe"
import * as parserError from "../internal_effect_untraced/parserError"
import * as _regex from "../internal_effect_untraced/regex"

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
    readonly right: Function.LazyArg<Primitive>
  }>
{}

/** @internal */
export interface OrElseEither extends
  Op<"OrElseEither", {
    readonly left: Primitive
    readonly right: Function.LazyArg<Primitive>
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
    readonly min: Option.Option<number>
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
    readonly parser: Function.LazyArg<Primitive>
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
export const regexChar = <Error>(regex: Regex.Regex, error: Error): Parser.Parser<unknown, Error, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const alphaNumeric: Parser.Parser<string, string, string> = regexChar(_regex.anyAlphaNumeric, `not alphanumeric`)

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
export const unsafeRegexChar = (regex: Regex.Regex): Parser.Parser<string, never, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const anyChar: Parser.Parser<string, never, string> = unsafeRegexChar(_regex.anyChar)

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
export const unsafeRegexDiscard = (regex: Regex.Regex): Parser.Parser<string, never, void> => {
  const op = Object.create(proto)
  op._tag = "SkipRegex"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const anyString: Parser.Parser<string, never, string> = captureString(
  unsafeRegexDiscard(_regex.repeatMin(_regex.anyChar, 0))
)

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
export const char = <Error = string>(char: string, error?: Error): Parser.Parser<string, Error, void> =>
  regexDiscard(_regex.charIn(char), error ?? (`expected '${char}'` as any))

/** @internal */
export const charIn = (chars: Iterable<string>): Parser.Parser<string, string, string> =>
  regexChar(_regex.charIn(chars), `not one of the expected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const charNot = <Error = string>(char: string, error?: Error): Parser.Parser<string, Error, string> =>
  regexChar(_regex.charNotIn([char]), error ?? (`unexpected '${char}'` as any))

/** @internal */
export const charNotIn = (chars: Iterable<string>): Parser.Parser<string, string, string> =>
  regexChar(_regex.charNotIn(chars), `one of the unexpected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const digit: Parser.Parser<string, string, string> = regexChar(_regex.anyDigit, `not a digit`)

/** @internal */
export const end: Parser.Parser<unknown, never, void> = (() => {
  const op = Object.create(proto)
  op._tag = "End"
  return op
})()

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
    predicate: Predicate.Predicate<Result>,
    error: Error2
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error | Error2, Result>,
  <Input, Error, Result, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    predicate: Predicate.Predicate<Result>,
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
export const flattenNonEmpty = <Input, Error>(
  self: Parser.Parser<Input, Error, Chunk.NonEmptyChunk<string>>
): Parser.Parser<Input, Error, string> => map(self, Chunk.join(""))

/** @internal */
export const ignoreRest: Parser.Parser<string, never, void> = unsafeRegexDiscard(_regex.repeatMin(_regex.anyChar, 0))

/** @internal */
export const index: Parser.Parser<unknown, never, number> = (() => {
  const op = Object.create(proto)
  op._tag = "Index"
  return op
})()

/** @internal */
export const letter: Parser.Parser<string, string, string> = regexChar(_regex.anyLetter, `not a letter`)

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
    that: Function.LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result | Result2>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: Function.LazyArg<Parser.Parser<Input2, Error2, Result2>>
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
    that: Function.LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Either.Either<Result2, Result>>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    that: Function.LazyArg<Parser.Parser<Input2, Error2, Result2>>
  ) => Parser.Parser<Input & Input2, Error | Error2, Either.Either<Result2, Result>>
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
export const regexDiscard = <Error>(regex: Regex.Regex, error: Error): Parser.Parser<string, Error, void> => {
  const op = Object.create(proto)
  op._tag = "SkipRegex"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
const repeat = dual<
  (
    min: Option.Option<number>,
    max: Option.Option<number>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    min: Option.Option<number>,
    max: Option.Option<number>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(3, (self, min, max) => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.parser = self
  op.min = min
  op.max = max
  return op
})

/** @internal */
export const repeatBetween = dual<
  (
    min: number,
    max: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    min: number,
    max: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(3, (self, min, max) => repeat(self, Option.some(min), Option.some(max)))

/** @internal */
export const repeatExactly = dual<
  (
    times: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    times: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(2, (self, times) => repeatBetween(self, times, times))

/** @internal */
export const repeatMin = dual<
  (
    min: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    min: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(2, (self, min) => repeat(self, Option.some(min), Option.none()))

/** @internal */
export const repeatMin0 = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Chunk.Chunk<Result>> => repeatMin(self, 0)

/** @internal */
export const repeatMin1 = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Chunk.NonEmptyChunk<Result>> =>
  repeatMin(self, 1) as Parser.Parser<Input, Error, Chunk.NonEmptyChunk<Result>>

/** @internal */
export const repeatMax = dual<
  (
    max: number
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    max: number
  ) => Parser.Parser<Input, Error, Chunk.Chunk<Result>>
>(2, (self, max) => repeat(self, Option.none(), Option.some(max)))

/** @internal */
export const repeatUntil = dual<
  <Input2, Error2>(
    stopCondition: Parser.Parser<Input2, Error2, void>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.Chunk<Result>>,
  <Input, Error, Result, Input2, Error2>(
    self: Parser.Parser<Input, Error, Result>,
    stopCondition: Parser.Parser<Input2, Error2, void>
  ) => Parser.Parser<Input & Input2, Error | Error2, Chunk.Chunk<Result>>
>(2, <Input, Error, Result, Input2, Error2>(
  self: Parser.Parser<Input, Error, Result>,
  stopCondition: Parser.Parser<Input2, Error2, void>
) => manualBacktracking(repeatMin0(zipRight(not(stopCondition, void 0 as Error2), self))))

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
    zip(self, repeatMin0(zipRight(separator, self))),
    optional,
    map(Option.match({
      onNone: () => Chunk.empty(),
      onSome: ([head, tail]) => Chunk.prepend(tail, head)
    }))
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
    zip(self, repeatMin0(zipRight(separator, self))),
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
export const suspend = <Input, Error, Result>(
  parser: Function.LazyArg<Parser.Parser<Input, Error, Result>>
): Parser.Parser<Input, Error, Result> => {
  const op = Object.create(proto)
  op._tag = "Suspend"
  op.parser = parser
  return op
}
/** @internal */
export const transformEither = dual<
  <Result, Error2, Result2>(
    f: (result: Result) => Either.Either<Result2, Error2>
  ) => <Input, Error>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input, Error2, Result2>,
  <Input, Error, Result, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    f: (result: Result) => Either.Either<Result2, Error2>
  ) => Parser.Parser<Input, Error2, Result2>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "TransformEither"
  op.parser = self
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
>(2, (self, pf) =>
  transformEither(self, (value) =>
    Option.match(pf(value), {
      onNone: () => Either.left(Option.none()),
      onSome: Either.right
    })))

/** @internal */
export const unit = (): Parser.Parser<unknown, never, void> => succeed(void 0)

/** @internal */
export const unsafeRegex = (regex: Regex.Regex): Parser.Parser<string, never, Chunk.Chunk<string>> => {
  const op = Object.create(proto)
  op._tag = "ParseRegex"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const whitespace: Parser.Parser<string, string, string> = regexChar(_regex.whitespace, `not a whitespace`)

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
>(2, (self, that) => zipWith(self, that, (left, right) => [left, right]))

/** @internal */
export const zipBetween = dual<
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
export const zipSurrounded = dual<
  <Input2, Error2, Result2>(
    other: Parser.Parser<Input2, Error2, Result2>
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>,
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser.Parser<Input, Error, Result>,
    other: Parser.Parser<Input2, Error2, Result2>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result>
>(2, (self, other) => zipBetween(self, other, other))

/** @internal */
export const zipWith = dual<
  <Input2, Error2, Result2, Result, Result3>(
    that: Parser.Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Parser.Parser<Input & Input2, Error | Error2, Result3>,
  <Input, Error, Result, Input2, Error2, Result2, Result3>(
    self: Parser.Parser<Input, Error, Result>,
    that: Parser.Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ) => Parser.Parser<Input & Input2, Error | Error2, Result3>
>(3, (self, that, zip) => {
  const op = Object.create(proto)
  op._tag = "ZipWith"
  op.left = self
  op.right = that
  op.zip = zip
  return op
})

/** @internal */
class StringParserState extends recursive.ParserState<string> {
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

/** @internal */
export const parseStringWith = dual<
  (
    input: string,
    implementation: Parser.Parser.Implementation
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Either.Either<Result, ParserError.ParserError<Error>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    input: string,
    implementation: Parser.Parser.Implementation
  ) => Either.Either<Result, ParserError.ParserError<Error>>
>(3, <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>,
  input: string,
  implementation: Parser.Parser.Implementation
) => {
  switch (implementation) {
    case "stack-safe": {
      return stackSafe.charParserExecutor(
        stackSafe.compile(optimize(self) as Primitive),
        input
      ) as Either.Either<Result, ParserError.ParserError<Error>>
    }
    case "recursive": {
      const state = new StringParserState(input)
      const result = recursive.parseRecursive(optimize(self) as Primitive, state)
      if (state.error !== undefined) {
        return Either.left(state.error as ParserError.ParserError<Error>)
      }
      return Either.right(result as Result)
    }
  }
})

/** @internal */
export const parseString = dual<
  (
    input: string
  ) => <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>
  ) => Either.Either<Result, ParserError.ParserError<Error>>,
  <Input, Error, Result>(
    self: Parser.Parser<Input, Error, Result>,
    input: string
  ) => Either.Either<Result, ParserError.ParserError<Error>>
>(2, (self, input) => parseStringWith(self, input, "recursive"))

// -----------------------------------------------------------------------------
// Optimization
// -----------------------------------------------------------------------------

interface OptimizerState {
  optimized: Map<Primitive, Primitive>
  visited: Map<Primitive, number>
  autoBacktrack: boolean
}

const optimize = <Input, Error, Result>(
  self: Parser.Parser<Input, Error, Result>
): Parser.Parser<Input, Error, Result> => {
  const state: OptimizerState = {
    optimized: new Map(),
    visited: new Map(),
    autoBacktrack: true // Default auto-backtrack state
  }
  return optimizeNode(self as Primitive, state)
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
        op.right = () => optimizedRight
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
      op.right = () => optimizedRight
      state.optimized.set(self, op)
      return op
    }
    case "Repeat": {
      const inner = (state.autoBacktrack ? backtrack(self.parser) : self.parser) as Primitive
      const optimizedInner = optimizeNode(inner, state)
      const op = Object.create(proto)
      if (optimizedInner._tag === "ParseRegexLastChar") {
        op._tag = "ParseRegex"
        op.regex = _regex.repeat(optimizedInner.regex, self.min, self.max)
        op.onFailure = optimizedInner.onFailure
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
        op.to = (result: unknown) => Either.map(inner.to(result), self.to)
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
    case "Transform": {
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
    case "TransformEither":
    case "ZipLeft":
    case "ZipRight":
    case "ZipWith": {
      return true
    }
  }
}
