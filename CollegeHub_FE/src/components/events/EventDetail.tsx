import { useState } from "react"
import { useNavigate } from "react-router"
import {
  CalendarBlankIcon,
  MapPinIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  HandHeartIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEvent, useDeleteEvent, useEventRsvp } from "@/hooks/use-events"
import { useAuthMe } from "@/hooks/use-auth"
import { EventForm } from "./EventForm"

type EventDetailProps = {
  eventId: string
  onDelete?: (id: string) => void
  className?: string
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

export function EventDetail({ eventId, onDelete, className }: EventDetailProps) {
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"

  const { data, isLoading, error } = useEvent(eventId)
  const deleteEvent = useDeleteEvent()
  const rsvpMutation = useEventRsvp(eventId)

  const [isEditing, setIsEditing] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const event = data?.event

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(eventId)
      toast.success("Event deleted")
      setDeleteDialogOpen(false)
      onDelete?.(eventId)
      navigate("/events")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete event")
    }
  }

  const handleRsvp = async () => {
    try {
      await rsvpMutation.mutateAsync()
      toast.success(event?.userRsvpd ? "RSVP removed" : "You're going!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update RSVP")
    }
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className={cn("flex flex-1 items-center justify-center text-muted-foreground", className)}>
        <p className="text-sm">Loading event...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-2 text-destructive",
          className
        )}
      >
        <p className="text-sm font-medium">
          {error instanceof Error ? error.message : "Failed to load event"}
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error && error.message.includes("not found")
            ? "This event may have been deleted."
            : "Please try again later."}
        </p>
      </div>
    )
  }

  if (!event) {
    return null
  }

  if (isEditing) {
    return (
      <div className={cn("flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4", className)}>
        <EventForm
          event={event}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="mx-auto max-w-3xl w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            {event.poster ? (
              <img
                src={event.poster}
                alt=""
                className="size-24 sm:size-32 shrink-0 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="size-24 sm:size-32 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarBlankIcon className="size-12 text-primary" weight="duotone" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
                <Badge variant="secondary" className="capitalize">
                  {event.type}
                </Badge>
              </div>
              {event.groupId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Group: {event.groupId.name}
                </p>
              )}
              {event.clubId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Club: {event.clubId.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant={event.userRsvpd ? "default" : "outline"}
              size="sm"
              onClick={handleRsvp}
              disabled={rsvpMutation.isPending}
              className="gap-2"
            >
              <HandHeartIcon className="size-4" weight={event.userRsvpd ? "fill" : "regular"} />
              {rsvpMutation.isPending ? "Updating..." : event.userRsvpd ? "Going" : "RSVP"}
            </Button>
            {isFacultyOrAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <PencilIcon className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={deleteEvent.isPending}
                  className="gap-2"
                >
                  <TrashIcon className="size-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarBlankIcon className="size-5 shrink-0 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Date</p>
                <p className="text-muted-foreground text-sm">{formatDate(event.date)}</p>
              </div>
            </div>
            {event.time && (
              <div className="flex items-start gap-3">
                <ClockIcon className="size-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Time</p>
                  <p className="text-muted-foreground text-sm">{event.time}</p>
                </div>
              </div>
            )}
            {event.venue && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="size-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Venue</p>
                  <p className="text-muted-foreground text-sm">{event.venue}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {event.rsvpCount} {event.rsvpCount === 1 ? "person" : "people"} going
              </span>
            </div>
            {event.organizer && (
              <div className="flex items-start gap-3">
                <span className="text-sm text-muted-foreground">
                  Organized by {event.organizer.email}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {event.description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </CardContent>
          </Card>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {event.rsvps && event.rsvps.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {event.rsvps.map((r) => (
                  <li key={r._id} className="text-sm">
                    <span className="font-medium">{r.email}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
