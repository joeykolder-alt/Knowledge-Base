"use client"

import { useLanguage } from "@/components/providers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, TrendingUp, Award } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TopThreePage() {
    const { language } = useLanguage()

    const t = {
        title: language === 'ar' ? "أفضل 3 موظفين" : "Top 3 Performers",
        subtitle: language === 'ar' ? "الموظفون الأكثر تميزاً لهذا الشهر" : "Most outstanding employees of the month",
        score: language === 'ar' ? "النتيجة النهائية" : "Final Score",
        calls: language === 'ar' ? "المكالمات" : "Calls",
        quality: language === 'ar' ? "الجودة" : "Quality",
        adherence: language === 'ar' ? "الالتزام" : "Adherence",
    }

    const topEmployees = [
        {
            rank: 1,
            name: "Sarah Ahmed",
            id: "10950",
            role: "Senior Agent",
            score: 98.5,
            calls: 1240,
            quality: 99,
            adherence: "99.2%",
            image: "/avatars/sarah.jpg",
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/50"
        },
        {
            rank: 2,
            name: "Ali Hassan",
            id: "10951",
            role: "Customer Support",
            score: 96.8,
            calls: 1150,
            quality: 97,
            adherence: "98.5%",
            image: "/avatars/ali.jpg",
            color: "text-slate-400",
            bgColor: "bg-slate-400/10",
            borderColor: "border-slate-400/50"
        },
        {
            rank: 3,
            name: "Noor Ali",
            id: "10952",
            role: "Technical Support",
            score: 95.4,
            calls: 1080,
            quality: 96,
            adherence: "97.8%",
            image: "/avatars/noor.jpg",
            color: "text-amber-700",
            bgColor: "bg-amber-700/10",
            borderColor: "border-amber-700/50"
        }
    ]

    return (
        <div className="container mx-auto py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {t.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row items-end justify-center gap-6 lg:gap-8 pt-8 min-h-[500px]">
                {/* 2nd Place */}
                <div className="order-2 lg:order-1 w-full max-w-sm transform hover:-translate-y-2 transition-transform duration-300">
                    <WinnerCard employee={topEmployees[1]} t={t} icon={Medal} />
                </div>

                {/* 1st Place */}
                <div className="order-1 lg:order-2 w-full max-w-md -mt-12 lg:-mt-24 transform hover:-translate-y-2 transition-transform duration-300 z-10">
                    <WinnerCard employee={topEmployees[0]} t={t} icon={Trophy} isFirst />
                </div>

                {/* 3rd Place */}
                <div className="order-3 lg:order-3 w-full max-w-sm transform hover:-translate-y-2 transition-transform duration-300">
                    <WinnerCard employee={topEmployees[2]} t={t} icon={Medal} />
                </div>
            </div>
        </div>
    )
}

function WinnerCard({ employee, t, icon: Icon, isFirst = false }: any) {
    return (
        <Card className={cn(
            "relative overflow-hidden border-2 shadow-xl backdrop-blur-sm",
            employee.borderColor,
            isFirst ? "bg-card/80" : "bg-card/60"
        )}>
            {/* Background Gradient Effect */}
            <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-b", employee.bgColor, "to-transparent")} />

            <CardHeader className="text-center pb-2 pt-8 relative">
                <div className={cn(
                    "mx-auto rounded-full flex items-center justify-center mb-4 ring-4 ring-offset-4 ring-offset-background shadow-lg",
                    isFirst ? "w-24 h-24 ring-amber-400" : "w-20 h-20",
                    employee.role === "Senior Agent" ? "ring-amber-400" : "ring-border" // Fallback ring
                )} style={{ borderColor: 'currentColor' }}>
                    <div className={cn("rounded-full w-full h-full flex items-center justify-center bg-background text-2xl font-bold", employee.color)}>
                        {employee.name.charAt(0)}
                    </div>
                </div>

                <div className="absolute top-4 right-4">
                    <Icon className={cn("w-8 h-8", employee.color)} />
                </div>

                <Badge variant="outline" className={cn("mx-auto mb-2 w-fit px-3 py-1", employee.bgColor, employee.color, "border-0 font-bold")}>
                    Rank #{employee.rank}
                </Badge>

                <CardTitle className="text-2xl font-bold text-foreground">{employee.name}</CardTitle>
                <CardDescription className="text-sm font-medium">{employee.id}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4 relative">
                <div className="flex justify-center">
                    <div className="text-center">
                        <span className="text-4xl font-extrabold text-foreground">{employee.score}</span>
                        <span className="text-muted-foreground text-sm ml-1">%</span>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{t.score}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-border/50 pt-4">
                    <div className="space-y-1">
                        <p className="font-bold text-foreground">{employee.calls}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{t.calls}</p>
                    </div>
                    <div className="space-y-1 border-x border-border/50">
                        <p className="font-bold text-foreground">{employee.quality}%</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{t.quality}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-foreground">{employee.adherence}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{t.adherence}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
