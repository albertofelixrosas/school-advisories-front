import { apiClient } from './api.client'
import type { Advisory } from './advisories.service'
import type { Venue } from './venues.service'

export interface AdvisoryDate {
  advisory_date_id: number
  advisory_id: number
  venue_id: number
  topic: string
  date: string // ISO 8601 date string
  advisory: Advisory
  venue: Venue
}

export interface CreateAdvisoryDateDto {
  advisory_id: number
  venue_id: number
  topic: string
  date: string // ISO 8601 date string
  student_ids?: number[]
}

export interface UpdateAdvisoryDateDto {
  advisory_id?: number
  venue_id?: number
  topic?: string
  date?: string
  student_ids?: number[]
}

export class AdvisoryDatesService {
  async findAll(): Promise<AdvisoryDate[]> {
    return await apiClient.get<AdvisoryDate[]>('/advisory-dates')
  }

  async findById(id: number): Promise<AdvisoryDate> {
    return await apiClient.get<AdvisoryDate>(`/advisory-dates/${id}`)
  }

  async create(advisoryDateData: CreateAdvisoryDateDto): Promise<AdvisoryDate> {
    return await apiClient.post<AdvisoryDate>('/advisory-dates', advisoryDateData)
  }

  async update(id: number, advisoryDateData: UpdateAdvisoryDateDto): Promise<AdvisoryDate> {
    return await apiClient.put<AdvisoryDate>(`/advisory-dates/${id}`, advisoryDateData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/advisory-dates/${id}`)
  }
}

export const advisoryDatesService = new AdvisoryDatesService()