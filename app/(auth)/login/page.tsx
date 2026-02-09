"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)
  const [splashFading, setSplashFading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })

  // Splash screen timer - 3.5 seconds display
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFading(true)
    }, 3500)

    const hideTimer = setTimeout(() => {
      setShowSplash(false)
    }, 4500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Navigate to dashboard
    router.push("/dashboard")
  }

  // Splash Screen - Pure white background with blended image
  if (showSplash) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-white",
          "transition-opacity duration-1000",
          splashFading ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Logo Animation - mix-blend-multiply makes light backgrounds transparent */}
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
          <div className="relative w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] md:w-[34rem] md:h-[34rem] lg:w-[40rem] lg:h-[40rem]">
            <Image
              src="/splash-logo.png"
              alt="Knowledge Management System"
              fill
              className="object-contain mix-blend-multiply"
              style={{ filter: "contrast(1.8) brightness(1.15)" }}
              priority
            />
          </div>
          
          {/* Loading indicator */}
          <div className="flex items-center gap-2 mt-8">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login Form - Modern clean design with centered card
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* Background gradients - positioned away from logo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-100/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Top Left - Knowledge Tree Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 animate-in fade-in zoom-in duration-700">
          <Image
            src="/splash-logo.png"
            alt="Knowledge Management System"
            fill
            className="object-contain mix-blend-multiply"
            style={{ filter: "contrast(2) brightness(1.2)" }}
            priority
          />
        </div>
      </div>

      {/* Centered Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-lg">
              Sign in to access your knowledge base
            </p>
          </div>

          {/* Login Card */}
          <Card className="border border-slate-200/50 shadow-xl shadow-slate-200/50 bg-white rounded-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                      className="border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-slate-600 cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
