import { useState } from "react"
import { TreeStructureIcon, PlusIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useClubs } from "@/hooks/use-clubs"
import type { ClubSummary, ClubCategory } from "@/hooks/use-clubs"

const CATEGORIES: { value: ClubCategory; label: string }[] = [
  { value: "TECH", label: "Tech" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "SPORTS", label: "Sports" },
  { value: "SOCIAL", label: "Social" },
  { value: "OTHER", label: "Other" },
]

type ClubListProps = {
  selectedClubId: string | null
  onSelectClub: (club: ClubSummary) => void
  onCreateNew: () => void
  showCreateClub?: boolean
  className?: string
}

export function ClubList({
  selectedClubId,
  onSelectClub,
  onCreateNew,
  showCreateClub = false,
  className,
}: ClubListProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<ClubCategory | "">("")
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, error } = useClubs({
    page,
    limit,
    category: category || undefined,
    search: search || undefined,
  })

  const clubs = data?.clubs ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      <div className="border-b border-border p-3 space-y-2">
        {showCreateClub && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onCreateNew}
          >
            <PlusIcon className="size-4" weight="bold" />
            Create club
          </Button>
        )}
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            weight="regular"
          />
          <Input
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Select
          value={category || "all"}
          onValueChange={(v) => {
            setCategory(v === "all" ? "" : (v as ClubCategory))
            setPage(1)
          }}
        >
          <SelectTrigger size="sm" className="w-full h-8 text-xs">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading clubs...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load clubs"}
          </div>
        )}

        {!isLoading && !error && clubs.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <TreeStructureIcon className="size-10 opacity-50" weight="duotone" />
            <p>No clubs found</p>
            <p className="text-xs">
              {search || category
                ? "Try adjusting your filters"
                : showCreateClub
                  ? "Create one to get started"
                  : "Check back later"}
            </p>
          </div>
        )}

        {!isLoading && clubs.length > 0 && (
          <>
            <ul className="flex flex-col gap-0.5">
              {clubs.map((club) => {
                const isSelected = selectedClubId === club._id
                return (
                  <li key={club._id}>
                    <button
                      type="button"
                      onClick={() => onSelectClub(club)}
                      className={cn(
                        "w-full flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm transition-colors border text-left",
                        isSelected
                          ? "bg-primary/15 text-primary border-primary/20"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                    >
                      {club.logo ? (
                        <img
                          src={club.logo}
                          alt=""
                          className="size-10 shrink-0 rounded-md object-cover"
                        />
                      ) : (
                        <div className="size-10 shrink-0 rounded-md bg-muted flex items-center justify-center">
                          <TreeStructureIcon className="size-5 text-muted-foreground" weight="duotone" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{club.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">
                            {club.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {club.memberCount} {club.memberCount === 1 ? "member" : "members"}
                          </span>
                        </div>
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
