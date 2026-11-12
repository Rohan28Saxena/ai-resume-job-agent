import * as React from "react"
import { User } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function ProfilePage() {
  return (
    <DashboardPlaceholder
      title="Profile"
      description="Manage your professional background, skills, career preferences, target roles, and work authorization."
      icon={User}
      badgeText="Candidate Profile"
    />
  )
}

