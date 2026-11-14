// Plan/subscription data access for the Apply Now gate and the usage strip.
//
// `GET /users/:id/plan` is authenticated server-side: Express resolves the
// better-auth session from the forwarded cookie and only answers for the
// caller's own user id, so always send `credentials: "include"` from the
// browser (or pass the cookie header when calling from a server component).

import type { PlanInfo } from "@/lib/plan"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getUserPlan = async (
  userId: string,
  opts: { cookie?: string } = {}
): Promise<PlanInfo> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/plan`, {
    credentials: "include",
    headers: opts.cookie ? { cookie: opts.cookie } : undefined,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Plan lookup failed (${response.status})`)
  }

  return response.json()
}
