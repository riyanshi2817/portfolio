import { useState } from "react"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCreateQuiz } from "@/hooks/use-quiz"
import { PlusIcon, TrashIcon } from "@phosphor-icons/react"

type QuestionDraft = {
  text: string
  options: string[]
  correctIndex: number
  timeLimit: number
}

const MIN_OPTIONS = 2
const MAX_OPTIONS = 6
const MIN_QUESTIONS = 1
const TITLE_MIN = 3
const TITLE_MAX = 200
const TIME_MIN = 5
const TIME_MAX = 600

type CreateQuizFormProps = {
  groupId: string
  onSuccess?: (quizId: string) => void
  onCancel?: () => void
}

const initialQuestion: QuestionDraft = {
  text: "",
  options: ["", ""],
  correctIndex: 0,
  timeLimit: 30,
}

export function CreateQuizForm({
  groupId,
  onSuccess,
  onCancel,
}: CreateQuizFormProps) {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<QuestionDraft[]>([{ ...initialQuestion }])

  const createMutation = useCreateQuiz()

  const addQuestion = () => {
    setQuestions((q) => [...q, { ...initialQuestion }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length <= MIN_QUESTIONS) return
    setQuestions((q) => q.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, updates: Partial<QuestionDraft>) => {
    setQuestions((q) =>
      q.map((item, i) => (i === index ? { ...item, ...updates } : item))
    )
  }

  const addOption = (qIndex: number) => {
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIndex && item.options.length < MAX_OPTIONS
          ? { ...item, options: [...item.options, ""] }
          : item
      )
    )
  }

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((q) =>
      q.map((item, i) => {
        if (i !== qIndex) return item
        if (item.options.length <= MIN_OPTIONS) return item
        const newOpts = item.options.filter((_, j) => j !== oIndex)
        const newCorrect = Math.min(
          item.correctIndex,
          Math.max(0, newOpts.length - 1)
        )
        return { ...item, options: newOpts, correctIndex: newCorrect }
      })
    )
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((q) =>
      q.map((item, i) =>
        i === qIndex
          ? {
              ...item,
              options: item.options.map((o, j) =>
                j === oIndex ? value : o
              ),
            }
          : item
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()

    const trimmedTitle = title.trim()
    if (trimmedTitle.length < TITLE_MIN || trimmedTitle.length > TITLE_MAX) {
      toast.error(`Title must be ${TITLE_MIN}-${TITLE_MAX} characters`)
      return
    }

    try {
      const questionsPayload = questions.map((q) => {
        const opts = q.options.filter((o) => o.trim().length > 0)
        if (opts.length < MIN_OPTIONS) {
          throw new Error("Each question needs at least 2 options")
        }
        if (q.text.trim().length === 0) {
          throw new Error("Question text is required")
        }
        const timeLimit = Math.max(TIME_MIN, Math.min(TIME_MAX, q.timeLimit))
        const correctIndex = Math.max(0, Math.min(q.correctIndex, opts.length - 1))
        return {
          text: q.text.trim(),
          options: opts,
          correctIndex,
          timeLimit,
        }
      })

      if (questionsPayload.length < MIN_QUESTIONS) {
        toast.error("At least one question is required")
        return
      }

      const payload = {
        title: trimmedTitle,
        groupId,
        questions: questionsPayload,
      }

      createMutation.mutate(payload, {
        onSuccess: (data) => {
          toast.success("Quiz created successfully")
          setTitle("")
          setQuestions([{ ...initialQuestion }])
          onSuccess?.(data.quiz._id)
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to create quiz")
        },
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid quiz data")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
        <CardDescription>
          Add a title and questions. Each question needs 2-6 options and a correct answer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Quiz title (3-200 characters)"
                required
                minLength={TITLE_MIN}
                maxLength={TITLE_MAX}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background"
              />
            </Field>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="rounded-md border border-border p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Question {qIndex + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeQuestion(qIndex)}
                    disabled={questions.length <= MIN_QUESTIONS}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
                <Field>
                  <FieldLabel>Question text</FieldLabel>
                  <Input
                    placeholder="Enter question"
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                    className="bg-background"
                  />
                </Field>
                <Field>
                  <FieldLabel>Options (select correct one)</FieldLabel>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex gap-2 items-center">
                        <input
                          type="radio"
                          name={`q${qIndex}-correct`}
                          checked={q.correctIndex === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, { correctIndex: oIndex })
                          }
                          className="size-4"
                        />
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={opt}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, e.target.value)
                          }
                          className="bg-background flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeOption(qIndex, oIndex)}
                          disabled={q.options.length <= MIN_OPTIONS}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {q.options.length < MAX_OPTIONS && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => addOption(qIndex)}
                      >
                        <PlusIcon className="size-4" /> Add option
                      </Button>
                    )}
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Time limit (seconds)</FieldLabel>
                  <Input
                    type="number"
                    min={TIME_MIN}
                    max={TIME_MAX}
                    value={q.timeLimit}
                    onChange={(e) =>
                      updateQuestion(qIndex, {
                        timeLimit: Number(e.target.value) || TIME_MIN,
                      })
                    }
                    className="bg-background w-24"
                  />
                </Field>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuestion}
            >
              <PlusIcon className="size-4" /> Add question
            </Button>

            {createMutation.error && (
              <FieldError className="text-destructive">
                {createMutation.error.message}
              </FieldError>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Quiz"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
