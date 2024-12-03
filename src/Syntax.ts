/**
 * @since 1.0.0
 */

import * as internal from "@effect/parser/internal_effect_untraced/syntax"
import type { Parser } from "@effect/parser/Parser"
import type { ParserError } from "@effect/parser/ParserError"
import type { Printer } from "@effect/parser/Printer"
import type { Regex } from "@effect/parser/Regex"
import type { Chunk, Either, Function, Option, Predicate } from "effect"

/**
 * @since 1.0.0
 * @category symbols
 */
export const SyntaxTypeId: unique symbol = internal.SyntaxTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type SyntaxTypeId = typeof SyntaxTypeId

/**
 * A `Syntax` defines both a `Parser` and a `Printer` and provides combinators
 * to simultaneously build them up from smaller syntax fragments.
 *
 * @since 1.0.0
 * @category models
 */
export interface Syntax<Input, Error, Output, Value> extends Syntax.Variance<Input, Error, Output, Value> {
  readonly parser: Parser<Input, Error, Value>
  readonly printer: Printer<Value, Error, Output>
}

/**
 * @since 1.0.0
 */
export declare namespace Syntax {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<Input, Error, Output, Value> {
    readonly [SyntaxTypeId]: {
      _Input: (_: Input) => void
      _Error: (_: never) => Error
      _Output: (_: never) => Output
      _Value: (_: Value) => Value
    }
  }
}

/**
 * Constructs a `Syntax` for a single alpha-numeric character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const alphaNumeric: Syntax<string, string, string, string> = internal.alphaNumeric

/**
 * Constructs a `Syntax` that parses/prints one element without modification.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anything: <Input>() => Syntax<Input, never, Input, Input> = internal.anything

/**
 * Constructs a `Syntax` that parses/prints a single character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyChar: Syntax<string, never, string, string> = internal.anyChar

/**
 * Constructs a `Syntax` that parses/prints an arbitrary long string.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyString: Syntax<string, never, string, string> = internal.anyString

/**
 * Transforms a `Syntax` that results in `void` in a `Syntax` that results in `value`
 *
 * @since 1.0.0
 * @category combinators
 */
export const as: {
  <Value2>(value: Value2): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, void>
  ) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value2>(
    self: Syntax<Input, Error, Output, void>,
    value: Value2
  ): Syntax<Input, Error, Output, Value2>
} = internal.as

/**
 * Transforms a `Syntax` that results in `from` in a `Syntax` that results in `value`
 *
 * @since 1.0.0
 * @category combinators
 */
export const asPrinted: {
  <Value, Value2>(value: Value2, from: Value): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    value: Value2,
    from: Value
  ): Syntax<Input, Error, Output, Value2>
} = internal.asPrinted

/**
 * Transforms a `Syntax` that results in `from` in a `Syntax` that results in `void`
 *
 * @since 1.0.0
 * @category combinators
 */
export const asUnit: {
  <Value>(from: Value): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, void>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    from: Value
  ): Syntax<Input, Error, Output, void>
} = internal.asUnit

/**
 * Repeat this `Syntax` at least `min` number of times.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed and, if auto-backtracking is
 * enabled, the parser backtracks to the end of the last successful item.
 *
 * When printing, the input is a chunk of values and each element gets printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const atLeast: {
  (
    min: number
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Chunk.Chunk<Value>>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    min: number
  ): Syntax<Input, Error, Output, Chunk.Chunk<Value>>
} = internal.repeatMin

/**
 * Repeat this `Syntax` at most `max` number of times.
 *
 * @since 1.0.0
 * @category combinators
 */
export const atMost: {
  (
    max: number
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Chunk.Chunk<Value>>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    max: number
  ): Syntax<Input, Error, Output, Chunk.Chunk<Value>>
} = internal.repeatMax

/**
 * Enables auto-backtracking for this syntax.
 *
 * @since 1.0.0
 * @category combinators
 */
export const autoBacktracking: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value> = internal.autoBacktracking

/**
 * Concatenates the syntaxes `left`, then this, then `right`.
 *
 * All three must succeed. The result is this syntax's result.
 *
 * Note that the `left` and `right` syntaxes must have a `Value` type of `void`.
 * Otherwise the printer could not produce an arbitrary input value for them as
 * their result is discarded.
 *
 * @since 1.0.0
 * @category combinators
 */
export const between: {
  <Input2, Error2, Output2, Input3, Error3, Output3>(
    left: Syntax<Input2, Error2, Output2, void>,
    right: Syntax<Input3, Error3, Output3, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2 & Input3, Error2 | Error3 | Error, Output2 | Output3 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2, Input3, Error3, Output3>(
    self: Syntax<Input, Error, Output, Value>,
    left: Syntax<Input2, Error2, Output2, void>,
    right: Syntax<Input3, Error3, Output3, void>
  ): Syntax<Input & Input2 & Input3, Error | Error2 | Error3, Output | Output2 | Output3, Value>
} = internal.zipBetween

/**
 * Returns a new `Syntax` that resets the parsing position in case it fails.
 *
 * By default backtracking points are automatically inserted. This behavior can
 * be changed with the `autoBacktracking`, `manualBacktracking` and
 * `setAutoBacktracking` combinators.
 *
 * Does not affect printing.
 *
 * @since 1.0.0
 * @category combinators
 */
export const backtrack: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value> = internal.backtrack

/**
 * Ignores this syntax's result and instead captures the parsed string fragment
 * / directly prints. the input string.
 *
 * @since 1.0.0
 * @category combinators
 */
export const captureString: <Error, Output, Value>(
  self: Syntax<string, Error, Output, Value>
) => Syntax<string, Error, string, string> = internal.captureString

/**
 * Parse or print the specified character or fail with the specified error and
 * result in `void`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const char: <Error = string>(char: string, error?: Error | undefined) => Syntax<string, Error, string, void> =
  internal.char

/**
 * Constructs a `Syntax` that parses/prints a single character if it matches one
 * of the characters in `chars`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charIn: (chars: Iterable<string>) => Syntax<string, string, string, string> = internal.charIn

/**
 * Parse or print a single character and fail with the specified `error` if the
 * parsed character matches the specified character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charNot: <Error>(char: string, error: Error) => Syntax<string, Error, string, string> = internal.charNot

/**
 * Constructs a `Syntax` that parses/prints a single character if it **DOES
 * NOT** match one of the character in `chars`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charNotIn: (chars: Iterable<string>) => Syntax<string, string, string, string> = internal.charNotIn

/**
 * Constructs a `Syntax` for a single digit.
 *
 * @since 1.0.0
 * @category constructors
 */
export const digit: Syntax<string, string, string, string> = internal.digit

/**
 * Constructs a `Syntax` that in parser mode only succeeds if the input stream
 * has been fully consumed.
 *
 * This can be used to require that a parser consumes all of its input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const end: Syntax<unknown, never, never, void> = internal.end

/**
 * Constructs a `Syntax` that does not pares or print anything but fails with
 * the specified `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fail: <Error>(error: Error) => Syntax<unknown, Error, never, unknown> = internal.fail

/**
 * Specifies a filter condition that gets checked in both parser and printer
 * mode and fails with the specified `error` if the predicate evaluates to
 * `false`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const filter: {
  <Value, Error2>(
    predicate: Predicate.Predicate<Value>,
    error: Error2
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error2 | Error, Output, Value>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    predicate: Predicate.Predicate<Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, Value>
} = internal.filter

/**
 * Constructs a `Syntax` that parses/prints a single character that matches the
 * given predicate, otherwise fails with the specified `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const filterChar: <Error>(
  predicate: Predicate.Predicate<string>,
  error: Error
) => Syntax<string, Error, string, string> = internal.filterChar

/**
 * Flattens a result of parsed strings to a single string.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flatten: <Input, Error, Output>(
  self: Syntax<Input, Error, Output, Chunk.Chunk<string>>
) => Syntax<Input, Error, Output, string> = internal.flatten

/**
 * Flattens a result of parsed strings to a single string.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flattenNonEmpty: <Input, Error, Output>(
  self: Syntax<Input, Error, Output, Chunk.NonEmptyChunk<string>>
) => Syntax<Input, Error, Output, string> = internal.flattenNonEmpty

/**
 * Constructs a `Syntax` that in parser mode results in the current input
 * stream position.
 *
 * @since 1.0.0
 * @category constructors
 */
export const index: Syntax<unknown, never, never, number> = internal.index

/**
 * Constructs a `Syntax` for a single letter.
 *
 * @since 1.0.0
 * @category constructors
 */
export const letter: Syntax<string, string, string, string> = internal.letter

/**
 * Disables auto-backtracking for this syntax.
 *
 * @since 1.0.0
 * @category combinators
 */
export const manualBacktracking: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value> = internal.manualBacktracking

/**
 * Maps the error with the specified function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const mapError: {
  <Error, Error2>(
    f: (error: Error) => Error2
  ): <Input, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error2, Output, Value>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    f: (error: Error) => Error2
  ): Syntax<Input, Error2, Output, Value>
} = internal.mapError

/**
 * Associates a name with this syntax. The chain of named parsers are reported
 * in case of failure to help debugging parser issues.
 *
 * @since 1.0.0
 * @category combinators
 */
export const named: {
  (
    name: string
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Value>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    name: string
  ): Syntax<Input, Error, Output, Value>
} = internal.named

/**
 * Inverts the success condition of this `Syntax`, succeeding only if this
 * syntax fails.
 *
 * @since 1.0.0
 * @category combinators
 */
export const not: {
  <Error2>(
    error: Error2
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error2 | Error, Output, void>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, void>
} = internal.not

/**
 * Make this `Syntax` optional.
 *
 * Failure of the parser will be ignored. If auto-backtracking is enabled,
 * backtracking will be performed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const optional: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Option.Option<Value>> = internal.optional

/**
 * Assigns `that` syntax as a fallback of this. First this parser or printer
 * gets evaluated. In case it succeeds, the result is this syntax's result. In
 * case it fails, the result is `that` syntax's result.
 *
 * If auto-backtracking is on, this parser will backtrack before trying `that`
 * parser.
 *
 * Note that both syntaxes require the same `Value` type. For a more flexible
 * variant, see `Syntax.orElseEither`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElse: {
  <Input2, Error2, Output2, Value>(
    that: Function.LazyArg<Syntax<Input2, Error2, Output2, Value>>
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Function.LazyArg<Syntax<Input2, Error2, Output2, Value>>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
} = internal.orElse

/**
 * Assigns `that` syntax as a fallback of this. First this parser or printer
 * gets evaluated. In case it succeeds, the result is this syntax's result
 * wrapped in `Left`. In case it fails, the result is 'that' syntax's result,
 * wrapped in `Right`.
 *
 * If auto-backtracking is on, this parser will backtrack before trying `that`
 * parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElseEither: {
  <Input2, Error2, Output2, Value2>(
    that: Function.LazyArg<Syntax<Input2, Error2, Output2, Value2>>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Either.Either<Value2, Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Function.LazyArg<Syntax<Input2, Error2, Output2, Value2>>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Either.Either<Value2, Value>>
} = internal.orElseEither

/**
 * Run this `Syntax`'s parser on the given `input` string.
 *
 * @since 1.0.0
 * @category execution
 */
export const parseString: {
  (
    input: string
  ): <Error, Output, Value>(
    self: Syntax<string, Error, Output, Value>
  ) => Either.Either<Value, ParserError<Error>>
  <Error, Output, Value>(
    self: Syntax<string, Error, Output, Value>,
    input: string
  ): Either.Either<Value, ParserError<Error>>
} = internal.parseString

/**
 * Run this `Syntax`'s parser on the given `input` string using a specific
 * parser implementation.
 *
 * @since 1.0.0
 * @category execution
 */
export const parseStringWith: {
  (
    input: string,
    implementation: Parser.Implementation
  ): <Error, Output, Value>(
    self: Syntax<string, Error, Output, Value>
  ) => Either.Either<Value, ParserError<Error>>
  <Error, Output, Value>(
    self: Syntax<string, Error, Output, Value>,
    input: string,
    implementation: Parser.Implementation
  ): Either.Either<Value, ParserError<Error>>
} = internal.parseStringWith

/**
 * Prints the specified `value` to a string.
 *
 * @since 1.0.0
 * @category execution
 */
export const printString: {
  <Value>(value: Value): <Input, Error>(self: Syntax<Input, Error, string, Value>) => Either.Either<string, Error>
  <Input, Error, Value>(self: Syntax<Input, Error, string, Value>, value: Value): Either.Either<string, Error>
} = internal.printString

/**
 * Constructs a `Syntax` that executes a regular expression on the input and
 * results in the chunk of the parsed characters, or fails with the specified
 * `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regex: <Error>(regex: Regex, error: Error) => Syntax<string, Error, string, Chunk.Chunk<string>> =
  internal.regex

/**
 * Constructs a `Syntax` that during parsing executes a regular expression on
 * the input and results in the last parsed character, or fails with the
 * specified `error`.
 *
 * Useful for regexes that are known to parse a single character.
 *
 * The printer will print the character provided as input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexChar: <Error>(regex: Regex, error: Error) => Syntax<string, Error, string, string> =
  internal.regexChar

/**
 * Constructs a `Syntax` which parses using the given regular expression and
 * discards the results, and will fail with the specified `error` if parsing
 * fails. When printing, the specified characters are printed.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexDiscard: <Error>(
  regex: Regex,
  error: Error,
  chars: Iterable<string>
) => Syntax<string, Error, string, void> = internal.regexDiscard

/**
 * Repeats this `Syntax` zero or more times.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed and, if auto-backtracking is
 * enabled, the parser backtracks to the end of the last successful item.
 *
 * When printing, the input is a chunk of values and each element gets printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Chunk.Chunk<Value>> = internal.repeatMin0

/**
 * Repeats this `Syntax` at least one time.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed and, if auto-backtracking is
 * enabled, the parser backtracks to the end of the last successful item.
 *
 * When printing, the input is a chunk of values and each element gets printed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat1: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Chunk.NonEmptyChunk<Value>> = internal.repeatMin1

/**
 * Repeats this `Syntax` until the `stopCondition`, which performed after each
 * element, results in success.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatUntil: {
  <Input2, Error2, Output2>(
    stopCondition: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Chunk.Chunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    stopCondition: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>
} = internal.repeatUntil

/**
 * Repeats this `Syntax` zero or more times and with the `separator` injected
 * between each element.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator: {
  <Input2, Error2, Output2>(
    separator: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Chunk.Chunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    separator: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.Chunk<Value>>
} = internal.repeatWithSeparator

/**
 * Repeats this `Syntax` at least once with the `separator` injected between
 * each element.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator1: {
  <Input2, Error2, Output2>(
    separator: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Chunk.NonEmptyChunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    separator: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk.NonEmptyChunk<Value>>
} = internal.repeatWithSeparator1

/**
 * Enables or disables auto-backtracking for this syntax.
 *
 * @since 1.0.0
 * @category combinators
 */
export const setAutoBacktracking: {
  (
    enabled: boolean
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Value>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    enabled: boolean
  ): Syntax<Input, Error, Output, Value>
} = internal.setAutoBacktracking

/**
 * Constructs a `Syntax` that parses/prints the specified string and results in
 * the specified `value`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const string: <Value>(str: string, value: Value) => Syntax<string, string, string, Value> = internal.string

/**
 * Constructs a `Syntax` that does not parse or print anything but succeeds with
 * the specified `result`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <Value>(value: Value) => Syntax<unknown, never, never, Value> = internal.succeed

/**
 * Surrounds this `Syntax` with the `other` syntax. The result is this syntax's
 * result.
 *
 * @since 1.0.0
 * @category combinators
 */
export const surroundedBy: {
  <Input2, Error2, Output2>(
    other: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    other: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
} = internal.zipSurrounded

/**
 * Lazily constructs a `Syntax`. Can be used to construct a recursive parser
 *
 * @example
 *
 * import { pipe } from "effect"
 * import * as Syntax from "@effect/parser/Syntax"
 *
 * const recursive: Syntax.Syntax<string, string, string, string> = pipe(
 *      Syntax.digit,
 *      Syntax.zipLeft(
 *        pipe(Syntax.suspend(() => recursive), Syntax.orElse(() => Syntax.letter), Syntax.asUnit("?"))
 *      )
 * )
 *
 * @since 1.0.0
 * @category constructors
 */
export const suspend: <Input, Error, Output, Value>(
  self: Function.LazyArg<Syntax<Input, Error, Output, Value>>
) => Syntax<Input, Error, Output, Value> = internal.suspend

/**
 * Maps the parser's successful result with the given function `to`, and maps
 * the value to be printed with the given function `from`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transform: {
  <Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ): Syntax<Input, Error, Output, Value2>
} = internal.transform

/**
 * Maps the parser's successful result with the given function `to`, and maps
 * the value to be printed with the given function `from`. Both of the mapping
 * functions can fail the parser/printer.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transformEither: {
  <Error, Value, Value2>(
    to: (value: Value) => Either.Either<Value2, Error>,
    from: (value: Value2) => Either.Either<Value, Error>
  ): <Input, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Either.Either<Value2, Error>,
    from: (value: Value2) => Either.Either<Value, Error>
  ): Syntax<Input, Error, Output, Value2>
} = internal.transformEither

/**
 * Maps the parser's successful result with the given function `to`, and maps
 * the value to be printed with the given function `from`. Both of the mapping
 * functions can fail the parser/printer. The failure is indicated in the error
 * channel by the value `None`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transformOption: {
  <Value, Value2>(
    to: (value: Value) => Option.Option<Value2>,
    from: (value: Value2) => Option.Option<Value>
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Option.Option<Error>, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Option.Option<Value2>,
    from: (value: Value2) => Option.Option<Value>
  ): Syntax<Input, Option.Option<Error>, Output, Value2>
} = internal.transformOption

/**
 * Maps the parsed value with the function `to`, and the value to be printed
 * with the partial function `from`. It the partial function is not defined
 * on the value, the printer fails with the specified `error`.
 *
 * This can be used to define separate syntaxes for subtypes, that can be later combined.
 *
 * @since 1.0.0
 * @category transformTo
 */
export const transformTo: {
  <Error2, Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Option.Option<Value>,
    error: Error2
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error2 | Error, Output, Value2>
  <Input, Error, Output, Value, Error2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Option.Option<Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, Value2>
} = internal.transformTo

/**
 * Constructs a `Syntax` that results in `void`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unit: () => Syntax<unknown, never, never, void> = internal.unit

/**
 * Constructs a `Syntax` that executes a regular expression on the input and
 * results in the chunk of the parsed characters. The regex should never fail.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegex: (regex: Regex) => Syntax<string, never, string, Chunk.Chunk<string>> = internal.unsafeRegex

/**
 * Constructs a `Syntax` that parses using a regular expression and results in
 * the last parsed character. The regex should never fail.
 *
 * Useful for regexes that are known to parse a single character.
 *
 * The printer will print the character provided as input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegexChar: (regex: Regex) => Syntax<string, never, string, string> = internal.unsafeRegexChar

/**
 * Constructs a `Syntax` which parses using the specified regular expression and
 * discards its results. The regex should never fail. When printing, the
 * specified characters are printed.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegexDiscard: (regex: Regex, chars: Iterable<string>) => Syntax<string, never, string, void> =
  internal.unsafeRegexDiscard

/**
 * Constructs a `Syntax` for a single whitespace character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const whitespace: Syntax<string, string, string, string> = internal.whitespace

/**
 * Concatenates this `Syntax` with `that` `Syntax`. If the parser of both
 * syntaxes succeeds, the result is the result of this `Syntax`. Otherwise the
 * `Syntax` fails. The printer executes `this` printer with `void` as the input value
 * and also passes the value to be printed to that printer.
 *
 * Note that the right syntax must have `Value` defined as `void`, because there
 * is no way for the printer to reconstruct an arbitrary input for the right
 * printer.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipLeft: {
  <Input2, Error2, Output2>(
    that: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
} = internal.zipLeft

/**
 * Concatenates this `Syntax` with `that` `Syntax`. If the parser of both
 * syntaxes succeeds, the result is the result of `that` `Syntax`. Otherwise the
 * `Syntax` fails. The printer passes the value to be printed to this printer,
 * and also executes `that` printer with `void` as the input value.
 *
 * Note that the left syntax must have `Value` defined as `void`, because there
 * is no way for the printer to reconstruct an arbitrary input for the left
 * printer.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipRight: {
  <Input2, Error2, Output2, Value2>(
    that: Syntax<Input2, Error2, Output2, Value2>
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, void>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value2>
  <Input, Error, Output, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, void>,
    that: Syntax<Input2, Error2, Output2, Value2>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value2>
} = internal.zipRight

/**
 * Concatenates this syntax with `that` syntax. In case both parser succeeds,
 * the result is a pair of the results.
 *
 * The printer destructures a pair and prints the left value with this, the
 * right value with `that`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zip: {
  <Input2, Error2, Output2, Value2>(
    that: Syntax<Input2, Error2, Output2, Value2>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, readonly [Value, Value2]>
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Syntax<Input2, Error2, Output2, Value2>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, readonly [Value, Value2]>
} = internal.zip
