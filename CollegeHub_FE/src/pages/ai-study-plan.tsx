import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { StudyPlanForm } from "@/components/study-plan/StudyPlanForm"
import { StudyPlanList } from "@/components/study-plan/StudyPlanList"
import { StudyPlanDetail } from "@/components/study-plan/StudyPlanDetail"
import { CalendarBlankIcon } from "@phosphor-icons/react"
import type { StudyPlanSummary } from "@/hooks/use-study-plan"

export function AiStudyPlanPage() {
  const { planId: paramPlanId } = useParams()
  const navigate = useNavigate()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (paramPlanId) {
      setSelectedPlanId(paramPlanId)
    } else {
      setSelectedPlanId(null)
    }
  }, [paramPlanId])

  const handleSelectPlan = (plan: StudyPlanSummary) => {
    setSelectedPlanId(plan._id)
    navigate(`/ai/study-plan/${plan._id}`, { replace: true })
  }

  const handleCreateNew = () => {
    setSelectedPlanId(null)
    navigate("/ai/study-plan", { replace: true })
  }

  const handleCreateSuccess = (planId: string) => {
    setSelectedPlanId(planId)
    navigate(`/ai/study-plan/${planId}`, { replace: true })
  }

  const handleDeletePlan = (id: string) => {
    if (selectedPlanId === id) {
      setSelectedPlanId(null)
      navigate("/ai/study-plan", { replace: true })
    }
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border">
      <StudyPlanList
        selectedPlanId={selectedPlanId}
        onSelectPlan={handleSelectPlan}
        onCreateNew={handleCreateNew}
        onDeletePlan={handleDeletePlan}
      />
      <div className="flex min-h-0 flex-1 min-w-0 overflow-hidden bg-background">
        {selectedPlanId ? (
          <StudyPlanDetail planId={selectedPlanId} />
        ) : (
          <div className="flex flex-1 flex-col items-stretch justify-center gap-4 p-4 w-full">
            <CalendarBlankIcon className="size-12 text-muted-foreground opacity-50 self-center" weight="duotone" />
            <p className="text-sm text-muted-foreground text-center">
              Create a new study plan or select one from the sidebar
            </p>
            <StudyPlanForm onSuccess={handleCreateSuccess} className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
