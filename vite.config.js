import react from "@vitejs/plugin-react-swc";

import { defineConfig } from "vite";
import { fileURLToPath } from 'url';

import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.ttf", "**/*.TTF"],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 262144,
  },
  server: {
    port: 3001,
  },
});
