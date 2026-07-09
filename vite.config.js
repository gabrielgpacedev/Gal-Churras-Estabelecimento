import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Painel web do estabelecimento — uso em desktop (horizontal), sem PWA.
export default defineConfig({
  plugins: [react()],
  base: '/Gal-Churras-Estabelecimento/',
  server: { host: true },
})
