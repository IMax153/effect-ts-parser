import * as Either from "@effect/data/Either"
import * as Printer from "@effect/parser/Printer"
import { describe, expect, it } from "vitest"

describe("Printer", () => {
  it("fail", () => {
    const printer = Printer.fail("failed")
    expect(Printer.printToString(printer, "foo" as never)).toEqual(Either.left("failed"))
  })

  it("char", () => {
    const printer = Printer.char("a")
    expect(Printer.printToString(printer, void 0)).toEqual(Either.right("a"))
  })

  it("notChar", () => {
    const printer = Printer.notChar("a")
    expect(Printer.printToString(printer, "a")).toEqual(Either.left("cannot be 'a'"))
  })
})
