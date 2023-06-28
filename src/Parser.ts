/**
 * @since 1.0.0
 */
import type { Chunk, NonEmptyChunk } from "@effect/data/Chunk"
import type { Either } from "@effect/data/Either"
import type { LazyArg } from "@effect/data/Function"
import type { Option } from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import * as internal from "@effect/parser/internal_effect_untraced/parser"
import type { ParserError } from "@effect/parser/ParserError"
import type { Regex } from "@effect/parser/Regex"

/**
 * @since 1.0.0
 * @category symbols
 */
export const ParserTypeId: unique symbol = internal.ParserTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type ParserTypeId = typeof ParserTypeId

/**
 * A `Parser` consumes a stream of `Input`s and either fails with a `ParserError`
 * possibly holding a custom error of type `Error` or succeeds with a result of
 * type `Result`.
 *
 * `Parser`s can be combined with `Printer`s to get `Syntax`, or a `Parser` and
 * a `Printer` can be built simultaneously by using the combinators of `Syntax`.
 *
 * Recursive parsers can be expressed directly by recursing in one of the
 * zipping or or-else combinators.
 *
 * By default a parser backtracks automatically. This behavior can be changed
 * with the `manualBacktracking` operator.
 *
 * Parsers trees get optimized automatically before running the parser. This
 * optimized tree can be examined by the `optimized` field. For the full list
 * of transformations performed in the optimization phase check the
 * implementation of the `optimizeNode` method.
 *
 * @since 1.0.0
 * @category models
 */
export interface Parser<Input, Error, Result> extends Parser.Variance<Input, Error, Result> {}

/**
 * @since 1.0.0
 */
export declare namespace Parser {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<Input, Error, Result> {
    readonly [ParserTypeId]: {
      readonly _Input: (_: Input) => void
      readonly _Error: (_: never) => Error
      readonly _Result: (_: never) => Result
    }
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type Implementation = "stack-safe" | "recursive"
}

/**
 * Constructs a `Parser` of a single alpha-numeric character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const alphaNumeric: Parser<string, string, string> = internal.alphaNumeric

/**
 * Constructs a `Parser` that just results with its input value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anything: <Input>() => Parser<Input, never, Input> = internal.anything

/**
 * Constructs a `Parser` that consumes a single character and returns it.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyChar: Parser<string, never, string> = internal.anyChar

/**
 * Constructs a `Parser` that consumes the whole input and captures it as a
 * string.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyString: Parser<string, never, string> = internal.anyString

/**
 * Ignores the parser's successful result and result in 'result' instead
 *
 * @since 1.0.0
 * @category combinators
 */
export const as: {
  <Result, Result2>(
    result: Result2
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error, Result2>
  <Input, Error, Result, Result2>(
    self: Parser<Input, Error, Result>,
    result: Result2
  ): Parser<Input, Error, Result2>
} = internal.as

/**
 * Maps the result of this parser to the unit value.
 *
 * @since 1.0.0
 * @category combinators
 */
export const asUnit: <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, void> =
  internal.asUnit

/**
 * Repeats this parser at least `min` times.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed. If auto-backtracking is enabled,
 * the parser backtracks to the end of the last successful item.
 *
 * @since 1.0.0
 * @category combinators
 */
export const atLeast: {
  (min: number): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Chunk<Result>>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, min: number): Parser<Input, Error, Chunk<Result>>
} = internal.atLeast

/**
 * Enables auto-backtracking for this parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const autoBacktracking: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Result> = internal.autoBacktracking

/**
 * Resets the parsing position if the specified parser fails.
 *
 * By default backtracking points are automatically inserted. This behavior can
 * be changed with the `autoBacktracking`, `manualBacktracking` and
 * `setAutoBacktracking` combinators.
 *
 * @since 1.0.0
 * @category combinators
 */
export const backtrack: <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Result> =
  internal.backtrack

/**
 * Concatenates the parsers `left`, then this, then `right`.
 *
 * All three must succeed. The result is this parser's result.
 *
 * @since 1.0.0
 * @category combinators
 */
export const between: {
  <Input2, Error2, Result2, Input3, Error3, Result3>(
    left: Parser<Input2, Error2, Result2>,
    right: Parser<Input3, Error3, Result3>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2 & Input3, Error2 | Error3 | Error, Result>
  <Input, Error, Result, Input2, Error2, Result2, Input3, Error3, Result3>(
    self: Parser<Input, Error, Result>,
    left: Parser<Input2, Error2, Result2>,
    right: Parser<Input3, Error3, Result3>
  ): Parser<Input & Input2 & Input3, Error | Error2 | Error3, Result>
} = internal.between

/**
 * Ignores this parser's result and instead capture the input string.
 *
 * @since 1.0.0
 * @category combinators
 */
export const captureString: <Error, Result>(self: Parser<string, Error, Result>) => Parser<string, Error, string> =
  internal.captureString

/**
 * Constructs a `Parser` that consumes the exact character specified or fails
 * with the specified `error` if it did not match (if provided).
 *
 * @since 1.0.0
 * @category constructors
 */
export const char: <Error = string>(char: string, error?: Error) => Parser<string, Error, void> = internal.char

/**
 * Constructs a `Parser` that consumes a single character and succeeds with it
 * if it is one of the specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charIn: (chars: Iterable<string>) => Parser<string, string, string> = internal.charIn

/**
 * Constructs a `Parser` of a single digit.
 *
 * @since 1.0.0
 * @category constructors
 */
export const digit: Parser<string, string, string> = internal.digit

/**
 * Constructs a `Parser` that only succeeds if the input stream has been
 * consumed fully.
 *
 * This can be used to require that a parser consumes the full input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const end: Parser<unknown, never, void> = internal.end

/**
 * Repeats this parser exactly the specified number of `times`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const exactly: {
  (times: number): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Chunk<Result>>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, times: number): Parser<Input, Error, Chunk<Result>>
} = internal.exactly

/**
 * Parser that always fails with the specified `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fail: <Error>(error: Error) => Parser<unknown, Error, never> = internal.fail

/**
 * Checks the result of this parser with the specified `predicate`. If the
 * specified predicate is `false`, the parser fails with the given error.
 *
 * @since 1.0.0
 * @category combinators
 */
export const filter: {
  <Result, Error2>(
    predicate: Predicate<Result>,
    error: Error2
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2 | Error, Result>
  <Input, Error, Result, Error2>(
    self: Parser<Input, Error, Result>,
    predicate: Predicate<Result>,
    error: Error2
  ): Parser<Input, Error | Error2, Result>
} = internal.filter

/**
 * Determines the continuation of the parser by the result of this parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flatMap: {
  <Result, Input2, Error2, Result2>(
    f: (result: Result) => Parser<Input2, Error2, Result2>
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    f: (result: Result) => Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result2>
} = internal.flatMap

/**
 * Flattens a result of parsed strings to a single string.
 *
 * @since 1.0.0
 * @category combinators
 */
export const flatten: <Input, Error>(self: Parser<Input, Error, Chunk<string>>) => Parser<Input, Error, string> =
  internal.flatten

/**
 * Constructs `Parser` that results in the current input stream position.
 *
 * @since 1.0.0
 * @category constructors
 */
export const index: Parser<unknown, never, number> = internal.index

/**
 * Constructs a `Parser` that consumes and discards all the remaining input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const ignoreRest: Parser<string, never, void> = internal.ignoreRest

/**
 * Constructs a `Parser` of a single letter.
 *
 * @since 1.0.0
 * @category constructors
 */
export const letter: Parser<string, string, string> = internal.letter

/**
 * Disables auto-backtracking for this parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const manualBacktracking: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Result> = internal.manualBacktracking

/**
 * Maps the parser's successful result with the specified function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const map: {
  <Result, Result2>(
    f: (result: Result) => Result2
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error, Result2>
  <Input, Error, Result, Result2>(
    self: Parser<Input, Error, Result>,
    f: (result: Result) => Result2
  ): Parser<Input, Error, Result2>
} = internal.map

/**
 * Maps the over the error channel of a parser with the specified function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const mapError: {
  <Error, Error2>(
    f: (error: Error) => Error2
  ): <Input, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2, Result>
  <Input, Error, Result, Error2>(
    self: Parser<Input, Error, Result>,
    f: (error: Error) => Error2
  ): Parser<Input, Error2, Result>
} = internal.mapError

/**
 * Associates a name with this parser. The chain of named parsers are reported
 * in case of failure to help with debugging parser issues.
 *
 * @since 1.0.0
 * @category combinators
 */
export const named: {
  (name: string): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, name: string): Parser<Input, Error, Result>
} = internal.named

/**
 * Fails the parser with the specified `error` if this parser succeeds.
 *
 * @since 1.0.0
 * @category combinators
 */
export const not: {
  <Error2>(error: Error2): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error2, void>
  <Input, Error, Result, Error2>(self: Parser<Input, Error, Result>, error: Error2): Parser<Input, Error2, void>
} = internal.not

/**
 * Constructs a `Parser` that consumes a single character and fails with the
 * specified `error` if it matches the specified character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const notChar: <Error = string>(char: string, error?: Error) => Parser<string, Error, string> = internal.notChar

/**
 * Make this parser optional.
 *
 * Failure of this parser will be ignored. If auto-backtracking is enabled,
 * backtracking will be performed.
 *
 * @since 1.0.0
 * @category combinators
 */
export const optional: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Option<Result>> = internal.optional

/**
 * Assigns `that` parser as a fallback of this parser.
 *
 * First this parser gets evaluated. In case it succeeds, the result is this
 * parser's result. In case it fails, the result is `that` parser's result.
 *
 * If auto-backtracking is on, this parser will backtrack before trying `that` parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElse: {
  <Input2, Error2, Result2>(
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2 | Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): Parser<Input & Input2, Error | Error2, Result | Result2>
} = internal.orElse

/**
 * Assigns `that` parser as a fallback of this.
 *
 * First this parser gets evaluated. In case it succeeds, the result is this
 * parser's result wrapped in `Left`. In case it fails, the result is `that`
 * parser's result, wrapped in `Right`.
 *
 * Compared to `orElse`, this version allows the two parsers to have different
 * result types.
 *
 * If auto-backtracking is on, this parser will backtrack before trying `that`
 * parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const orElseEither: {
  <Input2, Error2, Result2>(
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Either<Result, Result2>>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): Parser<Input & Input2, Error | Error2, Either<Result, Result2>>
} = internal.orElseEither

/**
 * Run a `Parser` on the given `input` string.
 *
 * @since 1.0.0
 * @category execution
 */
export const parseString: {
  (input: string): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Either<ParserError<Error>, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, input: string): Either<ParserError<Error>, Result>
} = internal.parseString

/**
 * Run a `Parser` on the given `input` string using a specific parser
 * implementation.
 *
 * @since 1.0.0
 * @category execution
 */
export const parseStringWith: {
  (
    input: string,
    implementation: Parser.Implementation
  ): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Either<ParserError<Error>, Result>
  <Input, Error, Result>(
    self: Parser<Input, Error, Result>,
    input: string,
    implementation: Parser.Implementation
  ): Either<ParserError<Error>, Result>
} = internal.parseStringWith

/**
 * Constructs a `Parser` that executes a regular expression on the input and
 * results in the chunk of the parsed characters, or fails with the specified
 * `error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regex: <Error>(regex: Regex, error: Error) => Parser<string, Error, Chunk<string>> = internal.regex

/**
 * Constructs a `Parser` that executes a regular expression on the input and
 * results in the last parsed character, or fails with the specified `error`.
 *
 * Useful for regexes that are known to parse a single character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexChar: <Error>(regex: Regex, error: Error) => Parser<unknown, Error, string> = internal.regexChar

/**
 * Constructs a `Parser` that executes a regular expression on the input but
 * discards its result, and fails with the specified `error` if the regex fails.
 *
 * @since 1.0.0
 * @category constructors
 */
export const regexDiscard: <Error>(regex: Regex, error: Error) => Parser<string, Error, void> = internal.regexDiscard

/**
 * Repeats this parser zero or more times.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed. If auto-backtracking is enabled,
 * the parser backtracks to the end of the last successful item.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Chunk<Result>> = internal.repeat

/**
 * Repeats this parser at least once.
 *
 * The result is all the parsed elements until the first failure. The failure
 * that stops the repetition gets swallowed. If auto-backtracking is enabled,
 * the parser backtracks to the end of the last successful item.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeat1: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, NonEmptyChunk<Result>> = internal.repeat1

/**
 * Repeats this parser until the given `stopCondition` parser succeeds.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatUntil: {
  <Input2, Error2>(
    stopCondition: Parser<Input2, Error2, void>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Chunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    stopCondition: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, Chunk<Result>>
} = internal.repeatUntil

/**
 * Repeats this parser zero or more times and requires that between each
 * element, the `separator` parser succeeds.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator: {
  <Input2, Error2>(
    separator: Parser<Input2, Error2, void>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Chunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    separator: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, Chunk<Result>>
} = internal.repeatWithSeparator

/**
 * Repeats this parser at least once and requires that between each element,
 * the `separator` parser succeeds.
 *
 * @since 1.0.0
 * @category combinators
 */
export const repeatWithSeparator1: {
  <Input2, Error2>(
    separator: Parser<Input2, Error2, void>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, NonEmptyChunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    separator: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, NonEmptyChunk<Result>>
} = internal.repeatWithSeparator1

/**
 * Enables or disables auto-backtracking for this parser.
 *
 * @since 1.0.0
 * @category combinators
 */
export const setAutoBacktracking: {
  (enabled: boolean): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, enabled: boolean): Parser<Input, Error, Result>
} = internal.setAutoBacktracking

/**
 * Constructs a `Parser` that parses the specified string and results in the
 * specified `result`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const string: <Result>(str: string, result: Result) => Parser<string, string, Result> = internal.string

/**
 * Constructs a `Parser` that does not consume any input and succeeds with the
 * specified value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <Result>(result: Result) => Parser<unknown, never, Result> = internal.succeed

/**
 * Lazily constructs a `Parser`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const suspend: <Input, Error, Result>(
  parser: LazyArg<Parser<Input, Error, Result>>
) => Parser<Input, Error, Result> = internal.suspend

/**
 * Surrounds this parser with the `other` parser. The result is this parser's
 * result.
 *
 * @since 1.0.0
 * @category combinators
 */
export const surroundedBy: {
  <Input2, Error2, Result2>(
    other: Parser<Input2, Error2, Result2>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    other: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result>
} = internal.surroundedBy

/**
 * Maps the parser's successful result with the specified function that either
 * fails or produces a new result value.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transformEither: {
  <Result, Error2, Result2>(
    f: (result: Result) => Either<Error2, Result2>
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2, Result2>
  <Input, Error, Result, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    f: (result: Result) => Either<Error2, Result2>
  ): Parser<Input, Error2, Result2>
} = internal.transformEither

/**
 * Maps the parser's successful result with the specified function that either
 * produces a new result value. Failure is indicated in the error channel by the
 * value `None`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const transformOption: {
  <Result, Result2>(
    pf: (result: Result) => Option<Result2>
  ): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Option<Error>, Result2>
  <Input, Error, Result, Result2>(
    self: Parser<Input, Error, Result>,
    pf: (result: Result) => Option<Result2>
  ): Parser<Input, Option<Error>, Result2>
} = internal.transformOption

/**
 * Constructs a `Parser` that does not consume the input and results in unit.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unit: () => Parser<unknown, never, void> = internal.unit

/**
 * Constructs a `Parser` that executes a regular expression on the input and
 * results in the chunk of the parsed characters. The regex is supposed to never
 * fail.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegex: (regex: Regex) => Parser<string, never, Chunk<string>> = internal.unsafeRegex

/**
 * Constructs a `Parser` that executes a regular expression on the input and
 * results in the last parsed character. The regex is supposed to never fail.
 *
 * Useful for regexes that are known to parse a single character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegexChar: (regex: Regex) => Parser<string, never, string> = internal.unsafeRegexChar

/**
 * Constructs a `Parser` that executes a regular expression on the input but
 * discards its result. The regex is supposed to never fail.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unsafeRegexDiscard: (regex: Regex) => Parser<string, never, void> = internal.unsafeRegexDiscard

/**
 * Constructs a `Parser` of a single whitespace character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const whitespace: Parser<string, string, string> = internal.whitespace

/**
 * Concatenates this parser with `that` parser. In case both parser succeeds,
 * the result is a pair of the results.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zip: {
  <Input2, Error2, Result2>(
    that: Parser<Input2, Error2, Result2>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, [Result, Result2]>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, [Result, Result2]>
} = internal.zip

/**
 * Concatenates this parser with `that` parser. In case both parser succeeds,
 * the result is the result of this parser. Otherwise the parser fails.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipLeft: {
  <Input2, Error2, Result2>(
    that: Parser<Input2, Error2, Result2>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result>
} = internal.zipLeft

/**
 * Concatenates this parser with `that` parser. In case both parser succeeds,
 * the result is the result of `that` parser. Otherwise the parser fails.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipRight: {
  <Input2, Error2, Result2>(
    that: Parser<Input2, Error2, Result2>
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result2>
} = internal.zipRight

/**
 * Concatenates this parser with `that` parser. In case both parser succeeds,
 * the result is computed using the specified `zip` function.
 *
 * @since 1.0.0
 * @category combinators
 */
export const zipWith: {
  <Input2, Error2, Result2, Result, Result3>(
    that: Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result3>
  <Input, Error, Result, Input2, Error2, Result2, Result3>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ): Parser<Input & Input2, Error | Error2, Result3>
} = internal.zipWith
