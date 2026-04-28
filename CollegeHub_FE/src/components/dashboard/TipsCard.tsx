import { LightbulbIcon } from "@phosphor-icons/react"
import { DashboardCard } from "./DashboardCard"

type TipsCardProps = {
  tips: string[]
}

export function TipsCard({ tips }: TipsCardProps) {
  if (!tips?.length) return null

  return (
    <DashboardCard
      title="Tips"
      icon={<LightbulbIcon className="size-5 text-amber-500" weight="fill" />}
      variant="amber"
    >
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <LightbulbIcon className="size-4 shrink-0 text-amber-500 mt-0.5" weight="fill" />
            <span className="text-muted-foreground">{tip}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}
