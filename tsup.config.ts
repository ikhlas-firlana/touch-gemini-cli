import { defineConfig } from "tsup";

export default defineConfig({
  // The entry point of your library.
  // Tsup will crawl all imported files from here.
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.*",
  ],

  // Clean the "dist" directory before each build.
  clean: true,

  // Generate TypeScript declaration files (.d.ts).
  // The "resolve" option can help fix module paths within the generated type files.
  dts: {
    resolve: true,
  },
  // The output formats.
  // "cjs" for CommonJS (require) and "esm" for ES Modules (import).
  format: [ "cjs", "esm"],

  // Minify the code for production.
  minify: false,

  // Code splitting allows for smaller chunks.
  // This is great for component libraries.
  splitting: false,

  // Generate source maps for easier debugging.
  sourcemap: true,
});
