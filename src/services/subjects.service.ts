import { apiClient } from './api.client'

export interface Subject {
  subject_id: number
  subject: string
}

export interface CreateSubjectDto {
  subject: string
}

export interface UpdateSubjectDto {
  subject?: string
}

export class SubjectsService {
  async findAll(): Promise<Subject[]> {
    return await apiClient.get<Subject[]>('/subjects')
  }

  async findById(id: number): Promise<Subject> {
    return await apiClient.get<Subject>(`/subjects/${id}`)
  }

  async create(subjectData: CreateSubjectDto): Promise<Subject> {
    return await apiClient.post<Subject>('/subjects', subjectData)
  }

  async update(id: number, subjectData: UpdateSubjectDto): Promise<Subject> {
    return await apiClient.patch<Subject>(`/subjects/${id}`, subjectData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`)
  }
}

export const subjectsService = new SubjectsService()