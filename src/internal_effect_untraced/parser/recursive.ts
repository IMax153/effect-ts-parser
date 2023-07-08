import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import * as List from "@effect/data/List"
import * as Option from "@effect/data/Option"
import * as common from "@effect/parser/internal_effect_untraced/common"
import type * as parser from "@effect/parser/internal_effect_untraced/parser"
import * as parserError from "@effect/parser/internal_effect_untraced/parserError"
import * as _regex from "@effect/parser/internal_effect_untraced/regex"
import type * as ParserError from "@effect/parser/ParserError"
import type * as Regex from "@effect/parser/Regex"

/**
 * The state of the recursive parser implementation.
 *
 * @internal
 */
export abstract class ParserState<Input> {
  abstract readonly length: number
  abstract at(position: number): Input
  abstract sliceToChunk(position: number, until: number): Chunk.Chunk<Input>
  abstract sliceToString(position: number, until: number): string
  abstract regex(compiledRegex: Regex.Regex.Compiled): number

  public position = 0
  public discard = false
  public nameStack = List.empty<string>()
  public error: ParserError.ParserError<unknown> | undefined = undefined

  charAt(position: number): string {
    return this.at(position) as string
  }

  pushName(name: string): void {
    this.nameStack = List.prepend(this.nameStack, name)
  }

  popName(): void {
    if (List.isCons(this.nameStack)) {
      this.nameStack = this.nameStack.tail
    }
  }
}

/** @internal */
export const parseRecursive = <Input>(self: parser.Primitive, state: ParserState<Input>): unknown | undefined => {
  switch (self._tag) {
    case "Backtrack": {
      const position = state.position
      const result = parseRecursive(self.parser, state)
      if (state.error !== undefined) {
        state.position = position
      }
      return result
    }
    case "CaptureString": {
      const discard = state.discard
      const startPosition = state.position
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      if (!discard && state.error === undefined) {
        const endPosition = state.position
        return state.sliceToString(startPosition, endPosition)
      }
      return undefined
    }
    case "End": {
      if (state.position < state.length) {
        state.error = parserError.notConsumedAll(Option.none())
      }
      return undefined
    }
    case "Fail": {
      state.error = parserError.failure(state.nameStack, state.position, self.error)
      return undefined
    }
    case "Failed": {
      state.error = self.error
      return undefined
    }
    case "FlatMap": {
      const discard = state.discard
      state.discard = false
      const result = parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        const next = self.f(result)
        return parseRecursive(next, state)
      }
      return undefined
    }
    case "Ignore": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      return self.to
    }
    case "Index": {
      return state.position
    }
    case "MapError": {
      const result = parseRecursive(self.parser, state)
      if (state.error !== undefined) {
        state.error = self.mapError(state.error)
      }
      return result
    }
    case "Named": {
      state.pushName(self.name)
      const result = parseRecursive(self.parser, state)
      state.popName()
      return result
    }
    case "Not": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        state.error = parserError.failure(state.nameStack, state.position, self.error)
      } else {
        state.error = undefined
      }
      return undefined
    }
    case "Optional": {
      const startPosition = state.position
      const result = parseRecursive(self.parser, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return Option.some(result)
        }
        return undefined
      }
      if (state.position !== startPosition) {
        return undefined
      }
      state.error = undefined
      return Option.none()
    }
    case "OrElse": {
      const startPosition = state.position
      const leftResult = parseRecursive(self.left, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return leftResult
        }
        return undefined
      }
      if (state.position === startPosition) {
        const leftFailure = state.error
        state.error = undefined
        const rightResult = parseRecursive(self.right(), state)
        if (state.error === undefined) {
          if (!state.discard) {
            return rightResult
          }
          return undefined
        }
        state.error = parserError.addFailedBranch(leftFailure, state.error)
        return undefined
      }
      return undefined
    }
    case "OrElseEither": {
      const startPosition = state.position
      const leftResult = parseRecursive(self.left, state)
      if (state.error === undefined) {
        if (!state.discard) {
          return Either.left(leftResult)
        }
        return undefined
      }
      if (state.position === startPosition) {
        const leftFailure = state.error
        state.error = undefined
        const rightResult = parseRecursive(self.right(), state)
        if (state.error === undefined) {
          if (!state.discard) {
            return Either.right(rightResult)
          }
          return undefined
        }
        state.error = parserError.addFailedBranch(leftFailure, state.error)
        return undefined
      }
      return undefined
    }
    case "ParseRegex": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
        return undefined
      }
      if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
        return undefined
      }
      state.position = result
      if (!state.discard) {
        return state.sliceToChunk(position, result)
      }
      return undefined
    }
    case "ParseRegexLastChar": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
        return undefined
      }
      if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
        return undefined
      }
      state.position = result
      if (!state.discard) {
        return state.charAt(result - 1)
      }
      return undefined
    }
    case "Passthrough": {
      if (state.position < state.length) {
        const result = state.at(state.position)
        state.position = state.position + 1
        return result
      }
      state.error = parserError.unexpectedEndOfInput
      return undefined
    }
    case "Repeat": {
      const maxCount = Option.getOrElse(self.max, () => Infinity)
      const minCount = Option.getOrElse(self.min, () => 0)
      const discard = state.discard
      const builder: Array<unknown> | undefined = discard ? undefined : []
      let count = 0
      let lastItemStart = -1
      const sourceLength = state.length
      while (state.error === undefined && count < maxCount && lastItemStart < sourceLength) {
        lastItemStart = state.position
        const item = parseRecursive(self.parser, state)
        if (state.error === undefined) {
          count = count + 1
          if (!discard) {
            builder!.push(item)
          }
        }
      }
      if (count < minCount && state.error === undefined) {
        state.error = parserError.unexpectedEndOfInput
      } else {
        if (count >= minCount) {
          state.error = undefined
        }
      }
      if (!discard && state.error === undefined) {
        return Chunk.unsafeFromArray(builder!)
      }
      return undefined
    }
    case "SetAutoBacktrack": {
      // optimize will always remove this node
      return undefined
    }
    case "SkipRegex": {
      const position = state.position
      const result = state.regex(_regex.compile(self.regex))
      if (result === common.needMoreInput) {
        state.error = parserError.unexpectedEndOfInput
      } else if (result === common.notMatched) {
        state.error = getParserError(position, state.nameStack, self.onFailure)
      } else {
        state.position = result
      }
      return undefined
    }
    case "Succeed": {
      return self.result
    }
    case "Suspend": {
      return parseRecursive(self.parser(), state)
    }
    case "Transform": {
      const result = parseRecursive(self.parser, state)
      if (!state.discard && state.error === undefined) {
        return self.to(result)
      }
      return undefined
    }
    case "TransformEither": {
      // NOTE: cannot skip in discard mode, we need to detect failures
      const discard = state.discard
      state.discard = false
      const innerResult = parseRecursive(self.parser, state)
      state.discard = discard
      if (state.error === undefined) {
        const result = self.to(innerResult)
        return Either.match(result, {
          onLeft: (error) => {
            state.error = parserError.failure(state.nameStack, state.position, error)
            return undefined
          },
          onRight: (value) => value
        })
      }
      return undefined
    }
    case "ZipLeft": {
      const left = parseRecursive(self.left, state)
      if (state.error === undefined) {
        const discard = state.discard
        state.discard = true
        parseRecursive(self.right, state)
        state.discard = discard
        if (state.error === undefined) {
          return left
        }
      }
      return undefined
    }
    case "ZipRight": {
      const discard = state.discard
      state.discard = true
      parseRecursive(self.left, state)
      state.discard = discard
      if (state.error === undefined) {
        const right = parseRecursive(self.right, state)
        if (state.error === undefined) {
          return right
        }
      }
      return undefined
    }
    case "ZipWith": {
      const left = parseRecursive(self.left, state)
      if (state.error === undefined) {
        const right = parseRecursive(self.right, state)
        if (!state.discard && state.error === undefined) {
          return self.zip(left, right)
        }
      }
      return undefined
    }
  }
}

const getParserError = (
  position: number,
  nameStack: List.List<string>,
  onFailure: Option.Option<unknown>
): ParserError.ParserError<unknown> =>
  Option.match(
    onFailure,
    {
      onNone: () => parserError.unknownFailure(nameStack, position),
      onSome: (error) => parserError.failure(nameStack, position, error)
    }
  )
