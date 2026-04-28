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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCreateRoadmap } from "@/hooks/use-roadmap"

const LEVELS = ["beginner", "intermediate", "advanced"] as const

type RoadmapFormProps = {
  onSuccess?: (roadmapId: string) => void
  className?: string
}

export function RoadmapForm({ onSuccess, className }: RoadmapFormProps) {
  const [skill, setSkill] = useState("")
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [goal, setGoal] = useState("")

  const createMutation = useCreateRoadmap()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()

    const trimmedSkill = skill.trim()
    if (!trimmedSkill) {
      toast.error("Skill is required")
      return
    }

    createMutation.mutate(
      {
        skill: trimmedSkill,
        level,
        goal: goal.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Roadmap generated successfully")
          setSkill("")
          setGoal("")
          onSuccess?.(data.roadmap._id)
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to generate roadmap")
        },
      }
    )
  }

  return (
    <Card className={cn("w-full max-w-full border-l-4 border-l-primary overflow-hidden pt-0!", className)}>
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
        <CardTitle className="text-primary">Generate Learning Roadmap</CardTitle>
        <CardDescription>
          Enter a skill to create a project-based learning roadmap. AI will generate phases, resources, and projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="skill">Skill</FieldLabel>
              <Input
                id="skill"
                placeholder="e.g. React, Machine Learning"
                required
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="level">Level</FieldLabel>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as "beginner" | "intermediate" | "advanced")}
              >
                <SelectTrigger id="level" className="bg-background">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="goal">Goal (optional)</FieldLabel>
              <Textarea
                id="goal"
                placeholder="e.g. Get a job as frontend dev, Build full-stack apps"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
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
                {createMutation.isPending ? "Generating roadmap..." : "Generate Roadmap"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
