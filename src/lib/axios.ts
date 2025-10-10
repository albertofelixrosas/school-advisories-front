import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Usar la misma clave que usa AuthProvider
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo loguear errores, no hacer logout automático
    // El AuthProvider se encargará del manejo de sesión
    if (error.response?.status === 401) {
      console.warn("🔒 Token inválido o expirado, se requiere nueva autenticación")
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
