import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { advisoriesApi } from "../api/advisories"
import type { CreateAdvisoryDto, UpdateAdvisoryDto } from "../api/advisories"
import { useAuth } from "./useAuth"
import { UserRole } from "../types/user.types"
import toast from "react-hot-toast"

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

// Hook para obtener todas las asesorías (ADMIN)
export function useAdvisories() {
  return useQuery({
    queryKey: ["advisories"],
    queryFn: advisoriesApi.getAll,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener asesoría por ID
export function useAdvisory(id: number) {
  return useQuery({
    queryKey: ["advisories", id],
    queryFn: () => advisoriesApi.getById(id),
    enabled: !!id,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
  })
}

// Hook para obtener las asesorías de un profesor
export function useMyAdvisories() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ["advisories", "professor", user?.user_id],
    queryFn: () => {
      if (!user?.user_id) {
        return []
      }
      return advisoriesApi.getByProfessor(user.user_id)
    },
    enabled: !!user?.user_id && user?.role === UserRole.PROFESSOR,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para crear nueva asesoría
export function useCreateAdvisory() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: CreateAdvisoryDto) => advisoriesApi.create(data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["advisories"] })
      queryClient.invalidateQueries({ queryKey: ["advisories", "professor", user?.user_id] })
      toast.success("Asesoría creada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al crear la asesoría")
    },
  })
}

// Hook para actualizar asesoría
export function useUpdateAdvisory() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdvisoryDto }) => 
      advisoriesApi.update(id, data),
    onSuccess: (_, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["advisories"] })
      queryClient.invalidateQueries({ queryKey: ["advisories", id] })
      queryClient.invalidateQueries({ queryKey: ["advisories", "professor", user?.user_id] })
      toast.success("Asesoría actualizada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al actualizar la asesoría")
    },
  })
}

// Hook para eliminar asesoría
export function useDeleteAdvisory() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: number) => advisoriesApi.delete(id),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["advisories"] })
      queryClient.invalidateQueries({ queryKey: ["advisories", "professor", user?.user_id] })
      toast.success("Asesoría eliminada exitosamente")
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Error al eliminar la asesoría")
    },
  })
}
