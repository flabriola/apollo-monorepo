import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  optimizeDeps: {
    include: ['react-router-dom'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  }
})
