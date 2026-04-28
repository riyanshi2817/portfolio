import { useNavigate } from "react-router"
import { BellIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications"
import type { Notification } from "@/hooks/use-notifications"

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffSec < 60) return "Just now"
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHour < 24) return `${diffHour} hr ago`
  if (diffDay < 7) return `${diffDay} day ago`
  return date.toLocaleDateString()
}

function getNotificationTitle(notification: Notification): string {
  if (notification.type === "QUIZ" && notification.payload?.quizId?.title) {
    return notification.payload.quizId.title
  }
  if (notification.payload?.title) {
    return notification.payload.title
  }
  switch (notification.type) {
    case "QUIZ":
      return "New quiz"
    case "EVENT":
    case "CLUB":
    default:
      return "New notification"
  }
}

export function NotificationDropdown() {
  const navigate = useNavigate()
  const { data: unreadData } = useUnreadCount()
  const { data: listData, isLoading, isError } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = unreadData?.unreadCount ?? 0
  const notifications = listData?.notifications ?? []

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification._id)
    }
    if (notification.type === "QUIZ" && notification.payload?.quizId?._id) {
      navigate(`/quizzes/${notification.payload.quizId._id}`)
    }
  }

  const handleMarkAllRead = () => {
    markAllRead.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-[10px] flex items-center justify-center rounded-sm"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[320px] max-h-[400px] overflow-hidden p-0 bg-background! text-foreground! border border-border shadow-lg"
      >
        <div className="border-b border-border px-4 py-3 bg-background! text-foreground!">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                className="text-xs text-primary hover:underline underline-offset-2 disabled:opacity-50"
              >
                {markAllRead.isPending ? "Marking..." : "Mark all as read"}
              </button>
            )}
          </div>
        </div>
        <div className="overflow-y-auto max-h-[340px]">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : isError ? (
            <div className="px-4 py-8 text-center text-sm text-destructive">
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification._id}
                onSelect={(e) => {
                  e.preventDefault()
                  handleNotificationClick(notification)
                }}
                className={cn(
                  "flex flex-col items-start gap-0.5 py-3 px-4 rounded-sm border-l-2 border-transparent",
                  !notification.isRead && "border-l-primary bg-accent/5"
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {getNotificationTitle(notification)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
