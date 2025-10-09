import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { schedulesApi } from "../api/schedules"
import toast from "react-hot-toast"

export function useMySchedule() {
  return useQuery({
    queryKey: ["schedules", "my"],
    queryFn: schedulesApi.getMySchedule,
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: schedulesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      toast.success("Horario agregado")
    },
    onError: () => {
      toast.error("Error al agregar horario")
    },
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => schedulesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      toast.success("Horario actualizado")
    },
    onError: () => {
      toast.error("Error al actualizar horario")
    },
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: schedulesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] })
      toast.success("Horario eliminado")
    },
    onError: () => {
      toast.error("Error al eliminar horario")
    },
  })
}
