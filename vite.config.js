import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Your Eleventy root
  build: {
    outDir: "_site/assets", // match Eleventy output dir
    emptyOutDir: false,
    rollupOptions: {
      input: "./src/script.js",
      output: {
        entryFileNames: "bundle.js",
      },
    },
  },
});
