"use client"

import { Trophy, Users, User, Shield, Cloud } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    icon: Trophy,
    href: "/matches",
    label: "Matches",
  },
  {
    icon: Users,
    href: "/teams",
    label: "Teams",
  },
  {
    icon: User,
    href: "/players",
    label: "Players",
  },
  {
    icon: Shield,
    href: "/officials",
    label: "Match Officials",
  },
  {
    icon: Cloud,
    href: "/weather",
    label: "Weather",
  },
]

export function CricketSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-16 flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Trophy className="h-4 w-4" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
              )}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
