/// <reference types="vitest" />
import * as path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts"],
    setupFiles: [path.join(__dirname, "setupTests.ts")]
  },
  resolve: {
    alias: {
      "@effect/parser/test": path.join(__dirname, "test"),
      "@effect/parser": path.join(__dirname, "src")
    }
  }
})
