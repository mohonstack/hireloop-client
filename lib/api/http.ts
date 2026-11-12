const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Thrown when the API answers with a failed status or a body that isn't JSON.
 *
 * Express replies to an unknown route with an HTML error page, so calling
 * `res.json()` unconditionally surfaces as `Unexpected token '<'` — a message
 * that names neither the endpoint nor the real cause.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/**
 * GET `${BASE_URL}${path}` and parse the body as JSON, or throw an {@link ApiError}
 * that identifies the endpoint, the status, and what actually came back.
 */
export async function fetchJson<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const method = init?.method ?? "GET"
  const res = await fetch(`${BASE_URL}${path}`, init)

  const contentType = res.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")

  if (!res.ok || !isJson) {
    const body = await res.text().catch(() => "")
    const detail = isJson
      ? `${res.status} ${res.statusText}`
      : `${res.status} ${res.statusText} (expected JSON, got "${contentType || "no content-type"}")`

    throw new ApiError(
      `${method} ${path} → ${detail}${body ? `: ${body.slice(0, 200)}` : ""}`,
      res.status
    )
  }

  return res.json() as Promise<T>
}
