import { Geist, Geist_Mono, Manrope, Space_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { SonnerToaster } from "@/components/sonner-toaster"
import { cn } from "@/lib/utils"
import NavbarPage from "@/components/Navbar"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        manrope.variable,
        spaceMono.variable
      )}
    >
      <body>
        <NavbarPage />
        <ThemeProvider>
          {children}
          {/* Sonner renders the plan/Apply Now notifications; it needs the
              theme context above to match light/dark. */}
          <SonnerToaster />
        </ThemeProvider>
        {/* Mounted once at the root so the dashboard's own toasts (job
            created / deleted) work from every page. */}
        <Toaster />
      </body>
    </html>
  )
}
