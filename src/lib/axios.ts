import axios from "axios"
import type { RefreshTokenDto, TokenResponseDto } from "../types/auth.types"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: string | null) => void
  reject: (reason?: Error) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor con renovación automática de token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está renovando el token, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        const userData = localStorage.getItem("user")
        
        if (!refreshToken || !userData) {
          throw new Error("No refresh token available")
        }

        const user = JSON.parse(userData)
        
        // Realizar petición de renovación de token
        const refreshData: RefreshTokenDto = {
          username: user.username,
          refresh_token: refreshToken
        }

        const response = await axios.post<TokenResponseDto>(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          refreshData
        )

        const { access_token } = response.data

        // Actualizar token en localStorage
        localStorage.setItem("access_token", access_token)
        
        // Actualizar header de autorización para la petición original
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        
        // Procesar cola de peticiones pendientes
        processQueue(null, access_token)
        
        console.log("🔄 Token renovado automáticamente")
        
        // Reintentar petición original
        return axiosInstance(originalRequest)
        
      } catch (refreshError) {
        // Error al renovar token, limpiar sesión
        const error = refreshError instanceof Error ? refreshError : new Error('Token refresh failed')
        processQueue(error, null)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        localStorage.removeItem("dashboard_data")
        
        console.warn("🔒 Token expirado y no se pudo renovar, limpiando sesión")
        
        // Recargar página para forzar login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
