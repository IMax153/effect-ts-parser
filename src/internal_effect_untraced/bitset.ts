import type * as BitSet from "@effect/parser/BitSet"
import * as Arr from "effect/Array"
import { pipe } from "effect/Function"
import * as Number from "effect/Number"

/** @internal */
export const fromIterable = (bits: Iterable<number>): BitSet.BitSet =>
  pipe(
    new Set(bits),
    Arr.sort(Number.Order)
  ) as BitSet.BitSet

/** @internal */
export const fromChars = (chars: Iterable<string>): BitSet.BitSet =>
  pipe(
    Arr.fromIterable(chars),
    Arr.map((char) => char.charCodeAt(0)),
    fromIterable
  )

/** @internal */
export const toChars = (codes: BitSet.BitSet): Iterable<string> =>
  pipe(
    codes,
    Arr.map((code) => String.fromCharCode(code))
  )

/** @internal */
export const all: BitSet.BitSet = pipe(
  ["\u0000", "\uFFFD"] as const,
  fromChars,
  ([start, end]) => Arr.range(start, end)
) as BitSet.BitSet
