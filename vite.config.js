import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'waiting-capability-federation-pants.trycloudflare.com'
    ], // <--- WAJIB ada koma di sini!
    proxy: {
      '/categories': 'http://localhost:3001',
      '/services': 'http://localhost:3001',
      '/leads': 'http://localhost:3001',
      '/projects': 'http://localhost:3001',
      '/settings': 'http://localhost:3001',
      '/stats': 'http://localhost:3001',
      '/about': 'http://localhost:3001',
      '/upload': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    }
  }
})
