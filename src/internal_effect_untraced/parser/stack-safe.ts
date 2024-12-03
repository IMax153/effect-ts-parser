import * as common from "@effect/parser/internal_effect_untraced/common"
import type * as parser from "@effect/parser/internal_effect_untraced/parser"
import * as parserError from "@effect/parser/internal_effect_untraced/parserError"
import * as regex from "@effect/parser/internal_effect_untraced/regex"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Regex from "@effect/parser/Regex"
import * as Chunk from "effect/Chunk"
import * as Either from "effect/Either"
import type * as Function from "effect/Function"
import * as List from "effect/List"
import * as Option from "effect/Option"

/**
 * A `Parser` operation, the language that a `Parser` is precompiled to for
 * parsing in a stack-safe manner.
 *
 * @internal
 */
export type ParserOp =
  | BacktrackOnFailure
  | CheckEnd
  | Cut
  | MatchSeq
  | MatchRegex
  | PopName
  | PopResultPushOp
  | ProcessRepeatedElement
  | PushArray
  | PushCapturedResult
  | PushCurrentPosition
  | PushName
  | PushOp2
  | PushOp3
  | PushOp4
  | PushResult
  | ReadInputToResult
  | SkipOnFailure2
  | SkipOnSuccess2
  | TransformLast2Results
  | TransformResult
  | TransformResultEither
  | TransformResultFlipped
  | TransformResultToOption
  | Suspend

/**
 * Push `first` and then `second` to the operation stack.
 *
 * @internal
 */
export interface PushOp2 {
  readonly _tag: "PushOp2"
  readonly first: ParserOp
  readonly second: ParserOp
  readonly pushBranchPosition: boolean
}

/**
 * Push `first`, `second`, and then `third` to the operation stack.
 *
 * @internal
 */
export interface PushOp3 {
  readonly _tag: "PushOp3"
  readonly first: ParserOp
  readonly second: ParserOp
  readonly third: ParserOp
}

/**
 * Push `first`, `second`, `third`, and then `fourth` to the operation stack.
 *
 * @internal
 */
export interface PushOp4 {
  readonly _tag: "PushOp4"
  readonly first: ParserOp
  readonly second: ParserOp
  readonly third: ParserOp
  readonly fourth: ParserOp
  readonly pushBranchPosition: boolean
}

/**
 * A suspended `ParserOp` used for recursion.
 *
 * @internal
 */
export interface Suspend {
  readonly _tag: "Suspend"
  readonly op: Function.LazyArg<ParserOp>
}

/**
 * Store a result. One of success or failure must be null. If `popFirst` is
 * `true`, the last result will be replaced but only if it was a success.
 *
 * @internal
 */
export interface PushResult {
  readonly _tag: "PushResult"
  readonly success: unknown | undefined
  readonly failure: ParserError.ParserError<unknown> | undefined
  readonly popFirst: boolean
}

/**
 * Pops the last stored branch position and the last result, and replaces it
 * with the captured string as a result.
 *
 * @internal
 */
export interface PushCapturedResult {
  readonly _tag: "PushCapturedResult"
}

/**
 * Pushes the current input position as a result.
 *
 * @internal
 */
export interface PushCurrentPosition {
  readonly _tag: "PushCurrentPosition"
}

/**
 * Pushes a failure if the current position is not at the end.
 *
 * @internal
 */
export interface CheckEnd {
  readonly _tag: "CheckEnd"
}

/**
 * Store a name in the name stack.
 *
 * @internal
 */
export interface PushName {
  readonly _tag: "PushName"
  readonly name: string
}

/**
 * Pop the last pushed name from the name stack.
 *
 * @internal
 */
export interface PopName {
  readonly _tag: "PopName"
}

/**
 * Read an item from the input and push it to the result stack.
 *
 * @internal
 */
export interface ReadInputToResult {
  readonly _tag: "ReadInputToResult"
}

/**
 * Match a sequence on the input, and push the given value or failure on the
 * result stack.
 *
 * @internal
 */
export interface MatchSeq {
  readonly _tag: "MatchSeq"
  readonly sequence: Chunk.Chunk<unknown>
  readonly as: unknown
  readonly createParserFailure: (position: number, input: unknown) => unknown
}

/**
 * Match a compiled regex on the input, and push a result with the given
 * strategy or failure on the result stack.
 *
 * @internal
 */
export interface MatchRegex {
  readonly _tag: "MatchRegex"
  readonly regex: Regex.Regex.Compiled
  readonly pushAs: RegexResultPush
  readonly failAs: Option.Option<unknown>
}

/**
 * Pop the last result from the stack, transform it to either a success or a
 * failure and push back.
 *
 * @internal
 */
export interface TransformResultEither {
  readonly _tag: "TransformResultEither"
  readonly f: (result: unknown) => Either.Either<unknown, unknown>
}

/**
 * Pop the last result from the stack, transform it and with one of the
 * functions and push back. It is possible to pass null to onSuccess or
 * `onFailure` in which case it does not touch the result.
 *
 * @internal
 */
export interface TransformResult {
  readonly _tag: "TransformResult"
  readonly onSuccess: ((result: unknown) => unknown) | undefined
  readonly onFailure: ((error: ParserError.ParserError<unknown>) => ParserError.ParserError<unknown>) | undefined
}

/**
 * Pop the last result from the stack, transform it and with one of the
 * functions and push back. It converts success to failure and failure to
 * success.
 *
 * @internal
 */
export interface TransformResultFlipped {
  readonly _tag: "TransformResultFlipped"
  readonly onSuccess: (position: number, result: unknown) => ParserError.ParserError<unknown>
  readonly onFailure: (position: number, error: ParserError.ParserError<unknown>) => unknown
}

/**
 * Pop the last two results from the stack and if both were success, create a
 * single value based on the given strategy and push it back. If any of them
 * failed, push back a single failure.
 *
 * @internal
 */
export interface TransformLast2Results {
  readonly _tag: "TransformLast2Results"
  readonly strategy: PairTransformation
}

/**
 * Pop the last result from the stack and if it was success, respush wrapped
 * in `Some`, if it was failure, repush as a successful `None`. When
 * `checkBranchPosition` is true, if position was moved compared to the last
 * branch position then keep the failure.
 *
 * @internal
 */
export interface TransformResultToOption {
  readonly _tag: "TransformResultToOption"
  readonly checkBranchPosition: boolean
}

/**
 * Pop the last result and use the function to push it as parser operation
 * (i.e. `flatMap`).
 *
 * @internal
 */
export interface PopResultPushOp {
  readonly _tag: "PopResultPushOp"
  readonly f: (result: unknown) => ParserOp
}

/**
 * If the result is failure, skip the next two parser operations. This can be
 * used to shortcut the right side of a zip operation.
 *
 * @internal
 */
export interface SkipOnFailure2 {
  readonly _tag: "SkipOnFailure2"
}

/**
 * If the result is success, skip the next two parser operations. Optionally
 * if the transform is not null, it replaces the result with the transform
 * function applied to it. This can be used to shortcut the right side of an
 * or operation. If `checkBranchPosition` is true, the last branch position
 * will be popped and checked and if the position was moved the left failure
 * is kept and the next operations get skipped.
 *
 * @internal
 */
export interface SkipOnSuccess2 {
  readonly _tag: "SkipOnSuccess2"
  readonly transform: ((result: unknown) => unknown) | undefined
  readonly checkBranchPosition: boolean
}

/**
 * Creates a mutable array and pushes on the array stack.
 *
 * @internal
 */
export interface PushArray {
  readonly _tag: "PushArray"
}

/**
 * Pushes the last result to the top array stack. If the last result was
 * successful, repush the element parser and itself. If the last result is a
 * failure, finish building the result and check the min/max constraints.
 *
 * @internal
 */
export interface ProcessRepeatedElement {
  readonly _tag: "ProcessRepeatedElement"
  readonly parseElement: ParserOp
  readonly min: Option.Option<number>
  readonly max: Option.Option<number>
}

/**
 * Cut stored bookmarks if result is a success.
 *
 * @internal
 */
export interface Cut {
  readonly _tag: "Cut"
}

/**
 * Pop the last branch position, and in case of failure, reset the position to
 * it.
 *
 * @internal
 */
export interface BacktrackOnFailure {
  readonly _tag: "BacktrackOnFailure"
}

/** @internal */
export type RegexResultPush = "Ignored" | "MatchedChunk" | "SingleChar"

/** @internal */
export type PairTransformation = KeepFirst | KeepSecond | IgnoreFirstKeepSecond | IgnoreFirstWrapSecondAsRight | Zip

/** @internal */
export interface KeepFirst {
  readonly _tag: "KeepFirst"
}

/** @internal */
export interface KeepSecond {
  readonly _tag: "KeepSecond"
}

/** @internal */
export interface IgnoreFirstKeepSecond {
  readonly _tag: "IgnoreFirstKeepSecond"
}

/** @internal */
export interface IgnoreFirstWrapSecondAsRight {
  readonly _tag: "IgnoreFirstWrapSecondAsRight"
}

/** @internal */
export interface Zip {
  readonly _tag: "Zip"
  readonly zip: (left: unknown, right: unknown) => unknown
}

/** @internal */
export interface CompilerState {
  readonly optimized: Map<parser.Primitive, ParserOp>
  readonly visited: Set<parser.Primitive>
}

/** @internal */
export const compile = (parser: parser.Primitive): InitialParser =>
  toInitialParser(compileInternal(
    parser,
    { optimized: new Map(), visited: new Set() }
  ))

const compileInternal = (parser: parser.Primitive, state: CompilerState): ParserOp => {
  const alreadyOptimized = state.optimized.get(parser)
  if (alreadyOptimized !== undefined) {
    return alreadyOptimized
  }
  state.visited.add(parser)
  const compiled = compileParserNode(parser, state)
  state.optimized.set(parser, compiled)
  return compiled
}

const compileParserNode = (parser: parser.Primitive, state: CompilerState): ParserOp => {
  switch (parser._tag) {
    case "Backtrack": {
      return {
        _tag: "PushOp2",
        first: { _tag: "BacktrackOnFailure" },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: true
      }
    }
    case "CaptureString": {
      return {
        _tag: "PushOp2",
        first: { _tag: "PushCapturedResult" },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: true
      }
    }
    case "End": {
      return { _tag: "CheckEnd" }
    }
    case "Fail": {
      return {
        _tag: "PushResult",
        success: void 0,
        failure: parserError.failure(List.nil(), -1, parser.error),
        popFirst: false
      }
    }
    case "Failed": {
      return {
        _tag: "PushResult",
        success: void 0,
        failure: parser.error,
        popFirst: false
      }
    }
    case "FlatMap": {
      return {
        _tag: "PushOp2",
        first: {
          _tag: "PopResultPushOp",
          f: (result) => compileInternal(parser.f(result), state)
        },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: false
      }
    }
    case "Ignore": {
      return {
        _tag: "PushOp2",
        first: {
          _tag: "PushResult",
          success: parser.to,
          failure: undefined,
          popFirst: true
        },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: false
      }
    }
    case "Index": {
      return { _tag: "PushCurrentPosition" }
    }
    case "MapError": {
      return {
        _tag: "PushOp2",
        first: {
          _tag: "TransformResult",
          onSuccess: undefined,
          onFailure: parser.mapError
        },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: false
      }
    }
    case "Named": {
      return {
        _tag: "PushOp3",
        first: { _tag: "PopName" },
        second: compileInternal(parser.parser, state),
        third: { _tag: "PushName", name: parser.name }
      }
    }
    case "Not": {
      const inner = compileInternal(parser.parser, state)
      return {
        _tag: "PushOp2",
        first: {
          _tag: "TransformResultFlipped",
          onSuccess: (position) => parserError.failure(List.nil(), position, parser.error),
          onFailure: () => void 0
        },
        second: inner,
        pushBranchPosition: false
      }
    }
    case "Optional": {
      return {
        _tag: "PushOp2",
        first: { _tag: "TransformResultToOption", checkBranchPosition: true },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: true
      }
    }
    case "OrElse": {
      return {
        _tag: "PushOp4",
        first: { _tag: "TransformLast2Results", strategy: { _tag: "IgnoreFirstKeepSecond" } },
        second: compileInternal(parser.right(), state),
        third: { _tag: "SkipOnSuccess2", transform: void 0, checkBranchPosition: true },
        fourth: compileInternal(parser.left, state),
        pushBranchPosition: true
      }
    }
    case "OrElseEither": {
      return {
        _tag: "PushOp4",
        first: { _tag: "TransformLast2Results", strategy: { _tag: "IgnoreFirstWrapSecondAsRight" } },
        second: compileInternal(parser.right(), state),
        third: { _tag: "SkipOnSuccess2", transform: Either.left, checkBranchPosition: true },
        fourth: compileInternal(parser.left, state),
        pushBranchPosition: true
      }
    }
    case "ParseRegex": {
      return {
        _tag: "MatchRegex",
        regex: regex.compile(parser.regex),
        pushAs: "MatchedChunk",
        failAs: parser.onFailure
      }
    }
    case "ParseRegexLastChar": {
      return {
        _tag: "MatchRegex",
        regex: regex.compile(parser.regex),
        pushAs: "SingleChar",
        failAs: parser.onFailure
      }
    }
    case "Passthrough": {
      throw new Error("BUG")
    }
    case "Repeat": {
      const parseElement = compileInternal(parser.parser, state)
      return {
        _tag: "PushOp3",
        first: { _tag: "ProcessRepeatedElement", parseElement, min: parser.min, max: parser.max },
        second: parseElement,
        third: { _tag: "PushArray" }
      }
    }
    case "SetAutoBacktrack": {
      // This node is removed by the optimization phase so we can ignore it
      return compileInternal(parser.parser, state)
    }
    case "SkipRegex": {
      return {
        _tag: "MatchRegex",
        regex: regex.compile(parser.regex),
        pushAs: "Ignored",
        failAs: parser.onFailure
      }
    }
    case "Succeed": {
      return {
        _tag: "PushResult",
        success: parser.result,
        failure: void 0,
        popFirst: false
      }
    }
    case "Suspend": {
      const p = parser.parser()
      if (state.visited.has(p)) {
        return { _tag: "Suspend", op: () => state.optimized.get(p)! }
      }
      return compileInternal(p, state)
    }
    case "Transform": {
      return {
        _tag: "PushOp2",
        first: { _tag: "TransformResult", onSuccess: parser.to, onFailure: void 0 },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: false
      }
    }
    case "TransformEither": {
      return {
        _tag: "PushOp2",
        first: { _tag: "TransformResultEither", f: parser.to },
        second: compileInternal(parser.parser, state),
        pushBranchPosition: false
      }
    }
    case "ZipLeft": {
      const compiledLeft = compileInternal(parser.left, state)
      const compiledRight = compileInternal(parser.right, state)
      return {
        _tag: "PushOp4",
        first: { _tag: "TransformLast2Results", strategy: { _tag: "KeepFirst" } },
        second: compiledRight,
        third: { _tag: "SkipOnFailure2" },
        fourth: compiledLeft,
        pushBranchPosition: false
      }
    }
    case "ZipRight": {
      const compiledLeft = compileInternal(parser.left, state)
      const compiledRight = compileInternal(parser.right, state)
      return {
        _tag: "PushOp4",
        first: { _tag: "TransformLast2Results", strategy: { _tag: "KeepSecond" } },
        second: compiledRight,
        third: { _tag: "SkipOnFailure2" },
        fourth: compiledLeft,
        pushBranchPosition: false
      }
    }
    case "ZipWith": {
      const compiledLeft = compileInternal(parser.left, state)
      const compiledRight = compileInternal(parser.right, state)
      return {
        _tag: "PushOp4",
        first: { _tag: "TransformLast2Results", strategy: { _tag: "Zip", zip: parser.zip } },
        second: compiledRight,
        third: { _tag: "SkipOnFailure2" },
        fourth: compiledLeft,
        pushBranchPosition: false
      }
    }
  }
}

/** @internal */
export interface InitialParser {
  readonly op: ParserOp
  readonly stack: List.List<ParserOp>
  readonly positions: Array<number>
  readonly positionIndex: number
  readonly names: List.List<string>
  readonly builders: number
}

const InitialParser = (
  op: ParserOp,
  stack: List.List<ParserOp>,
  positions: Array<number>,
  positionIndex: number,
  names: List.List<string>,
  builders: number
): InitialParser => ({
  op,
  stack,
  positions,
  positionIndex,
  names,
  builders
})

const maxStoredPositions = 1024

const toInitialParser = (parserOp: ParserOp): InitialParser => {
  let op = parserOp
  let opStack = List.empty<ParserOp>()
  let names = List.empty<string>()
  let posCount = 0
  let builderCount = 0

  while (
    op._tag === "PopName" ||
    op._tag === "PushArray" ||
    op._tag === "PushName" ||
    op._tag === "PushOp2" ||
    op._tag === "PushOp3" ||
    op._tag === "PushOp4" ||
    op._tag === "Suspend"
  ) {
    switch (op._tag) {
      case "PopName": {
        op = (opStack as List.Cons<ParserOp>).head
        opStack = (opStack as List.Cons<ParserOp>).tail
        names = List.isNil(names) ? names : names.tail
        break
      }
      case "PushArray": {
        op = (opStack as List.Cons<ParserOp>).head
        opStack = (opStack as List.Cons<ParserOp>).tail
        builderCount = builderCount + 1
        break
      }
      case "PushName": {
        names = List.cons(op.name, names)
        op = (opStack as List.Cons<ParserOp>).head
        opStack = (opStack as List.Cons<ParserOp>).tail
        break
      }
      case "PushOp2": {
        if (op.pushBranchPosition) {
          posCount = posCount + 1
        }
        opStack = List.cons(op.first, opStack)
        op = op.second
        break
      }
      case "PushOp3": {
        opStack = List.cons(op.second, List.cons(op.first, opStack))
        op = op.third
        break
      }
      case "PushOp4": {
        if (op.pushBranchPosition) {
          posCount = posCount + 1
        }

        opStack = List.cons(op.third, List.cons(op.second, List.cons(op.first, opStack)))
        op = op.fourth
        break
      }
      case "Suspend": {
        op = op.op()
        break
      }
    }
  }

  const ops = List.reduce(List.reverse(opStack), List.empty<ParserOp>(), (ops, op) => List.cons(op, ops))
  const positions = Array.from({ length: maxStoredPositions }, () => -1)
  for (let i = 0; i < posCount; i++) {
    positions[i] = 0
  }
  return InitialParser(op, ops, positions, posCount, names, builderCount)
}

const needsEmptyResultSlot = (op: ParserOp): boolean => {
  switch (op._tag) {
    case "BacktrackOnFailure":
    case "Cut":
    case "PopName":
    case "PopResultPushOp":
    case "ProcessRepeatedElement":
    case "PushArray":
    case "PushCapturedResult":
    case "PushName":
    case "PushOp2":
    case "PushOp3":
    case "PushOp4":
    case "Suspend":
    case "TransformLast2Results":
    case "TransformResult":
    case "TransformResultEither":
    case "TransformResultFlipped":
    case "TransformResultToOption":
    case "SkipOnFailure2":
    case "SkipOnSuccess2": {
      return false
    }

    case "CheckEnd":
    case "MatchSeq":
    case "MatchRegex":
    case "PushCurrentPosition":
    case "ReadInputToResult": {
      return true
    }

    case "PushResult": {
      return !op.popFirst
    }
  }
}

/** @internal */
export const charParserExecutor = (
  parser: InitialParser,
  source: string
): Either.Either<unknown, ParserError.ParserError<unknown>> => {
  // Operation stack; the next operation is returned to the main loop as a
  // return value, further operations are stacked here
  let opStack = parser.stack
  let op: ParserOp | undefined = parser.op

  // Result stacks and explicit variables for the top two results. If success is
  // `null`, a failure value must be pushed. If success is not `null`, failure
  // is not pushed The lastSuccess and lastFailure variables are either both
  // `null` (when no result yet) or one of them have value.
  let lastSuccess1: unknown | null = null
  let lastFailure1: ParserError.ParserError<unknown> | null = null
  let lastSuccess2: unknown | null = null
  let lastFailure2: ParserError.ParserError<unknown> | null = null
  let successResultStack: List.List<unknown | null> = List.empty()
  let failedResultStack: List.List<ParserError.ParserError<unknown>> = List.empty()

  // Name stack for tracing
  let nameStack = parser.names

  // Stack of stored positions for branch verification / backtrack
  const storedPositions = parser.positions.slice()
  let storedPositionIndex = parser.positionIndex

  // Stack and top value of builders used by the Repeat operation
  let builderStack: List.List<Array<unknown>> = List.empty()
  let lastBuilder: Array<unknown> | undefined = undefined

  const ibs = parser.builders
  if (ibs > 0) {
    lastBuilder = []

    let idx = 1
    while (idx < ibs) {
      builderStack = List.cons([], builderStack)
      idx = idx + 1
    }
  }

  // Position in the source stream
  let position = 0

  const popOpStack = () => {
    if (List.isCons(opStack)) {
      op = opStack.head
      opStack = opStack.tail
    } else {
      op = undefined
    }
  }

  while (op !== undefined) {
    if (needsEmptyResultSlot(op)) {
      if (lastSuccess2 !== null) {
        successResultStack = List.cons(lastSuccess2, successResultStack)
      } else if (lastFailure2 !== null) {
        successResultStack = List.cons(null, successResultStack)
        failedResultStack = List.cons(lastFailure2, failedResultStack)
      }
      lastSuccess2 = lastSuccess1
      lastFailure2 = lastFailure1
      lastSuccess1 = null
      lastFailure1 = null
    }

    switch (op._tag) {
      case "BacktrackOnFailure": {
        const stored = storedPositions[storedPositionIndex - 1]
        storedPositionIndex = storedPositionIndex - 1
        if (lastSuccess1 === null && stored >= 0) {
          position = stored
        }
        popOpStack()
        break
      }
      case "CheckEnd": {
        if (position < source.length) {
          lastSuccess1 = null
          lastFailure1 = parserError.notConsumedAll(Option.none())
        } else {
          lastSuccess1 = undefined
          lastFailure1 = null
        }
        popOpStack()
        break
      }
      case "Cut": {
        if (lastSuccess1 !== null) {
          let index = 0
          while (index < storedPositionIndex) {
            storedPositions[index] = -1
            index = index + 1
          }
        }
        popOpStack()
        break
      }
      case "MatchSeq": {
        const pos0 = position
        let pos = 0
        let failure: ParserError.ParserError<unknown> | null = null
        while (pos < op.sequence.length && failure === null) {
          if ((pos0 + pos) < source.length) {
            const item = source[pos0 + pos]
            if (item !== Chunk.unsafeGet(op.sequence, position)) {
              failure = parserError.failure(nameStack, pos0 + pos, op.createParserFailure(pos, item))
            }
          } else {
            failure = parserError.unexpectedEndOfInput
          }
          pos = pos + 1
        }
        if (failure !== null) {
          position = pos0
          lastFailure1 = failure
        } else {
          position = position + pos
          lastSuccess1 = op.as
        }
        popOpStack()
        break
      }
      case "MatchRegex": {
        const result = op.regex.test(position, source)
        if (result === common.needMoreInput) {
          lastFailure1 = parserError.unexpectedEndOfInput
        } else if (result === common.notMatched) {
          Option.match(op.failAs, {
            onNone: () => {
              lastSuccess1 = Chunk.empty()
            },
            onSome: (error) => {
              lastFailure1 = parserError.failure(nameStack, position, error)
            }
          })
        } else {
          const oldPosition = position
          position = result
          if (op.pushAs === "MatchedChunk") {
            lastSuccess1 = Chunk.unsafeFromArray(source.split("").slice(oldPosition, result))
          } else if (op.pushAs === "Ignored") {
            lastSuccess1 = undefined
          } else {
            lastSuccess1 = source[result - 1]
          }
        }
        popOpStack()
        break
      }
      case "PopName": {
        nameStack = List.isNil(nameStack) ? nameStack : nameStack.tail
        popOpStack()
        break
      }
      case "PopResultPushOp": {
        if (lastSuccess1 !== null) {
          const parserOp = op.f(lastSuccess1)
          // pop result stack
          lastSuccess1 = lastSuccess2
          lastFailure1 = lastFailure2
          if (List.isCons(successResultStack)) {
            lastSuccess2 = successResultStack.head
            successResultStack = successResultStack.tail
          } else {
            lastSuccess2 = null
          }
          if (lastSuccess2 === null) {
            if (List.isCons(failedResultStack)) {
              lastFailure2 = failedResultStack.head
              failedResultStack = failedResultStack.tail
            } else {
              lastFailure2 = null
            }
          }
          op = parserOp
        } else {
          popOpStack()
        }
        break
      }
      case "ProcessRepeatedElement": {
        if (lastSuccess1 !== null) {
          // parsed an item
          lastBuilder!.push(lastSuccess1)
          // pop result stack
          lastSuccess1 = lastSuccess2
          lastFailure1 = lastFailure2
          if (List.isCons(successResultStack)) {
            lastSuccess2 = successResultStack.head
            successResultStack = successResultStack.tail
          } else {
            lastSuccess2 = null
          }
          if (lastSuccess2 === null) {
            if (List.isCons(failedResultStack)) {
              lastFailure2 = failedResultStack.head
              failedResultStack = failedResultStack.tail
            } else {
              lastFailure2 = null
            }
          }
          opStack = List.cons(op, opStack)
          op = op.parseElement
        } else {
          const minCount = Option.getOrElse(op.min, () => 0)
          const builder = lastBuilder
          if (List.isCons(builderStack)) {
            lastBuilder = builderStack.head
            builderStack = builderStack.tail
          } else {
            lastBuilder = undefined
          }
          if (builder!.length < minCount) {
            // not enough elements
            lastFailure1 = parserError.unexpectedEndOfInput
            popOpStack()
          } else {
            lastFailure1 = null
            lastSuccess1 = Chunk.unsafeFromArray(builder!)
          }
          popOpStack()
        }
        break
      }
      case "PushArray": {
        if (lastBuilder !== undefined) {
          builderStack = List.cons(lastBuilder, builderStack)
        }
        lastBuilder = []
        popOpStack()
        break
      }
      case "PushCapturedResult": {
        if (lastSuccess1 !== null) {
          const stored = storedPositions[storedPositionIndex - 1]
          lastSuccess1 = source.slice(stored, position)
        }
        storedPositionIndex = storedPositionIndex - 1
        popOpStack()
        break
      }
      case "PushCurrentPosition": {
        lastSuccess1 = position
        popOpStack()
        break
      }
      case "PushName": {
        nameStack = List.cons(op.name, nameStack)
        popOpStack()
        break
      }
      case "PushOp2": {
        if (op.pushBranchPosition) {
          storedPositions[storedPositionIndex] = position
          storedPositionIndex = storedPositionIndex + 1
        }
        opStack = List.cons(op.first, opStack)
        op = op.second
        break
      }
      case "PushOp3": {
        opStack = List.cons(op.first, opStack)
        opStack = List.cons(op.second, opStack)
        op = op.third
        break
      }
      case "PushOp4": {
        if (op.pushBranchPosition) {
          storedPositions[storedPositionIndex] = position
          storedPositionIndex = storedPositionIndex + 1
        }
        opStack = List.cons(op.first, opStack)
        opStack = List.cons(op.second, opStack)
        opStack = List.cons(op.third, opStack)
        op = op.fourth
        break
      }
      case "PushResult": {
        if (op.popFirst) {
          if (lastSuccess1 !== null) {
            lastSuccess1 = op.success
            lastFailure1 = op.failure === undefined ? null : op.failure
          }
        } else {
          lastSuccess1 = op.success
          lastFailure1 = op.failure === undefined ? null : op.failure
        }
        popOpStack()
        break
      }
      case "ReadInputToResult": {
        if (position < source.length) {
          position = position + 1
          lastSuccess1 = source[position - 1]
        } else {
          lastFailure1 = parserError.unexpectedEndOfInput
        }
        popOpStack()
        break
      }
      case "SkipOnFailure2": {
        if (lastSuccess1 === null) {
          opStack = List.unsafeTail(opStack)
          opStack = List.unsafeTail(opStack)
        }
        popOpStack()
        break
      }
      case "SkipOnSuccess2": {
        if (lastSuccess1 !== null) {
          opStack = List.unsafeTail(opStack)
          opStack = List.unsafeTail(opStack)
          if (op.checkBranchPosition) {
            storedPositionIndex = storedPositionIndex - 1
          }
          if (op.transform !== undefined) {
            lastSuccess1 = op.transform(lastSuccess1)
          }
        } else {
          let proceed = !op.checkBranchPosition
          if (!proceed) {
            const storedPosition = storedPositions[storedPositionIndex - 1]
            storedPositionIndex = storedPositionIndex - 1
            proceed = position === storedPosition
          }
          if (!proceed) {
            opStack = List.unsafeTail(opStack)
            opStack = List.unsafeTail(opStack)
          }
        }
        popOpStack()
        break
      }
      case "TransformLast2Results": {
        if (
          lastSuccess1 !== null && (
            lastSuccess2 !== null ||
            op.strategy._tag === "IgnoreFirstWrapSecondAsRight" ||
            op.strategy._tag === "IgnoreFirstKeepSecond"
          )
        ) {
          switch (op.strategy._tag) {
            case "KeepFirst": {
              lastSuccess1 = lastSuccess2
              break
            }
            case "KeepSecond":
            case "IgnoreFirstKeepSecond": {
              break
            }
            case "IgnoreFirstWrapSecondAsRight": {
              lastSuccess1 = Either.right(lastSuccess1)
              break
            }
            case "Zip": {
              lastSuccess1 = op.strategy.zip(lastSuccess2, lastSuccess1)
              break
            }
          }
        } else {
          if (lastFailure2 !== null) {
            if (lastFailure1 !== null) {
              lastFailure1 = parserError.addFailedBranch(lastFailure2, lastFailure1)
            } else {
              lastFailure1 = lastFailure2
            }
          }
          lastSuccess1 = null
        }
        if (List.isCons(successResultStack)) {
          lastSuccess2 = successResultStack.head
          successResultStack = successResultStack.tail
        } else {
          lastSuccess2 = null
        }
        if (lastSuccess2 === null) {
          if (List.isCons(failedResultStack)) {
            lastFailure2 = failedResultStack.head
            failedResultStack = failedResultStack.tail
          } else {
            lastFailure2 = null
          }
        } else {
          lastFailure2 = null
        }
        popOpStack()
        break
      }
      case "TransformResult": {
        if (lastSuccess1 !== null && op.onSuccess !== undefined) {
          lastSuccess1 = op.onSuccess(lastSuccess1)
        } else if (op.onFailure !== undefined) {
          lastFailure1 = op.onFailure(lastFailure1!)
        }
        popOpStack()
        break
      }
      case "TransformResultEither": {
        if (lastSuccess1 !== null) {
          const either = op.f(lastSuccess1)
          Either.match(either, {
            onLeft: (error) => {
              lastSuccess1 = null
              lastFailure1 = parserError.failure(nameStack, position, error)
            },
            onRight: (value) => {
              lastSuccess1 = value
            }
          })
        }
        popOpStack()
        break
      }
      case "TransformResultFlipped": {
        if (lastSuccess1 !== null) {
          lastFailure1 = op.onSuccess(position, lastSuccess1)
          lastSuccess1 = null
        } else {
          lastSuccess1 = op.onFailure(position, lastFailure1!)
          lastFailure1 = null
        }
        popOpStack()
        break
      }
      case "TransformResultToOption": {
        let transform = !op.checkBranchPosition
        if (!transform) {
          const storedPosition = storedPositions[storedPositionIndex - 1]
          storedPositionIndex = storedPositionIndex - 1
          transform = position === storedPosition
        }
        if (transform || lastSuccess1 !== null) {
          if (lastSuccess1 !== null) {
            lastSuccess1 = Option.some(lastSuccess1)
          } else {
            lastSuccess1 = Option.none()
            lastFailure1 = null
          }
        }
        popOpStack()
        break
      }
      case "Suspend": {
        op = op.op()
        break
      }
    }
  }

  if (lastSuccess1 === null) {
    return Either.left(lastFailure1!)
  }

  return Either.right(lastSuccess1)
}
