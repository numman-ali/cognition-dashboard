import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: "es2020",
    outDir: "dist",
    sourcemap: true,
  },
});
