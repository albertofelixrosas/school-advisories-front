// Tipos que coinciden exactamente con el backend NestJS

export const WeekDay = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY', 
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY'
} as const

export type WeekDay = typeof WeekDay[keyof typeof WeekDay]

export const VenueType = {
  CLASSROOM: 'CLASSROOM',
  OFFICE: 'OFFICE',
  VIRTUAL: 'VIRTUAL'
} as const

export type VenueType = typeof VenueType[keyof typeof VenueType]

// Entidad Subject - Materias disponibles
export interface Subject {
  subject_id: number
  subject: string
}

// Entidad SubjectDetails - Materia asignada a profesor con horarios
export interface SubjectDetails {
  subject_detail_id: number
  subject_id: number
  professor_id: number
  subject: Subject
  professor: Professor
  schedules: SubjectSchedule[]
}

// Horarios de las materias
export interface SubjectSchedule {
  subject_schedule_id: number
  day: WeekDay
  start_time: string
  end_time: string
  subject_details_id: number
}

// Usuario Profesor
export interface Professor {
  user_id: number
  school_id?: number
  name: string
  last_name: string
  email: string
  photo_url?: string
}

// Entidad Venue - Ubicaciones físicas y virtuales
export interface Venue {
  venue_id: number
  name: string
  type: VenueType
  url?: string
  building?: string
  floor?: string
}

// Horario de la asesoría
export interface AdvisorySchedule {
  advisory_schedule_id: number
  day: WeekDay
  begin_time: string
  end_time: string
}

// Entidad Advisory - Configuración general de asesoría
export interface Advisory {
  advisory_id: number
  max_students: number
  professor: Professor
  subject_detail: {
    subject_detail_id: number
    subject_name: string
    schedules: SubjectSchedule[]
  }
  schedules: AdvisorySchedule[]
}

// Entidad AdvisoryDate - Fecha específica de asesoría
export interface AdvisoryDate {
  advisory_date_id: number
  advisory_id: number
  venue_id: number
  topic: string
  date: string // ISO 8601
  advisory: Advisory
  venue: Venue
  attendances: AdvisoryAttendance[]
}

// Entidad AdvisoryAttendance - Inscripción/Asistencia del estudiante
export interface AdvisoryAttendance {
  advisory_attendance_id: number
  student_id: number
  advisory_date_id: number
  attended: boolean
  student: {
    user_id: number
    name: string
    last_name: string
    email: string
  }
  advisory_date: AdvisoryDate
}

// DTOs para crear datos
export interface CreateAdvisoryDto {
  professor_id: number
  subject_detail_id: number
  max_students: number
  schedules: {
    day: WeekDay
    begin_time: string
    end_time: string
  }[]
}

export interface CreateAdvisoryDateDto {
  advisory_id: number
  venue_id: number
  topic: string
  date: string
  student_ids?: number[]
}

export interface CreateVenueDto {
  name: string
  type: VenueType
  url?: string
  building?: string
  floor?: string
}

// Respuesta de paginación
export interface PaginatedResult<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}