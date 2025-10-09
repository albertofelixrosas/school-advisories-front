// Enum que coincide con el backend (usando const para compatibilidad con erasableSyntaxOnly)
export const UserRole = {
  ADMIN: 'admin',
  PROFESSOR: 'professor', 
  STUDENT: 'student',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// Interface para el usuario (basada en tu entidad User del backend)
export interface User {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  phone_number: string;
  school_id?: number;
  username: string;
  photo_url?: string;
  role: UserRole;
  // Propiedades computadas para compatibilidad con frontend existente
  id?: string; // Alias para user_id
  full_name?: string; // Nombre completo computado
  avatar?: string; // Alias para photo_url
  subjectsCount?: number; // Para profesores
}

// Versión sin datos sensibles para el frontend
export interface PublicUser {
  user_id: number;
  name: string;
  last_name: string;
  email: string;
  username: string;
  photo_url?: string;
  role: UserRole;
}

// Para mantener compatibilidad con el código existente
export interface LegacyUser {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  subjectsCount?: number;
}