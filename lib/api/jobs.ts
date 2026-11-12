import { fetchJson } from "./http"
import type { JobRow } from "@/app/dashboard/recruiter/jobs/page"

/** The subset of a job document the API is guaranteed to store today. */
type StoredJob = Omit<JobRow, "applicants" | "status" | "posted"> &
  Partial<Pick<JobRow, "applicants" | "status" | "posted">>

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * ObjectId embeds its creation time in the first four bytes of the hex string,
 * which lets us recover a post date without the API storing one.
 */
const postedLabel = (id: string): string => {
  const seconds = parseInt(id.slice(0, 8), 16)
  if (!Number.isFinite(seconds)) {
    return "Posted just now"
  }

  const days = Math.floor((Date.now() - seconds * 1000) / DAY_MS)
  if (days <= 0) {
    return "Posted today"
  }
  if (days === 1) {
    return "Posted 1d ago"
  }
  if (days < 30) {
    return `Posted ${days}d ago`
  }
  return `Posted ${Math.floor(days / 30)}mo ago`
}

/**
 * A job is expired once its deadline has passed; an unparseable deadline keeps
 * the listing live rather than silently hiding it.
 */
const statusFor = (deadline: string): JobRow["status"] => {
  const deadlineMs = new Date(deadline).getTime()
  return Number.isNaN(deadlineMs) || deadlineMs >= Date.now()
    ? "active"
    : "expired"
}

/**
 * The stored documents only carry the fields the "Post a New Job" form writes.
 * `applicants`, `status` and `posted` are derived so the table never renders
 * "undefined candidates" or an empty badge.
 */
const toJobRow = (job: StoredJob): JobRow => ({
  ...job,
  applicants: job.applicants ?? 0,
  status: job.status ?? statusFor(job.deadline),
  posted: job.posted ?? postedLabel(job._id),
})

/**
 * Fetch every job posting as table-ready rows.
 *
 * Throws an `ApiError` naming the endpoint and status instead of the opaque
 * `Unexpected token '<'` that an unchecked `res.json()` produced when the API
 * answered with an HTML 404 page.
 */
export const getJobs = async (): Promise<JobRow[]> => {
  const jobs = await fetchJson<StoredJob[]>("/jobs")
  return jobs.map(toJobRow)
}
