import type { List } from "effect"
import { Option } from "effect"
import { dual } from "effect/Function"
import type * as ParserError from "./../ParserError.js"

/** @internal */
const ParserErrorSymbolKey = "@effect/parser/ParserError"

/** @internal */
export const ParserErrorTypeId: ParserError.ParserErrorTypeId = Symbol.for(
  ParserErrorSymbolKey
) as ParserError.ParserErrorTypeId

const proto = {
  [ParserErrorTypeId]: ParserErrorTypeId
}

/** @internal */
export const allBranchesFailed = <Error, Error2>(
  left: ParserError.ParserError<Error>,
  right: ParserError.ParserError<Error2>
): ParserError.ParserError<Error | Error2> => {
  const op = Object.create(proto)
  op._tag = "AllBranchesFailed"
  op.left = left
  op.right = right
  return op
}

/** @internal */
export const failure = <Error>(
  nameStack: List.List<string>,
  position: number,
  failure: Error
): ParserError.ParserError<Error> => {
  const op = Object.create(proto)
  op._tag = "Failure"
  op.nameStack = nameStack
  op.position = position
  op.failure = failure
  return op
}

/** @internal */
export const notConsumedAll = <Error>(
  lastFailure: Option.Option<ParserError.ParserError<Error>>
): ParserError.ParserError<Error> => {
  const op = Object.create(proto)
  op._tag = "NotConsumedAll"
  op.lastFailure = lastFailure
  return op
}

/** @internal */
export const unexpectedEndOfInput: ParserError.ParserError<never> = (() => {
  const op = Object.create(proto)
  op._tag = "UnexpectedEndOfInput"
  return op
})()

/** @internal */
export const unknownFailure = (
  nameStack: List.List<string>,
  position: number
): ParserError.ParserError<Error> => {
  const op = Object.create(proto)
  op._tag = "UnknownFailure"
  op.nameStack = nameStack
  op.position = position
  return op
}

/** @internal */
export const isParserError = (u: unknown): u is ParserError.ParserError<unknown> =>
  typeof u === "object" && u != null && ParserErrorTypeId in u

/** @internal */
export const isAllBranchesFailed = <Error>(
  self: ParserError.ParserError<Error>
): self is ParserError.AllBranchesFailed<Error> => self._tag === "AllBranchesFailed"

/** @internal */
export const isFailure = <Error>(
  self: ParserError.ParserError<Error>
): self is ParserError.Failure<Error> => self._tag === "Failure"

/** @internal */
export const isNotConsumedAll = <Error>(
  self: ParserError.ParserError<Error>
): self is ParserError.NotConsumedAll<Error> => self._tag === "NotConsumedAll"

/** @internal */
export const isUnexpectedEndOfInput = <Error>(
  self: ParserError.ParserError<Error>
): self is ParserError.UnexpectedEndOfInput => self._tag === "UnexpectedEndOfInput"

/** @internal */
export const isUnknownFailure = <Error>(
  self: ParserError.ParserError<Error>
): self is ParserError.UnknownFailure => self._tag === "UnknownFailure"

/** @internal */
export const addFailedBranch = dual<
  <Error2>(
    that: ParserError.ParserError<Error2>
  ) => <Error>(
    self: ParserError.ParserError<Error>
  ) => ParserError.ParserError<Error | Error2>,
  <Error, Error2>(
    self: ParserError.ParserError<Error>,
    that: ParserError.ParserError<Error2>
  ) => ParserError.ParserError<Error | Error2>
>(2, (self, that) => allBranchesFailed(self, that))

export const map: {
  <Error, Error2>(
    f: (error: Error) => Error2
  ): (
    self: ParserError.ParserError<Error>
  ) => ParserError.ParserError<Error2>
  <Error, Error2>(
    self: ParserError.ParserError<Error>,
    f: (error: Error) => Error2
  ): ParserError.ParserError<Error2>
} = dual<
  <Error, Error2>(
    f: (error: Error) => Error2
  ) => (
    self: ParserError.ParserError<Error>
  ) => ParserError.ParserError<Error2>,
  <Error, Error2>(
    self: ParserError.ParserError<Error>,
    f: (error: Error) => Error2
  ) => ParserError.ParserError<Error2>
>(2, (self, f) => {
  switch (self._tag) {
    case "AllBranchesFailed": {
      return allBranchesFailed(map(self.left, f), map(self.right, f))
    }
    case "Failure": {
      return failure(self.nameStack, self.position, f(self.failure))
    }
    case "NotConsumedAll": {
      return notConsumedAll(Option.map(self.lastFailure, map(f)))
    }
    case "UnexpectedEndOfInput":
    case "UnknownFailure": {
      return self
    }
  }
})
