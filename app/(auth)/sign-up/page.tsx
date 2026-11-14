"use client"

import * as React from "react"

import { AuthForm, AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { safeRedirect } from "@/lib/redirect"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const handleSignUp = async (data: AuthFormData) => {
    setError(null)

    const { data: signUpResponse, error: signUpError } =
      await authClient.signUp.email({
        name: data.name as string,
        email: data.email,
        password: data.password,
        callbackURL: "/",
        role: data.role,
      })

    console.log("signup response", signUpResponse, signUpError)

    if (signUpError) {
      // e.g. 422 "User already exists. Use another email."
      setError(signUpError.message || "Something went wrong. Please try again.")
      return
    }

    // `?redirectTo=` keeps flows like Apply Now where they started.
    const target = safeRedirect(
      new URLSearchParams(window.location.search).get("redirectTo"),
      "/"
    )

    // Refresh so server components pick up the new session cookie, then navigate.
    router.refresh()
    router.push(target)
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} error={error} />
}
