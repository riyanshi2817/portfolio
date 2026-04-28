import { useState } from "react"
import { CalendarBlankIcon, PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEvents } from "@/hooks/use-events"
import type { EventSummary, EventType } from "@/hooks/use-events"

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "COLLEGE", label: "College" },
  { value: "GROUP", label: "Group" },
  { value: "CLUB", label: "Club" },
]

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

type EventListProps = {
  selectedEventId: string | null
  onSelectEvent: (event: EventSummary) => void
  onCreateNew?: () => void
  showCreateEvent?: boolean
  className?: string
}

export function EventList({
  selectedEventId,
  onSelectEvent,
  onCreateNew,
  showCreateEvent = false,
  className,
}: EventListProps) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState<EventType | "">("")
  const [upcoming, setUpcoming] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = useEvents({
    page,
    limit,
    type: type || undefined,
    upcoming: upcoming || undefined,
    search: search || undefined,
  })

  const events = data?.events ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      <div className="border-b border-border p-3 space-y-2">
        {showCreateEvent && onCreateNew && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onCreateNew}
          >
            <PlusIcon className="size-4" weight="bold" />
            Create event
          </Button>
        )}
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            weight="regular"
          />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={type || "all"}
            onValueChange={(v) => {
              setType(v === "all" ? "" : (v as EventType))
              setPage(1)
            }}
          >
            <SelectTrigger size="sm" className="flex-1 h-8 text-xs">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All types</SelectItem>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant={upcoming ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={() => {
              setUpcoming(!upcoming)
              setPage(1)
            }}
          >
            Upcoming
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading events...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load events"}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <CalendarBlankIcon className="size-10 opacity-50" weight="duotone" />
            <p>No events found</p>
            <p className="text-xs">
              {search || type
                ? "Try adjusting your filters"
                : showCreateEvent
                  ? "Create one to get started"
                  : "Check back later"}
            </p>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <>
            <ul className="flex flex-col gap-0.5">
              {events.map((event) => {
                const isSelected = selectedEventId === event._id
                return (
                  <li key={event._id}>
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className={cn(
                        "w-full flex items-start gap-2 rounded-sm px-3 py-2.5 text-sm transition-colors border text-left",
                        isSelected
                          ? "bg-primary/15 text-primary border-primary/20"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      {event.poster ? (
                        <img
                          src={event.poster}
                          alt=""
                          className="size-12 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="size-12 shrink-0 rounded-md bg-muted flex items-center justify-center">
                          <CalendarBlankIcon className="size-6 text-muted-foreground" weight="duotone" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{event.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.rsvpCount} RSVP{event.rsvpCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {formatDate(event.date)}
                        </span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
