"use client"

import type React from "react"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { AuthContext, type User, type UserRole } from "../contexts"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // 🚀 AUTO-LOGIN PARA DESARROLLO - Simula un usuario automáticamente
      const developmentUser: User = {
        id: "dev-user-1",
        email: "estudiante@ejemplo.com",
        name: "Estudiante Demo",
        role: "student", // Cambiar a "teacher" o "admin" según necesites
        avatar: "https://i.pravatar.cc/150?img=1"
      }
      
      setUser(developmentUser)
      localStorage.setItem("user", JSON.stringify(developmentUser))
      console.log("🔧 Modo desarrollo: Usuario automático logueado", developmentUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulated login for now
      const mockUser: User = {
        id: "1",
        email,
        name: "Usuario Demo",
        role: "student",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      toast.success("Sesión iniciada correctamente")
    } catch (error) {
      toast.error("Error al iniciar sesión")
      throw error
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: "1",
        email,
        name,
        role,
      }

      console.log("Registered user:", { email, password, name, role })

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      toast.success("Cuenta creada correctamente")
    } catch (error) {
      toast.error("Error al crear cuenta")
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    toast.success("Sesión cerrada")
  }

  // 🚀 Función para cambiar entre diferentes usuarios de desarrollo
  const switchDevelopmentUser = (role: UserRole) => {
    const developmentUsers: Record<UserRole, User> = {
      student: {
        id: "student-1",
        email: "estudiante@ejemplo.com", 
        name: "Ana García",
        role: "student",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      teacher: {
        id: "teacher-1",
        email: "profesor@ejemplo.com",
        name: "Dr. Juan Pérez", 
        role: "teacher",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      admin: {
        id: "admin-1",
        email: "admin@ejemplo.com",
        name: "María Administradora",
        role: "admin", 
        avatar: "https://i.pravatar.cc/150?img=3"
      }
    }

    const selectedUser = developmentUsers[role]
    setUser(selectedUser)
    localStorage.setItem("user", JSON.stringify(selectedUser))
    toast.success(`Cambiado a usuario: ${selectedUser.name} (${role})`)
    console.log("🔄 Usuario cambiado:", selectedUser)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, switchDevelopmentUser }}>{children}</AuthContext.Provider>
}
