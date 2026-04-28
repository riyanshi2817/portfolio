import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch, apiFetchFormData } from "@/lib/api"

export type ClubCategory = "TECH" | "CULTURAL" | "SPORTS" | "SOCIAL" | "OTHER"

export type ClubSummary = {
  _id: string
  name: string
  description?: string
  category: ClubCategory
  tags?: string[]
  logo?: string
  memberCount: number
  userJoined: boolean
  createdAt?: string
  updatedAt?: string
}

export type Club = ClubSummary & {
  userRole?: "LEADER" | "CO_LEADER" | "MEMBER"
}

export type ClubMember = {
  user: { _id: string; name?: string; email: string; role?: string }
  clubRole: "LEADER" | "CO_LEADER" | "MEMBER"
  joinedAt: string
}

type ListClubsParams = {
  page?: number
  limit?: number
  category?: ClubCategory
  search?: string
}

type ListClubsResponse = {
  page: number
  limit: number
  totalPages: number
  totalClubs: number
  clubs: ClubSummary[]
}

type ClubResponse = {
  club: Club
}

type CreateClubResponse = {
  message: string
  club: Club
}

type UpdateClubResponse = {
  message: string
  club: Club
}

type JoinLeaveResponse = {
  message: string
  memberCount: number
}

type ListMembersParams = {
  page?: number
  limit?: number
}

type ListMembersResponse = {
  page: number
  limit: number
  totalMembers: number
  members: ClubMember[]
}

const CLUBS_QUERY_KEY = ["clubs"] as const

export function useClubs(params: ListClubsParams = {}, enabled = true) {
  const { page = 1, limit = 20, category, search } = params

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(Math.min(limit, 100)))
  if (category) queryParams.set("category", category)
  if (search?.trim()) queryParams.set("search", search.trim())

  const queryString = queryParams.toString()
  const path = `/clubs${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...CLUBS_QUERY_KEY, "list", params],
    queryFn: () => apiFetch<ListClubsResponse>(path),
    enabled,
  })
}

export function useClub(clubId: string | null | undefined) {
  return useQuery({
    queryKey: [...CLUBS_QUERY_KEY, "detail", clubId],
    queryFn: () => apiFetch<ClubResponse>(`/clubs/${clubId}`),
    enabled: !!clubId,
  })
}

type CreateClubPayload = {
  name: string
  description?: string
  category?: ClubCategory
  tags?: string[]
  logo?: File
}

export function useCreateClub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateClubPayload) => {
      const formData = new FormData()
      formData.append("name", payload.name.trim())
      if (payload.description) formData.append("description", payload.description.trim())
      if (payload.category) formData.append("category", payload.category)
      if (payload.tags?.length) {
        formData.append("tags", payload.tags.join(","))
      }
      if (payload.logo) formData.append("logo", payload.logo)
      return apiFetchFormData<CreateClubResponse>("/clubs", formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY })
    },
  })
}

type UpdateClubPayload = {
  name?: string
  description?: string
  category?: ClubCategory
  tags?: string[]
  logo?: File
}

export function useUpdateClub(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateClubPayload) => {
      const formData = new FormData()
      if (payload.name !== undefined) formData.append("name", payload.name.trim())
      if (payload.description !== undefined) formData.append("description", payload.description.trim())
      if (payload.category !== undefined) formData.append("category", payload.category)
      if (payload.tags !== undefined && payload.tags.length > 0) {
        formData.append("tags", payload.tags.join(","))
      }
      if (payload.logo) formData.append("logo", payload.logo)
      return apiFetchFormData<UpdateClubResponse>(`/clubs/${clubId}`, formData, { method: "PATCH" })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY })
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
      }
    },
  })
}

export function useDeleteClub() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ message: string }>(`/clubs/${id}`, { method: "DELETE" }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", id] })
    },
  })
}

export function useJoinClub(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<JoinLeaveResponse>(`/clubs/${clubId}/join`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY })
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "members", clubId] })
      }
    },
  })
}

export function useLeaveClub(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<JoinLeaveResponse>(`/clubs/${clubId}/leave`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY })
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "members", clubId] })
      }
    },
  })
}

export function useClubMembers(
  clubId: string | null | undefined,
  params: ListMembersParams = {},
  enabled = true
) {
  const { page = 1, limit = 30 } = params

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(limit))

  const queryString = queryParams.toString()
  const path = `/clubs/${clubId}/members${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...CLUBS_QUERY_KEY, "members", clubId, params],
    queryFn: () => apiFetch<ListMembersResponse>(path),
    enabled: !!clubId && enabled,
  })
}

export function useUpdateMemberRole(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "CO_LEADER" | "MEMBER" }) =>
      apiFetch<{ message: string }>(`/clubs/${clubId}/members/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "members", clubId] })
      }
    },
  })
}

export function useRemoveMember(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) =>
      apiFetch<{ message: string }>(`/clubs/${clubId}/members/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "members", clubId] })
      }
    },
  })
}

export function useTransferLeadership(clubId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newLeaderId: string) =>
      apiFetch<{ message: string }>(`/clubs/${clubId}/transfer`, {
        method: "PATCH",
        body: JSON.stringify({ newLeaderId }),
      }),
    onSuccess: () => {
      if (clubId) {
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "detail", clubId] })
        queryClient.invalidateQueries({ queryKey: [...CLUBS_QUERY_KEY, "members", clubId] })
      }
    },
  })
}
