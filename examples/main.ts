import * as Syntax from "@effect/parser/Syntax"

// const hello = Syntax.string("hello", "h")

// const world = Syntax.string("world", "w")

// const all = Syntax.string("all", "a")
const charA = Syntax.as(Syntax.char("a"), "a")
const grammar = Syntax.atLeast(charA, 1)

const result = Syntax.parseStringWith(grammar, "bc", "stack-safe")

console.log(result)
