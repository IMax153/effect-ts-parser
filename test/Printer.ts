import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import * as Printer from "@effect/parser/Printer"
import * as Syntax from "@effect/parser/Syntax"
import { describe, expect, it } from "vitest"

const charA: Syntax.Syntax<string, string, string, string> = Syntax.charIn("a")

const charB: Syntax.Syntax<string, string, string, string> = Syntax.charIn("b")

const hello = Syntax.string("hello", "h")

const world = Syntax.string("world", "w")

const all = Syntax.string("all", "a")

const printerTest = <Input, Error, Value>(
  name: string,
  syntax: Syntax.Syntax<Input, Error, string, Value>,
  value: Value,
  assertion: Either.Either<string, string>
): void => {
  it(`${name}`, () => {
    const result = Syntax.printString(syntax, value)
    expect(result).toEqual(assertion)
  })
}

describe("Printer", () => {
  it("fail", () => {
    const printer = Printer.fail("failed")
    expect(Printer.printToString(printer, "foo" as never)).toEqual(Either.left("failed"))
  })

  it("char", () => {
    const printer = Printer.char("a")
    expect(Printer.printToString(printer, void 0)).toEqual(Either.right("a"))
  })

  it("notChar", () => {
    const printer = Printer.notChar("a")
    expect(Printer.printToString(printer, "a")).toEqual(Either.left("cannot be 'a'"))
  })

  printerTest("anyChar", Syntax.anyChar, "x", Either.right("x"))

  printerTest(
    "filtered char, passing",
    pipe(
      Syntax.anyChar,
      Syntax.filter((char) => char === "h", "not 'h'")
    ),
    "h",
    Either.right("h")
  )

  printerTest(
    "filtered char, failing",
    pipe(
      Syntax.anyChar,
      Syntax.filter((char) => char === "h", "not 'h'")
    ),
    "e",
    Either.left("not 'h'")
  )

  printerTest(
    "transform",
    pipe(
      Syntax.anyChar,
      Syntax.transform(
        (char) => char.charCodeAt(0),
        (code) => String.fromCharCode(code)
      )
    ),
    66,
    Either.right("B")
  )

  printerTest(
    "transformEither, failing",
    pipe(
      Syntax.anyChar,
      Syntax.transformEither(
        (_: string) => Either.left("bad"),
        (_: number) => Either.left("bad")
      )
    ),
    100,
    Either.left("bad")
  )

  printerTest(
    "zip",
    Syntax.zip(Syntax.anyChar, Syntax.anyChar),
    ["x", "y"],
    Either.right("xy")
  )

  printerTest(
    "zip, multiple times",
    Syntax.zip(Syntax.anyChar, Syntax.zip(Syntax.anyChar, Syntax.anyChar)),
    ["x", ["y", "z"]],
    Either.right("xyz")
  )

  printerTest(
    "zip, failing left",
    pipe(
      Syntax.anyChar,
      Syntax.filter((char) => char === "a", "not 'a'"),
      Syntax.zip(Syntax.anyChar)
    ),
    ["b", "c"],
    Either.left("not 'a'")
  )

  printerTest(
    "zip, failing right",
    pipe(
      Syntax.anyChar,
      Syntax.zip(Syntax.filter(Syntax.anyChar, (char) => char === "a", "not 'a'"))
    ),
    ["a", "b"],
    Either.left("not 'a'")
  )

  printerTest(
    "zipLeft",
    Syntax.zipLeft(Syntax.anyChar, Syntax.asPrinted(Syntax.anyChar, void 0, "?")),
    "x",
    Either.right("x?")
  )

  printerTest(
    "zipRight",
    Syntax.zipRight(Syntax.asPrinted(Syntax.anyChar, void 0 as void, "?"), Syntax.anyChar),
    "x",
    Either.right("?x")
  )

  printerTest(
    "orElse, left passing",
    Syntax.orElse(charA, () => charB),
    "a",
    Either.right("a")
  )

  printerTest(
    "orElse, right passing",
    Syntax.orElse(charA, () => charB),
    "b",
    Either.right("b")
  )

  printerTest(
    "orElse, failing",
    Syntax.orElse(charA, () => charB),
    "c",
    Either.left("not one of the expected characters (b)")
  )

  printerTest(
    "orElse, left failing inside",
    pipe(
      Syntax.zip(hello, world),
      Syntax.orElse(() => Syntax.zip(hello, all))
    ),
    ["h", "a"],
    Either.right("helloall")
  )

  printerTest(
    "orElseEither, left passing",
    Syntax.orElseEither(charA, () => charB),
    Either.left("a"),
    Either.right("a")
  )

  printerTest(
    "orElseEither, right passing",
    Syntax.orElseEither(charA, () => charB),
    Either.right("b"),
    Either.right("b")
  )

  printerTest(
    "orElseEither, failing",
    Syntax.orElseEither(charA, () => charB),
    Either.right("c"),
    Either.left("not one of the expected characters (b)")
  )

  printerTest(
    "optional, passing",
    Syntax.optional(Syntax.zip(charA, charB)),
    Option.some(["a", "b"] as const),
    Either.right("ab")
  )

  printerTest(
    "optional, not passing",
    Syntax.optional(Syntax.zip(charA, charB)),
    Option.none(),
    Either.right("")
  )

  printerTest(
    "repeat, empty",
    Syntax.repeat(charA),
    Chunk.empty(),
    Either.right("")
  )

  printerTest(
    "repeat, once",
    Syntax.repeat(charA),
    Chunk.of("a"),
    Either.right("a")
  )

  printerTest(
    "repeat, many",
    Syntax.repeat(charA),
    Chunk.make("a", "a", "a"),
    Either.right("aaa")
  )

  printerTest(
    "repeatWithSeparator",
    pipe(
      Syntax.anyChar,
      Syntax.repeatWithSeparator1(Syntax.char("-"))
    ),
    Chunk.make("a", "b", "c"),
    Either.right("a-b-c")
  )
  // suite("repeatWithSep")(
  //   printerTest("repeatWithSep", Syntax.anyChar.repeatWithSep(Syntax.char('-')), Chunk('a', 'b', 'c'))(
  //     isRight(equalTo("a-b-c"))
  //   )
  // ),
})
