"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  FileText,
  User,
  Clock,
  Sparkles,
  CreditCard,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
  }
}

// Main navigation items requested
const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase,
    badge: "24",
  },
  {
    title: "Resume",
    href: "/dashboard/resume",
    icon: FileText,
    badge: "94%",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Application Status",
    href: "/dashboard/applications",
    icon: Clock,
    badge: "Active",
  },
]

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  const displayName = user?.name || user?.email?.split("@")[0] || "User"
  const userInitials = displayName.slice(0, 2).toUpperCase()

  // Credits data (mocked for professional dashboard state)
  const creditsRemaining = 85
  const totalCredits = 100
  const creditsPercentage = Math.round((creditsRemaining / totalCredits) * 100)

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header: Logo and App Name JobBuddy AI */}
      <SidebarHeader className="border-b border-sidebar-border/60 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="JobBuddy AI"
              render={<Link href="/dashboard" />}
              className="gap-3 data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground shadow-sm ring-1 ring-primary/20">
                <Sparkles className="size-4.5" />
              </div>
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-sidebar-foreground truncate">
                    JobBuddy AI
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1 text-[9px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
                  >
                    AI
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">
                  AI Career Copilot
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation: Jobs, Resume, Profile, Application Status */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-2 py-1.5">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      className={isActive ? "font-medium" : "text-muted-foreground hover:text-foreground"}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section: Credits display, Billing/Credits, Profile Settings */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-2 gap-2">
        {/* Credits Display Section */}
        {/* Expanded View: Dedicated Modern Card */}
        <div className="group-data-[collapsible=icon]:hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-b from-sidebar-accent/50 to-sidebar-accent/20 p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex size-5 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Zap className="size-3 fill-current" />
              </div>
              <span className="text-xs font-semibold text-sidebar-foreground">Credits Balance</span>
            </div>
            <span className="text-xs font-bold text-foreground font-mono">
              {creditsRemaining}
              <span className="text-[11px] font-normal text-muted-foreground">/{totalCredits}</span>
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-sidebar-border/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-primary transition-all duration-500 ease-out"
                style={{ width: `${creditsPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{creditsPercentage}% remaining</span>
              <span>15 used this cycle</span>
            </div>
          </div>

          <div className="border-t border-sidebar-border/50 pt-2 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Monthly Pro Plan</span>
            <Link
              href="/dashboard/billing"
              className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-0.5"
            >
              Get more <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Collapsed View: Icon-only credits tooltip */}
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    href="/dashboard/billing"
                    className="flex size-8 items-center justify-center rounded-lg text-amber-500 hover:bg-sidebar-accent transition-colors"
                  />
                }
              >
                <Zap className="size-4 fill-current" />
                <span className="sr-only">Credits: {creditsRemaining}/{totalCredits}</span>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <div className="text-xs space-y-1">
                  <p className="font-semibold">{creditsRemaining} / {totalCredits} Credits</p>
                  <p className="text-[10px] text-muted-foreground">Click to view Billing & Credits</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator className="my-0.5" />

        {/* Footer Navigation Options: Billing / Credits & Profile Settings */}
        <SidebarMenu>
          {/* Billing / Credits */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing / Credits"
              isActive={pathname.startsWith("/dashboard/billing")}
              render={<Link href="/dashboard/billing" />}
              className={pathname.startsWith("/dashboard/billing") ? "font-medium" : "text-muted-foreground hover:text-foreground"}
            >
              <CreditCard className="size-4 shrink-0" />
              <span className="truncate">Billing / Credits</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Profile Settings */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Profile Settings"
              isActive={pathname.startsWith("/dashboard/settings")}
              render={<Link href="/dashboard/settings" />}
              className={pathname.startsWith("/dashboard/settings") ? "font-medium" : "text-muted-foreground hover:text-foreground"}
            >
              <Settings className="size-4 shrink-0" />
              <span className="truncate">Profile Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* User Account Bar & Sign Out */}
        <div className="mt-1 rounded-lg border border-sidebar-border/40 bg-sidebar-accent/30 p-1.5 flex items-center justify-between gap-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar size="sm" className="size-7 shrink-0">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden text-left">
              <span className="text-xs font-semibold leading-tight text-sidebar-foreground truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[120px]">
                {user?.email || "Signed in"}
              </span>
            </div>
          </div>

          <form action="/auth/signout" method="POST" className="group-data-[collapsible=icon]:hidden">
            <button
              type="submit"
              title="Sign out"
              className="size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors"
            >
              <LogOut className="size-3.5" />
              <span className="sr-only">Sign out</span>
            </button>
          </form>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

