import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch, apiFetchFormData, API_BASE } from "@/lib/api"

export type ResourceType = "SYLLABUS" | "PYQ" | "LECTURE_NOTE"

export type Resource = {
  _id: string
  type: ResourceType
  groupId: { _id: string; name: string; branch: string; year: number; section: string | null; type: string }
  title: string
  description?: string
  subject?: string
  examYear?: string | null
  fileName: string
  fileSize: number
  mimeType: string
  uploadedBy?: { _id: string; name: string; email: string; role: string }
  tags?: string[]
  createdAt: string
  updatedAt: string
}

type ListResourcesParams = {
  type?: ResourceType
  subject?: string
  examYear?: string
  search?: string
  page?: number
  limit?: number
}

type ListResourcesResponse = {
  resources: Resource[]
  page: number
  pages: number
  total: number
}

const RESOURCES_QUERY_KEY = ["resources"] as const

export function useResourcesByGroup(
  groupId: string | null | undefined,
  params: ListResourcesParams = {},
  enabled: boolean = true
) {
  const { type, subject, examYear, search, page = 1, limit = 20 } = params

  const queryParams = new URLSearchParams()
  if (type) queryParams.set("type", type)
  if (subject) queryParams.set("subject", subject)
  if (examYear) queryParams.set("examYear", examYear)
  if (search) queryParams.set("search", search)
  queryParams.set("page", String(page))
  queryParams.set("limit", String(Math.min(limit, 50)))

  const queryString = queryParams.toString()
  const path = `/resources/group/${groupId}${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...RESOURCES_QUERY_KEY, "group", groupId, params],
    queryFn: () => apiFetch<ListResourcesResponse>(path),
    enabled: !!groupId && enabled,
  })
}

type UploadResourcePayload = {
  file: File
  type: ResourceType
  groupId: string
  title: string
  description?: string
  subject?: string
  examYear?: string
  tags?: string[]
}

export function useUploadResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadResourcePayload) => {
      const formData = new FormData()
      formData.append("file", payload.file)
      formData.append("type", payload.type)
      formData.append("groupId", payload.groupId)
      formData.append("title", payload.title)
      if (payload.description) formData.append("description", payload.description)
      if (payload.subject) formData.append("subject", payload.subject)
      if (payload.examYear) formData.append("examYear", payload.examYear)
      if (payload.tags?.length) {
        formData.append("tags", Array.isArray(payload.tags) ? payload.tags.join(",") : String(payload.tags))
      }
      return apiFetchFormData<Resource>("/resources/upload", formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
    },
  })
}

export function useDeleteResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (resourceId: string) =>
      apiFetch<{ message: string }>(`/resources/${resourceId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCES_QUERY_KEY })
    },
  })
}

export async function downloadResource(resourceId: string, fileName?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/resources/${resourceId}/download`, {
    credentials: "include",
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message ?? data.error ?? "Download failed")
  }

  const blob = await res.blob()
  const disposition = res.headers.get("Content-Disposition")
  const match = disposition?.match(/filename="?([^";]+)"?/)
  const downloadFileName = fileName ?? match?.[1] ?? "resource.pdf"

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = downloadFileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
