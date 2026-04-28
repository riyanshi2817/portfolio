import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type RoadmapResource = {
  title: string
  url: string
  type: "video" | "article" | "docs" | "book" | "course"
}

export type RoadmapPhase = {
  phase: number
  title: string
  duration: string
  topics: string[]
  resources: RoadmapResource[]
  project: { title: string; description: string }
}

export type RoadmapContent = {
  skill: string
  overview: string
  totalDuration: string
  phases: RoadmapPhase[]
  finalProject: { title: string; description: string }
  tips: string[]
}

export type Roadmap = {
  _id: string
  userId: string
  skill: string
  level: string
  goal: string
  roadmap: RoadmapContent
  createdAt: string
  updatedAt: string
}

export type RoadmapSummary = {
  _id: string
  skill: string
  level: string
  goal: string
  createdAt: string
}

type RoadmapsListResponse = {
  count: number
  roadmaps: RoadmapSummary[]
}

type RoadmapResponse = {
  roadmap: Roadmap
}

type CreateRoadmapResponse = {
  message: string
  roadmap: Roadmap
}

type CreateRoadmapPayload = {
  skill: string
  level?: "beginner" | "intermediate" | "advanced"
  goal?: string
}

export function useRoadmaps() {
  return useQuery({
    queryKey: ["ai", "roadmaps"],
    queryFn: () => apiFetch<RoadmapsListResponse>("/ai/roadmap"),
  })
}

export function useRoadmap(id: string | null | undefined) {
  return useQuery({
    queryKey: ["ai", "roadmap", id],
    queryFn: () => apiFetch<RoadmapResponse>(`/ai/roadmap/${id}`),
    enabled: !!id,
  })
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRoadmapPayload) =>
      apiFetch<CreateRoadmapResponse>("/ai/roadmap", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "roadmaps"] })
    },
  })
}

type DeleteRoadmapResponse = { message: string }

export function useDeleteRoadmap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<DeleteRoadmapResponse>(`/ai/roadmap/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "roadmaps"] })
      queryClient.invalidateQueries({ queryKey: ["ai", "roadmap", id] })
    },
  })
}
