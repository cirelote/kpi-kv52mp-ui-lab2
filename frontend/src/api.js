export const getAccessToken = () => localStorage.getItem('access_token');
export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${baseUrl}/api${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    // In a real production app, handle token refresh here.
    // For simplicity, we just clear tokens and redirect to login
    clearTokens();
    window.location.href = '/login';
    throw new Error("Session expired");
  }

  // Handle NO CONTENT
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error((data && (data.detail || data.error || JSON.stringify(data))) || 'API Request Failed');
  }

  return data;
};
