// Payment actions. Routes through fetchJson so a backend that answers with
// HTML (unknown route, crash page) surfaces as a ApiError naming the endpoint
// and status instead of `Unexpected token '<'` from parsing it as JSON.

import { fetchJson } from "@/lib/api/http"

export const checkoutVerify = async (sessionId: string) => {
  return fetchJson<{ verified: boolean; activated: boolean; reason?: string }>(
    "/payments/checkout-verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    }
  )
}
