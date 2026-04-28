import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch, apiFetchFormData } from "@/lib/api"

export type EventType = "COLLEGE" | "GROUP" | "CLUB"

export type EventSummary = {
  _id: string
  title: string
  date: string
  description?: string
  time?: string
  venue?: string
  type: EventType
  groupId?: { _id: string; name: string }
  clubId?: { _id: string; name: string; logo?: string; category?: string }
  poster?: string
  tags?: string[]
  rsvpCount: number
  userRsvpd: boolean
  organizer?: { _id: string; email: string; role?: string }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type Event = EventSummary & {
  rsvps?: Array<{ _id: string; email: string }>
}

type ListEventsParams = {
  page?: number
  limit?: number
  type?: EventType
  groupId?: string
  clubId?: string
  upcoming?: boolean
  search?: string
}

type ListEventsResponse = {
  page: number
  limit: number
  totalPages: number
  totalEvents: number
  events: EventSummary[]
}

type EventResponse = {
  event: Event
}

type CreateEventResponse = {
  message: string
  event: Event
}

type UpdateEventResponse = {
  message: string
  event: Event
}

type RsvpResponse = {
  message: string
  rsvpCount: number
  userRsvpd: boolean
}

const EVENTS_QUERY_KEY = ["events"] as const

export function useEvents(params: ListEventsParams = {}, enabled = true) {
  const { page = 1, limit = 20, type, groupId, clubId, upcoming, search } = params

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(Math.min(limit, 100)))
  if (type) queryParams.set("type", type)
  if (groupId) queryParams.set("groupId", groupId)
  if (clubId) queryParams.set("clubId", clubId)
  if (upcoming) queryParams.set("upcoming", "true")
  if (search?.trim()) queryParams.set("search", search.trim())

  const queryString = queryParams.toString()
  const path = `/events${queryString ? `?${queryString}` : ""}`

  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, "list", params],
    queryFn: () => apiFetch<ListEventsResponse>(path),
    enabled,
  })
}

export function useEvent(eventId: string | null | undefined) {
  return useQuery({
    queryKey: [...EVENTS_QUERY_KEY, "detail", eventId],
    queryFn: () => apiFetch<EventResponse>(`/events/${eventId}`),
    enabled: !!eventId,
  })
}

type CreateEventPayload = {
  title: string
  date: string
  description?: string
  time?: string
  venue?: string
  type?: EventType
  groupId?: string
  clubId?: string
  tags?: string[]
  poster?: File
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const formData = new FormData()
      formData.append("title", payload.title.trim())
      formData.append("date", payload.date)
      if (payload.description) formData.append("description", payload.description.trim())
      if (payload.time) formData.append("time", payload.time.trim())
      if (payload.venue) formData.append("venue", payload.venue.trim())
      if (payload.type) formData.append("type", payload.type)
      if (payload.groupId) formData.append("groupId", payload.groupId)
      if (payload.clubId) formData.append("clubId", payload.clubId)
      if (payload.tags?.length) {
        formData.append("tags", JSON.stringify(payload.tags))
      }
      if (payload.poster) formData.append("poster", payload.poster)
      return apiFetchFormData<CreateEventResponse>("/events", formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
    },
  })
}

type UpdateEventPayload = {
  title?: string
  date?: string
  description?: string
  time?: string
  venue?: string
  type?: EventType
  groupId?: string
  tags?: string[]
  poster?: File
}

export function useUpdateEvent(eventId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const formData = new FormData()
      if (payload.title !== undefined) formData.append("title", payload.title.trim())
      if (payload.date !== undefined) formData.append("date", payload.date)
      if (payload.description !== undefined) formData.append("description", payload.description.trim())
      if (payload.time !== undefined) formData.append("time", payload.time.trim())
      if (payload.venue !== undefined) formData.append("venue", payload.venue.trim())
      if (payload.type !== undefined) formData.append("type", payload.type)
      if (payload.groupId !== undefined) formData.append("groupId", payload.groupId)
      if (payload.tags !== undefined) {
        formData.append("tags", JSON.stringify(payload.tags))
      }
      if (payload.poster) formData.append("poster", payload.poster)
      return apiFetchFormData<UpdateEventResponse>(`/events/${eventId}`, formData, { method: "PATCH" })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, "detail", eventId] })
      }
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) =>
      apiFetch<{ message: string }>(`/events/${eventId}`, { method: "DELETE" }),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, "detail", eventId] })
    },
  })
}

export function useEventRsvp(eventId: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiFetch<RsvpResponse>(`/events/${eventId}/rsvp`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY })
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, "detail", eventId] })
      }
    },
  })
}
