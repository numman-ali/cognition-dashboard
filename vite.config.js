import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false
  }
});
