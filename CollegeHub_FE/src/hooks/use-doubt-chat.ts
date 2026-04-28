import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type DoubtChatMessage = {
  _id: string
  role: "user" | "model"
  content: string
  createdAt: string
}

type DoubtChatHistoryResponse = {
  messages: DoubtChatMessage[]
  total: number
  updatedAt?: string
}

type DoubtChatSendResponse = {
  question: string
  answer: string
  totalMessages: number
}

type DoubtChatClearResponse = {
  message: string
}

const DOUBT_CHAT_QUERY_KEY = ["ai", "doubt-chat"] as const

export function useDoubtChatHistory() {
  return useQuery({
    queryKey: DOUBT_CHAT_QUERY_KEY,
    queryFn: () =>
      apiFetch<DoubtChatHistoryResponse>("/ai/doubt-chat"),
  })
}

export function useSendDoubtChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: string) =>
      apiFetch<DoubtChatSendResponse>("/ai/doubt-chat", {
        method: "POST",
        body: JSON.stringify({ question }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOUBT_CHAT_QUERY_KEY })
    },
  })
}

export function useClearDoubtChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<DoubtChatClearResponse>("/ai/doubt-chat", {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOUBT_CHAT_QUERY_KEY })
    },
  })
}
