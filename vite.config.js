import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy bypass: don't proxy browser page navigation (Accept: text/html)
// Only proxy actual API/data requests (Accept: application/json)
function bypassHtmlRequests(req) {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return req.url; // Don't proxy, let Vite serve the SPA
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'waiting-capability-federation-pants.trycloudflare.com'
    ],
    proxy: {
      '/api': 'http://localhost:3001',
      '/categories': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/services': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/leads': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/projects': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/settings': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/stats': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/about': {
        target: 'http://localhost:3001',
        bypass: bypassHtmlRequests,
      },
      '/upload': 'http://localhost:3001',
      '/uploads': 'http://localhost:3001',
    }
  }
})
