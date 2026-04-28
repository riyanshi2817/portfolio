import { cn } from "@/lib/utils"

type SummaryStatCardProps = {
  icon: React.ReactNode
  label: string
  value: number | string
  className?: string
}

export function SummaryStatCard({ icon, label, value, className }: SummaryStatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl bg-muted/50 p-4 border border-border/50",
        className
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
