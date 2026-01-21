"use client"

import * as React from "react"
import { useLanguage } from "@/components/providers"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Clock,
    Target,
    Layout,
    ArrowRight,
    Play,
    Timer,
    CheckCircle2,
    AlertCircle,
    User,
    Building2,
    IdCard,
    ChevronRight,
    ChevronLeft,
    FileText,
    Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type Phase = "LIST" | "INTRO" | "INFO_FORM" | "EXAM" | "RESULT"

interface Question {
    id: string
    text: string
    image?: string
    type: "true_false" | "multiple_choice" | "short_answer"
    options?: string[]
    correctAnswer?: string
    correctAnswers?: string[]
    isMultipleCorrect?: boolean
    grade: number
}

interface Exam {
    id: string
    title: string
    titleAr?: string
    description?: string
    duration: string
    department: string
    questionsList: Question[]
}

export default function TakeExamPage() {
    const { language, direction } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const examId = searchParams.get('id')
    const isRtl = direction === 'rtl'

    // Flow State
    const [phase, setPhase] = React.useState<Phase>("INTRO")
    const [exam, setExam] = React.useState<Exam | null>(null)
    const [availableExams, setAvailableExams] = React.useState<Exam[]>([])
    const [loading, setLoading] = React.useState(true)

    // Form State
    const [employeeName, setEmployeeName] = React.useState("")
    const [employeeId, setEmployeeId] = React.useState("")
    const [department, setDepartment] = React.useState("")

    // Exam State
    const [answers, setAnswers] = React.useState<Record<string, any>>({})
    const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0)
    const [timeLeft, setTimeLeft] = React.useState(0) // Seconds
    const [isCounting, setIsCounting] = React.useState(false)

    // Result State
    const [submittedResult, setSubmittedResult] = React.useState<any>(null)

    // Load Exam or List
    React.useEffect(() => {
        const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")

        if (!examId) {
            // Load all active exams for the list view
            const activeExams = storedExams.filter((ex: any) => ex.status === 'active' || !ex.status) // Default to active if status missing
            setAvailableExams(activeExams)
            setPhase("LIST")
            setLoading(false)
            return
        }

        const found = storedExams.find((ex: any) => ex.id === examId)

        if (found) {
            setExam(found)
            setPhase("INTRO")
        }
        setLoading(false)
    }, [examId])

    // Timer Effect
    React.useEffect(() => {
        let timer: any
        if (isCounting && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isCounting) {
            handleSubmitExam()
        }
        return () => clearInterval(timer)
    }, [isCounting, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const startExam = () => {
        if (!exam) return
        setPhase("EXAM")
        setTimeLeft(parseInt(exam.duration) * 60)
        setIsCounting(true)
    }

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }))
    }

    const handleSubmitExam = () => {
        setIsCounting(false)
        if (!exam) return

        let totalEarned = 0
        let totalPossible = exam.questionsList.reduce((acc, q) => acc + (q.grade || 10), 0)
        let needsManual = false

        const gradedAnswers = exam.questionsList.map(q => {
            const userAnswer = answers[q.id]
            let isCorrect = false
            let earned = 0

            if (q.type === 'multiple_choice') {
                if (q.isMultipleCorrect) {
                    // Basic multi-answer check
                    const correctSet = new Set(q.correctAnswers || [])
                    const userSet = new Set(userAnswer || [])
                    isCorrect = correctSet.size === userSet.size && [...correctSet].every(val => userSet.has(val))
                } else {
                    isCorrect = userAnswer === q.correctAnswer
                }
                earned = isCorrect ? q.grade : 0
            } else if (q.type === 'true_false') {
                isCorrect = userAnswer === q.correctAnswer
                earned = isCorrect ? q.grade : 0
            } else if (q.type === 'short_answer') {
                needsManual = true
                isCorrect = false // Manual placeholder
                earned = 0
            }

            totalEarned += earned
            return {
                question: q.text,
                answer: userAnswer || "",
                isCorrect: q.type === 'short_answer' ? null : isCorrect,
                points: q.grade,
                earnedPoints: earned,
                type: q.type,
                needsManual: q.type === 'short_answer'
            }
        })

        const finalScore = Math.round((totalEarned / totalPossible) * 100)

        const result = {
            id: "res-" + Date.now(),
            employee: employeeName,
            employeeAr: employeeName, // Use same for mock
            employeeId: employeeId,
            department: department,
            examTitle: exam.title,
            examId: exam.id,
            score: finalScore,
            status: finalScore >= 50 ? 'passed' : 'failed',
            correctionType: needsManual ? 'waiting' : 'auto',
            date: new Date().toISOString().split('T')[0],
            answers: gradedAnswers
        }

        // Save to local storage for admin
        // (In a real app this would be a POST request)
        // We can append to a 'results' key in local storage
        // But the admin page currently uses mock data and we should probably use a separate key
        const existingResults = JSON.parse(localStorage.getItem("exam_results") || "[]")
        localStorage.setItem("exam_results", JSON.stringify([...existingResults, result]))

        setSubmittedResult(result)
        setPhase("RESULT")
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    if (!exam && phase !== "LIST") return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="size-16 text-rose-500" />
            <h2 className="text-2xl font-black">{language === 'ar' ? "الامتحان غير موجود" : "Exam Not Found"}</h2>
            <Button onClick={() => router.push('/')}>{language === 'ar' ? "العودة للرئيسية" : "Go to Home"}</Button>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {phase === "LIST" && (
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black tracking-tight">{language === 'ar' ? "الامتحانات المتاحة" : "Available Exams"}</h1>
                        <p className="text-lg text-muted-foreground">{language === 'ar' ? "اختر امتحاناً للبدء" : "Choose an exam to start"}</p>
                    </div>

                    {availableExams.length === 0 ? (
                        <Card className="p-12 text-center border-dashed">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 rounded-full bg-muted/30">
                                    <FileText className="size-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg">{language === 'ar' ? "لا توجد امتحانات متاحة" : "No Exams Available"}</h3>
                                    <p className="text-muted-foreground">{language === 'ar' ? "يرجى مراجعة المسؤول" : "Please check with your administrator"}</p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {availableExams.map((ex) => (
                                <Card key={ex.id} className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => router.push(`/exams/take?id=${ex.id}`)}>
                                    <CardHeader className="p-5 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <FileText className="size-5" />
                                            </div>
                                            <Badge variant="secondary" className="font-bold bg-muted/50 text-xs px-2.5 h-6">
                                                {language === 'ar' ? ex.department : ex.department}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1.5">
                                            <CardTitle className="text-lg font-bold leading-tight line-clamp-1">
                                                {language === 'ar' ? ex.titleAr || ex.title : ex.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 text-xs h-9">
                                                {ex.description || (language === 'ar' ? "لا يوجد وصف" : "No description available")}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="size-4" />
                                                <span>{ex.duration} {language === 'ar' ? "دقيقة" : "min"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Target className="size-4" />
                                                <span>{ex.questionsList?.length || 0} {language === 'ar' ? "سؤال" : "questions"}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-5 pt-0">
                                        <Button className="w-full h-10 text-sm font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" variant="ghost">
                                            {language === 'ar' ? "بدء الامتحان" : "Start Exam"}
                                            <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {phase === "INTRO" && exam && (
                <div className="max-w-2xl mx-auto">
                    <Card className="rounded-[2rem] border-border/40 bg-card shadow-2xl overflow-hidden border-none bg-gradient-to-b from-card to-muted/20">
                        <CardHeader className="text-center pt-8 pb-6 space-y-4">
                            <div className="mx-auto size-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                                <FileText className="size-8" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-black tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8">
                                    {language === 'ar' ? exam.titleAr || exam.title : exam.title}
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    {exam.description || (language === 'ar' ? "يرجى قراءة الأسئلة بعناية." : "Please read the questions carefully.")}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center space-y-2">
                                    <Clock className="size-5 text-primary" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "المدة" : "Duration"}</span>
                                    <span className="text-xl font-black">{exam.duration} {language === 'ar' ? "دقيقة" : "Min"}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col items-center text-center space-y-2">
                                    <Target className="size-5 text-blue-500" />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "الأسئلة" : "Questions"}</span>
                                    <span className="text-xl font-black">{exam.questionsList.length}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="px-6 pb-8 justify-center">
                            <Button
                                className="h-12 px-10 rounded-xl text-base font-black gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                onClick={() => setPhase("INFO_FORM")}
                            >
                                {language === 'ar' ? "دخول" : "Enter"}
                                <ArrowRight className="size-4 rtl:rotate-180" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {phase === "INFO_FORM" && exam && (
                <div className="max-w-3xl mx-auto">
                    <Card className="rounded-[2.5rem] border-border/40 bg-card shadow-2xl overflow-hidden">
                        <CardHeader className="pt-8 pb-6 px-8 border-b border-border/40">
                            <div className="flex items-center gap-5">
                                <div className="size-12 bg-primary group-hover:bg-primary/90 transition-colors rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                    <User className="size-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tight">
                                        {language === 'ar' ? "بيانات الموظف" : "Employee Details"}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-base mt-1">
                                        {language === 'ar' ? "يرجى ملء البيانات التالية لبدء الامتحان" : "Fill in your identification details to proceed"}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold ps-1 flex items-center gap-2">
                                    <User className="size-4 text-primary" />
                                    {language === 'ar' ? "الاسم الرباعي" : "Full Name"}
                                </Label>
                                <Input
                                    placeholder={language === 'ar' ? "أدخل اسمك هنا..." : "Enter your full name..."}
                                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/30 font-medium px-5 text-base"
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold ps-1 flex items-center gap-2">
                                        <Building2 className="size-4 text-primary" />
                                        {language === 'ar' ? "القسم" : "Department"}
                                    </Label>
                                    <Select value={department} onValueChange={setDepartment}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none focus:ring-primary/30 font-medium px-5 text-base">
                                            <SelectValue placeholder={language === 'ar' ? "اختر القسم..." : "Select department..."} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40 shadow-xl font-medium">
                                            <SelectItem value="Inbound">Inbound</SelectItem>
                                            <SelectItem value="Outbound">Outbound</SelectItem>
                                            <SelectItem value="NOVIP">NOVIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold ps-1 flex items-center gap-2">
                                        <IdCard className="size-4 text-primary" />
                                        {language === 'ar' ? "رقم الموظف" : "Employee ID"}
                                    </Label>
                                    <Input
                                        placeholder="1234..."
                                        className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/30 font-medium px-5 text-base"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0 flex gap-4">
                            <Button
                                variant="ghost"
                                className="h-12 px-8 rounded-xl font-bold flex-1 text-base"
                                onClick={() => setPhase("INTRO")}
                            >
                                {language === 'ar' ? "إلغاء" : "Cancel"}
                            </Button>
                            <Button
                                className="h-12 px-10 rounded-xl font-black flex-[2] gap-2 shadow-lg shadow-primary/20 text-base"
                                disabled={!employeeName || !employeeId || !department}
                                onClick={startExam}
                            >
                                <Play className="size-4 fill-current" />
                                {language === 'ar' ? "ابدأ الامتحان" : "Start Exam"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            {phase === "EXAM" && exam && (
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Exam Header */}
                    <div className="sticky top-4 z-50 flex items-center justify-between p-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/40 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-sm">
                                {currentQuestionIdx + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-xs text-foreground/80 leading-none">
                                    {language === 'ar' ? "سؤال" : "Question"} {currentQuestionIdx + 1} / {exam.questionsList.length}
                                </h3>
                                <Progress value={((currentQuestionIdx + 1) / exam.questionsList.length) * 100} className="h-1 w-24 mt-1.5" />
                            </div>
                        </div>

                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-colors border",
                            timeLeft < 60 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                            <Timer className={cn("size-3.5", timeLeft < 60 && "animate-pulse")} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* Question Card */}
                    <Card className="rounded-[2rem] border-border/40 bg-card shadow-xl p-6 md:p-8 min-h-[400px] flex flex-col">
                        <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug tracking-tight">
                                    {exam.questionsList[currentQuestionIdx].text}
                                </h2>
                                {exam.questionsList[currentQuestionIdx].image && (
                                    <div className="rounded-2xl overflow-hidden border border-border/40 bg-muted/30">
                                        <img
                                            src={exam.questionsList[currentQuestionIdx].image}
                                            alt="Question"
                                            className="w-full h-auto max-h-[250px] object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Answer Area */}
                            <div className="space-y-3 pt-2">
                                {exam.questionsList[currentQuestionIdx].type === "multiple_choice" && (
                                    <>
                                        {exam.questionsList[currentQuestionIdx].isMultipleCorrect ? (
                                            <div className="grid gap-2.5">
                                                {exam.questionsList[currentQuestionIdx].options?.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "group flex items-center p-3.5 rounded-xl border transition-all cursor-pointer",
                                                            (answers[exam.questionsList[currentQuestionIdx].id] || []).includes(opt)
                                                                ? "bg-primary/5 border-primary shadow-sm"
                                                                : "bg-muted/20 border-transparent hover:bg-muted/40"
                                                        )}
                                                        onClick={() => {
                                                            const current = answers[exam.questionsList[currentQuestionIdx].id] || []
                                                            const next = current.includes(opt)
                                                                ? current.filter((o: string) => o !== opt)
                                                                : [...current, opt]
                                                            handleAnswerChange(exam.questionsList[currentQuestionIdx].id, next)
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={(answers[exam.questionsList[currentQuestionIdx].id] || []).includes(opt)}
                                                            className="size-5 rounded-md pointer-events-none"
                                                        />
                                                        <span className="ms-3 font-medium text-base">{opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="grid gap-2.5">
                                                {exam.questionsList[currentQuestionIdx].options?.map((opt, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "group flex items-center p-3.5 rounded-xl border transition-all cursor-pointer",
                                                            answers[exam.questionsList[currentQuestionIdx].id] === opt
                                                                ? "bg-primary/5 border-primary shadow-sm"
                                                                : "bg-muted/20 border-transparent hover:bg-muted/40"
                                                        )}
                                                        onClick={() => handleAnswerChange(exam.questionsList[currentQuestionIdx].id, opt)}
                                                    >
                                                        <div className={cn(
                                                            "size-5 rounded-full border-[1.5px] flex items-center justify-center transition-all",
                                                            answers[exam.questionsList[currentQuestionIdx].id] === opt
                                                                ? "border-primary bg-primary"
                                                                : "border-muted-foreground/30"
                                                        )}>
                                                            {answers[exam.questionsList[currentQuestionIdx].id] === opt && (
                                                                <div className="size-2 rounded-full bg-white animate-in zoom-in-50 duration-300" />
                                                            )}
                                                        </div>
                                                        <span className="ms-3 font-medium text-base">{opt}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {exam.questionsList[currentQuestionIdx].type === "true_false" && (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {["True", "False"].map((opt) => (
                                            <Button
                                                key={opt}
                                                variant="outline"
                                                className={cn(
                                                    "h-14 rounded-2xl text-lg font-bold border transition-all gap-2",
                                                    answers[exam.questionsList[currentQuestionIdx].id] === opt
                                                        ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                        : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40"
                                                )}
                                                onClick={() => handleAnswerChange(exam.questionsList[currentQuestionIdx].id, opt)}
                                            >
                                                {opt === "True" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                                                {language === 'ar' ? (opt === "True" ? "صح" : "خطأ") : opt}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                {exam.questionsList[currentQuestionIdx].type === "short_answer" && (
                                    <div className="space-y-3">
                                        <Textarea
                                            placeholder={language === 'ar' ? "اكتب إجابتك هنا..." : "Type your answer here..."}
                                            className="min-h-[150px] rounded-2xl p-4 bg-muted/20 border-border/40 text-base font-medium focus-visible:ring-primary/20"
                                            value={answers[exam.questionsList[currentQuestionIdx].id] || ""}
                                            onChange={(e) => handleAnswerChange(exam.questionsList[currentQuestionIdx].id, e.target.value)}
                                        />
                                        <p className="text-[10px] font-bold text-muted-foreground/60 text-center uppercase tracking-widest">
                                            {language === 'ar' ? "يتم تصحيح هذا النوع من الأسئلة يدوياً بواسطة الإدارة" : "This question type is graded manually by the admin"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Navigation within Card */}
                        <div className="pt-8 mt-auto flex items-center justify-between border-t border-border/30">
                            <Button
                                variant="ghost"
                                className="h-10 rounded-xl px-4 font-bold gap-2 text-muted-foreground hover:text-foreground"
                                disabled={currentQuestionIdx === 0}
                                onClick={() => setCurrentQuestionIdx(idx => idx - 1)}
                            >
                                <ChevronLeft className="size-4 rtl:rotate-180" />
                                {language === 'ar' ? "السابق" : "Previous"}
                            </Button>

                            {currentQuestionIdx === exam.questionsList.length - 1 ? (
                                <Button
                                    className="h-10 rounded-xl px-6 font-bold bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20 gap-2 text-sm"
                                    onClick={handleSubmitExam}
                                >
                                    <Check className="size-4" />
                                    {language === 'ar' ? "تسجيل الإجابات" : "Submit Exam"}
                                </Button>
                            ) : (
                                <Button
                                    className="h-10 rounded-xl px-6 font-bold gap-2 text-sm"
                                    onClick={() => setCurrentQuestionIdx(idx => idx + 1)}
                                >
                                    {language === 'ar' ? "التالي" : "Next"}
                                    <ChevronRight className="size-4 rtl:rotate-180" />
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Old Navigation Removed - moved inside card */}
                </div>
            )}

            {phase === "RESULT" && submittedResult && (
                <Card className="rounded-[3rem] border-border/40 bg-card shadow-2xl overflow-hidden p-12 text-center space-y-8 border-none bg-gradient-to-b from-card to-muted/20 min-h-[500px] flex flex-col items-center justify-center">
                    <div className="size-24 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce bg-primary shadow-primary/30">
                        <CheckCircle2 className="size-12" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight leading-none">
                            {language === 'ar' ? "تم إرسال الامتحان بنجاح" : "Exam Submitted Successfully"}
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
                            {language === 'ar'
                                ? "شكراً لك. تم تسجيل إجاباتك وسيتم مراجعتها. سيتم إعلامكم عند ظهور النتائج."
                                : "Thank you. Your answers have been recorded and will be reviewed. You will be notified when results are available."}
                        </p>
                    </div>

                    <div className="pt-6">
                        <Button
                            variant="secondary"
                            className="h-14 px-10 rounded-2xl font-black"
                            onClick={() => router.push('/')}
                        >
                            {language === 'ar' ? "العودة للرئيسية" : "Back to Home"}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    )
}
