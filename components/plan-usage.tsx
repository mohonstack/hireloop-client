"use client"

// Application usage strip — "7/10" + progress bar for free users, an
// unlimited bar for premium. Used on the job details header card and on the
// seeker My Applications page so the limit is visible before it bites.

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { PlanUsage as PlanUsageData } from "@/lib/plan"

/** Progress tones: normal → amber near the limit → red once it is hit. */
const INDICATOR_TONE = {
  normal: "[&_[data-slot=progress-indicator]]:bg-[#5C53FE]",
  warning: "[&_[data-slot=progress-indicator]]:bg-[#F59E0B]",
  danger: "[&_[data-slot=progress-indicator]]:bg-[#EF4444]",
  premium: "[&_[data-slot=progress-indicator]]:bg-[#22C55E]",
} as const

const VALUE_TONE = {
  normal: "text-[#A0A0AB]",
  warning: "text-[#F59E0B]",
  danger: "text-[#EF4444]",
  premium: "text-[#22C55E]",
} as const

export function PlanUsage({
  plan,
  used,
  limit,
  className,
}: PlanUsageData & { className?: string }) {
  const unlimited = plan === "premium" || limit === null
  const capped = unlimited ? used : Math.min(used, limit ?? 0)
  const ratio = unlimited || !limit ? 1 : capped / limit

  const tone = unlimited
    ? "premium"
    : ratio >= 1
      ? "danger"
      : ratio >= 0.8
        ? "warning"
        : "normal"

  return (
    <Progress
      value={Math.round(ratio * 100)}
      max={100}
      aria-label={
        unlimited
          ? `Premium plan, ${used} applications submitted`
          : `Free plan, ${used} of ${limit} applications used`
      }
      className={cn(
        "w-full",
        "[&_[data-slot=progress-track]]:bg-[#222228]",
        INDICATOR_TONE[tone],
        className
      )}
    >
      {/* Rendered as children so the labels sit above the bar; the
                primitive's own Value only ever prints a percentage. */}
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-[13px] text-[#A0A0AB]">
          {unlimited ? "Premium plan" : "Free plan"}
        </span>
        <span
          className={cn(
            "text-[13px] font-medium tabular-nums",
            VALUE_TONE[tone]
          )}
        >
          {unlimited ? `Unlimited · ${used} applied` : `${capped}/${limit}`}
        </span>
      </div>
    </Progress>
  )
}
