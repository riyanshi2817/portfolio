import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const STAT_COLORS = [
  "border-l-amber-500 bg-amber-500/5",
  "border-l-emerald-500 bg-emerald-500/5",
  "border-l-blue-500 bg-blue-500/5",
  "border-l-violet-500 bg-violet-500/5",
  "border-l-rose-500 bg-rose-500/5",
  "border-l-cyan-500 bg-cyan-500/5",
  "border-l-orange-500 bg-orange-500/5",
] as const

type StatCardProps = {
  label: string
  value: number | string
  colorIndex?: number
  className?: string
}

export function StatCard({ label, value, colorIndex = 0, className }: StatCardProps) {
  const colorClass = STAT_COLORS[colorIndex % STAT_COLORS.length]
  return (
    <Card className={cn("border-l-4 overflow-hidden", colorClass, className)}>
      <CardContent className="pt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
