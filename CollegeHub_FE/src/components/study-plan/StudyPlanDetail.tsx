import { useState } from "react"
import { useNavigate } from "react-router"
import { TrashIcon, CalendarIcon, ClockIcon, TargetIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { BoldText } from "@/components/ui/bold-text"
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
import { useStudyPlan, useDeleteStudyPlan } from "@/hooks/use-study-plan"

type StudyPlanDetailProps = {
  planId: string
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

export function StudyPlanDetail({ planId, className }: StudyPlanDetailProps) {
  const navigate = useNavigate()
  const { data, isLoading, error } = useStudyPlan(planId)
  const deleteStudyPlan = useDeleteStudyPlan()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteStudyPlan.mutateAsync(planId)
      toast.success("Study plan deleted")
      setDeleteDialogOpen(false)
      navigate("/ai/study-plan")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete study plan"
      )
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-1 items-center justify-center text-muted-foreground",
          className
        )}
      >
        <p className="text-sm">Loading study plan...</p>
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
          {error instanceof Error ? error.message : "Failed to load study plan"}
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error && error.message.includes("not found")
            ? "This study plan may have been deleted."
            : "Please try again later."}
        </p>
      </div>
    )
  }

  const studyPlan = data?.studyPlan
  if (!studyPlan) {
    return null
  }

  const plan = studyPlan.plan

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="mx-auto max-w-5xl w-full space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <TargetIcon className="size-6" weight="duotone" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {studyPlan.subjects?.join(", ")}
              </h1>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
            {studyPlan.examDate && (
              <Badge variant="default" className="bg-primary/90 text-primary-foreground gap-1">
                <CalendarIcon className="size-3" weight="bold" />
                Exam: {formatDate(studyPlan.examDate)}
              </Badge>
            )}
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
              <ClockIcon className="size-3" weight="bold" />
              {plan.dailyHours ?? studyPlan.hoursPerDay}h/day
            </Badge>
            {plan.totalWeeks > 0 && (
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
                {plan.totalWeeks} weeks
              </Badge>
            )}
          </div>
          {studyPlan.goals && (
            <p className="text-muted-foreground mt-2 text-sm rounded-sm bg-primary/5 border-l-4 border-primary px-4 py-2">
              <span className="text-primary font-medium">Goals: </span>
              <BoldText text={studyPlan.goals} />
            </p>
          )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="Delete study plan"
          >
            <TrashIcon className="size-5" weight="regular" />
          </Button>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                onClick={handleDelete}
                disabled={deleteStudyPlan.isPending}
              >
                {deleteStudyPlan.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {plan.weeklyPlan?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2 text-primary">
              <span className="flex size-8 items-center justify-center rounded-sm bg-primary/15 text-primary text-xs font-bold">
                {plan.weeklyPlan.length}
              </span>
              Weekly Plan
            </h2>
            {plan.weeklyPlan.map((week) => (
              <Card key={week.week} className="border-l-4 border-l-primary/50 overflow-hidden pt-0!">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
                  <CardTitle className="text-base">
                    <span className="text-primary font-bold">Week {week.week}</span>
                    {week.focus && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        — <BoldText text={week.focus} />
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {week.dailySchedule?.length > 0 ? (
                    <div className="space-y-3">
                      {week.dailySchedule.map((day, i) => (
                        <div
                          key={i}
                          className="rounded-sm border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 transition-colors hover:from-primary/10"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {day.day}
                            </span>
                            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                              {day.subject}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                              {day.hours}h
                            </Badge>
                          </div>
                          {day.topics?.length > 0 && (
                            <ul className="mt-2 list-disc list-inside space-y-0.5 text-sm text-muted-foreground">
                              {day.topics.map((topic, j) => (
                                <li key={j} className="text-foreground/90">
                                  <BoldText text={topic} />
                                </li>
                              ))}
                            </ul>
                          )}
                          {day.task && (
                            <p className="text-muted-foreground mt-2 text-sm rounded-sm bg-muted/50 px-2 py-1.5">
                              <BoldText text={day.task} />
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No schedule for this week
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {plan.revisionStrategy && (
          <Card className="border-l-4 border-l-amber-500/50 overflow-hidden pt-0!">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10 py-4">
              <CardTitle className="text-base text-amber-800 dark:text-amber-200">
                Revision Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                <BoldText text={plan.revisionStrategy} />
              </p>
            </CardContent>
          </Card>
        )}

        {plan.tips?.length > 0 && (
          <Card className="border-l-4 border-l-emerald-500/50 overflow-hidden pt-0!">
            <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10 py-4">
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-200">
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="text-foreground/90">
                    <BoldText text={tip} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
