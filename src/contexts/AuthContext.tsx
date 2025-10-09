import { createContext } from "react"

export type UserRole = "student" | "teacher" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  // 🚀 Función para cambiar usuario de desarrollo
  switchDevelopmentUser: (role: UserRole) => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  switchDevelopmentUser: () => {},
})