---
title: Parser.ts
nav_order: 2
parent: Modules
---

## Parser overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [as](#as)
  - [asUnit](#asunit)
  - [atLeast](#atleast)
  - [autoBacktracking](#autobacktracking)
  - [backtrack](#backtrack)
  - [between](#between)
  - [captureString](#capturestring)
  - [exactly](#exactly)
  - [filter](#filter)
  - [flatMap](#flatmap)
  - [flatten](#flatten)
  - [manualBacktracking](#manualbacktracking)
  - [map](#map)
  - [mapError](#maperror)
  - [named](#named)
  - [not](#not)
  - [optional](#optional)
  - [orElse](#orelse)
  - [orElseEither](#orelseeither)
  - [repeat](#repeat)
  - [repeat1](#repeat1)
  - [repeatUntil](#repeatuntil)
  - [repeatWithSeparator](#repeatwithseparator)
  - [repeatWithSeparator1](#repeatwithseparator1)
  - [setAutoBacktracking](#setautobacktracking)
  - [surroundedBy](#surroundedby)
  - [transformEither](#transformeither)
  - [transformOption](#transformoption)
  - [zip](#zip)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
  - [zipWith](#zipwith)
- [constructors](#constructors)
  - [alphaNumeric](#alphanumeric)
  - [anyChar](#anychar)
  - [anyString](#anystring)
  - [anything](#anything)
  - [char](#char)
  - [charIn](#charin)
  - [digit](#digit)
  - [end](#end)
  - [fail](#fail)
  - [ignoreRest](#ignorerest)
  - [index](#index)
  - [letter](#letter)
  - [notChar](#notchar)
  - [regex](#regex)
  - [regexChar](#regexchar)
  - [regexDiscard](#regexdiscard)
  - [string](#string)
  - [succeed](#succeed)
  - [unit](#unit)
  - [unsafeRegex](#unsaferegex)
  - [unsafeRegexChar](#unsaferegexchar)
  - [unsafeRegexDiscard](#unsaferegexdiscard)
  - [whitespace](#whitespace)
- [execution](#execution)
  - [parseString](#parsestring)
  - [parseStringWith](#parsestringwith)
- [models](#models)
  - [Parser (interface)](#parser-interface)
- [symbols](#symbols)
  - [ParserTypeId](#parsertypeid)
  - [ParserTypeId (type alias)](#parsertypeid-type-alias)

---

# combinators

## as

Ignores the parser's successful result and result in 'result' instead

**Signature**

```ts
export declare const as: {
  <Result, Result2>(result: Result2): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error, Result2>
  <Input, Error, Result, Result2>(self: Parser<Input, Error, Result>, result: Result2): Parser<Input, Error, Result2>
}
```

Added in v1.0.0

## asUnit

Maps the result of this parser to the unit value.

**Signature**

```ts
export declare const asUnit: <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, void>
```

Added in v1.0.0

## atLeast

Repeats this parser at least `min` times.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed. If auto-backtracking is enabled,
the parser backtracks to the end of the last successful item.

**Signature**

```ts
export declare const atLeast: {
  (min: number): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Chunk<Result>>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, min: number): Parser<Input, Error, Chunk<Result>>
}
```

Added in v1.0.0

## autoBacktracking

Enables auto-backtracking for this parser.

**Signature**

```ts
export declare const autoBacktracking: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Result>
```

Added in v1.0.0

## backtrack

Resets the parsing position if the specified parser fails.

By default backtracking points are automatically inserted. This behavior can
be changed with the `autoBacktracking`, `manualBacktracking` and
`setAutoBacktracking` combinators.

**Signature**

```ts
export declare const backtrack: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Result>
```

Added in v1.0.0

## between

Concatenates the parsers `left`, then this, then `right`.

All three must succeed. The result is this parser's result.

**Signature**

```ts
export declare const between: {
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
}
```

Added in v1.0.0

## captureString

Ignores this parser's result and instead capture the input string.

**Signature**

```ts
export declare const captureString: <Error, Result>(
  self: Parser<string, Error, Result>
) => Parser<string, Error, string>
```

Added in v1.0.0

## exactly

Repeats this parser exactly the specified number of `times`.

**Signature**

```ts
export declare const exactly: {
  (times: number): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Chunk<Result>>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, times: number): Parser<Input, Error, Chunk<Result>>
}
```

Added in v1.0.0

## filter

Checks the result of this parser with the specified `predicate`. If the
specified predicate is `false`, the parser fails with the given error.

**Signature**

```ts
export declare const filter: {
  <Result, Error2>(predicate: Predicate<Result>, error: Error2): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2 | Error, Result>
  <Input, Error, Result, Error2>(
    self: Parser<Input, Error, Result>,
    predicate: Predicate<Result>,
    error: Error2
  ): Parser<Input, Error | Error2, Result>
}
```

Added in v1.0.0

## flatMap

Determines the continuation of the parser by the result of this parser.

**Signature**

```ts
export declare const flatMap: {
  <Result, Input2, Error2, Result2>(f: (result: Result) => Parser<Input2, Error2, Result2>): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    f: (result: Result) => Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result2>
}
```

Added in v1.0.0

## flatten

Flattens a result of parsed strings to a single string.

**Signature**

```ts
export declare const flatten: <Input, Error>(self: Parser<Input, Error, Chunk<string>>) => Parser<Input, Error, string>
```

Added in v1.0.0

## manualBacktracking

Disables auto-backtracking for this parser.

**Signature**

```ts
export declare const manualBacktracking: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Result>
```

Added in v1.0.0

## map

Maps the parser's successful result with the specified function.

**Signature**

```ts
export declare const map: {
  <Result, Result2>(f: (result: Result) => Result2): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error, Result2>
  <Input, Error, Result, Result2>(self: Parser<Input, Error, Result>, f: (result: Result) => Result2): Parser<
    Input,
    Error,
    Result2
  >
}
```

Added in v1.0.0

## mapError

Maps the over the error channel of a parser with the specified function.

**Signature**

```ts
export declare const mapError: {
  <Error, Error2>(f: (error: Error) => Error2): <Input, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2, Result>
  <Input, Error, Result, Error2>(self: Parser<Input, Error, Result>, f: (error: Error) => Error2): Parser<
    Input,
    Error2,
    Result
  >
}
```

Added in v1.0.0

## named

Associates a name with this parser. The chain of named parsers are reported
in case of failure to help with debugging parser issues.

**Signature**

```ts
export declare const named: {
  (name: string): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, name: string): Parser<Input, Error, Result>
}
```

Added in v1.0.0

## not

Fails the parser with the specified `error` if this parser succeeds.

**Signature**

```ts
export declare const not: {
  <Error2>(error: Error2): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error2, void>
  <Input, Error, Result, Error2>(self: Parser<Input, Error, Result>, error: Error2): Parser<Input, Error2, void>
}
```

Added in v1.0.0

## optional

Make this parser optional.

Failure of this parser will be ignored. If auto-backtracking is enabled,
backtracking will be performed.

**Signature**

```ts
export declare const optional: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Option<Result>>
```

Added in v1.0.0

## orElse

Assigns `that` parser as a fallback of this parser.

First this parser gets evaluated. In case it succeeds, the result is this
parser's result. In case it fails, the result is `that` parser's result.

If auto-backtracking is on, this parser will backtrack before trying `that` parser.

**Signature**

```ts
export declare const orElse: {
  <Input2, Error2, Result2>(that: LazyArg<Parser<Input2, Error2, Result2>>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2 | Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): Parser<Input & Input2, Error | Error2, Result | Result2>
}
```

Added in v1.0.0

## orElseEither

Assigns `that` parser as a fallback of this.

First this parser gets evaluated. In case it succeeds, the result is this
parser's result wrapped in `Left`. In case it fails, the result is `that`
parser's result, wrapped in `Right`.

Compared to `orElse`, this version allows the two parsers to have different
result types.

If auto-backtracking is on, this parser will backtrack before trying `that`
parser.

**Signature**

```ts
export declare const orElseEither: {
  <Input2, Error2, Result2>(that: LazyArg<Parser<Input2, Error2, Result2>>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Either<Result, Result2>>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: LazyArg<Parser<Input2, Error2, Result2>>
  ): Parser<Input & Input2, Error | Error2, Either<Result, Result2>>
}
```

Added in v1.0.0

## repeat

Repeats this parser zero or more times.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed. If auto-backtracking is enabled,
the parser backtracks to the end of the last successful item.

**Signature**

```ts
export declare const repeat: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, Chunk<Result>>
```

Added in v1.0.0

## repeat1

Repeats this parser at least once.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed. If auto-backtracking is enabled,
the parser backtracks to the end of the last successful item.

**Signature**

```ts
export declare const repeat1: <Input, Error, Result>(
  self: Parser<Input, Error, Result>
) => Parser<Input, Error, NonEmptyChunk<Result>>
```

Added in v1.0.0

## repeatUntil

Repeats this parser until the given `stopCondition` parser succeeds.

**Signature**

```ts
export declare const repeatUntil: {
  <Input2, Error2>(stopCondition: Parser<Input2, Error2, void>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Chunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    stopCondition: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, Chunk<Result>>
}
```

Added in v1.0.0

## repeatWithSeparator

Repeats this parser zero or more times and requires that between each
element, the `separator` parser succeeds.

**Signature**

```ts
export declare const repeatWithSeparator: {
  <Input2, Error2>(separator: Parser<Input2, Error2, void>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Chunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    separator: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, Chunk<Result>>
}
```

Added in v1.0.0

## repeatWithSeparator1

Repeats this parser at least once and requires that between each element,
the `separator` parser succeeds.

**Signature**

```ts
export declare const repeatWithSeparator1: {
  <Input2, Error2>(separator: Parser<Input2, Error2, void>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, NonEmptyChunk<Result>>
  <Input, Error, Result, Input2, Error2>(
    self: Parser<Input, Error, Result>,
    separator: Parser<Input2, Error2, void>
  ): Parser<Input & Input2, Error | Error2, NonEmptyChunk<Result>>
}
```

Added in v1.0.0

## setAutoBacktracking

Enables or disables auto-backtracking for this parser.

**Signature**

```ts
export declare const setAutoBacktracking: {
  (enabled: boolean): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input, Error, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, enabled: boolean): Parser<Input, Error, Result>
}
```

Added in v1.0.0

## surroundedBy

Surrounds this parser with the `other` parser. The result is this parser's
result.

**Signature**

```ts
export declare const surroundedBy: {
  <Input2, Error2, Result2>(other: Parser<Input2, Error2, Result2>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    other: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result>
}
```

Added in v1.0.0

## transformEither

Maps the parser's successful result with the specified function that either
fails or produces a new result value.

**Signature**

```ts
export declare const transformEither: {
  <Result, Error2, Result2>(f: (result: Result) => Either<Error2, Result2>): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Error2, Result2>
  <Input, Error, Result, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    f: (result: Result) => Either<Error2, Result2>
  ): Parser<Input, Error2, Result2>
}
```

Added in v1.0.0

## transformOption

Maps the parser's successful result with the specified function that either
produces a new result value. Failure is indicated in the error channel by the
value `None`.

**Signature**

```ts
export declare const transformOption: {
  <Result, Result2>(pf: (result: Result) => Option<Result2>): <Input, Error>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input, Option<Error>, Result2>
  <Input, Error, Result, Result2>(self: Parser<Input, Error, Result>, pf: (result: Result) => Option<Result2>): Parser<
    Input,
    Option<Error>,
    Result2
  >
}
```

Added in v1.0.0

## zip

Concatenates this parser with `that` parser. In case both parser succeeds,
the result is a pair of the results.

**Signature**

```ts
export declare const zip: {
  <Input2, Error2, Result2>(that: Parser<Input2, Error2, Result2>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, readonly [Result, Result2]>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, readonly [Result, Result2]>
}
```

Added in v1.0.0

## zipLeft

Concatenates this parser with `that` parser. In case both parser succeeds,
the result is the result of this parser. Otherwise the parser fails.

**Signature**

```ts
export declare const zipLeft: {
  <Input2, Error2, Result2>(that: Parser<Input2, Error2, Result2>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result>
}
```

Added in v1.0.0

## zipRight

Concatenates this parser with `that` parser. In case both parser succeeds,
the result is the result of `that` parser. Otherwise the parser fails.

**Signature**

```ts
export declare const zipRight: {
  <Input2, Error2, Result2>(that: Parser<Input2, Error2, Result2>): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Parser<Input & Input2, Error2 | Error, Result2>
  <Input, Error, Result, Input2, Error2, Result2>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>
  ): Parser<Input & Input2, Error | Error2, Result2>
}
```

Added in v1.0.0

## zipWith

Concatenates this parser with `that` parser. In case both parser succeeds,
the result is computed using the specified `zip` function.

**Signature**

```ts
export declare const zipWith: {
  <Input2, Error2, Result2, Result, Result3>(
    that: Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Parser<Input & Input2, Error2 | Error, Result3>
  <Input, Error, Result, Input2, Error2, Result2, Result3>(
    self: Parser<Input, Error, Result>,
    that: Parser<Input2, Error2, Result2>,
    zip: (left: Result, right: Result2) => Result3
  ): Parser<Input & Input2, Error | Error2, Result3>
}
```

Added in v1.0.0

# constructors

## alphaNumeric

Constructs a `Parser` of a single alpha-numeric character.

**Signature**

```ts
export declare const alphaNumeric: Parser<string, string, string>
```

Added in v1.0.0

## anyChar

Constructs a `Parser` that consumes a single character and returns it.

**Signature**

```ts
export declare const anyChar: Parser<string, never, string>
```

Added in v1.0.0

## anyString

Constructs a `Parser` that consumes the whole input and captures it as a
string.

**Signature**

```ts
export declare const anyString: Parser<string, never, string>
```

Added in v1.0.0

## anything

Constructs a `Parser` that just results with its input value.

**Signature**

```ts
export declare const anything: <Input>() => Parser<Input, never, Input>
```

Added in v1.0.0

## char

Constructs a `Parser` that consumes the exact character specified or fails
with the specified `error` if it did not match (if provided).

**Signature**

```ts
export declare const char: <Error = string>(char: string, error?: Error | undefined) => Parser<string, Error, void>
```

Added in v1.0.0

## charIn

Constructs a `Parser` that consumes a single character and succeeds with it
if it is one of the specified characters.

**Signature**

```ts
export declare const charIn: (chars: Iterable<string>) => Parser<string, string, string>
```

Added in v1.0.0

## digit

Constructs a `Parser` of a single digit.

**Signature**

```ts
export declare const digit: Parser<string, string, string>
```

Added in v1.0.0

## end

Constructs a `Parser` that only succeeds if the input stream has been
consumed fully.

This can be used to require that a parser consumes the full input.

**Signature**

```ts
export declare const end: Parser<unknown, never, void>
```

Added in v1.0.0

## fail

Parser that always fails with the specified `error`.

**Signature**

```ts
export declare const fail: <Error>(error: Error) => Parser<unknown, Error, never>
```

Added in v1.0.0

## ignoreRest

Constructs a `Parser` that consumes and discards all the remaining input.

**Signature**

```ts
export declare const ignoreRest: Parser<string, never, void>
```

Added in v1.0.0

## index

Constructs `Parser` that results in the current input stream position.

**Signature**

```ts
export declare const index: Parser<unknown, never, number>
```

Added in v1.0.0

## letter

Constructs a `Parser` of a single letter.

**Signature**

```ts
export declare const letter: Parser<string, string, string>
```

Added in v1.0.0

## notChar

Constructs a `Parser` that consumes a single character and fails with the
specified `error` if it matches the specified character.

**Signature**

```ts
export declare const notChar: <Error = string>(char: string, error?: Error | undefined) => Parser<string, Error, string>
```

Added in v1.0.0

## regex

Constructs a `Parser` that executes a regular expression on the input and
results in the chunk of the parsed characters, or fails with the specified
`error`.

**Signature**

```ts
export declare const regex: <Error>(regex: Regex, error: Error) => Parser<string, Error, Chunk<string>>
```

Added in v1.0.0

## regexChar

Constructs a `Parser` that executes a regular expression on the input and
results in the last parsed character, or fails with the specified `error`.

Useful for regexes that are known to parse a single character.

**Signature**

```ts
export declare const regexChar: <Error>(regex: Regex, error: Error) => Parser<unknown, Error, string>
```

Added in v1.0.0

## regexDiscard

Constructs a `Parser` that executes a regular expression on the input but
discards its result, and fails with the specified `error` if the regex fails.

**Signature**

```ts
export declare const regexDiscard: <Error>(regex: Regex, error: Error) => Parser<string, Error, void>
```

Added in v1.0.0

## string

Constructs a `Parser` that parses the specified string and results in the
specified `result`.

**Signature**

```ts
export declare const string: <Result>(str: string, result: Result) => Parser<string, string, Result>
```

Added in v1.0.0

## succeed

Constructs a `Parser` that does not consume any input and succeeds with the
specified value.

**Signature**

```ts
export declare const succeed: <Result>(result: Result) => Parser<unknown, never, Result>
```

Added in v1.0.0

## unit

Constructs a `Parser` that does not consume the input and results in unit.

**Signature**

```ts
export declare const unit: () => Parser<unknown, never, void>
```

Added in v1.0.0

## unsafeRegex

Constructs a `Parser` that executes a regular expression on the input and
results in the chunk of the parsed characters. The regex is supposed to never
fail.

**Signature**

```ts
export declare const unsafeRegex: (regex: Regex) => Parser<string, never, Chunk<string>>
```

Added in v1.0.0

## unsafeRegexChar

Constructs a `Parser` that executes a regular expression on the input and
results in the last parsed character. The regex is supposed to never fail.

Useful for regexes that are known to parse a single character.

**Signature**

```ts
export declare const unsafeRegexChar: (regex: Regex) => Parser<string, never, string>
```

Added in v1.0.0

## unsafeRegexDiscard

Constructs a `Parser` that executes a regular expression on the input but
discards its result. The regex is supposed to never fail.

**Signature**

```ts
export declare const unsafeRegexDiscard: (regex: Regex) => Parser<string, never, void>
```

Added in v1.0.0

## whitespace

Constructs a `Parser` of a single whitespace character.

**Signature**

```ts
export declare const whitespace: Parser<string, string, string>
```

Added in v1.0.0

# execution

## parseString

Run a `Parser` on the given `input` string.

**Signature**

```ts
export declare const parseString: {
  (input: string): <Input, Error, Result>(self: Parser<Input, Error, Result>) => Either<ParserError<Error>, Result>
  <Input, Error, Result>(self: Parser<Input, Error, Result>, input: string): Either<ParserError<Error>, Result>
}
```

Added in v1.0.0

## parseStringWith

Run a `Parser` on the given `input` string using a specific parser
implementation.

**Signature**

```ts
export declare const parseStringWith: {
  (input: string, implementation: Parser.Implementation): <Input, Error, Result>(
    self: Parser<Input, Error, Result>
  ) => Either<ParserError<Error>, Result>
  <Input, Error, Result>(
    self: Parser<Input, Error, Result>,
    input: string,
    implementation: Parser.Implementation
  ): Either<ParserError<Error>, Result>
}
```

Added in v1.0.0

# models

## Parser (interface)

A `Parser` consumes a stream of `Input`s and either fails with a `ParserError`
possibly holding a custom error of type `Error` or succeeds with a result of
type `Result`.

`Parser`s can be combined with `Printer`s to get `Syntax`, or a `Parser` and
a `Printer` can be built simultaneously by using the combinators of `Syntax`.

Recursive parsers can be expressed directly by recursing in one of the
zipping or or-else combinators.

By default a parser backtracks automatically. This behavior can be changed
with the `manualBacktracking` operator.

Parsers trees get optimized automatically before running the parser. This
optimized tree can be examined by the `optimized` field. For the full list
of transformations performed in the optimization phase check the
implementation of the `optimizeNode` method.

**Signature**

```ts
export interface Parser<Input, Error, Result> extends Parser.Variance<Input, Error, Result> {}
```

Added in v1.0.0

# symbols

## ParserTypeId

**Signature**

```ts
export declare const ParserTypeId: typeof ParserTypeId
```

Added in v1.0.0

## ParserTypeId (type alias)

**Signature**

```ts
export type ParserTypeId = typeof ParserTypeId
```

Added in v1.0.0
