import { Link } from "react-router"
import {
  UserIcon,
  UsersIcon,
  StarIcon,
  BookOpenIcon,
  ChatsCircleIcon,
  MapTrifoldIcon,
  CalendarIcon,
  QuestionIcon,
} from "@phosphor-icons/react"
import type { QuickLink } from "@/hooks/use-dashboard"

const ICON_MAP: Record<string, React.ReactNode> = {
  user: <UserIcon className="size-6" weight="fill" />,
  users: <UsersIcon className="size-6" weight="fill" />,
  star: <StarIcon className="size-6" weight="fill" />,
  "help-circle": <QuestionIcon className="size-6" weight="fill" />,
  "message-square": <ChatsCircleIcon className="size-6" weight="fill" />,
  "book-open": <BookOpenIcon className="size-6" weight="fill" />,
  map: <MapTrifoldIcon className="size-6" weight="fill" />,
  calendar: <CalendarIcon className="size-6" weight="fill" />,
}

export function QuickLinksGrid({ quickLinks }: { quickLinks: QuickLink[] }) {
  if (!quickLinks?.length) return null

  return (
    <div className="grid grid-cols-4 gap-3">
      {quickLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 hover:border-primary/30"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {ICON_MAP[link.icon ?? ""] ?? <StarIcon className="size-6" weight="fill" />}
          </div>
          <span className="text-center text-xs font-medium">{link.label}</span>
        </Link>
      ))}
    </div>
  )
}
