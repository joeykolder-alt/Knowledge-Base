"use client"

import * as React from "react"
import { useLanguage } from "@/components/providers"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Search,
    Plus,
    FileEdit,
    Users,
    CheckCircle2,
    Clock,
    MoreVertical,
    Eye,
    Trash2,
    ArrowUpRight,
    TrendingUp,
    BarChart3,
    Layout,
    FileSpreadsheet,
    FileText,
    Table2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// --- Mock Data ---

const mockExams = [
    {
        id: "ex-1",
        title: "Customer Service Basics",
        titleAr: "أساسيات خدمة العملاء",
        department: "Inbound",
        questions: 15,
        duration: "45",
        status: "active",
        submissions: 124,
        avgScore: 84
    },
    {
        id: "ex-2",
        title: "Product Knowledge 2024",
        titleAr: "معلومات المنتج 2024",
        department: "Outbound",
        questions: 20,
        duration: "60",
        status: "draft",
        submissions: 0,
        avgScore: 0
    },
    {
        id: "ex-3",
        title: "Compliance & Security",
        titleAr: "الامتثال والأمن",
        department: "NOVIP",
        questions: 10,
        duration: "30",
        status: "active",
        submissions: 89,
        avgScore: 92
    },
    {
        id: "ex-4",
        title: "Soft Skills Assessment",
        titleAr: "تقييم المهارات الناعمة",
        department: "Inbound",
        questions: 12,
        duration: "40",
        status: "active",
        submissions: 56,
        avgScore: 78
    }
]

const mockResults = [
    {
        id: "res-1",
        employee: "Ahmed Mohammed",
        employeeAr: "أحمد محمد",
        employeeId: "EMP-0421",
        department: "Inbound",
        exam: "Customer Service Basics",
        score: 95,
        status: "passed",
        correctionType: "auto",
        date: "2024-01-15",
        answers: [
            { question: "What is your primary goal?", answer: "Help customers", isCorrect: true },
            { question: "How to handle angry callers?", answer: "Stay calm", isCorrect: true }
        ]
    },
    {
        id: "res-2",
        employee: "Sarah Ali",
        employeeAr: "سارة علي",
        employeeId: "EMP-0982",
        department: "Outbound",
        exam: "Compliance & Security",
        score: 88,
        status: "passed",
        correctionType: "waiting",
        date: "2024-01-16",
        answers: [
            { question: "Define security.", answer: "Protecting data", isCorrect: true },
            { question: "Explain the protocols.", answer: "I don't know yet", isCorrect: false }
        ]
    },
    {
        id: "res-3",
        employee: "Omar Hassan",
        employeeAr: "عمر حسان",
        employeeId: "EMP-0115",
        department: "Inbound",
        exam: "Customer Service Basics",
        score: 45,
        status: "failed",
        correctionType: "auto",
        date: "2024-01-14",
        answers: [
            { question: "What is your primary goal?", answer: "Ignore them", isCorrect: false },
            { question: "How to handle angry callers?", answer: "Hang up", isCorrect: false }
        ]
    },
    {
        id: "res-4",
        employee: "Laila Khalid",
        employeeAr: "ليلى خالد",
        employeeId: "EMP-0552",
        department: "NOVIP",
        exam: "Soft Skills Assessment",
        score: 72,
        status: "passed",
        correctionType: "auto",
        date: "2024-01-17",
        answers: [
            { question: "What is teamwork?", answer: "Collaboration", isCorrect: true }
        ]
    }
]

export default function AdminExamPage() {
    const { language, direction } = useLanguage()
    const isRtl = direction === 'rtl'
    const [searchQuery, setSearchQuery] = React.useState("")
    const router = useRouter()
    const [exams, setExams] = React.useState<any[]>([])

    React.useEffect(() => {
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
        setExams([...mockExams, ...storedExams])
    }, [])

    const handleDeleteExam = (id: string) => {
        const updatedExams = exams.filter(ex => ex.id !== id)
        setExams(updatedExams)

        // Update localStorage (only remove from stored ones, not mock)
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
        const updatedStored = storedExams.filter((ex: any) => ex.id !== id)
        localStorage.setItem("knowledge_exams", JSON.stringify(updatedStored))
    }

    const handleToggleStatus = (id: string) => {
        const updatedExams = exams.map(ex => {
            if (ex.id === id) {
                // Cycle: Draft -> Active -> Closed -> Draft
                const nextStatus = ex.status === 'draft' ? 'active' : (ex.status === 'active' ? 'closed' : 'draft')
                return { ...ex, status: nextStatus }
            }
            return ex
        })
        setExams(updatedExams)

        // Update localStorage
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
        const updatedStored = storedExams.map((ex: any) => {
            if (ex.id === id) {
                const nextStatus = ex.status === 'draft' ? 'active' : (ex.status === 'active' ? 'closed' : 'draft')
                return { ...ex, status: nextStatus }
            }
            return ex
        })
        localStorage.setItem("knowledge_exams", JSON.stringify(updatedStored))
    }

    const filteredExams = exams.filter(ex =>
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.titleAr && ex.titleAr.includes(searchQuery))
    )


    return (
        <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                        {language === 'ar' ? "إدارة الامتحانات" : "Admin Exam"}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground/70 font-medium text-base">
                        <span>{language === 'ar' ? "تتبع الأداء وإدارة محتوى الاختبارات" : "Track performance and manage exam content"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground rtl:left-auto rtl:right-3" />
                        <Input
                            placeholder={language === 'ar' ? "بحث..." : "Search..."}
                            className="bg-card border-border/60 hover:border-primary/30 transition-colors ps-10 rtl:ps-3 rtl:pe-10 rounded-xl h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30 gap-2 transition-all">
                            <FileSpreadsheet className="size-4" />
                            <span className="hidden sm:inline">{language === 'ar' ? "إكسل" : "Excel"}</span>
                        </Button>
                        <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 gap-2 transition-all">
                            <FileText className="size-4" />
                            <span className="hidden sm:inline">{language === 'ar' ? "بي دي إف" : "PDF"}</span>
                        </Button>
                        <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-teal-500/20 bg-teal-500/5 text-teal-500 hover:bg-teal-500/10 hover:border-teal-500/30 gap-2 transition-all">
                            <Table2 className="size-4" />
                            <span className="hidden sm:inline">{language === 'ar' ? "جوجل شيت" : "Google Sheet"}</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title={language === 'ar' ? "إجمالي الامتحانات" : "Total Exams"}
                    value={mockExams.length.toString()}
                    icon={Layout}
                    trend="+2"
                    color="blue"
                />
                <StatsCard
                    title={language === 'ar' ? "الامتحانات النشطة" : "Active Exams"}
                    value={mockExams.filter(e => e.status === 'active').length.toString()}
                    icon={CheckCircle2}
                    trend="0"
                    color="emerald"
                />
                <StatsCard
                    title={language === 'ar' ? "إجمالي المشاركات" : "Total Submissions"}
                    value="269"
                    icon={Users}
                    trend="+12%"
                    color="amber"
                />
                <StatsCard
                    title={language === 'ar' ? "متوسط الدرجات" : "Avg. Score"}
                    value="85%"
                    icon={TrendingUp}
                    trend="+3%"
                    color="indigo"
                />
            </div>

            {/* Dashboard Content */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExams.map((exam) => (
                    <ExamCard
                        key={exam.id}
                        exam={exam}
                        language={language}
                        isRtl={isRtl}
                        onDelete={() => handleDeleteExam(exam.id)}
                        onToggleStatus={() => handleToggleStatus(exam.id)}
                        onViewResults={() => router.push(`/exams/admin/results/${exam.id}`)}
                    />
                ))}
            </div>

        </div>
    )
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
    const colors: any = {
        emerald: "bg-emerald-500/10 text-emerald-500",
        blue: "bg-blue-500/10 text-blue-500",
        amber: "bg-amber-500/10 text-amber-500",
        indigo: "bg-indigo-500/10 text-indigo-500",
    }

    return (
        <Card className="border-border/40 bg-card rounded-[2rem] shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", colors[color])}>
                    <Icon className="size-6" />
                </div>
                {trend !== "0" && (
                    <Badge variant="outline" className="rounded-lg bg-muted text-[10px] font-black border-none py-1">
                        {trend}
                    </Badge>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-black text-foreground">{value}</h3>
            </div>
            {/* Subtle Gradient Background */}
            <div className={cn("absolute -bottom-6 -right-6 w-24 h-24 blur-[60px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40", colors[color])} />
        </Card>
    )
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-8 h-10 rounded-xl text-sm font-bold transition-all duration-300",
                active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"
            )}
        >
            {label}
        </button>
    )
}

function ExamCard({ exam, language, isRtl, onDelete, onToggleStatus, onViewResults }: any) {
    const router = useRouter()

    return (
        <Card className="border-border/40 bg-card rounded-[2.5rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden">
            <div className="h-1.5 bg-muted/20 w-full relative overflow-hidden">
                <div className={cn(
                    "absolute inset-0 transition-transform duration-700 ease-in-out",
                    exam.status === 'active' ? "bg-emerald-500 translate-x-0" :
                        (exam.status === 'closed' ? "bg-rose-500 translate-x-0" : "bg-muted translate-x-[-100%] rtl:translate-x-[100%]")
                )} />
            </div>
            <CardContent className="p-8 space-y-7">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                            {exam.department}
                        </Badge>
                        <h4 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                            {language === 'ar' ? (exam.titleAr || exam.title) : exam.title}
                        </h4>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-muted/20 p-3.5 rounded-[1.25rem] border border-border/10 transition-colors group-hover:bg-muted/30">
                        <div className="p-1.5 rounded-lg bg-background/40 text-muted-foreground/50">
                            <Clock className="size-3.5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">{language === 'ar' ? "المدة" : "Duration"}:</span>
                            <span className="text-sm font-black text-foreground">{exam.duration} {language === 'ar' ? "دقيقة" : "min"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/20 p-3.5 rounded-[1.25rem] border border-border/10 transition-colors group-hover:bg-muted/30">
                        <div className="p-1.5 rounded-lg bg-background/40 text-muted-foreground/50">
                            <HelpCircleIcon className="size-3.5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">{language === 'ar' ? "الأسئلة" : "Questions"}:</span>
                            <span className="text-sm font-black text-foreground">{exam.questions}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/40">
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.1em]">
                            {language === 'ar' ? "الحالة" : "Status"}
                        </span>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "text-[13px] font-bold transition-colors",
                                exam.status === 'active' ? "text-emerald-500" : (exam.status === 'closed' ? "text-rose-500" : "text-muted-foreground/40")
                            )}>
                                {exam.status === 'active'
                                    ? (language === 'ar' ? "نشط" : "Active")
                                    : (exam.status === 'closed' ? (language === 'ar' ? "مغلق" : "Closed") : (language === 'ar' ? "مسودة" : "Draft"))
                                }
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[10px] font-black uppercase tracking-wider bg-muted/20 hover:bg-muted/40 rounded-lg"
                                onClick={onToggleStatus}
                            >
                                {language === 'ar' ? "تغيير" : "Toggle"}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl h-10 px-4 font-black border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30 gap-2 transition-all"
                            onClick={onViewResults}
                        >
                            <TrendingUp className="size-4" />
                            {language === 'ar' ? "النتائج" : "Results"}
                        </Button>
                        <Link href={`/exams/builder?id=${exam.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-2xl h-11 w-11 text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-colors">
                                <FileEdit className="size-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-2xl h-11 w-11 text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            onClick={onDelete}
                        >
                            <Trash2 className="size-5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function HelpCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
        </svg>
    )
}
