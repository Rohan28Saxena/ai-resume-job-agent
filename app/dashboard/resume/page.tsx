import * as React from "react"
import { FileText } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function ResumePage() {
  return (
    <DashboardPlaceholder
      title="Resume"
      description="Build, optimize, and tailor your resumes with AI. Review ATS scores, keyword targeting, and version management."
      icon={FileText}
      badgeText="AI Resume Studio"
    />
  )
}

