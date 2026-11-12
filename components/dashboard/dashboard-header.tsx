"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, Zap, ShieldCheck } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"

const routeTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/jobs": "Jobs",
  "/dashboard/resume": "Resume",
  "/dashboard/profile": "Profile",
  "/dashboard/applications": "Application Status",
  "/dashboard/application-status": "Application Status",
  "/dashboard/billing": "Billing / Credits",
  "/dashboard/settings": "Profile Settings",
}

interface DashboardHeaderProps {
  user?: {
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()

  // Find matching title or default to section name
  const currentTitle =
    routeTitles[pathname] ||
    pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ||
    "Dashboard"

  const capitalizedTitle =
    currentTitle.charAt(0).toUpperCase() + currentTitle.slice(1)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink
                render={
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  />
                }
              >
                <Sparkles className="size-3 text-primary" />
                <span>JobBuddy AI</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathname !== "/dashboard" && (
              <>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-medium text-foreground">
                    {capitalizedTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-3">
        {/* Credits Badge Button */}
        <Link
          href="/dashboard/billing"
          className="group inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          title="Click to manage billing & credits"
        >
          <Zap className="size-3 fill-current group-hover:scale-110 transition-transform" />
          <span>85 Credits</span>
        </Link>

        {/* Protection / Auth badge */}
        <div className="hidden md:inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 border rounded-md px-2 py-0.5">
          <ShieldCheck className="size-3 text-emerald-500" />
          <span>Protected Session</span>
        </div>
      </div>
    </header>
  )
}

