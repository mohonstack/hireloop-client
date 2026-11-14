// Resolves a `?redirectTo=` query value to an internal path, or `fallback`.
// Anything that isn't a single-slash internal path — protocol-relative
// `//host`, backslash `/\host`, or an absolute URL — falls back instead, so
// a crafted query can't turn sign-in into an open redirect.

export function safeRedirect(target: string | null, fallback: string): string {
  if (!target) return fallback
  if (!target.startsWith("/") || target.startsWith("//")) return fallback
  if (target.startsWith("/\\")) return fallback
  return target
}
