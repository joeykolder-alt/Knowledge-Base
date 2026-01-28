import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LogoProps {
    className?: string
    showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-3 select-none cursor-pointer", className)} dir="ltr">
            {/* Vibrant Modern Icon */}
            <div className="relative flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 ring-1 ring-white/20 group-hover/logo:scale-105 group-hover/logo:shadow-blue-500/50 transition-all duration-300">
                <BookOpen className="size-5 text-white drop-shadow-sm" strokeWidth={2.5} />
            </div>

            {showText && (
                <div className="flex flex-col justify-center">
                    {/* Primary Brand Name - Adaptive Theme */}
                    <span className="font-[800] text-lg leading-none text-foreground tracking-tight transition-colors">
                        Knowledge
                    </span>

                    {/* Secondary Descriptor - Adaptive Theme */}
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-tight mt-1 transition-colors">
                        Management System
                    </span>
                </div>
            )}
        </Link>
    )
}
