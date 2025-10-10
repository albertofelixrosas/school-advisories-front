import { createContext } from "react"
import type { User, UserRole } from "../types/user.types"
import type { AuthError, LoginDto, DashboardData } from "../types/auth.types"

export interface AuthContextType {
  // Estado de autenticación
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  refreshToken: string | null
  error: AuthError | null
  dashboardData: DashboardData | null
  
  // Métodos
  login: (credentials: LoginDto) => Promise<void>
  register: (username: string, email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType>({
  // Estado de autenticación
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  refreshToken: null,
  error: null,
  dashboardData: null,
  
  // Métodos
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshTokens: async () => {},
  clearError: () => {},
})