import { ListChecksIcon, PlusIcon, ClockIcon, PlayIcon, CheckCircleIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useQuizzesByGroup } from "@/hooks/use-quiz"
import type { QuizSummary } from "@/hooks/use-quiz"

type QuizListProps = {
  groupId: string | null
  selectedQuizId: string | null
  onSelectQuiz: (quiz: QuizSummary) => void
  onCreateNew: () => void
  showCreateQuiz?: boolean
  className?: string
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  catch {
    return iso
  }
}

function StatusBadge({ status }: { status: QuizSummary["status"] }) {
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
  const { icon: Icon, className } = config[status] ?? config.CREATED
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs font-medium", className)}>
      <Icon className="size-3" weight="fill" />
      {status}
    </Badge>
  )
}

export function QuizList({
  groupId,
  selectedQuizId,
  onSelectQuiz,
  onCreateNew,
  showCreateQuiz = true,
  className,
}: QuizListProps) {
  const { data, isLoading, error } = useQuizzesByGroup(groupId)

  const quizzes = data?.quizzes ?? []

  if (!groupId) {
    return null
  }

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      {showCreateQuiz && (
        <div className="border-b border-border p-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onCreateNew}
          >
            <PlusIcon className="size-4" weight="bold" />
            Create quiz
          </Button>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading quizzes...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load quizzes"}
          </div>
        )}

        {!isLoading && !error && quizzes.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <ListChecksIcon className="size-10 opacity-50" weight="duotone" />
            <p>No quizzes yet</p>
            <p className="text-xs">Create one to get started.</p>
          </div>
        )}

        {!isLoading && quizzes.length > 0 && (
          <ul className="flex flex-col gap-2">
            {quizzes.map((quiz) => {
              const isSelected = selectedQuizId === quiz._id
              return (
                <li key={quiz._id}>
                  <button
                    type="button"
                    onClick={() => onSelectQuiz(quiz)}
                    className={cn(
                      "flex w-full flex-col gap-2 rounded-lg border px-3 py-3 text-left text-sm transition-all",
                      isSelected
                        ? "border-primary/50 bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        isSelected ? "bg-primary/20" : "bg-muted"
                      )}>
                        <ListChecksIcon className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground")} weight="duotone" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className={cn(
                            "truncate font-semibold",
                            isSelected && "text-primary"
                          )}>
                            {quiz.title}
                          </span>
                          <StatusBadge status={quiz.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                          <span>{quiz.questionCount} Q</span>
                          {quiz.participantCount != null && (
                            <>
                              <span aria-hidden>·</span>
                              <span>{quiz.participantCount} joined</span>
                            </>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(quiz.createdAt)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
