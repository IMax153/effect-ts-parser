import { Array as ReadonlyArray, Number } from "effect"
import { pipe } from "effect/Function"
import type * as BitSet from "./../BitSet.js"

/** @internal */
export const fromIterable = (bits: Iterable<number>): BitSet.BitSet =>
  pipe(
    new Set(bits),
    ReadonlyArray.sort(Number.Order)
  ) as BitSet.BitSet

/** @internal */
export const fromChars = (chars: Iterable<string>): BitSet.BitSet =>
  pipe(
    ReadonlyArray.fromIterable(chars),
    ReadonlyArray.map((char) => char.charCodeAt(0)),
    fromIterable
  )

/** @internal */
export const toChars = (codes: BitSet.BitSet): Iterable<string> =>
  pipe(
    codes,
    ReadonlyArray.map((code) => String.fromCharCode(code))
  )

/** @internal */
export const all: BitSet.BitSet = pipe(
  ["\u0000", "\uFFFD"] as const,
  fromChars,
  ([start, end]) => ReadonlyArray.range(start, end)
) as BitSet.BitSet
