import { Link } from "react-router"
import { ArrowRightIcon, LinkSimpleIcon } from "@phosphor-icons/react"
import { DashboardCard } from "./DashboardCard"
import { Button } from "@/components/ui/button"
import type { QuickLink } from "@/hooks/use-dashboard"

type QuickLinksCardProps = {
  quickLinks: QuickLink[]
}

export function QuickLinksCard({ quickLinks }: QuickLinksCardProps) {
  if (!quickLinks?.length) return null

  return (
    <DashboardCard
      title="Quick Links"
      icon={<LinkSimpleIcon className="size-5 text-cyan-600" weight="bold" />}
      variant="cyan"
    >
      <div className="flex flex-col gap-2">
        {quickLinks.map((link) => (
          <Button key={link.path} variant="outline" size="sm" asChild>
            <Link to={link.path} className="justify-between">
              {link.label}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        ))}
      </div>
    </DashboardCard>
  )
}
