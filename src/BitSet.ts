/**
 * @since 1.0.0
 */
import * as InternalBitSet from "./internal/bitset.js"

/**
 * @since 1.0.0
 * @category models
 */
export interface BitSet extends ReadonlyArray<number> {}

/**
 * @since 1.0.0
 * @category constructors
 */
export const allChars: BitSet = InternalBitSet.all

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable: (bits: Iterable<number>) => BitSet = InternalBitSet.fromIterable
