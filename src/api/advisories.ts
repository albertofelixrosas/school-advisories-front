import axiosInstance from "../lib/axios"
import type { Advisory } from "../types"

export const advisoriesApi = {
  getAll: async (): Promise<Advisory[]> => {
    const response = await axiosInstance.get("/advisories")
    return response.data
  },

  getById: async (id: string): Promise<Advisory> => {
    const response = await axiosInstance.get(`/advisories/${id}`)
    return response.data
  },

  getByTeacher: async (teacherId: string): Promise<Advisory[]> => {
    const response = await axiosInstance.get(`/advisories/teacher/${teacherId}`)
    return response.data
  },
}
