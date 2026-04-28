import { useState, useEffect } from "react"
import { NavLink, useLocation, Link } from "react-router"
import {
  HouseIcon,
  UsersIcon,
  BookOpenIcon,
  RobotIcon,
  ListChecksIcon,
  TreeStructureIcon,
  CalendarIcon,
  UserIcon,
  GearIcon,
  CaretDownIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { useAuthMe } from "@/hooks/use-auth"
import { SIDEBAR_SECTIONS, type SidebarSection } from "@/config/sidebar-nav"

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: HouseIcon,
  community: UsersIcon,
  academics: BookOpenIcon,
  ai: RobotIcon,
  quizzes: ListChecksIcon,
  clubs: TreeStructureIcon,
  events: CalendarIcon,
  profile: UserIcon,
  admin: GearIcon,
}

function filterSectionsByRole(
  sections: SidebarSection[],
  role: "STUDENT" | "FACULTY" | "ADMIN" | undefined
): SidebarSection[] {
  return sections.filter((section) => {
    if (!section.roles) return true
    return role && section.roles.includes(role)
  })
}

export function Sidebar() {
  const { data } = useAuthMe()
  const userRole = data?.user?.role
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const path = location.pathname
    const expanded = new Set<string>()
    for (const section of SIDEBAR_SECTIONS) {
      if (section.subSections?.some((s) => path.startsWith(s.route))) {
        expanded.add(section.id)
      }
    }
    return expanded
  })

  useEffect(() => {
    const path = location.pathname
    setExpandedSections((prev) => {
      const next = new Set(prev)
      for (const section of SIDEBAR_SECTIONS) {
        if (section.subSections?.some((s) => path.startsWith(s.route))) {
          next.add(section.id)
        }
      }
      return next
    })
  }, [location.pathname])

  const filteredSections = filterSectionsByRole(SIDEBAR_SECTIONS, userRole)

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <aside className="sidebar-fixed flex h-full w-56 shrink-0 flex-col border-r border-(--sidebar-fixed-border) bg-(--sidebar-fixed-bg) text-(--sidebar-fixed-text)">
      <Link
        to="/dashboard"
        className="shrink-0 h-20 flex flex-col justify-center border-b border-(--sidebar-fixed-border) px-6 pt-1 text-2xl font-semibold text-(--sidebar-fixed-text)"
      >
        CollegeHub
      </Link>
      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
        {filteredSections.map((section) => {
          const Icon = SECTION_ICONS[section.id] ?? HouseIcon
          const hasSubSections = section.subSections && section.subSections.length > 0
          const isExpanded = expandedSections.has(section.id)
          const isActive =
            location.pathname === section.route ||
            section.subSections?.some((s) => location.pathname.startsWith(s.route))

          if (hasSubSections) {
            return (
              <div key={section.id} className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent-sidebar-new text-(--sidebar-fixed-selected-text)  dark:text-white"
                      : "text-(--sidebar-fixed-text) hover:bg-white/20"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{section.label}</span>
                  {isExpanded ? (
                    <CaretDownIcon className="size-4 shrink-0" />
                  ) : (
                    <CaretRightIcon className="size-4 shrink-0" />
                  )}
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-in-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-(--sidebar-fixed-border) pl-2 pt-0.5">
                      {section.subSections!.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={sub.route}
                          className={({ isActive: subActive }) =>
                            cn(
                              "rounded-sm px-2 py-1.5 text-sm font-medium transition-all duration-200 ease-in-out",
                              subActive
                                ? "bg-accent-sidebar-new text-(--sidebar-fixed-selected-text) dark:text-white"
                                : "text-(--sidebar-fixed-text) hover:bg-white/20 opacity-90"
                            )
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <NavLink
              key={section.id}
              to={section.route}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-sidebar-new text-(--sidebar-fixed-selected-text) dark:text-white"
                    : "text-(--sidebar-fixed-text) hover:bg-white/20"
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              {section.label}
            </NavLink>
          ) 
        })}
      </nav>
    </aside>
  )
}
