import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'], // Generates .js (CJS) and .mjs (ESM)
    dts: true,              // Generates .d.ts files
    splitting: false,
    sourcemap: true,
    clean: true,            // Cleans output directory before build
    treeshake: true,
});
