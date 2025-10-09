import { apiClient } from './api.client'
import type { User, UserRole } from '../types/user.types'

export interface CreateUserDto {
  name: string
  last_name: string
  email: string
  phone_number: string
  username: string
  password: string
  photo_url?: string
  school_id: number
  role?: UserRole
}

export interface UpdateUserDto {
  name?: string
  last_name?: string
  email?: string
  phone_number?: string
  username?: string
  password?: string
  photo_url?: string
  school_id?: number
  role?: UserRole
}

export class UsersService {

  async findAll(): Promise<User[]> {
    return await apiClient.get<User[]>('/users')
  }

  async findById(id: number): Promise<User> {
    return await apiClient.get<User>(`/users/${id}`)
  }

  async findStudents(): Promise<User[]> {
    return await apiClient.get<User[]>('/users/students')
  }

  async findProfessors(): Promise<User[]> {
    return await apiClient.get<User[]>('/users/professors')
  }

  async create(userData: CreateUserDto): Promise<User> {
    return await apiClient.post<User>('/users/register', userData)
  }

  async update(id: number, userData: UpdateUserDto): Promise<User> {
    return await apiClient.put<User>(`/users/${id}`, userData)
  }

  async updateRole(id: number, role: UserRole): Promise<User> {
    return await apiClient.patch<User>(`/users/${id}/role`, { role })
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  }
}

export const usersService = new UsersService()