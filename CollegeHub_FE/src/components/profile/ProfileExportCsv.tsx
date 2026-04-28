import { useState } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProfileFilter, useExportProfileCsv } from "@/hooks/use-profile"
import type { Profile } from "@/hooks/use-profile"
import { UsersIcon, FunnelIcon, DownloadIcon, XIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const YEARS = [1, 2, 3, 4] as const

function getDisplayName(profile: Profile): string {
  const name = profile.userId?.name
  if (name?.trim()) return name
  return profile.userId?.email ?? "—"
}

export function ProfileExportCsv() {
  const [showFilters, setShowFilters] = useState(false)
  const [branch, setBranch] = useState("")
  const [year, setYear] = useState<number | "">("")
  const [section, setSection] = useState("")

  const filterParams = {
    branch: branch.trim() || undefined,
    year: year !== "" ? Number(year) : undefined,
    section: section.trim() || undefined,
  }

  const { data, isLoading, error } = useProfileFilter(filterParams, true)
  const exportMutation = useExportProfileCsv()

  const profiles = data?.profiles ?? []
  const count = data?.count ?? 0

  const hasActiveFilters = branch.trim() !== "" || year !== "" || section.trim() !== ""

  const handleClearFilters = () => {
    setBranch("")
    setYear("")
    setSection("")
  }

  const handleExport = () => {
    const params = {
      branch: filterParams.branch,
      year: filterParams.year,
      section: filterParams.section,
    }
    exportMutation.mutate(params, {
      onSuccess: () => {
        toast.success("CSV exported successfully")
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Export failed")
      },
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <UsersIcon className="size-8 text-primary" weight="duotone" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Profiles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {count} student{count !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
              className="gap-2"
            >
              <FunnelIcon className="size-4" weight="duotone" />
              Filters
            </Button>
            <Button
              size="sm"
              onClick={handleExport}
              disabled={exportMutation.isPending || isLoading}
              className="gap-2"
            >
              <DownloadIcon className="size-4" weight="duotone" />
              {exportMutation.isPending ? "Exporting..." : "Export CSV"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-end gap-4">
                <Field className="min-w-0 flex-1 basis-36 shrink-0">
                  <FieldLabel>Branch</FieldLabel>
                  <Input
                    placeholder="e.g. CSE, ECE"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full min-w-0"
                  />
                </Field>
                <Field className="min-w-0 flex-1 basis-32 shrink-0">
                  <FieldLabel>Year</FieldLabel>
                  <Select
                    value={year === "" ? "all" : String(year)}
                    onValueChange={(v) => setYear(v === "all" ? "" : Number(v))}
                  >
                    <SelectTrigger className="w-full min-w-0">
                      <SelectValue placeholder="All years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All years</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          Year {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="min-w-0 flex-1 basis-32 shrink-0">
                  <FieldLabel>Section</FieldLabel>
                  <Input
                    placeholder="e.g. A, B"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full min-w-0"
                  />
                </Field>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  disabled={!hasActiveFilters}
                  className="gap-2 shrink-0"
                >
                  <XIcon className="size-4" weight="bold" />
                  Clear filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">Loading students...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12 text-destructive">
                <p className="text-sm">
                  {error instanceof Error ? error.message : "Failed to load students"}
                </p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Roll Number</th>
                      <th className="px-4 py-3 text-left font-medium">Branch</th>
                      <th className="px-4 py-3 text-left font-medium">Year</th>
                      <th className="px-4 py-3 text-left font-medium">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr
                        key={profile._id}
                        className={cn(
                          "border-b transition-colors hover:bg-muted/30",
                          "last:border-b-0"
                        )}
                      >
                        <td className="px-4 py-3">{getDisplayName(profile)}</td>
                        <td className="px-4 py-3">{profile.userId?.email ?? "—"}</td>
                        <td className="px-4 py-3">{profile.rollNumber}</td>
                        <td className="px-4 py-3">{profile.branch}</td>
                        <td className="px-4 py-3">{profile.year}</td>
                        <td className="px-4 py-3">{profile.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
