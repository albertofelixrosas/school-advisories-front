// Re-export tipos del backend
export * from './backend.types'
// Re-export tipos de auth
export type { LoginDto, AuthError, AuthState } from './auth.types'
// Re-export tipos de API
export type { ApiResponse } from './api.types'

import type { User } from './user.types'

// Mantener compatibilidad temporal
export interface LegacyUser {
  id: string
  email: string
  name: string
  role: "student" | "teacher" | "admin"
  avatar?: string
  subjectsCount?: number
}

export interface Subject {
  id: string
  name: string
  code: string
  teacherId: string
  teacher?: User
  advisoriesCount?: number
}

export interface Schedule {
  id: string
  teacherId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string
}

export interface Advisory {
  id: string
  teacherId: string
  teacher?: User
  subjectId: string
  subject?: Subject
  dayOfWeek: number
  startTime: string
  endTime: string
  roomType: "virtual" | "presencial"
  room?: string
  maxStudents: number
  currentStudents?: number
}

export interface Appointment {
  id: string
  studentId: string
  student?: User
  advisoryId: string
  advisory?: Advisory
  date: string
  status: "pending" | "confirmed" | "cancelled"
  notes?: string
  createdAt?: string
}
