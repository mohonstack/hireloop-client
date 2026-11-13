// Page scaffolding shared by the dashboard routes: the centered column
// (PageContainer), the title block with optional primary action (PageHeader),
// and the numbered form sections (SectionCard).

import { cn } from "@/lib/utils"

export function PageContainer({
  width,
  className,
  children,
}: {
  /** "narrow" caps the column for forms, "wide" for tables. */
  width: "narrow" | "wide"
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6",
        width === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  overline,
  title,
  subtitle,
  action,
}: {
  /** Small eyebrow line above the title (e.g. "Create New Listing"). */
  overline?: string
  title: string
  subtitle?: string
  /** Rendered on the right — usually the page's primary button. */
  action?: React.ReactNode
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {overline ? (
          <p className="text-xs font-medium tracking-wide text-[#8B85FF] uppercase">
            {overline}
          </p>
        ) : null}
        <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-white/60">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  )
}

export function SectionCard({
  index,
  title,
  className,
  children,
}: {
  /** Step number shown in the bullet, e.g. 1 for "1 Basic Information". */
  index: number
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]",
        className
      )}
    >
      <h2 className="mb-6 flex items-center gap-3 font-heading text-lg font-semibold tracking-[-0.02em] text-white">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF]">
          {index}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}
