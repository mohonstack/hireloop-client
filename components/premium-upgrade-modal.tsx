"use client"

// Premium Upgrade modal — opened when a free seeker has used every included
// application. Shown instead of submitting: the Apply button stays put, the
// request is never sent, and the server would reject it anyway.

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PlanUsage } from "@/components/plan-usage"
import {
  FREE_APPLICATION_LIMIT,
  type PlanUsage as PlanUsageData,
} from "@/lib/plan"

export function PremiumUpgradeModal({
  open,
  onOpenChange,
  usage,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Free-plan usage; `null` while it is still loading. */
  usage: PlanUsageData | null
}) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Free plan limit reached</DialogTitle>
          <DialogDescription>
            You have used all {FREE_APPLICATION_LIMIT} free job applications.
            Upgrade to Premium to keep applying to as many jobs as you like.
          </DialogDescription>
        </DialogHeader>

        {usage ? (
          <div className="rounded-lg border border-white/10 bg-[#141418] p-4">
            <PlanUsage {...usage} />
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              router.push("/checkout")
            }}
          >
            View Premium plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
