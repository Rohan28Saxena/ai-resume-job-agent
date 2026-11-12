"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import {
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Mail,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Edit3,
} from "lucide-react"

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // Step 1: Sign up details
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)

  // Step 2: OTP verification state
  const [step, setStep] = React.useState<"form" | "otp">("form")
  const [otp, setOtp] = React.useState("")
  const [verifyLoading, setVerifyLoading] = React.useState(false)
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [resending, setResending] = React.useState(false)

  // General state
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [alreadyRegistered, setAlreadyRegistered] = React.useState(false)

  const supabase = createClient()

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Step 1 Handler: Create account and request OTP
  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setAlreadyRegistered(false)

    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const origin = typeof window !== "undefined" ? window.location.origin : ""

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      // Check if user is already confirmed (identities array is empty in Supabase)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setAlreadyRegistered(true)
        setErrorMessage("An account with this email already exists and is verified. Please sign in instead.")
        return
      }

      // If user session exists immediately
      if (data.session) {
        setSuccessMessage("Account created successfully! Redirecting...")
        router.push(redirectTo)
        router.refresh()
        return
      }

      // Transition to OTP verification step
      setStep("otp")
      setResendCooldown(60)
      setSuccessMessage("A 6-digit verification code has been sent to your email.")
    } catch {
      setErrorMessage("An unexpected error occurred during signup.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2 Handler: Verify 6-digit OTP
  async function handleVerifyOtp(otpCodeToVerify?: string) {
    const code = otpCodeToVerify || otp
    if (!code || code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.")
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)
    setVerifyLoading(true)

    try {
      // First attempt with type: 'signup'
      let { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "signup",
      })

      // Fallback to type: 'email' if signup type is not accepted
      if (error) {
        const emailAttempt = await supabase.auth.verifyOtp({
          email: email.trim(),
          token: code.trim(),
          type: "email",
        })
        if (!emailAttempt.error) {
          data = emailAttempt.data
          error = null
        }
      }

      if (error) {
        setErrorMessage(error.message || "Invalid or expired verification code.")
        setVerifyLoading(false)
        return
      }

      if (data?.session || data?.user) {
        setSuccessMessage("Email verified successfully! Redirecting to dashboard...")
        setTimeout(() => {
          router.push(redirectTo)
          router.refresh()
        }, 800)
      } else {
        // Fallback: try signing in with the provided password if session wasn't auto-established
        const loginAttempt = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (loginAttempt.data.session) {
          setSuccessMessage("Email verified! Redirecting to dashboard...")
          router.push(redirectTo)
          router.refresh()
        } else {
          router.push("/login?verified=true")
        }
      }
    } catch {
      setErrorMessage("Failed to verify code. Please try again.")
    } finally {
      setVerifyLoading(false)
    }
  }

  // Resend OTP Code
  async function handleResendOtp() {
    if (resendCooldown > 0 || resending) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
      })

      if (error) {
        setErrorMessage(error.message)
      } else {
        setSuccessMessage("A fresh verification code has been sent to your email.")
        setResendCooldown(60)
        setOtp("")
      }
    } catch {
      setErrorMessage("Could not resend verification code. Please try again later.")
    } finally {
      setResending(false)
    }
  }

  // Google OAuth Signup
  async function handleGoogleLogin() {
    setErrorMessage(null)
    setGoogleLoading(true)

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setGoogleLoading(false)
      }
    } catch {
      setErrorMessage("Could not initialize Google authentication.")
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="border shadow-lg backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1.5 pb-4">
        <div className="flex justify-center mb-1">
          {step === "otp" ? (
            <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="size-6" />
            </div>
          ) : null}
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight text-center">
          {step === "otp" ? "Verify your email" : "Create your account"}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          {step === "otp"
            ? "Enter the 6-digit security code sent to your email"
            : "Start matching with tailored jobs and optimizing your resume"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Messages */}
        {errorMessage && (
          <div className="p-3 text-xs flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{errorMessage}</span>
              {alreadyRegistered && (
                <div className="pt-1">
                  <Link
                    href={`/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                    className="font-bold underline text-primary hover:opacity-80"
                  >
                    Go to Sign In &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3 text-xs flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {step === "otp" ? (
          /* STEP 2: OTP VERIFICATION VIEW */
          <div className="space-y-5 pt-1">
            {/* Target Email Banner with Edit Option */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span className="truncate text-foreground font-medium">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("form")
                  setErrorMessage(null)
                  setSuccessMessage(null)
                }}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <Edit3 className="size-3" /> Change
              </button>
            </div>

            {/* 6-Digit OTP Input */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">
                6-Digit Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val)
                    if (val.length === 6) {
                      handleVerifyOtp(val)
                    }
                  }}
                  disabled={verifyLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                    <InputOTPSlot index={1} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                    <InputOTPSlot index={2} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                    <InputOTPSlot index={4} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                    <InputOTPSlot index={5} className="size-10 text-base font-bold sm:size-11 sm:text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Verify Button */}
            <Button
              type="button"
              size="lg"
              className="w-full h-10 font-medium gap-2"
              onClick={() => handleVerifyOtp()}
              disabled={verifyLoading || otp.length < 6}
            >
              {verifyLoading ? (
                <>
                  <Spinner className="size-4" />
                  <span>Verifying code...</span>
                </>
              ) : (
                <>
                  <span>Verify Email & Continue</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>

            {/* Resend Code Section */}
            <div className="text-center pt-1">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-muted-foreground font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {resending ? <Spinner className="size-3" /> : <RefreshCw className="size-3" />}
                    Resend code
                  </button>
                )}
              </p>
            </div>
          </div>
        ) : (
          /* STEP 1: INITIAL REGISTRATION FORM */
          <>
            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-10 gap-3 border-input/60 hover:bg-muted font-medium transition-all"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <Spinner className="size-4" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Sign up with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                    className="h-10 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 text-sm"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-10 font-medium mt-2"
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account & Get Code"
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center border-t border-border/50 pt-4 pb-4">
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-semibold text-primary hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AI Resume & Job Agent</span>
          </Link>
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
            OTP Verified Signup
          </Badge>
        </div>

        <React.Suspense
          fallback={
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Spinner className="size-6 text-primary" />
            </div>
          }
        >
          <SignUpForm />
        </React.Suspense>

        {/* Security Note */}
        <p className="text-center text-[11px] text-muted-foreground px-6 leading-relaxed">
          6-digit OTP email verification powered by Supabase Auth with Row Level Security.
        </p>
      </div>
    </div>
  )
}
