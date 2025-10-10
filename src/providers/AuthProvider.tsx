"use client"

import type React from "react"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { AuthContext } from "../contexts"
import type { User, UserRole } from "../types/user.types"
import type { AuthError, LoginDto, DashboardData } from "../types/auth.types"
import { authService } from "../services/auth.service"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado principal
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  
  // Estado calculado
  const isAuthenticated = Boolean(user && token)

  // Inicialización al cargar la aplicación
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getStoredToken()
      const storedRefreshToken = authService.getStoredRefreshToken()
      const storedUser = localStorage.getItem("user")
      
      if (storedToken && authService.isTokenValid() && storedUser) {
        // Restaurar sesión válida
        setToken(storedToken)
        setRefreshToken(storedRefreshToken)
        setUser(JSON.parse(storedUser))
        
        // Restaurar datos del dashboard si existen
        const storedDashboardData = localStorage.getItem("dashboard_data")
        if (storedDashboardData) {
          setDashboardData(JSON.parse(storedDashboardData))
        }
        
        console.log("🔄 Sesión restaurada desde localStorage")
      } else {
        // 🚀 AUTO-LOGIN PARA DESARROLLO
        const developmentUser: User = {
          user_id: 1,
          username: "dev-student",
          name: "Ana",
          last_name: "García",
          email: "ana.garcia@ejemplo.com",
          phone_number: "+52 644 123 4567",
          role: "student" as UserRole,
          photo_url: "https://i.pravatar.cc/150?img=1"
        }
        
        setUser(developmentUser)
        localStorage.setItem("user", JSON.stringify(developmentUser))
        console.log("🔧 Modo desarrollo: Usuario automático logueado", developmentUser)
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // Función de login real
  const login = async (credentials: LoginDto) => {
    try {
      setError(null)
      setIsLoading(true)
      
      console.log('🔐 Intentando login con backend real...', credentials)
      const response = await authService.login(credentials)
      console.log('✅ Login exitoso:', response)
      
      // Usar datos del backend
      setUser(response.user)
      setToken(response.access_token)
      setRefreshToken(response.refresh_token || null)
      setDashboardData(response.dashboard_data || null)
      
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(response.user))
      localStorage.setItem("dashboard_data", JSON.stringify(response.dashboard_data))
      
      toast.success(`¡Bienvenido ${response.user.name}!`)
      
    } catch (err: unknown) {
      console.log('❌ Error de login:', err)
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Error al iniciar sesión',
        statusCode: 401,
      }
      setError(authError)
      toast.error(authError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Función de registro
  const register = async (username: string, email: string, password: string, name: string, role: UserRole) => {
    try {
      setError(null)
      setIsLoading(true)
      
      // TODO: Implementar llamada real al backend
      const mockUser: User = {
        user_id: Date.now(), // ID temporal
        username,
        name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || "Apellido",
        email,
        phone_number: "+52 644 123 4567",
        role,
        photo_url: "https://i.pravatar.cc/150?img=2",
        // Propiedades adicionales para compatibilidad
        id: `mock-${Date.now()}`,
        full_name: name,
        avatar: "https://i.pravatar.cc/150?img=2",
        subjectsCount: role === "professor" ? 0 : undefined
      }

      console.log("Registered user:", { username, email, password, name, role })
      
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      toast.success("Cuenta creada correctamente")
    } catch (err: unknown) {
      const authError: AuthError = {
        message: err instanceof Error ? err.message : 'Error al crear cuenta',
        statusCode: 400,
      }
      setError(authError)
      toast.error(authError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      // TODO: Activar cuando el backend esté listo
      // await authService.logout()
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    } finally {
      setUser(null)
      setToken(null)
      setRefreshToken(null)
      setError(null)
      setDashboardData(null)
      localStorage.removeItem("user")
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("dashboard_data")
      toast.success("Sesión cerrada")
    }
  }

  // Función para refrescar tokens
  const refreshTokens = async () => {
    try {
      const storedRefreshToken = authService.getStoredRefreshToken()
      const storedUser = localStorage.getItem("user")
      
      if (!storedRefreshToken || !storedUser) {
        throw new Error("No refresh token available")
      }

      // TODO: Implementar llamada real al backend
      // const response = await authService.refreshToken({
      //   username: JSON.parse(storedUser).username,
      //   refresh_token: storedRefreshToken
      // })
      
      console.log("🔄 Tokens refrescados")
    } catch (err) {
      console.error("Error al refrescar tokens:", err)
      await logout() // Cerrar sesión si no se pueden refrescar los tokens
    }
  }

  // Limpiar errores
  const clearError = () => {
    setError(null)
  }

  // 🚀 Función para cambiar entre usuarios de desarrollo
  const switchDevelopmentUser = (role: "student" | "teacher" | "admin") => {
    const developmentUsers: Record<string, User> = {
      student: {
        user_id: 1001,
        name: "Estudiante",
        last_name: "de Desarrollo",
        username: "estudiante.desarrollo",
        email: "estudiante@test.com",
        phone_number: "1234567890",
        role: "student",
        // Propiedades computadas para compatibilidad
        id: "dev-student-001",
        full_name: "Estudiante de Desarrollo",
        avatar: undefined,
        subjectsCount: undefined
      },
      teacher: {
        user_id: 1002,
        name: "Profesor", 
        last_name: "de Desarrollo",
        username: "profesor.desarrollo",
        email: "profesor@test.com",
        phone_number: "1234567890",
        role: "professor",
        // Propiedades computadas para compatibilidad
        id: "dev-teacher-001",
        full_name: "Profesor de Desarrollo",
        avatar: undefined,
        subjectsCount: 3
      },
      admin: {
        user_id: 1003,
        name: "Administrador",
        last_name: "de Desarrollo", 
        username: "admin.desarrollo",
        email: "admin@test.com",
        phone_number: "1234567890",
        role: "admin",
        // Propiedades computadas para compatibilidad
        id: "dev-admin-001",
        full_name: "Administrador de Desarrollo",
        avatar: undefined,
        subjectsCount: undefined
      }
    }
    
    const selectedUser = developmentUsers[role]
    setUser(selectedUser)
    localStorage.setItem("user", JSON.stringify(selectedUser))
    toast.success(`Cambiado a: ${selectedUser.name} ${selectedUser.last_name} (${role})`)
    console.log("🔄 Usuario cambiado:", selectedUser)
  }

  return (
    <AuthContext.Provider 
      value={{
        // Estado
        user,
        isAuthenticated,
        isLoading,
        token,
        refreshToken,
        error,
        dashboardData,
        
        // Métodos
        login,
        register,
        logout,
        refreshTokens,
        clearError,
        switchDevelopmentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
