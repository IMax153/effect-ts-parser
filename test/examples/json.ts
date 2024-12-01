import * as Syntax from "@effect/parser/Syntax"
import { Chunk, Either, Option, pipe } from "effect"
import { hexDigit, tests } from "./utils"

const whitespace = pipe(
  Syntax.charIn([" ", "\n", "\r", "\t"]),
  Syntax.repeat,
  Syntax.asUnit(Chunk.of("") as Chunk.Chunk<string>)
)

// FIXME: this doesn't work using `null` value with stack-safe see src/internal_effect_untraced/parser/stack-safe.ts:772
const null_ = Syntax.string("null", Option.none)
tests("null", null_, "null", Either.right(Option.none))

const boolean = pipe(
  Syntax.string("true", true),
  Syntax.orElse(() => Syntax.string("false", false))
)
tests("boolean: true", boolean, "true", Either.right(true))
tests("boolean: false", boolean, "false", Either.right(false))

const digits = pipe(Syntax.digit, Syntax.repeat1)
const integer = pipe(Syntax.optional(Syntax.charIn("-")), Syntax.zip(digits))
const fraction = pipe(Syntax.charIn("."), Syntax.zip(digits))
const exponent = pipe(
  Syntax.charIn(["E", "e"]),
  Syntax.zip(
    pipe(Syntax.optional(Syntax.charIn(["+", "-"])), Syntax.zip(digits))
  )
)
const number = pipe(
  integer,
  Syntax.zip(Syntax.optional(fraction)),
  Syntax.zip(Syntax.optional(exponent)),
  Syntax.captureString,
  Syntax.transform(parseFloat, String)
)
tests("number", number, "-12.782E-2", Either.right(-0.12782))

const hexToDecimal = pipe(
  pipe(hexDigit, Syntax.repeat1, Syntax.flattenNonEmpty),
  Syntax.transform(
    (to) => parseInt(to, 16),
    (from) => from.toString(16)
  )
)

const unicode = pipe(
  Syntax.string("\\u", undefined as void),
  Syntax.zipRight(hexToDecimal),
  Syntax.transform(
    (to) => String.fromCharCode(to),
    (from) =>
      pipe(
        Chunk.make(from),
        Chunk.map((char) => String(char.charCodeAt(0))),
        Chunk.join(""),
        parseInt
      )
  )
)

const escape = pipe(
  Syntax.char("\\"),
  Syntax.zipRight(Syntax.charIn(["\"", "\\", "\b", "\f", "\n", "\r", "\t"])),
  Syntax.orElse(() => unicode)
)

const characters = pipe(
  Chunk.make(
    "\"",
    "\\",
    "\x00",
    "\x01",
    "\x02",
    "\x03",
    "\x04",
    "\x05",
    "\x06",
    "\x07",
    "\x08",
    "\x09",
    "\x0A",
    "\x0B",
    "\x0C",
    "\x0D",
    "\x0E",
    "\x0F",
    "\x10",
    "\x11",
    "\x12",
    "\x13",
    "\x14",
    "\x15",
    "\x16",
    "\x17",
    "\x18",
    "\x19",
    "\x1A",
    "\x1B",
    "\x1C",
    "\x1D",
    "\x1E",
    "\x1F"
  ),
  Syntax.charNotIn
)

const string = pipe(
  characters,
  Syntax.orElse(() => escape),
  Syntax.repeat,
  Syntax.flatten,
  Syntax.surroundedBy(Syntax.char("\""))
)
tests("string: empty", string, `""`, Either.right(""))
tests("string: simple", string, `"hello, world!"`, Either.right("hello, world!"))
tests("string: escape", string, `"hello, world! \\"yeah\\""`, Either.right(`hello, world! "yeah"`))
tests("string: escape 2", string, `"yes\\\\no"`, Either.right(`yes\\no`)) // TODO: doesn't print correctly
tests("string: unicode", string, `"\\u016f\\u017e"`, Either.right(`ůž`), Either.right(`"ůž"`))

const object = pipe(
  string,
  Syntax.zipLeft(Syntax.surroundedBy(Syntax.char(":"), whitespace)),
  Syntax.zip(Syntax.suspend(() => json)),
  Syntax.repeatWithSeparator(Syntax.surroundedBy(Syntax.char(","), whitespace)),
  Syntax.between(
    Syntax.surroundedBy(Syntax.char("{"), whitespace),
    Syntax.surroundedBy(Syntax.char("}"), whitespace)
  )
)

const array = pipe(
  Syntax.suspend(() => json),
  Syntax.repeatWithSeparator(Syntax.surroundedBy(Syntax.char(","), whitespace)),
  Syntax.between(
    Syntax.surroundedBy(Syntax.char("["), whitespace),
    Syntax.surroundedBy(Syntax.char("]"), whitespace)
  )
)

/**
 * Simple json parser
 *
 * Inspiration from
 * - https://github.com/wddwycc/json-parser-ts
 */

const json: Syntax.Syntax<string, string, string, any> = pipe(
  null_,
  Syntax.orElseEither(() => boolean),
  Syntax.orElseEither(() => number),
  Syntax.orElseEither(() => string),
  Syntax.orElseEither(() => object),
  Syntax.orElseEither(() => array)
)

tests(
  "object: simple",
  object,
  `{ "hello": 123 }`,
  Either.right(Chunk.make(["hello", Either.left(Either.left(Either.left(Either.right(123))))] as const)),
  Either.right(`{"hello":123}`)
)

tests(
  "array: simple",
  array,
  `[ "hello, world!", 123 ]`,
  Either.right(Chunk.make(
    Either.left(Either.left(Either.right("hello, world!"))),
    Either.left(Either.left(Either.left(Either.right(123))))
  )),
  Either.right(`["hello, world!",123]`)
)

tests(
  "array",
  array,
  `[
  {
    "id": 1,
    "firstName": "Tom",
    "lastName": "Cruise"
  },
  {
    "id": 2,
    "firstName": "Maria",
    "lastName": "Sharapova"
  },
  {
    "id": 3,
    "firstName": "Robert",
    "lastName": "Downey Jr."
  }
]`,
  Either.right(Chunk.make(
    Either.left(Either.right(Chunk.make(
      ["id", Either.left(Either.left(Either.left(Either.right(1))))],
      ["firstName", Either.left(Either.left(Either.right("Tom")))],
      ["lastName", Either.left(Either.left(Either.right("Cruise")))]
    ))),
    Either.left(Either.right(Chunk.make(
      ["id", Either.left(Either.left(Either.left(Either.right(2))))],
      ["firstName", Either.left(Either.left(Either.right("Maria")))],
      ["lastName", Either.left(Either.left(Either.right("Sharapova")))]
    ))),
    Either.left(Either.right(Chunk.make(
      ["id", Either.left(Either.left(Either.left(Either.right(3))))],
      ["firstName", Either.left(Either.left(Either.right("Robert")))],
      ["lastName", Either.left(Either.left(Either.right("Downey Jr.")))]
    )))
  )),
  Either.right(
    `[{"id":1,"firstName":"Tom","lastName":"Cruise"},{"id":2,"firstName":"Maria","lastName":"Sharapova"},{"id":3,"firstName":"Robert","lastName":"Downey Jr."}]`
  )
)

tests(
  "json",
  json,
  `{ "hello": 123 }`,
  Either.right(
    Either.left(Either.right(Chunk.make(["hello", Either.left(Either.left(Either.left(Either.right(123))))] as const)))
  ),
  Either.right(`{"hello":123}`)
)
