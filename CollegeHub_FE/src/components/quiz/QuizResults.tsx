import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuizResults } from "@/hooks/use-quiz"
import { TrophyIcon, MedalIcon, ClockIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type QuizResultsProps = {
  quizId: string
  className?: string
}

function formatResponseTime(ms: number): string {
  const totalSeconds = ms / 1000
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.floor(totalSeconds % 60)
  if (mins < 60) return `${mins}m ${secs}s`
  const hours = Math.floor(mins / 60)
  const remainMins = mins % 60
  return `${hours}h ${remainMins}m ${secs}s`
}

export function QuizResults({ quizId, className }: QuizResultsProps) {
  const { data, isLoading, error } = useQuizResults(quizId)

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground",
          className
        )}
      >
        <TrophyIcon className="size-12 animate-pulse opacity-50" weight="duotone" />
        <p className="text-sm">Loading results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-2 text-destructive",
          className
        )}
      >
        <p className="text-sm font-medium">
          {error instanceof Error ? error.message : "Failed to load results"}
        </p>
        <p className="text-xs text-muted-foreground">
          Results are only available after the quiz has ended.
        </p>
      </div>
    )
  }

  const { quiz, leaderboard } = data ?? {}

  if (!quiz || !leaderboard) {
    return null
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
    if (rank === 2) return "bg-slate-400/15 text-slate-600 dark:text-slate-300 border-slate-400/30"
    if (rank === 3) return "bg-amber-700/15 text-amber-700 dark:text-amber-600 border-amber-700/30"
    return "bg-muted text-muted-foreground border-border"
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <TrophyIcon className="size-7 text-primary" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Quiz Results
            </p>
          </div>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MedalIcon className="size-5 text-primary" weight="duotone" />
              Leaderboard
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Sorted by score, then by response time
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId._id}
                  className={cn(
                    "flex items-center justify-between gap-4 px-4 py-4 transition-colors",
                    entry.rank <= 3 && "bg-muted/20"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border font-bold text-sm",
                        getRankStyle(entry.rank)
                      )}
                    >
                      #{entry.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {entry.userId.email ?? "Unknown"}
                      </p>
                      {entry.userId.role && (
                        <p className="text-xs text-muted-foreground">
                          {entry.userId.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="secondary" className="font-semibold">
                      {entry.score} pts
                    </Badge>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ClockIcon className="size-4 shrink-0" />
                      {formatResponseTime(entry.totalResponseTimeMs)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
