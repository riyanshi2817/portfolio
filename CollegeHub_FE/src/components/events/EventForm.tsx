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
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events"
import type { Event, EventType } from "@/hooks/use-events"
import { useMyGroups, useAllGroups } from "@/hooks/use-groups"
import { useClubs } from "@/hooks/use-clubs"
import { useAuthMe } from "@/hooks/use-auth"
import { ImageSquareIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const MAX_POSTER_SIZE = 5 * 1024 * 1024 // 5 MB
const POSTER_ACCEPT = "image/jpeg,image/png,image/webp"

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "COLLEGE", label: "College" },
  { value: "GROUP", label: "Group" },
  { value: "CLUB", label: "Club" },
]

type EventFormProps = {
  event?: Event | null
  onSuccess?: (eventId: string) => void
  onCancel?: () => void
  className?: string
}

export function EventForm({
  event,
  onSuccess,
  onCancel,
  className,
}: EventFormProps) {
  const posterInputRef = useRef<HTMLInputElement>(null)
  const { data: authData } = useAuthMe()
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"

  const [title, setTitle] = useState(event?.title ?? "")
  const [date, setDate] = useState(event?.date?.slice(0, 10) ?? "")
  const [description, setDescription] = useState(event?.description ?? "")
  const [time, setTime] = useState(event?.time ?? "")
  const [venue, setVenue] = useState(event?.venue ?? "")
  const [type, setType] = useState<EventType>(event?.type ?? "COLLEGE")
  const [groupId, setGroupId] = useState(event?.groupId?._id ?? "")
  const [clubId, setClubId] = useState(event?.clubId?._id ?? "")
  const [tagsInput, setTagsInput] = useState(event?.tags?.join(", ") ?? "")
  const [poster, setPoster] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(event?.poster ?? null)

  const createMutation = useCreateEvent()
  const updateMutation = useUpdateEvent(event?._id)

  const { data: myGroupsData } = useMyGroups()
  const { data: allGroupsData } = useAllGroups(isFacultyOrAdmin)
  const { data: clubsData } = useClubs({ limit: 100 })

  const groups = isFacultyOrAdmin ? allGroupsData?.groups ?? [] : myGroupsData?.groups ?? []
  const clubs = clubsData?.clubs ?? []

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPoster(null)
      setPosterPreview(event?.poster ?? null)
      return
    }
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Only JPG, PNG, and WebP images are allowed")
      setPoster(null)
      return
    }
    if (file.size > MAX_POSTER_SIZE) {
      toast.error("Poster must be under 5 MB")
      setPoster(null)
      return
    }
    setPoster(file)
    setPosterPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.reset()
    updateMutation.reset()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error("Title is required")
      return
    }
    if (!date) {
      toast.error("Date is required")
      return
    }
    if (type === "GROUP" && !groupId) {
      toast.error("Please select a group for group events")
      return
    }
    if (type === "CLUB" && !clubId) {
      toast.error("Please select a club for club events")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    if (event) {
      updateMutation.mutate(
        {
          title: trimmedTitle,
          date,
          description: description.trim() || undefined,
          time: time.trim() || undefined,
          venue: venue.trim() || undefined,
          type,
          groupId: type === "GROUP" ? groupId : undefined,
          tags: tags.length ? tags : undefined,
          poster: poster ?? undefined,
        },
        {
          onSuccess: (data) => {
            toast.success("Event updated")
            onSuccess?.(data.event._id)
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed"),
        }
      )
    } else {
      createMutation.mutate(
        {
          title: trimmedTitle,
          date,
          description: description.trim() || undefined,
          time: time.trim() || undefined,
          venue: venue.trim() || undefined,
          type,
          groupId: type === "GROUP" ? groupId : undefined,
          clubId: type === "CLUB" ? clubId : undefined,
          tags: tags.length ? tags : undefined,
          poster: poster ?? undefined,
        },
        {
          onSuccess: (data) => {
            toast.success("Event created")
            onSuccess?.(data.event._id)
          },
          onError: (err) => toast.error(err instanceof Error ? err.message : "Create failed"),
        }
      )
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending
  const error = createMutation.error || updateMutation.error

  return (
    <Card className={cn("w-full max-w-full min-w-0 border-l-4 border-l-primary pt-0! overflow-y-auto", className)}>
      <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
        <CardTitle className="text-primary flex items-center gap-2">
          <ImageSquareIcon className="size-5" weight="duotone" />
          {event ? "Edit Event" : "Create Event"}
        </CardTitle>
        <CardDescription>
          Fill in the event details. Poster: JPG/PNG/WebP, max 5 MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="event-title">Title *</FieldLabel>
              <Input
                id="event-title"
                placeholder="e.g. Tech Talk: AI in Education"
                required
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-date">Date *</FieldLabel>
              <Input
                id="event-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-time">Time (optional)</FieldLabel>
              <Input
                id="event-time"
                placeholder="e.g. 10:00 AM - 2:00 PM"
                maxLength={100}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-venue">Venue (optional)</FieldLabel>
              <Input
                id="event-venue"
                placeholder="e.g. Main Auditorium"
                maxLength={200}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-description">Description (optional)</FieldLabel>
              <Textarea
                id="event-description"
                placeholder="Brief description of the event"
                maxLength={3000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background min-h-20"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="event-type">Type</FieldLabel>
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v as EventType)
                  if (v !== "GROUP") setGroupId("")
                  if (v !== "CLUB") setClubId("")
                }}
              >
                <SelectTrigger id="event-type" className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {type === "GROUP" && (
              <Field>
                <FieldLabel htmlFor="event-group">Group *</FieldLabel>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger id="event-group" className="bg-background">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {groups.map((g) => (
                        <SelectItem key={g._id} value={g._id}>
                          {g.name} • {g.branch} Y{g.year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
            {type === "CLUB" && (
              <Field>
                <FieldLabel htmlFor="event-club">Club *</FieldLabel>
                <Select value={clubId} onValueChange={setClubId}>
                  <SelectTrigger id="event-club" className="bg-background">
                    <SelectValue placeholder="Select club" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {clubs.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="event-poster">Poster (optional)</FieldLabel>
              <div className="flex flex-col gap-2 min-w-0">
                <Input
                  id="event-poster"
                  ref={posterInputRef}
                  type="file"
                  accept={POSTER_ACCEPT}
                  onChange={handlePosterChange}
                  className="bg-background w-full min-w-0"
                />
                {posterPreview && (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="size-24 sm:size-32 w-fit rounded-md object-cover border border-border"
                  />
                )}
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="event-tags">Tags (optional, comma-separated)</FieldLabel>
              <Input
                id="event-tags"
                placeholder="e.g. tech, workshop, ai"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-background"
              />
            </Field>
            {error && (
              <FieldError className="text-destructive">
                {error instanceof Error ? error.message : "Something went wrong"}
              </FieldError>
            )}
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (event ? "Updating..." : "Creating...") : event ? "Update Event" : "Create Event"}
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
