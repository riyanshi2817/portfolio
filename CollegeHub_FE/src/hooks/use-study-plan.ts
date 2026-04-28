import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type DailySchedule = {
  day: string
  subject: string
  topics: string[]
  hours: number
  task: string
}

export type WeeklyPlan = {
  week: number
  focus: string
  dailySchedule: DailySchedule[]
}

export type StudyPlanContent = {
  totalWeeks: number
  dailyHours?: number
  weeklyPlan: WeeklyPlan[]
  revisionStrategy: string
  tips: string[]
}

export type StudyPlan = {
  _id: string
  userId: string
  subjects: string[]
  examDate?: string
  hoursPerDay: number
  goals?: string
  plan: StudyPlanContent
  createdAt: string
  updatedAt: string
}

export type StudyPlanSummary = {
  _id: string
  subjects: string[]
  examDate?: string
  hoursPerDay: number
  goals?: string
  createdAt: string
}

type StudyPlansListResponse = {
  count: number
  studyPlans: StudyPlanSummary[]
}

type StudyPlanResponse = {
  studyPlan: StudyPlan
}

type CreateStudyPlanResponse = {
  message: string
  studyPlan: StudyPlan
}

type CreateStudyPlanPayload = {
  subjects: string[]
  examDate?: string
  hoursPerDay?: number
  goals?: string
}

export function useStudyPlans() {
  return useQuery({
    queryKey: ["ai", "study-plans"],
    queryFn: () => apiFetch<StudyPlansListResponse>("/ai/study-plan"),
  })
}

export function useStudyPlan(id: string | null | undefined) {
  return useQuery({
    queryKey: ["ai", "study-plan", id],
    queryFn: () => apiFetch<StudyPlanResponse>(`/ai/study-plan/${id}`),
    enabled: !!id,
  })
}

export function useCreateStudyPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStudyPlanPayload) =>
      apiFetch<CreateStudyPlanResponse>("/ai/study-plan", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai", "study-plans"] })
    },
  })
}

type DeleteStudyPlanResponse = { message: string }

export function useDeleteStudyPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<DeleteStudyPlanResponse>(`/ai/study-plan/${id}`, {
        method: "DELETE",
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ai", "study-plans"] })
      queryClient.invalidateQueries({ queryKey: ["ai", "study-plan", id] })
    },
  })
}
