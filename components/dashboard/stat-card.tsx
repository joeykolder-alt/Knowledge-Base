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
    default: "border-border/50",
    purple: "border-purple-500/20",
    orange: "border-amber-500/20",
    emerald: "border-emerald-500/20",
    blue: "border-blue-500/20",
}

const iconBgStyles = {
    default: "bg-muted text-muted-foreground",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    orange: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
}

export function StatCard({ title, value, description, icon: Icon, trend, trendUp, variant = "default" }: StatCardProps) {
    return (
        <Card className={cn(
            "group relative overflow-hidden transition-all duration-500 hover:shadow-lg border bg-card rounded-[2rem] shadow-sm",
            variantStyles[variant]
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-8 px-8 relative z-10">
                <div className="space-y-1 flex flex-col items-start text-start rtl:items-end rtl:text-end w-full">
                    <CardTitle className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {title}
                    </CardTitle>
                    <div className="text-xl font-bold text-foreground tracking-tight">
                        {value}
                    </div>
                </div>
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shrink-0",
                    iconBgStyles[variant]
                )}>
                    <Icon className="h-6 w-6 stroke-[2.5px]" />
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4 relative z-10 flex flex-col items-start rtl:items-end">
                {description && (
                    <div className="flex items-center gap-2 mb-4 bg-muted px-3 py-1 rounded-full">
                        <div className={cn("w-1.5 h-1.5 rounded-full", iconBgStyles[variant].split(' ')[0].replace('bg-', 'bg-').replace('/10', ''))} />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
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
