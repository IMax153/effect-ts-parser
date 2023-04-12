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
export const allChars: BitSet = internal.allChars

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable: (bits: Iterable<number>) => BitSet = internal.fromIterable

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: (...bits: ReadonlyArray<number>) => BitSet = internal.make
