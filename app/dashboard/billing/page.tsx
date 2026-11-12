import * as React from "react"
import { CreditCard } from "lucide-react"
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder"

export default function BillingPage() {
  return (
    <DashboardPlaceholder
      title="Billing & Credits"
      description="View your active subscription plan, available AI usage credits, transaction history, and top-up options."
      icon={CreditCard}
      badgeText="Credits & Plans"
    />
  )
}

