import { useState } from "react"
import { CalendarBlankIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useStudyPlans, useDeleteStudyPlan } from "@/hooks/use-study-plan"
import type { StudyPlanSummary } from "@/hooks/use-study-plan"

type StudyPlanListProps = {
  selectedPlanId: string | null
  onSelectPlan: (plan: StudyPlanSummary) => void
  onCreateNew: () => void
  onDeletePlan?: (id: string) => void
  className?: string
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }
  catch {
    return iso
  }
}

function getDuration(examDate: string | undefined, createdAt: string): { days: number; hours: number } | null {
  if (!examDate) return null
  try {
    const exam = new Date(examDate)
    const created = new Date(createdAt)
    const diffMs = exam.getTime() - created.getTime()
    if (diffMs < 0) return { days: 0, hours: 0 }
    const totalHours = diffMs / (1000 * 60 * 60)
    const days = Math.floor(totalHours / 24)
    const hours = Math.floor(totalHours % 24)
    return { days, hours }
  }
  catch {
    return null
  }
}

export function StudyPlanList({
  selectedPlanId,
  onSelectPlan,
  onCreateNew,
  onDeletePlan,
  className,
}: StudyPlanListProps) {
  const { data, isLoading, error } = useStudyPlans()
  const deleteStudyPlan = useDeleteStudyPlan()
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const plans = data?.studyPlans ?? []

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return
    try {
      await deleteStudyPlan.mutateAsync(deleteTargetId)
      toast.success("Study plan deleted")
      if (selectedPlanId === deleteTargetId) {
        onDeletePlan?.(deleteTargetId)
      }
      setDeleteTargetId(null)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete study plan"
      )
    }
  }

  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      <div className="border-b border-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onCreateNew}
        >
          <PlusIcon className="size-4" weight="bold" />
          Create new plan
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading plans...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load plans"}
          </div>
        )}

        {!isLoading && !error && plans.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <CalendarBlankIcon className="size-10 opacity-50" weight="duotone" />
            <p>No study plans yet</p>
            <p className="text-xs">Create one to get started.</p>
          </div>
        )}

        {!isLoading && plans.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan._id
              return (
                <li key={plan._id} className="group/list-item">
                  <div
                    className={cn(
                      "relative flex items-start gap-2 rounded-sm px-3 py-2.5 text-sm transition-colors border",
                      isSelected
                        ? "bg-primary/15 text-primary border-primary/20"
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan)}
                      className="min-w-0 flex-1 flex flex-col gap-0.5 text-left"
                    >
                      <span className="font-medium">
                        {plan.subjects?.join(", ") ?? "Study plan"}
                      </span>
                      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                        {plan.examDate && (
                          <span>{formatDate(plan.examDate)}</span>
                        )}
                        {plan.hoursPerDay > 0 && (
                          <span>{plan.hoursPerDay}h/day</span>
                        )}
                        {(() => {
                          const d = getDuration(plan.examDate, plan.createdAt)
                          if (d === null) return null
                          if (d.days > 0) {
                            return (
                              <span>· {d.days} {d.days === 1 ? "day" : "days"}</span>
                            )
                          }
                          return (
                            <span>· {d.hours} {d.hours === 1 ? "hour" : "hours"}</span>
                          )
                        })()}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(plan.createdAt)}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 size-8 opacity-0 group-hover/list-item:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteTargetId(plan._id)
                      }}
                      aria-label="Delete study plan"
                    >
                      <TrashIcon className="size-4" weight="regular" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <AlertDialog
          open={!!deleteTargetId}
          onOpenChange={(open) => !open && setDeleteTargetId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete study plan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this study plan? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteStudyPlan.isPending}
              >
                {deleteStudyPlan.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
