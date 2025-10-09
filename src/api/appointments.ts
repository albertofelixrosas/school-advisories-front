import axiosInstance from "../lib/axios"
import type { Appointment } from "../types"

export const appointmentsApi = {
  getMyAppointments: async (): Promise<Appointment[]> => {
    const response = await axiosInstance.get("/appointments/my")
    return response.data
  },

  create: async (data: { advisoryId: string; date: string; notes?: string }): Promise<Appointment> => {
    const response = await axiosInstance.post("/appointments", data)
    return response.data
  },

  cancel: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/appointments/${id}/cancel`)
  },
}
