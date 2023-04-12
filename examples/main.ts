import * as Regex from "@effect/parser/Regex"

const keywordStrings: ReadonlyArray<string> = [
  "abstract",
  "case",
  "catch",
  "class",
  "do",
  "else",
  "extends",
  "false",
  "finally",
  "for",
  "if",
  "import",
  "new",
  "null",
  "object",
  "package",
  "return",
  "super",
  "this",
  "throw",
  "try",
  "true",
  "type",
  "val",
  "var",
  "while",
  "yield"
]

const keywordsRegex: Regex.Regex = keywordStrings.slice(1)
  .map((keyword) => Regex.string(keyword))
  .reduce((acc, curr) => Regex.or(acc, curr), Regex.string(keywordStrings[0]))

const keywords: Regex.Regex.Compiled = Regex.compile(keywordsRegex)

console.log(keywordStrings.every((keyword) => keywords.matches(keyword)))
