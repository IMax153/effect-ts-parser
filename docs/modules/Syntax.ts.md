---
title: Syntax.ts
nav_order: 8
parent: Modules
---

## Syntax overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [as](#as)
  - [asPrinted](#asprinted)
  - [asUnit](#asunit)
  - [atLeast](#atleast)
  - [atMost](#atmost)
  - [autoBacktracking](#autobacktracking)
  - [backtrack](#backtrack)
  - [between](#between)
  - [captureString](#capturestring)
  - [filter](#filter)
  - [flatten](#flatten)
  - [flattenNonEmpty](#flattennonempty)
  - [manualBacktracking](#manualbacktracking)
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
  - [transform](#transform)
  - [transformEither](#transformeither)
  - [transformOption](#transformoption)
  - [zip](#zip)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
- [constructors](#constructors)
  - [alphaNumeric](#alphanumeric)
  - [anyChar](#anychar)
  - [anyString](#anystring)
  - [anything](#anything)
  - [char](#char)
  - [charIn](#charin)
  - [charNot](#charnot)
  - [charNotIn](#charnotin)
  - [digit](#digit)
  - [end](#end)
  - [fail](#fail)
  - [filterChar](#filterchar)
  - [index](#index)
  - [letter](#letter)
  - [regex](#regex)
  - [regexChar](#regexchar)
  - [regexDiscard](#regexdiscard)
  - [string](#string)
  - [succeed](#succeed)
  - [suspend](#suspend)
  - [unit](#unit)
  - [unsafeRegex](#unsaferegex)
  - [unsafeRegexChar](#unsaferegexchar)
  - [unsafeRegexDiscard](#unsaferegexdiscard)
  - [whitespace](#whitespace)
- [execution](#execution)
  - [parseString](#parsestring)
  - [parseStringWith](#parsestringwith)
  - [printString](#printstring)
- [models](#models)
  - [Syntax (interface)](#syntax-interface)
- [symbols](#symbols)
  - [TypeId](#typeid)
  - [TypeId (type alias)](#typeid-type-alias)
- [transformTo](#transformto)
  - [transformTo](#transformto-1)
- [utils](#utils)
  - [Syntax (namespace)](#syntax-namespace)
    - [Variance (interface)](#variance-interface)

---

# combinators

## as

Transforms a `Syntax` that results in `void` in a `Syntax` that results in `value`

**Signature**

```ts
export declare const as: {
  <Value2>(
    value: Value2
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, void>) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value2>(
    self: Syntax<Input, Error, Output, void>,
    value: Value2
  ): Syntax<Input, Error, Output, Value2>
}
```

Added in v1.0.0

## asPrinted

Transforms a `Syntax` that results in `from` in a `Syntax` that results in `value`

**Signature**

```ts
export declare const asPrinted: {
  <Value, Value2>(
    value: Value2,
    from: Value
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    value: Value2,
    from: Value
  ): Syntax<Input, Error, Output, Value2>
}
```

Added in v1.0.0

## asUnit

Transforms a `Syntax` that results in `from` in a `Syntax` that results in `void`

**Signature**

```ts
export declare const asUnit: {
  <Value>(
    from: Value
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, void>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    from: Value
  ): Syntax<Input, Error, Output, void>
}
```

Added in v1.0.0

## atLeast

Repeat this `Syntax` at least `min` number of times.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed and, if auto-backtracking is
enabled, the parser backtracks to the end of the last successful item.

When printing, the input is a chunk of values and each element gets printed.

**Signature**

```ts
export declare const atLeast: {
  (
    min: number
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Chunk<Value>>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    min: number
  ): Syntax<Input, Error, Output, Chunk<Value>>
}
```

Added in v1.0.0

## atMost

Repeat this `Syntax` at most `max` number of times.

**Signature**

```ts
export declare const atMost: {
  (
    max: number
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error, Output, Chunk<Value>>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    max: number
  ): Syntax<Input, Error, Output, Chunk<Value>>
}
```

Added in v1.0.0

## autoBacktracking

Enables auto-backtracking for this syntax.

**Signature**

```ts
export declare const autoBacktracking: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value>
```

Added in v1.0.0

## backtrack

Returns a new `Syntax` that resets the parsing position in case it fails.

By default backtracking points are automatically inserted. This behavior can
be changed with the `autoBacktracking`, `manualBacktracking` and
`setAutoBacktracking` combinators.

Does not affect printing.

**Signature**

```ts
export declare const backtrack: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value>
```

Added in v1.0.0

## between

Concatenates the syntaxes `left`, then this, then `right`.

All three must succeed. The result is this syntax's result.

Note that the `left` and `right` syntaxes must have a `Value` type of `void`.
Otherwise the printer could not produce an arbitrary input value for them as
their result is discarded.

**Signature**

```ts
export declare const between: {
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
}
```

Added in v1.0.0

## captureString

Ignores this syntax's result and instead captures the parsed string fragment
/ directly prints. the input string.

**Signature**

```ts
export declare const captureString: <Error, Output, Value>(
  self: Syntax<string, Error, Output, Value>
) => Syntax<string, Error, string, string>
```

Added in v1.0.0

## filter

Specifies a filter condition that gets checked in both parser and printer
mode and fails with the specified `error` if the predicate evaluates to
`false`.

**Signature**

```ts
export declare const filter: {
  <Value, Error2>(
    predicate: Predicate<Value>,
    error: Error2
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error2 | Error, Output, Value>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    predicate: Predicate<Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, Value>
}
```

Added in v1.0.0

## flatten

Flattens a result of parsed strings to a single string.

**Signature**

```ts
export declare const flatten: <Input, Error, Output>(
  self: Syntax<Input, Error, Output, Chunk<string>>
) => Syntax<Input, Error, Output, string>
```

Added in v1.0.0

## flattenNonEmpty

Flattens a result of parsed strings to a single string.

**Signature**

```ts
export declare const flattenNonEmpty: <Input, Error, Output>(
  self: Syntax<Input, Error, Output, NonEmptyChunk<string>>
) => Syntax<Input, Error, Output, string>
```

Added in v1.0.0

## manualBacktracking

Disables auto-backtracking for this syntax.

**Signature**

```ts
export declare const manualBacktracking: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Value>
```

Added in v1.0.0

## mapError

Maps the error with the specified function.

**Signature**

```ts
export declare const mapError: {
  <Error, Error2>(
    f: (error: Error) => Error2
  ): <Input, Output, Value>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error2, Output, Value>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    f: (error: Error) => Error2
  ): Syntax<Input, Error2, Output, Value>
}
```

Added in v1.0.0

## named

Associates a name with this syntax. The chain of named parsers are reported
in case of failure to help debugging parser issues.

**Signature**

```ts
export declare const named: {
  (
    name: string
  ): <Input, Error, Output, Value>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, Value>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    name: string
  ): Syntax<Input, Error, Output, Value>
}
```

Added in v1.0.0

## not

Inverts the success condition of this `Syntax`, succeeding only if this
syntax fails.

**Signature**

```ts
export declare const not: {
  <Error2>(
    error: Error2
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input, Error2 | Error, Output, void>
  <Input, Error, Output, Value, Error2>(
    self: Syntax<Input, Error, Output, Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, void>
}
```

Added in v1.0.0

## optional

Make this `Syntax` optional.

Failure of the parser will be ignored. If auto-backtracking is enabled,
backtracking will be performed.

**Signature**

```ts
export declare const optional: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Option<Value>>
```

Added in v1.0.0

## orElse

Assigns `that` syntax as a fallback of this. First this parser or printer
gets evaluated. In case it succeeds, the result is this syntax's result. In
case it fails, the result is `that` syntax's result.

If auto-backtracking is on, this parser will backtrack before trying `that`
parser.

Note that both syntaxes require the same `Value` type. For a more flexible
variant, see `Syntax.orElseEither`.

**Signature**

```ts
export declare const orElse: {
  <Input2, Error2, Output2, Value>(
    that: LazyArg<Syntax<Input2, Error2, Output2, Value>>
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    that: LazyArg<Syntax<Input2, Error2, Output2, Value>>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
}
```

Added in v1.0.0

## orElseEither

Assigns `that` syntax as a fallback of this. First this parser or printer
gets evaluated. In case it succeeds, the result is this syntax's result
wrapped in `Left`. In case it fails, the result is 'that' syntax's result,
wrapped in `Right`.

If auto-backtracking is on, this parser will backtrack before trying `that`
parser.

**Signature**

```ts
export declare const orElseEither: {
  <Input2, Error2, Output2, Value2>(
    that: LazyArg<Syntax<Input2, Error2, Output2, Value2>>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Either<Value, Value2>>
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    that: LazyArg<Syntax<Input2, Error2, Output2, Value2>>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Either<Value, Value2>>
}
```

Added in v1.0.0

## repeat

Repeats this `Syntax` zero or more times.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed and, if auto-backtracking is
enabled, the parser backtracks to the end of the last successful item.

When printing, the input is a chunk of values and each element gets printed.

**Signature**

```ts
export declare const repeat: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, Chunk<Value>>
```

Added in v1.0.0

## repeat1

Repeats this `Syntax` at least one time.

The result is all the parsed elements until the first failure. The failure
that stops the repetition gets swallowed and, if auto-backtracking is
enabled, the parser backtracks to the end of the last successful item.

When printing, the input is a chunk of values and each element gets printed.

**Signature**

```ts
export declare const repeat1: <Input, Error, Output, Value>(
  self: Syntax<Input, Error, Output, Value>
) => Syntax<Input, Error, Output, NonEmptyChunk<Value>>
```

Added in v1.0.0

## repeatUntil

Repeats this `Syntax` until the `stopCondition`, which performed after each
element, results in success.

**Signature**

```ts
export declare const repeatUntil: {
  <Input2, Error2, Output2>(
    stopCondition: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Chunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    stopCondition: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk<Value>>
}
```

Added in v1.0.0

## repeatWithSeparator

Repeats this `Syntax` zero or more times and with the `separator` injected
between each element.

**Signature**

```ts
export declare const repeatWithSeparator: {
  <Input2, Error2, Output2>(
    separator: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Chunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    separator: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Chunk<Value>>
}
```

Added in v1.0.0

## repeatWithSeparator1

Repeats this `Syntax` at least once with the `separator` injected between
each element.

**Signature**

```ts
export declare const repeatWithSeparator1: {
  <Input2, Error2, Output2>(
    separator: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, NonEmptyChunk<Value>>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    separator: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, NonEmptyChunk<Value>>
}
```

Added in v1.0.0

## setAutoBacktracking

Enables or disables auto-backtracking for this syntax.

**Signature**

```ts
export declare const setAutoBacktracking: {
  (
    enabled: boolean
  ): <Input, Error, Output, Value>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, Value>
  <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>,
    enabled: boolean
  ): Syntax<Input, Error, Output, Value>
}
```

Added in v1.0.0

## surroundedBy

Surrounds this `Syntax` with the `other` syntax. The result is this syntax's
result.

**Signature**

```ts
export declare const surroundedBy: {
  <Input2, Error2, Output2>(
    other: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    other: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
}
```

Added in v1.0.0

## transform

Maps the parser's successful result with the given function `to`, and maps
the value to be printed with the given function `from`.

**Signature**

```ts
export declare const transform: {
  <Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Value
  ): Syntax<Input, Error, Output, Value2>
}
```

Added in v1.0.0

## transformEither

Maps the parser's successful result with the given function `to`, and maps
the value to be printed with the given function `from`. Both of the mapping
functions can fail the parser/printer.

**Signature**

```ts
export declare const transformEither: {
  <Error, Value, Value2>(
    to: (value: Value) => Either<Error, Value2>,
    from: (value: Value2) => Either<Error, Value>
  ): <Input, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Either<Error, Value2>,
    from: (value: Value2) => Either<Error, Value>
  ): Syntax<Input, Error, Output, Value2>
}
```

Added in v1.0.0

## transformOption

Maps the parser's successful result with the given function `to`, and maps
the value to be printed with the given function `from`. Both of the mapping
functions can fail the parser/printer. The failure is indicated in the error
channel by the value `None`.

**Signature**

```ts
export declare const transformOption: {
  <Value, Value2>(
    to: (value: Value) => Option<Value2>,
    from: (value: Value2) => Option<Value>
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Option<Error>, Output, Value2>
  <Input, Error, Output, Value, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Option<Value2>,
    from: (value: Value2) => Option<Value>
  ): Syntax<Input, Option<Error>, Output, Value2>
}
```

Added in v1.0.0

## zip

Concatenates this syntax with `that` syntax. In case both parser succeeds,
the result is a pair of the results.

The printer destructures a pair and prints the left value with this, the
right value with `that`.

**Signature**

```ts
export declare const zip: {
  <Input2, Error2, Output2, Value2>(
    that: Syntax<Input2, Error2, Output2, Value2>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, readonly [Value, Value2]>
  <Input, Error, Output, Value, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Syntax<Input2, Error2, Output2, Value2>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, readonly [Value, Value2]>
}
```

Added in v1.0.0

## zipLeft

Concatenates this `Syntax` with `that` `Syntax`. If the parser of both
syntaxes succeeds, the result is the result of this `Syntax`. Otherwise the
`Syntax` fails. The printer executes `this` printer with `void` as the input value
and also passes the value to be printed to that printer.

Note that the right syntax must have `Value` defined as `void`, because there
is no way for the printer to reconstruct an arbitrary input for the right
printer.

**Signature**

```ts
export declare const zipLeft: {
  <Input2, Error2, Output2>(
    that: Syntax<Input2, Error2, Output2, void>
  ): <Input, Error, Output, Value>(
    self: Syntax<Input, Error, Output, Value>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value>
  <Input, Error, Output, Value, Input2, Error2, Output2>(
    self: Syntax<Input, Error, Output, Value>,
    that: Syntax<Input2, Error2, Output2, void>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value>
}
```

Added in v1.0.0

## zipRight

Concatenates this `Syntax` with `that` `Syntax`. If the parser of both
syntaxes succeeds, the result is the result of `that` `Syntax`. Otherwise the
`Syntax` fails. The printer passes the value to be printed to this printer,
and also executes `that` printer with `void` as the input value.

Note that the left syntax must have `Value` defined as `void`, because there
is no way for the printer to reconstruct an arbitrary input for the left
printer.

**Signature**

```ts
export declare const zipRight: {
  <Input2, Error2, Output2, Value2>(
    that: Syntax<Input2, Error2, Output2, Value2>
  ): <Input, Error, Output>(
    self: Syntax<Input, Error, Output, void>
  ) => Syntax<Input & Input2, Error2 | Error, Output2 | Output, Value2>
  <Input, Error, Output, Input2, Error2, Output2, Value2>(
    self: Syntax<Input, Error, Output, void>,
    that: Syntax<Input2, Error2, Output2, Value2>
  ): Syntax<Input & Input2, Error | Error2, Output | Output2, Value2>
}
```

Added in v1.0.0

# constructors

## alphaNumeric

Constructs a `Syntax` for a single alpha-numeric character.

**Signature**

```ts
export declare const alphaNumeric: Syntax<string, string, string, string>
```

Added in v1.0.0

## anyChar

Constructs a `Syntax` that parses/prints a single character.

**Signature**

```ts
export declare const anyChar: Syntax<string, never, string, string>
```

Added in v1.0.0

## anyString

Constructs a `Syntax` that parses/prints an arbitrary long string.

**Signature**

```ts
export declare const anyString: Syntax<string, never, string, string>
```

Added in v1.0.0

## anything

Constructs a `Syntax` that parses/prints one element without modification.

**Signature**

```ts
export declare const anything: <Input>() => Syntax<Input, never, Input, Input>
```

Added in v1.0.0

## char

Parse or print the specified character or fail with the specified error and
result in `void`.

**Signature**

```ts
export declare const char: <Error = string>(
  char: string,
  error?: Error | undefined
) => Syntax<string, Error, string, void>
```

Added in v1.0.0

## charIn

Constructs a `Syntax` that parses/prints a single character if it matches one
of the characters in `chars`.

**Signature**

```ts
export declare const charIn: (chars: Iterable<string>) => Syntax<string, string, string, string>
```

Added in v1.0.0

## charNot

Parse or print a single character and fail with the specified `error` if the
parsed character matches the specified character.

**Signature**

```ts
export declare const charNot: <Error>(char: string, error: Error) => Syntax<string, Error, string, string>
```

Added in v1.0.0

## charNotIn

Constructs a `Syntax` that parses/prints a single character if it **DOES
NOT** match one of the character in `chars`.

**Signature**

```ts
export declare const charNotIn: (chars: Iterable<string>) => Syntax<string, string, string, string>
```

Added in v1.0.0

## digit

Constructs a `Syntax` for a single digit.

**Signature**

```ts
export declare const digit: Syntax<string, string, string, string>
```

Added in v1.0.0

## end

Constructs a `Syntax` that in parser mode only succeeds if the input stream
has been fully consumed.

This can be used to require that a parser consumes all of its input.

**Signature**

```ts
export declare const end: Syntax<unknown, never, never, void>
```

Added in v1.0.0

## fail

Constructs a `Syntax` that does not pares or print anything but fails with
the specified `error`.

**Signature**

```ts
export declare const fail: <Error>(error: Error) => Syntax<unknown, Error, never, unknown>
```

Added in v1.0.0

## filterChar

Constructs a `Syntax` that parses/prints a single character that matches the
given predicate, otherwise fails with the specified `error`.

**Signature**

```ts
export declare const filterChar: <Error>(
  predicate: Predicate<string>,
  error: Error
) => Syntax<string, Error, string, string>
```

Added in v1.0.0

## index

Constructs a `Syntax` that in parser mode results in the current input
stream position.

**Signature**

```ts
export declare const index: Syntax<unknown, never, never, number>
```

Added in v1.0.0

## letter

Constructs a `Syntax` for a single letter.

**Signature**

```ts
export declare const letter: Syntax<string, string, string, string>
```

Added in v1.0.0

## regex

Constructs a `Syntax` that executes a regular expression on the input and
results in the chunk of the parsed characters, or fails with the specified
`error`.

**Signature**

```ts
export declare const regex: <Error>(regex: Regex, error: Error) => Syntax<string, Error, string, Chunk<string>>
```

Added in v1.0.0

## regexChar

Constructs a `Syntax` that during parsing executes a regular expression on
the input and results in the last parsed character, or fails with the
specified `error`.

Useful for regexes that are known to parse a single character.

The printer will print the character provided as input.

**Signature**

```ts
export declare const regexChar: <Error>(regex: Regex, error: Error) => Syntax<string, Error, string, string>
```

Added in v1.0.0

## regexDiscard

Constructs a `Syntax` which parses using the given regular expression and
discards the results, and will fail with the specified `error` if parsing
fails. When printing, the specified characters are printed.

**Signature**

```ts
export declare const regexDiscard: <Error>(
  regex: Regex,
  error: Error,
  chars: Iterable<string>
) => Syntax<string, Error, string, void>
```

Added in v1.0.0

## string

Constructs a `Syntax` that parses/prints the specified string and results in
the specified `value`.

**Signature**

```ts
export declare const string: <Value>(str: string, value: Value) => Syntax<string, string, string, Value>
```

Added in v1.0.0

## succeed

Constructs a `Syntax` that does not parse or print anything but succeeds with
the specified `result`.

**Signature**

```ts
export declare const succeed: <Value>(value: Value) => Syntax<unknown, never, never, Value>
```

Added in v1.0.0

## suspend

Lazily constructs a `Syntax`. Can be used to construct a recursive parser

**Signature**

```ts
export declare const suspend: <Input, Error, Output, Value>(
  self: LazyArg<Syntax<Input, Error, Output, Value>>
) => Syntax<Input, Error, Output, Value>
```

**Example**

```ts
import { pipe } from "effect/Function"
import * as Syntax from "@effect/parser/Syntax"

const recursive: Syntax.Syntax<string, string, string, string> = pipe(
  Syntax.digit,
  Syntax.zipLeft(
    pipe(
      Syntax.suspend(() => recursive),
      Syntax.orElse(() => Syntax.letter),
      Syntax.asUnit("?")
    )
  )
)
```

Added in v1.0.0

## unit

Constructs a `Syntax` that results in `void`.

**Signature**

```ts
export declare const unit: () => Syntax<unknown, never, never, void>
```

Added in v1.0.0

## unsafeRegex

Constructs a `Syntax` that executes a regular expression on the input and
results in the chunk of the parsed characters. The regex should never fail.

**Signature**

```ts
export declare const unsafeRegex: (regex: Regex) => Syntax<string, never, string, Chunk<string>>
```

Added in v1.0.0

## unsafeRegexChar

Constructs a `Syntax` that parses using a regular expression and results in
the last parsed character. The regex should never fail.

Useful for regexes that are known to parse a single character.

The printer will print the character provided as input.

**Signature**

```ts
export declare const unsafeRegexChar: (regex: Regex) => Syntax<string, never, string, string>
```

Added in v1.0.0

## unsafeRegexDiscard

Constructs a `Syntax` which parses using the specified regular expression and
discards its results. The regex should never fail. When printing, the
specified characters are printed.

**Signature**

```ts
export declare const unsafeRegexDiscard: (regex: Regex, chars: Iterable<string>) => Syntax<string, never, string, void>
```

Added in v1.0.0

## whitespace

Constructs a `Syntax` for a single whitespace character.

**Signature**

```ts
export declare const whitespace: Syntax<string, string, string, string>
```

Added in v1.0.0

# execution

## parseString

Run this `Syntax`'s parser on the given `input` string.

**Signature**

```ts
export declare const parseString: {
  (
    input: string
  ): <Error, Output, Value>(self: Syntax<string, Error, Output, Value>) => Either<ParserError<Error>, Value>
  <Error, Output, Value>(self: Syntax<string, Error, Output, Value>, input: string): Either<ParserError<Error>, Value>
}
```

Added in v1.0.0

## parseStringWith

Run this `Syntax`'s parser on the given `input` string using a specific
parser implementation.

**Signature**

```ts
export declare const parseStringWith: {
  (
    input: string,
    implementation: Parser.Implementation
  ): <Error, Output, Value>(self: Syntax<string, Error, Output, Value>) => Either<ParserError<Error>, Value>
  <Error, Output, Value>(
    self: Syntax<string, Error, Output, Value>,
    input: string,
    implementation: Parser.Implementation
  ): Either<ParserError<Error>, Value>
}
```

Added in v1.0.0

## printString

Prints the specified `value` to a string.

**Signature**

```ts
export declare const printString: {
  <Value>(value: Value): <Input, Error>(self: Syntax<Input, Error, string, Value>) => Either<Error, string>
  <Input, Error, Value>(self: Syntax<Input, Error, string, Value>, value: Value): Either<Error, string>
}
```

Added in v1.0.0

# models

## Syntax (interface)

A `Syntax` defines both a `Parser` and a `Printer` and provides combinators
to simultaneously build them up from smaller syntax fragments.

**Signature**

```ts
export interface Syntax<Input, Error, Output, Value> extends Syntax.Variance<Input, Error, Output, Value>, Pipeable {
  readonly parser: Parser<Input, Error, Value>
  readonly printer: Printer<Value, Error, Output>
}
```

Added in v1.0.0

# symbols

## TypeId

**Signature**

```ts
export declare const TypeId: typeof TypeId
```

Added in v1.0.0

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# transformTo

## transformTo

Maps the parsed value with the function `to`, and the value to be printed
with the partial function `from`. It the partial function is not defined
on the value, the printer fails with the specified `error`.

This can be used to define separate syntaxes for subtypes, that can be later combined.

**Signature**

```ts
export declare const transformTo: {
  <Error2, Value, Value2>(
    to: (value: Value) => Value2,
    from: (value: Value2) => Option<Value>,
    error: Error2
  ): <Input, Error, Output>(self: Syntax<Input, Error, Output, Value>) => Syntax<Input, Error2 | Error, Output, Value2>
  <Input, Error, Output, Value, Error2, Value2>(
    self: Syntax<Input, Error, Output, Value>,
    to: (value: Value) => Value2,
    from: (value: Value2) => Option<Value>,
    error: Error2
  ): Syntax<Input, Error | Error2, Output, Value2>
}
```

Added in v1.0.0

# utils

## Syntax (namespace)

Added in v1.0.0

### Variance (interface)

**Signature**

```ts
export interface Variance<in Input, out Error, out Output, in out Value> {
  readonly [TypeId]: {
    _Input: Types.Contravariant<Input>
    _Error: Types.Covariant<Error>
    _Output: Types.Covariant<Output>
    _Value: Types.Invariant<Value>
  }
}
```

Added in v1.0.0
