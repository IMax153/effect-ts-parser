import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import type * as ParserError from "@effect/parser/ParserError"
import * as Syntax from "@effect/parser/Syntax"

// TODO: url encoding ie replacing spaces " " with "%20"
// TODO: idea cookie parser https://datatracker.ietf.org/doc/html/rfc6265#section-2.2

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

// TODO: What other characters are valid?
const segment = pipe(
  Syntax.alphaNumeric,
  Syntax.orElse(() => Syntax.charIn(["-", "_"])),
  Syntax.repeat1,
  Syntax.flattenNonEmpty
)

const scheme = segment

const user = pipe(
  segment,
  Syntax.zipLeft(Syntax.char(":")),
  Syntax.zip(segment)
)

// TODO: Validate IP addresses?
const host = pipe(
  segment,
  Syntax.repeatWithSeparator(Syntax.char("."))
  //   Syntax.transform(Chunk.toReadonlyArray, Chunk.fromIterable)
)

// TODO: Validate port number?
const port = pipe(
  Syntax.digit,
  Syntax.repeat1,
  Syntax.flattenNonEmpty
)

const path = pipe(
  Syntax.char("/"),
  Syntax.zipRight(pipe(
    segment,
    Syntax.repeatWithSeparator(Syntax.char("/"))
  )),
  Syntax.zipLeft(pipe(
    Syntax.char("/"),
    Syntax.orElse(() => Syntax.char(""))
  ))
)

const query = pipe(
  segment,
  Syntax.zipLeft(Syntax.char("=")),
  Syntax.zip(segment),
  Syntax.repeatWithSeparator(Syntax.char("&"))
)

const fragment = segment

/**
Simple url parser
scheme://user@host:port/path?query#fragment
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#syntax_of_uniform_resource_identifiers_uris
 */
const url = pipe(
  pipe(scheme, Syntax.zipLeft(Syntax.string("://", undefined as void))),
  Syntax.zip(pipe(user, Syntax.zipLeft(Syntax.char("@")), Syntax.optional)),
  Syntax.zip(host),
  Syntax.zip(pipe(Syntax.char(":"), Syntax.zipRight(port), Syntax.optional)),
  Syntax.zip(pipe(path, Syntax.optional)),
  Syntax.zip(pipe(Syntax.char("?"), Syntax.zipRight(query), Syntax.optional)),
  Syntax.zip(pipe(Syntax.char("#"), Syntax.zipRight(fragment), Syntax.optional))
)

tests(
  "user",
  user,
  "user:password",
  Either.right(["user", "password"] as const),
  Either.right("user:password")
)
tests(
  "host",
  host,
  "developer.mozilla.org",
  Either.right(Chunk.make("developer", "mozilla", "org")),
  Either.right("developer.mozilla.org")
)
tests(
  "path",
  path,
  "/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web/",
  Either.right(Chunk.make("en-US", "docs", "Web", "HTTP", "Basics_of_HTTP", "Identifying_resources_on_the_Web")),
  Either.right("/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web/")
)
tests(
  "query",
  query,
  "key1=value1&key2=value2",
  Either.right(Chunk.fromIterable([["key1", "value1"], ["key2", "value2"]] as const)),
  Either.right("key1=value1&key2=value2")
)
tests(
  "url",
  url,
  "https://user:password@developer.mozilla.org:8080/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web/?key1=value1&key2=value2#syntax_of_uniform_resource_identifiers_uris",
  Either.right(
    // [
    //   [[[[
    //     ["http", ["user", "password"]],
    //     ["developer", "mozilla", "org"]
    //   ], "8080"], "/"], [
    //     ["key1", "value1"],
    //     ["key2", "value2"]
    //   ]],
    //   "home"
    // ] as const
    [
      [
        [
          [[
            ["https", Option.some(["user", "password"] as const)],
            Chunk.make("developer", "mozilla", "org")
          ], Option.some("8080")],
          Option.some(Chunk.make("en-US", "docs", "Web", "HTTP", "Basics_of_HTTP", "Identifying_resources_on_the_Web"))
        ],
        Option.some(Chunk.fromIterable(
          [
            ["key1", "value1"],
            ["key2", "value2"]
          ] as const
        ))
      ],
      Option.some("syntax_of_uniform_resource_identifiers_uris")
    ] as const
  ),
  Either.right(
    "https://user:password@developer.mozilla.org:8080/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web/?key1=value1&key2=value2#syntax_of_uniform_resource_identifiers_uris"
  )
)
tests(
  "url - only required parts",
  url,
  "http://developer.mozilla.org/",
  Either.right(
    [
      [
        [[[
          ["http", Option.none()],
          Chunk.make("developer", "mozilla", "org")
        ], Option.none()], Option.none()],
        Option.none()
      ],
      Option.none()
    ] as const
  ),
  Either.right("http://developer.mozilla.org")
)
