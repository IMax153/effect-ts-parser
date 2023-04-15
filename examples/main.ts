import * as Parser from "@effect/parser/Parser"

const parser = Parser.string("foobar", void 0)

console.log(Parser.parse(parser, "foobar"))
