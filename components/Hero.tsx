"use client"

import Image from "next/image"
import Link from "next/link"
import type { FormEvent } from "react"
import {
  BriefcaseIcon,
  Building2Icon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"

import CtaBg from "@/app/images/cta-bg.png"
import Globe from "@/app/images/globe.png"
import { Button } from "@/components/ui/button"

/** Hero stat — `Container > Stats *` in the Figma `Homepage` frame. */
const stats = [
  { label: "Active Jobs", Icon: BriefcaseIcon },
  { label: "Companies", Icon: Building2Icon },
  { label: "Job Seekers", Icon: UsersIcon },
  { label: "Satisfaction Rate", Icon: StarIcon },
] as const

/** `Frame 2147234452` — quick filters shown under the search field. */
const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

export default function Hero() {
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    // The `/jobs` route does not exist yet, so keep the field inert rather than
    // navigating to a 404. Wire this to `router.push` once the route lands.
    event.preventDefault()
  }

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      {/* Background: gradient shader + wireframe grid floor + globe render */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[32rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#9a36a8]/30 blur-[130px]" />
        <div className="absolute -right-24 bottom-24 h-96 w-96 rounded-full bg-[#3000ff]/30 blur-[110px]" />

        {/* `globe` — magenta glow across the top, blue arc through the middle.
            Cover + top keeps the glow in frame; the arc runs off the bottom. */}
        <div className="absolute inset-0">
          <Image
            src={Globe}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-top opacity-80 mix-blend-screen"
          />
        </div>

        {/* `cta-bg` — the dome only occupies the top ~46% of the file, so crop
            to that band and pin it to the bottom as a floor. */}
        <div className="absolute inset-x-0 bottom-0 h-[42%]">
          <Image
            src={CtaBg}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-top opacity-70 mix-blend-screen"
          />
        </div>

        {/* Legibility scrim over the artwork */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,rgba(0,0,0,0.72),transparent_75%)]" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-32 sm:pb-20">
        {/* Badge — `50,000+ new jobs this month` (Space Mono) */}
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-space-mono text-xs text-white/80 backdrop-blur sm:text-sm">
          <strong className="font-bold text-white">50,000+</strong> new jobs
          this month
        </span>

        {/* Headline — `Hero Section Title` (Manrope Bold) */}
        <h1 className="mx-auto mt-7 max-w-3xl font-manrope text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Find Your Dream Job Today
        </h1>

        {/* Subheadline (Manrope Regular) */}
        <p className="mx-auto mt-5 max-w-2xl font-manrope text-base leading-relaxed text-white/70 sm:text-lg">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role faster.
        </p>

        {/* Search row — two fields split by `Line 1`, plus the Search button */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-9 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0"
        >
          <div className="flex flex-1 items-center gap-3 px-3 py-2">
            <SearchIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-white/50"
            />
            <input
              type="text"
              name="title"
              aria-label="Job title, skill or company"
              placeholder="Job title, skill or company"
              className="w-full min-w-0 bg-transparent font-manrope text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
            />
          </div>

          <span
            aria-hidden="true"
            className="h-px w-full bg-white/10 sm:h-7 sm:w-px"
          />

          <div className="flex flex-1 items-center gap-3 px-3 py-2">
            <MapPinIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-white/50"
            />
            <input
              type="text"
              name="location"
              aria-label="Location or Remote"
              placeholder="Location or Remote"
              className="w-full min-w-0 bg-transparent font-manrope text-sm text-white outline-none placeholder:text-white/40 sm:text-base"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-white text-black hover:bg-white/90 sm:w-auto"
          >
            Search
          </Button>
        </form>

        {/* Trending Position — `Frame 2147234453` */}
        <div className="mt-9 flex flex-col items-center gap-3">
          <span className="font-manrope text-sm text-white/50">
            Trending Position
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingPositions.map((position) => (
              <Link
                key={position}
                href={`/jobs?q=${encodeURIComponent(position)}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-manrope text-sm text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                {position}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Live stats — `Frame 2147234448` eyebrow + `Container` of `Stats *` */}
      <div className="relative border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-center font-manrope text-sm text-white/50 sm:text-base">
            Assisting over 15,000 job seekers find their dream positions.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-3 lg:justify-start"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon aria-hidden="true" className="size-5 text-white/80" />
                </span>
                <span className="font-jakarta text-sm font-semibold text-white sm:text-base">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
