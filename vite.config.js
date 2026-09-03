import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        boutique: fileURLToPath(new URL('./boutique/index.html', import.meta.url)),
        boutiqueLegacy: fileURLToPath(new URL('./boutique.html', import.meta.url)),
        product: fileURLToPath(new URL('./produit.html', import.meta.url)),
        privacy: fileURLToPath(new URL('./politique-de-confidentialite/index.html', import.meta.url)),
        terms: fileURLToPath(new URL('./conditions-generales-dutilisation/index.html', import.meta.url)),
        legal: fileURLToPath(new URL('./mentions-legales/index.html', import.meta.url)),
        sav: fileURLToPath(new URL('./sav/index.html', import.meta.url)),
        about: fileURLToPath(new URL('./a-propos-de-notre-mission/index.html', import.meta.url)),
        contact: fileURLToPath(new URL('./contact/index.html', import.meta.url)),
        materials: fileURLToPath(new URL('./materiel-telecom-fibre-optique/index.html', import.meta.url)),
        formations: fileURLToPath(new URL('./formations/index.html', import.meta.url)),
        formation: fileURLToPath(new URL('./formation.html', import.meta.url)),
      },
    },
  },
})
