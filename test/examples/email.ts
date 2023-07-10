import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Syntax from "@effect/parser/Syntax"
import { tests } from "@effect/parser/test/examples/url"

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

/**
 * Simple email parser
 */
const email = pipe(
  Syntax.zipLeft(segment, Syntax.char("@")),
  Syntax.zip(domain)
)

tests(
  "domain",
  domain,
  "hello.net",
  Either.right("hello.net")
)

tests(
  "email",
  email,
  "myuser@hello.world.net",
  Either.right(["myuser", "hello.world.net"] as const)
)
