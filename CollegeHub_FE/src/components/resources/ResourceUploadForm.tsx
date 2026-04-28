import { useState, useRef } from "react"
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
import { useUploadResource } from "@/hooks/use-resources"
import type { ResourceType } from "@/hooks/use-resources"
import { FileArrowUpIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

type ResourceUploadFormProps = {
  groupId: string
  resourceType: ResourceType
  onSuccess?: () => void
  className?: string
}

export function ResourceUploadForm({
  groupId,
  resourceType,
  onSuccess,
  className,
}: ResourceUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [examYear, setExamYear] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  const uploadMutation = useUploadResource()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) {
      setFile(null)
      return
    }
    if (selected.type !== "application/pdf") {
      toast.error("Only PDF files are allowed")
      setFile(null)
      return
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 2 MB")
      setFile(null)
      return
    }
    setFile(selected)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    uploadMutation.reset()

    if (!file) {
      toast.error("Please select a PDF file")
      return
    }

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error("Title is required")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    uploadMutation.mutate(
      {
        file,
        type: resourceType,
        groupId,
        title: trimmedTitle,
        description: description.trim() || undefined,
        subject: subject.trim() || undefined,
        examYear: resourceType === "PYQ" ? examYear.trim() || undefined : undefined,
        tags: tags.length ? tags : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Resource uploaded successfully")
          setFile(null)
          setTitle("")
          setDescription("")
          setSubject("")
          setExamYear("")
          setTagsInput("")
          if (fileInputRef.current) fileInputRef.current.value = ""
          onSuccess?.()
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Upload failed")
        },
      }
    )
  }

  return (
    <Card className={cn("w-full max-w-full border-l-4 border-l-primary overflow-hidden", className)}>
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-primary flex items-center gap-2">
          <FileArrowUpIcon className="size-5" weight="duotone" />
          Upload {resourceType === "SYLLABUS" ? "Syllabus" : resourceType === "PYQ" ? "PYQ" : "Lecture Note"}
        </CardTitle>
        <CardDescription>
          PDF only, max 2 MB. Select a file and fill in the details.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="resource-file">File (PDF, max 2 MB)</FieldLabel>
              <div className="flex min-w-0 gap-2">
                <Input
                  id="resource-file"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="bg-background min-w-0 shrink-0"
                />
                {file && (
                  <span className="text-xs text-muted-foreground self-center truncate max-w-[180px]">
                    {file.name}
                  </span>
                )}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="resource-title">Title</FieldLabel>
              <Input
                id="resource-title"
                placeholder="e.g. Data Structures Syllabus"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="resource-description">Description (optional)</FieldLabel>
              <Textarea
                id="resource-description"
                placeholder="Brief description of the resource"
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background min-h-16"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="resource-subject">Subject (optional)</FieldLabel>
              <Input
                id="resource-subject"
                placeholder="e.g. Data Structures"
                maxLength={100}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-background"
              />
            </Field>
            {resourceType === "PYQ" && (
              <Field>
                <FieldLabel htmlFor="resource-examYear">Exam Year (optional)</FieldLabel>
                <Input
                  id="resource-examYear"
                  placeholder="e.g. 2024 or 2024-Mid"
                  maxLength={20}
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="bg-background"
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="resource-tags">Tags (optional, comma-separated)</FieldLabel>
              <Input
                id="resource-tags"
                placeholder="e.g. ds, syllabus, midterm"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-background"
              />
            </Field>
            {uploadMutation.error && (
              <FieldError className="text-destructive">
                {(uploadMutation.error as Error).message}
              </FieldError>
            )}
            <Field>
              <Button type="submit" disabled={uploadMutation.isPending || !file}>
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
