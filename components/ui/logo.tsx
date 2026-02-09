"use client"

import React, { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
  expandOnHover?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ 
  className, 
  showText = true, 
  expandOnHover = false,
  size = "md" 
}: LogoProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMouseEnter = () => {
    if (expandOnHover) {
      setIsExpanded(true)
    }
  }

  // Size configurations
  const iconSize = {
    sm: "size-9 rounded-lg",
    md: "size-10 rounded-xl",
    lg: "size-11 sm:size-12 rounded-xl"
  }

  const iconInnerSize = {
    sm: "size-5",
    md: "size-5 sm:size-6",
    lg: "size-6 sm:size-7"
  }

  const textSize = {
    sm: {
      collapsed: "text-xl font-bold",
      expanded: "text-sm font-semibold"
    },
    md: {
      collapsed: "text-2xl font-bold",
      expanded: "text-base font-semibold"
    },
    lg: {
      collapsed: "text-2xl sm:text-3xl font-extrabold",
      expanded: "text-lg sm:text-xl font-bold"
    }
  }

  return (
    <Link
      href="/dashboard"
      className={cn(
        "group flex items-center gap-2.5 select-none cursor-pointer",
        "transition-all duration-500 ease-out",
        className
      )}
      dir="ltr"
      aria-label="KMS - Knowledge Management System"
      onMouseEnter={handleMouseEnter}
    >
      {/* Book Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0",
          iconSize[size],
          "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
          "shadow-lg shadow-teal-500/25",
          "ring-1 ring-white/20",
          "transition-all duration-300",
          "group-hover:shadow-teal-500/40 group-hover:scale-[1.02]"
        )}
      >
        <BookOpen
          className={cn(iconInnerSize[size], "text-white drop-shadow-sm")}
          strokeWidth={2}
        />
      </div>

      {/* KMS Text with optional hover expansion */}
      {showText && (
        <div className="flex items-center">
          {expandOnHover ? (
            <span
              className={cn(
                "tracking-tight whitespace-nowrap",
                "text-slate-800 dark:text-white",
                "transition-all duration-500 ease-out",
                isExpanded ? textSize[size].expanded : textSize[size].collapsed
              )}
            >
              {isExpanded ? (
                <>
                  Knowledge Management <span className="text-red-500">S</span>ystem
                </>
              ) : (
                <>
                  KM<span className="text-red-500">S</span>
                </>
              )}
            </span>
          ) : (
            <span
              className={cn(
                "tracking-tight",
                "text-slate-800 dark:text-white",
                "transition-colors duration-300",
                textSize[size].collapsed
              )}
            >
              KM<span className="text-red-500">S</span>
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
