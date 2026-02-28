// Centralized API configuration
// All API endpoints are prefixed with /api to avoid conflicts with SPA routes.
// In production, Express serves API at /api/* and SPA fallback for everything else.
// In development, Vite proxies /api/* to localhost:3001.

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default API_BASE_URL;
