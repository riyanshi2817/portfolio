import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/hooks/use-profile"
import type { IconProps } from "@phosphor-icons/react"
import {
  UserIcon,
  PencilIcon,
  BriefcaseIcon,
  CalendarIcon,
  IdentificationCardIcon,
  WrenchIcon,
  HeartIcon,
  LinkIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type ProfileViewProps = {
  profile: Profile
  role?: string
  onEdit: () => void
  className?: string
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<IconProps>
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5 text-muted-foreground" weight="duotone" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate block"
          >
            {value || "—"}
          </a>
        ) : (
          <p className="text-sm font-medium">{value || "—"}</p>
        )}
      </div>
    </div>
  )
}

export function ProfileView({ profile, role, onEdit, className }: ProfileViewProps) {
  const skillsStr = profile.skills?.length ? profile.skills.join(", ") : ""
  const interestsStr = profile.interests?.length ? profile.interests.join(", ") : ""

  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)}>
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
            <UserIcon className="size-8 text-primary" weight="duotone" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {role && (
                <Badge variant="secondary" className="text-xs">
                  {role}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Card className="overflow-hidden shadow-sm pt-0!">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <BriefcaseIcon className="size-4 text-primary" weight="duotone" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 py-4 sm:grid-cols-2">
            <InfoBlock
              icon={BriefcaseIcon}
              label="Branch"
              value={profile.branch}
            />
            <InfoBlock
              icon={CalendarIcon}
              label="Year"
              value={String(profile.year)}
            />
            <InfoBlock
              icon={IdentificationCardIcon}
              label="Section"
              value={profile.section}
            />
            <InfoBlock
              icon={IdentificationCardIcon}
              label="Roll Number"
              value={profile.rollNumber}
            />
            <InfoBlock
              icon={WrenchIcon}
              label="Skills"
              value={skillsStr}
            />
            <InfoBlock
              icon={HeartIcon}
              label="Interests"
              value={interestsStr}
            />
            <InfoBlock
              icon={LinkIcon}
              label="Resume Link"
              value={profile.resumeLink ?? ""}
              href={profile.resumeLink}
            />
            <InfoBlock
              icon={LinkIcon}
              label="Portfolio Link"
              value={profile.portfolioLink ?? ""}
              href={profile.portfolioLink}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <PencilIcon className="size-4" weight="duotone" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
