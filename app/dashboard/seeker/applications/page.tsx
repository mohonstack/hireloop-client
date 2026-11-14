// My Applications — seeker dashboard page, from the Figma
// "Seeker / My Applications" (stats bento + applications table).
//
// Loads the signed-in seeker's rows from GET /applications; the API maps
// the `applicantId` query onto the stored `userId`.

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { PageContainer } from "@/components/dashboard/page-shell"
import { getApplications } from "@/lib/api/applications"
import { getUserPlan } from "@/lib/api/user"
import type { ApplicationRow } from "@/lib/types/applications"
import type { PlanUsage } from "@/lib/plan"

import { ApplicationsBoard } from "./_components/applications-board"

export default async function MyApplicationsPage() {
  const headerStore = await headers()
  const session = await auth.api.getSession({
    headers: headerStore,
  })

  // Without a session the query would run as `applicantId=undefined` and
  // silently render an empty table.
  if (!session) {
    redirect(`/sign-in?redirectTo=/dashboard/seeker/applications`)
  }

  let applications: ApplicationRow[] = []
  let loadError: string | null = null

  try {
    applications = await getApplications(`applicantId=${session.user.id}`)
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Your applications could not be loaded."
  }

  // Free/Premium quota for the usage strip. The session cookie is forwarded
  // so Express can verify who is asking; a failure only hides the strip.
  let usage: PlanUsage | null = null
  try {
    const plan = await getUserPlan(session.user.id, {
      cookie: headerStore.get("cookie") ?? undefined,
    })
    usage = { plan: plan.plan, used: plan.used, limit: plan.limit }
  } catch {
    usage = null
  }

  return (
    <PageContainer width="wide">
      {loadError ? (
        <section className="border border-white/10 bg-[#141418] p-10 text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
            My Applications
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] text-[#A0A0AB]">
            {loadError} Check that the API server is running, then reload the
            page.
          </p>
        </section>
      ) : (
        <ApplicationsBoard applications={applications} usage={usage} />
      )}
    </PageContainer>
  )
}
