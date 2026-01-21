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
    Check,
    X,
    Minus,
    Send,
    Pencil
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExamResultsPage() {
    const { language, direction } = useLanguage()
    const router = useRouter()
    const { id } = useParams()
    const [results, setResults] = React.useState<any[]>([])
    const [selectedResultForDetails, setSelectedResultForDetails] = React.useState<any | null>(null)
    const [currentExam, setCurrentExam] = React.useState<any | null>(null)
    const [editingAnswerIdx, setEditingAnswerIdx] = React.useState<number | null>(null)

    // Load Data
    React.useEffect(() => {
        // Load exam details
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
        const foundExam = storedExams.find((ex: any) => ex.id === id)
        setCurrentExam(foundExam || { title: "Unknown Exam", titleAr: "امتحان غير معروف" })

        // Load results
        const loadResults = () => {
            const allResults = JSON.parse(localStorage.getItem("exam_results") || "[]")
            // Filter results for this specific exam
            // We compare examId. We might need to handle string/number mismatches if any.
            const examResults = allResults.filter((r: any) => r.examId === id)
            setResults(examResults)
        }

        loadResults()

        // Listen for updates
        window.addEventListener('storage', loadResults)
        return () => window.removeEventListener('storage', loadResults)
    }, [id])

    // Update LocalStorage whenever results state changes (for grading)
    const updateLocalStorage = (updatedResults: any[]) => {
        const allResults = JSON.parse(localStorage.getItem("exam_results") || "[]")
        // Replace modified results in the main array
        const newAllResults = allResults.map((r: any) => {
            const updated = updatedResults.find(ur => ur.id === r.id)
            return updated || r
        })
        localStorage.setItem("exam_results", JSON.stringify(newAllResults))
    }

    const handleManualGrade = (resultId: string, questionIdx: number, gradeType: 'full' | 'half' | 'zero') => {
        const newResults = results.map(res => {
            if (res.id !== resultId) return res

            const newAnswers = [...res.answers]
            const q = { ...newAnswers[questionIdx] }

            if (gradeType === 'full') q.earnedPoints = q.points
            else if (gradeType === 'half') q.earnedPoints = q.points / 2
            else q.earnedPoints = 0

            q.needsManual = false
            q.isCorrect = gradeType === 'full' || gradeType === 'half'
            newAnswers[questionIdx] = q

            // Recalculate total score
            const totalEarned = newAnswers.reduce((acc, curr) => acc + (curr.earnedPoints || 0), 0)
            const totalPossible = newAnswers.reduce((acc, curr) => acc + (curr.points || 0), 0)
            const newScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0

            // Check if all graded
            const stillNeedsManual = newAnswers.some(ans => ans.needsManual)

            return {
                ...res,
                answers: newAnswers,
                score: newScore,
                status: newScore >= (currentExam?.passingGrade || 50) ? 'passed' : 'failed',
                correctionType: stillNeedsManual ? 'waiting' : 'auto'
            }
        })

        setResults(newResults)
        updateLocalStorage(newResults)

        // Update selected view
        if (selectedResultForDetails) {
            const updatedSelected = newResults.find(r => r.id === selectedResultForDetails.id)
            setSelectedResultForDetails(updatedSelected)
        }

        setEditingAnswerIdx(null)
    }

    const handlePublishResults = () => {
        if (!confirm(language === 'ar' ? "هل أنت متأكد من نشر النتائج؟ سيتمكن الموظفون من رؤية نتائجهم." : "Are you sure you want to publish results? Employees will be able to see their scores.")) return

        const publishedResults = results.map(r => ({ ...r, published: true }))
        setResults(publishedResults)
        updateLocalStorage(publishedResults)

        alert(language === 'ar' ? "تم نشر النتائج بنجاح" : "Results published successfully")
    }

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
                            <span>{language === 'ar' ? currentExam?.titleAr || currentExam?.title : currentExam?.title}</span>
                            {results.length > 0 && results.every(r => r.published) && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">{language === 'ar' ? "منشور" : "Published"}</Badge>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        onClick={handlePublishResults}
                        className="rounded-xl h-11 px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2 transition-all"
                    >
                        <Send className="size-4 rtl:rotate-180" />
                        <span>{language === 'ar' ? "نشر النتائج" : "Publish Results"}</span>
                    </Button>

                    <div className="h-8 w-[1px] bg-border/60 mx-2 hidden md:block" />

                    <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/30 gap-2 transition-all">
                        <FileSpreadsheet className="size-4" />
                        <span className="hidden sm:inline">{language === 'ar' ? "إكسل" : "Excel"}</span>
                    </Button>
                    <Button variant="outline" className="rounded-xl h-11 px-4 font-bold border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 gap-2 transition-all">
                        <FileText className="size-4" />
                        <span className="hidden sm:inline">{language === 'ar' ? "بي دي إف" : "PDF"}</span>
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
                        {results.length > 0 ? (
                            results.map((res) => (
                                <TableRow key={res.id} className="hover:bg-muted/10 border-border/20 transition-colors">
                                    <TableCell className="ps-8 font-bold py-5">
                                        {language === 'ar' ? res.employeeAr || res.employee : res.employee}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground/60 font-medium">{res.employeeId}</TableCell>
                                    <TableCell className="text-muted-foreground/60 font-medium">{res.department}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-lg font-black",
                                                res.score >= (currentExam?.passingGrade || 50) ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {res.score}
                                            </span>
                                            {res.correctionType === 'waiting' && <span className="text-xs text-amber-500">⚠</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-lg font-black text-[10px] tracking-wider border-none",
                                            res.correctionType === 'auto' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {res.correctionType === 'auto' ? (language === 'ar' ? "مكتمل" : "COMPLETE") : (language === 'ar' ? "انتظار" : "WAITING")}
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
                            <div key={idx} className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-sm text-foreground/80">
                                            Q{idx + 1}: {ans.question}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground/60 border-border/40">
                                                {ans.points} Points
                                            </Badge>
                                            {ans.earnedPoints !== undefined && (
                                                <Badge className={cn(
                                                    "text-[9px] font-black border-none",
                                                    ans.earnedPoints === ans.points ? "bg-emerald-500/10 text-emerald-500" :
                                                        ans.earnedPoints > 0 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                                )}>
                                                    Earned: {ans.earnedPoints}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {!ans.needsManual ? (
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn(
                                                "rounded-lg font-black text-[9px] border-none shrink-0",
                                                ans.earnedPoints === ans.points ? "bg-emerald-500/10 text-emerald-500" :
                                                    ans.earnedPoints > 0 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                            )}>
                                                {ans.earnedPoints === ans.points ? (language === 'ar' ? "صحيح" : "CORRECT") :
                                                    ans.earnedPoints > 0 ? (language === 'ar' ? "جزئي" : "PARTIAL") :
                                                        (language === 'ar' ? "خطأ" : "INCORRECT")}
                                            </Badge>
                                            {/* Allow editing if it was a manual question (short_answer) */}
                                            {ans.type === 'short_answer' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-primary"
                                                    onClick={() => setEditingAnswerIdx(idx)}
                                                >
                                                    <Pencil className="size-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Badge className="bg-amber-500/10 text-amber-500 rounded-lg font-black text-[9px] border-none shrink-0 animate-pulse">
                                            {language === 'ar' ? "بانتظار التصحيح" : "AWAITING REVIEW"}
                                        </Badge>
                                    )}
                                </div>
                                <div className="ps-4 border-s-2 border-primary/20 bg-primary/5 p-3 rounded-e-xl">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {language === 'ar' ? "الإجابة:" : "Answer:"} <span className="text-foreground">{JSON.stringify(ans.answer).replace(/^"|"$/g, '')}</span>
                                    </p>
                                </div>

                                {(ans.needsManual || editingAnswerIdx === idx) && (
                                    <div className="flex items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                        <Button
                                            size="sm"
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold h-8 text-[11px] px-3 gap-1.5"
                                            onClick={() => handleManualGrade(selectedResultForDetails.id, idx, 'full')}
                                        >
                                            <Check className="size-3" />
                                            {language === 'ar' ? "صحيح" : "Correct"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold h-8 text-[11px] px-3 gap-1.5"
                                            onClick={() => handleManualGrade(selectedResultForDetails.id, idx, 'half')}
                                        >
                                            <Minus className="size-3" />
                                            {language === 'ar' ? "نصف درجة" : "Half Grade"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold h-8 text-[11px] px-3 gap-1.5"
                                            onClick={() => handleManualGrade(selectedResultForDetails.id, idx, 'zero')}
                                        >
                                            <X className="size-3" />
                                            {language === 'ar' ? "خطأ" : "Incorrect"}
                                        </Button>
                                        {editingAnswerIdx === idx && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 rounded-full text-muted-foreground"
                                                onClick={() => setEditingAnswerIdx(null)}
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
