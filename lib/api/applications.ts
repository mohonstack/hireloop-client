// Data-access module for the applications API (Express on :5000).
// Follows the `lib/api/jobs.ts` pattern.

import { ApiError } from "@/lib/api/http"
import type {
  ApplicationFormData,
  ApplicationRow,
} from "@/lib/types/applications"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Failure from POST /applications carrying the server's machine-readable
 * `code`, so the UI can tell "limit reached" (show the upgrade modal) apart
 * from "already applied" (show a toast) and genuine network errors.
 */
export class ApplicationError extends ApiError {
  readonly code: string

  constructor(message: string, status: number, code: string) {
    super(message, status)
    this.name = "ApplicationError"
    this.code = code
  }
}

// GET /applications?userId=… — placeholder until loading is wired.
export const getApplications = async (
  query = ""
): Promise<ApplicationRow[]> => {
  const res = await fetch(`${BASE_URL}/applications?${query}`)
  return res.json()
}

export const getApplicationsCount = async (
  query = ""
): Promise<{ count: number }> => {
  const res = await fetch(`${BASE_URL}/applications/count?${query}`)
  return res.json()
}

/**
 * Whether the seeker already applied to a job — the duplicate guard on the
 * client. The server re-checks before inserting, so this is UX only.
 */
export const hasApplied = async (
  userId: string,
  jobId: string
): Promise<boolean> => {
  const res = await fetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(userId)}` +
      `&jobId=${encodeURIComponent(jobId)}`
  )
  const rows = await res.json().catch(() => null)
  return Array.isArray(rows) && rows.length > 0
}

export const createApplication = async (data: ApplicationFormData) => {
  // `credentials: "include"` carries the better-auth session cookie, which
  // Express needs to verify the applicant server-side.
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const body = await res.json().catch(() => null)

  if (!res.ok || !body) {
    throw new ApplicationError(
      body?.message ?? `Application failed (${res.status})`,
      res.status,
      body?.code ?? "UNKNOWN"
    )
  }

  return body
}
