import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router"
import { getSocket } from "@/lib/socket"
import { GroupsSidebar } from "@/components/groups/GroupsSidebar"
import { QuizList } from "@/components/quiz/QuizList"
import { CreateQuizForm } from "@/components/quiz/CreateQuizForm"
import { QuizDetail } from "@/components/quiz/QuizDetail"
import { QuizPlay } from "@/components/quiz/QuizPlay"
import { QuizResults } from "@/components/quiz/QuizResults"
import { ListChecksIcon, PlayIcon } from "@phosphor-icons/react"
import { useQuizSocket } from "@/hooks/use-quiz-socket"
import { useQuiz, useQuizzesByGroup } from "@/hooks/use-quiz"
import { useAuthMe } from "@/hooks/use-auth"
import type { Group } from "@/hooks/use-groups"
import type { QuizSummary } from "@/hooks/use-quiz"

type ViewMode = "list" | "create" | "detail" | "play" | "results"

function toSocketGroupId(v: unknown): string | null {
  if (!v) return null
  if (typeof v === "string") return v
  if (typeof v === "object" && v !== null && "_id" in v) return String((v as { _id: unknown })._id)
  return String(v)
}

type ActiveQuizzesViewProps = {
  quizzes: import("@/hooks/use-quiz").QuizSummary[]
  onSelectQuiz: (quiz: import("@/hooks/use-quiz").QuizSummary) => void
  isLoading: boolean
  isFaculty?: boolean
}

function ActiveQuizzesView({ quizzes, onSelectQuiz, isLoading, isFaculty }: ActiveQuizzesViewProps) {
  const activeQuizzes = quizzes.filter((q) => q.status === "RUNNING")

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-muted-foreground">
        <ListChecksIcon className="size-12 animate-pulse opacity-50" weight="duotone" />
        <p className="text-sm">Loading quizzes...</p>
      </div>
    )
  }

  if (activeQuizzes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <ListChecksIcon
          className="size-12 text-muted-foreground opacity-50"
          weight="duotone"
        />
        <p className="text-sm font-medium text-muted-foreground">
          No active quizzes are available
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          {isFaculty
            ? "Create a quiz from the sidebar and start it to see it here"
            : "No active quizzes at the moment. Check back later."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="w-full max-w-full space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Active Quizzes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quizzes you can join right now
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeQuizzes.map((quiz) => (
            <button
              key={quiz._id}
              type="button"
              onClick={() => onSelectQuiz(quiz)}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                <PlayIcon className="size-6 text-emerald-600 dark:text-emerald-400" weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{quiz.title}</p>
                <p className="text-xs text-muted-foreground">
                  {quiz.questionCount} Q · {quiz.participantCount ?? 0} joined
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function QuizzesPage() {
  const { quizId: paramQuizId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const groupId = selectedGroup?._id ?? selectedGroup?.socketRoom ?? null

  const { data: quizzesData } = useQuizzesByGroup(groupId)
  const { data: quizDataForGroup } = useQuiz(selectedQuizId)
  const rawQuizGroupId = quizDataForGroup?.quiz?.groupId ?? null

  const effectiveGroupId = groupId ?? toSocketGroupId(rawQuizGroupId)
  // Docs: "socketRoom from GET /api/groups/my == groupId used in events"
  const socketRoomId =
    selectedGroup?.socketRoom ?? selectedGroup?._id ?? toSocketGroupId(rawQuizGroupId) ?? null

  const socketGroupId = socketRoomId ?? effectiveGroupId

  const {
    phase: socketPhase,
    announced,
  } = useQuizSocket({
    groupId: socketGroupId,
    enabled: !!socketGroupId,
  })

  const quizIdForCreator =
    announced?.quizId ?? (viewMode === "play" || viewMode === "results" ? selectedQuizId : null)
  const { data: quizDataForCreator } = useQuiz(quizIdForCreator)
  const quiz = quizDataForCreator?.quiz ?? quizDataForGroup?.quiz
  const { data: authData } = useAuthMe()
  const currentUserId = authData?.user?._id ?? authData?.user?.id
  const isCreator =
    quiz?.createdBy &&
    currentUserId &&
    (String(quiz.createdBy._id) === String(currentUserId) ||
      (quiz.createdBy as { id?: string }).id === String(currentUserId))
  const isFaculty = authData?.user?.role === "FACULTY"
  const isFacultyOrAdmin =
    authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"
  const canLockQuiz = isCreator || isFacultyOrAdmin

  useEffect(() => {
    getSocket()
  }, [])

  useEffect(() => {
    if (paramQuizId) {
      setSelectedQuizId(paramQuizId)
      if (location.pathname.includes("/results")) setViewMode("results")
      else if (location.pathname.includes("/play")) setViewMode("play")
      else setViewMode("detail")
    } else {
      setSelectedQuizId(null)
      setViewMode("list")
    }
  }, [paramQuizId, location.pathname])

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group)
    setSelectedQuizId(null)
    setViewMode("list")
    navigate("/quizzes", { replace: true })
  }

  const handleSelectQuiz = (quiz: QuizSummary) => {
    setSelectedQuizId(quiz._id)
    setViewMode("detail")
    navigate(`/quizzes/${quiz._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedQuizId(null)
    setViewMode("create")
    navigate("/quizzes", { replace: true })
  }

  const handleCreateSuccess = (id: string) => {
    setSelectedQuizId(id)
    setViewMode("detail")
    navigate(`/quizzes/${id}`, { replace: true })
  }

  const handleViewResults = (id: string) => {
    setViewMode("results")
    navigate(`/quizzes/${id}/results`, { replace: true })
  }

  const showPlayOverlay =
    socketGroupId &&
    socketPhase !== "idle" &&
    announced &&
    (viewMode === "list" || viewMode === "detail" || viewMode === "create")

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <GroupsSidebar
            selectedGroupId={selectedGroup?._id ?? selectedGroup?.socketRoom ?? null}
            onSelectGroup={handleSelectGroup}
            className="min-h-0 flex-1"
          />
        </div>
        {groupId && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-border">
            <div className="shrink-0 border-b border-border p-2">
              <h2 className="text-sm font-semibold">Quizzes</h2>
            </div>
            <QuizList
              groupId={groupId}
              selectedQuizId={selectedQuizId}
              onSelectQuiz={handleSelectQuiz}
              onCreateNew={handleCreateNew}
              showCreateQuiz={isFaculty}
            />
          </div>
        )}
      </aside>

      <div className="flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden bg-background relative">
        {showPlayOverlay && announced && socketGroupId && (
          <div className="absolute inset-0 z-10 bg-background">
            <QuizPlay
              groupId={socketGroupId}
              quizId={announced.quizId}
              onResults={handleViewResults}
              isCreator={canLockQuiz}
              initialAnnounced={announced}
              initialPhase={socketPhase}
            />
          </div>
        )}

        {!showPlayOverlay && (
          <>
            {!selectedGroup ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
                <ListChecksIcon
                  className="size-12 text-muted-foreground opacity-50"
                  weight="duotone"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Select a group to view and create quizzes
                </p>
              </div>
            ) : viewMode === "create" && groupId && isFaculty ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <CreateQuizForm
                    groupId={groupId}
                    onSuccess={handleCreateSuccess}
                    onCancel={() => {
                      setViewMode("list")
                      navigate("/quizzes", { replace: true })
                    }}
                  />
                </div>
              </div>
            ) : viewMode === "detail" && selectedQuizId && groupId ? (
              <div className="flex flex-1 overflow-y-auto p-4">
                <QuizDetail
                  quizId={selectedQuizId}
                  groupId={groupId}
                  onViewResults={handleViewResults}
                />
              </div>
            ) : viewMode === "results" && selectedQuizId ? (
              <QuizResults quizId={selectedQuizId} />
            ) : viewMode === "play" && selectedQuizId && socketGroupId ? (
              <QuizPlay
                groupId={socketGroupId}
                quizId={selectedQuizId}
                onResults={handleViewResults}
                isCreator={canLockQuiz}
                initialAnnounced={announced?.quizId === selectedQuizId ? announced : undefined}
                initialPhase={announced?.quizId === selectedQuizId ? socketPhase : undefined}
              />
            ) : (
              <ActiveQuizzesView
                quizzes={quizzesData?.quizzes ?? []}
                onSelectQuiz={handleSelectQuiz}
                isLoading={!quizzesData && !!groupId}
                isFaculty={isFaculty}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
