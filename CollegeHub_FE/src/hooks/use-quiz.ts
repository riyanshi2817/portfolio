import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type QuizQuestion = {
  text: string
  options: string[]
  correctIndex?: number
  timeLimit: number
  stats?: {
    optionCounts?: number[]
    correctCount?: number
  }
}

export type Quiz = {
  _id: string
  title: string
  groupId: string
  createdBy?: { _id: string; email: string; role: string }
  roleOfCreator?: string
  status: "CREATED" | "RUNNING" | "ENDED"
  questions: QuizQuestion[]
  participantCount?: number
  startedAt?: string
  endedAt?: string
  createdAt?: string
  updatedAt?: string
}

export type QuizSummary = {
  _id: string
  title: string
  status: "CREATED" | "RUNNING" | "ENDED"
  questionCount: number
  createdBy?: { _id: string; email: string; role: string }
  roleOfCreator?: string
  startedAt?: string
  endedAt?: string
  participantCount?: number
  createdAt: string
}

export type LeaderboardEntry = {
  rank: number
  userId: { _id: string; email: string; role: string }
  score: number
  totalResponseTimeMs: number
  answers?: { questionIndex: number; selectedIndex: number; isCorrect: boolean; responseTimeMs: number }[]
}

type QuizzesByGroupResponse = {
  count: number
  quizzes: QuizSummary[]
}

type QuizResponse = {
  quiz: Quiz
}

type QuizResultsResponse = {
  quiz: Quiz
  leaderboard: LeaderboardEntry[]
}

type CreateQuizPayload = {
  title: string
  groupId: string
  questions: {
    text: string
    options: string[]
    correctIndex: number
    timeLimit: number
  }[]
}

type CreateQuizResponse = {
  message: string
  quiz: Quiz
}

type StartQuizResponse = {
  message: string
  quizId: string
  status: "RUNNING"
}

export function useQuizzesByGroup(groupId: string | null | undefined) {
  return useQuery({
    queryKey: ["quiz", "group", groupId],
    queryFn: () => apiFetch<QuizzesByGroupResponse>(`/quiz/group/${groupId}`),
    enabled: !!groupId,
  })
}

export function useQuiz(quizId: string | null | undefined) {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => apiFetch<QuizResponse>(`/quiz/${quizId}`),
    enabled: !!quizId,
  })
}

export function useCreateQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateQuizPayload) =>
      apiFetch<CreateQuizResponse>("/quiz", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quiz", "group", variables.groupId] })
    },
  })
}

export function useStartQuiz() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quizId: string) =>
      apiFetch<StartQuizResponse>(`/quiz/${quizId}/start`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quiz", data.quizId] })
      queryClient.invalidateQueries({ queryKey: ["quiz", "group"] })
    },
  })
}

export function useQuizResults(quizId: string | null | undefined) {
  return useQuery({
    queryKey: ["quiz", quizId, "results"],
    queryFn: () => apiFetch<QuizResultsResponse>(`/quiz/${quizId}/results`),
    enabled: !!quizId,
  })
}
