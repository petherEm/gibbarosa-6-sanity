import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of supported locales
export const locales = ["pl", "en", "fr"]
export const defaultLocale = "pl"

// Paths that don't require locale prefix
const PUBLIC_PATHS = ["/studio", "/draft-mode"]

// Get the preferred locale from the request headers
function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

  return match(languages, locales, defaultLocale)
}

export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname

  // Skip internal Next.js paths and public paths
  if (
    pathname.startsWith("/_next/") ||
    pathname.includes("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") || // Skip files with extensions
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) // Skip public paths
  ) {
    return
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  return NextResponse.redirect(request.nextUrl)
}

// Use experimental-edge runtime as required
export const runtime = "experimental-edge"

// Update matcher to be more specific and exclude studio
export const matcher = [
  // Match all paths except:
  // /_next/, /api/, /static/, /studio/, and files with extensions
  "/((?!_next|api|static|studio|.*\\.[^/]*$).*)",
]

