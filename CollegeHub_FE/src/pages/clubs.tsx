import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ClubList } from "@/components/clubs/ClubList"
import { ClubDetail } from "@/components/clubs/ClubDetail"
import { ClubForm } from "@/components/clubs/ClubForm"
import { useAuthMe } from "@/hooks/use-auth"
import type { ClubSummary } from "@/hooks/use-clubs"

export function ClubsPage() {
  const { clubId: paramClubId } = useParams()
  const navigate = useNavigate()
  const { data: authData } = useAuthMe()
  const isFacultyOrAdmin = authData?.user?.role === "FACULTY" || authData?.user?.role === "ADMIN"

  const [selectedClubId, setSelectedClubId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (paramClubId) {
      setSelectedClubId(paramClubId)
      setIsCreating(false)
    } else {
      setSelectedClubId(null)
    }
  }, [paramClubId])

  const handleSelectClub = (club: ClubSummary) => {
    setSelectedClubId(club._id)
    setIsCreating(false)
    navigate(`/clubs/${club._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedClubId(null)
    setIsCreating(true)
    navigate("/clubs", { replace: true })
  }

  const handleCreateSuccess = (clubId: string) => {
    setSelectedClubId(clubId)
    setIsCreating(false)
    navigate(`/clubs/${clubId}`, { replace: true })
  }

  const handleDeleteClub = (id: string) => {
    if (selectedClubId === id) {
      setSelectedClubId(null)
      navigate("/clubs", { replace: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border overflow-hidden">
      <ClubList
        selectedClubId={selectedClubId}
        onSelectClub={handleSelectClub}
        onCreateNew={handleCreateNew}
        showCreateClub={isFacultyOrAdmin}
      />
      <div className="flex min-h-0 flex-1 min-w-0 overflow-hidden bg-background">
        {selectedClubId ? (
          <ClubDetail
            clubId={selectedClubId}
            onDelete={handleDeleteClub}
          />
        ) : isCreating && isFacultyOrAdmin ? (
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <ClubForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreating(false)} />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-stretch p-4 w-full">
            {isFacultyOrAdmin && (
              <ClubForm
                onSuccess={handleCreateSuccess}
                className="max-w-xl mx-auto w-full"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
