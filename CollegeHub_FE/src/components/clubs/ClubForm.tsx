import { useState, useRef, useEffect } from "react"
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
import { useCreateClub, useUpdateClub } from "@/hooks/use-clubs"
import type { Club, ClubCategory } from "@/hooks/use-clubs"
import { TreeStructureIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const MAX_LOGO_SIZE = 5 * 1024 * 1024 // 5 MB
const LOGO_ACCEPT = "image/jpeg,image/png,image/webp"

const CATEGORIES: { value: ClubCategory; label: string }[] = [
  { value: "TECH", label: "Tech" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "SPORTS", label: "Sports" },
  { value: "SOCIAL", label: "Social" },
  { value: "OTHER", label: "Other" },
]

type ClubFormProps = {
  club?: Club | null
  onSuccess?: (clubId: string) => void
  onCancel?: () => void
  className?: string
}

export function ClubForm({ club, onSuccess, onCancel, className }: ClubFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!club

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<ClubCategory>("OTHER")
  const [tagsInput, setTagsInput] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const createMutation = useCreateClub()
  const updateMutation = useUpdateClub(club?._id)

  useEffect(() => {
    if (club) {
      setName(club.name)
      setDescription(club.description ?? "")
      setCategory(club.category ?? "OTHER")
      setTagsInput(club.tags?.join(", ") ?? "")
      setLogoPreview(club.logo ?? null)
    }
  }, [club])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) {
      setLogoFile(null)
      setLogoPreview(club?.logo ?? null)
      return
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(selected.type)) {
      toast.error("Logo must be JPG, PNG, or WebP")
      setLogoFile(null)
      return
    }
    if (selected.size > MAX_LOGO_SIZE) {
      toast.error("Logo must be under 5 MB")
      setLogoFile(null)
      return
    }
    setLogoFile(selected)
    setLogoPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()
    updateMutation.reset()

    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Club name is required")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (isEdit && club) {
      updateMutation.mutate(
        {
          name: trimmedName,
          description: description.trim() || undefined,
          category,
          tags: tags.length ? tags : undefined,
          logo: logoFile ?? undefined,
        },
        {
          onSuccess: () => {
            toast.success("Club updated successfully")
            onSuccess?.(club._id)
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to update club")
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          name: trimmedName,
          description: description.trim() || undefined,
          category,
          tags: tags.length ? tags : undefined,
          logo: logoFile ?? undefined,
        },
        {
          onSuccess: (data) => {
            toast.success("Club created successfully")
            setName("")
            setDescription("")
            setCategory("OTHER")
            setTagsInput("")
            setLogoFile(null)
            setLogoPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
            onSuccess?.(data.club._id)
          },
          onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to create club")
          },
        }
      )
    }
  }

  const mutation = isEdit ? updateMutation : createMutation

  return (
    <Card className={cn("w-full max-w-full border-l-4 border-l-primary overflow-y-auto pt-0!", className)}>
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
        <CardTitle className="text-primary flex items-center gap-2">
          <TreeStructureIcon className="size-5" weight="duotone" />
          {isEdit ? "Edit Club" : "Create Club"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update club details. Logo is optional."
            : "Fill in the details to create a new club. Logo is optional."}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="club-name">Name</FieldLabel>
              <Input
                id="club-name"
                placeholder="e.g. Coding Club"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="club-description">Description (optional)</FieldLabel>
              <Textarea
                id="club-description"
                placeholder="Brief description of the club"
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background min-h-20"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="club-category">Category</FieldLabel>
              <Select value={category} onValueChange={(v) => setCategory(v as ClubCategory)}>
                <SelectTrigger id="club-category" className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="club-tags">Tags (optional, comma-separated)</FieldLabel>
              <Input
                id="club-tags"
                placeholder="e.g. coding, webdev, hackathon"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="club-logo">Logo (optional, JPG/PNG/WebP, max 5 MB)</FieldLabel>
              <div className="flex flex-col gap-2">
                {(logoPreview || logoFile) && (
                  <div className="flex items-center gap-2">
                    <img
                      src={logoPreview ?? undefined}
                      alt="Logo preview"
                      className="size-16 rounded-md object-cover border border-border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setLogoFile(null)
                        setLogoPreview(club?.logo ?? null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <Input
                  id="club-logo"
                  ref={fileInputRef}
                  type="file"
                  accept={LOGO_ACCEPT}
                  onChange={handleLogoChange}
                  className="bg-background"
                />
              </div>
            </Field>
            {(createMutation.error || updateMutation.error) && (
              <FieldError className="text-destructive">
                {(createMutation.error || updateMutation.error) instanceof Error
                  ? (createMutation.error || updateMutation.error)!.message
                  : "Something went wrong"}
              </FieldError>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Club"
                    : "Create Club"}
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
