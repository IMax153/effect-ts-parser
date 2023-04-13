import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import * as Equal from "@effect/data/Equal"
import type { LazyArg } from "@effect/data/Function"
import { constVoid, dual, pipe } from "@effect/data/Function"
import * as List from "@effect/data/List"
import * as Option from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import * as chunkTarget from "@effect/parser/internal_effect_untraced/chunkTarget"
import * as parserError from "@effect/parser/internal_effect_untraced/parserError"
import * as _regex from "@effect/parser/internal_effect_untraced/regex"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Printer from "@effect/parser/Printer"
import type * as Regex from "@effect/parser/Regex"
import type * as Target from "@effect/parser/Target"

/** @internal */
const PrinterSymbolKey = "@effect/parser/Printer"

/** @internal */
export const PrinterTypeId: Printer.PrinterTypeId = Symbol.for(
  PrinterSymbolKey
) as Printer.PrinterTypeId

/** @internal */
const proto = {
  [PrinterTypeId]: {
    _Input: (_: unknown) => _,
    _Error: (_: never) => _,
    _Output: (_: never) => _
  }
}

/** @internal */
export type Op<Tag extends string, Body = {}> = Printer.Printer<unknown, never, never> & Body & {
  readonly _tag: Tag
}

/** @internal */
export type Primitive =
  | ContramapEither
  | Fail
  | Failed
  | FlatMapInput
  | Ignore
  | MapError
  | Optional
  | OrElse
  | OrElseEither
  | ParseRegex
  | ParseRegexLastChar
  | Passthrough
  | ProvideInput
  | Repeat
  | SkipRegex
  | Succeed
  | Suspend
  | Zip
  | ZipLeft
  | ZipRight

/** @internal */
export interface ContramapEither extends
  Op<"ContramapEither", {
    readonly printer: Primitive
    readonly from: (value: unknown) => Either.Either<unknown, unknown>
  }>
{}

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
export interface FlatMapInput extends
  Op<"FlatMapInput", {
    readonly f: (value: unknown) => Primitive
  }>
{}

/** @internal */
export interface Ignore extends
  Op<"Ignore", {
    readonly printer: Primitive
    readonly matches: unknown
    readonly from: unknown
  }>
{}

/** @internal */
export interface MapError extends
  Op<"MapError", {
    readonly printer: Primitive
    readonly map: (error: unknown) => unknown
  }>
{}

/** @internal */
export interface OrElse extends
  Op<"OrElse", {
    readonly left: Primitive
    readonly right: Primitive
  }>
{}

/** @internal */
export interface OrElseEither extends
  Op<"OrElseEither", {
    readonly left: Primitive
    readonly right: Primitive
  }>
{}

/** @internal */
export interface Optional extends
  Op<"Optional", {
    readonly printer: Primitive
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
export interface ProvideInput extends
  Op<"ProvideInput", {
    readonly printer: Primitive
    readonly input: unknown
  }>
{}

/** @internal */
export interface Repeat extends
  Op<"Repeat", {
    readonly printer: Primitive
    readonly min: number
    readonly max: Option.Option<number>
  }>
{}

/** @internal */
export interface SkipRegex extends
  Op<"SkipRegex", {
    readonly regex: Regex.Regex
    readonly printAs: Chunk.Chunk<string>
  }>
{}

/** @internal */
export interface Succeed extends
  Op<"Succeed", {
    readonly input: unknown
  }>
{}

/** @internal */
export interface Suspend extends
  Op<"Suspend", {
    readonly printer: LazyArg<Primitive>
  }>
{}

/** @internal */
export interface Zip extends
  Op<"Zip", {
    readonly left: Primitive
    readonly right: Primitive
    readonly unzip: (input: unknown) => readonly [unknown, unknown]
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
export const anything = <Input>(): Printer.Printer<Input, never, Input> => {
  const op = Object.create(proto)
  op._tag = "Passthrough"
  return op
}

/** @internal */
export const asPrinted = dual<
  <Input2, Input>(
    matches: Input2,
    from: Input
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input2, Error, Output>,
  <Input, Error, Output, Input2>(
    self: Printer.Printer<Input, Error, Output>,
    matches: Input2,
    from: Input
  ) => Printer.Printer<Input2, Error, Output>
>(3, (self, matches, from) => {
  const op = Object.create(proto)
  op._tag = "Ignore"
  op.printer = self
  op.matches = matches
  op.from = from
  return op
})

/** @internal */
export const between = dual<
  <Error2, Output2, Error3, Output3>(
    left: Printer.Printer<void, Error2, Output2>,
    right: Printer.Printer<void, Error3, Output3>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input, Error | Error2 | Error3, Output | Output2 | Output3>,
  <Input, Error, Output, Error2, Output2, Error3, Output3>(
    self: Printer.Printer<Input, Error, Output>,
    left: Printer.Printer<void, Error2, Output2>,
    right: Printer.Printer<void, Error3, Output3>
  ) => Printer.Printer<Input, Error | Error2 | Error3, Output | Output2 | Output3>
>(3, (self, left, right) => zipRight(left, zipLeft(self, right)))

/** @internal */
export const char = (char: string): Printer.Printer<void, string, string> =>
  regexDiscard(_regex.charIn([char]), Chunk.of(char))

/** @internal */
export const contramap = dual<
  <Input2, Input>(
    from: (value: Input2) => Input
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input2, Error, Output>,
  <Input, Error, Output, Input2>(
    self: Printer.Printer<Input, Error, Output>,
    from: (value: Input2) => Input
  ) => Printer.Printer<Input2, Error, Output>
>(2, (self, from) => contramapEither(self, (value) => Either.right(from(value))))

/** @internal */
export const contramapEither = dual<
  <Input2, Error2, Input>(
    from: (value: Input2) => Either.Either<Error2, Input>
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input2, Error2, Output>,
  <Input, Error, Output, Input2, Error2>(
    self: Printer.Printer<Input, Error, Output>,
    from: (value: Input2) => Either.Either<Error2, Input>
  ) => Printer.Printer<Input2, Error2, Output>
>(2, (self, from) => {
  const op = Object.create(proto)
  op._tag = "ContramapEither"
  op.printer = self
  op.from = from
  return op
})

/** @internal */
export const contramapTo = dual<
  <Input2, Input, Error2>(
    from: (value: Input2) => Option.Option<Input>,
    error: Error2
  ) => <Error, Output>(self: Printer.Printer<Input, Error, Output>) => Printer.Printer<Input2, Error2, Output>,
  <Input, Error, Output, Input2, Error2>(
    self: Printer.Printer<Input, Error, Output>,
    from: (value: Input2) => Option.Option<Input>,
    error: Error2
  ) => Printer.Printer<Input2, Error2, Output>
>(3, (self, from, error) =>
  contramapEither(self, (value) =>
    Option.match(
      from(value),
      () => Either.left(error),
      Either.right
    )))

/** @internal */
export const exactly = <Output, Error = string>(value: Output, error?: Error): Printer.Printer<Output, Error, Output> =>
  filterInput(anything(), (input) => Equal.equals(input, value), error ?? (`expected '${value}'` as any))

/** @internal */
export const except = <Output, Error = string>(value: Output, error?: Error): Printer.Printer<Output, Error, Output> =>
  filterInput(anything(), (input) => !Equal.equals(input, value), error ?? (`cannot be '${value}'` as any))

/** @internal */
export const fail = <Error>(error: Error): Printer.Printer<never, Error, never> => {
  const op = Object.create(proto)
  op._tag = "Fail"
  op.error = error
  return op
}

/** @internal */
export const failed = <Error>(error: ParserError.ParserError<Error>): Printer.Printer<Error, never, unknown> => {
  const op = Object.create(proto)
  op._tag = "Failed"
  op.error = error
  return op
}

/** @internal */
export const filterInput = dual<
  <Input, Error2>(
    condition: Predicate<Input>,
    error: Error2
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input, Error | Error2, Output>,
  <Input, Error, Output, Error2>(
    self: Printer.Printer<Input, Error, Output>,
    condition: Predicate<Input>,
    error: Error2
  ) => Printer.Printer<Input, Error | Error2, Output>
>(3, (self, condition, error) =>
  contramapEither(self, (value) =>
    condition(value)
      ? Either.right(value)
      : Either.left(error)))

export const flattenInput = <Error, Output>(
  self: Printer.Printer<Chunk.Chunk<string>, Error, Output>
): Printer.Printer<string, Error, Output> => contramap(self, Chunk.of)

/** @internal */
export const fromInput = <Input, Error, Output>(
  f: (input: Input) => Printer.Printer<never, Error, Output>
): Printer.Printer<Input, Error, Output> => {
  const op = Object.create(proto)
  op._tag = "FlatMapInput"
  op.f = f
  return op
}

/** @internal */
export const mapError = dual<
  <Error, Error2>(
    f: (error: Error) => Error2
  ) => <Input, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input, Error2, Output>,
  <Input, Output, Error, Error2>(
    self: Printer.Printer<Input, Error, Output>,
    f: (error: Error) => Error2
  ) => Printer.Printer<Input, Error2, Output>
>(2, (self, f) => {
  const op = Object.create(proto)
  op._tag = "MapError"
  op.printer = self
  op.map = f
  return op
})

/** @internal */
export const notChar = <Error>(char: string, failure?: Error): Printer.Printer<string, Error, string> =>
  regexChar(_regex.charNotIn([char]), failure ?? (`cannot be '${char}'` as any))

/** @internal */
export const optional = <Input, Error, Output>(
  self: Printer.Printer<Input, Error, Output>
): Printer.Printer<Option.Option<Input>, Error, Output> => {
  const op = Object.create(proto)
  op._tag = "Optional"
  op.printer = self
  return op
}

/** @internal */
export const orElse = dual<
  <Input2, Error2, Output2>(
    that: LazyArg<Printer.Printer<Input2, Error2, Output2>>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input & Input2, Error | Error2, Output | Output2>,
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    that: LazyArg<Printer.Printer<Input2, Error2, Output2>>
  ) => Printer.Printer<Input & Input2, Error | Error2, Output | Output2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "OrElse"
  op.left = self
  op.right = suspend(that)
  return op
})

/** @internal */
export const orElseEither = dual<
  <Input2, Error2, Output2>(
    that: LazyArg<Printer.Printer<Input2, Error2, Output2>>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Either.Either<Input, Input2>, Error | Error2, Output | Output2>,
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    that: LazyArg<Printer.Printer<Input2, Error2, Output2>>
  ) => Printer.Printer<Either.Either<Input, Input2>, Error | Error2, Output | Output2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "OrElseEither"
  op.left = self
  op.right = suspend(that)
  return op
})

/** @internal */
export const output = <Output>(output: Output): Printer.Printer<never, never, Output> => {
  const op = Object.create(proto)
  op._tag = "ProvideInput"
  op.printer = anything()
  op.input = output
  return op
}

/** @internal */
export const outputString = (input: string): Printer.Printer<never, never, string> => provideInput(anyString, input)

/** @internal */
export const printToTarget = dual<
  <Input, Output, T extends Target.Target<any, Output>>(
    input: Input,
    target: T
  ) => <Error>(
    self: Printer.Printer<Input, Error, Output>
  ) => Either.Either<Error, void>,
  <Input, Error, Output, T extends Target.Target<any, Output>>(
    self: Printer.Printer<Input, Error, Output>,
    input: Input,
    target: T
  ) => Either.Either<Error, void>
>(3, (self, value, target) => interpret(self, value, target))

/** @internal */
export const printToChunk = dual<
  <Input>(
    input: Input
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Either.Either<Error, Chunk.Chunk<Output>>,
  <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>,
    input: Input
  ) => Either.Either<Error, Chunk.Chunk<Output>>
>(2, <Input, Error, Output>(self: Printer.Printer<Input, Error, Output>, input: Input) => {
  const target = chunkTarget.make<Output>()
  return Either.map(interpret(self, input, target), () => target.result())
})

/** @internal */
export const printToString = dual<
  <Input>(value: Input) => <Error>(self: Printer.Printer<Input, Error, string>) => Either.Either<Error, string>,
  <Input, Error>(self: Printer.Printer<Input, Error, string>, input: Input) => Either.Either<Error, string>
>(2, (self, value) => Either.map(printToChunk(self, value), Chunk.join("")))

export const provideInput = dual<
  <Input>(
    input: Input
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<never, Error, Output>,
  <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>,
    input: Input
  ) => Printer.Printer<never, Error, Output>
>(2, (self, input) => {
  const op = Object.create(proto)
  op._tag = "ProvideInput"
  op.printer = self
  op.input = input
  return op
})

/** @internal */
export const regex = <Error>(regex: Regex.Regex, error: Error): Printer.Printer<Chunk.Chunk<string>, Error, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegex"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const regexDiscard = (
  regex: Regex.Regex,
  characters: Iterable<string>
): Printer.Printer<void, never, string> => {
  const op = Object.create(proto)
  op._tag = "SkipRegex"
  op.regex = regex
  op.printAs = Chunk.isChunk(characters) ? characters : Chunk.fromIterable(characters)
  return op
}

/** @internal */
export const regexChar = <Error>(regex: Regex.Regex, error: Error): Printer.Printer<string, Error, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.some(error)
  return op
}

/** @internal */
export const repeat = <Input, Error, Output>(
  self: Printer.Printer<Input, Error, Output>
): Printer.Printer<Chunk.Chunk<Input>, Error, Output> => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.printer = self
  op.min = 0
  op.max = Option.none()
  return op
}

/** @internal */
export const repeat1 = <Input, Error, Output>(
  self: Printer.Printer<Input, Error, Output>
): Printer.Printer<Chunk.NonEmptyChunk<Input>, Error, Output> => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.printer = self
  op.min = 1
  op.max = Option.none()
  return op
}

/** @internal */
export const repeatWithSeparator = dual<
  <Error2, Output2>(
    separator: Printer.Printer<void, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>,
  <Input, Error, Output, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    separator: Printer.Printer<void, Error2, Output2>
  ) => Printer.Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>
>(2, (self, separator) =>
  pipe(
    zip(self, repeat(zipRight(separator, self))),
    optional,
    contramap((chunk) => Option.map(Chunk.head(chunk), (head) => [head, Chunk.drop(chunk, 1)] as const))
  ))

/** @internal */
export const repeatWithSeparator1 = dual<
  <Error2, Output2>(
    separator: Printer.Printer<void, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Chunk.NonEmptyChunk<Input>, Error | Error2, Output | Output2>,
  <Input, Error, Output, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    separator: Printer.Printer<void, Error2, Output2>
  ) => Printer.Printer<Chunk.NonEmptyChunk<Input>, Error | Error2, Output | Output2>
>(2, (self, separator) =>
  pipe(
    zip(self, repeat(zipRight(separator, self))),
    contramap((chunk) => [Chunk.headNonEmpty(chunk), Chunk.tailNonEmpty(chunk)] as const)
  ))

/** @internal */
export const repeatUntil = dual<
  <Error2, Output2>(
    stopCondition: Printer.Printer<void, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>,
  <Input, Error, Output, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    stopCondition: Printer.Printer<void, Error2, Output2>
  ) => Printer.Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>
>(2, (self, stopCondition) => zipLeft(repeat(self), stopCondition))

/** @internal */
export const succeed = <Input>(input: Input): Printer.Printer<Input, never, never> => {
  const op = Object.create(proto)
  op._tag = "Succeed"
  op.input = input
  return op
}

/** @internal */
export const surroundedBy = dual<
  <Error2, Output2>(
    other: Printer.Printer<void, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input, Error | Error2, Output | Output2>,
  <Input, Error, Output, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    other: Printer.Printer<void, Error2, Output2>
  ) => Printer.Printer<Input, Error | Error2, Output | Output2>
>(2, (self, other) => zipRight(other, zipLeft(self, other)))

/** @internal */
export const suspend = <Input, Error, Output>(
  printer: LazyArg<Printer.Printer<Input, Error, Output>>
): Printer.Printer<Input, Error, Output> => {
  const op = Object.create(proto)
  op._tag = "Suspend"
  op.printer = printer
  return op
}

/** @internal */
export const transformOption = dual<
  <Input2, Input>(
    from: (input: Input2) => Option.Option<Input>
  ) => <Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input2, Option.Option<Error>, Output>,
  <Input, Error, Output, Input2>(
    self: Printer.Printer<Input, Error, Output>,
    from: (input: Input2) => Option.Option<Input>
  ) => Printer.Printer<Input2, Option.Option<Error>, Output>
>(2, (self, from) => contramapEither(self, (input) => Either.fromOption(from(input), () => Option.none())))

/** @internal */
export const unit = (): Printer.Printer<void, never, never> => succeed<void>(void 0)

/** @internal */
export const unsafeRegex = (regex: Regex.Regex): Printer.Printer<Chunk.Chunk<string>, never, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegex"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const unsafeRegexChar = (regex: Regex.Regex): Printer.Printer<string, never, string> => {
  const op = Object.create(proto)
  op._tag = "ParseRegexLastChar"
  op.regex = regex
  op.onFailure = Option.none()
  return op
}

/** @internal */
export const zipLeft = dual<
  <Input2, Error2, Output2>(
    that: Printer.Printer<Input2, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input, Error | Error2, Output | Output2>,
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    that: Printer.Printer<Input2, Error2, Output2>
  ) => Printer.Printer<Input, Error | Error2, Output | Output2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "ZipLeft"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const zipRight = dual<
  <Input2, Error2, Output2>(
    that: Printer.Printer<Input2, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<Input2, Error | Error2, Output | Output2>,
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    that: Printer.Printer<Input2, Error2, Output2>
  ) => Printer.Printer<Input2, Error | Error2, Output | Output2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "ZipRight"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const zip = dual<
  <Input2, Error2, Output2>(
    that: Printer.Printer<Input2, Error2, Output2>
  ) => <Input, Error, Output>(
    self: Printer.Printer<Input, Error, Output>
  ) => Printer.Printer<readonly [Input, Input2], Error | Error2, Output | Output2>,
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer.Printer<Input, Error, Output>,
    that: Printer.Printer<Input2, Error2, Output2>
  ) => Printer.Printer<readonly [Input, Input2], Error | Error2, Output | Output2>
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "Zip"
  op.left = self
  op.right = that
  op.unzip = (value: unknown) =>
    Array.isArray(value)
      ? [value.slice(0, value.length - 1), value[value.length - 1]]
      : [void 0, value]
  return op
})

/** @internal */
export const anyChar: Printer.Printer<string, never, string> = unsafeRegexChar(_regex.anyChar)

/** @internal */
export const anyString: Printer.Printer<string, never, string> = pipe(
  unsafeRegex(_regex.atLeast(_regex.anyChar, 0)),
  contramap((s) => Chunk.fromIterable(s))
)

/** @internal */
export const charIn = (chars: Iterable<string>): Printer.Printer<string, string, string> =>
  regexChar(_regex.charIn(chars), `not one of the expected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const charNotIn = (chars: Iterable<string>): Printer.Printer<string, string, string> =>
  regexChar(_regex.charNotIn(chars), `one of the unexpected characters (${Array.from(chars).join(", ")})`)

/** @internal */
export const string = <Input>(str: string, input: Input): Printer.Printer<Input, never, string> =>
  pipe(
    regexDiscard(_regex.string(str), Chunk.fromIterable(str)),
    asPrinted(input, void 0 as void)
  )

/** @internal */
export const alphaNumeric: Printer.Printer<string, string, string> = regexChar(
  _regex.anyAlphaNumeric,
  "not alphanumeric"
)

/** @internal */
export const digit: Printer.Printer<string, string, string> = regexChar(_regex.anyDigit, "not a digit")

/** @internal */
export const letter: Printer.Printer<string, string, string> = regexChar(_regex.anyLetter, "not a letter")

/** @internal */
export const whitespace: Printer.Printer<string, string, string> = regexChar(
  _regex.whitespace,
  "not a whitespace character"
)

/** @internal */
type PrinterCont = (
  either: Either.Either<unknown, unknown>
) => readonly [Primitive, unknown, Option.Option<PrinterCont>]

/** @internal */
const interpret = <Input, Error, Output, T extends Target.Target<any, Output>>(
  self: Printer.Printer<Input, Error, Output>,
  _input: Input,
  output: T
) => {
  let input: unknown = _input
  let current: Primitive | undefined = self as Primitive
  let result: Either.Either<unknown, unknown> = Either.right(void 0)
  let stack: List.List<PrinterCont> = List.empty()

  const finish = (r: Either.Either<unknown, unknown>): void => {
    if (List.isNil(stack)) {
      result = r
      current = undefined
    } else {
      const cont = stack.head
      const [nextPrimitive, nextInput, nextCont] = cont(r)
      current = nextPrimitive
      input = nextInput
      if (Option.isSome(nextCont)) {
        stack = List.cons(nextCont.value, stack.tail)
      } else {
        stack = stack.tail
      }
    }
  }

  while (current !== undefined) {
    switch (current._tag) {
      case "ContramapEither": {
        const oldInput = input
        const printer = current.printer
        Either.match(
          current.from(input),
          (failure) => finish(Either.left(failure)),
          (newInput) => {
            input = newInput
            current = printer
            const cont: PrinterCont = Either.match(
              (failure) => [fail(failure) as Primitive, oldInput, Option.none()],
              () => [unit() as Primitive, oldInput, Option.none()]
            )
            stack = List.cons(cont, stack)
          }
        )
        break
      }
      case "Fail": {
        finish(Either.left(current.error))
        break
      }
      case "Failed": {
        // TODO
        break
      }
      case "FlatMapInput": {
        current = current.f(input)
        break
      }
      case "Ignore": {
        if (Equal.equals(input, current.matches)) {
          const oldInput = input
          input = current.from
          current = current.printer
          const cont: PrinterCont = Either.match(
            (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
            () => [unit() as Primitive, oldInput, Option.none()] as const
          )
          stack = List.cons(cont, stack)
        } else {
          // TODO
          finish(Either.left(failed(parserError.unknownFailure(List.nil(), 0))))
        }
        break
      }
      case "MapError": {
        const map = current.map
        current = current.printer as Primitive
        const cont: PrinterCont = Either.match(
          (failure) => [fail(map(failure)) as Primitive, input, Option.none()] as const,
          () => [unit() as Primitive, input, Option.none()] as const
        )
        stack = List.cons(cont, stack)
        break
      }
      case "Optional": {
        const oldInput = input
        const optInput = input as Option.Option<unknown>
        const printer = current.printer
        Option.match(
          optInput,
          () => finish(Either.right(void 0)),
          (someInput) => {
            input = someInput
            current = printer
            const cont: PrinterCont = Either.match(
              (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
              () => [unit() as Primitive, oldInput, Option.none()] as const
            )
            stack = List.cons(cont, stack)
          }
        )
        break
      }
      case "OrElse": {
        const right = current.right
        current = current.left
        const capture = output.capture()
        const cont: PrinterCont = Either.match(
          () => {
            output.drop(capture)
            return [right, input, Option.none()] as const
          },
          () => {
            output.emit(capture)
            return [unit() as Primitive, input, Option.none()]
          }
        )
        stack = List.cons(cont, stack)
        break
      }
      case "OrElseEither": {
        const oldInput = input
        const left = current.left
        const right = current.right
        const eitherInput = input as Either.Either<unknown, unknown>
        Either.match(
          eitherInput,
          (leftInput) => {
            input = leftInput
            current = left
            const cont: PrinterCont = Either.match(
              (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
              () => [unit() as Primitive, oldInput, Option.none()] as const
            )
            stack = List.cons(cont, stack)
          },
          (rightInput) => {
            input = rightInput
            current = right
            const cont: PrinterCont = Either.match(
              (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
              () => [unit() as Primitive, oldInput, Option.none()] as const
            )
            stack = List.cons(cont, stack)
          }
        )
        break
      }
      case "ParseRegex": {
        if (Option.isSome(current.onFailure)) {
          const compiled = _regex.compile(current.regex)
          const chunk = input as Chunk.Chunk<string>
          if (compiled.test(0, Chunk.join(chunk, "")) < 0) {
            finish(Either.left(current.onFailure.value))
          } else {
            for (const out of input as Chunk.Chunk<Output>) {
              output.write(out)
            }
            finish(Either.right(void 0))
          }
        } else {
          for (const out of input as Chunk.Chunk<Output>) {
            output.write(out)
          }
          finish(Either.right(void 0))
        }
        break
      }
      case "ParseRegexLastChar": {
        if (Option.isSome(current.onFailure)) {
          const compiled = _regex.compile(current.regex)
          const char = input as string
          if (compiled.test(0, char) <= 0) {
            finish(Either.left(current.onFailure.value))
          } else {
            output.write(input as Output)
            finish(Either.right(void 0))
          }
        } else {
          output.write(input as Output)
          finish(Either.right(void 0))
        }
        break
      }
      case "Passthrough": {
        output.write(input as Output)
        finish(Either.right(void 0))
        break
      }
      case "ProvideInput": {
        const oldInput = input
        input = current.input
        current = current.printer as Primitive
        const cont: PrinterCont = Either.match(
          (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
          () => [unit() as Primitive, oldInput, Option.none()] as const
        )
        stack = List.cons(cont, stack)
        break
      }
      case "Repeat": {
        const inputChunk = input as Chunk.Chunk<unknown>
        if (Chunk.isEmpty(inputChunk)) {
          finish(Either.right(void 0))
        } else {
          const head = Chunk.unsafeHead(inputChunk)
          const tail = Chunk.drop(inputChunk, 1)
          current = current.printer
          input = head
          const cont: PrinterCont = Either.match(
            (failure) => [fail(failure) as Primitive, inputChunk, Option.none()] as const,
            () =>
              [
                current as Primitive,
                tail,
                Option.some(Either.match(
                  (failure) => [fail(failure) as Primitive, inputChunk, Option.none()] as const,
                  () => [unit() as Primitive, inputChunk, Option.none()] as const
                ))
              ] as const
          )
          stack = List.cons(cont, stack)
        }
        break
      }
      case "SkipRegex": {
        const chunk = current.printAs as Chunk.Chunk<Output>
        for (const out of chunk) {
          output.write(out)
        }
        finish(Either.right(void 0))
        break
      }
      case "Succeed": {
        finish(Either.right(void 0))
        break
      }
      case "Suspend": {
        current = current.printer()
        break
      }
      case "Zip":
      case "ZipLeft":
      case "ZipRight": {
        const oldInput = input
        const right = current.right
        let valueB: unknown | undefined = undefined
        if (current._tag === "Zip") {
          const tuple = current.unzip(input)
          input = tuple[0]
          valueB = tuple[1]
        }
        const cont1: PrinterCont = Either.match(
          (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
          () => {
            const cont2: PrinterCont = Either.match(
              (failure) => [fail(failure) as Primitive, oldInput, Option.none()] as const,
              () => [unit() as Primitive, oldInput, Option.none()] as const
            )
            return [right, valueB, Option.some(cont2)] as const
          }
        )
        current = current.left
        stack = List.cons(cont1, stack)
        break
      }
    }
  }
  return Either.map(result, constVoid) as Either.Either<Error, void>
}
