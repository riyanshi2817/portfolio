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
import { useCreateForum } from "@/hooks/use-forums"
import { ChatsCircleIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const MAX_TITLE = 200
const MAX_DESCRIPTION = 2000
const MAX_TOPIC = 100

type ForumFormProps = {
  onSuccess?: (forumId: string) => void
  onCancel?: () => void
  className?: string
}

export function ForumForm({ onSuccess, onCancel, className }: ForumFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [topic, setTopic] = useState("General")
  const [tagsInput, setTagsInput] = useState("")

  const createMutation = useCreateForum()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error("Title is required")
      return
    }
    if (trimmedTitle.length > MAX_TITLE) {
      toast.error(`Title must be at most ${MAX_TITLE} characters`)
      return
    }
    if (description.trim().length > MAX_DESCRIPTION) {
      toast.error(`Description must be at most ${MAX_DESCRIPTION} characters`)
      return
    }
    if (topic.trim().length > MAX_TOPIC) {
      toast.error(`Topic must be at most ${MAX_TOPIC} characters`)
      return
    }

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    createMutation.mutate(
      {
        title: trimmedTitle,
        description: description.trim() || undefined,
        topic: topic.trim() || "General",
        tags: tags.length ? tags : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Forum created")
          setTitle("")
          setDescription("")
          setTopic("General")
          setTagsInput("")
          onSuccess?.(data._id)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to create forum")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChatsCircleIcon className="size-5" weight="duotone" />
            New discussion
          </CardTitle>
          <CardDescription>
            Start a new discussion thread. All authenticated users can participate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best practices for React state management"
                maxLength={MAX_TITLE + 1}
                disabled={createMutation.isPending}
              />
              <FieldError>{createMutation.error?.message}</FieldError>
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/{MAX_TITLE}
              </p>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you'd like to discuss..."
                rows={4}
                maxLength={MAX_DESCRIPTION + 1}
                disabled={createMutation.isPending}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {description.length}/{MAX_DESCRIPTION}
              </p>
            </Field>

            <Field>
              <FieldLabel>Topic</FieldLabel>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="General"
                maxLength={MAX_TOPIC + 1}
                disabled={createMutation.isPending}
              />
            </Field>

            <Field>
              <FieldLabel>Tags</FieldLabel>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, state, redux (comma-separated)"
                disabled={createMutation.isPending}
              />
            </Field>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create forum"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}
