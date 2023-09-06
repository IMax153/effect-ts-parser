/**
 * @since 1.0.0
 */
import * as internal from "@effect/parser/internal_effect_untraced/bitset"

/**
 * @since 1.0.0
 * @category models
 */
export interface BitSet extends ReadonlyArray<number> {}

/**
 * @since 1.0.0
 * @category constructors
 */
export const allChars: BitSet = internal.all

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable: (bits: Iterable<number>) => BitSet = internal.fromIterable
