/* ============================================================
   Central API Client
   Manages HTTP requests with credentials and automatic CSRF header.
   ============================================================ */

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let csrfTokenCache: string | null = null;

export function setCachedCsrfToken(token: string | null) {
  csrfTokenCache = token;
}

export function getCachedCsrfToken(): string | null {
  if (csrfTokenCache) return csrfTokenCache;

  // Try reading from document.cookie (aicte_csrf)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)aicte_csrf=([^;]+)/);
    if (match) {
      csrfTokenCache = decodeURIComponent(match[1]);
      return csrfTokenCache;
    }
  }
  return null;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Double-submit CSRF protection header for mutating requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCachedCsrfToken();
    if (csrfToken && !headers.has('X-CSRF-Token')) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes httpOnly session cookie
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
    const errorCode = data?.error?.code || 'API_ERROR';
    throw new ApiError(errorMessage, response.status, errorCode, data?.error?.details);
  }

  return data;
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};
