"use client"

// Seeker Home — the dashboard landing page from the Figma "Job Seeker"
// frame, matching its section set exactly: top app bar (search + quick
// actions), the four-card stats row, the Recent Activity feed, and the
// compose FAB.
//
// Data arrives as props from the page's server-side load: the seeker's
// applications (real timestamps, real statuses) and the current job board
// (used for "new job alert" rows, dated from the ObjectId since the jobs
// API returns no date field).

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/formatters"
import type {
  ApplicationRow,
  ApplicationStatus,
} from "@/lib/types/applications"
import type { JobRow } from "@/lib/types/jobs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Bookmark,
  Briefcase,
  CalendarDays,
  Mail,
  Plus,
  Search,
  Send,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react"

const cardShadow =
  "shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]"

const card = cn("border border-white/10 bg-[#141418]", cardShadow)

/** "Alex Sterling" → "AS", used when the account has no photo. */
function initialsOf(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  )
}

/**
 * The jobs API returns no date field, but an ObjectId's first four bytes
 * are a Unix timestamp — enough to order and relativise job alerts.
 */
function postedAt(objectId: string): number | null {
  if (!/^[0-9a-f]{24}$/i.test(objectId)) return null
  return Number.parseInt(objectId.slice(0, 8), 16) * 1000
}

/** Feed wording — the design writes 'Under Review', the table writes 'Review'. */
const FEED_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  review: "Under Review",
  interview: "Interview Scheduled",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  offered: "Offered",
}

type Stat = {
  label: string
  value: string
  Icon: LucideIcon
  iconTone: string
}

type FeedItem = {
  id: string
  Icon: LucideIcon
  iconTone: string
  prefix: string
  /** Rendered amber inside quotes, like the design's 'Under Review'. */
  highlighted?: string
  time: string
  /** Epoch ms used to order the merged feed. */
  at: number
  href: string
}

export function SeekerHome({
  name,
  image,
  applications,
  jobs,
}: {
  name: string
  /** Photo URL from the account; null falls back to initials. */
  image?: string | null
  applications: readonly ApplicationRow[]
  jobs: readonly JobRow[]
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const count = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status).length

  // Saved Jobs has no backend yet (the job-card bookmark is still a TODO),
  // so the count is honestly zero rather than invented.
  const stats: Stat[] = [
    {
      label: "Saved Jobs",
      value: "0",
      Icon: Bookmark,
      iconTone: "text-[#EDEDEF]",
    },
    {
      label: "Applications Submitted",
      value: String(applications.length),
      Icon: Send,
      iconTone: "text-[#EDEDEF]",
    },
    {
      label: "Interviews Scheduled",
      value: String(count("interview")),
      Icon: CalendarDays,
      iconTone: "text-[#F59E0B]",
    },
    {
      label: "Offers Received",
      value: String(count("offered")),
      Icon: Trophy,
      iconTone: "text-[#22C55E]",
    },
  ]

  // --- Recent Activity -------------------------------------------------
  // Two real row types: application updates (status changes) and job
  // alerts for listings the seeker has not applied to yet. There is no
  // messaging backend, so the design's "new message" rows are absent
  // rather than faked.
  const appliedJobIds = new Set(applications.map((app) => app.jobId))

  const applicationItems: FeedItem[] = applications.map((app) => ({
    id: `application-${app._id}`,
    Icon: Briefcase,
    iconTone: "text-[#EDEDEF]",
    prefix: `Application for ${app.jobTitle} at ${app.companyName} updated to `,
    highlighted: `'${FEED_LABEL[app.status]}'`,
    time: formatRelativeTime(app.appliedAt),
    at: Date.parse(app.appliedAt) || 0,
    href: `/browse-jobs/${app.jobId}`,
  }))

  const jobAlertItems: FeedItem[] = jobs
    .filter((job) => !appliedJobIds.has(job._id))
    .map((job) => ({ job, at: postedAt(job._id) }))
    .filter((entry): entry is { job: JobRow; at: number } => entry.at !== null)
    .sort((a, b) => b.at - a.at)
    .slice(0, 2)
    .map(({ job, at }) => ({
      id: `job-alert-${job._id}`,
      Icon: Sparkles,
      iconTone: "text-[#22C55E]",
      prefix: `New Job Alert: ${job.title} at ${job.companyName} matches your profile.`,
      time: formatRelativeTime(new Date(at).toISOString()),
      at,
      href: `/browse-jobs/${job._id}`,
    }))

  const feed = [...applicationItems, ...jobAlertItems]
    .sort((a, b) => b.at - a.at)
    .slice(0, 6)

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    router.push(
      trimmed ? `/browse-jobs?q=${encodeURIComponent(trimmed)}` : "/browse-jobs"
    )
  }

  return (
    <div>
      {/* Top app bar */}
      <header className="flex flex-wrap items-center gap-3 sm:gap-4">
        <form
          onSubmit={submitSearch}
          role="search"
          className="relative w-full sm:w-[280px]"
        >
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6E6E78]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for opportunities..."
            aria-label="Search for opportunities"
            className={cn(
              "h-10 w-full rounded-lg border border-white/10 bg-[#141418]",
              "pr-3 pl-9 text-[13px] text-[#EDEDEF]",
              "placeholder:text-[#6E6E78]",
              "focus:border-[#5C53FE] focus:outline-none"
            )}
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Mail + notifications are design-only for now: there is
                        no messaging or notification endpoint to open. */}
          <button
            type="button"
            aria-label="Messages"
            className="flex size-9 items-center justify-center rounded-lg text-[#A0A0AB] transition-colors hover:bg-[#1A1A1F] hover:text-[#EDEDEF]"
          >
            <Mail aria-hidden className="size-[18px]" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-lg text-[#A0A0AB] transition-colors hover:bg-[#1A1A1F] hover:text-[#EDEDEF]"
          >
            <Bell aria-hidden className="size-[18px]" />
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#EF4444] ring-2 ring-[#101010]"
            />
          </button>
          <Link
            href="/dashboard/seeker/settings"
            aria-label="Your settings"
            className="ml-1"
          >
            <Avatar className="size-8 border border-white/10">
              <AvatarImage src={image ?? undefined} alt={name} />
              <AvatarFallback className="bg-[#222228] text-[11px] font-medium text-[#EDEDEF]">
                {initialsOf(name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Stats row */}
      <dl className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, Icon, iconTone }) => (
          <div key={label} className={cn(card, "rounded-lg px-5 py-4")}>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-[13px] text-[#A0A0AB]">{label}</dt>
              <Icon
                aria-hidden
                className={cn("size-[18px] shrink-0", iconTone)}
              />
            </div>
            <dd className="mt-5 text-[28px] leading-8 font-semibold text-[#EDEDEF]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Recent Activity */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-[#EDEDEF]">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/seeker/applications"
            className="text-[13px] text-[#A0A0AB] transition-colors hover:text-[#EDEDEF] hover:underline"
          >
            View All Activity
          </Link>
        </div>

        {feed.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {feed.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    card,
                    "flex items-center gap-3 rounded-lg px-4 py-3.5",
                    "transition-colors hover:bg-[#1A1A1F]"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center",
                      "rounded-full border border-white/10 bg-[#1A1A1F]",
                      item.iconTone
                    )}
                  >
                    <item.Icon className="size-4" />
                  </span>

                  <p className="min-w-0 flex-1 text-[13px] leading-5 text-[#EDEDEF]">
                    {item.prefix}
                    {item.highlighted ? (
                      <span className="text-[#F59E0B]">{item.highlighted}</span>
                    ) : null}
                  </p>

                  <span className="shrink-0 text-xs text-[#6E6E78]">
                    {item.time}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={cn(card, "mt-4 rounded-lg px-6 py-10 text-center")}>
            <p className="text-[13px] text-[#A0A0AB]">
              No recent activity yet — application updates and job alerts will
              show up here.
            </p>
            <Link
              href="/dashboard/seeker/jobs"
              className="mt-2 inline-block text-[13px] font-medium text-[#8B85FF] hover:underline"
            >
              Browse jobs to get started
            </Link>
          </div>
        )}
      </section>

      {/* Compose FAB — the design's "Button - FAB" on home dashboards. */}
      <Link
        href="/dashboard/seeker/jobs"
        aria-label="Browse jobs"
        className={cn(
          "fixed right-6 bottom-6 z-40 flex size-12 items-center justify-center",
          "rounded-full bg-[#FAFAFA] text-[#0B0B0C]",
          "transition-colors hover:bg-white",
          cardShadow
        )}
      >
        <Plus aria-hidden className="size-5" />
      </Link>
    </div>
  )
}
