import { useAuthMe } from "@/hooks/use-auth"

type StudentGuardProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function StudentGuard({ children, fallback }: StudentGuardProps) {
  const { data, isLoading } = useAuthMe()

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    )
  }

  if (data?.user?.role !== "STUDENT") {
    return (
      fallback ?? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
          <p className="text-sm font-medium">Chats are available for students only.</p>
          <p className="text-xs">Create a student profile to access group chats.</p>
        </div>
      )
    )
  }

  return <>{children}</>
}
