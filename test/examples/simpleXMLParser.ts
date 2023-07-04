import * as Chunk from "@effect/data/Chunk"
import * as E from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as RA from "@effect/data/ReadonlyArray"
import * as Syntax from "@effect/parser/Syntax"

// Parses XML without prolog, attributes and namespaces

interface XmlNode {
  readonly name: string
  readonly values: ReadonlyArray<string>
  readonly children: ReadonlyArray<XmlNode>
}

const toParse = "<ROOT><A><B >u</B></A><C/></ROOT>"

const tagStartString = "<"
const tagEndString = ">"
const closingMarkString = "/"
const tagStart = Syntax.char(tagStartString)
const tagEnd = Syntax.char(tagEndString)

const ignoredWhiteSpaces = pipe(
  Syntax.whitespace,
  Syntax.repeat,
  Syntax.asUnit(Chunk.of("") as Chunk.Chunk<string>)
)

const openingTagStart = tagStart
const openingTagEnd = pipe(ignoredWhiteSpaces, Syntax.zipRight(tagEnd))

const closingTagStart = Syntax.string(tagStartString + closingMarkString, undefined as void)
const closingTagEnd = openingTagEnd

const selfClosingTagStart = tagStart
const selfClosingTagEnd = pipe(
  ignoredWhiteSpaces,
  Syntax.zipRight(Syntax.string(closingMarkString + tagEndString, undefined as void))
)

const tagLabelFirstLetter = pipe(
  Syntax.letter,
  Syntax.orElse(() => Syntax.charIn("_"))
)

const tagLabelNextLetters = pipe(
  Syntax.alphaNumeric,
  Syntax.orElse(() => Syntax.charIn(["-", "_", "."])),
  Syntax.repeat,
  Syntax.flatten
)

const tagLabel = pipe(
  tagLabelFirstLetter,
  Syntax.zip(tagLabelNextLetters),
  Syntax.transform(RA.join(""), (from) => [from[0], from.slice(1)] as const)
)

const openingTag = Syntax.between(tagLabel, openingTagStart, openingTagEnd)
const closingTag = Syntax.between(tagLabel, closingTagStart, closingTagEnd)

const text = pipe(Syntax.charNotIn(tagStartString), Syntax.repeat1, Syntax.flattenNonEmpty)
const selfClosingTag: Syntax.Syntax<string, string, string, XmlNode> = pipe(
  tagLabel,
  Syntax.between(selfClosingTagStart, selfClosingTagEnd),
  Syntax.transform(
    (to) => ({ name: to, values: [], children: [] } as XmlNode),
    (from) => from.name
  )
)
const xmlNode: Syntax.Syntax<string, string, string, XmlNode> = pipe(
  Syntax.zipLeft(openingTag, ignoredWhiteSpaces),
  Syntax.zip(
    pipe(
      Syntax.suspend(() => xmlNode),
      Syntax.zipLeft(ignoredWhiteSpaces),
      Syntax.orElseEither(() => text),
      Syntax.repeat
    )
  ),
  Syntax.zip(closingTag),
  Syntax.transformEither(
    (to) =>
      to[0][0] !== to[1]
        ? E.left(`Closing tag "${to[1]}" does not match with opening tag "${to[0][0]}"`)
        : E.right({
          name: to[1],
          children: E.lefts(to[0][1]),
          values: E.rights(to[0][1])
        } as XmlNode),
    (from) =>
      E.right(
        [
          [
            from.name,
            pipe(
              from.children,
              RA.map(E.left),
              Chunk.fromIterable,
              (cs) => Chunk.concat(cs, pipe(from.values, RA.map(E.right), Chunk.fromIterable))
            )
          ] as const,
          from.name
        ] as const
      )
  ),
  Syntax.orElse(() => selfClosingTag)
)

it("simpleXMLParser - recursive", () => {
  const result = pipe(xmlNode, Syntax.parseStringWith(toParse, "recursive"))
  expect(result).toEqual(E.right({
    name: "ROOT",
    children: [
      { name: "A", children: [{ name: "B", children: [], values: ["u"] }], values: [] },
      { name: "C", children: [], values: [] }
    ],
    values: []
  }))
  if (E.isRight(result)) {
    const result1 = pipe(xmlNode, Syntax.printString(result.right))
    expect(result1).toEqual(E.right("<ROOT><A><B>u</B></A><C></C></ROOT>"))
  }
})
