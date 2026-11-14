"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { AuthForm, AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { safeRedirect } from "@/lib/redirect"

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const handleSignIn = async (data: AuthFormData) => {
    setError(null)

    const { error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
      callbackURL: "/",
    })

    if (signInError) {
      setError(signInError.message || "Something went wrong. Please try again.")
      return
    }

    // `?redirectTo=` is set by flows like Apply Now so the user lands back
    // where they started instead of being dumped on the home page.
    const target = safeRedirect(
      new URLSearchParams(window.location.search).get("redirectTo"),
      "/"
    )

    // Refresh so server components pick up the new session cookie, then navigate.
    router.refresh()
    router.push(target)
  }

  return <AuthForm mode="signin" onSubmit={handleSignIn} error={error} />
}
