"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, User, CreditCard, Clock, Users, AlertCircle, CheckCircle2, Timer } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Mock data for other employees with status
const otherEmployeesOnLeave = [
    { name: "Sarah Ahmed", date: "2024-02-15", status: "approved" },
    { name: "Ali Hassan", date: "2024-02-16", status: "pending" },
    { name: "Noor Ali", date: "2024-02-15", status: "approved" },
]

export default function VacationPage() {
    const { language } = useLanguage()
    const [dateFrom, setDateFrom] = useState<Date>()
    const [dateTo, setDateTo] = useState<Date>()
    const [isChecking, setIsChecking] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const t = {
        title: language === 'ar' ? "طلب إجازة" : "Vacation Request",
        subtitle: language === 'ar' ? "قدم طلب إجازتك وتحقق من رصيدك" : "Submit your vacation request and check your balance",
        nameLabel: language === 'ar' ? "اسم الموظف" : "Employee Name",
        idLabel: language === 'ar' ? "الرقم الوظيفي" : "Employee ID",
        fromLabel: language === 'ar' ? "من تاريخ" : "From Date",
        toLabel: language === 'ar' ? "إلى تاريخ" : "To Date",
        checkBtn: language === 'ar' ? "تحقق من التوفر" : "Check Availability",
        submitBtn: language === 'ar' ? "تقديم الطلب" : "Submit Request",
        balanceTitle: language === 'ar' ? "رصيد الإجازات المتبقي" : "Remaining Leave Balance",
        days: language === 'ar' ? "أيام" : "Days",
        othersTitle: language === 'ar' ? "موظفون آخرون في إجازة" : "Others on Leave",
        pending: language === 'ar' ? "بانتظار الموافقة" : "Pending Approval",
        successMsg: language === 'ar' ? "تم استلام الطلب وهو قيد المراجعة" : "Request received and is under review",
        pickDate: language === 'ar' ? "اختر تاريخ" : "Pick a date",
        durationLabel: language === 'ar' ? "مدة الإجازة:" : "Duration:",
        day: language === 'ar' ? "يوم" : "Day",
        status: {
            approved: language === 'ar' ? "مقبول" : "Approved",
            pending: language === 'ar' ? "قيد الانتظار" : "Pending"
        }
    }

    // Calculate duration
    const duration = dateFrom && dateTo ? differenceInDays(dateTo, dateFrom) + 1 : 0

    const handleCheck = () => {
        if (!dateFrom || !dateTo) return
        setIsChecking(true)
        // Simulate checking logic
        setTimeout(() => {
            setIsChecking(false)
            setShowInfo(true)
        }, 1000)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
        }, 1500)
    }

    return (
        <div className="container max-w-5xl mx-auto py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h1>
                <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Request Form */}
                <Card className="lg:col-span-2 border-border/50 shadow-lg bg-card/95 backdrop-blur-sm h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            {language === 'ar' ? "تفاصيل الطلب" : "Request Details"}
                        </CardTitle>
                        <CardDescription>
                            {language === 'ar' ? "الرجاء تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form id="vacation-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            {t.nameLabel}
                                        </Label>
                                        <Input id="name" placeholder={language === 'ar' ? "الاسم الكامل" : "Full Name"} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="id" className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            {t.idLabel}
                                        </Label>
                                        <Input id="id" placeholder="EMP-0000" required />
                                    </div>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="flex items-center gap-2 mb-2">
                                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                            {t.fromLabel}
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !dateFrom && "text-muted-foreground"
                                                    )}
                                                >
                                                    {dateFrom ? format(dateFrom, "PPP") : <span>{t.pickDate}</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateFrom}
                                                    onSelect={(date) => {
                                                        setDateFrom(date);
                                                        if (showInfo) setShowInfo(false);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label className="flex items-center gap-2 mb-2">
                                            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                            {t.toLabel}
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !dateTo && "text-muted-foreground"
                                                    )}
                                                >
                                                    {dateTo ? format(dateTo, "PPP") : <span>{t.pickDate}</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateTo}
                                                    onSelect={(date) => {
                                                        setDateTo(date);
                                                        if (showInfo) setShowInfo(false);
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* Duration Display */}
                                {duration > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-top-2">
                                        <Timer className="w-5 h-5 text-primary" />
                                        <span className="font-medium text-foreground">{t.durationLabel}</span>
                                        <span className="font-bold text-primary text-lg">{duration} {t.days}</span>
                                    </div>
                                )}

                                {!showInfo && (
                                    <Button
                                        type="button"
                                        onClick={handleCheck}
                                        variant="secondary"
                                        className="w-full"
                                        disabled={!dateFrom || !dateTo || isChecking || duration <= 0}
                                    >
                                        {isChecking ? "..." : t.checkBtn}
                                    </Button>
                                )}
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in-95 duration-300">
                                <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-10 h-10 text-yellow-600 animate-pulse" />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-foreground">{t.pending}</h3>
                                    <p className="text-muted-foreground max-w-xs mx-auto">{t.successMsg}</p>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-200 mt-4">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">{language === 'ar' ? "بانتظار موافقة المدير" : "Waiting for Manager Approval"}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    {!isSubmitted && showInfo && (
                        <CardFooter className="flex justify-end pt-6 border-t border-border/50">
                            <Button
                                form="vacation-form"
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto min-w-[150px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "..." : t.submitBtn}
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Info Sidebar (Balance & Others) */}
                <div className="space-y-6">
                    {/* Balance Card */}
                    <Card className="border-border/50 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[100px] -mr-4 -mt-4 transition-all hover:scale-110" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                {t.balanceTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-foreground tracking-tight">14</span>
                                <span className="text-muted-foreground font-medium">{t.days}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conflicts / Others on Leave */}
                    {showInfo && (
                        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-900/50 animate-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold text-yellow-700 dark:text-yellow-500 flex items-center gap-2 uppercase tracking-wider">
                                    <Users className="w-4 h-4" />
                                    {t.othersTitle}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {otherEmployeesOnLeave.map((emp, i) => (
                                        <div key={i} className="flex items-start justify-between bg-background/60 p-3 rounded-lg border border-border/40 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium text-foreground leading-none">{emp.name}</p>
                                                    <p className="text-xs text-muted-foreground">{emp.date}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] h-5 px-1.5",
                                                    emp.status === 'approved'
                                                        ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20"
                                                        : "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20"
                                                )}
                                            >
                                                {emp.status === 'approved' ? t.status.approved : t.status.pending}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
