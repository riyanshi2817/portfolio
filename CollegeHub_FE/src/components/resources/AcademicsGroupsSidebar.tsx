import { useState, useMemo } from "react"
import { MagnifyingGlassIcon, BookOpenIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMyGroups, useAllGroups } from "@/hooks/use-groups"
import { useAuthMe } from "@/hooks/use-auth"
import type { Group } from "@/hooks/use-groups"

type AcademicsGroupsSidebarProps = {
  selectedGroupId: string | null
  onSelectGroup: (group: Group) => void
  className?: string
}

export function AcademicsGroupsSidebar({
  selectedGroupId,
  onSelectGroup,
  className,
}: AcademicsGroupsSidebarProps) {
  const [search, setSearch] = useState("")
  const { data: authData } = useAuthMe()
  const role = authData?.user?.role
  const isFacultyOrAdmin = role === "FACULTY" || role === "ADMIN"

  const { data: myGroupsData, isLoading: myLoading, error: myError } = useMyGroups()
  const { data: allGroupsData, isLoading: allLoading, error: allError } = useAllGroups(isFacultyOrAdmin)

  const groups = isFacultyOrAdmin ? allGroupsData?.groups ?? [] : myGroupsData?.groups ?? []
  const isLoading = isFacultyOrAdmin ? allLoading : myLoading
  const error = isFacultyOrAdmin ? allError : myError

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups
    const q = search.trim().toLowerCase()
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.branch?.toLowerCase().includes(q) ||
        (g.section?.toLowerCase().includes(q) ?? false)
    )
  }, [groups, search])

  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-r border-border bg-muted/30",
        className
      )}
    >
      <div className="border-b border-border p-3">
        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading groups...
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load groups"}
          </div>
        )}

        {!isLoading && !error && filteredGroups.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <BookOpenIcon className="size-10 opacity-50" weight="duotone" />
            <p>
              {groups.length === 0
                ? isFacultyOrAdmin
                  ? "No groups found."
                  : "No groups yet. Create a profile to see your groups."
                : "No groups match your search."}
            </p>
          </div>
        )}

        {!isLoading && filteredGroups.length > 0 && (
          <ul className="flex flex-col gap-0.5">
            {filteredGroups.map((group) => {
              const isSelected = selectedGroupId === group._id || selectedGroupId === group.socketRoom
              return (
                <li key={group._id}>
                  <button
                    type="button"
                    onClick={() => onSelectGroup(group)}
                    className={cn(
                      "relative flex w-full flex-col gap-0.5 rounded-sm px-3 py-2.5 text-left text-sm transition-colors border",
                      isSelected
                        ? "bg-primary/15 text-primary border-primary/20"
                        : "bg-card border-border hover:bg-muted/50"
                    )}
                  >
                    <span className="font-medium">{group.name}</span>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {group.branch}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Year {group.year}
                      </Badge>
                      {group.section && (
                        <Badge variant="outline" className="text-xs">
                          Sec {group.section}
                        </Badge>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
