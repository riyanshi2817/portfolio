import { useState } from "react"
import { useNavigate } from "react-router"
import { LinkIcon, TrashIcon, MapTrifoldIcon } from "@phosphor-icons/react"
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
import { useRoadmap, useDeleteRoadmap } from "@/hooks/use-roadmap"
import type { RoadmapResource } from "@/hooks/use-roadmap"

type RoadmapDetailProps = {
  roadmapId: string
  className?: string
}

function ResourceLink({ resource }: { resource: RoadmapResource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-primary hover:underline"
    >
      <LinkIcon className="size-4 shrink-0" />
      <span className="truncate">{resource.title}</span>
      <Badge className="shrink-0 text-xs capitalize bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
        {resource.type}
      </Badge>
    </a>
  )
}

export function RoadmapDetail({ roadmapId, className }: RoadmapDetailProps) {
  const navigate = useNavigate()
  const { data, isLoading, error } = useRoadmap(roadmapId)
  const deleteRoadmap = useDeleteRoadmap()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteRoadmap.mutateAsync(roadmapId)
      toast.success("Roadmap deleted")
      setDeleteDialogOpen(false)
      navigate("/ai/road-map")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete roadmap")
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
        <p className="text-sm">Loading roadmap...</p>
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
          {error instanceof Error ? error.message : "Failed to load roadmap"}
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error && error.message.includes("not found")
            ? "This roadmap may have been deleted."
            : "Please try again later."}
        </p>
      </div>
    )
  }

  const roadmap = data?.roadmap
  if (!roadmap) {
    return null
  }

  const content = roadmap.roadmap

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="mx-auto max-w-5xl w-full space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MapTrifoldIcon className="size-6" weight="duotone" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{content.skill}</h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm rounded-sm bg-primary/5 border-l-4 border-primary px-4 py-2">
            {roadmap.goal && (
              <span className="text-primary font-medium">Goal: </span>
            )}
            <BoldText text={roadmap.goal || "Learning roadmap"} />
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge
              className={cn(
                "capitalize border",
                roadmap.level === "advanced" && "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
                roadmap.level === "intermediate" && "bg-primary/15 text-primary border-primary/30",
                (roadmap.level === "beginner" || !roadmap.level) && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              )}
            >
              {roadmap.level}
            </Badge>
          </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label="Delete roadmap"
          >
            <TrashIcon className="size-5" weight="regular" />
          </Button>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete roadmap</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this roadmap? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteRoadmap.isPending}
              >
                {deleteRoadmap.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {content.overview && (
          <Card className="border-l-4 border-l-primary overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-base text-primary">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                <BoldText text={content.overview} />
              </p>
              {content.totalDuration && (
                <p className="text-muted-foreground mt-2 text-xs rounded-sm bg-emerald-500/10 px-2 py-1.5 inline-block">
                  Estimated duration: <BoldText text={content.totalDuration} />
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {content.phases?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2 text-primary">
              <span className="flex size-8 items-center justify-center rounded-sm bg-primary/15 text-primary text-xs font-bold">
                {content.phases.length}
              </span>
              Phases
            </h2>
            {content.phases.map((phase) => (
              <Card key={phase.phase} className="border-l-4 border-l-primary/50 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="text-base">
                    <span className="text-primary font-bold">Phase {phase.phase}:</span> <BoldText text={phase.title} />
                  </CardTitle>
                  {phase.duration && (
                    <p className="text-muted-foreground text-xs mt-1 rounded-sm bg-emerald-500/10 px-2 py-1 w-fit">
                      Duration: <BoldText text={phase.duration} />
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {phase.topics?.length > 0 && (
                    <div className="rounded-sm border border-primary/20 bg-primary/5 p-3">
                      <h3 className="text-xs font-medium mb-2 text-primary">Topics</h3>
                      <ul className="list-disc list-inside space-y-0.5 text-sm text-foreground/90">
                        {phase.topics.map((topic, i) => (
                          <li key={i}>
                            <BoldText text={topic} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {phase.resources?.length > 0 && (
                    <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <h3 className="text-xs font-medium mb-2 text-emerald-700 dark:text-emerald-400">Resources</h3>
                      <ul className="space-y-2">
                        {phase.resources.map((res, i) => (
                          <li key={i}>
                            <ResourceLink resource={res} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {phase.project?.title && (
                    <div className="rounded-sm border border-amber-500/20 bg-amber-500/5 p-3">
                      <h3 className="text-xs font-medium mb-1 text-amber-700 dark:text-amber-400">Project</h3>
                      <p className="font-medium text-sm">
                        <BoldText text={phase.project.title} />
                      </p>
                      {phase.project.description && (
                        <p className="text-muted-foreground text-sm mt-0.5">
                          <BoldText text={phase.project.description} />
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {content.finalProject?.title && (
          <Card className="border-l-4 border-l-amber-500/50 overflow-hidden">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
              <CardTitle className="text-base text-amber-800 dark:text-amber-200">Final Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">
                <BoldText text={content.finalProject.title} />
              </p>
              {content.finalProject.description && (
                <p className="text-muted-foreground text-sm mt-1">
                  <BoldText text={content.finalProject.description} />
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {content.tips?.length > 0 && (
          <Card className="border-l-4 border-l-emerald-500/50 overflow-hidden">
            <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-200">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                {content.tips.map((tip, i) => (
                  <li key={i}>
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
