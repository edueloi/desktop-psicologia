import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'app',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 5174, // Changed port to avoid conflict
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
});
