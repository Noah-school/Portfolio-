import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://portfolio.xenophon.be",
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    shikiConfig: { theme: "github-dark" },
  },
});
