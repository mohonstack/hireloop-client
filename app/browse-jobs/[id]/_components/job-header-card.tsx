// Header card for the job details page — from the Figma
// "Public / Job Details › Header Section": logo tile, title, company
// line, and the bookmark + Apply Now actions.
//
// Apply Now is the entry point of the Free vs Premium gate: usage and the
// duplicate check load once the seeker's session is known, the front end
// blocks early (modal / disabled button) and Express re-checks auth, plan,
// quota and duplicates on POST /applications.
"use client"

import { useEffect, useState } from "react"
import { Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import type { JobRow } from "@/lib/types/jobs"
import {
  createApplication,
  hasApplied,
  ApplicationError,
} from "@/lib/api/applications"
import { getUserPlan } from "@/lib/api/user"
import type { ApplicationFormData } from "@/lib/types/applications"
import type { PlanInfo } from "@/lib/plan"
import { hasReachedLimit } from "@/lib/plan"
import { PlanUsage } from "@/components/plan-usage"
import { PremiumUpgradeModal } from "@/components/premium-upgrade-modal"

export function JobHeaderCard({ job }: { job: JobRow }) {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const userId = user?.id
  const isSeeker = user?.role === "seeker"

  const [usage, setUsage] = useState<PlanInfo | null>(null)
  const [applied, setApplied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  // Usage + duplicate status are advisory UI; the server enforces both.
  useEffect(() => {
    if (!userId || !isSeeker) return

    let cancelled = false
    ;(async () => {
      try {
        const [plan, alreadyApplied] = await Promise.all([
          getUserPlan(userId),
          hasApplied(userId, job._id),
        ])
        if (!cancelled) {
          setUsage(plan)
          setApplied(alreadyApplied)
        }
      } catch {
        // Leave usage null — submit still reports LIMIT_REACHED.
      }
    })()

    return () => {
      cancelled = true
    }
  }, [userId, isSeeker, job._id])

  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
      return
    }

    if (!isSeeker) {
      toast.error("Only job seekers can apply", {
        description: "Sign in with a seeker account to apply for this job.",
      })
      return
    }

    if (submitting) return

    if (applied) {
      toast.info("Already applied", {
        description: "You have already applied to this job.",
      })
      return
    }

    // Front-end enforcement — never send the request once the quota is spent.
    if (usage && hasReachedLimit(usage)) {
      setUpgradeOpen(true)
      return
    }

    setSubmitting(true)
    try {
      const application: ApplicationFormData = {
        jobId: job._id,
        userId: user.id,
        email: user.email,
        jobTitle: job.title,
        companyName: job.companyName,
        jobType: job.jobType,
        isRemote: job.isRemote,
        location: job.location,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        salaryFrequency: job.salaryFrequency,
        deadline: job.deadline,
        appliedAt: new Date().toISOString(),
        status: "applied",
        archived: false,
      }

      const result = await createApplication(application)

      if (result.insertedId) {
        setApplied(true)
        setUsage((current) =>
          current ? { ...current, used: current.used + 1 } : current
        )
        toast.success("Application submitted", {
          description: "Your application has been submitted successfully.",
        })
        router.push("/browse-jobs")
      }
    } catch (error) {
      if (error instanceof ApplicationError) {
        if (error.code === "LIMIT_REACHED") {
          setUpgradeOpen(true)
          return
        }
        if (error.code === "ALREADY_APPLIED") {
          setApplied(true)
          toast.error("Already applied", {
            description: "You have already applied to this job.",
          })
          return
        }
        if (error.code === "UNAUTHORIZED") {
          router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
          return
        }
        toast.error("Could not apply", { description: error.message })
        return
      }

      toast.error("Could not apply", {
        description: "The application server could not be reached.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const applyLabel = applied
    ? "Applied"
    : submitting
      ? "Applying…"
      : "Apply Now"

  return (
    <section className="border border-white/10 bg-[#141418] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 flex-wrap items-start gap-6">
          {/* Company logo tile: 80px tile, 70px inner logo (Figma) */}
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F]">
            <span className="brand-chip flex size-[70px] items-center justify-center rounded-xl text-2xl font-semibold">
              {job.companyName.charAt(0)}
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-[32px] leading-10 font-semibold tracking-[-0.02em] text-[#EDEDEF]">
              {job.title}
            </h1>

            {/* Company line with dot separator */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-[22px] font-semibold text-[#A0A0AB]">
                {job.companyName}
              </span>
              <span aria-hidden className="size-1 rounded-full bg-[#8E9192]" />
              <span className="text-base text-[#EDEDEF] capitalize">
                {job.location}
                {job.isRemote ? " (Remote)" : ""}
              </span>
              <span aria-hidden className="size-1 rounded-full bg-[#8E9192]" />
              <span className="text-base text-[#EDEDEF] capitalize">
                {job.jobType}
              </span>

              {/* Placeholder for a "Verified Employer" badge when the
                                data model gains an employer verification flag. */}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`Bookmark ${job.title}`}
            // TODO: wire saving/bookmarking.
            className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#222228] text-[#E5E2E3] transition-colors hover:border-white/25 hover:text-white"
          >
            <Bookmark aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleApplyNow}
            disabled={applied || submitting}
            className="h-12 rounded-lg bg-[#FAFAFA] px-4 text-base font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-[#222228] disabled:text-[#6E6E78] disabled:shadow-none"
          >
            {applyLabel}
          </button>
        </div>
      </div>

      {/* Free/Premium usage — visible before the limit is hit. */}
      {usage && isSeeker ? (
        <div className="mt-6 border-t border-white/10 pt-4">
          <PlanUsage plan={usage.plan} used={usage.used} limit={usage.limit} />
        </div>
      ) : null}

      <PremiumUpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        usage={usage}
      />
    </section>
  )
}
