import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import type * as ParserError from "@effect/parser/ParserError"
import * as Syntax from "@effect/parser/Syntax"

export const tests = <Error, Result>(
  name: string,
  syntax: Syntax.Syntax<string, Error, string, Result>,
  input: string,
  assertion: Either.Either<ParserError.ParserError<Error>, Result>,
  printer?: Either.Either<Error, string>
): void => {
  const result = Syntax.parseStringWith(syntax, input, "stack-safe")
  it(`${name} - stack-safe`, () => {
    expect(result).toEqual(assertion)
  })
  it(`${name} - recursive`, () => {
    const result = Syntax.parseStringWith(syntax, input, "recursive")
    expect(result).toEqual(assertion)
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
