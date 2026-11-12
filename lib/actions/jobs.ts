import type { JobFormData } from "@/app/dashboard/recruiter/jobs/new/page"
import { fetchJson } from "@/lib/api/http"

/** Result of `POST /jobs`, as sent back by MongoDB's `insertOne`. */
type CreateJobResult = {
  acknowledged: boolean
  insertedId: string
}

/** Result of `DELETE /jobs/:id`, as sent back by MongoDB's `deleteOne`. */
type DeleteJobResult = {
  acknowledged: boolean
  deletedCount: number
}

export const createJob = async (data: JobFormData) =>
  fetchJson<CreateJobResult>("/jobs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

export const deleteJob = async (jobId: string) =>
  fetchJson<DeleteJobResult>(`/jobs/${jobId}`, {
    method: "DELETE",
  })
