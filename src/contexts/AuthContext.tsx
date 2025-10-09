import { createContext } from "react"
import type { User, UserRole } from "../types/user.types"
import type { AuthError, LoginDto } from "../types/auth.types"

export interface AuthContextType {
  // Estado de autenticación
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  error: AuthError | null
  
  // Métodos
  login: (credentials: LoginDto) => Promise<void>
  register: (username: string, email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  clearError: () => void
  
  // 🚀 Función para cambiar usuario de desarrollo (mantener compatibilidad)
  switchDevelopmentUser: (role: "student" | "teacher" | "admin") => void
}

export const AuthContext = createContext<AuthContextType>({
  // Estado de autenticación
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  refreshToken: null,
  error: null,
  
  // Métodos
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshTokens: async () => {},
  clearError: () => {},
  switchDevelopmentUser: () => {},
})