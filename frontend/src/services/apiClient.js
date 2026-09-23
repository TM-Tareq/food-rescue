/* ==========================================================================
   FoodRescue Central API Client (HTTP Engine with Fallback Support)
   Base URL: http://localhost:8080/api/v1 (Spring Boot Backend)
   ========================================================================== */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Generic Fetch Wrapper with JSON handling and graceful error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const jwtToken = localStorage.getItem('foodrescue_jwt');
  if (jwtToken) {
    defaultHeaders['Authorization'] = `Bearer ${jwtToken}`;
  }

  const config = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API Client Notice]: Connection to ${BASE_URL}${endpoint} failed (${error.message}). Using client fallback engine.`);
    throw error;
  }
}

export default {
  get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' })
};
