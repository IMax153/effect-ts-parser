import * as Chunk from "@effect/data/Chunk"
import * as Number from "@effect/data/Number"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import type * as BitSet from "@effect/parser/BitSet"

/** @internal */
export const fromIterable = (bits: Iterable<number>): BitSet.BitSet =>
  ReadonlyArray.sort(ReadonlyArray.fromIterable(new Set(bits)), Number.Order) as BitSet.BitSet

/** @internal */
export const make = (...bits: ReadonlyArray<number>): BitSet.BitSet => ReadonlyArray.sort(new Set(bits), Number.Order)

/** @internal */
export const allChars: BitSet.BitSet = fromIterable(Chunk.range("\u0000".charCodeAt(0), "￿".charCodeAt(0)))
