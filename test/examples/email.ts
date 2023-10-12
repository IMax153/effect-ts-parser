import * as Syntax from "@effect/parser/Syntax"
import { tests } from "@effect/parser/test/examples/utils"
import { Either } from "effect"
import { pipe } from "effect/Function"

const segment = pipe(
  Syntax.charNotIn(["@", " ", "\t", "\r", "\n"]),
  Syntax.repeat1,
  Syntax.flattenNonEmpty
)

const domain = pipe(
  segment,
  Syntax.repeatWithSeparator1(Syntax.char(".")),
  Syntax.flattenNonEmpty
)

tests(
  "domain",
  domain,
  "hello.net",
  Either.right("hello.net")
)

/**
 * Simple email parser
 */
const email = pipe(
  Syntax.zipLeft(segment, Syntax.char("@")),
  Syntax.zip(domain)
)

tests(
  "email",
  email,
  "myuser@hello.world.net",
  Either.right(["myuser", "hello.world.net"] as const)
)
