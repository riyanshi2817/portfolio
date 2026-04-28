import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuiz, useStartQuiz } from "@/hooks/use-quiz"
import { useAuthMe } from "@/hooks/use-auth"
import {
  ListChecksIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type QuizDetailProps = {
  quizId: string
  groupId: string
  onViewResults?: (quizId: string) => void
  className?: string
}

function formatDate(iso: string | undefined) {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  catch {
    return iso
  }
}

function StatusBadge({ status }: { status: "CREATED" | "RUNNING" | "ENDED" }) {
  const config = {
    CREATED: {
      icon: ClockIcon,
      className: "bg-muted text-muted-foreground border-border",
    },
    RUNNING: {
      icon: PlayIcon,
      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
    ENDED: {
      icon: CheckCircleIcon,
      className: "bg-slate-400/15 text-slate-600 dark:text-slate-400 border-slate-400/30",
    },
  } as const
  const { icon: Icon, className } = config[status]
  return (
    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium", className)}>
      <Icon className="size-3.5" weight="fill" />
      {status}
    </Badge>
  )
}

export function QuizDetail({
  quizId,
  groupId: _groupId,
  onViewResults,
  className,
}: QuizDetailProps) {
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const { data, isLoading, error } = useQuiz(quizId)
  const startMutation = useStartQuiz()

  const quiz = data?.quiz
  const currentUserId = authData?.user?._id ?? authData?.user?.id
  const isCreator =
    quiz?.createdBy &&
    currentUserId &&
    (String(quiz.createdBy._id) === String(currentUserId) ||
      (quiz.createdBy as { id?: string }).id === String(currentUserId))
  const isFacultyOrAdmin =
    authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"
  const canStart = quiz?.status === "CREATED" && (isCreator || isFacultyOrAdmin)

  const handleStart = () => {
    if (!quizId) return
    startMutation.mutate(quizId, {
      onSuccess: () => {
        toast.success("Quiz started! Participants can join now.")
        // Stay on page so the socket overlay shows the Join Quiz button
        // (quiz:announced will trigger the join window)
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to start quiz")
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
        <ListChecksIcon className="size-12 animate-pulse opacity-50" weight="duotone" />
        <p className="text-sm">Loading quiz...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-destructive">
        <p className="text-sm font-medium">
          {error instanceof Error ? error.message : "Failed to load quiz"}
        </p>
      </div>
    )
  }

  if (!quiz) {
    return null
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
            <ListChecksIcon className="size-8 text-primary" weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={quiz.status} />
              <span className="text-muted-foreground text-sm">
                {quiz.questions?.length ?? 0} questions
              </span>
              {quiz.participantCount != null && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground text-sm">
                    {quiz.participantCount} participants
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="size-4 text-primary" weight="duotone" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ClockIcon className="size-5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Started</p>
                <p className="text-sm font-medium">{formatDate(quiz.startedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <CheckCircleIcon className="size-5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Ended</p>
                <p className="text-sm font-medium">{formatDate(quiz.endedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {canStart && (
            <Button
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="gap-2"
            >
              <PlayIcon className="size-4" weight="fill" />
              {startMutation.isPending ? "Starting..." : "Start Quiz"}
            </Button>
          )}
          {quiz.status === "RUNNING" && (
            <Button onClick={() => navigate(`/quizzes/${quizId}/play`)} className="gap-2">
              <PlayIcon className="size-4" weight="fill" />
              Join Quiz
            </Button>
          )}
          {quiz.status === "ENDED" && (
            <Button
              variant="outline"
              onClick={() =>
                onViewResults
                  ? onViewResults(quizId)
                  : navigate(`/quizzes/${quizId}/results`)
              }
              className="gap-2"
            >
              <ChartBarIcon className="size-4" weight="duotone" />
              View Results
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
