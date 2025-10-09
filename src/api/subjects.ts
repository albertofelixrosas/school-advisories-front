import axiosInstance from "../lib/axios"
import type { Subject } from "../types"

export const subjectsApi = {
  getMySubjects: async (): Promise<Subject[]> => {
    const response = await axiosInstance.get("/subjects/my")
    return response.data
  },

  create: async (data: { name: string; code: string }): Promise<Subject> => {
    const response = await axiosInstance.post("/subjects", data)
    return response.data
  },

  update: async (id: string, data: { name: string; code: string }): Promise<Subject> => {
    const response = await axiosInstance.patch(`/subjects/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subjects/${id}`)
  },
}
