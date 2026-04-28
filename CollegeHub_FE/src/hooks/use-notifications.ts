import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type NotificationType = "QUIZ" | "EVENT" | "CLUB"

export type NotificationPayload = {
  quizId?: {
    _id: string
    title?: string
    status?: string
    groupId?: string
  }
  title?: string
  createdBy?: {
    _id: string
    email?: string
    role?: string
  }
  startAt?: string
}

export type Notification = {
  _id: string
  type: NotificationType
  isRead: boolean
  createdAt: string
  targetGroupId?: string
  payload?: NotificationPayload
}

type NotificationsListResponse = {
  total: number
  page: number
  pages: number
  notifications: Notification[]
}

type UnreadCountResponse = {
  unreadCount: number
}

type MarkReadResponse = {
  message: string
  notification: Notification
}

type MarkAllReadResponse = {
  message: string
  updated: number
}

const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const
const UNREAD_COUNT_QUERY_KEY = ["notifications", "unread-count"] as const

export function useNotifications(
  page = 1,
  limit = 20,
  unreadOnly = false
) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, page, limit, unreadOnly],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        unreadOnly: String(unreadOnly),
      })
      return apiFetch<NotificationsListResponse>(
        `/notifications?${params.toString()}`
      )
    },
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: () =>
      apiFetch<UnreadCountResponse>("/notifications/unread-count"),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiFetch<MarkReadResponse>(
        `/notifications/${notificationId}/read`,
        { method: "PATCH" }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<MarkAllReadResponse>("/notifications/read-all", {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY })
    },
  })
}
