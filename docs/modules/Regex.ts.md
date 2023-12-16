---
title: Regex.ts
nav_order: 7
parent: Modules
---

## Regex overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [and](#and)
  - [atLeast](#atleast)
  - [atMost](#atmost)
  - [between](#between)
  - [filter](#filter)
  - [or](#or)
  - [sequence](#sequence)
- [constructors](#constructors)
  - [alphaNumerics](#alphanumerics)
  - [anyAlphaNumeric](#anyalphanumeric)
  - [anyChar](#anychar)
  - [anyDigit](#anydigit)
  - [anyLetter](#anyletter)
  - [anyWhitespace](#anywhitespace)
  - [char](#char)
  - [charIn](#charin)
  - [charNotIn](#charnotin)
  - [digits](#digits)
  - [empty](#empty)
  - [letters](#letters)
  - [string](#string)
  - [whitespace](#whitespace)
- [destructors](#destructors)
  - [compile](#compile)
- [getters](#getters)
  - [toLiteral](#toliteral)
- [models](#models)
  - [And (interface)](#and-interface)
  - [OneOf (interface)](#oneof-interface)
  - [Or (interface)](#or-interface)
  - [Regex (type alias)](#regex-type-alias)
  - [Repeat (interface)](#repeat-interface)
  - [Sequence (interface)](#sequence-interface)
  - [Succeed (interface)](#succeed-interface)
- [symbols](#symbols)
  - [RegexTypeId](#regextypeid)
  - [RegexTypeId (type alias)](#regextypeid-type-alias)
- [utils](#utils)
  - [Regex (namespace)](#regex-namespace)
    - [Compiled (interface)](#compiled-interface)
    - [Proto (interface)](#proto-interface)
  - [needMoreInput](#needmoreinput)
  - [notMatched](#notmatched)

---

# combinators

## and

Composes this `Regex` with the specified `Regex` using intersection,
returning a `Regex` that will match a prefix only if both this and the specified one match it.

**Signature**

```ts
export declare const and: { (that: Regex): (self: Regex) => Regex; (self: Regex, that: Regex): Regex }
```

Added in v1.0.0

## atLeast

Returns a new `Regex` that matches at least `min` occurrences of this `Regex`.

**Signature**

```ts
export declare const atLeast: { (min: number): (self: Regex) => Regex; (self: Regex, min: number): Regex }
```

Added in v1.0.0

## atMost

Returns a new `Regex` that matches at most `max` occurrences of this `Regex`.

**Signature**

```ts
export declare const atMost: { (max: number): (self: Regex) => Regex; (self: Regex, max: number): Regex }
```

Added in v1.0.0

## between

Returns a new `Regex` that matches between `min` and `max` occurrences of this
`Regex`.

**Signature**

```ts
export declare const between: {
  (min: number, max: number): (self: Regex) => Regex
  (self: Regex, min: number, max: number): Regex
}
```

Added in v1.0.0

## filter

A regex that matches any single character for which the specified predicate
returns true.

**Signature**

```ts
export declare const filter: (predicate: Predicate<string>) => Regex
```

Added in v1.0.0

## or

Composes this `Regex` with the specified `Regex` using union,
returning a `Regex` that will match a prefix only if either this or the specified one matches it.

**Signature**

```ts
export declare const or: { (that: Regex): (self: Regex) => Regex; (self: Regex, that: Regex): Regex }
```

Added in v1.0.0

## sequence

Composes this `Regex` with the specified `Regex` sequentially,
returning a `Regex` that will match this first, and then the specified one.

**Signature**

```ts
export declare const sequence: { (that: Regex): (self: Regex) => Regex; (self: Regex, that: Regex): Regex }
```

Added in v1.0.0

# constructors

## alphaNumerics

A `Regex` that matches at least one letter or digit character.

**Signature**

```ts
export declare const alphaNumerics: Regex
```

Added in v1.0.0

## anyAlphaNumeric

A `Regex` that matches a single letter or digit character.

**Signature**

```ts
export declare const anyAlphaNumeric: Regex
```

Added in v1.0.0

## anyChar

A `Regex` that matches any single character.

**Signature**

```ts
export declare const anyChar: Regex
```

Added in v1.0.0

## anyDigit

A `Regex` that matches any single digit character.

**Signature**

```ts
export declare const anyDigit: Regex
```

Added in v1.0.0

## anyLetter

A `Regex` that matches any single letter character.

**Signature**

```ts
export declare const anyLetter: Regex
```

Added in v1.0.0

## anyWhitespace

A `Regex` that matches any single whitespace character.

**Signature**

```ts
export declare const anyWhitespace: Regex
```

Added in v1.0.0

## char

A `Regex` that matches the specified character.

**Signature**

```ts
export declare const char: (char: string) => Regex
```

Added in v1.0.0

## charIn

A `Regex` that matches one of the specified characters.

**Signature**

```ts
export declare const charIn: (chars: Iterable<string>) => Regex
```

Added in v1.0.0

## charNotIn

A `Regex` that matches any character except for the specified ones.

**Signature**

```ts
export declare const charNotIn: (chars: Iterable<string>) => Regex
```

Added in v1.0.0

## digits

A `Regex` that matches one or more digit characters.

**Signature**

```ts
export declare const digits: Regex
```

Added in v1.0.0

## empty

A `Regex` that matches the empty string, which will always succeed.

**Signature**

```ts
export declare const empty: Regex
```

Added in v1.0.0

## letters

A `Regex` that matches one or more letter characters.

**Signature**

```ts
export declare const letters: Regex
```

Added in v1.0.0

## string

A regex that matches the specified literal string.

**Signature**

```ts
export declare const string: (string: string) => Regex
```

Added in v1.0.0

## whitespace

A `Regex` that matches zero or more whitespace characters.

**Signature**

```ts
export declare const whitespace: Regex
```

Added in v1.0.0

# destructors

## compile

Compiles the `Regex` to a form that allows efficient execution on chunks of
characters.

**Signature**

```ts
export declare const compile: (regex: Regex) => Regex.Compiled
```

Added in v1.0.0

# getters

## toLiteral

If the regex is a string literal, returns the string literal.

**Signature**

```ts
export declare const toLiteral: (self: Regex) => Option<Chunk<string>>
```

Added in v1.0.0

# models

## And (interface)

**Signature**

```ts
export interface And extends Regex.Proto {
  readonly _tag: "And"
  readonly left: Regex
  readonly right: Regex
}
```

Added in v1.0.0

## OneOf (interface)

**Signature**

```ts
export interface OneOf extends Regex.Proto {
  readonly _tag: "OneOf"
  readonly bitset: BitSet
}
```

Added in v1.0.0

## Or (interface)

**Signature**

```ts
export interface Or extends Regex.Proto {
  readonly _tag: "Or"
  readonly left: Regex
  readonly right: Regex
}
```

Added in v1.0.0

## Regex (type alias)

Represents a regular expression.

**Signature**

```ts
export type Regex = Succeed | And | Or | OneOf | Sequence | Repeat
```

Added in v1.0.0

## Repeat (interface)

**Signature**

```ts
export interface Repeat extends Regex.Proto {
  readonly _tag: "Repeat"
  readonly regex: Regex
  readonly min: Option<number>
  readonly max: Option<number>
}
```

Added in v1.0.0

## Sequence (interface)

**Signature**

```ts
export interface Sequence extends Regex.Proto {
  readonly _tag: "Sequence"
  readonly left: Regex
  readonly right: Regex
}
```

Added in v1.0.0

## Succeed (interface)

**Signature**

```ts
export interface Succeed extends Regex.Proto {
  readonly _tag: "Succeed"
}
```

Added in v1.0.0

# symbols

## RegexTypeId

**Signature**

```ts
export declare const RegexTypeId: typeof RegexTypeId
```

Added in v1.0.0

## RegexTypeId (type alias)

**Signature**

```ts
export type RegexTypeId = typeof RegexTypeId
```

Added in v1.0.0

# utils

## Regex (namespace)

Added in v1.0.0

### Compiled (interface)

Represents a compiled regular expression.

**Signature**

```ts
export interface Compiled {
  /**
   * Tests the compiled regex against the specified character sequence.
   *
   * Returns the new index into the string.
   */
  test(index: number, chars: string): number
  /**
   * Determines if the compiled regex matches the specified string.
   */
  matches(string: string): boolean
}
```

Added in v1.0.0

### Proto (interface)

**Signature**

```ts
export interface Proto {
  readonly [RegexTypeId]: RegexTypeId
}
```

Added in v1.0.0

## needMoreInput

The result of testing a `Regex` against an input value where the input value
does not provide enough input for the `Regex` to consume.

**Signature**

```ts
export declare const needMoreInput: -2
```

Added in v1.0.0

## notMatched

The result of testing a `Regex` against an input value where the input value
does not match the `Regex`.

**Signature**

```ts
export declare const notMatched: -1
```

Added in v1.0.0
