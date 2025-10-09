import axiosInstance from "../lib/axios"
import type { Schedule } from "../types"

export const schedulesApi = {
  getMySchedule: async (): Promise<Schedule[]> => {
    const response = await axiosInstance.get("/schedules/my")
    return response.data
  },

  create: async (data: {
    dayOfWeek: number
    startTime: string
    endTime: string
    room: string
  }): Promise<Schedule> => {
    const response = await axiosInstance.post("/schedules", data)
    return response.data
  },

  update: async (
    id: string,
    data: { dayOfWeek: number; startTime: string; endTime: string; room: string },
  ): Promise<Schedule> => {
    const response = await axiosInstance.patch(`/schedules/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/schedules/${id}`)
  },
}
