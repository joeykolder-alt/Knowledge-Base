import React from "react"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LogoProps {
    className?: string
    showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex flex-col items-start", className)} dir="ltr">
            <div className="flex items-center gap-2">
                {/* Single Book Icon */}
                <div className="shrink-0 flex items-center">
                    <BookOpen className="size-5 text-[#00508F] stroke-[2.5px]" />
                </div>

                {showText && (
                    <div className="flex items-baseline font-sans tracking-tight leading-none">
                        <span className="text-[#00508F] font-[900] text-[18px] md:text-[20px] uppercase tracking-[-0.02em]">
                            Knowledge
                        </span>
                        <span className="text-[#A61D21] font-[900] text-[18px] md:text-[20px] uppercase tracking-[-0.02em] ms-1.5">
                            Base
                        </span>
                    </div>
                )}
            </div>

            {showText && (
                <div className="w-full flex mt-1 items-center">
                    <div className="w-[28px] shrink-0" /> {/* Aligned with single icon width */}
                    <div className="h-[3px] flex-1 bg-gray-300/80 rounded-full" />
                </div>
            )}
        </div>
    )
}
