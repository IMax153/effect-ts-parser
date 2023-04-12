import type * as Regex from "@effect/parser/Regex"

/** @internal */
export const notMatched = -1

/** @internal */
export const needMoreInput = -2

/** @internal */
export class CompiledImpl implements Regex.Regex.Compiled {
  constructor(readonly test: (index: number, input: string) => number) {}
  matches(string: string): boolean {
    return this.test(0, string) >= 0
  }
}
