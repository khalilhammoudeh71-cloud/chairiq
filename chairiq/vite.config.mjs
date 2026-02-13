import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'redux'],
          charts: ['recharts', 'd3'],
          ui: ['framer-motion', 'lucide-react'],
        }
      }
    }
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 5000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/openai-proxy': {
        target: 'http://localhost:1106/modelfarm/openai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openai-proxy/, ''),
      },
      '/gemini-proxy': {
        target: 'http://localhost:1106/modelfarm/gemini',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini-proxy/, ''),
      }
    }
  }
});
