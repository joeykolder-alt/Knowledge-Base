"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Star, TrendingUp, Award, UserPlus, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

// All employees data
const allEmployees = [
    { id: "10950", name: "Sarah Ahmed", role: "Senior Agent", score: 98.5, calls: 1240, quality: 99, adherence: "99.2%" },
    { id: "10951", name: "Ali Hassan", role: "Customer Support", score: 96.8, calls: 1150, quality: 97, adherence: "98.5%" },
    { id: "10952", name: "Noor Ali", role: "Technical Support", score: 95.4, calls: 1080, quality: 96, adherence: "97.8%" },
    { id: "10953", name: "Omar Khaled", role: "Senior Agent", score: 94.2, calls: 1020, quality: 95, adherence: "96.5%" },
    { id: "10954", name: "Fatima Hassan", role: "Customer Support", score: 93.8, calls: 980, quality: 94, adherence: "95.2%" },
    { id: "10955", name: "Ahmed Mohamed", role: "Technical Support", score: 92.5, calls: 950, quality: 93, adherence: "94.8%" },
    { id: "10956", name: "Layla Ibrahim", role: "Senior Agent", score: 91.2, calls: 920, quality: 92, adherence: "93.5%" },
    { id: "10957", name: "Youssef Ali", role: "Customer Support", score: 90.8, calls: 890, quality: 91, adherence: "92.2%" },
]

export default function TopThreePage() {
    const { language } = useLanguage()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>(["10950", "10951", "10952"])

    const t = {
        title: language === 'ar' ? "أفضل 3 موظفين" : "Top 3 Performers",
        subtitle: language === 'ar' ? "الموظفون الأكثر تميزاً لهذا الشهر" : "Most outstanding employees of the month",
        score: language === 'ar' ? "النتيجة النهائية" : "Final Score",
        calls: language === 'ar' ? "المكالمات" : "Calls",
        quality: language === 'ar' ? "الجودة" : "Quality",
        adherence: language === 'ar' ? "الالتزام" : "Adherence",
        selectBtn: language === 'ar' ? "تحديد الموظفين" : "Select Employees",
        dialogTitle: language === 'ar' ? "اختر أفضل 3 موظفين" : "Select Top 3 Employees",
        dialogSubtitle: language === 'ar' ? "اختر 3 موظفين لعرضهم كأفضل الموظفين" : "Choose 3 employees to display as top performers",
        searchPlaceholder: language === 'ar' ? "ابحث عن موظف..." : "Search employee...",
        saveBtn: language === 'ar' ? "حفظ" : "Save",
        cancelBtn: language === 'ar' ? "إلغاء" : "Cancel",
        selected: language === 'ar' ? "محدد" : "Selected",
    }

    // Toggle employee selection
    const toggleEmployee = (id: string) => {
        if (selectedEmployees.includes(id)) {
            setSelectedEmployees(selectedEmployees.filter(e => e !== id))
        } else if (selectedEmployees.length < 3) {
            setSelectedEmployees([...selectedEmployees, id])
        }
    }

    // Filter employees based on search
    const filteredEmployees = allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.includes(searchQuery)
    )

    const rankStyles = [
        { color: "text-amber-400", bgColor: "bg-amber-400/10", borderColor: "border-amber-400/50" },
        { color: "text-slate-400", bgColor: "bg-slate-400/10", borderColor: "border-slate-400/50" },
        { color: "text-amber-700", bgColor: "bg-amber-700/10", borderColor: "border-amber-700/50" }
    ]

    // Build top employees from selected IDs
    const topEmployees = selectedEmployees.map((id, index) => {
        const emp = allEmployees.find(e => e.id === id)
        if (!emp) return null
        return {
            rank: index + 1,
            ...emp,
            image: `/avatars/${emp.name.toLowerCase().split(' ')[0]}.jpg`,
            ...rankStyles[index]
        }
    }).filter(Boolean)

    return (
        <div className="container mx-auto py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {t.title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
                
                {/* Select Employees Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 gap-2">
                            <UserPlus className="w-4 h-4" />
                            {t.selectBtn}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{t.dialogTitle}</DialogTitle>
                            <DialogDescription>{t.dialogSubtitle}</DialogDescription>
                        </DialogHeader>
                        
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder={t.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        
                        {/* Selected Count */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{selectedEmployees.length}/3</Badge>
                            <span>{t.selected}</span>
                        </div>
                        
                        {/* Employee List */}
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-2">
                                {filteredEmployees.map((emp) => {
                                    const isSelected = selectedEmployees.includes(emp.id)
                                    const selectionIndex = selectedEmployees.indexOf(emp.id)
                                    return (
                                        <div
                                            key={emp.id}
                                            onClick={() => toggleEmployee(emp.id)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                                                isSelected 
                                                    ? "border-primary bg-primary/5" 
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                                                !isSelected && selectedEmployees.length >= 3 && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                                                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {isSelected ? selectionIndex + 1 : emp.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{emp.name}</p>
                                                    <p className="text-xs text-muted-foreground">{emp.id} • {emp.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="font-bold text-foreground">{emp.score}%</p>
                                                    <p className="text-xs text-muted-foreground">{t.score}</p>
                                                </div>
                                                {isSelected && (
                                                    <Check className="w-5 h-5 text-primary" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                        
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                {t.cancelBtn}
                            </Button>
                            <Button 
                                onClick={() => setIsDialogOpen(false)}
                                disabled={selectedEmployees.length !== 3}
                            >
                                {t.saveBtn}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {topEmployees.length === 3 && (
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
            )}
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
