/**
 * @since 1.0.0
 */
import type { List } from "effect/List"
import type { Option } from "effect/Option"
import * as InternalParserError from "./internal/parserError.js"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TypeId: unique symbol = InternalParserError.TypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TypeId = typeof TypeId

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

/**
 * @since 1.0.0
 */
export declare namespace ParserError {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto {
    readonly [TypeId]: TypeId
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
) => ParserError<Error | Error2> = InternalParserError.allBranchesFailed

/**
 * Constructs a custom, user-defined parser error of type `Error`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const failure: <Error>(nameStack: List<string>, position: number, failure: Error) => ParserError<Error> =
  InternalParserError.failure

/**
 * Constructs a failure that occurs if the `Parser` is expected to consume all
 * input but it does not consume all input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const notConsumedAll: <Error>(lastFailure: Option<ParserError<Error>>) => ParserError<Error> =
  InternalParserError.notConsumedAll

/**
 * Constructs a failure that occurs if the input stream ends before the `Parser`
 * is done consuming input.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unexpectedEndOfInput: ParserError<never> = InternalParserError.unexpectedEndOfInput

/**
 * Constructs an unknown parser error.
 *
 * **Note**: This is only produced in exceptional cases that should not happen,
 * for example if the unsafe regex variants encounter an error.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unknownFailure: (nameStack: List<string>, position: number) => ParserError<Error> =
  InternalParserError.unknownFailure

/**
 * Returns `true` if the value is a `ParserError`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isParserError: (u: unknown) => u is ParserError<unknown> = InternalParserError.isParserError

/**
 * Returns `true` if the `ParserError` is `AllBranchesFailed`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isAllBranchesFailed: <Error>(self: ParserError<Error>) => self is AllBranchesFailed<Error> =
  InternalParserError.isAllBranchesFailed

/**
 * Returns `true` if the `ParserError` is a `Failure`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isFailure: <Error>(self: ParserError<Error>) => self is Failure<Error> = InternalParserError.isFailure

/**
 * Returns `true` if the `ParserError` is `NotConsumedAll`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isNotConsumedAll: <Error>(self: ParserError<Error>) => self is NotConsumedAll<Error> =
  InternalParserError.isNotConsumedAll

/**
 * Returns `true` if the `ParserError` is `UnexpectedEndOfInput`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isUnexpectedEndOfInput: <Error>(self: ParserError<Error>) => self is UnexpectedEndOfInput =
  InternalParserError.isUnexpectedEndOfInput

/**
 * Returns `true` if the `ParserError` is an `UnknownFailure`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isUnknownFailure: <Error>(self: ParserError<Error>) => self is UnknownFailure =
  InternalParserError.isUnknownFailure

/**
 * Adds an additional failed branch to a `ParserError`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const addFailedBranch: {
  <Error2>(that: ParserError<Error2>): <Error>(self: ParserError<Error>) => ParserError<Error2 | Error>
  <Error, Error2>(self: ParserError<Error>, that: ParserError<Error2>): ParserError<Error | Error2>
} = InternalParserError.addFailedBranch

/**
 * Maps over the `Error` type of a `ParserError`.
 *
 * @since 1.0.0
 * @category combinators
 */
export const map: {
  <Error, Error2>(f: (error: Error) => Error2): (self: ParserError<Error>) => ParserError<Error2>
  <Error, Error2>(self: ParserError<Error>, f: (error: Error) => Error2): ParserError<Error2>
} = InternalParserError.map
