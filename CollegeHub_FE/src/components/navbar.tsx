import { useNavigate, useLocation } from "react-router"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, UserIcon, SignOutIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthMe, useLogout } from "@/hooks/use-auth"
import { NotificationDropdown } from "@/components/notification-dropdown"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const { data } = useAuthMe()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    })
  }

  const location = useLocation()
  const isDashboard = location.pathname === "/dashboard"

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4">
      {isDashboard ? (
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 rounded-full bg-muted/50 border-0"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <SunIcon className="size-4 dark:hidden" />
          <MoonIcon className="hidden size-4 dark:block" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2" aria-label="User menu">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {data?.user?.email}
              </span>
              <UserIcon className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {data?.user?.email && (
              <>
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  {data.user.email}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                handleLogout()
              }}
              disabled={logout.isPending}
            >
              <SignOutIcon />
              {logout.isPending ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
