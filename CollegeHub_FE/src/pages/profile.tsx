import { useState } from "react"
import { UserIcon } from "@phosphor-icons/react"
import { useAuthMe } from "@/hooks/use-auth"
import { useProfileMe } from "@/hooks/use-profile"
import { ProfileView } from "@/components/profile/ProfileView"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { ProfileExportCsv } from "@/components/profile/ProfileExportCsv"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const { data: authData, isLoading: authLoading, error: authError } = useAuthMe()
  const role = authData?.user?.role
  const isStudent = role === "STUDENT"

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfileMe(isStudent)

  if (authLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-muted-foreground">
        <UserIcon className="size-12 animate-pulse opacity-50" weight="duotone" />
        <p className="text-sm">Loading...</p>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-destructive">
        <p className="text-sm font-medium">
          {authError instanceof Error ? authError.message : "Failed to load user"}
        </p>
      </div>
    )
  }

  if (!isStudent) {
    return <ProfileExportCsv />
  }

  if (profileLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-muted-foreground">
        <UserIcon className="size-12 animate-pulse opacity-50" weight="duotone" />
        <p className="text-sm">Loading profile...</p>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-destructive">
        <p className="text-sm font-medium">
          {profileError instanceof Error ? profileError.message : "Failed to load profile"}
        </p>
      </div>
    )
  }

  if (isEditing && profile) {
    return (
      <ProfileForm
        mode="edit"
        initialProfile={profile}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  if (profile) {
    return (
      <ProfileView
        profile={profile}
        role={role}
        onEdit={() => setIsEditing(true)}
      />
    )
  }

  return (
    <ProfileForm
      mode="create"
      onSuccess={() => {
        setIsEditing(false)
      }}
    />
  )
}
