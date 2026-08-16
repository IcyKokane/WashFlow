import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/WashFlow/',
  plugins: [react()],
  server: { host: true }
})
