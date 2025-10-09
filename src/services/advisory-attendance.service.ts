import { apiClient } from './api.client'
import type { User } from '../types/user.types'
import type { AdvisoryDate } from '../types/backend.types'

export interface AdvisoryAttendance {
  advisory_attendance_id: number
  student_id: number
  advisory_date_id: number
  attended: boolean
  student: User
  advisory_date: AdvisoryDate
}

export interface CreateAdvisoryAttendanceDto {
  student_id: number
  advisory_date_id: number
  attended?: boolean
}

export interface UpdateAdvisoryAttendanceDto {
  attended?: boolean
}

export class AdvisoryAttendanceService {
  async findAll(): Promise<AdvisoryAttendance[]> {
    return await apiClient.get<AdvisoryAttendance[]>('/advisory-attendance')
  }

  async findByAdvisory(advisory_date_id: number): Promise<AdvisoryAttendance[]> {
    return await apiClient.get<AdvisoryAttendance[]>(`/advisory-attendance/advisory/${advisory_date_id}`)
  }

  async findById(id: number): Promise<AdvisoryAttendance> {
    return await apiClient.get<AdvisoryAttendance>(`/advisory-attendance/${id}`)
  }

  async create(attendanceData: CreateAdvisoryAttendanceDto): Promise<AdvisoryAttendance> {
    return await apiClient.post<AdvisoryAttendance>('/advisory-attendance', attendanceData)
  }

  async update(id: number, attendanceData: UpdateAdvisoryAttendanceDto): Promise<AdvisoryAttendance> {
    return await apiClient.patch<AdvisoryAttendance>(`/advisory-attendance/${id}`, attendanceData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/advisory-attendance/${id}`)
  }
}

export const advisoryAttendanceService = new AdvisoryAttendanceService()