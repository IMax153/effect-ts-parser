---
title: ParserError.ts
nav_order: 3
parent: Modules
---

## ParserError overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [addFailedBranch](#addfailedbranch)
  - [map](#map)
- [constructors](#constructors)
  - [allBranchesFailed](#allbranchesfailed)
  - [failure](#failure)
  - [notConsumedAll](#notconsumedall)
  - [unexpectedEndOfInput](#unexpectedendofinput)
  - [unknownFailure](#unknownfailure)
- [models](#models)
  - [AllBranchesFailed (interface)](#allbranchesfailed-interface)
  - [Failure (interface)](#failure-interface)
  - [NotConsumedAll (interface)](#notconsumedall-interface)
  - [ParserError (type alias)](#parsererror-type-alias)
  - [UnexpectedEndOfInput (interface)](#unexpectedendofinput-interface)
  - [UnknownFailure (interface)](#unknownfailure-interface)
- [refinements](#refinements)
  - [isAllBranchesFailed](#isallbranchesfailed)
  - [isFailure](#isfailure)
  - [isNotConsumedAll](#isnotconsumedall)
  - [isParserError](#isparsererror)
  - [isUnexpectedEndOfInput](#isunexpectedendofinput)
  - [isUnknownFailure](#isunknownfailure)
- [symbols](#symbols)
  - [ParserErrorTypeId](#parsererrortypeid)
  - [ParserErrorTypeId (type alias)](#parsererrortypeid-type-alias)

---

# combinators

## addFailedBranch

Adds an additional failed branch to a `ParserError`.

**Signature**

```ts
export declare const addFailedBranch: {
  <Error2>(that: ParserError<Error2>): <Error>(self: ParserError<Error>) => ParserError<Error2 | Error>
  <Error, Error2>(self: ParserError<Error>, that: ParserError<Error2>): ParserError<Error | Error2>
}
```

Added in v1.0.0

## map

Maps over the `Error` type of a `ParserError`.

**Signature**

```ts
export declare const map: {
  <Error, Error2>(f: (error: Error) => Error2): (self: ParserError<Error>) => ParserError<Error2>
  <Error, Error2>(self: ParserError<Error>, f: (error: Error) => Error2): ParserError<Error2>
}
```

Added in v1.0.0

# constructors

## allBranchesFailed

Constructs a parser failure where all branches failed in a sequence of
`orElse` or `orElseEither` parsers.

Every failed branch's failure is preserved.

**Signature**

```ts
export declare const allBranchesFailed: <Error, Error2>(
  left: ParserError<Error>,
  right: ParserError<Error2>
) => ParserError<Error | Error2>
```

Added in v1.0.0

## failure

Constructs a custom, user-defined parser error of type `Error`.

**Signature**

```ts
export declare const failure: <Error>(nameStack: List<string>, position: number, failure: Error) => ParserError<Error>
```

Added in v1.0.0

## notConsumedAll

Constructs a failure that occurs if the `Parser` is expected to consume all
input but it does not consume all input.

**Signature**

```ts
export declare const notConsumedAll: <Error>(lastFailure: Option<ParserError<Error>>) => ParserError<Error>
```

Added in v1.0.0

## unexpectedEndOfInput

Constructs a failure that occurs if the input stream ends before the `Parser`
is done consuming input.

**Signature**

```ts
export declare const unexpectedEndOfInput: ParserError<never>
```

Added in v1.0.0

## unknownFailure

Constructs an unknown parser error.

**Note**: This is only produced in exceptional cases that should not happen,
for example if the unsafe regex variants encounter an error.

**Signature**

```ts
export declare const unknownFailure: (nameStack: List<string>, position: number) => ParserError<Error>
```

Added in v1.0.0

# models

## AllBranchesFailed (interface)

Represents a parser failure where all branches failed in a sequence of
`orElse` or `orElseEither` parsers.

Every failed branch's failure is preserved.

**Signature**

```ts
export interface AllBranchesFailed<Error> extends ParserError.Proto {
  readonly _tag: 'AllBranchesFailed'
  /**
   * The parser error from the left branch of parsing.
   */
  readonly left: ParserError<Error>
  /**
   * The parser error from the right branch of parsing.
   */
  readonly right: ParserError<Error>
}
```

Added in v1.0.0

## Failure (interface)

Represents a custom, user-defined parser error of type `Error`.

**Signature**

```ts
export interface Failure<Error> extends ParserError.Proto {
  readonly _tag: 'Failure'
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
```

Added in v1.0.0

## NotConsumedAll (interface)

Represents a failure that occurs if the `Parser` is expected to consume all
input but it does not consume all input.

**Signature**

```ts
export interface NotConsumedAll<Error> extends ParserError.Proto {
  readonly _tag: 'NotConsumedAll'
  /**
   * The last failure encountered in the `Parser`, if any.
   */
  readonly lastFailure: Option<ParserError<Error>>
}
```

Added in v1.0.0

## ParserError (type alias)

Represents an error that occurred during execution of a `Parser`.

**Signature**

```ts
export type ParserError<Error> =
  | AllBranchesFailed<Error>
  | Failure<Error>
  | NotConsumedAll<Error>
  | UnexpectedEndOfInput
  | UnknownFailure
```

Added in v1.0.0

## UnexpectedEndOfInput (interface)

Represents a failure that occurs if the input stream ends before the `Parser`
is done consuming input.

**Signature**

```ts
export interface UnexpectedEndOfInput extends ParserError.Proto {
  readonly _tag: 'UnexpectedEndOfInput'
}
```

Added in v1.0.0

## UnknownFailure (interface)

Represents an unknown parser error.

**Note**: This is only produced in exceptional cases that should not happen,
for example if the unsafe regex variants encounter an error.

**Signature**

```ts
export interface UnknownFailure extends ParserError.Proto {
  readonly _tag: 'UnknownFailure'
  /**
   * The stack of named parsers until reaching the failure.
   */
  readonly nameStack: List<string>
  /**
   * The current input stream position.
   */
  readonly position: number
}
```

Added in v1.0.0

# refinements

## isAllBranchesFailed

Returns `true` if the `ParserError` is `AllBranchesFailed`, `false` otherwise.

**Signature**

```ts
export declare const isAllBranchesFailed: <Error>(self: ParserError<Error>) => self is AllBranchesFailed<Error>
```

Added in v1.0.0

## isFailure

Returns `true` if the `ParserError` is a `Failure`, `false` otherwise.

**Signature**

```ts
export declare const isFailure: <Error>(self: ParserError<Error>) => self is Failure<Error>
```

Added in v1.0.0

## isNotConsumedAll

Returns `true` if the `ParserError` is `NotConsumedAll`, `false` otherwise.

**Signature**

```ts
export declare const isNotConsumedAll: <Error>(self: ParserError<Error>) => self is NotConsumedAll<Error>
```

Added in v1.0.0

## isParserError

Returns `true` if the value is a `ParserError`, `false` otherwise.

**Signature**

```ts
export declare const isParserError: (u: unknown) => u is ParserError<unknown>
```

Added in v1.0.0

## isUnexpectedEndOfInput

Returns `true` if the `ParserError` is `UnexpectedEndOfInput`, `false` otherwise.

**Signature**

```ts
export declare const isUnexpectedEndOfInput: <Error>(self: ParserError<Error>) => self is UnexpectedEndOfInput
```

Added in v1.0.0

## isUnknownFailure

Returns `true` if the `ParserError` is an `UnknownFailure`, `false` otherwise.

**Signature**

```ts
export declare const isUnknownFailure: <Error>(self: ParserError<Error>) => self is UnknownFailure
```

Added in v1.0.0

# symbols

## ParserErrorTypeId

**Signature**

```ts
export declare const ParserErrorTypeId: typeof ParserErrorTypeId
```

Added in v1.0.0

## ParserErrorTypeId (type alias)

**Signature**

```ts
export type ParserErrorTypeId = typeof ParserErrorTypeId
```

Added in v1.0.0
