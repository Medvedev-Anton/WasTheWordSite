// Global API/media configuration for frontend
// API_BASE_URL is used only for building full URLs to media files returned from the backend.
// In development it defaults to http://localhost:3001, in production you should provide VITE_API_URL.

const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE_URL: string =
  envApiUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

export function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}



