import { useState } from "react"
import { toast } from "sonner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCreateStudyPlan } from "@/hooks/use-study-plan"

function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

type StudyPlanFormProps = {
  onSuccess?: (planId: string) => void
  className?: string
}

export function StudyPlanForm({ onSuccess, className }: StudyPlanFormProps) {
  const [subjectsInput, setSubjectsInput] = useState("")
  const [examDate, setExamDate] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [goals, setGoals] = useState("")

  const createMutation = useCreateStudyPlan()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()

    const subjects = parseCommaList(subjectsInput)
    if (subjects.length === 0) {
      toast.error("At least one subject is required")
      return
    }

    createMutation.mutate(
      {
        subjects,
        examDate: examDate.trim() || undefined,
        hoursPerDay: hoursPerDay >= 1 ? hoursPerDay : undefined,
        goals: goals.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Study plan generated successfully")
          setSubjectsInput("")
          setExamDate("")
          setHoursPerDay(4)
          setGoals("")
          onSuccess?.(data.studyPlan._id)
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to generate study plan")
        },
      }
    )
  }

  return (
    <Card className={cn("w-full max-w-full border-l-4 border-l-primary overflow-hidden pt-0!", className)}>
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
        <CardTitle className="text-primary">Generate Study Plan</CardTitle>
        <CardDescription>
          Enter subjects to create a personalised weekly study plan. AI will generate a schedule with daily tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="subjects">Subjects</FieldLabel>
              <Input
                id="subjects"
                placeholder="e.g. Math, Physics, Chemistry (comma-separated)"
                required
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="examDate">Exam Date (optional)</FieldLabel>
              <Input
                id="examDate"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="hoursPerDay">Hours per day (optional)</FieldLabel>
              <Input
                id="hoursPerDay"
                type="number"
                min={1}
                max={12}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value) || 4)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="goals">Goals (optional)</FieldLabel>
              <Textarea
                id="goals"
                placeholder="e.g. Score 90% in finals, Focus on weak areas"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="bg-background min-h-20"
              />
            </Field>
            {createMutation.error && (
              <FieldError className="text-destructive">
                {createMutation.error.message}
              </FieldError>
            )}
            <Field>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Generating plan..." : "Generate Study Plan"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
