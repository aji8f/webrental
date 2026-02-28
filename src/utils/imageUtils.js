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

    // Local paths (e.g. /uploads/image.png) are served as static files from root
    return path;
};
