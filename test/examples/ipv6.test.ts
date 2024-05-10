import * as Syntax from "@effect/parser/Syntax"
import { tests } from "@effect/parser/test/examples/utils"
import { Either } from "effect"
import { pipe } from "effect/Function"

// [0-9a-fA-F]
const hexadecimalDigit = Syntax.charIn([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f"
])

// [0-9a-fA-F]{1,4}
const hextet = pipe(
  hexadecimalDigit,
  Syntax.zip(Syntax.optional(hexadecimalDigit)),
  Syntax.zip(Syntax.optional(hexadecimalDigit)),
  Syntax.zip(Syntax.optional(hexadecimalDigit)),
  Syntax.captureString
)

tests(
  "hextet",
  hextet,
  "0db8",
  Either.right("0db8"),
  Either.right("0db8")
)

// ([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}
export const ipv6 = pipe(
  hextet,
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet),
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(hextet)
)

tests(
  "ipv6",
  ipv6,
  "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  Either.right([[[[[[["2001", "0db8"], "85a3"], "0000"], "0000"], "8a2e"], "0370"], "7334"] as const),
  Either.right("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
)
