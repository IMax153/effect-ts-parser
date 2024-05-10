import * as Syntax from "@effect/parser/Syntax"
import { tests } from "@effect/parser/test/examples/utils"
import { Either } from "effect"
import { pipe } from "effect/Function"

const octet = pipe(
  // 250-255
  pipe(
    Syntax.charIn("2"),
    Syntax.zip(Syntax.charIn("5")),
    Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4", "5"])),
    Syntax.captureString
  ),
  // 200-249
  Syntax.orElse(() =>
    pipe(
      Syntax.charIn("2"),
      Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4"])),
      Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),
      Syntax.captureString
    )
  ),
  // 000-199
  Syntax.orElse(() =>
    pipe(
      Syntax.charIn(["0", "1"]),
      Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),
      Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),
      Syntax.captureString
    )
  ),
  // 00-99
  Syntax.orElse(() =>
    pipe(
      Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
      Syntax.zip(Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])),
      Syntax.captureString
    )
  ),
  // 0-9
  Syntax.orElse(() =>
    pipe(
      Syntax.charIn(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
      Syntax.captureString
    )
  )
)

tests(
  "octet",
  octet,
  "1",
  Either.right("1"),
  Either.right("1")
)

const ipv4 = pipe(
  octet,
  Syntax.zipLeft(Syntax.char(".")),
  Syntax.zip(octet),
  Syntax.zipLeft(Syntax.char(".")),
  Syntax.zip(octet),
  Syntax.zipLeft(Syntax.char(".")),
  Syntax.zip(octet)
)

tests(
  "ipv4",
  ipv4,
  "192.168.1.1",
  Either.right([[["192", "168"], "1"], "1"] as const),
  Either.right("192.168.1.1")
)
