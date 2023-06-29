import { pipe } from "@effect/data/Function"
import * as Syntax from "@effect/parser/Syntax"

// const hello = Syntax.string("hello", "h")

// const world = Syntax.string("world", "w")

// const all = Syntax.string("all", "a")

const grammar = pipe(
  Syntax.anyChar,
  Syntax.repeatWithSeparator1(Syntax.char("-"))
)

const result = Syntax.printString(grammar, ["a", "b", "c"])

console.log(result)
