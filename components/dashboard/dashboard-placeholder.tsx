import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardPlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  badgeText?: string
  actionLabel?: string
}

export function DashboardPlaceholder({
  title,
  description,
  icon: Icon,
  badgeText = "Placeholder",
  actionLabel,
}: DashboardPlaceholderProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <Badge variant="secondary" className="text-[11px] font-medium">
              {badgeText}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Blank Canvas Area */}
      <div className="relative rounded-2xl border border-dashed border-border/80 bg-muted/15 p-12 md:p-16 flex flex-col items-center justify-center text-center min-h-[460px] transition-all">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner mb-4">
          <Icon className="size-7" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title} Page
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mt-1.5 leading-relaxed">
          {description} This section is currently blank and ready for content implementation.
        </p>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/80 font-mono bg-background/80 border rounded-lg px-3 py-1.5 shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Module ready for implementation</span>
        </div>
      </div>
    </div>
  )
}

