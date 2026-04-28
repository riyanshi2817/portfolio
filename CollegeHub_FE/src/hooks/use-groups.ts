import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type Group = {
  _id: string
  name: string
  type: "YEAR" | "YEAR_SECTION"
  branch: string
  year: number
  section: string | null
  isActive: boolean
  socketRoom: string
}

type MyGroupsResponse = {
  groups: Group[]
}

type AllGroupsResponse = {
  count: number
  groups: Group[]
}

export function useMyGroups() {
  return useQuery({
    queryKey: ["groups", "my"],
    queryFn: () => apiFetch<MyGroupsResponse>("/groups/my"),
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("No groups found")) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useAllGroups(enabled: boolean = true) {
  return useQuery({
    queryKey: ["groups", "all"],
    queryFn: () => apiFetch<AllGroupsResponse>("/groups"),
    enabled,
  })
}
