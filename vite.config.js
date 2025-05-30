import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Your Eleventy root
  build: {
    outDir: "_site/assets", // match Eleventy output dir
    assetsDir: "", // otherwise will write to assets/assets
    emptyOutDir: false,
    rollupOptions: {
      input: ["./src/script.js", "./src/assets.js"],
      output: {
        entryFileNames: "bundle.js",
      },
    },
  },
});
