/**
 * @since 1.0.0
 */
import type { List } from "@effect/data/List"
import type { Option } from "@effect/data/Option"
import * as internal from "@effect/parser/internal_effect_untraced/parserError"

/**
 * @since 1.0.0
 * @category symbols
 */
export const ParserErrorTypeId: unique symbol = internal.ParserErrorTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type ParserErrorTypeId = typeof ParserErrorTypeId

/**
 * Represents an error that occurred during execution of a `Parser`.
 *
 * @since 1.0.0
 * @category models
 */
export type ParserError<Error> =
  | AllBranchesFailed<Error>
  | Failure<Error>
  | NotConsumedAll<Error>
  | UnexpectedEndOfInput
  | UnknownFailure

export declare namespace ParserError {
  export interface Proto {
    readonly [ParserErrorTypeId]: ParserErrorTypeId
  }
}

/**
 * Represents a parser failure where all branches failed in a sequence of
 * `orElse` or `orElseEither` parsers.
 *
 * Every failed branch's failure is preserved.
 *
 * @since 1.0.0
 * @category models
 */
export interface AllBranchesFailed<Error> extends ParserError.Proto {
  readonly _tag: "AllBranchesFailed"
  /**
   * The parser error from the left branch of parsing.
   */
  readonly left: ParserError<Error>
  /**
   * The parser error from the right branch of parsing.
   */
  readonly right: ParserError<Error>
}

/**
 * Represents a custom, user-defined parser error of type `Error`.
 *
 * @since 1.0.0
 * @category models
 */
export interface Failure<Error> extends ParserError.Proto {
  readonly _tag: "Failure"
  /**
   * The stack of named parsers until reaching the failure.
   */
  readonly nameStack: List<string>
  /**
   * The current input stream position.
   */
  readonly position: number
  /**
   * The custom user-defined failure.
   */
  readonly failure: Error
}

/**
 * Represents a failure that occurs if the `Parser` is expected to consume all
 * input but it does not consume all input.
 *
 * @since 1.0.0
 * @category models
 */
export interface NotConsumedAll<Error> extends ParserError.Proto {
  readonly _tag: "NotConsumedAll"
  /**
   * The last failure encountered in the `Parser`, if any.
   */
  readonly lastFailure: Option<ParserError<Error>>
}

/**
 * Represents a failure that occurs if the input stream ends before the `Parser`
 * is done consuming input.
 *
 * @since 1.0.0
 * @category models
 */
export interface UnexpectedEndOfInput extends ParserError.Proto {
  readonly _tag: "UnexpectedEndOfInput"
}

/**
 * Represents an unknown parser error.
 *
 * **Note**: This is only produced in exceptional cases that should not happen,
 * for example if the unsafe regex variants encounter an error.
 *
 * @since 1.0.0
 * @category models
 */
export interface UnknownFailure extends ParserError.Proto {
  readonly _tag: "UnknownFailure"
  /**
   * The stack of named parsers until reaching the failure.
   */
  readonly nameStack: List<string>
  /**
   * The current input stream position.
   */
  readonly position: number
}

/**
 * Constructs a parser failure where all branches failed in a sequence of
 * `orElse` or `orElseEither` parsers.
 *
 * Every failed branch's failure is preserved.
 *
 * @since 1.0.0
 * @category constructors
 */
export const allBranchesFailed: <Error, Error2>(
  left: ParserError<Error>,
  right: ParserError<Error2>
) => ParserError<Error | Error2> = internal.allBranchesFailed

/**
 * Constructs a custom, user-defined parser error of type `Error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const failure: <Error>(nameStack: List<string>, position: number, failure: Error) => ParserError<Error> =
  internal.failure

/**
 * Constructs a failure that occurs if the `Parser` is expected to consume all
 * input but it does not consume all input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const notConsumedAll: <Error>(lastFailure: Option<ParserError<Error>>) => ParserError<Error> =
  internal.notConsumedAll

/**
 * Constructs a failure that occurs if the input stream ends before the `Parser`
 * is done consuming input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unexpectedEndOfInput: ParserError<never> = internal.unexpectedEndOfInput

/**
 * Constructs an unknown parser error.
 *
 * **Note**: This is only produced in exceptional cases that should not happen,
 * for example if the unsafe regex variants encounter an error.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unknownFailure: (nameStack: List<string>, position: number) => ParserError<Error> = internal.unknownFailure

/**
 * Returns `true` if the value is a `ParserError`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isParserError: (u: unknown) => u is ParserError<unknown> = internal.isParserError

/**
 * Returns `true` if the `ParserError` is `AllBranchesFailed`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isAllBranchesFailed: <Error>(self: ParserError<Error>) => self is AllBranchesFailed<Error> =
  internal.isAllBranchesFailed

/**
 * Returns `true` if the `ParserError` is a `Failure`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isFailure: <Error>(self: ParserError<Error>) => self is Failure<Error> = internal.isFailure

/**
 * Returns `true` if the `ParserError` is `NotConsumedAll`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isNotConsumedAll: <Error>(self: ParserError<Error>) => self is NotConsumedAll<Error> =
  internal.isNotConsumedAll

/**
 * Returns `true` if the `ParserError` is `UnexpectedEndOfInput`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isUnexpectedEndOfInput: <Error>(self: ParserError<Error>) => self is UnexpectedEndOfInput =
  internal.isUnexpectedEndOfInput

/**
 * Returns `true` if the `ParserError` is an `UnknownFailure`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isUnknownFailure: <Error>(self: ParserError<Error>) => self is UnknownFailure = internal.isUnknownFailure

/**
 * Adds an additional failed branch to a `ParserError`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const addFailedBranch: {
  <Error2>(that: ParserError<Error2>): <Error>(self: ParserError<Error>) => ParserError<Error2 | Error>
  <Error, Error2>(self: ParserError<Error>, that: ParserError<Error2>): ParserError<Error | Error2>
} = internal.addFailedBranch

/**
 * Maps over the `Error` type of a `ParserError`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const map: {
  <Error, Error2>(f: (error: Error) => Error2): (self: ParserError<Error>) => ParserError<Error2>
  <Error, Error2>(self: ParserError<Error>, f: (error: Error) => Error2): ParserError<Error2>
} = internal.map
