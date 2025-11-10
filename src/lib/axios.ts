import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { ERROR_MESSAGES } from '../utils/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia principal de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables para manejo de refresh de tokens
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// ===== REQUEST INTERCEPTOR =====
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es en rutas de auth
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Verificar si no es una ruta de auth
      const isAuthRoute = originalRequest.url?.includes('/auth/login') || 
                         originalRequest.url?.includes('/auth/refresh');
      
      if (isAuthRoute) {
        return Promise.reject(error);
      }

      // Si ya estamos renovando el token, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar renovar el token usando nuestro servicio
        await authService.refreshToken();
        const newToken = authService.getAccessToken();
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        // Procesar cola de peticiones pendientes
        processQueue(null, newToken);
        
        console.log('🔄 Token refreshed automatically');
        
        // Reintentar petición original
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Error al renovar token, limpiar sesión
        const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed');
        processQueue(error, null);
        
        // Usar el servicio de auth para logout
        authService.logout();
        
        console.warn('🔒 Token expired and could not refresh, clearing session');
        
        // Mostrar mensaje de error
        toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
        
        // Redireccionar a login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Manejo de otros errores HTTP
    handleHttpErrors(error);

    return Promise.reject(error);
  }
);

// ===== MANEJO DE ERRORES HTTP =====
function handleHttpErrors(error: AxiosError) {
  const status = error.response?.status;
  
  switch (status) {
    case 403:
      toast.error(ERROR_MESSAGES.FORBIDDEN);
      break;
    case 404:
      toast.error(ERROR_MESSAGES.NOT_FOUND);
      break;
    case 500:
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
      break;
    default:
      if (error.message === 'Network Error') {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      }
  }
}

// ===== INSTANCIA PARA API CLIENT =====
// Crear instancia separada para el apiClient que no usa interceptors de auth
export const apiClientInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Solo agregar interceptor de errores básico al apiClient
apiClientInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    handleHttpErrors(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
