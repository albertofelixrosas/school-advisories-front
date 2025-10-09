import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subjectsApi } from "../api/subjects"
import toast from "react-hot-toast"

export function useMySubjects() {
  return useQuery({
    queryKey: ["subjects", "my"],
    queryFn: subjectsApi.getMySubjects,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia creada exitosamente")
    },
    onError: () => {
      toast.error("Error al crear la materia")
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; code: string } }) => subjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia actualizada")
    },
    onError: () => {
      toast.error("Error al actualizar la materia")
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subjectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia eliminada")
    },
    onError: () => {
      toast.error("Error al eliminar la materia")
    },
  })
}
