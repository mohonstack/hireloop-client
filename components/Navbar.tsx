"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"


import Logo from "@/app/images/logo.png"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"

type NavLink = {
  label: string
  href: string
}

function getNavLinks(session?: { user?: { role?: string | null } | null } | null): NavLink[] {
  return [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Company", href: "/companies" },
    { label: "Pricing", href: "/pricing" },
    {
      label: "Dashboard",
      href: session?.user?.role ? `/dashboard/${session.user.role}` : "/dashboard",
    },
  ]
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center" aria-label="HireLoop home">
      {/* Static import — intrinsic 154x44 supplies width/height (no CLS) */}
      <Image
        src={Logo}
        alt="HireLoop"
        className="h-8 w-auto sm:h-9"
        loading="eager"
        fetchPriority="high"
      />
    </Link>
  )
}

function NavItems({
  pathname,
  className,
  onNavigate,
  navLinks,
}: {
  pathname: string
  className?: string
  onNavigate?: () => void
  navLinks: NavLink[]
}) {
  return (
    <nav className={className} aria-label="Primary">
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

function ActionButtons({ className }: { className?: string }) {

  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!session?.user ? (
        <>
          <Link
            href="/sign-in"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
            })}
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
            })}
          >
            Get Started
          </Link>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-[#EDEDEF]">Welcome, {session.user.name}!</span>

          <Button
            onClick={handleSignOut}
            className="h-9.5 rounded-[8px] bg-transparent px-4 text-lg font-semibold text-[#645AFF] hover:bg-white/5 hover:text-[#645AFF]"
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
}

const NavbarPage = () => {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const { data: session } = useSession()
  const navLinks = React.useMemo(() => getNavLinks(session), [session])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Section: brand */}
        <BrandLogo />

        {/* Section: primary nav links + divider (desktop) */}
        <div className="hidden items-center md:flex">
          <NavItems
            pathname={pathname}
            className="flex items-center gap-1"
            navLinks={navLinks}
          />
          {/* `Line 2` — vertical divider between links and actions */}
          <span aria-hidden="true" className="mx-3 h-5 w-px bg-border" />
          <ActionButtons />
        </div>

        {/* Section: mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="md:hidden"
                aria-label="Open menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:max-w-xs">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation
              </SheetDescription>
            </SheetHeader>
            {/* Section: mobile nav links */}
            <NavItems
              pathname={pathname}
              className="flex flex-col gap-1 px-4"
              onNavigate={() => setOpen(false)}
              navLinks={navLinks}
            />
            {/* Section: mobile actions */}
            <div className="mt-auto flex flex-col gap-2 p-4 pt-0">
              <ActionButtons className="flex-col items-stretch" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export default NavbarPage
