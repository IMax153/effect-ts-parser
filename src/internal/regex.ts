import { Array as ReadonlyArray, Chunk, Option } from "effect"
import { dual, pipe } from "effect/Function"
import type { Predicate } from "effect/Predicate"
import type * as BitSet from "./../BitSet.js"
import type * as Regex from "./../Regex.js"
import * as InternalBitSet from "./bitset.js"
import * as InternalCommon from "./common.js"
import * as InternalLookupFunction from "./lookupFunction.js"

/** @internal */
export const TypeId: Regex.TypeId = Symbol.for("@effect/parser/Regex") as Regex.TypeId

const proto = {
  [TypeId]: TypeId
}

/** @internal */
export const and = dual<
  (that: Regex.Regex) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, that: Regex.Regex) => Regex.Regex
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "And"
  op.left = self
  op.right = that
  return op
})

const oneOf = (bitset: BitSet.BitSet): Regex.Regex => {
  const op = Object.create(proto)
  op._tag = "OneOf"
  op.bitset = bitset
  return op
}

/** @internal */
export const anyChar: Regex.Regex = oneOf(InternalBitSet.all)

/** @internal */
export const charIn = (chars: Iterable<string>): Regex.Regex =>
  pipe(
    InternalBitSet.fromChars(chars),
    oneOf
  )

/** @internal */
export const filter = (predicate: Predicate<string>): Regex.Regex =>
  pipe(
    InternalBitSet.all,
    InternalBitSet.toChars,
    ReadonlyArray.filter(predicate),
    charIn
  )

const IS_DIGIT_REGEX = new RegExp(/^[0-9]$/)

/** @internal */
export const anyDigit: Regex.Regex = filter((char) => IS_DIGIT_REGEX.test(char))

const IS_LETTER_REGEX = new RegExp(/^[a-z]$/, "i")

/** @internal */
export const anyLetter: Regex.Regex = filter((char) => IS_LETTER_REGEX.test(char))

const IS_WHITESPACE_REGEX = /^\s$/

/** @internal */
export const anyWhitespace: Regex.Regex = filter((char) => IS_WHITESPACE_REGEX.test(char))

/** @internal */
export const or = dual<
  (that: Regex.Regex) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, that: Regex.Regex) => Regex.Regex
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "Or"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const anyAlphaNumeric: Regex.Regex = or(anyLetter, anyDigit)

/** @internal */
export const repeat = (self: Regex.Regex, min: Option.Option<number>, max: Option.Option<number>): Regex.Regex => {
  const op = Object.create(proto)
  op._tag = "Repeat"
  op.regex = self
  op.min = min
  op.max = max
  return op
}

/** @internal */
export const repeatMin = dual<
  (min: number) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, min: number) => Regex.Regex
>(2, (self, min) => repeat(self, Option.some(min), Option.none()))

/** @internal */
export const alphaNumerics: Regex.Regex = repeatMin(anyAlphaNumeric, 1)

/** @internal */
export const char = (char: string): Regex.Regex => charIn([char])

/** @internal */
export const charNotIn = (chars: Iterable<string>): Regex.Regex =>
  pipe(
    InternalBitSet.all,
    ReadonlyArray.difference(InternalBitSet.fromChars(chars)),
    oneOf
  )

/** @internal */
export const repeatBetween = dual<
  (min: number, max: number) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, min: number, max: number) => Regex.Regex
>(3, (self, min, max) => repeat(self, Option.some(min), Option.some(max)))

/** @internal */
export const repeatMax = dual<
  (max: number) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, max: number) => Regex.Regex
>(2, (self, max) => repeat(self, Option.none(), Option.some(max)))

/** @internal */
export const sequence = dual<
  (that: Regex.Regex) => (self: Regex.Regex) => Regex.Regex,
  (self: Regex.Regex, that: Regex.Regex) => Regex.Regex
>(2, (self, that) => {
  const op = Object.create(proto)
  op._tag = "Sequence"
  op.left = self
  op.right = that
  return op
})

/** @internal */
export const string = (string: string): Regex.Regex => string.split("").map(char).reduce(sequence, succeed)

/** @internal */
export const succeed: Regex.Regex = (() => {
  const op = Object.create(proto)
  op._tag = "Succeed"
  return op
})()

/** @internal */
export const digits: Regex.Regex = repeatMin(anyDigit, 1)

/** @internal */
export const letters: Regex.Regex = repeatMin(anyLetter, 1)

/** @internal */
export const whitespace: Regex.Regex = repeatMin(anyWhitespace, 0)

/** @internal */
export const compile = (regex: Regex.Regex): Regex.Regex.Compiled => {
  const test = (index: number, chars: string): number =>
    pipe(
      InternalLookupFunction.compileToTabular(regex),
      Option.map((compiled) => compiled.test(index, chars)),
      Option.getOrElse(() => compileInternal(regex)(index, chars))
    )
  return new InternalCommon.CompiledImpl(test)
}

const compileSequence = (self: Regex.Regex): Chunk.Chunk<Regex.Regex> =>
  self._tag === "Sequence"
    ? Chunk.appendAll(compileSequence(self.left), compileSequence(self.right))
    : Chunk.of(self)

const compileInternal = (self: Regex.Regex) => (index: number, chars: string): number => {
  switch (self._tag) {
    case "Succeed": {
      return index
    }
    case "And": {
      const left = compileInternal(self.left)(index, chars)
      if (left === InternalCommon.notMatched || left === InternalCommon.needMoreInput) {
        return left
      }
      return compileInternal(self.right)(index, chars)
    }
    case "Or": {
      const left = compileInternal(self.left)(index, chars)
      if (left === InternalCommon.notMatched || left === InternalCommon.needMoreInput) {
        return compileInternal(self.right)(index, chars)
      }
      return left
    }
    case "OneOf": {
      if (index >= chars.length) {
        return InternalCommon.needMoreInput
      }
      if (self.bitset.some((bit) => bit === chars[index].charCodeAt(0))) {
        return index + 1
      }
      return InternalCommon.notMatched
    }
    case "Sequence": {
      const compiled = Chunk.map(compileSequence(self), compileInternal)
      let i = 0
      let idx = index
      while (i < compiled.length) {
        const current = Chunk.unsafeGet(compiled, i)
        idx = current(idx, chars)
        if (idx < 0) {
          // Terminate loop because current parser didn't match
          i = compiled.length
        } else {
          i = i + 1
        }
      }
      return idx
    }
    case "Repeat": {
      const min = Option.getOrElse(self.min, () => 0)
      const max = Option.getOrElse(self.max, () => Infinity)
      const compiled = compileInternal(self.regex)
      let idx = index
      let lastIdx = index
      let matched = 0
      while (idx >= 0 && idx < chars.length && matched < max) {
        idx = compiled(idx, chars)
        if (idx >= 0) {
          lastIdx = idx
          matched = matched + 1
        }
      }
      return matched < min ? InternalCommon.needMoreInput : lastIdx
    }
  }
}

/** @internal */
export const toLiteral = (self: Regex.Regex): Option.Option<Chunk.Chunk<string>> => {
  switch (self._tag) {
    case "Succeed": {
      return Option.some(Chunk.empty())
    }
    case "OneOf": {
      return self.bitset.length === 1 ?
        Option.some(Chunk.of(String.fromCharCode(self.bitset[0]))) :
        Option.none()
    }
    case "Sequence": {
      return Option.flatMap(
        toLiteral(self.left),
        (left) =>
          Option.map(
            toLiteral(self.right),
            (right) => Chunk.appendAll(left, right)
          )
      )
    }
    case "And":
    case "Or":
    case "Repeat": {
      return Option.none()
    }
  }
}
