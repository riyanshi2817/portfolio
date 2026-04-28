import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"

export type DashboardUser = {
  _id?: string
  id?: string
  email: string
  name?: string
  role: "STUDENT" | "FACULTY" | "ADMIN"
  createdAt?: string
  updatedAt?: string
}

export type Notification = {
  _id: string
  type?: string
  isRead?: boolean
  createdAt?: string
  payload?: {
    title?: string
    message?: string
    eventId?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type UpcomingEvent = {
  _id: string
  title: string
  date: string
  time?: string
  venue?: string
  type?: string
  rsvpCount: number
  userRsvpd: boolean
  [key: string]: unknown
}

export type Announcement = {
  id: string
  title: string
  body: string
  type?: string
  pinned?: boolean
}

export type AcademicCalendarEntry = {
  date: string
  label: string
}

export type PlatformHighlight = {
  title: string
  description: string
}

export type QuickLink = {
  label: string
  path: string
  icon?: string
}

export type StudentStats = {
  groupCount?: number
  clubCount?: number
  unresolvedThreads?: number
  totalThreadsInGroups?: number
  quizzesAvailable?: number
  quizzesParticipated?: number
  resourcesInGroups?: number
  roadmaps?: number
  studyPlans?: number
  forumThreads?: number
}

export type FacultyStats = {
  totalGroups?: number
  totalStudents?: number
  eventsOrganized?: number
  quizzesCreated?: number
  resourcesUploaded?: number
  totalThreads?: number
  unresolvedThreads?: number
  totalForumThreads?: number
}

export type AdminStats = {
  users?: {
    total?: number
    students?: number
    faculty?: number
    admins?: number
  }
  groups?: number
  clubs?: number
  events?: {
    total?: number
    upcoming?: number
    byType?: { college?: number; group?: number; club?: number }
  }
  quizzes?: number
  resources?: number
  threads?: {
    total?: number
    unresolved?: number
  }
  forumThreads?: number
  notifications?: number
}

export type RecentQuizScore = {
  _id: string
  title: string
  group?: string
  totalQuestions: number
  score: number
  totalResponseTimeMs?: number
  endedAt: string
}

export type RecentQuiz = {
  _id: string
  title: string
  group?: string
  status?: string
  participantCount?: number
}

export type TrendingTopic = {
  title: string
  tag: string
}

export type RecentUser = {
  _id?: string
  email: string
  role: string
  name?: string
  createdAt: string
}

type StudentDashboardData = {
  profile?: unknown
  groups?: Array<{ _id: string; name?: string; [key: string]: unknown }>
  clubs?: Array<{ _id: string; name?: string; clubRole?: string; [key: string]: unknown }>
  recentQuizScores?: RecentQuizScore[]
  quickLinks?: QuickLink[]
  tips?: string[]
  trendingTopics?: TrendingTopic[]
  stats?: StudentStats
}

type FacultyDashboardData = {
  clubsManaged?: Array<{ _id: string; name?: string; clubRole?: string; [key: string]: unknown }>
  recentQuizzes?: RecentQuiz[]
  quickLinks?: QuickLink[]
  tips?: string[]
  stats?: FacultyStats
}

type AdminDashboardData = {
  recentUsers?: RecentUser[]
  stats?: AdminStats
}

export type DashboardResponse = {
  user: DashboardUser
  unreadNotifications?: number
  recentNotifications?: Notification[]
  upcomingEvents?: UpcomingEvent[]
  announcements?: Announcement[]
  academicCalendar?: AcademicCalendarEntry[]
  platformHighlights?: PlatformHighlight[]
  role: "STUDENT" | "FACULTY" | "ADMIN"
} & (StudentDashboardData | FacultyDashboardData | AdminDashboardData)

const DASHBOARD_QUERY_KEY = ["dashboard"] as const

export function useDashboard(enabled = true) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => apiFetch<DashboardResponse>("/dashboard"),
    enabled,
  })
}
