import { Link } from "react-router"
import {
  MegaphoneIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  UsersIcon,
  TreeStructureIcon,
  ExamIcon,
  MapTrifoldIcon,
  PushPinIcon,
  TrendUpIcon,
  LightbulbIcon,
} from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboard, type StudentStats, type FacultyStats, type AdminStats } from "@/hooks/use-dashboard"
import { SummaryStatCard } from "@/components/dashboard/SummaryStatCard"
import { QuickLinksGrid } from "@/components/dashboard/QuickLinksGrid"

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

function formatDateShort(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch {
    return iso
  }
}

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
        <p className="font-medium">Failed to load dashboard</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : "Please try again later."}</p>
      </div>
    )
  }

  if (!data) return null

  const {
    upcomingEvents = [],
    announcements = [],
    academicCalendar = [],
    role,
  } = data

  const studentStats = role === "STUDENT" && "stats" in data ? (data.stats as StudentStats) : null

  return (
    <div className="space-y-6 min-h-full bg-muted/30 p-4 rounded-xl">
      {/* Top Summary Stats - Student */}
      {role === "STUDENT" && studentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryStatCard
            icon={<UsersIcon className="size-6" weight="fill" />}
            label="Groups Joined"
            value={studentStats.groupCount ?? 0}
          />
          <SummaryStatCard
            icon={<TreeStructureIcon className="size-6" weight="fill" />}
            label="Clubs Joined"
            value={studentStats.clubCount ?? 0}
          />
          <SummaryStatCard
            icon={<ExamIcon className="size-6" weight="fill" />}
            label="Quizzes Done"
            value={studentStats.quizzesParticipated ?? 0}
          />
          <SummaryStatCard
            icon={<MapTrifoldIcon className="size-6" weight="fill" />}
            label="Roadmaps Created"
            value={studentStats.roadmaps ?? 0}
          />
        </div>
      )}

      {/* Top Summary Stats - Faculty & Admin (full width) */}
      {(role === "FACULTY" || role === "ADMIN") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {role === "FACULTY" && "stats" in data && data.stats && (
            <>
              <SummaryStatCard
                icon={<UsersIcon className="size-6" weight="fill" />}
                label="Groups"
                value={(data.stats as FacultyStats).totalGroups ?? 0}
              />
              <SummaryStatCard
                icon={<UsersIcon className="size-6" weight="fill" />}
                label="Students"
                value={(data.stats as FacultyStats).totalStudents ?? 0}
              />
              <SummaryStatCard
                icon={<CalendarBlankIcon className="size-6" weight="fill" />}
                label="Events"
                value={(data.stats as FacultyStats).eventsOrganized ?? 0}
              />
              <SummaryStatCard
                icon={<ExamIcon className="size-6" weight="fill" />}
                label="Quizzes"
                value={(data.stats as FacultyStats).quizzesCreated ?? 0}
              />
            </>
          )}
          {role === "ADMIN" && "stats" in data && data.stats && (
            <>
              <SummaryStatCard
                icon={<UsersIcon className="size-6" weight="fill" />}
                label="Users"
                value={(data.stats as AdminStats).users?.total ?? 0}
              />
              <SummaryStatCard
                icon={<TreeStructureIcon className="size-6" weight="fill" />}
                label="Groups"
                value={(data.stats as AdminStats).groups ?? 0}
              />
              <SummaryStatCard
                icon={<TreeStructureIcon className="size-6" weight="fill" />}
                label="Clubs"
                value={(data.stats as AdminStats).clubs ?? 0}
              />
              <SummaryStatCard
                icon={<CalendarBlankIcon className="size-6" weight="fill" />}
                label="Events"
                value={(data.stats as AdminStats).events?.total ?? 0}
              />
            </>
          )}
        </div>
      )}

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Upcoming Events - Timeline */}
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarBlankIcon className="size-5 text-primary" weight="fill" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No upcoming events</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-primary/30" />
                  <ul className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <li key={event._id} className="relative pl-6">
                        <Link
                          to={`/events/${event._id}`}
                          className="block hover:opacity-80 transition-opacity"
                        >
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateShort(event.date)}
                            {event.date.includes("-") && event.date.length > 7 && (
                              <span className="text-muted-foreground/70">
                                {", "}
                                {new Date(event.date).getFullYear()}
                              </span>
                            )}
                          </p>
                          {event.userRsvpd && (
                            <Badge className="mt-2 bg-primary text-primary-foreground text-[10px]">
                              RSVPD
                            </Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                to="/events"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                View all events
              </Link>
            </CardContent>
          </Card>

          {/* Academic Calendar */}
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheckIcon className="size-5 text-primary" weight="fill" />
                Academic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {academicCalendar.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No dates scheduled</p>
              ) : (
                <ul className="space-y-2 max-h-[280px] overflow-y-auto">
                  {academicCalendar.map((entry, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">{formatDate(entry.date)}:</span>
                      <span>{entry.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Recent Quiz Scores with Bar Chart - Student only */}
          {role === "STUDENT" && "recentQuizScores" in data && data.recentQuizScores && data.recentQuizScores.length > 0 && (
            <Card className="rounded-xl overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ExamIcon className="size-5 text-primary" weight="fill" />
                  Recent Quiz Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const scores = data.recentQuizScores
                  const totalCorrect = scores.reduce((s, q) => s + q.score, 0)
                  const totalQuestions = scores.reduce((s, q) => s + q.totalQuestions, 0)
                  const accuracyRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
                  return (
                    <>
                      <p className="text-sm font-medium text-muted-foreground mb-4">
                        Accuracy Rate: {accuracyRate}%
                      </p>
                      <div className="flex items-end gap-4 h-24">
                        {scores.map((q) => {
                          const pct = q.totalQuestions > 0 ? (q.score / q.totalQuestions) * 100 : 0
                          return (
                            <div key={q._id} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full max-w-[48px] bg-primary rounded-t transition-all"
                                style={{ height: `${Math.max(pct, 5)}%`, minHeight: "8px" }}
                              />
                              <span className="text-[10px] text-muted-foreground truncate max-w-full" title={q.title}>
                                {q.title}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <Link
                        to="/quizzes"
                        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                      >
                        View all quizzes
                      </Link>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Announcements - Pinned banner + list */}
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MegaphoneIcon className="size-5 text-primary" weight="fill" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No announcements</p>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto">
                  {[...announcements]
                    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                    .map((a) =>
                      a.pinned ? (
                        <div
                          key={a.id}
                          className="flex gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground"
                        >
                          <PushPinIcon className="size-4 shrink-0 mt-0.5" weight="fill" />
                          <div>
                            <p className="font-medium text-sm">{a.title}</p>
                            <p className="text-xs opacity-90 mt-0.5 line-clamp-2">{a.body}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={a.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                          <p className="font-medium text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.body}</p>
                        </div>
                      )
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Links - Icon grid */}
          {"quickLinks" in data && data.quickLinks && data.quickLinks.length > 0 && (
            <Card className="rounded-xl overflow-hidden shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <QuickLinksGrid quickLinks={data.quickLinks} />
              </CardContent>
            </Card>
          )}

          {/* Trending Topics + Study Tip */}
          <Card className="rounded-xl overflow-hidden shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendUpIcon className="size-5 text-primary" weight="fill" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {"trendingTopics" in data && data.trendingTopics && data.trendingTopics.length > 0 ? (
                <ul className="space-y-2">
                  {data.trendingTopics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <TrendUpIcon className="size-4 shrink-0 mt-0.5 text-primary" weight="fill" />
                      <span>
                        {t.title} <span className="text-primary font-medium">#{t.tag}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No trending topics</p>
              )}

              {/* Study Tip - embedded teal card */}
              {"tips" in data && data.tips && data.tips.length > 0 && (
                <div className="rounded-lg bg-primary px-4 py-3 text-primary-foreground mt-4">
                  <p className="text-xs font-medium flex items-center gap-2 mb-1">
                    <LightbulbIcon className="size-4" weight="fill" />
                    Study Tip
                  </p>
                  <p className="text-sm">{data.tips[0]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
