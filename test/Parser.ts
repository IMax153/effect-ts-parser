import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as List from "@effect/data/List"
import * as Option from "@effect/data/Option"
import * as ParserError from "@effect/parser/ParserError"
import * as Syntax from "@effect/parser/Syntax"
import { describe, expect, it } from "vitest"

const charA = Syntax.as(Syntax.char("a"), "a")
const charB = Syntax.as(Syntax.char("b"), "b")

const parserTest = <Error, Result>(
  name: string,
  syntax: Syntax.Syntax<string, Error, string, Result>,
  input: string,
  assertion: Either.Either<ParserError.ParserError<Error>, Result>
): void => {
  it(`${name} - stack-safe`, () => {
    const result = Syntax.parseStringWith(syntax, input, "stack-safe")
    expect(result).toEqual(assertion)
  })

  it(`${name} - recursive`, () => {
    const result = Syntax.parseStringWith(syntax, input, "recursive")
    expect(result).toEqual(assertion)
  })
}

describe.concurrent("Parser", () => {
  parserTest(
    "succeed",
    Syntax.succeed("test"),
    "hello world",
    Either.right("test")
  )

  parserTest(
    "end, passing",
    pipe(
      Syntax.captureString(Syntax.repeat(Syntax.anyChar)),
      Syntax.zipLeft(Syntax.end)
    ),
    "hello",
    Either.right("hello")
  )

  parserTest(
    "end, failing",
    pipe(
      Syntax.captureString(Syntax.repeat(Syntax.digit)),
      Syntax.zipLeft(Syntax.end)
    ),
    "123!!!",
    Either.left(ParserError.notConsumedAll(Option.none()))
  )

  parserTest(
    "anyChar",
    Syntax.anyChar,
    "h",
    Either.right("h")
  )

  parserTest(
    "char, passing",
    Syntax.char("x"),
    "x",
    Either.right(void 0)
  )

  parserTest(
    "char, failing",
    Syntax.char("y"),
    "x",
    Either.left(ParserError.failure(List.nil(), 0, "not 'y'"))
  )

  parserTest(
    "charIn, passing #1",
    Syntax.charIn("ABC"),
    "AZXY",
    Either.right("A")
  )
  parserTest(
    "charIn, passing #2",
    Syntax.charIn("ABC"),
    "BZXY",
    Either.right("B")
  )

  parserTest(
    "charIn, passing #3",
    Syntax.charIn("ABC"),
    "CZXY",
    Either.right("C")
  )

  parserTest(
    "charIn, passing #4",
    Syntax.charIn("ABC"),
    "ABCZXY",
    Either.right("A")
  )

  parserTest(
    "charIn, failing",
    Syntax.charIn("AB"),
    "ZABAB",
    Either.left(ParserError.failure(List.nil(), 0, "not one of the expected characters (A, B)"))
  )

  parserTest(
    "filtered char, passing",
    Syntax.filter(Syntax.anyChar, (char) => char === "h", "not 'h'"),
    "h",
    Either.right("h")
  )

  parserTest(
    "filtered char, failing",
    Syntax.filter(Syntax.anyChar, (char) => char === "h", "not 'h'"),
    "e",
    Either.left(ParserError.failure(List.nil(), 1, "not 'h'"))
  )

  parserTest(
    "transform",
    Syntax.transform(
      Syntax.anyChar,
      (s) => s.charCodeAt(0),
      (n) => String.fromCharCode(n)
    ),
    "h",
    Either.right("h".charCodeAt(0))
  )

  parserTest(
    "zip",
    Syntax.zip(Syntax.anyChar, Syntax.anyChar),
    "he",
    Either.right(["h", "e"] as const)
  )

  parserTest(
    "zip twice",
    Syntax.zip(Syntax.anyChar, Syntax.zip(Syntax.anyChar, Syntax.anyChar)),
    "hel",
    Either.right(["h", ["e", "l"]] as const)
  )

  parserTest(
    "zip and map",
    pipe(
      Syntax.as(Syntax.char("h"), 1),
      Syntax.zip(Syntax.zipRight(Syntax.char("e"), Syntax.as(Syntax.char("l"), 2)))
    ),
    "hel",
    Either.right([1, 2] as const)
  )

  parserTest(
    "zip, failing left",
    Syntax.zip(
      Syntax.filter(Syntax.anyChar, (char) => char === "a", "not 'a'"),
      Syntax.anyChar
    ),
    "he",
    Either.left(ParserError.failure(List.nil(), 1, "not 'a'"))
  )

  parserTest(
    "zip, failing right",
    Syntax.zip(
      Syntax.anyChar,
      Syntax.filter(Syntax.anyChar, (char) => char === "a", "not 'a'")
    ),
    "he",
    Either.left(ParserError.failure(List.nil(), 2, "not 'a'"))
  )

  parserTest(
    "anyChar.filter(isDigit)",
    pipe(
      Syntax.anyChar,
      Syntax.filter((char) => !Number.isNaN(Number.parseInt(char)), "not digit"),
      Syntax.repeat1,
      Syntax.captureString
    ),
    "123abc",
    Either.right("123")
  )

  parserTest(
    "zipLeft",
    Syntax.zipLeft(Syntax.anyChar, Syntax.asPrinted(Syntax.anyChar, void 0, "?")),
    "he",
    Either.right("h")
  )

  parserTest(
    "zipRight",
    Syntax.zipRight(Syntax.asPrinted(Syntax.anyChar, void 0 as void, "?"), Syntax.anyChar),
    "he",
    Either.right("e")
  )

  parserTest(
    "orElse, left passing",
    Syntax.orElse(charA, () => charB),
    "a",
    Either.right("a")
  )

  parserTest(
    "orElse, right passing",
    Syntax.orElse(charA, () => charB),
    "b",
    Either.right("b")
  )

  parserTest(
    "captured orElse, right passing",
    Syntax.orElse(
      Syntax.captureString(Syntax.char("a", "not 'a'")),
      () => Syntax.captureString(Syntax.char("b", "not 'b'"))
    ),
    "b",
    Either.right("b")
  )

  parserTest(
    "orElse, failing",
    Syntax.orElse(
      Syntax.char("a", "not 'a'"),
      () => Syntax.char("b", "not 'b'")
    ),
    "c",
    Either.left(ParserError.allBranchesFailed(
      ParserError.failure(List.nil(), 0, "not 'a'"),
      ParserError.failure(List.nil(), 0, "not 'b'")
    ))
  )

  parserTest(
    "orElseEither, left passing",
    Syntax.orElseEither(charA, () => charB),
    "a",
    Either.right(Either.left("a"))
  )

  parserTest(
    "orElseEither, right passing",
    Syntax.orElseEither(charA, () => charB),
    "b",
    Either.right(Either.right("b"))
  )

  parserTest(
    "orElseEither, failing",
    Syntax.orElseEither(charA, () => charB),
    "c",
    Either.left(ParserError.allBranchesFailed(
      ParserError.failure(List.nil(), 0, "not 'a'"),
      ParserError.failure(List.nil(), 0, "not 'b'")
    ))
  )

  parserTest(
    "optional, passing",
    Syntax.optional(Syntax.zip(charA, charB)),
    "ab",
    Either.right(Option.some(["a", "b"] as const))
  )

  parserTest(
    "optional, not passing",
    Syntax.optional(Syntax.zip(
      Syntax.char("a", "not 'a'"),
      Syntax.char("b", "not 'b'")
    )),
    "aa",
    Either.right(Option.none())
  )

  parserTest(
    "optional, terminating early",
    Syntax.optional(Syntax.zip(
      Syntax.char("a", "not 'a'"),
      Syntax.char("b", "not 'b'")
    )),
    "a",
    Either.right(Option.none())
  )

  parserTest(
    "string, passing",
    Syntax.string("test", 1),
    "test",
    Either.right(1)
  )

  parserTest(
    "string, failing",
    Syntax.string("test", 1),
    "tess",
    Either.left(ParserError.failure(List.nil(), 0, "not 'test'"))
  )

  parserTest(
    "captureString",
    pipe(
      Syntax.char("a"),
      Syntax.orElse(() => Syntax.char("b")),
      Syntax.repeatWithSeparator1(Syntax.char(",")),
      Syntax.captureString,
      Syntax.zipLeft(Syntax.char("!"))
    ),
    "a,a,b,a,b,b!",
    Either.right("a,a,b,a,b,b")
  )

  parserTest(
    "repeat0 - immediate end of stream",
    Syntax.transform(
      Syntax.repeat(Syntax.char("a", "not 'a'")),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "",
    Either.right([])
  )

  parserTest(
    "repeat0 - immediate mismatch",
    Syntax.transform(
      Syntax.repeat(Syntax.char("a", "not 'a'")),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "bc",
    Either.right([])
  )

  parserTest(
    "repeat0 - once",
    Syntax.transform(
      Syntax.repeat(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "a",
    Either.right(["a"])
  )

  parserTest(
    "repeat0 - three times",
    Syntax.transform(
      Syntax.repeat(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "aaabc",
    Either.right(["a", "a", "a"])
  )

  parserTest(
    "repeat0 - until end",
    Syntax.transform(
      Syntax.repeat(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "aaa",
    Either.right(["a", "a", "a"])
  )

  parserTest(
    "repeat1",
    Syntax.transform(
      Syntax.repeat1(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array) as Chunk.NonEmptyChunk<string>
    ),
    "abc",
    Either.right(["a"])
  )

  parserTest(
    "repeat1 - three times",
    Syntax.transform(
      Syntax.repeat1(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array) as Chunk.NonEmptyChunk<string>
    ),
    "aaabc",
    Either.right(["a", "a", "a"])
  )

  parserTest(
    "repeat1 - until the end",
    Syntax.transform(
      Syntax.repeat1(charA),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array) as Chunk.NonEmptyChunk<string>
    ),
    "aaa",
    Either.right(["a", "a", "a"])
  )

  parserTest(
    "repeat1 - immediate end of stream",
    Syntax.repeat1(Syntax.char("a", "not 'a'")),
    "",
    Either.left(ParserError.unexpectedEndOfInput)
  )

  // TODO: With compiling to Regex it fails with `UnexpectedEndOfInput` - to be discussed
  // parserTest(
  //   "repeat1 - immediate mismatch",
  //   Syntax.repeat1(Syntax.char("a", "not 'a'")),
  //   "bc",
  //   Either.left(ParserError.failure(List.nil(), 0, "not 'a'"))
  // )

  parserTest(
    "atLeast - three passing",
    Syntax.transform(
      Syntax.atLeast(charA, 3),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "aaabc",
    Either.right(["a", "a", "a"])
  )

  // TODO: With compiling to Regex it fails with `UnexpectedEndOfInput` - to be discussed
  // parserTest(
  //   "atLeast - three failing",
  //   Syntax.atLeast(charA, 3),
  //   "aabc",
  //   Either.left(ParserError.failure(List.nil(), 2, "not 'a'"))
  // )

  parserTest(
    "repeatWithSeparator",
    Syntax.transform(
      Syntax.repeatWithSeparator1(Syntax.anyChar, Syntax.char("-")),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array) as Chunk.NonEmptyChunk<string>
    ),
    "a-b-c",
    Either.right(["a", "b", "c"])
  )

  parserTest(
    "repeatUntil - once",
    Syntax.transform(
      Syntax.repeatUntil(Syntax.anyChar, Syntax.orElse(Syntax.char("x"), () => Syntax.char("y"))),
      (chunk) => Array.from(chunk),
      (array) => Chunk.unsafeFromArray(array)
    ),
    "abcdy",
    Either.right(["a", "b", "c", "d"])
  )

  parserTest(
    "repeatUntil - twice",
    Syntax.captureString(Syntax.repeatUntil(Syntax.anyChar, Syntax.string("!!!", void 0 as void))),
    "abc!!!",
    Either.right("abc!!!")
  )

  parserTest(
    "optional - on empty",
    Syntax.optional(Syntax.anyChar),
    "",
    Either.right(Option.none())
  )

  parserTest(
    "optional - on mismatch",
    Syntax.optional(Syntax.char("a", "not 'a'")),
    "b",
    Either.right(Option.none())
  )

  parserTest(
    "optional - consumes",
    Syntax.optional(Syntax.anyChar),
    "a",
    Either.right(Option.some("a"))
  )

  parserTest(
    "optional - backtracks with auto-backtrack",
    pipe(
      Syntax.anyChar,
      Syntax.zip(Syntax.char("a", "not 'a'")),
      Syntax.optional,
      Syntax.zip(Syntax.anyChar),
      Syntax.autoBacktracking
    ),
    "xy",
    Either.right([Option.none(), "x"] as const)
  )

  parserTest(
    "named - name passed in failure",
    pipe(
      Syntax.anyChar,
      Syntax.filter((char) => char === "a", "not 'a'"),
      Syntax.named("A")
    ),
    "hello",
    Either.left(ParserError.failure(List.of("A"), 1, "not 'a'"))
  )

  parserTest(
    "named - scoped in a zip",
    pipe(
      Syntax.anyChar,
      Syntax.named("A"),
      Syntax.zip(pipe(
        Syntax.anyChar,
        Syntax.filter((char) => char === "b", "not 'b'"),
        Syntax.named("B")
      ))
    ),
    "hello",
    Either.left(ParserError.failure(List.of("B"), 2, "not 'b'"))
  )

  parserTest(
    "named - nested names",
    pipe(
      Syntax.anyChar,
      Syntax.named("A"),
      Syntax.zip(pipe(
        Syntax.anyChar,
        Syntax.filter((char) => char === "b", "not 'b'"),
        Syntax.named("B"),
        Syntax.named("C")
      )),
      Syntax.named("D")
    ),
    "hello",
    Either.left(ParserError.failure(List.fromIterable(["B", "C", "D"]), 2, "not 'b'"))
  )

  parserTest(
    "named - orElse",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.named("A"),
      Syntax.orElse(() =>
        pipe(
          Syntax.char("b", "not 'b'"),
          Syntax.named("B")
        )
      ),
      Syntax.named("C")
    ),
    "c",
    Either.left(ParserError.allBranchesFailed(
      ParserError.failure(List.fromIterable(["A", "C"]), 0, "not 'a'"),
      ParserError.failure(List.fromIterable(["B", "C"]), 0, "not 'b'")
    ))
  )

  parserTest(
    "named - orElseEither",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.named("A"),
      Syntax.orElseEither(() =>
        pipe(
          Syntax.char("b", "not 'b'"),
          Syntax.named("B")
        )
      ),
      Syntax.named("C")
    ),
    "c",
    Either.left(ParserError.allBranchesFailed(
      ParserError.failure(List.fromIterable(["A", "C"]), 0, "not 'a'"),
      ParserError.failure(List.fromIterable(["B", "C"]), 0, "not 'b'")
    ))
  )

  parserTest(
    "named - multiple zips with optional",
    pipe(
      Syntax.optional(Syntax.named(Syntax.anyChar, "A")),
      Syntax.zip(Syntax.optional(Syntax.named(Syntax.anyChar, "B"))),
      Syntax.zip(Syntax.named(Syntax.char("c", "not 'c'"), "C"))
    ),
    "abd",
    Either.left(ParserError.failure(List.of("C"), 2, "not 'c'"))
  )

  parserTest(
    "backtracking - can be disabled for orElseEither",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.zip(Syntax.char("b", "not 'b'")),
      Syntax.orElseEither(() => Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "ac",
    Either.left(ParserError.failure(List.nil(), 1, "not 'b'"))
  )

  parserTest(
    "backtracking - can be disabled for orElse",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.zipRight(charB),
      Syntax.orElse(() => Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "ac",
    Either.left(ParserError.failure(List.nil(), 1, "not 'b'"))
  )

  parserTest(
    "backtracking - can be enabled for orElseEither",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.zip(Syntax.char("b", "not 'b'")),
      Syntax.backtrack,
      Syntax.orElseEither(() => Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "ac",
    Either.right(Either.right("a"))
  )

  parserTest(
    "backtracking - can be enabled for orElse",
    pipe(
      Syntax.char("a", "not 'a'"),
      Syntax.zipRight(charB),
      Syntax.backtrack,
      Syntax.orElse(() => Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "ac",
    Either.right("a")
  )

  parserTest(
    "backtracking - enabled with optional",
    pipe(
      Syntax.anyChar,
      Syntax.zip(Syntax.char("a", "not 'a'")),
      Syntax.backtrack,
      Syntax.optional,
      Syntax.zip(Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "xy",
    Either.right([Option.none(), "x"] as const)
  )

  parserTest(
    "backtracking - disabled with optional",
    pipe(
      Syntax.anyChar,
      Syntax.zip(Syntax.char("a", "not 'a'")),
      Syntax.backtrack,
      Syntax.zip(Syntax.anyChar),
      Syntax.manualBacktracking
    ),
    "xy",
    Either.left(ParserError.failure(List.nil(), 1, "not 'a'"))
  )

  parserTest(
    "regex constructors - digit, passing",
    Syntax.digit,
    "1",
    Either.right("1")
  )

  parserTest(
    "regex constructors - digits, passing",
    Syntax.captureString(Syntax.repeat1(Syntax.digit)),
    "12345",
    Either.right("12345")
  )

  parserTest(
    "regex constructors - digits, failing",
    Syntax.captureString(Syntax.repeat1(Syntax.digit)),
    "abc12345",
    Either.left(ParserError.unexpectedEndOfInput)
  )

  parserTest(
    "regex constructors - letters or digits",
    pipe(
      Syntax.captureString(Syntax.repeat1(Syntax.digit)),
      Syntax.zip(Syntax.captureString(Syntax.repeat1(Syntax.letter)))
    ),
    "12345abcd",
    Either.right(["12345", "abcd"] as const)
  )

  parserTest(
    "not - inner failing",
    Syntax.not(Syntax.string("hello", void 0 as void), "it was hello"),
    "world",
    Either.right(void 0)
  )

  parserTest(
    "not - inner passing",
    Syntax.not(Syntax.string("hello", void 0 as void), "it was hello"),
    "hello",
    Either.left(ParserError.failure(List.nil(), 5, "it was hello"))
  )
})
