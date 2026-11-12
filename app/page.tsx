import * as React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ShieldCheck,
  KeyRound,
  Database,
  ArrowRight,
  Lock,
} from "lucide-react"

async function AuthNav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </span>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5 h-8 text-xs font-medium shadow-xs")}
        >
          Dashboard <ArrowRight className="size-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 text-xs font-medium")}
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className={cn(buttonVariants({ size: "sm" }), "h-8 text-xs font-medium shadow-xs")}
      >
        Sign up
      </Link>
    </div>
  )
}

async function HeroActions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
      {user ? (
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-sm gap-2 font-medium shadow-sm")}
        >
          Open Dashboard <ArrowRight className="size-4" />
        </Link>
      ) : (
        <>
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6 text-sm gap-2 font-medium shadow-sm")}
          >
            Get Started Free <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6 text-sm font-medium")}
          >
            Sign In
          </Link>
        </>
      )}

      {/* Test Protected Route Button */}
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-11 px-5 text-sm gap-1.5 font-medium border")}
      >
        <Lock className="size-3.5" />
        <span>Test Protected Route</span>
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold tracking-tight text-base sm:text-lg">
            AI Resume & Job Agent
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <React.Suspense
            fallback={
              <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
            }
          >
            <AuthNav />
          </React.Suspense>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium gap-1.5 shadow-2xs">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Supabase Auth & Database Live
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
              Next.js Middleware Protected
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Next-Gen AI Resume & Job Hunting Agent
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elevate your career trajectory with automated resume tailoring, AI-powered match analysis, and protected dashboard management backed by Supabase.
          </p>

          <React.Suspense
            fallback={
              <div className="flex justify-center gap-3 pt-4">
                <div className="h-11 w-32 rounded-md bg-muted animate-pulse" />
                <div className="h-11 w-32 rounded-md bg-muted animate-pulse" />
              </div>
            }
          >
            <HeroActions />
          </React.Suspense>

          <p className="text-[12px] text-muted-foreground pt-1">
            * Clicking &ldquo;Test Protected Route&rdquo; while logged out automatically triggers the Next.js middleware and redirects to Login.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-6">
          <Card className="border shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="space-y-2">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <KeyRound className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold">
                Email & Google Auth
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Seamless authentication supporting modern email/password flows and Google OAuth with secure cookie-based session tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">@supabase/ssr</span> and Next.js Server Components.
            </CardContent>
          </Card>

          <Card className="border shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="space-y-2">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Database className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold">
                Supabase Postgres & RLS
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Complete database integration with Row Level Security (RLS) policies and automatic trigger functions for profile synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Zero security vulnerabilities reported by <span className="font-semibold text-foreground">Supabase Advisors</span>.
            </CardContent>
          </Card>

          <Card className="border shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="space-y-2">
              <div className="size-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle className="text-base font-semibold">
                Middleware Guard
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Edge-ready Next.js middleware intercepts requests, automatically refreshes auth sessions, and protects the private dashboard routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Configured in <code className="font-mono text-foreground font-semibold">middleware.ts</code> with matcher rules.
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        AI Resume & Job Agent • Supabase Database & Auth Integration
      </footer>
    </div>
  )
}
