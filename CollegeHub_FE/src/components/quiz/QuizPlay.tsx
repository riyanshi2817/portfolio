import { useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useQuizSocket } from "@/hooks/use-quiz-socket"
import type { QuizAnnounced, QuizPhase } from "@/hooks/use-quiz-socket"
import { getSocket } from "@/lib/socket"
import { cn } from "@/lib/utils"

type QuizPlayProps = {
  groupId: string
  quizId: string
  onResults?: (quizId: string) => void
  isCreator?: boolean
  /** Pass from parent when overlay mounts after quiz:announced (avoids stale idle state) */
  initialAnnounced?: QuizAnnounced | null
  /** Pass from parent when overlay mounts after quiz:announced */
  initialPhase?: QuizPhase | null
  className?: string
}

export function QuizPlay({
  groupId,
  quizId,
  onResults,
  isCreator,
  initialAnnounced,
  initialPhase,
  className,
}: QuizPlayProps) {
  const navigate = useNavigate()
  const socket = useQuizSocket({ groupId, enabled: !!groupId })

  // Use parent's state when we mount late (overlay) and missed quiz:announced; otherwise use our own
  const phase =
    socket.phase === "idle" && initialPhase && initialPhase !== "idle"
      ? initialPhase
      : socket.phase
  const announced =
    socket.announced == null && initialAnnounced != null
      ? initialAnnounced
      : socket.announced
  const {
    participants,
    participantCount,
    currentQuestion,
    questionTimeLeft,
    lastResult,
    scores,
    leaderboard,
    error,
    joined,
  } = socket

  // Use effective announced (includes initialAnnounced) so Join/Lock/Answer work when overlay mounts late
  const quizIdToEmit = announced?.quizId ?? quizId
  const handleJoin = () => {
    if (quizIdToEmit) getSocket().emit("quiz:join", { quizId: quizIdToEmit })
  }
  const handleLock = () => {
    if (quizIdToEmit) getSocket().emit("quiz:lock", { quizId: quizIdToEmit })
  }
  const handleSubmitAnswer = (selectedIndex: number) => {
    if (quizIdToEmit && currentQuestion) {
      getSocket().emit("quiz:answer", {
        quizId: quizIdToEmit,
        questionIndex: currentQuestion.questionIndex,
        selectedIndex,
      })
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (phase === "ended" && leaderboard.length > 0) {
      if (onResults) {
        onResults(announced?.quizId ?? quizId)
      } else {
        navigate(`/quizzes/${announced?.quizId ?? quizId}/results`)
      }
    }
  }, [phase, leaderboard, announced, quizId, onResults, navigate])

  if (phase === "idle") {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground p-4",
          className
        )}
      >
        <p className="text-sm font-medium">Waiting for a quiz to start...</p>
        <p className="text-xs text-center max-w-sm">
          Make sure you have the correct group selected in the sidebar. When the
          creator starts a quiz, a join button will appear here.
        </p>
        {error && (
          <p className="text-xs text-destructive mt-2">{error}</p>
        )}
      </div>
    )
  }

  if (phase === "lobby" && announced) {
    return (
      <div className={cn("flex flex-1 flex-col items-center justify-center gap-4 p-4", className)}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{announced.title}</CardTitle>
            <p className="text-muted-foreground text-sm">
              {announced.questionCount} questions · {participantCount} joined
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {joined ? (
              <>
                <p className="text-sm text-primary font-medium">You joined! Waiting for quiz to start...</p>
                {participants.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium mb-2">Participants ({participantCount})</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {participants.map((p) => (
                        <li key={p.userId}>{p.email ?? "User"}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {isCreator && (
                  <Button onClick={handleLock}>
                    Lock & Start Quiz
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleJoin}>
                Join Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phase === "question" && currentQuestion) {
    const timeLimit = currentQuestion.timeLimitSeconds
    const progressPercent = timeLimit > 0 ? (questionTimeLeft / timeLimit) * 100 : 0
    return (
      <div className={cn("flex flex-1 flex-col gap-4 p-4", className)}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion.questionIndex + 1} of {currentQuestion.totalQuestions}
            </span>
            <span className={cn(
              "text-sm font-medium tabular-nums",
              questionTimeLeft <= 5 && "text-destructive"
            )}>
              {questionTimeLeft}s
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentQuestion.options.map((opt, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start h-auto py-3"
                onClick={() => handleSubmitAnswer(i)}
              >
                {opt}
              </Button>
            ))}
          </CardContent>
        </Card>
        {scores.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Live scores: {scores.map((s) => `${s.score} pts`).join(", ")}
          </div>
        )}
      </div>
    )
  }

  if (phase === "result" && lastResult) {
    return (
      <div className={cn("flex flex-1 flex-col gap-4 p-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result</CardTitle>
            <p className="text-muted-foreground text-sm">
              Correct answer: Option {lastResult.correctIndex + 1}
            </p>
            <p className="text-sm">
              {lastResult.correctCount} got it right
            </p>
          </CardHeader>
        </Card>
        {scores.length > 0 && (
          <div className="text-sm">
            <p className="font-medium mb-1">Scores</p>
            <div className="space-y-1">
              {scores.map((s) => (
                <div key={s.userId} className="flex justify-between text-muted-foreground">
                  <span>User</span>
                  <span>{s.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-muted-foreground text-sm">Next question coming...</p>
      </div>
    )
  }

  if (phase === "ended" && leaderboard.length > 0) {
    return (
      <div className={cn("flex flex-1 flex-col gap-4 p-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Ended</CardTitle>
            <p className="text-muted-foreground text-sm">Final leaderboard</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId._id}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <div>
                    <span className="font-medium">#{entry.rank}</span>
                    <span className="ml-2 text-muted-foreground">
                      {entry.userId.email ?? "User"}
                    </span>
                  </div>
                  <span>{entry.score} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={() =>
            onResults
              ? onResults(announced?.quizId ?? quizId)
              : navigate(`/quizzes/${announced?.quizId ?? quizId}/results`)
          }
        >
          View Full Results
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-1 items-center justify-center text-muted-foreground", className)}>
      <p className="text-sm">Loading...</p>
    </div>
  )
}
