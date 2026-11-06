import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    // shadcn-svelte index files re-export from .svelte modules, which the TS checker cannot read.
    ignorePatterns: ["src/components/ui/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    ignorePatterns: [],
  },
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
  },
});
