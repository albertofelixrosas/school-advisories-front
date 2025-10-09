import { apiClient } from './api.client'

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

export interface ScheduleDto {
  day: WeekDay
  begin_time: string
  end_time: string
}

export interface SubjectScheduleDto {
  day: WeekDay
  start_time: string
  end_time: string
}

export interface SubjectDetailDto {
  subject_detail_id: number
  subject_name: string
  schedules: SubjectScheduleDto[]
}

export interface ProfessorDto {
  user_id: number
  school_id?: number
  name: string
  last_name: string
  email: string
  photo_url: string
}

export interface Advisory {
  advisory_id: number
  max_students: number
  professor: ProfessorDto
  subject_detail: SubjectDetailDto
  schedules: ScheduleDto[]
}

export interface CreateAdvisoryDto {
  professor_id: number
  subject_detail_id: number
  max_students: number
  schedules: ScheduleDto[]
}

export interface UpdateAdvisoryDto {
  professor_id?: number
  subject_detail_id?: number
  max_students?: number
  schedules?: ScheduleDto[]
}

export class AdvisoriesService {
  async findAll(): Promise<Advisory[]> {
    return await apiClient.get<Advisory[]>('/advisories')
  }

  async findById(id: number): Promise<Advisory> {
    return await apiClient.get<Advisory>(`/advisories/${id}`)
  }

  async create(advisoryData: CreateAdvisoryDto): Promise<Advisory> {
    return await apiClient.post<Advisory>('/advisories', advisoryData)
  }

  async update(id: number, advisoryData: UpdateAdvisoryDto): Promise<Advisory> {
    return await apiClient.patch<Advisory>(`/advisories/${id}`, advisoryData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/advisories/${id}`)
  }
}

export const advisoriesService = new AdvisoriesService()