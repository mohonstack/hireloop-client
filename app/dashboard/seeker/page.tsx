// Seeker Home — the seeker dashboard landing page, from the Figma
// "Job Seeker" frame: top app bar, stats row, Recent Activity, FAB.
//
// Server component: it verifies the session, then loads the seeker's
// applications (for stats + activity) and the current job board (for
// "new job alert" rows) so the client component renders with no data
// waterfalls.

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { PageContainer } from "@/components/dashboard/page-shell"
import { getApplications } from "@/lib/api/applications"
import { getJobs } from "@/lib/api/jobs"
import type { ApplicationRow } from "@/lib/types/applications"
import type { JobRow } from "@/lib/types/jobs"

import { SeekerHome } from "./_components/seeker-home"

export default async function SeekerDashboardPage() {
  const headerStore = await headers()
  const session = await auth.api.getSession({
    headers: headerStore,
  })

  // Without a session the query would run as `applicantId=undefined` and
  // silently render an empty dashboard.
  if (!session) {
    redirect(`/sign-in?redirectTo=/dashboard/seeker`)
  }

  let applications: ApplicationRow[] = []
  let loadError: string | null = null

  try {
    applications = await getApplications(`applicantId=${session.user.id}`)
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Your dashboard could not be loaded."
  }

  // Job alerts are a nice-to-have: a failure only means fewer feed rows.
  let jobs: JobRow[] = []
  try {
    jobs = await getJobs()
  } catch {
    jobs = []
  }

  return (
    <PageContainer width="wide">
      {loadError ? (
        <section className="rounded-lg border border-white/10 bg-[#141418] p-10 text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
            Recent Activity
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] text-[#A0A0AB]">
            {loadError} Check that the API server is running, then reload the
            page.
          </p>
        </section>
      ) : (
        <SeekerHome
          name={session.user.name}
          image={session.user.image ?? null}
          applications={applications}
          jobs={jobs}
        />
      )}
    </PageContainer>
  )
}
