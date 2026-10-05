import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this project from /404-Nature/
export default defineConfig({
  base: process.env.VITE_BASE ?? '/404-Nature/',
  plugins: [react()],
  build: { target: 'es2020', cssCodeSplit: true, chunkSizeWarningLimit: 700 },
})
