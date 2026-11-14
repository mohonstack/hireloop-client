"use client"

// Sonner's Toaster has to sit inside ThemeProvider to read the app's
// class-based theme (same constraint as Navbar in AGENTS.md), and it lives
// in the top-right so it never collides with the base-ui viewport in the
// bottom-right that the dashboard still uses.

import { useTheme } from "next-themes"
import { Toaster } from "sonner"

export function SonnerToaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      richColors
      closeButton
    />
  )
}
