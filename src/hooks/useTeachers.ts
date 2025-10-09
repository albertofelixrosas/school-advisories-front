import { useQuery } from "@tanstack/react-query"
import { teachersApi } from "../api/teachers"

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: teachersApi.getAll,
  })
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teachersApi.getById(id),
    enabled: !!id,
  })
}

export function useTeacherSubjects(teacherId: string) {
  return useQuery({
    queryKey: ["teachers", teacherId, "subjects"],
    queryFn: () => teachersApi.getSubjects(teacherId),
    enabled: !!teacherId,
  })
}
