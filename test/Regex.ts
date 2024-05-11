import { pipe } from "@effect/data/Function"
import type { Predicate } from "@effect/data/Predicate"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import * as Regex from "@effect/parser/Regex"
import * as fc from "fast-check"
import { describe, expect, it } from "vitest"

const IS_DIGIT_REGEX = /^[0-9]$/
const IS_LETTER_REGEX = /^[a-z]$/i
const IS_LETTER_OR_DIGIT_REGEX = /^[a-z0-9]$/i
const IS_WHITESPACE_REGEX = /^\s$/

const keywordStrings: ReadonlyArray<string> = [
  "abstract",
  "case",
  "catch",
  "class",
  "do",
  "else",
  "extends",
  "false",
  "finally",
  "for",
  "if",
  "import",
  "new",
  "null",
  "object",
  "package",
  "return",
  "super",
  "this",
  "throw",
  "try",
  "true",
  "type",
  "val",
  "var",
  "while",
  "yield"
]

// const keywordsChars: ReadonlyArray<ReadonlyArray<string>> = keywordStrings.map((str) => str.split(""))

const keywordsRegex: Regex.Regex = keywordStrings.slice(1)
  .map((keyword) => Regex.string(keyword))
  .reduce((acc, curr) => Regex.or(acc, curr), Regex.string(keywordStrings[0]))

const fooRegex: Regex.Regex.Compiled = Regex.compile(Regex.string("foo"))

const fooOrBar: Regex.Regex.Compiled = Regex.compile(Regex.or(Regex.string("foo"), Regex.string("bar")))

const aOrB: Regex.Regex.Compiled = Regex.compile(Regex.or(Regex.string("a"), Regex.string("b")))

const keywords: Regex.Regex.Compiled = Regex.compile(keywordsRegex)

const singleCharTest = (
  name: string,
  regex: Regex.Regex,
  f: Predicate<string>,
  charArb: fc.Arbitrary<string> = fc.char()
): void =>
  it(name, () => {
    const compiled = Regex.compile(regex)
    fc.assert(fc.property(charArb, (char) => {
      if (f(char)) {
        expect(compiled.test(0, char)).toBe(1)
      } else {
        expect(compiled.test(0, char)).not.toBe(1)
      }
    }))
  })

const multiCharPassingTest = (
  name: string,
  regex: Regex.Regex,
  charArb: fc.Arbitrary<string>
): void =>
  it(name, () => {
    const compiled = Regex.compile(regex)
    fc.assert(fc.property(fc.array(charArb, { minLength: 1 }), (input) => {
      expect(compiled.test(0, input.join(""))).toBe(input.length)
    }))
  })

const multiCharFailingTest = (
  name: string,
  regex: Regex.Regex,
  charArb: fc.Arbitrary<string>,
  counterexample: string
): void =>
  it(name, () => {
    const compiled = Regex.compile(regex)
    const arbitrary = fc.array(charArb, { minLength: 1 }).chain((input) =>
      fc.integer({ min: 0, max: input.length - 1 }).map((n) => [input, n] as const)
    )
    fc.assert(fc.property(arbitrary, ([input, injectionPoint]) => {
      const injected = pipe(
        ReadonlyArray.take(input, injectionPoint),
        ReadonlyArray.append(counterexample),
        ReadonlyArray.appendAll(ReadonlyArray.drop(input, injectionPoint))
      )
      const expected = injectionPoint === 0
        ? Regex.needMoreInput
        : injectionPoint
      expect(compiled.test(0, injected.join(""))).toBe(expected)
    }))
  })

describe.concurrent("Regex", () => {
  it("string - positive matches", () => {
    expect(fooRegex.matches("foo")).toBe(true)
  })

  it("string - negative matches", () => {
    expect(!fooRegex.matches("bar")).toBe(true)
  })

  it("string - single letter positive or", () => {
    expect(aOrB.matches("a")).toBe(true)
    expect(aOrB.matches("b")).toBe(true)
  })

  it("string - word positive or", () => {
    expect(fooOrBar.matches("foo")).toBe(true)
    expect(fooOrBar.matches("bar")).toBe(true)
  })

  it("digits - matches all digits", () => {
    const compiled = Regex.compile(Regex.digits)
    expect(compiled.matches("123")).toBe(true)
  })

  it("digits - matches the first few digits", () => {
    const compiled = Regex.compile(Regex.digits)
    expect(compiled.matches("123ABC")).toBe(true)
  })

  it("keywords - matches all keywords", () => {
    expect(keywordStrings.every((keyword) => keywords.matches(keyword))).toBe(true)
  })

  it("literal0", () => {
    const compiled = Regex.compile(Regex.string(""))
    fc.assert(fc.property(fc.string(), (input) => {
      expect(compiled.test(0, input)).toBe(0)
    }))
  })

  it("literal+", () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }).filter(a => a !== "not".slice(0, a.length)), (input) => {
      const compiled = Regex.compile(Regex.string(input))
      const bad = "not" + input
      expect(compiled.test(0, input)).toBe(input.length)
      expect(compiled.test(0, bad)).toBeLessThan(input.length)
    }))
  })

  it("sequence", () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }), (s1, s2) => {
      const compiled = Regex.compile(Regex.sequence(Regex.string(s1), Regex.string(s2)))
      expect(compiled.test(0, s1 + s2)).toBe(s1.length + s2.length)
    }))
  })

  it("or", () => {
    fc.assert(fc.property(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }), (s1, s2) => {
      const compiled = Regex.compile(Regex.or(Regex.string(s1), Regex.string(s2)))
      expect(compiled.test(0, s1)).toBe(s1.length)
      expect(compiled.test(0, s2)).toBe(s2.length)
    }))
  })

  it("and", () => {
    const compiled = Regex.compile(Regex.and(Regex.charIn(["a", "b", "c"]), Regex.charIn(["b"])))
    expect(compiled.test(0, "a")).toBe(Regex.notMatched)
    expect(compiled.test(0, "b")).toBe(1)
  })

  it("atLeast", () => {
    fc.assert(
      fc.property(
        fc.array(fc.char().filter((char) => IS_DIGIT_REGEX.test(char)), { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 0, max: 20 }),
        (array, min) => {
          const compiled = Regex.compile(Regex.atLeast(Regex.anyDigit, min))
          const expected = array.length >= min ? array.length : Regex.needMoreInput
          expect(compiled.test(0, array.join(""))).toBe(expected)
        }
      )
    )
  })

  it("atMost", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 20 }), fc.integer({ min: 0, max: 20 }), (len, max) => {
      const str = "abc".repeat(len)
      const compiled = Regex.compile(Regex.atMost(Regex.string("abc"), max))
      const expected = Math.min(len, max) * 3
      expect(compiled.test(0, str)).toBe(expected)
    }))
  })

  it("between", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        (len, a, b) => {
          const max = Math.max(a, b)
          const min = Math.min(a, b)
          const str = "x".repeat(len)
          const compiled = Regex.compile(Regex.between(Regex.string("x"), min, max))
          const expected = len >= min ? Math.min(len, max) : Regex.needMoreInput
          expect(compiled.test(0, str)).toBe(expected)
        }
      )
    )
  })

  it("end of stream - charIn(['a', 'b'])", () => {
    const compiled = Regex.compile(Regex.charIn(["a", "b"]))
    expect(compiled.test(0, "")).toBe(Regex.needMoreInput)
  })

  it("end of stream - char('a')", () => {
    const compiled = Regex.compile(Regex.char("a"))
    expect(compiled.test(0, "")).toBe(Regex.needMoreInput)
  })

  it("end of stream - anyChar.atLeast(0)", () => {
    const compiled = Regex.compile(Regex.atLeast(Regex.anyChar, 0))
    expect(compiled.test(0, "")).toBe(0)
  })

  it("end of stream - char('x').atLeast(0)", () => {
    const compiled = Regex.compile(Regex.atLeast(Regex.char("x"), 0))
    expect(compiled.test(0, "")).toBe(0)
  })

  singleCharTest("alphaNumeric", Regex.anyAlphaNumeric, (char) => IS_LETTER_OR_DIGIT_REGEX.test(char))

  singleCharTest("digit", Regex.anyDigit, (char) => IS_DIGIT_REGEX.test(char))

  singleCharTest("letter", Regex.anyLetter, (char) => IS_LETTER_REGEX.test(char))

  singleCharTest("whitespace", Regex.whitespace, (char) => IS_WHITESPACE_REGEX.test(char))

  singleCharTest(
    "filter - single character",
    Regex.filter((char) => char === "a" || char === "b"),
    (char) => char === "a" || char === "b",
    fc.constantFrom("a", "b", "c", "d")
  )

  singleCharTest(
    "charIn - single character",
    Regex.charIn(["a", "b"]),
    (char) => char === "a" || char === "b",
    fc.constantFrom("a", "b", "c", "d")
  )

  singleCharTest(
    "charNotIn - single character",
    Regex.charNotIn(["a", "b"]),
    (char) => char !== "a" && char !== "b",
    fc.constantFrom("a", "b", "c", "d")
  )

  singleCharTest("string literal - single character", Regex.string("X"), (char) => char === "X", fc.ascii())

  multiCharPassingTest(
    "alphaNumerics - multiple characters passing",
    Regex.alphaNumerics,
    fc.char().filter((char) => IS_LETTER_OR_DIGIT_REGEX.test(char))
  )

  multiCharPassingTest(
    "digits - multiple characters passing",
    Regex.digits,
    fc.char().filter((char) => IS_DIGIT_REGEX.test(char))
  )

  multiCharPassingTest(
    "letters - multiple characters passing",
    Regex.letters,
    fc.char().filter((char) => IS_LETTER_REGEX.test(char))
  )

  multiCharPassingTest(
    "whitespaces - multiple characters passing",
    Regex.whitespace,
    fc.char().filter((char) => IS_WHITESPACE_REGEX.test(char))
  )

  multiCharFailingTest(
    "alphanumerics - multiple characters failing",
    Regex.alphaNumerics,
    fc.char().filter((char) => IS_LETTER_OR_DIGIT_REGEX.test(char)),
    "!"
  )

  multiCharFailingTest(
    "digits - multiple characters failing",
    Regex.digits,
    fc.char().filter((char) => IS_DIGIT_REGEX.test(char)),
    "a"
  )

  multiCharFailingTest(
    "letters - multiple characters failing",
    Regex.letters,
    fc.char().filter((char) => IS_LETTER_REGEX.test(char)),
    "0"
  )
})
