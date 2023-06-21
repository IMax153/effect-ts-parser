---
title: Printer.ts
nav_order: 4
parent: Modules
---

## Printer overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [asPrinted](#asprinted)
  - [between](#between)
  - [contramap](#contramap)
  - [contramapEither](#contramapeither)
  - [contramapTo](#contramapto)
  - [filterInput](#filterinput)
  - [flatten](#flatten)
  - [mapError](#maperror)
  - [optional](#optional)
  - [orElse](#orelse)
  - [orElseEither](#orelseeither)
  - [repeat](#repeat)
  - [repeat1](#repeat1)
  - [repeatUntil](#repeatuntil)
  - [repeatWithSeparator](#repeatwithseparator)
  - [repeatWithSeparator1](#repeatwithseparator1)
  - [surroundedBy](#surroundedby)
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
  - [charNotIn](#charnotin)
  - [digit](#digit)
  - [exactly](#exactly)
  - [except](#except)
  - [fail](#fail)
  - [fromInput](#frominput)
  - [letter](#letter)
  - [notChar](#notchar)
  - [output](#output)
  - [outputString](#outputstring)
  - [regex](#regex)
  - [regexChar](#regexchar)
  - [regexDiscard](#regexdiscard)
  - [string](#string)
  - [succeed](#succeed)
  - [suspend](#suspend)
  - [unit](#unit)
  - [unsafeRegex](#unsaferegex)
  - [unsafeRegexChar](#unsaferegexchar)
  - [whitespace](#whitespace)
- [execution](#execution)
  - [printToChunk](#printtochunk)
  - [printToString](#printtostring)
  - [printToTarget](#printtotarget)
- [models](#models)
  - [Printer (interface)](#printer-interface)
- [symbols](#symbols)
  - [PrinterTypeId](#printertypeid)
  - [PrinterTypeId (type alias)](#printertypeid-type-alias)

---

# combinators

## asPrinted

Ignores the printer's result and input and use `matches` and `from` instead.

**Signature**

```ts
export declare const asPrinted: {
  <Input2, Input>(matches: Input2, from: Input): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error, Output>
  <Input, Error, Output, Input2>(self: Printer<Input, Error, Output>, matches: Input2, from: Input): Printer<
    Input2,
    Error,
    Output
  >
}
```

Added in v1.0.0

## between

Surround this printer with `left` and `right`, each getting void as value to
be printed.

**Signature**

```ts
export declare const between: {
  <Error2, Output2, Error3, Output3>(left: Printer<void, Error2, Output2>, right: Printer<void, Error3, Output3>): <
    Input,
    Error,
    Output
  >(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error3 | Error, Output2 | Output3 | Output>
  <Input, Error, Output, Error2, Output2, Error3, Output3>(
    self: Printer<Input, Error, Output>,
    left: Printer<void, Error2, Output2>,
    right: Printer<void, Error3, Output3>
  ): Printer<Input, Error | Error2 | Error3, Output | Output2 | Output3>
}
```

Added in v1.0.0

## contramap

Maps the printer's input value with the specified function.

**Signature**

```ts
export declare const contramap: {
  <Input2, Input>(from: (value: Input2) => Input): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error, Output>
  <Input, Error, Output, Input2>(self: Printer<Input, Error, Output>, from: (value: Input2) => Input): Printer<
    Input2,
    Error,
    Output
  >
}
```

Added in v1.0.0

## contramapEither

Maps the printer's input value with the specified function which returns
an `Either`.

**Signature**

```ts
export declare const contramapEither: {
  <Input2, Error2, Input>(from: (value: Input2) => Either<Error2, Input>): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2, Output>
  <Input, Error, Output, Input2, Error2>(
    self: Printer<Input, Error, Output>,
    from: (value: Input2) => Either<Error2, Input>
  ): Printer<Input2, Error2, Output>
}
```

Added in v1.0.0

## contramapTo

Maps the value to be printed with the partial function `from`. If the partial
function is not defined on the input value, the printer fails with `failure`.

This can be used to define separate syntaxes for subtypes, that can be later
combined.

**Signature**

```ts
export declare const contramapTo: {
  <Input2, Input, Error2>(from: (value: Input2) => Option<Input>, error: Error2): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2, Output>
  <Input, Error, Output, Input2, Error2>(
    self: Printer<Input, Error, Output>,
    from: (value: Input2) => Option<Input>,
    error: Error2
  ): Printer<Input2, Error2, Output>
}
```

Added in v1.0.0

## filterInput

Specifies a filter `condition` that gets checked on the input value and in
case it evaluates to `false`, fails with the provided `error`.

**Signature**

```ts
export declare const filterInput: {
  <Input, Error2>(condition: Predicate<Input>, error: Error2): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output>
  <Input, Error, Output, Error2>(
    self: Printer<Input, Error, Output>,
    condition: Predicate<Input>,
    error: Error2
  ): Printer<Input, Error | Error2, Output>
}
```

Added in v1.0.0

## flatten

Concatenates an input `Chunk<string>` to a `string` to be printed.

**Signature**

```ts
export declare const flatten: <Error, Output>(
  self: Printer<Chunk<string>, Error, Output>
) => Printer<string, Error, Output>
```

Added in v1.0.0

## mapError

Maps over the error channel with the specified function.

**Signature**

```ts
export declare const mapError: {
  <Error, Error2>(f: (error: Error) => Error2): <Input, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2, Output>
  <Input, Output, Error, Error2>(self: Printer<Input, Error, Output>, f: (error: Error) => Error2): Printer<
    Input,
    Error2,
    Output
  >
}
```

Added in v1.0.0

## optional

A `Printer` which prints `Option` values.

**Signature**

```ts
export declare const optional: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<Option<Input>, Error, Output>
```

Added in v1.0.0

## orElse

Prints `self` and if it fails, ignore the printed output and print `that`
instead.

**Signature**

```ts
export declare const orElse: {
  <Input2, Error2, Output2>(that: LazyArg<Printer<Input2, Error2, Output2>>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2 | Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: LazyArg<Printer<Input2, Error2, Output2>>
  ): Printer<Input | Input2, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## orElseEither

Prints `self` if the input is `Left`, or print `that` if the input is
`Right`.

**Signature**

```ts
export declare const orElseEither: {
  <Input2, Error2, Output2>(that: LazyArg<Printer<Input2, Error2, Output2>>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Either<Input, Input2>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: LazyArg<Printer<Input2, Error2, Output2>>
  ): Printer<Either<Input, Input2>, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## repeat

Repeats this printer for each element of the input chunk zero or more times.

**Signature**

```ts
export declare const repeat: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<Chunk<Input>, Error, Output>
```

Added in v1.0.0

## repeat1

Repeats this printer for each element of the input chunk.

The input chunk **must not** be empty.

**Signature**

```ts
export declare const repeat1: <Input, Error, Output>(
  self: Printer<Input, Error, Output>
) => Printer<NonEmptyChunk<Input>, Error, Output>
```

Added in v1.0.0

## repeatUntil

Repeat this printer for each element of the input chunk, verifying the
`stopConfition` after each.

**Signature**

```ts
export declare const repeatUntil: {
  <Error2, Output2>(stopCondition: Printer<void, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Chunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    stopCondition: Printer<void, Error2, Output2>
  ): Printer<Chunk<Input>, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## repeatWithSeparator

Repeats this printer for each element of the input chunk, separated by the
`separator` printer (which gets `void` to be printed).

The input chunk may not be empty.

**Signature**

```ts
export declare const repeatWithSeparator: {
  <Error2, Output2>(separator: Printer<void, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Chunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    separator: Printer<void, Error2, Output2>
  ): Printer<Chunk<Input>, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## repeatWithSeparator1

Repeats this printer for each element of the input chunk, separated by the
`separator` printer (which gets `void` to be printed).

The input chunk **must not** be empty.

**Signature**

```ts
export declare const repeatWithSeparator1: {
  <Error2, Output2>(separator: Printer<void, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<NonEmptyChunk<Input>, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    separator: Printer<void, Error2, Output2>
  ): Printer<NonEmptyChunk<Input>, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## surroundedBy

Surround this printer the `other` printer which gets `void` as the value to
be printed.

**Signature**

```ts
export declare const surroundedBy: {
  <Error2, Output2>(other: Printer<void, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    other: Printer<void, Error2, Output2>
  ): Printer<Input, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## transformOption

Maps the printer's input value with `from`.

**Note**: Failure is indicated by `None` in the error channel.

**Signature**

```ts
export declare const transformOption: {
  <Input2, Input>(from: (input: Input2) => Option<Input>): <Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Option<Error>, Output>
  <Input, Error, Output, Input2>(self: Printer<Input, Error, Output>, from: (input: Input2) => Option<Input>): Printer<
    Input2,
    Option<Error>,
    Output
  >
}
```

Added in v1.0.0

## zip

Takes a pair to be printed and prints the left value with `self`, and the
right value with `that`. The result is a pair of both printer's results.

**Signature**

```ts
export declare const zip: {
  <Input2, Error2, Output2>(that: Printer<Input2, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<readonly [Input, Input2], Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<readonly [Input, Input2], Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## zipLeft

Print `that` by providing the unit value to it after printing `self`. The
result is the `self` printer's result.

**Signature**

```ts
export declare const zipLeft: {
  <Input2, Error2, Output2>(that: Printer<Input2, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<Input, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

## zipRight

Print `that` by providing the unit value to it after printing `self`. The
result is `that` printer's result.

**Signature**

```ts
export declare const zipRight: {
  <Input2, Error2, Output2>(that: Printer<Input2, Error2, Output2>): <Input, Error, Output>(
    self: Printer<Input, Error, Output>
  ) => Printer<Input2, Error2 | Error, Output2 | Output>
  <Input, Error, Output, Input2, Error2, Output2>(
    self: Printer<Input, Error, Output>,
    that: Printer<Input2, Error2, Output2>
  ): Printer<Input2, Error | Error2, Output | Output2>
}
```

Added in v1.0.0

# constructors

## alphaNumeric

Prints a single alpha-numeric character.

**Signature**

```ts
export declare const alphaNumeric: Printer<string, string, string>
```

Added in v1.0.0

## anyChar

A `Printer` that prints a single character provided as input.

**Signature**

```ts
export declare const anyChar: Printer<string, never, string>
```

Added in v1.0.0

## anyString

A `Printer` that just prints the input string.

**Signature**

```ts
export declare const anyString: Printer<string, never, string>
```

Added in v1.0.0

## anything

Constructs a `Printer` that just emits its input value.

**Signature**

```ts
export declare const anything: <Input>() => Printer<Input, never, Input>
```

Added in v1.0.0

## char

A `Printer` that prints a given character.

**Signature**

```ts
export declare const char: (char: string) => Printer<void, string, string>
```

Added in v1.0.0

## charIn

A `Printer` that prints a single character if it matches any of the
specified characters.

**Signature**

```ts
export declare const charIn: (chars: Iterable<string>) => Printer<string, string, string>
```

Added in v1.0.0

## charNotIn

A `Printer` that prints a single character if it does not match any of the
specified characters.

**Signature**

```ts
export declare const charNotIn: (chars: Iterable<string>) => Printer<string, string, string>
```

Added in v1.0.0

## digit

Prints a single digit.

**Signature**

```ts
export declare const digit: Printer<string, string, string>
```

Added in v1.0.0

## exactly

A `Printer` that emits the input if it is equals to the specified `value`,
otherwise fails with the specified `error` (if provided).

**Note**: equality is checked using Equal.equals from `@effect/data`.

**Signature**

```ts
export declare const exactly: <Output, Error = string>(
  value: Output,
  error?: Error | undefined
) => Printer<Output, Error, Output>
```

Added in v1.0.0

## except

A `Printer` that emits the input unless it is equal to `value`, in which case
it fails with the specified `error` (if provided).

**Note**: equality is checked using Equal.equals from `@effect/data`.

**Signature**

```ts
export declare const except: <Output, Error = string>(
  value: Output,
  error?: Error | undefined
) => Printer<Output, Error, Output>
```

Added in v1.0.0

## fail

A `Printer` that does not print anything and fails with the specified `error`.

**Signature**

```ts
export declare const fail: <Error>(error: Error) => Printer<unknown, Error, never>
```

Added in v1.0.0

## fromInput

A `Printer` computed using a function on the input value.

**Signature**

```ts
export declare const fromInput: <Input, Error, Output>(
  f: (input: Input) => Printer<never, Error, Output>
) => Printer<Input, Error, Output>
```

Added in v1.0.0

## letter

Prints a single letter.

**Signature**

```ts
export declare const letter: Printer<string, string, string>
```

Added in v1.0.0

## notChar

A `Printer` that prints the input character if it is not equal to the
specified `char`.

Can optionally specify an error to use in place of the default message.

**Signature**

```ts
export declare const notChar: <Error>(char: string, failure?: Error | undefined) => Printer<string, Error, string>
```

Added in v1.0.0

## output

A `Printer` which outputs a specific value.

**Signature**

```ts
export declare const output: <Output>(value: Output) => Printer<never, never, Output>
```

Added in v1.0.0

## outputString

A `Printer` which outputs a specific string.

**Signature**

```ts
export declare const outputString: (value: string) => Printer<never, never, string>
```

Added in v1.0.0

## regex

A `Printer` that prints a series of characters provided as input, if it
matches the given regex. Otherwise fails with the specified `error`.

**Signature**

```ts
export declare const regex: <Error>(regex: Regex, error: Error) => Printer<Chunk<string>, Error, string>
```

Added in v1.0.0

## regexChar

A `Printer` that prints a single character if matches the given `regex`,
otherwise fails with the provided `error`.

**Signature**

```ts
export declare const regexChar: <Error>(regex: Regex, error: Error) => Printer<string, Error, string>
```

Added in v1.0.0

## regexDiscard

A `Printer` that prints the specified characters.

**Signature**

```ts
export declare const regexDiscard: (regex: Regex, characters: Iterable<string>) => Printer<void, never, string>
```

Added in v1.0.0

## string

A `Printer` which prints the specified string and results in `value`.

**Signature**

```ts
export declare const string: <Input>(str: string, input: Input) => Printer<Input, never, string>
```

Added in v1.0.0

## succeed

A `Printer` that does not print anything and succeeds with the specified
`value`.

**Signature**

```ts
export declare const succeed: <Input>(input: Input) => Printer<unknown, never, never>
```

Added in v1.0.0

## suspend

Lazily constructs a `Printer`.

**Signature**

```ts
export declare const suspend: <Input, Error, Output>(
  printer: LazyArg<Printer<Input, Error, Output>>
) => Printer<Input, Error, Output>
```

Added in v1.0.0

## unit

A `Printer` that does not print anything and succeeds with `undefined`.

**Signature**

```ts
export declare const unit: () => Printer<void, never, never>
```

Added in v1.0.0

## unsafeRegex

A `Printer` that prints a series of characters provided as input, if it
matches the given regex. The regex should never fail.

**Signature**

```ts
export declare const unsafeRegex: (regex: Regex) => Printer<Chunk<string>, never, string>
```

Added in v1.0.0

## unsafeRegexChar

A `Printer` that prints a single character if matches the given `regex`.

**Note**: This is "unsafe" because the provided regex should never fail.

**Signature**

```ts
export declare const unsafeRegexChar: (regex: Regex) => Printer<string, never, string>
```

Added in v1.0.0

## whitespace

Prints a single whitespace character.

**Signature**

```ts
export declare const whitespace: Printer<string, string, string>
```

Added in v1.0.0

# execution

## printToChunk

Print the specified input value to a chunk of output elements.

**Signature**

```ts
export declare const printToChunk: {
  <Input>(input: Input): <Error, Output>(self: Printer<Input, Error, Output>) => Either<Error, Chunk<Output>>
  <Input, Error, Output>(self: Printer<Input, Error, Output>, input: Input): Either<Error, Chunk<Output>>
}
```

Added in v1.0.0

## printToString

Print the specified input value to a string.

**Signature**

```ts
export declare const printToString: {
  <Input>(value: Input): <Error>(self: Printer<Input, Error, string>) => Either<Error, string>
  <Input, Error>(self: Printer<Input, Error, string>, input: Input): Either<Error, string>
}
```

Added in v1.0.0

## printToTarget

Print the specified input value to the given `target` implementation.

**Signature**

```ts
export declare const printToTarget: {
  <Input, Output, T extends Target<any, Output>>(input: Input, target: T): <Error>(
    self: Printer<Input, Error, Output>
  ) => Either<Error, void>
  <Input, Error, Output, T extends Target<any, Output>>(
    self: Printer<Input, Error, Output>,
    input: Input,
    target: T
  ): Either<Error, void>
}
```

Added in v1.0.0

# models

## Printer (interface)

A `Printer` takes an input value of type `Input` and either produces a result
of type `Output`, or fails with a custom error of type `Error`.

`Printer`s can be combined with `Parser`s to get `Syntax`, or a `Parser` and
a `Printer` can be built simultaneously by using the combinators of `Syntax`.

**Signature**

```ts
export interface Printer<Input, Error, Output> extends Printer.Variance<Input, Error, Output> {}
```

Added in v1.0.0

# symbols

## PrinterTypeId

**Signature**

```ts
export declare const PrinterTypeId: typeof PrinterTypeId
```

Added in v1.0.0

## PrinterTypeId (type alias)

**Signature**

```ts
export type PrinterTypeId = typeof PrinterTypeId
```

Added in v1.0.0
