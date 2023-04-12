/**
 * @since 1.0.0
 */

import type { Chunk } from "@effect/data/Chunk"
import type { Option } from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import type { BitSet } from "@effect/parser/BitSet"
import * as common from "@effect/parser/internal_effect_untraced/common"
import * as internal from "@effect/parser/internal_effect_untraced/regex"

/**
 * @since 1.0.0
 * @category symbols
 */
export const RegexTypeId: unique symbol = internal.RegexTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type RegexTypeId = typeof RegexTypeId

/**
 * Represents a regular expression.
 *
 * @since 1.0.0
 * @category models
 */
export type Regex = Succeed | And | Or | OneOf | Sequence | Repeat

/**
 * @since 1.0.0
 */
export declare namespace Regex {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto {
    readonly [RegexTypeId]: RegexTypeId
  }

  /**
   * Represents a compiled regular expression.
   *
   * @since 1.0.0
   * @category models
   */
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
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Succeed extends Regex.Proto {
  readonly _tag: "Succeed"
}

/**
 * @since 1.0.0
 * @category models
 */
export interface And extends Regex.Proto {
  readonly _tag: "And"
  readonly left: Regex
  readonly right: Regex
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Or extends Regex.Proto {
  readonly _tag: "Or"
  readonly left: Regex
  readonly right: Regex
}

/**
 * @since 1.0.0
 * @category models
 */
export interface OneOf extends Regex.Proto {
  readonly _tag: "OneOf"
  readonly bitset: BitSet
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Sequence extends Regex.Proto {
  readonly _tag: "Sequence"
  readonly left: Regex
  readonly right: Regex
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Repeat extends Regex.Proto {
  readonly _tag: "Repeat"
  readonly regex: Regex
  readonly min: Option<number>
  readonly max: Option<number>
}

/**
 * The result of testing a `Regex` against an input value where the input value
 * does not provide enough input for the `Regex` to consume.
 *
 * @since 1.0.0
 * @category utils
 */
export const needMoreInput: -2 = common.needMoreInput

/**
 * The result of testing a `Regex` against an input value where the input value
 * does not match the `Regex`.
 *
 * @since 1.0.0
 * @category utils
 */
export const notMatched: -1 = common.notMatched

/**
 * Composes this regex with the specified regex using intersection, returning
 * a regex that will match a prefix only if both this and the specified regex match it.
 *
 * @since 1.0.0
 * @category combinators
 */
export const and: {
  (that: Regex): (self: Regex) => Regex
  (self: Regex, that: Regex): Regex
} = internal.and

/**
 * A regex that matches any single character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyChar: Regex = internal.anyChar

/**
 * A regex that matches any single digit character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyDigit: Regex = internal.anyDigit

/**
 * A regex that matches any single letter character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyLetter: Regex = internal.anyLetter

/**
 * A regex that matches any single whitespace character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyWhitespace: Regex = internal.anyWhitespace

/**
 * A regex that matches a single letter or digit character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anyAlphaNumeric: Regex = internal.anyAlphaNumeric

/**
 * A regex that matches at least one letter or digit character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const alphaNumerics: Regex = internal.alphaNumerics

/**
 * Returns a new regex that matches at least `min` occurrences of this regex.
 *
 * @since 1.0.0
 * @category combinators
 */
export const atLeast: {
  (min: number): (self: Regex) => Regex
  (self: Regex, min: number): Regex
} = internal.atLeast

/**
 * Returns a new regex that matches at most `max` occurrences of this regex.
 *
 * @since 1.0.0
 * @category combinators
 */
export const atMost: {
  (max: number): (self: Regex) => Regex
  (self: Regex, max: number): Regex
} = internal.atMost

/**
 * Returns a new regex that matches between `min` and `max` occurrences of this
 * regex.
 *
 * @since 1.0.0
 * @category combinators
 */
export const between: {
  (min: number, max: number): (self: Regex) => Regex
  (self: Regex, min: number, max: number): Regex
} = internal.between

/**
 * A regex that matches the specified character.
 *
 * @since 1.0.0
 * @category constructors
 */
export const char: (char: string) => Regex = internal.char

/**
 * A regex that matches one of the specified characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const charIn: (chars: Iterable<string>) => Regex = internal.charIn

/**
 * A regex that matches any character except of the specified ones
 *
 * @since 1.0.0
 * @category constructors
 */
export const charNotIn: (chars: Iterable<string>) => Regex = internal.charNotIn

/**
 * Compiles the regex to a form that allows efficient execution on chunks of
 * characters.
 *
 * @since 1.0.0
 * @category destructors
 */
export const compile: (regex: Regex) => Regex.Compiled = internal.compile

/**
 * A regex that matches one or more digit characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const digits: Regex = internal.digits

/**
 * A regex that matches the empty string, which will always succeed.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: Regex = internal.empty

/**
 * A regex that matches any single character for which the specified predicate
 * returns true.
 *
 * @since 1.0.0
 * @category combinators
 */
export const filter: (predicate: Predicate<string>) => Regex = internal.filter

/**
 * A regex that matches any one or more letter characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const letters: Regex = internal.letters

/**
 * Composes this regex with the specified regex using union, returning a regex
 * that will match a prefix only if either this or the specified regex match it.
 *
 * @since 1.0.0
 * @category combinators
 */
export const or: {
  (that: Regex): (self: Regex) => Regex
  (self: Regex, that: Regex): Regex
} = internal.or

/**
 * Sequentially composes this regex with the specified regex, returning a
 * regex that will first match this one, and then match the specified regex.
 *
 * @since 1.0.0
 * @category combinators
 */
export const sequence: {
  (that: Regex): (self: Regex) => Regex
  (self: Regex, that: Regex): Regex
} = internal.sequence

/**
 * A regex that matches the specified literal string.
 *
 * @since 1.0.0
 * @category constructors
 */
export const string: (string: string) => Regex = internal.string

/**
 * If the regex is a string literal, returns the string literal.
 *
 * @since 1.0.0
 * @category getters
 */
export const toLiteral: (self: Regex) => Option<Chunk<string>> = internal.toLiteral

/**
 * A regex that matches zero or more whitespace characters.
 *
 * @since 1.0.0
 * @category constructors
 */
export const whitespace: Regex = internal.whitespace
