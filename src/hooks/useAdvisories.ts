import { useQuery } from "@tanstack/react-query"
import { advisoriesApi } from "../api/advisories"

export function useAdvisories() {
  return useQuery({
    queryKey: ["advisories"],
    queryFn: advisoriesApi.getAll,
  })
}

export function useAdvisory(id: string) {
  return useQuery({
    queryKey: ["advisories", id],
    queryFn: () => advisoriesApi.getById(id),
    enabled: !!id,
  })
}
