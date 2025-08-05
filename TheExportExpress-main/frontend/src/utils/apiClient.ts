import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiUrl, INITIAL_API_URL } from '../config';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create({
      baseURL: `${INITIAL_API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Update baseURL once we have the active port
    this.initializeBaseUrl();

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private async initializeBaseUrl() {
    try {
      const baseURL = await getApiUrl();
      this.client.defaults.baseURL = `${baseURL}/api`;
    } catch (error) {
      console.error('Failed to initialize API base URL:', error);
    }
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<ApiResponse<T>>(config);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.message || 'An error occurred');
      }
      throw error;
    }
  }

  // HTTP method wrappers
  public async get<T>(url: string, config?: Omit<AxiosRequestConfig, 'method' | 'url'>) {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public async post<T>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>) {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T>(url: string, config?: Omit<AxiosRequestConfig, 'method' | 'url'>) {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  public async upload(url: string, formData: FormData) {
    return this.request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const api = ApiClient.getInstance();
