import axiosInstance from "../lib/axios"
import type { User, Subject } from "../types"

export const teachersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/teachers")
    return response.data
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/teachers/${id}`)
    return response.data
  },

  getSubjects: async (teacherId: string): Promise<Subject[]> => {
    const response = await axiosInstance.get(`/teachers/${teacherId}/subjects`)
    return response.data
  },
}
