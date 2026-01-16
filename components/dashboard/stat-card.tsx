import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string
    description?: string
    icon: LucideIcon
    trend?: string
    trendUp?: boolean
    variant?: "purple" | "orange" | "emerald" | "blue" | "default"
}

const variantStyles = {
    default: "border-t-slate-500",
    purple: "border-t-purple-500",
    orange: "border-t-amber-500",
    emerald: "border-t-emerald-500",
    blue: "border-t-blue-500",
}

const iconStyles = {
    default: "bg-slate-600 shadow-slate-600/40",
    purple: "bg-purple-600 shadow-purple-500/40",
    orange: "bg-amber-500 shadow-amber-500/40",
    emerald: "bg-emerald-500 shadow-emerald-500/40",
    blue: "bg-blue-600 shadow-blue-600/40",
}

export function StatCard({ title, value, description, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-t-[5px] bg-card/80 backdrop-blur-md rounded-[2.5rem] shadow-sm",
            variantStyles[variant]
        )}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1 pt-6 px-6 relative z-10 font-bold">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-foreground tracking-tight">
                        {title}
                    </CardTitle>
                    <div className="text-4xl font-black text-foreground tracking-tight pt-1">
                        {value}
                    </div>
                </div>
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110",
                    iconStyles[variant]
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2 relative z-10">
                {description && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className={cn("w-2 h-2 rounded-full", variantStyles[variant].replace('border-t-', 'bg-'))} />
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                            {description}
                        </p>
                    </div>
                )}
                {trend && (
                    <div className={cn(
                        "inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-full transition-all duration-300",
                        trendUp
                            ? "bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-500/20 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                    )}>
                        <span className="text-[10px]">{trendUp ? '▲' : '▼'}</span>
                        {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
