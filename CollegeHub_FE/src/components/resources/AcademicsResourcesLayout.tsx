import { useState } from "react"
import { BookOpenIcon } from "@phosphor-icons/react"
import { AcademicsGroupsSidebar } from "./AcademicsGroupsSidebar"
import { ResourceList } from "./ResourceList"
import { ResourceUploadForm } from "./ResourceUploadForm"
import { useAuthMe } from "@/hooks/use-auth"
import type { Group } from "@/hooks/use-groups"
import type { ResourceType } from "@/hooks/use-resources"

type AcademicsResourcesLayoutProps = {
  resourceType: ResourceType
  title: string
  description: string
}

export function AcademicsResourcesLayout({
  resourceType,
  title,
  description,
}: AcademicsResourcesLayoutProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const { data: authData } = useAuthMe()
  const role = authData?.user?.role
  const isFacultyOrAdmin = role === "FACULTY" || role === "ADMIN"

  const groupId = selectedGroup?._id ?? selectedGroup?.socketRoom ?? null

  return (
    <div className="flex h-full min-h-0 min-w-0 -m-4 border overflow-hidden">
      <AcademicsGroupsSidebar
        selectedGroupId={groupId}
        onSelectGroup={setSelectedGroup}
      />
      <div className="flex min-h-0 flex-1 min-w-0 flex-col overflow-hidden bg-background">
        {selectedGroup ? (
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            <div className="shrink-0 border-b border-border p-4">
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedGroup.name} • {selectedGroup.branch} • Year {selectedGroup.year}
                {selectedGroup.section ? ` • Section ${selectedGroup.section}` : ""}
              </p>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ResourceList
                groupId={groupId}
                resourceType={resourceType}
                canUpload={isFacultyOrAdmin}
                canDelete={isFacultyOrAdmin}
              />
              {isFacultyOrAdmin && (
                <div className="border-t border-border p-4">
                  <ResourceUploadForm
                    groupId={groupId!}
                    resourceType={resourceType}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
            <BookOpenIcon className="size-12 text-muted-foreground opacity-50" weight="duotone" />
            <p className="text-sm text-muted-foreground text-center">
              Select a group from the sidebar to view and manage resources
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
