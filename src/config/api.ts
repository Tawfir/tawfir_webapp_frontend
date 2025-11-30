/**
 * API Configuration
 * Reads from environment variables set in .env file
 */

const getApiUrl = (): string => {
  // In Vite, environment variables must be prefixed with VITE_
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.warn('VITE_API_URL is not set, defaulting to http://localhost:8080');
    return 'http://localhost:8080';
  }
  
  return apiUrl;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  API_PREFIX: '/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Get the full API URL for an endpoint
 * @param endpoint - API endpoint (e.g., '/auth/login' or 'auth/login')
 * @returns Full URL (e.g., 'http://localhost:8080/api/auth/login')
 */
export const getApiEndpoint = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const apiPrefix = API_CONFIG.API_PREFIX.endsWith('/') 
    ? API_CONFIG.API_PREFIX.slice(0, -1) 
    : API_CONFIG.API_PREFIX;
  
  return `${API_CONFIG.BASE_URL}${apiPrefix}${cleanEndpoint}`;
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.DEV;
};

/**
 * Check if we're in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.VITE_APP_ENV === 'production' || import.meta.env.PROD;
};

