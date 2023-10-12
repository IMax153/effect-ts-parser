import type * as ChunkTarget from "@effect/parser/Target/Chunk"
import { Cause, Chunk, List } from "effect"

/** @internal */
export class ChunkTargetImpl<Output> implements ChunkTarget.ChunkTarget<Output> {
  private builder: Array<Output> = []
  private captureStack: List.List<ChunkTarget.ChunkTarget.Capture<Output>> = List.nil()
  private currentBuilder: Array<Output> = this.builder

  write(value: Output): void {
    this.currentBuilder.push(value)
  }

  capture(): ChunkTarget.ChunkTarget.Capture<Output> {
    const capture: ChunkTarget.ChunkTarget.Capture<Output> = { subBuilder: [] }
    this.captureStack = List.cons(capture, this.captureStack)
    this.currentBuilder = capture.subBuilder
    return capture
  }

  emit(capture: ChunkTarget.ChunkTarget.Capture<Output>): void {
    const popped = this.popCaptureFrame()
    if (popped === undefined || popped !== capture) {
      throw Cause.RuntimeException("Target.emit called on a capture group that was not at the top of the stack")
    }
    if (List.isCons(this.captureStack)) {
      this.currentBuilder = this.captureStack.head.subBuilder
    } else {
      this.currentBuilder = this.builder
    }
    for (let i = 0; i < capture.subBuilder.length; i++) {
      this.currentBuilder.push(capture.subBuilder[i])
    }
  }

  drop(capture: ChunkTarget.ChunkTarget.Capture<Output>): void {
    const popped = this.popCaptureFrame()
    if (popped === undefined || popped !== capture) {
      throw Cause.RuntimeException("Target.emit called on a capture group that was not at the top of the stack")
    }
    if (List.isCons(this.captureStack)) {
      this.currentBuilder = this.captureStack.head.subBuilder
    } else {
      this.currentBuilder = this.builder
    }
  }

  result(): Chunk.Chunk<Output> {
    return Chunk.unsafeFromArray(this.builder)
  }

  private popCaptureFrame(): ChunkTarget.ChunkTarget.Capture<Output> | undefined {
    if (List.isCons(this.captureStack)) {
      const current = this.captureStack.head
      this.captureStack = this.captureStack.tail
      return current
    }
    return void 0
  }
}

/** @internal */
export const make = <Output>() => new ChunkTargetImpl<Output>()
