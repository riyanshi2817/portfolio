import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type ForumAuthor = {
  _id: string
  name?: string
  email: string
  role?: string
}

export type ForumSummary = {
  _id: string
  title: string
  description?: string
  topic?: string
  tags?: string[]
  createdBy?: ForumAuthor
  isActive?: boolean
  replyCount: number
  lastActivity?: string
  likesCount?: number
  dislikesCount?: number
  createdAt?: string
  updatedAt?: string
}

export type Forum = ForumSummary & {
  userLiked?: boolean
  userDisliked?: boolean
}

export type ForumReply = {
  _id: string
  forumId: string
  author: ForumAuthor
  content: string
  isEdited: boolean
  likesCount: number
  dislikesCount: number
  userLiked: boolean
  userDisliked: boolean
  createdAt: string
  updatedAt: string
}

type ListForumsParams = {
  page?: number
  limit?: number
  topic?: string
  search?: string
  mine?: boolean
}

type ListForumsResponse = {
  forums: ForumSummary[]
  page: number
  pages: number
  total: number
}

type ListRepliesParams = {
  page?: number
  limit?: number
}

type ListRepliesResponse = {
  replies: ForumReply[]
  page: number
  pages: number
  total: number
}

type LikeDislikeResponse = {
  likesCount: number
  dislikesCount: number
  userLiked: boolean
  userDisliked: boolean
}

const FORUMS_QUERY_KEY = ["forums"] as const

export function useForums(params: ListForumsParams = {}, enabled = true) {
  const { page = 1, limit = 20, topic, search, mine } = params

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(Math.min(limit, 50)))
  if (topic?.trim()) queryParams.set("topic", topic.trim())
  if (search?.trim()) queryParams.set("search", search.trim())
  if (mine) queryParams.set("mine", "true")

  const queryString = queryParams.toString()
  const path = `/forums${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...FORUMS_QUERY_KEY, "list", params],
    queryFn: () => apiFetch<ListForumsResponse>(path),
    enabled,
  })
}

export function useForum(forumId: string | null | undefined) {
  return useQuery({
    queryKey: [...FORUMS_QUERY_KEY, "detail", forumId],
    queryFn: () => apiFetch<Forum>(`/forums/${forumId}`),
    enabled: !!forumId,
  })
}

export function useForumReplies(
  forumId: string | null | undefined,
  params: ListRepliesParams = {},
  enabled = true
) {
  const { page = 1, limit = 50 } = params

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(Math.min(limit, 100)))

  const queryString = queryParams.toString()
  const path = `/forums/${forumId}/replies${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...FORUMS_QUERY_KEY, "replies", forumId, params],
    queryFn: () => apiFetch<ListRepliesResponse>(path),
    enabled: !!forumId && enabled,
  })
}

type CreateForumPayload = {
  title: string
  description?: string
  topic?: string
  tags?: string[]
}

export function useCreateForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateForumPayload) => {
      const body: Record<string, unknown> = {
        title: payload.title.trim(),
      }
      if (payload.description?.trim()) body.description = payload.description.trim()
      if (payload.topic?.trim()) body.topic = payload.topic.trim()
      if (payload.tags?.length) body.tags = payload.tags
      return apiFetch<Forum>("/forums", {
        method: "POST",
        body: JSON.stringify(body),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORUMS_QUERY_KEY })
    },
  })
}

export function useDeleteForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (forumId: string) =>
      apiFetch<{ message: string }>(`/forums/${forumId}`, { method: "DELETE" }),
    onSuccess: (_, forumId) => {
      queryClient.invalidateQueries({ queryKey: FORUMS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "detail", forumId] })
      queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", forumId] })
    },
  })
}

export function useAddReply(forumId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) =>
      apiFetch<ForumReply>(`/forums/${forumId}/replies`, {
        method: "POST",
        body: JSON.stringify({ content: content.trim() }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORUMS_QUERY_KEY })
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "detail", forumId] })
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", forumId] })
      }
    },
  })
}

export function useEditReply(replyId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) =>
      apiFetch<ForumReply>(`/forums/replies/${replyId}`, {
        method: "PUT",
        body: JSON.stringify({ content: content.trim() }),
      }),
    onSuccess: (data) => {
      if (data?.forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", data.forumId] })
      }
    },
  })
}

export function useDeleteReply(replyId: string | null | undefined, forumId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<{ message: string }>(`/forums/replies/${replyId}`, { method: "DELETE" }),
    onSuccess: () => {
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "detail", forumId] })
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", forumId] })
      }
    },
  })
}

export function useForumLike(forumId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<LikeDislikeResponse>(`/forums/${forumId}/like`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORUMS_QUERY_KEY })
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "detail", forumId] })
      }
    },
  })
}

export function useForumDislike(forumId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<LikeDislikeResponse>(`/forums/${forumId}/dislike`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORUMS_QUERY_KEY })
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "detail", forumId] })
      }
    },
  })
}

export function useReplyLike(replyId: string | null | undefined, forumId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<LikeDislikeResponse>(`/forums/replies/${replyId}/like`, { method: "PATCH" }),
    onSuccess: () => {
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", forumId] })
      }
    },
  })
}

export function useReplyDislike(replyId: string | null | undefined, forumId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<LikeDislikeResponse>(`/forums/replies/${replyId}/dislike`, { method: "PATCH" }),
    onSuccess: () => {
      if (forumId) {
        queryClient.invalidateQueries({ queryKey: [...FORUMS_QUERY_KEY, "replies", forumId] })
      }
    },
  })
}
