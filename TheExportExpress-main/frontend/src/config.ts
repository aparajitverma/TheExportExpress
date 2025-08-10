// Prefer explicit API base URL from environment when deployed
// e.g., VITE_API_BASE_URL="https://api.yourdomain.com"
const ENV_API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

// Backend can run on ports 3000-3003 during development
const API_PORTS = [3000, 3001, 3002, 3003];
const BASE_URL = "http://localhost";

let activePortCache: number | null = null;

export const getActivePort = async (): Promise<number> => {
  if (activePortCache !== null) {
    return activePortCache;
  }

  for (const port of API_PORTS) {
    try {
      // Added a timeout to prevent hanging indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
      const response = await fetch(`${BASE_URL}:${port}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        activePortCache = port;
        return port;
      }
    } catch (error) {
      // console.warn(`Port ${port} health check failed:`, error);
      continue;
    }
  }
  // If no port is found, default to the first port in the list or a specified default.
  // This helps in scenarios where the server might take a moment longer to start up.
  activePortCache = API_PORTS[0] || 3000;
  console.warn(`No active port found responding to /api/health. Defaulting to ${activePortCache}. Ensure backend is running.`);
  return activePortCache;
};

// API_URL is now a function that returns a promise resolving to the base URL.
export const getApiUrl = async (): Promise<string> => {
  if (ENV_API_BASE_URL) {
    return ENV_API_BASE_URL.replace(/\/$/, '');
  }
  const port = await getActivePort();
  return `${BASE_URL}:${port}`;
};

// UPLOADS_URL will also become a function for consistency
export const getUploadsUrl = async (): Promise<string> => {
  if (ENV_API_BASE_URL) {
    return `${ENV_API_BASE_URL.replace(/\/$/, '')}/uploads`;
  }
  const port = await getActivePort();
  return `${BASE_URL}:${port}/uploads`;
};

// For components or modules that can't easily be async for this, 
// provide a way to get the initial (potentially default) URL sync, 
// but this should be used sparingly and with awareness of potential race conditions.
export const INITIAL_API_URL = `${BASE_URL}:${API_PORTS[0]}`;
export const INITIAL_UPLOADS_URL = `${BASE_URL}:${API_PORTS[0]}/uploads`; 