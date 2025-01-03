import type * as ParserError from "@effect/parser/ParserError"
import * as Syntax from "@effect/parser/Syntax"
import { Either, pipe } from "effect"

export const tests = <Error, Result>(
  name: string,
  syntax: Syntax.Syntax<string, Error, string, Result>,
  input: string,
  assertion: Either.Either<Result, ParserError.ParserError<Error>>,
  printer?: Either.Either<string, Error>
): void => {
  const result = Syntax.parseStringWith(syntax, input, "stack-safe")
  it(`${name} - stack-safe`, () => {
    expect(JSON.stringify(result)).toEqual(JSON.stringify(assertion))
  })
  it(`${name} - recursive`, () => {
    const result = Syntax.parseStringWith(syntax, input, "recursive")
    expect(JSON.stringify(result)).toEqual(JSON.stringify(assertion))
  })
  if (Either.isRight(result) && printer) {
    it(`${name} - printer`, () => {
      const result1 = Syntax.printString(syntax, result.right)
      expect(result1).toEqual(printer)
    })
  }
}

tests(
  "basic",
  Syntax.charIn("A"),
  "A",
  Either.right("A")
)

export const hexDigit = Syntax.charIn("0123456789abcdefABCDEF")
export const hexDigits = pipe(hexDigit, Syntax.repeat1)
