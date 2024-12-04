/**
 * @since 1.0.0
 */
import type { Regex } from "@effect/parser/Regex"
import type { Target } from "@effect/parser/Target"
import type * as Chunk from "effect/Chunk"
import type * as Either from "effect/Either"
import type * as Function from "effect/Function"
import type * as Option from "effect/Option"
import type * as Predicate from "effect/Predicate"
import * as internal from "./internal_effect_untraced/printer.js"

/**
 * @since 1.0.0
 * @category symbols
 */
export const PrinterTypeId: unique symbol = internal.PrinterTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type PrinterTypeId = typeof PrinterTypeId

/**
 * A `Printer` takes an input value of type `Input` and either produces a result
 * of type `Output`, or fails with a custom error of type `Error`.
 *
 * `Printer`s can be combined with `Parser`s to get `Syntax`, or a `Parser` and
 * a `Printer` can be built simultaneously by using the combinators of `Syntax`.
 *
 * @since 1.0.0
 * @category models
 */
export interface Printer<Input, Error, Output> extends Printer.Variance<Input, Error, Output> {}

/**
 * @since 1.0.0
 */
export declare namespace Printer {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<Input, Error, Output> {
    readonly [PrinterTypeId]: {
      readonly _Input: (_: Input) => void
      readonly _Error: (_: never) => Error
      readonly _Output: (_: never) => Output
    }
  }
}

/**
 * Prints a single alpha-numeric character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const alphaNumeric: Printer<string, string, string> = internal.alphaNumeric

/**
 * Constructs a `Printer` that just emits its input value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anything: <Input>() => Printer<Input, never, Input> = internal.anything

/**
 * A `Printer` that prints a single character provided as input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyChar: Printer<string, never, string> = internal.anyChar

/**
 * A `Printer` that just prints the input string.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyString: Printer<string, never, string> = internal.anyString

/**
 * Transforms a `Syntax` that results in `from` in a `Syntax` that results in `value`
 *
 * @since 1.0.0
 * @category combinators
 */
export const asPrinted: {
  <Input2, Input>(
    matches: Input2,
    from: Input
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error, Output>
  <Input, Error, Output, Input2>(
    self: Printer<Input, Error, Output>,
    matches: Input2,
    from: Input
  ): Printer<Input2, Error, Output>
} = internal.asPrinted

/**
 * Surround this printer with `left` and `right`, each getting void as value to
 * be printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const between: {
  <Error2, Output2, Error3, Output3>(
    left: Printer<void, Error2, Output2>,
    right: Printer<void, Error3, Output3>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error3 | Error, Output2 | Output3 | Output>
  <Input, Error, Output, Error2, Output2, Error3, Output3>(
    self: Printer<Input, Error, Output>,
    left: Printer<void, Error2, Output2>,
    right: Printer<void, Error3, Output3>
  ): Printer<Input, Error | Error2 | Error3, Output | Output2 | Output3>
} = internal.zipBetween

/**
 * A `Printer` that prints a given character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const char: (char: string) => Printer<void, string, string> = internal.char

/**
 * A `Printer` that prints a single character if it matches any of the
 * specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charIn: (chars: Iterable<string>) => Printer<string, string, string> = internal.charIn

/**
 * A `Printer` that prints a single character if it does not match any of the
 * specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charNotIn: (chars: Iterable<string>) => Printer<string, string, string> = internal.charNotIn

/**
 * Maps the printer's input value with the specified function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const contramap: {
  <Input2, Input>(
    from: (value: Input2) => Input
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error, Output>
  <Input, Error, Output, Input2>(
    self: Printer<Input, Error, Output>,
    from: (value: Input2) => Input
  ): Printer<Input2, Error, Output>
} = internal.contramap

/**
 * Maps the printer's input value with the specified function which returns
 * an `Either`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const contramapEither: {
  <Input2, Error2, Input>(
    from: (value: Input2) => Either.Either<Input, Error2>
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2, Output>
  <Input, Error, Output, Input2, Error2>(
    self: Printer<Input, Error, Output>,
    from: (value: Input2) => Either.Either<Input, Error2>
  ): Printer<Input2, Error2, Output>
} = internal.contramapEither

/**
 * Maps the value to be printed with the partial function `from`. If the partial
 * function is not defined on the input value, the printer fails with `failure`.
 *
 * This can be used to define separate syntaxes for subtypes, that can be later
 * combined.
 *
 * @since 1.0.0
 * @category combinators
 */
export const contramapTo: {
  <Input2, Input, Error2>(
    from: (value: Input2) => Option.Option<Input>,
    error: Error2
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2, Output>
  <Input, Error, Output, Input2, Error2>(
    self: Printer<Input, Error, Output>,
    from: (value: Input2) => Option.Option<Input>,
    error: Error2
  ): Printer<Input2, Error2, Output>
} = internal.contramapTo

/**
 * Prints a single digit.
 *
 * @since 1.0.0
 * @category constructors
 */
export const digit: Printer<string, string, string> = internal.digit

/**
 * A `Printer` that emits the input if it is equals to the specified `value`,
 * otherwise fails with the specified `error` (if provided).
 *
 * **Note**: equality is checked using Equal.equals from `@effect/data`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const exactly: <Output, Error = string>(
  value: Output,
  error?: Error
) => Printer<Output, Error, Output> = internal.exactly

/**
 * A `Printer` that emits the input unless it is equal to `value`, in which case
 * it fails with the specified `error` (if provided).
 *
 * **Note**: equality is checked using Equal.equals from `@effect/data`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const except: <Output, Error = string>(
  value: Output,
  error?: Error | undefined
) => Printer<Output, Error, Output> = internal.except

/**
 * A `Printer` that does not print anything and fails with the specified `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fail: <Error>(error: Error) => Printer<unknown, Error, never> = internal.fail

/**
 * Specifies a filter `condition` that gets checked on the input value and in
 * case it evaluates to `false`, fails with the provided `error`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const filterInput: {
  <Input, Error2>(
    condition: Predicate.Predicate<Input>,
    error: Error2
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output>
  <Input, Error, Output, Error2>(
    self: Printer<Input, Error, Output>,
    condition: Predicate.Predicate<Input>,
    error: Error2
  ): Printer<Input, Error | Error2, Output>
} = internal.filterInput

/**
 * Concatenates an input `Chunk<string>` to a `string` to be printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flatten: <Error, Output>(
  self: Printer<Chunk.Chunk<string>, Error, Output>
) => Printer<string, Error, Output> = internal.flatten

/**
 * Concatenates an input `Chunk<string>` to a `string` to be printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flattenNonEmpty: <Error, Output>(
  self: Printer<Chunk.NonEmptyChunk<string>, Error, Output>
) => Printer<string, Error, Output> = internal.flattenNonEmpty

/**
 * A `Printer` computed using a function on the input value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromInput: <Input, Error, Output>(
  f: (input: Input) => Printer<never, Error, Output>
) => Printer<Input, Error, Output> = internal.fromInput

/**
 * Prints a single letter.
 *
 * @since 1.0.0
 * @category constructors
 */
export const letter: Printer<string, string, string> = internal.letter

/**
 * Maps over the error channel with the specified function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const mapError: {
  <Error, Error2>(
    f: (error: Error) => Error2
  ): <Input, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2, Output>
  <Input, Output, Error, Error2>(
    self: Printer<Input, Error, Output>,
    f: (error: Error) => Error2
  ): Printer<Input, Error2, Output>
} = internal.mapError

/**
 * A `Printer` that prints the input character if it is not equal to the
 * specified `char`.
 *
 * Can optionally specify an error to use in place of the default message.
 *
 * @since 1.0.0
 * @category constructors
 */
export const notChar: <Error>(char: string, failure?: Error | undefined) => Printer<string, Error, string> =
  internal.charNot

/**
 * A `Printer` which prints `Option` values.
 *
 * @since 1.0.0
 * @category combinators
 */
export const optional: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<Option.Option<Input>, Error, Output> = internal.optional

/**
 * Prints `self` and if it fails, ignore the printed output and print `that`
 * instead.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElse: {
  <Input2, Error2, Output2>(
    that: Function.LazyArg<Printer<Input2, Error2, Output2>>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2 | Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Function.LazyArg<Printer<Input2, Error2, Output2>>
  ): Printer<Input | Input2, Error | Error2, Output | Output2>
} = internal.orElse

/**
 * Prints `self` if the input is `Left`, or print `that` if the input is
 * `Right`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElseEither: {
  <Input2, Error2, Output2>(
    that: Function.LazyArg<Printer<Input2, Error2, Output2>>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Either.Either<Input2, Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Function.LazyArg<Printer<Input2, Error2, Output2>>
  ): Printer<Either.Either<Input2, Input>, Error | Error2, Output | Output2>
} = internal.orElseEither

/**
 * A `Printer` which outputs a specific value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const output: <Output>(value: Output) => Printer<never, never, Output> = internal.output

/**
 * A `Printer` which outputs a specific string.
 *
 * @since 1.0.0
 * @category constructors
 */
export const outputString: (value: string) => Printer<never, never, string> = internal.outputString

/**
 * Print the specified input value to a chunk of output elements.
 *
 * @since 1.0.0
 * @category execution
 */
export const printToChunk: {
  <Input>(
    input: Input
  ): <Error, Output>(self: Printer<Input, Error, Output>) => Either.Either<Chunk.Chunk<Output>, Error>
  <Input, Error, Output>(self: Printer<Input, Error, Output>, input: Input): Either.Either<Chunk.Chunk<Output>, Error>
} = internal.printToChunk

/**
 * Print the specified input value to a string.
 *
 * @since 1.0.0
 * @category execution
 */
export const printToString: {
  <Input>(value: Input): <Error>(self: Printer<Input, Error, string>) => Either.Either<string, Error>
  <Input, Error>(self: Printer<Input, Error, string>, input: Input): Either.Either<string, Error>
} = internal.printToString

/**
 * Print the specified input value to the given `target` implementation.
 *
 * @since 1.0.0
 * @category execution
 */
export const printToTarget: {
  <Input, Output, T extends Target<any, Output>>(
    input: Input,
    target: T
  ): <Error>(
    self: Printer<Input, Error, Output>
  ) => Either.Either<void, Error>
  <Input, Error, Output, T extends Target<any, Output>>(
    self: Printer<Input, Error, Output>,
    input: Input,
    target: T
  ): Either.Either<void, Error>
} = internal.printToTarget

/**
 * A `Printer` that prints a series of characters provided as input, if it
 * matches the given regex. Otherwise fails with the specified `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regex: <Error>(regex: Regex, error: Error) => Printer<Chunk.Chunk<string>, Error, string> = internal.regex

/**
 * A `Printer` that prints the specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexDiscard: (regex: Regex, characters: Iterable<string>) => Printer<void, never, string> =
  internal.regexDiscard

/**
 * A `Printer` that prints a single character if matches the given `regex`,
 * otherwise fails with the provided `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexChar: <Error>(regex: Regex, error: Error) => Printer<string, Error, string> = internal.regexChar

/**
 * Repeats this printer for each element of the input chunk zero or more times.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<Chunk.Chunk<Input>, Error, Output> = internal.repeatMin0

/**
 * Repeats this printer for each element of the input chunk.
 *
 * The input chunk **must not** be empty.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat1: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<Chunk.NonEmptyChunk<Input>, Error, Output> = internal.repeatMin1

/**
 * Repeats this printer for each element of the input chunk, separated by the
 * `separator` printer (which gets `void` to be printed).
 *
 * The input chunk may not be empty.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator: {
  <Error2, Output2>(
    separator: Printer<void, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Chunk.Chunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    separator: Printer<void, Error2, Output2>
  ): Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>
} = internal.repeatWithSeparator

/**
 * Repeats this printer for each element of the input chunk, separated by the
 * `separator` printer (which gets `void` to be printed).
 *
 * The input chunk **must not** be empty.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator1: {
  <Error2, Output2>(
    separator: Printer<void, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Chunk.NonEmptyChunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    separator: Printer<void, Error2, Output2>
  ): Printer<Chunk.NonEmptyChunk<Input>, Error | Error2, Output | Output2>
} = internal.repeatWithSeparator1

/**
 * Repeat this printer for each element of the input chunk, verifying the
 * `stopConfition` after each.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatUntil: {
  <Error2, Output2>(
    stopCondition: Printer<void, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Chunk.Chunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    stopCondition: Printer<void, Error2, Output2>
  ): Printer<Chunk.Chunk<Input>, Error | Error2, Output | Output2>
} = internal.repeatUntil

/**
 * A `Printer` which prints the specified string and results in `value`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const string: <Input>(str: string, input: Input) => Printer<Input, never, string> = internal.string

/**
 * A `Printer` that does not print anything and succeeds with the specified
 * `value`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <Input>(input: Input) => Printer<unknown, never, never> = internal.succeed

/**
 * Surround this printer the `other` printer which gets `void` as the value to
 * be printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const surroundedBy: {
  <Error2, Output2>(
    other: Printer<void, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    other: Printer<void, Error2, Output2>
  ): Printer<Input, Error | Error2, Output | Output2>
} = internal.zipSurrounded

/**
 * Lazily constructs a `Printer`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const suspend: <Input, Error, Output>(
  printer: Function.LazyArg<Printer<Input, Error, Output>>
) => Printer<Input, Error, Output> = internal.suspend

/**
 * Maps the printer's input value with `from`.
 *
 * **Note**: Failure is indicated by `None` in the error channel.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transformOption: {
  <Input2, Input>(
    from: (input: Input2) => Option.Option<Input>
  ): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Option.Option<Error>, Output>
  <Input, Error, Output, Input2>(
    self: Printer<Input, Error, Output>,
    from: (input: Input2) => Option.Option<Input>
  ): Printer<Input2, Option.Option<Error>, Output>
} = internal.transformOption

/**
 * A `Printer` that does not print anything and succeeds with `undefined`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unit: () => Printer<void, never, never> = internal.unit

/**
 * A `Printer` that prints a series of characters provided as input, if it
 * matches the given regex. The regex should never fail.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegex: (regex: Regex) => Printer<Chunk.Chunk<string>, never, string> = internal.unsafeRegex

/**
 * A `Printer` that prints a single character if matches the given `regex`.
 *
 * **Note**: This is "unsafe" because the provided regex should never fail.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegexChar: (regex: Regex) => Printer<string, never, string> = internal.unsafeRegexChar

/**
 * Prints a single whitespace character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const whitespace: Printer<string, string, string> = internal.whitespace

/**
 * Print `that` by providing the unit value to it after printing `self`. The
 * result is the `self` printer's result.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipLeft: {
  <Input2, Error2, Output2>(
    that: Printer<Input2, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<Input, Error | Error2, Output | Output2>
} = internal.zipLeft

/**
 * Print `that` by providing the unit value to it after printing `self`. The
 * result is `that` printer's result.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipRight: {
  <Input2, Error2, Output2>(
    that: Printer<Input2, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<Input2, Error | Error2, Output | Output2>
} = internal.zipRight

/**
 * Takes a pair to be printed and prints the left value with `self`, and the
 * right value with `that`. The result is a pair of both printer's results.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zip: {
  <Input2, Error2, Output2>(
    that: Printer<Input2, Error2, Output2>
  ): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<readonly [Input, Input2], Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<readonly [Input, Input2], Error | Error2, Output | Output2>
} = internal.zip
