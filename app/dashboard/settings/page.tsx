import * as React from "react"
import { Settings } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function SettingsPage() {
  return (
    <DashboardPlaceholder
      title="Profile Settings"
      description="Configure your account preferences, notification alerts, connected accounts, and security settings."
      icon={Settings}
      badgeText="Account & Preferences"
    />
  )
}

