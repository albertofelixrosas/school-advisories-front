import { useAuth } from './useAuth'
import type { 
  ProfessorDashboardData, 
  StudentDashboardData, 
  AdminDashboardData 
} from '../types/auth.types'

export function useDashboard() {
  const { user, dashboardData } = useAuth()

  const isProfessor = user?.role === 'professor'
  const isStudent = user?.role === 'student'  
  const isAdmin = user?.role === 'admin'

  const professorData = isProfessor ? (dashboardData as ProfessorDashboardData) : null
  const studentData = isStudent ? (dashboardData as StudentDashboardData) : null
  const adminData = isAdmin ? (dashboardData as AdminDashboardData) : null

  return {
    // Estado general
    user,
    dashboardData,
    isLoaded: Boolean(dashboardData),
    
    // Datos por rol
    professorData,
    studentData, 
    adminData,
    
    // Helpers
    isProfessor,
    isStudent,
    isAdmin,
    
    // Estadísticas específicas
    professorStats: professorData?.professor_stats,
    studentStats: studentData?.student_stats,
    adminStats: adminData?.admin_stats,
  }
}