import * as React from "react"
import { Clock } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function ApplicationsPage() {
  return (
    <DashboardPlaceholder
      title="Application Status"
      description="Track the real-time status of your job applications, interviews, recruiter responses, and follow-up deadlines."
      icon={Clock}
      badgeText="Application Tracker"
    />
  )
}

