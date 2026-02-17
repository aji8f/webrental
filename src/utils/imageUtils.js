import API_BASE_URL from '../config/api';

export const getImageUrl = (path) => {
    if (!path) return '';

    // If it's a full URL (e.g. from Unsplash or other external source), return as is
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }

    // If it's a base64 string, return as is (for legacy support during migration)
    if (path.startsWith('data:image')) {
        return path;
    }

    // If it's a local path (starts with /uploads), append the backend URL
    return `${API_BASE_URL}${path}`;
};
