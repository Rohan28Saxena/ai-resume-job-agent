import * as React from "react"
import { LayoutDashboard } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function DashboardOverviewPage() {
  return (
    <DashboardPlaceholder
      title="Dashboard Overview"
      description="Welcome to JobBuddy AI. Your career command center for AI-powered resume building, automated job matching, and application tracking."
      icon={LayoutDashboard}
      badgeText="Overview"
    />
  )
}
