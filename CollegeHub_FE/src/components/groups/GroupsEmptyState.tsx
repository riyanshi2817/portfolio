import { ChatsCircleIcon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type GroupsEmptyStateProps = {
  className?: string
}

export function GroupsEmptyState({ className }: GroupsEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground",
        className
      )}
    >
      <ChatsCircleIcon className="size-12 opacity-50" weight="duotone" />
      <p className="text-sm font-medium">Select a group to start chatting</p>
      <p className="text-xs">Choose a group from the sidebar to view and send messages.</p>
    </div>
  )
}
