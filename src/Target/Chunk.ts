/**
 * @since 1.0.0
 */
import type { Target } from "@effect/parser/Target"
import * as internal from "../internal_effect_untraced/chunkTarget.js"

/**
 * @since 1.0.0
 * @category models
 */
export interface ChunkTarget<Output> extends Target<ChunkTarget.Capture<Output>, Output> {}

/**
 * @since 1.0.0
 */
export declare namespace ChunkTarget {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Capture<Output> {
    readonly subBuilder: Array<Output>
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <Output>() => ChunkTarget<Output> = internal.make
