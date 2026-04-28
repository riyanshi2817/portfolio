import { Outlet } from "react-router"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"

export function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 min-w-0 flex-col">
        <Navbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-background p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
