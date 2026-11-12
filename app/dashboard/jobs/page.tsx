import * as React from "react"
import { Briefcase } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function JobsPage() {
  return (
    <DashboardPlaceholder
      title="Jobs"
      description="Explore curated job listings, AI match score rankings, and automated role discovery customized to your experience."
      icon={Briefcase}
      badgeText="Job Search & Matching"
    />
  )
}

