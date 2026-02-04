"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center justify-center select-none cursor-pointer",
        "w-full",
        className
      )}
      dir="ltr"
      aria-label="KMS - Knowledge Management System"
    >
      {/* Responsive centered container for the logo */}
      <span
        className={cn(
          "flex items-center justify-center w-full max-w-full",
          "min-h-[3rem] sm:min-h-[4rem]"
        )}
      >
        <Image
          src="/assets/logo.png"
          alt="KMS - Knowledge Management System"
          width={360}
          height={108}
          className={cn(
            "object-contain object-left w-auto max-w-full h-auto",
            showText
              ? "h-24 min-h-[5rem] sm:h-28 md:h-[7.5rem]"
              : "h-10 w-10"
          )}
          sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, 320px"
          priority
          unoptimized
        />
      </span>
    </Link>
  )
}
