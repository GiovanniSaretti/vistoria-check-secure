
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: { 
    alias: { 
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
    } 
  },
  server: { 
    host: "::",
    port: 8080 
  },
  build: { target: 'es2022' },
  optimizeDeps: { esbuildOptions: { target: 'es2022' } }
}))
