import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { RoadmapForm } from "@/components/roadmap/RoadmapForm"
import { RoadmapList } from "@/components/roadmap/RoadmapList"
import { RoadmapDetail } from "@/components/roadmap/RoadmapDetail"
import { MapTrifoldIcon } from "@phosphor-icons/react"
import type { RoadmapSummary } from "@/hooks/use-roadmap"

export function AiRoadMapPage() {
  const { roadmapId: paramRoadmapId } = useParams()
  const navigate = useNavigate()
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null)

  useEffect(() => {
    if (paramRoadmapId) {
      setSelectedRoadmapId(paramRoadmapId)
    } else {
      setSelectedRoadmapId(null)
    }
  }, [paramRoadmapId])

  const handleSelectRoadmap = (roadmap: RoadmapSummary) => {
    setSelectedRoadmapId(roadmap._id)
    navigate(`/ai/road-map/${roadmap._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedRoadmapId(null)
    navigate("/ai/road-map", { replace: true })
  }

  const handleCreateSuccess = (roadmapId: string) => {
    setSelectedRoadmapId(roadmapId)
    navigate(`/ai/road-map/${roadmapId}`, { replace: true })
  }

  const handleDeleteRoadmap = (id: string) => {
    if (selectedRoadmapId === id) {
      setSelectedRoadmapId(null)
      navigate("/ai/road-map", { replace: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border">
      <RoadmapList
        selectedRoadmapId={selectedRoadmapId}
        onSelectRoadmap={handleSelectRoadmap}
        onCreateNew={handleCreateNew}
        onDeleteRoadmap={handleDeleteRoadmap}
      />
      <div className="flex min-h-0 flex-1 min-w-0 overflow-hidden bg-background">
        {selectedRoadmapId ? (
          <RoadmapDetail roadmapId={selectedRoadmapId} />
        ) : (
          <div className="flex flex-1 flex-col items-stretch justify-center gap-4 p-4 w-full">
            <MapTrifoldIcon className="size-12 text-muted-foreground opacity-50 self-center" weight="duotone" />
            <p className="text-sm text-muted-foreground text-center">
              Create a new roadmap or select one from the sidebar
            </p>
            <RoadmapForm onSuccess={handleCreateSuccess} className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
