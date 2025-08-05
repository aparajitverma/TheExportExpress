import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getApiUrl, INITIAL_API_URL } from '../config';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Set axios defaults
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState(INITIAL_API_URL);

  useEffect(() => {
    const initializeApi = async () => {
      try {
        const apiUrl = await getApiUrl();
        setBaseUrl(apiUrl);
        await checkAuth(apiUrl);
      } catch (error) {
        console.error('Failed to initialize API base URL:', error);
        await checkAuth(baseUrl);
        setLoading(false);
      }
    };
    initializeApi();
  }, []);

  const checkAuth = async (currentBaseUrl: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.get<{ success: boolean; data: User }>(`${currentBaseUrl}/api/auth/me`);
      console.log('Auth check response structure:', response.data); 
      
      if (response.data && response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        console.error('Auth check failed or returned unexpected structure:', response.data);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const apiUrl = await getApiUrl();
      const response = await axios.post<{ success: boolean; data: { token: string; user: User } }>(`${apiUrl}/api/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (!response.data.success) {
        throw new Error('Login failed');
      }
      
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      console.log('User set:', user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is authenticated:', value.isAuthenticated);
  }, [user, value.isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}