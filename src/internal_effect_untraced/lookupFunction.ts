import * as Chunk from "@effect/data/Chunk"
import * as Equal from "@effect/data/Equal"
import { pipe } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import * as HashSet from "@effect/data/HashSet"
import * as Number from "@effect/data/Number"
import * as Option from "@effect/data/Option"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import * as Cause from "@effect/io/Cause"
import * as bitset from "@effect/parser/internal_effect_untraced/bitset"
import * as common from "@effect/parser/internal_effect_untraced/common"
import type * as Regex from "@effect/parser/Regex"

const LookupFunctionSymbolKey = "@effect/parser/LookupFunction"

/** @internal */
export const LookupFunctionTypeId = Symbol.for(LookupFunctionSymbolKey)

/** @internal */
export type LookupFunctionTypeId = typeof LookupFunctionTypeId

const LookupFunctionStepSymbolKey = "@effect/parser/LookupFunction/Step"

/** @internal */
export const LookupFunctionStepTypeId = Symbol.for(LookupFunctionStepSymbolKey)

/** @internal */
export type LookupFunctionStepTypeId = typeof LookupFunctionStepTypeId

/** @internal */
export type LookupFunction = Empty | AcceptAll | And | Or | Sequence | Table

/** @internal */
export declare namespace LookupFunction {
  /** @internal */
  export type Step = StepError | StepMatched | StepMatchedOrJump | StepJump
}

/** @internal */
export class StepError implements Equal.Equal {
  readonly [LookupFunctionStepTypeId] = LookupFunctionStepTypeId
  readonly _tag = "Error";
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionStepSymbolKey),
      Hash.combine(Hash.string(LookupFunctionStepSymbolKey + "/" + this._tag))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunctionStep(that) && isErrorStep(that)
  }
}

/** @internal */
export class StepMatched implements Equal.Equal {
  readonly [LookupFunctionStepTypeId] = LookupFunctionStepTypeId
  readonly _tag = "Matched";
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionStepSymbolKey),
      Hash.combine(Hash.string(LookupFunctionStepSymbolKey + "/" + this._tag))
    )
  }
  [Equal.symbol](u: unknown): boolean {
    return isLookupFunctionStep(u) && isMatchedStep(u)
  }
}

/** @internal */
export class StepMatchedOrJump implements Equal.Equal {
  readonly [LookupFunctionStepTypeId] = LookupFunctionStepTypeId
  readonly _tag = "MatchedOrJump"
  constructor(readonly lookup: LookupFunction) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionStepSymbolKey),
      Hash.combine(Hash.string(LookupFunctionStepSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.lookup))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunctionStep(that)
      && isMatchedOrJumpStep(that)
      && Equal.equals(this.lookup, that.lookup)
  }
}

/** @internal */
export class StepJump implements Equal.Equal {
  readonly [LookupFunctionStepTypeId] = LookupFunctionStepTypeId
  readonly _tag = "Jump"
  constructor(readonly lookup: LookupFunction) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionStepSymbolKey),
      Hash.combine(Hash.string(LookupFunctionStepSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.lookup))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunctionStep(that)
      && isJumpStep(that)
      && Equal.equals(this.lookup, that.lookup)
  }
}

/** @internal */
export class Empty implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "Empty";
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that) && isEmpty(that)
  }
}

/** @internal */
export class AcceptAll implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "AcceptAll";
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that) && isAcceptAll(that)
  }
}

/** @internal */
export class And implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "And"
  constructor(readonly left: LookupFunction, readonly right: LookupFunction) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.left)),
      Hash.combine(Hash.hash(this.right))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that)
      && isAnd(that)
      && Equal.equals(this.left, that.left)
      && Equal.equals(this.right, that.right)
  }
}

/** @internal */
export class Or implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "Or"
  constructor(readonly left: LookupFunction, readonly right: LookupFunction) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.left)),
      Hash.combine(Hash.hash(this.right))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that)
      && isOr(that)
      && Equal.equals(this.left, that.left)
      && Equal.equals(this.right, that.right)
  }
}

/** @internal */
export class Sequence implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "Sequence"
  constructor(readonly left: LookupFunction, readonly right: LookupFunction) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.left)),
      Hash.combine(Hash.hash(this.right))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that)
      && isSequence(that)
      && Equal.equals(this.left, that.left)
      && Equal.equals(this.right, that.right)
  }
}

/** @internal */
export class Table implements Equal.Equal {
  readonly [LookupFunctionTypeId] = LookupFunctionTypeId
  readonly _tag = "Table"
  constructor(readonly parseChar: Chunk.Chunk<LookupFunction.Step>) {}
  [Hash.symbol](): number {
    return pipe(
      Hash.string(LookupFunctionSymbolKey),
      Hash.combine(Hash.string(LookupFunctionSymbolKey + "/" + this._tag)),
      Hash.combine(Hash.hash(this.parseChar))
    )
  }
  [Equal.symbol](that: unknown): boolean {
    return isLookupFunction(that)
      && isTable(that)
      && Equal.equals(this.parseChar, that.parseChar)
  }
}

/** @internal */
const errorStep: LookupFunction.Step = new StepError()

/** @internal */
const matchedStep: LookupFunction.Step = new StepMatched()

/** @internal */
export const matchedOrJumpStep = (lookup: LookupFunction): LookupFunction.Step => new StepMatchedOrJump(lookup)

/** @internal */
export const jumpStep = (lookup: LookupFunction): LookupFunction.Step => new StepJump(lookup)

/** @internal */
export const isLookupFunctionStep = (u: unknown): u is LookupFunction.Step =>
  typeof u === "object" && u != null && LookupFunctionStepTypeId in u

/** @internal */
export const isErrorStep = (self: LookupFunction.Step): self is StepError => self._tag === "Error"

/** @internal */
export const isMatchedStep = (self: LookupFunction.Step): self is StepMatched => self._tag === "Matched"

/** @internal */
export const isMatchedOrJumpStep = (self: LookupFunction.Step): self is StepMatchedOrJump =>
  self._tag === "MatchedOrJump"

/** @internal */
export const isJumpStep = (self: LookupFunction.Step): self is StepJump => self._tag === "Jump"

/** @internal */
export const andStep = (self: LookupFunction.Step, that: LookupFunction.Step): LookupFunction.Step => {
  if (isMatchedStep(self) && isMatchedStep(that)) {
    return matchedStep
  }
  if (isJumpStep(self) && isJumpStep(that)) {
    return jumpStep(and(self.lookup, that.lookup))
  }
  return errorStep
}

/** @internal */
export const orStep = (self: LookupFunction.Step, that: LookupFunction.Step): LookupFunction.Step => {
  if (isMatchedStep(self) && isJumpStep(that)) {
    return matchedOrJumpStep(that.lookup)
  }
  if (isJumpStep(self) && isMatchedStep(that)) {
    return matchedOrJumpStep(self.lookup)
  }
  if (isMatchedStep(self) || isMatchedStep(that)) {
    return matchedStep
  }
  if (isErrorStep(that)) {
    return self
  }
  if (isErrorStep(self)) {
    return that
  }
  if (isJumpStep(self) && isJumpStep(that)) {
    return jumpStep(or(self.lookup, that.lookup))
  }
  if (isMatchedOrJumpStep(self) && isJumpStep(that)) {
    return matchedOrJumpStep(or(self.lookup, that.lookup))
  }
  if (isJumpStep(self) && isMatchedOrJumpStep(that)) {
    return matchedOrJumpStep(or(self.lookup, that.lookup))
  }
  if (isMatchedOrJumpStep(self) && isMatchedOrJumpStep(that)) {
    return matchedOrJumpStep(or(self.lookup, that.lookup))
  }
  return errorStep
}

/** @internal */
export const sequenceStep = (self: LookupFunction.Step, that: LookupFunction.Step): LookupFunction.Step => {
  if (isMatchedStep(self)) {
    return that
  }
  if (isMatchedStep(that)) {
    return self
  }
  if (isJumpStep(self) && isJumpStep(that)) {
    return jumpStep(sequence(self.lookup, that.lookup))
  }
  if (isMatchedOrJumpStep(self) && isJumpStep(that)) {
    return jumpStep(or(sequence(self.lookup, that.lookup), that.lookup))
  }
  return errorStep
}

/** @internal */
export const empty: LookupFunction = new Empty()

/** @internal */
export const acceptAll: LookupFunction = new AcceptAll()

/** @internal */
export const and = (self: LookupFunction, that: LookupFunction): LookupFunction => {
  if (isEmpty(self) && isEmpty(that)) {
    return empty
  }
  switch (self._tag) {
    case "Empty": {
      return that
    }
    case "AcceptAll":
    case "And":
    case "Or":
    case "Sequence": {
      return isEmpty(that) ? self : new And(self, that)
    }
    case "Table": {
      return isTable(that)
        ? combineTablesWith(self, that, andStep)
        : new And(self, that)
    }
  }
}

/** @internal */
export const or = (self: LookupFunction, that: LookupFunction): LookupFunction => {
  if (isEmpty(self) && isEmpty(that)) {
    return empty
  }
  switch (self._tag) {
    case "Empty":
    case "AcceptAll":
    case "And":
    case "Or":
    case "Sequence": {
      return new Or(self, that)
    }
    case "Table": {
      return isTable(that)
        ? combineTablesWith(self, that, orStep)
        : new Or(self, that)
    }
  }
}

/** @internal */
export const sequence = (self: LookupFunction, that: LookupFunction): LookupFunction => {
  if (isEmpty(self) && isEmpty(that)) {
    return empty
  }
  switch (self._tag) {
    case "Empty": {
      return that
    }
    case "AcceptAll":
    case "And":
    case "Or":
    case "Sequence": {
      return isEmpty(that) ? self : new Sequence(self, that)
    }
    case "Table": {
      return supportsEmpty(that)
        ? new Table(Chunk.map(self.parseChar, (step) => sequenceStep(step, matchedOrJumpStep(that))))
        : new Table(Chunk.map(self.parseChar, (step) => sequenceStep(step, jumpStep(that))))
    }
  }
}

/** @internal */
export const isLookupFunction = (u: unknown): u is LookupFunction =>
  typeof u === "object" && u != null && LookupFunctionTypeId in u

/** @internal */
export const isEmpty = (self: LookupFunction): self is Empty => self._tag === "Empty"

/** @internal */
export const isAcceptAll = (self: LookupFunction): self is AcceptAll => self._tag === "AcceptAll"

/** @internal */
export const isAnd = (self: LookupFunction): self is And => self._tag === "And"

/** @internal */
export const isOr = (self: LookupFunction): self is And => self._tag === "Or"

/** @internal */
export const isSequence = (self: LookupFunction): self is And => self._tag === "Sequence"

/** @internal */
export const isTable = (self: LookupFunction): self is Table => self._tag === "Table"

const compileTest = (self: LookupFunction) => {
  return (index: number, input: string): number => {
    let curLookup = self
    let curIdx = index
    let result = common.needMoreInput
    while (curIdx < input.length) {
      const char = input[curIdx]!.charCodeAt(0)
      curIdx = curIdx + 1
      const step = lookup(curLookup, char)
      switch (step._tag) {
        case "Error": {
          if (result === common.needMoreInput) {
            result = common.notMatched
          }
          curIdx = input.length
          break
        }
        case "Matched": {
          result = curIdx
          curIdx = input.length
          break
        }
        case "Jump": {
          curLookup = step.lookup
          break
        }
        case "MatchedOrJump": {
          result = curIdx
          curLookup = step.lookup
          break
        }
      }
    }
    if ((result === common.needMoreInput || result === common.notMatched) && supportsEmpty(self)) {
      return index
    }
    return result
  }
}

const compileLookupFunction = (self: Regex.Regex): LookupFunction => {
  switch (self._tag) {
    case "Succeed": {
      return empty
    }
    case "And": {
      return and(compileLookupFunction(self.left), compileLookupFunction(self.right))
    }
    case "Or": {
      return or(compileLookupFunction(self.left), compileLookupFunction(self.right))
    }
    case "OneOf": {
      if (
        self.bitset.length === bitset.allChars.length &&
        ReadonlyArray.getEquivalence(Number.Equivalence)(self.bitset, bitset.allChars)
      ) {
        return acceptAll
      }
      const array: Array<LookupFunction.Step> = Array.from(
        { length: self.bitset.some((n) => n >= 256) ? 65536 : 256 },
        () => errorStep
      )
      for (let i = 0; i < self.bitset.length; i++) {
        array[self.bitset[i]] = matchedStep
      }
      return new Table(Chunk.unsafeFromArray(array))
    }
    case "Sequence": {
      return sequence(compileLookupFunction(self.left), compileLookupFunction(self.right))
    }
    case "Repeat": {
      if (Option.isSome(self.max)) {
        const min = Option.getOrElse(self.min, () => 0)
        const max = self.max.value
        const lookupFn = compileLookupFunction(self.regex)
        const start = min === 0
          ? empty
          : Array.from({ length: Math.max(0, min - 1) }, () => lookupFn).reduce(sequence, lookupFn)
        let i = min
        let set = HashSet.make(start)
        let curr = start
        while (i < max) {
          curr = sequence(curr, lookupFn)
          set = HashSet.add(set, curr)
          i = i + 1
        }
        const choices = ReadonlyArray.fromIterable(set)
        const head = choices[0]!
        const rest = choices.slice(1)
        return ReadonlyArray.reduce(rest, head, or)
      }
      throw Cause.IllegalArgumentException("Cannot compile to DFA unbounded repetition")
    }
  }
}

/** @internal */
export const compileToTabular = (self: Regex.Regex): Option.Option<Regex.Regex.Compiled> => {
  try {
    const lookupFunction = compileLookupFunction(self)
    const test = compileTest(lookupFunction)
    return Option.some(new common.CompiledImpl(test))
  } catch (error) {
    if (Cause.isIllegalArgumentException(error)) {
      return Option.none()
    }
    throw error
  }
}

/** @internal */
export const lookup = (self: LookupFunction, char: number): LookupFunction.Step => {
  switch (self._tag) {
    case "Empty": {
      return errorStep
    }
    case "AcceptAll": {
      return matchedStep
    }
    case "And": {
      return andStep(lookup(self.left, char), lookup(self.right, char))
    }
    case "Or": {
      return orStep(lookup(self.left, char), lookup(self.right, char))
    }
    case "Sequence": {
      const next = supportsEmpty(self.right) ? matchedOrJumpStep(self.right) : jumpStep(self.right)
      return sequenceStep(lookup(self.left, char), next)
    }
    case "Table": {
      return char >= self.parseChar.length ? errorStep : Chunk.unsafeGet(self.parseChar, char)
    }
  }
}

/** @internal */
export const supportsEmpty = (self: LookupFunction): boolean => {
  switch (self._tag) {
    case "Empty": {
      return true
    }
    case "And": {
      return supportsEmpty(self.left) && supportsEmpty(self.right)
    }
    case "Or": {
      return supportsEmpty(self.left) || supportsEmpty(self.right)
    }
    case "Sequence": {
      return supportsEmpty(self.left) && supportsEmpty(self.right)
    }
    case "AcceptAll":
    case "Table": {
      return false
    }
  }
}

const equalizeTables = (self: Table, that: Table): readonly [Table, Table] => {
  if (that.parseChar.length > self.parseChar.length) {
    const extension = Chunk.makeBy(that.parseChar.length - self.parseChar.length, () => errorStep)
    return [new Table(Chunk.concat(self.parseChar, extension)), that]
  }
  if (self.parseChar.length > that.parseChar.length) {
    const extension = Chunk.makeBy(self.parseChar.length - that.parseChar.length, () => errorStep)
    return [self, new Table(Chunk.concat(that.parseChar, extension))]
  }
  return [self, that]
}

const combineTablesWith = (
  self: Table,
  that: Table,
  f: (left: LookupFunction.Step, right: LookupFunction.Step) => LookupFunction.Step
): LookupFunction => {
  const tuple = equalizeTables(self, that)
  return new Table(Chunk.zipWith(tuple[0].parseChar, tuple[1].parseChar, f))
}
