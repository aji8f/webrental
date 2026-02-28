import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'waiting-capability-federation-pants.trycloudflare.com'
    ],
    proxy: {
      // Only /api and /uploads need proxying — clean and simple
      '/api': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    }
  }
})
