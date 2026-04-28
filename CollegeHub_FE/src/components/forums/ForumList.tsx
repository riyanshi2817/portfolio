import { useState, useMemo } from "react"
import { ChatsCircleIcon, PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useForums } from "@/hooks/use-forums"
import type { ForumSummary } from "@/hooks/use-forums"

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

function filterForums(
  forums: ForumSummary[],
  search: string,
  topic: string
): ForumSummary[] {
  let result = forums
  const searchLower = search.trim().toLowerCase()
  const topicLower = topic.trim().toLowerCase()

  if (searchLower) {
    result = result.filter((forum) => {
      const titleMatch = forum.title.toLowerCase().includes(searchLower)
      const topicMatch = (forum.topic ?? "").toLowerCase().includes(searchLower)
      const tagsMatch =
        forum.tags?.some((t) => t.toLowerCase().includes(searchLower)) ?? false
      const descMatch =
        forum.description?.toLowerCase().includes(searchLower) ?? false
      return titleMatch || topicMatch || tagsMatch || descMatch
    })
  }

  if (topicLower) {
    result = result.filter((forum) =>
      (forum.topic ?? "General").toLowerCase().includes(topicLower)
    )
  }

  return result
}

const PAGE_SIZE = 20

type ForumListProps = {
  selectedForumId: string | null
  onSelectForum: (forum: ForumSummary) => void
  onCreateNew: () => void
  showCreateForum?: boolean
  className?: string
}

export function ForumList({
  selectedForumId,
  onSelectForum,
  onCreateNew,
  showCreateForum = false,
  className,
}: ForumListProps) {
  const [search, setSearch] = useState("")
  const [topic, setTopic] = useState("")
  const [mine, setMine] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useForums({
    page: 1,
    limit: 50,
    mine: mine || undefined,
  })

  const allForums = data?.forums ?? []
  const filteredForums = useMemo(
    () => filterForums(allForums, search, topic),
    [allForums, search, topic]
  )
  const totalPages = Math.ceil(filteredForums.length / PAGE_SIZE) || 1
  const paginatedForums = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredForums.slice(start, start + PAGE_SIZE)
  }, [filteredForums, page])

  const forums = paginatedForums

  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      <div className="border-b border-border p-3 space-y-2">
        {showCreateForum && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onCreateNew}
          >
            <PlusIcon className="size-4" weight="bold" />
            Create forum
          </Button>
        )}
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            weight="regular"
          />
          <Input
            placeholder="Search forums..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Input
          placeholder="Topic (partial match)"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value)
            setPage(1)
          }}
          className="h-8 text-xs"
        />
        <Button
          variant={mine ? "default" : "outline"}
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => {
            setMine(!mine)
            setPage(1)
          }}
        >
          My forums
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading forums...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load forums"}
          </div>
        )}

        {!isLoading && !error && forums.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <ChatsCircleIcon className="size-10 opacity-50" weight="duotone" />
            <p>No forums found</p>
            <p className="text-xs">
              {search || topic || mine
                ? "Try adjusting your filters"
                : showCreateForum
                  ? "Create one to get started"
                  : "Check back later"}
            </p>
          </div>
        )}

        {!isLoading && forums.length > 0 && (
          <>
            <ul className="flex flex-col gap-0.5">
              {forums.map((forum) => {
                const isSelected = selectedForumId === forum._id
                return (
                  <li key={forum._id}>
                    <button
                      type="button"
                      onClick={() => onSelectForum(forum)}
                      className={cn(
                        "w-full flex items-start gap-2 rounded-sm px-3 py-2.5 text-sm transition-colors border text-left",
                        isSelected
                          ? "bg-primary/15 text-primary border-primary/20"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      <div className="size-10 shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <ChatsCircleIcon className="size-5 text-muted-foreground" weight="duotone" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{forum.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                            {forum.topic ?? "General"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {forum.replyCount} {forum.replyCount === 1 ? "reply" : "replies"}
                          </span>
                        </div>
                        {forum.lastActivity && (
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            {formatDate(forum.lastActivity)}
                          </span>
                        )}
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
