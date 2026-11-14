// Free vs Premium plan rules — single source of truth for the client.
//
// The Express API enforces the same numbers independently
// (`hireloop-server/index.js` → FREE_APPLICATION_LIMIT); keep the two in
// sync when either changes.

export type Plan = "free" | "premium"

/** Applications a `free` user may submit before the upgrade gate. */
export const FREE_APPLICATION_LIMIT = 10

/** `GET /users/:id/plan` payload — plan + live usage for one user. */
export type PlanInfo = {
  plan: Plan
  /** Convenience mirror of `plan === "premium"` (matches the legacy endpoint). */
  premium: boolean
  /** Applications submitted so far. */
  used: number
  /** `null` for premium (unlimited), `FREE_APPLICATION_LIMIT` for free. */
  limit: number | null
}

/** The subset the usage strip and the upgrade modal render. */
export type PlanUsage = Pick<PlanInfo, "plan" | "used" | "limit">

/** Free users are gated once they have used every included application. */
export const hasReachedLimit = (usage: PlanUsage): boolean =>
  usage.plan === "free" && usage.limit !== null && usage.used >= usage.limit
