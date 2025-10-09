import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments"
import toast from "react-hot-toast"

export function useMyAppointments() {
  return useQuery({
    queryKey: ["appointments", "my"],
    queryFn: appointmentsApi.getMyAppointments,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Cita agendada exitosamente")
    },
    onError: () => {
      toast.error("Error al agendar la cita")
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Cita cancelada")
    },
    onError: () => {
      toast.error("Error al cancelar la cita")
    },
  })
}
