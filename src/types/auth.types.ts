import type { User } from './user.types';

// DTOs que coinciden con el backend
export interface LoginDto {
  username: string;
  password: string;
}

export interface RefreshTokenDto {
  username: string;
  refresh_token: string;
}

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
}

// Dashboard data específico por rol
export interface Schedule {
  day: string;
  begin_time: string;
  end_time: string;
}

export interface Advisory {
  advisory_id: number;
  max_students: number;
  subject_detail?: {
    subject_detail_id: number;
    subject_name: string;
    schedules: Schedule[];
  };
  subject_name?: string;
  schedules?: Schedule[];
}

export interface AdvisoryDate {
  advisory_date_id: number;
  topic?: string;
  subject_name?: string;
  date?: string;
  created_at?: string;
  venue?: {
    name: string;
    type: string;
  };
  location?: string;
  type?: string;
  attendances?: Array<{ attended: boolean }>;
  enrolled_count?: number;
}

export interface ProfessorDashboardData {
  professor_stats: {
    active_advisories_count: number;
    total_students_enrolled: number;
    upcoming_sessions_count: number;
    completed_sessions_count: number;
  };
  assigned_subjects: unknown[]; // Se tipearán cuando el backend esté implementado
  active_advisories: Advisory[]; 
  upcoming_advisory_dates: AdvisoryDate[];
}

export interface StudentDashboardData {
  student_stats: {
    active_appointments_count: number;
    completed_sessions_count: number;
    available_advisories_count: number;
  };
  available_advisories: unknown[]; // Se tipearán cuando el backend esté implementado
  my_appointments: unknown[]; // Se tipearán cuando el backend esté implementado
}

export interface AdminDashboardData {
  admin_stats: {
    total_professors: number;
    total_students: number;
    total_advisories: number;
    total_sessions_this_month: number;
    active_venues: number;
  };
  recent_registrations?: User[];
  most_popular_subjects?: unknown[]; // Se tipearán cuando el backend esté implementado
  system_alerts?: unknown[]; // Se tipearán cuando el backend esté implementado
}

export type DashboardData = ProfessorDashboardData | StudentDashboardData | AdminDashboardData;

// Respuesta completa del login (lo que devuelve tu backend)
export interface LoginResponse extends TokenResponseDto {
  username: string;
  user: User; // Información completa del usuario
  dashboard_data: DashboardData; // Datos del dashboard según el rol
}

// Estado de autenticación en el frontend
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
}

// Errores de autenticación
export interface AuthError {
  message: string;
  status?: number;
  statusCode?: number;
}