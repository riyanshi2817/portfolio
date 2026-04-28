import { useState } from "react"
import {
  FilePdfIcon,
  DownloadIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  useResourcesByGroup,
  useDeleteResource,
  downloadResource,
  type Resource,
  type ResourceType,
} from "@/hooks/use-resources"
import { useAuthMe } from "@/hooks/use-auth"

type ResourceListProps = {
  groupId: string | null
  resourceType: ResourceType
  canUpload: boolean
  canDelete: boolean
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
  } catch {
    return iso
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function ResourceList({
  groupId,
  resourceType,
  canUpload,
  canDelete,
  className,
}: ResourceListProps) {
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [examYearFilter, setExamYearFilter] = useState("")
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { data: authData } = useAuthMe()
  const currentUserId = authData?.user?._id ?? authData?.user?.id

  const { data, isLoading, error } = useResourcesByGroup(
    groupId,
    {
      type: resourceType,
      search: search.trim() || undefined,
      subject: subjectFilter.trim() || undefined,
      examYear: examYearFilter.trim() || undefined,
      page,
      limit: 20,
    },
    !!groupId
  )

  const deleteResource = useDeleteResource()

  const resources = data?.resources ?? []
  const totalPages = data?.pages ?? 1
  const total = data?.total ?? 0

  const canDeleteResource = (r: Resource) => {
    if (canDelete) return true
    return r.uploadedBy && (r.uploadedBy._id === currentUserId || (r.uploadedBy as { id?: string }).id === currentUserId)
  }

  const handleDownload = async (r: Resource) => {
    setDownloadingId(r._id)
    try {
      await downloadResource(r._id, r.fileName)
      toast.success("Download started")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Download failed")
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteResource.mutateAsync(deleteTarget._id)
      toast.success("Resource deleted")
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete resource")
    }
  }

  if (!groupId) {
    return null
  }

  return (
    <div className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      <div className="border-b border-border p-4 space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search by title, subject, or tags..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-8 max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Filter by subject"
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value)
              setPage(1)
            }}
            className="max-w-[200px]"
          />
          {resourceType === "PYQ" && (
            <Input
              placeholder="Filter by exam year (e.g. 2024)"
              value={examYearFilter}
              onChange={(e) => {
                setExamYearFilter(e.target.value)
                setPage(1)
              }}
              className="max-w-[180px]"
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            Loading resources...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load resources"}
          </div>
        )}

        {!isLoading && !error && resources.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <FilePdfIcon className="size-12 opacity-50" weight="duotone" />
            <p>No resources yet</p>
            <p className="text-xs">
              {canUpload ? "Upload a resource to get started." : "No resources in this group."}
            </p>
          </div>
        )}

        {!isLoading && resources.length > 0 && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-start gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary/15 text-primary">
                    <FilePdfIcon className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{resource.title}</p>
                    {resource.subject && (
                      <p className="text-xs text-muted-foreground mt-0.5">{resource.subject}</p>
                    )}
                    {resource.type === "PYQ" && resource.examYear && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {resource.examYear}
                      </Badge>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                      <span>{formatFileSize(resource.fileSize)}</span>
                      <span>·</span>
                      <span>{formatDate(resource.createdAt)}</span>
                      {resource.uploadedBy?.name && (
                        <>
                          <span>·</span>
                          <span>by {resource.uploadedBy.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleDownload(resource)}
                      disabled={downloadingId === resource._id}
                      aria-label="Download"
                    >
                      <DownloadIcon className="size-4" weight="bold" />
                    </Button>
                    {canDeleteResource(resource) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(resource)}
                        aria-label="Delete"
                      >
                        <TrashIcon className="size-4" weight="regular" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages} ({total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteResource.isPending}
            >
              {deleteResource.isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
