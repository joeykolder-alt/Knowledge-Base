import React from "react"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface LogoProps {
    className?: string
    showText?: boolean
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3 group/logo cursor-default select-none py-1", className)} dir="ltr">
            {/* Icon Container with Glassy/Depth Effect - Rotation removed */}
            <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-[#00508F] to-[#003060] shadow-lg shadow-[#00508F]/20 transition-all duration-500 group-hover/logo:shadow-[#00508F]/40 group-hover/logo:scale-105">
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-50" />
                <BookOpen className="size-5 text-white stroke-[2px]" />
            </div>

            {showText && (
                <div className="flex flex-col justify-center overflow-hidden">
                    <div className="flex items-baseline font-sans leading-none tracking-tight whitespace-nowrap transition-all duration-500">
                        {/* K -> Knowledge */}
                        <span className="text-[#00508F] font-[800] text-xl tracking-tight flex items-baseline">
                            K
                            <span className="max-w-0 overflow-hidden opacity-0 group-hover/logo:max-w-[100px] group-hover/logo:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-[9.5px] text-slate-500 font-bold uppercase tracking-wide ms-0.5 translate-y-[-1px]">
                                nowledge
                            </span>
                        </span>

                        {/* M -> Management */}
                        <span className="text-[#00508F] font-[800] text-xl tracking-tight flex items-baseline group-hover/logo:ms-1 transition-[margin] duration-500">
                            M
                            <span className="max-w-0 overflow-hidden opacity-0 group-hover/logo:max-w-[100px] group-hover/logo:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-[9.5px] text-slate-500 font-bold uppercase tracking-wide ms-0.5 translate-y-[-1px] delay-75">
                                anagement
                            </span>
                        </span>

                        {/* S -> System */}
                        <span className="text-[#A61D21] font-[800] text-xl tracking-tight flex items-baseline group-hover/logo:ms-1 transition-[margin] duration-500">
                            S
                            <span className="max-w-0 overflow-hidden opacity-0 group-hover/logo:max-w-[100px] group-hover/logo:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-[9.5px] text-slate-500 font-bold uppercase tracking-wide ms-0.5 translate-y-[-1px] delay-150">
                                ystem
                            </span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
