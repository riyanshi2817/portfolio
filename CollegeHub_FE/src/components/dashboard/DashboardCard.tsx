import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const VARIANT_STYLES = {
  amber:
    "border-l-4 border-l-amber-500 [&_[data-slot=card-header]]:bg-amber-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  emerald:
    "border-l-4 border-l-emerald-500 [&_[data-slot=card-header]]:bg-emerald-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  blue: "border-l-4 border-l-blue-500 [&_[data-slot=card-header]]:bg-blue-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  violet:
    "border-l-4 border-l-violet-500 [&_[data-slot=card-header]]:bg-violet-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  rose: "border-l-4 border-l-rose-500 [&_[data-slot=card-header]]:bg-rose-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  cyan: "border-l-4 border-l-cyan-500 [&_[data-slot=card-header]]:bg-cyan-500/5 [&_[data-slot=card-header]]:rounded-t-sm",
  default: "",
} as const

type DashboardCardProps = {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  variant?: keyof typeof VARIANT_STYLES
  scrollable?: boolean
  className?: string
}

export function DashboardCard({
  title,
  children,
  action,
  icon,
  variant = "default",
  scrollable = false,
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn(VARIANT_STYLES[variant], "overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {icon && <span className="flex shrink-0">{icon}</span>}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className={cn(scrollable && "max-h-[220px] overflow-y-auto overscroll-contain")}>
        {children}
      </CardContent>
    </Card>
  )
}
