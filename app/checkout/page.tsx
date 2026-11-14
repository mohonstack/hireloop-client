// Checkout — the destination of the Apply Now premium gate
// (`app/browse-jobs/[id]/_components/job-header-card.tsx` pushes here when a
// free seeker has already used up their application limit).
//
// Payments are not wired up yet, so the primary action reports that instead
// of pretending to charge a card. The gate's own condition lives in the
// header card and is intentionally not duplicated here.

"use client"

import Link from "next/link"
import { ArrowLeft, Check, Sparkles } from "lucide-react"

import { toast } from "@/components/ui/toast"

const includedPerks = [
  "Unlimited job applications",
  "Applications tracked in one place",
  "Priority access to new listings",
]

export default function CheckoutPage() {
  const handleContinue = () => {
    toast.add({
      type: "warning",
      title: "Payments not connected yet",
      description:
        "Stripe checkout has not been set up, so no charge was made.",
    })
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
      <Link
        href="/browse-jobs"
        className="inline-flex items-center gap-2 text-sm text-[#A0A0AB] transition-colors hover:text-[#EDEDEF]"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Back to jobs
      </Link>

      <section className="mt-6 border border-white/10 bg-[#141418] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]">
        <span className="brand-chip inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1F] px-3 py-1 text-xs font-medium text-[#A0A0AB]">
          <Sparkles aria-hidden className="size-3.5" />
          HireLoop Premium
        </span>

        <h1 className="mt-5 text-[32px] leading-10 font-semibold tracking-[-0.02em] text-[#EDEDEF]">
          Keep applying without limits
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#A0A0AB]">
          You have reached the application limit on the free plan. Upgrade to
          Premium to keep applying to as many jobs as you like.
        </p>

        <ul className="mt-6 flex list-none flex-col gap-3">
          {includedPerks.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-3 text-base text-[#EDEDEF]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1A1A1F] text-[#A0A0AB]">
                <Check aria-hidden className="size-3.5" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleContinue}
            className="h-12 rounded-lg bg-[#FAFAFA] px-6 text-base font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
          >
            Continue to payment
          </button>

          <Link
            href="/browse-jobs"
            className="flex h-12 items-center justify-center rounded-lg border border-white/10 bg-[#222228] px-6 text-base font-medium text-[#E5E2E3] transition-colors hover:border-white/25 hover:text-white"
          >
            Stay on the free plan
          </Link>
        </div>

        <p className="mt-4 text-sm text-[#6E6E78]">
          No payment details are collected on this page yet.
        </p>
      </section>
    </main>
  )
}
