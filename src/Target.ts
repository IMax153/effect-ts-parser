/**
 * @since 1.0.0
 */

/**
 * @since 1.0.0
 * @category models
 */
export interface Target<Capture, Output> {
  write(value: Output): void
  capture(): Capture
  emit(capture: Capture): void
  drop(capture: Capture): void
}
