import { pipe } from "@effect/data/Function"
import * as Syntax from "@effect/parser/Syntax"

pipe(
  Syntax.char("a"),
  Syntax.orElse(() => Syntax.char("b")),
  Syntax.repeatWithSeparator1(Syntax.char(",")),
  Syntax.captureString,
  Syntax.zipLeft(Syntax.char("!")),
  Syntax.parseStringWith("a,a,b,a,b,b!", "stack-safe")
)
