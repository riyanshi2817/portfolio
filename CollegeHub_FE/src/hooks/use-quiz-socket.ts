import { useEffect, useState, useCallback, useRef } from "react"
import { getSocket } from "@/lib/socket"

export type QuizAnnounced = {
  quizId: string
  title: string
  groupId: string
  questionCount: number
}

export type QuizParticipantJoined = {
  quizId: string
  userId: string | { _id: string; email?: string; role?: string }
  participantCount: number
}

export type QuizLockedPayload = {
  quizId: string
  participantCount: number
  participants: Array<{ userId: { _id: string; email?: string; role?: string } }>
}

export type QuizQuestionPayload = {
  quizId: string
  questionIndex: number
  totalQuestions: number
  text: string
  options: string[]
  timeLimitSeconds: number
}

export type QuizQuestionResult = {
  quizId: string
  questionIndex: number
  correctIndex: number
  optionCounts: number[]
  correctCount: number
}

export type QuizScoreUpdate = {
  quizId: string
  userId: string
  score: number
  totalResponseTimeMs: number
}

export type QuizLeaderboardEntry = {
  rank: number
  userId: { _id: string; email?: string; role?: string }
  score: number
  totalResponseTimeMs: number
}

export type QuizEndedPayload = {
  quizId: string
  leaderboard: QuizLeaderboardEntry[]
}

export type QuizPhase =
  | "idle"
  | "lobby"
  | "question"
  | "result"
  | "ended"

export type QuizParticipant = {
  userId: string
  email?: string
}

type UseQuizSocketOptions = {
  groupId: string | null
  enabled: boolean
}

function toParticipant(
  raw: string | { _id: string; email?: string; role?: string }
): QuizParticipant {
  if (typeof raw === "string") return { userId: raw }
  return {
    userId: raw._id,
    email: raw.email,
  }
}

export function useQuizSocket({
  groupId,
  enabled,
}: UseQuizSocketOptions) {
  const [phase, setPhase] = useState<QuizPhase>("idle")
  const [announced, setAnnounced] = useState<QuizAnnounced | null>(null)
  const [participants, setParticipants] = useState<QuizParticipant[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestionPayload | null>(null)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0)
  const [lastResult, setLastResult] = useState<QuizQuestionResult | null>(null)
  const [scores, setScores] = useState<QuizScoreUpdate[]>([])
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  const activeQuizIdRef = useRef<string | null>(null)

  const joinQuiz = useCallback(() => {
    if (!announced) return
    const socket = getSocket()
    socket.emit("quiz:join", { quizId: announced.quizId })
  }, [announced])

  const lockQuiz = useCallback(() => {
    if (!announced) return
    const socket = getSocket()
    socket.emit("quiz:lock", { quizId: announced.quizId })
  }, [announced])

  useEffect(() => {
    if (!groupId || !enabled) return

    const socket = getSocket()
    const groupIdStr = String(groupId)

    const joinGroup = () => socket.emit("joinGroup", { groupId: groupIdStr })
    if (socket.connected) joinGroup()
    socket.on("connect", joinGroup)

    const onQuizAnnounced = (data: QuizAnnounced) => {
      activeQuizIdRef.current = data.quizId
      setPhase("lobby")
      setAnnounced(data)
      setParticipants([])
      setParticipantCount(0)
      setScores([])
      setLeaderboard([])
      setError(null)
      setJoined(false)
    }

    const onQuizJoined = (_data?: { quizId?: string; participantCount?: number }) => {
      setJoined(true)
      if (_data?.participantCount != null) {
        setParticipantCount(_data.participantCount)
      }
    }

    const onQuizParticipantJoined = (data: QuizParticipantJoined) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setParticipantCount(data.participantCount)
      setParticipants((prev) => {
        const userId = typeof data.userId === "string" ? data.userId : data.userId._id
        if (prev.some((p) => p.userId === userId)) return prev
        return [...prev, toParticipant(data.userId)]
      })
    }

    const onQuizLocked = (data: QuizLockedPayload) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setParticipantCount(data.participantCount)
      setParticipants(
        (data.participants ?? []).map((p) => toParticipant(p.userId))
      )
      setPhase("question")
      setCurrentQuestion(null)
      setLastResult(null)
    }

    const onQuizQuestion = (data: QuizQuestionPayload) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setPhase("question")
      setCurrentQuestion(data)
      setQuestionTimeLeft(data.timeLimitSeconds)
      setLastResult(null)
    }

    const onQuizAnswerAck = () => {
      setCurrentQuestion(null)
    }

    const onQuizScoreUpdate = (data: QuizScoreUpdate) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setScores((prev) => {
        const filtered = prev.filter((s) => s.userId !== data.userId)
        return [...filtered, data]
      })
    }

    const onQuizQuestionResult = (data: QuizQuestionResult) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setPhase("result")
      setLastResult(data)
      setCurrentQuestion(null)
    }

    const onQuizEnded = (data: QuizEndedPayload) => {
      if (activeQuizIdRef.current && data.quizId !== activeQuizIdRef.current) return
      setPhase("ended")
      setLeaderboard(data.leaderboard ?? [])
      setCurrentQuestion(null)
      setLastResult(null)
    }

    const onQuizError = (data: { message?: string }) => {
      setError(data.message ?? "Quiz error")
    }

    socket.on("quiz:announced", onQuizAnnounced)
    socket.on("quiz:joined", onQuizJoined)
    socket.on("quiz:participant-joined", onQuizParticipantJoined)
    socket.on("quiz:locked", onQuizLocked)
    socket.on("quiz:question", onQuizQuestion)
    socket.on("quiz:answer-ack", onQuizAnswerAck)
    socket.on("quiz:score-update", onQuizScoreUpdate)
    socket.on("quiz:question-result", onQuizQuestionResult)
    socket.on("quiz:ended", onQuizEnded)
    socket.on("quiz:error", onQuizError)

    return () => {
      socket.off("quiz:announced", onQuizAnnounced)
      socket.off("quiz:joined", onQuizJoined)
      socket.off("quiz:participant-joined", onQuizParticipantJoined)
      socket.off("quiz:locked", onQuizLocked)
      socket.off("quiz:question", onQuizQuestion)
      socket.off("quiz:answer-ack", onQuizAnswerAck)
      socket.off("quiz:score-update", onQuizScoreUpdate)
      socket.off("quiz:question-result", onQuizQuestionResult)
      socket.off("quiz:ended", onQuizEnded)
      socket.off("quiz:error", onQuizError)
      socket.emit("leaveGroup", { groupId: groupIdStr })
      socket.off("connect", joinGroup)
    }
  }, [groupId, enabled])

  useEffect(() => {
    if (phase !== "question" || questionTimeLeft <= 0) return
    const t = setInterval(() => setQuestionTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [phase, questionTimeLeft])

  const submitAnswer = useCallback(
    (selectedIndex: number) => {
      if (!announced || !currentQuestion) return
      const socket = getSocket()
      socket.emit("quiz:answer", {
        quizId: announced.quizId,
        questionIndex: currentQuestion.questionIndex,
        selectedIndex,
      })
    },
    [announced, currentQuestion]
  )

  return {
    phase,
    announced,
    participants,
    participantCount,
    currentQuestion,
    questionTimeLeft,
    lastResult,
    scores,
    leaderboard,
    error,
    joined,
    joinQuiz,
    lockQuiz,
    submitAnswer,
  }
}
