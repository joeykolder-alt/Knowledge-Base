"use client"

import * as React from "react"
import { useLanguage } from "@/components/providers"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
    ArrowLeft,
    FileSpreadsheet,
    FileText,
    Table2,
    Layout,
    CheckCircle2,
    Users,
    TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Card } from "@/components/ui/card"

// --- Mock Data (Shared with Admin Page) ---

const mockExams = [
    {
        id: "ex-1",
        title: "Customer Service Basics",
        titleAr: "أساسيات خدمة العملاء",
    },
    {
        id: "ex-3",
        title: "Compliance & Security",
        titleAr: "الامتثال والأمن",
    },
    {
        id: "ex-4",
        title: "Soft Skills Assessment",
        titleAr: "تقييم المهارات الناعمة",
    }
]

const mockResults = [
    {
        id: "res-1",
        employee: "Ahmed Mohammed",
        employeeAr: "أحمد محمد",
        employeeId: "EMP-0421",
        department: "Inbound",
        examTitle: "Customer Service Basics",
        examId: "ex-1",
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
        examTitle: "Compliance & Security",
        examId: "ex-3",
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
        examTitle: "Customer Service Basics",
        examId: "ex-1",
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
        examTitle: "Soft Skills Assessment",
        examId: "ex-4",
        score: 72,
        status: "passed",
        correctionType: "auto",
        date: "2024-01-17",
        answers: [
            { question: "What is teamwork?", answer: "Collaboration", isCorrect: true }
        ]
    }
]

export default function ExamResultsPage() {
    const { language, direction } = useLanguage()
    const router = useRouter()
    const { id } = useParams()
    const [selectedResultForDetails, setSelectedResultForDetails] = React.useState<any | null>(null)
    const [currentExam, setCurrentExam] = React.useState<any | null>(null)

    React.useEffect(() => {
        // Load exam title from mock or localStorage
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
        const allExams = [...mockExams, ...storedExams]
        const found = allExams.find(ex => ex.id === id)
        setCurrentExam(found || { title: "Exam Not Found", titleAr: "الامتحان غير موجود" })
    }, [id])

    const filteredResults = currentExam
        ? mockResults.filter(res => res.examId === id || res.examTitle === currentExam.title)
        : []

    return (
        <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 md:px-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="px-0 hover:bg-transparent text-muted-foreground/60 hover:text-primary transition-colors gap-2"
                        onClick={() => router.push('/exams/admin')}
                    >
                        <ArrowLeft className="size-4 rtl:rotate-180" />
                        {language === 'ar' ? "العودة إلى إدارة الامتحانات" : "Back to Admin Exam"}
                    </Button>
                    <div className="space-y-1">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                            {language === 'ar' ? "نتائج الامتحان" : "Exam Results"}
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground/70 font-medium text-base">
                            <span>{language === 'ar' ? currentExam?.titleAr : currentExam?.title}</span>
                        </div>
                    </div>
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

            {/* Results Table */}
            <div className="bg-card border border-border/40 rounded-[2.5rem] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/40">
                            <TableHead className="ps-8 font-black h-14">{language === 'ar' ? "الموظف" : "Employee"}</TableHead>
                            <TableHead className="font-black h-14">{language === 'ar' ? "رقم الموظف" : "ID"}</TableHead>
                            <TableHead className="font-black h-14">{language === 'ar' ? "القسم" : "Dept"}</TableHead>
                            <TableHead className="font-black h-14">{language === 'ar' ? "الدرجة" : "Score"}</TableHead>
                            <TableHead className="font-black h-14">{language === 'ar' ? "التصحيح" : "Correction"}</TableHead>
                            <TableHead className="font-black h-14">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                            <TableHead className="pe-8 font-black h-14 text-end">{language === 'ar' ? "الإجراء" : "Action"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((res) => (
                                <TableRow key={res.id} className="hover:bg-muted/10 border-border/20 transition-colors">
                                    <TableCell className="ps-8 font-bold py-5">
                                        {language === 'ar' ? res.employeeAr : res.employee}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground/60 font-medium">{res.employeeId}</TableCell>
                                    <TableCell className="text-muted-foreground/60 font-medium">{res.department}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "text-lg font-black",
                                            res.score >= 80 ? "text-emerald-500" : "text-rose-500"
                                        )}>
                                            {res.score}%
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-lg font-black text-[10px] tracking-wider border-none",
                                            res.correctionType === 'auto' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {res.correctionType === 'auto' ? (language === 'ar' ? "تلقائي" : "AUTO") : (language === 'ar' ? "انتظار" : "WAITING")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground/60 font-medium">
                                        {res.date}
                                    </TableCell>
                                    <TableCell className="pe-8 text-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-4 text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 rounded-xl"
                                            onClick={() => setSelectedResultForDetails(res)}
                                        >
                                            {language === 'ar' ? "التفاصيل" : "Details"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64 text-center text-muted-foreground/40 font-bold">
                                    {language === 'ar' ? "لا توجد نتائج لهذا الامتحان بعد" : "No results for this exam yet"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Answer Details Dialog */}
            <Dialog open={!!selectedResultForDetails} onOpenChange={(open) => !open && setSelectedResultForDetails(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] border-border/40 bg-card shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">
                            {language === 'ar' ? "تفاصيل الإجابات" : "Answer Details"}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                            {language === 'ar' ? "إجابات" : "Answers for"} {selectedResultForDetails?.employee}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-6">
                        {selectedResultForDetails?.answers.map((ans: any, idx: number) => (
                            <div key={idx} className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <h4 className="font-bold text-sm text-foreground/80">
                                        Q{idx + 1}: {ans.question}
                                    </h4>
                                    <Badge className={cn(
                                        "rounded-lg font-black text-[9px] border-none shrink-0",
                                        ans.isCorrect ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                    )}>
                                        {ans.isCorrect ? (language === 'ar' ? "صحيح" : "CORRECT") : (language === 'ar' ? "خطأ" : "INCORRECT")}
                                    </Badge>
                                </div>
                                <div className="ps-4 border-s-2 border-primary/20">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {language === 'ar' ? "الإجابة:" : "Answer:"} <span className="text-foreground">{ans.answer}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
