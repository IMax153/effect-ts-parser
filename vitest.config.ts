import path from "path"
import { defineConfig } from "vite"
import type { ViteUserConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    target: "es2020"
  },
  test: {
    include: ["./test/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["./test/utils/**/*.ts", "./test/**/*.init.ts"],
    globals: true
  },
  resolve: {
    alias: {
      "@effect/parser/test": path.join(__dirname, "test"),
      "@effect/parser": path.join(__dirname, "src")
    }
  }
} as ViteUserConfig)
