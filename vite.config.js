import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        boutique: fileURLToPath(new URL('./boutique.html', import.meta.url)),
        product: fileURLToPath(new URL('./produit.html', import.meta.url)),
      },
    },
  },
})
