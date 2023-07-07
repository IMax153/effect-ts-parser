import * as Chunk from "@effect/data/Chunk"
import * as E from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import * as RA from "@effect/data/ReadonlyArray"
import * as Syntax from "@effect/parser/Syntax"

// Parses XML without prolog and namespaces

interface XmlNode {
  readonly name: string
  readonly attributes: ReadonlyArray<XmlAttribute>
  readonly values: ReadonlyArray<string>
  readonly children: ReadonlyArray<XmlNode>
}

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

const whiteSpaces = pipe(
  Syntax.whitespace,
  Syntax.repeat1,
  Syntax.asUnit(Chunk.of(" "))
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

interface XmlAttribute {
  readonly name: string
  readonly value: string
}

const charsExceptSurrounded = (char: string) =>
  pipe(
    Syntax.charNotIn(char),
    Syntax.repeat,
    Syntax.flatten,
    Syntax.surroundedBy(Syntax.char(char))
  )

export const attributeValue = pipe(
  charsExceptSurrounded("\""),
  Syntax.orElse(() => charsExceptSurrounded("'"))
)

const attributeKey = tagLabel

const attributeKeyValue: Syntax.Syntax<string, string, string, XmlAttribute> = pipe(
  Syntax.zipLeft(attributeKey, Syntax.char("=")),
  Syntax.zip(attributeValue),
  Syntax.transform(
    (to) => ({ name: to[0], value: to[1] } as XmlAttribute),
    (from) => [from.name, from.value.replaceAll("\"", "'")] as const
  )
)

const attributeList: Syntax.Syntax<string, string, string, ReadonlyArray<XmlAttribute>> = pipe(
  attributeKeyValue,
  Syntax.repeatWithSeparator(whiteSpaces),
  Syntax.transform(Chunk.toReadonlyArray, Chunk.fromIterable)
)

const tag: Syntax.Syntax<string, string, string, readonly [string, ReadonlyArray<XmlAttribute>]> = pipe(
  tagLabel,
  Syntax.zip(Syntax.optional(Syntax.zipRight(whiteSpaces, attributeList))),
  Syntax.transform(
    (to) => [to[0], Option.getOrElse(to[1], () => [])] as const,
    (from) => [from[0], Option.some(from[1])] as const
  )
)

const openingTag = Syntax.between(tag, openingTagStart, openingTagEnd)
const closingTag = Syntax.between(tagLabel, closingTagStart, closingTagEnd)

const text = pipe(Syntax.charNotIn(tagStartString), Syntax.repeat1, Syntax.flattenNonEmpty)

const selfClosingTag: Syntax.Syntax<string, string, string, XmlNode> = pipe(
  tag,
  Syntax.between(selfClosingTagStart, selfClosingTagEnd),
  Syntax.transform(
    (to) => ({ name: to[0], attributes: to[1], values: [], children: [] } as XmlNode),
    (from) => [from.name, from.attributes] as const
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
      to[0][0][0] !== to[1]
        ? E.left(`Closing tag "${to[1]}" does not match with opening tag "${to[0][0][0]}"`)
        : E.right({
          name: to[0][0][0],
          attributes: to[0][0][1],
          children: E.lefts(to[0][1]),
          values: E.rights(to[0][1])
        } as XmlNode),
    (from) =>
      E.right(
        [
          [
            [from.name, from.attributes] as const,
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

it("tag: label and attributes - recursive", () => {
  const result = pipe(
    tag,
    Syntax.parseStringWith(
      "element one=\"1\" two='2' three=\"'hello'\" four='\"world\"' five='<test></test>'",
      "recursive"
    )
  )
  expect(result).toEqual(E.right(["element", [
    { name: "one", value: "1" },
    { name: "two", value: "2" },
    { name: "three", value: "'hello'" },
    { name: "four", value: "\"world\"" },
    { name: "five", value: "<test></test>" }
  ]]))
  if (E.isRight(result)) {
    const result1 = pipe(tag, Syntax.printString(result.right))
    expect(result1).toEqual(
      E.right(`element one="1" two="2" three="'hello'" four="'world'" five="<test></test>"`)
    )
  }
})

it("tag: label only - recursive", () => {
  const result = pipe(
    tag,
    Syntax.parseStringWith(
      `element`,
      "recursive"
    )
  )
  expect(result).toEqual(
    E.right(["element", []])
  )
  if (E.isRight(result)) {
    const result1 = pipe(tag, Syntax.printString(result.right))
    expect(result1).toEqual(E.right("element ")) // TODO: How to deal with optional whitespace
  }
})

it("xml - recursive", () => {
  const input = "<ROOT one='1'><A><B >u</B></A><C/><C/><D two='2' three='3' /> </ROOT>"
  const result = pipe(xmlNode, Syntax.parseStringWith(input, "recursive"))
  expect(result).toEqual(E.right({
    name: "ROOT",
    attributes: [
      { name: "one", value: "1" }
    ],
    children: [
      { name: "A", attributes: [], children: [{ name: "B", attributes: [], children: [], values: ["u"] }], values: [] },
      { name: "C", attributes: [], children: [], values: [] },
      { name: "C", attributes: [], children: [], values: [] },
      {
        name: "D",
        attributes: [
          { name: "two", value: "2" },
          { name: "three", value: "3" }
        ],
        children: [],
        values: []
      }
    ],
    values: []
  }))
  if (E.isRight(result)) {
    const result1 = pipe(xmlNode, Syntax.printString(result.right))
    expect(result1).toEqual(
      E.right("<ROOT one=\"1\"><A ><B >u</B></A><C ></C><C ></C><D two=\"2\" three=\"3\"></D></ROOT>")
    )
  }
})
