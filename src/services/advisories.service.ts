import { apiClient } from './api.client'
import type { 
  Advisory, 
  CreateAdvisoryDto, 
  WeekDay 
} from '../types/backend.types'

export interface UpdateAdvisoryDto {
  professor_id?: number
  subject_detail_id?: number
  max_students?: number
  schedules?: {
    day: WeekDay
    begin_time: string
    end_time: string
  }[]
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