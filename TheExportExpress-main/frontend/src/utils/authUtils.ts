import axios from 'axios';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const makeAuthenticatedRequest = async (config: any) => {
  const headers = {
    ...config.headers,
    ...getAuthHeaders()
  };
  
  return axios({
    ...config,
    headers
  });
};

export const setupAxiosInterceptors = () => {
  // Request interceptor to always add auth headers
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Only logout for authentication errors, not authorization errors
        const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
        if (errorMessage.includes('Invalid token') || errorMessage.includes('Authentication required') || errorMessage.includes('expired')) {
          // Token is invalid or expired - logout user
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          window.location.href = '/login';
        }
        // For "Insufficient permissions" errors, just show the error without logging out
      }
      return Promise.reject(error);
    }
  );
}; 