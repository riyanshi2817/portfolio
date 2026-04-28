import { useState } from "react"
import { MapTrifoldIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react"
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
import { useRoadmaps, useDeleteRoadmap } from "@/hooks/use-roadmap"
import type { RoadmapSummary } from "@/hooks/use-roadmap"

type RoadmapListProps = {
  selectedRoadmapId: string | null
  onSelectRoadmap: (roadmap: RoadmapSummary) => void
  onCreateNew: () => void
  onDeleteRoadmap?: (id: string) => void
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

export function RoadmapList({
  selectedRoadmapId,
  onSelectRoadmap,
  onCreateNew,
  onDeleteRoadmap,
  className,
}: RoadmapListProps) {
  const { data, isLoading, error } = useRoadmaps()
  const deleteRoadmap = useDeleteRoadmap()
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const roadmaps = data?.roadmaps ?? []

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return
    try {
      await deleteRoadmap.mutateAsync(deleteTargetId)
      toast.success("Roadmap deleted")
      if (selectedRoadmapId === deleteTargetId) {
        onDeleteRoadmap?.(deleteTargetId)
      }
      setDeleteTargetId(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete roadmap")
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
          Create new roadmap
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading roadmaps...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load roadmaps"}
          </div>
        )}

        {!isLoading && !error && roadmaps.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <MapTrifoldIcon className="size-10 opacity-50" weight="duotone" />
            <p>No roadmaps yet</p>
            <p className="text-xs">Create one to get started.</p>
          </div>
        )}

        {!isLoading && roadmaps.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {roadmaps.map((roadmap) => {
              const isSelected = selectedRoadmapId === roadmap._id
              return (
                <li key={roadmap._id} className="group/list-item">
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
                      onClick={() => onSelectRoadmap(roadmap)}
                      className="min-w-0 flex-1 flex flex-col gap-0.5 text-left"
                    >
                      <span className="font-medium">{roadmap.skill}</span>
                      <div className="flex flex-wrap gap-1 text-xs">
                        <span
                          className={cn(
                            "capitalize",
                            roadmap.level === "advanced" && "text-amber-600 dark:text-amber-400",
                            roadmap.level === "intermediate" && "text-primary",
                            (roadmap.level === "beginner" || !roadmap.level) && "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {roadmap.level}
                        </span>
                        {roadmap.goal && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="truncate max-w-[180px] text-muted-foreground" title={roadmap.goal}>
                              {roadmap.goal}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(roadmap.createdAt)}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 size-8 opacity-0 group-hover/list-item:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteTargetId(roadmap._id)
                      }}
                      aria-label="Delete roadmap"
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
                onClick={handleDeleteConfirm}
                disabled={deleteRoadmap.isPending}
              >
                {deleteRoadmap.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  )
}
