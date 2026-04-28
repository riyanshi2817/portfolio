import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch, API_BASE } from "@/lib/api"

export type Profile = {
  _id: string
  userId?: { _id: string; email: string; role: string; name?: string }
  branch: string
  year: number
  section: string
  rollNumber: string
  skills?: string[]
  interests?: string[]
  resumeLink?: string
  portfolioLink?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateProfilePayload = {
  branch: string
  year: number
  section: string
  rollNumber: string
  skills?: string[]
  interests?: string[]
  resumeLink?: string
  portfolioLink?: string
}

export type UpdateProfilePayload = Partial<CreateProfilePayload>

type ProfileMeResponse = {
  profile: Profile
}

type CreateProfileResponse = {
  message: string
  profile: Profile
}

type UpdateProfileResponse = {
  message: string
  profile: Profile
}

const PROFILE_ME_QUERY_KEY = ["profile", "me"] as const

async function fetchProfileMe(): Promise<Profile | null> {
  try {
    const data = await apiFetch<ProfileMeResponse>("/profile/me")
    return data.profile
  } catch (err) {
    const message = (err as Error).message
    if (message.toLowerCase().includes("profile not found") || message.includes("404")) {
      return null
    }
    throw err
  }
}

export function useProfileMe(enabled: boolean = true) {
  return useQuery({
    queryKey: PROFILE_ME_QUERY_KEY,
    queryFn: fetchProfileMe,
    enabled,
    retry: (failureCount, error) => {
      const msg = (error as Error).message
      if (msg.includes("Profile not found") || msg.includes("404")) return false
      return failureCount < 2
    },
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProfilePayload) =>
      apiFetch<CreateProfileResponse>("/profile", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_ME_QUERY_KEY })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiFetch<UpdateProfileResponse>("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_ME_QUERY_KEY })
    },
  })
}

export type ProfileFilterParams = {
  branch?: string
  year?: number
  section?: string
}

type ProfileFilterResponse = {
  count: number
  profiles: Profile[]
}

const PROFILE_FILTER_QUERY_KEY = ["profile", "filter"] as const

export function useProfileFilter(
  params: ProfileFilterParams,
  enabled: boolean = true
) {
  const searchParams = new URLSearchParams()
  if (params.branch?.trim()) searchParams.set("branch", params.branch.trim())
  if (params.year != null) searchParams.set("year", String(params.year))
  if (params.section?.trim()) searchParams.set("section", params.section.trim())

  const queryString = searchParams.toString()
  const path = `/profile/filter${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...PROFILE_FILTER_QUERY_KEY, params],
    queryFn: () => apiFetch<ProfileFilterResponse>(path),
    enabled,
  })
}

export type ExportProfileCsvParams = {
  branch?: string
  year?: number
  section?: string
  hasResume?: "true" | "false"
  groupId?: string
}

async function exportProfileCsv(params: ExportProfileCsvParams): Promise<void> {
  const searchParams = new URLSearchParams()
  if (params.branch) searchParams.set("branch", params.branch)
  if (params.year != null) searchParams.set("year", String(params.year))
  if (params.section) searchParams.set("section", params.section)
  if (params.hasResume) searchParams.set("hasResume", params.hasResume)
  if (params.groupId) searchParams.set("groupId", params.groupId)

  const queryString = searchParams.toString()
  const path = `/profile/export/csv${queryString ? `?${queryString}` : ""}`

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { message?: string }).message ?? "Export failed")
  }

  const blob = await res.blob()
  const disposition = res.headers.get("Content-Disposition")
  const match = disposition?.match(/filename="?([^";]+)"?/)
  const downloadFileName = match?.[1] ?? `students_${Date.now()}.csv`

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = downloadFileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function useExportProfileCsv() {
  return useMutation({
    mutationFn: (params: ExportProfileCsvParams = {}) => exportProfileCsv(params),
  })
}
