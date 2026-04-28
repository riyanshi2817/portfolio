import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { EventList } from "@/components/events/EventList"
import { EventDetail } from "@/components/events/EventDetail"
import { EventForm } from "@/components/events/EventForm"
import { useAuthMe } from "@/hooks/use-auth"
import type { EventSummary } from "@/hooks/use-events"

export function EventsPage() {
  const { eventId: paramEventId } = useParams()
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (paramEventId) {
      setSelectedEventId(paramEventId)
      setIsCreating(false)
    } else {
      setSelectedEventId(null)
    }
  }, [paramEventId])

  const handleSelectEvent = (event: EventSummary) => {
    setSelectedEventId(event._id)
    setIsCreating(false)
    navigate(`/events/${event._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedEventId(null)
    setIsCreating(true)
    navigate("/events", { replace: true })
  }

  const handleCreateSuccess = (eventId: string) => {
    setSelectedEventId(eventId)
    setIsCreating(false)
    navigate(`/events/${eventId}`, { replace: true })
  }

  const handleDeleteEvent = (id: string) => {
    if (selectedEventId === id) {
      setSelectedEventId(null)
      navigate("/events", { replace: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border overflow-hidden">
      <EventList
        selectedEventId={selectedEventId}
        onSelectEvent={handleSelectEvent}
        onCreateNew={handleCreateNew}
        showCreateEvent={isFacultyOrAdmin}
      />
      <div className="flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden bg-background">
        {selectedEventId ? (
          <EventDetail
            eventId={selectedEventId}
            onDelete={handleDeleteEvent}
          />
        ) : isCreating && isFacultyOrAdmin ? (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
            <EventForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 w-full">
            {isFacultyOrAdmin && !isCreating && (
              <EventForm
                onSuccess={handleCreateSuccess}
                className="max-w-xl w-full min-w-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
