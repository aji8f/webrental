// Centralized API configuration
// In production (VPS), the frontend is served by the same Express server,
// so API calls use relative paths (e.g., "/categories").
// In development, Vite's proxy forwards /api requests to localhost:3001.

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
