import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subjectsApi, subjectDetailsApi } from "../api/subjects"
import type { CreateSubjectDto, CreateSubjectDetailDto, UpdateSubjectDto } from "../api/subjects"
import { useAuth } from "./useAuth"
import { UserRole } from "../types/user.types"
import toast from "react-hot-toast"

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Hook para obtener todas las materias del sistema (ADMIN)
export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.getAll,
  })
}

// Hook para obtener las materias asignadas a un profesor
export function useMySubjects() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ["subject-details", "my", user?.user_id],
    queryFn: () => {
      if (!user?.user_id) {
        throw new Error("Usuario no autenticado")
      }
      return subjectDetailsApi.getByProfessor(user.user_id)
    },
    enabled: !!user?.user_id && user?.role === UserRole.PROFESSOR,
  })
}

// Hook para obtener todas las asignaciones subject-details
export function useSubjectDetails() {
  return useQuery({
    queryKey: ["subject-details"],
    queryFn: subjectDetailsApi.getAll,
  })
}

// Hook para crear nueva materia (ADMIN)
export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => subjectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia creada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al crear la materia")
    },
  })
}

// Hook para actualizar materia (ADMIN)
export function useUpdateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectDto }) => 
      subjectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia actualizada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al actualizar la materia")
    },
  })
}

// Hook para eliminar materia (ADMIN)
export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => subjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast.success("Materia eliminada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al eliminar la materia")
    },
  })
}

// Hook para crear asignación profesor-materia
export function useCreateSubjectDetail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubjectDetailDto) => subjectDetailsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-details"] })
      toast.success("Materia asignada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al asignar la materia")
    },
  })
}

// Hook para eliminar asignación profesor-materia
export function useDeleteSubjectDetail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => subjectDetailsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-details"] })
      toast.success("Asignación eliminada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al eliminar la asignación")
    },
  })
}
