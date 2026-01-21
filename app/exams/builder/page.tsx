"use client"

import * as React from "react"
import { useLanguage } from "@/components/providers"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Plus,
    Trash2,
    CheckCircle2,
    HelpCircle,
    Clock,
    Target,
    Layout,
    AlertCircle,
    Save,
    X,
    GripVertical,
    Image as ImageIcon,
    Upload,
    Check,
    CheckSquare,
    Pencil
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type QuestionType = "true_false" | "multiple_choice" | "short_answer"
type CorrectionType = "automatic" | "manual"
type ExamStatus = "active" | "closed" | "draft"
type Department = "Inbound" | "Outbound" | "NOVIP"

interface Question {
    id: string
    text: string
    image?: string
    type: QuestionType
    correctionType: CorrectionType
    options?: string[]
    correctAnswer?: string
    correctAnswers?: string[]
    isMultipleCorrect?: boolean
    grade: number
}

export default function ExamBuilderPage() {
    const { language, direction } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('id')
    const isRtl = direction === 'rtl'

    // Form State
    const [title, setTitle] = React.useState("")
    const [department, setDepartment] = React.useState<Department>("Inbound")
    const [description, setDescription] = React.useState("")
    const [duration, setDuration] = React.useState("30")
    const [passingGrade, setPassingGrade] = React.useState("50")
    const [status, setStatus] = React.useState<ExamStatus>("draft")

    // Questions State
    const [questions, setQuestions] = React.useState<Question[]>([])

    React.useEffect(() => {
        if (editId) {
            const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
            const examToEdit = storedExams.find((ex: any) => ex.id === editId)
            if (examToEdit) {
                setTitle(examToEdit.title)
                setDepartment(examToEdit.department)
                setDescription(examToEdit.description || "")
                setDuration(examToEdit.duration)
                setPassingGrade(examToEdit.passingGrade || "50")
                setStatus(examToEdit.status)
                setQuestions(examToEdit.questionsList || [])
            }
        }
    }, [editId])
    const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.src = base64Str
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                if (width > maxWidth) {
                    height = (maxWidth / width) * height
                    width = maxWidth
                }
                if (height > maxHeight) {
                    width = (maxHeight / height) * width
                    height = maxHeight
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)
                resolve(canvas.toDataURL('image/jpeg', 0.7)) // Compress to JPEG with 0.7 quality
            }
        })
    }

    const [isAddingQuestion, setIsAddingQuestion] = React.useState(false)
    const [editingQuestionId, setEditingQuestionId] = React.useState<string | null>(null)

    // New Question Temp State
    const [newQuestion, setNewQuestion] = React.useState<Question>({
        id: "",
        text: "",
        image: "",
        type: "multiple_choice",
        correctionType: "automatic",
        options: ["", "", "", ""],
        correctAnswer: "",
        correctAnswers: [],
        isMultipleCorrect: false,
        grade: 1
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const compressed = await compressImage(reader.result as string)
                setNewQuestion(prev => ({ ...prev, image: compressed }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleAddQuestion = () => {
        if (editingQuestionId) {
            setQuestions(questions.map(q => q.id === editingQuestionId ? { ...newQuestion, id: editingQuestionId } : q))
        } else {
            const id = Math.random().toString(36).substr(2, 9)
            setQuestions([...questions, { ...newQuestion, id }])
        }

        setIsAddingQuestion(false)
        setEditingQuestionId(null)

        // Reset temp state
        setNewQuestion({
            id: "",
            text: "",
            image: "",
            type: "multiple_choice",
            correctionType: "automatic",
            options: ["", "", "", ""],
            correctAnswer: "",
            correctAnswers: [],
            isMultipleCorrect: false,
            grade: 1
        })
    }

    const handleEditQuestion = (question: Question) => {
        setNewQuestion(question)
        setEditingQuestionId(question.id)
        setIsAddingQuestion(true)
    }

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

    const handleSaveExam = () => {
        try {
            const examData = {
                id: editId || Math.random().toString(36).substr(2, 9),
                title,
                titleAr: title, // Simplified for now
                department,
                questions: questions.length,
                duration,
                status: status,
                submissions: 0,
                avgScore: 0,
                questionsList: questions,
                description,
                passingGrade,
                updatedAt: new Date().toISOString()
            }

            const storedExams = JSON.parse(localStorage.getItem("knowledge_exams") || "[]")
            let updatedExams;

            if (editId) {
                updatedExams = storedExams.map((ex: any) => ex.id === editId ? examData : ex)
            } else {
                updatedExams = [...storedExams, examData]
            }

            localStorage.setItem("knowledge_exams", JSON.stringify(updatedExams))
            router.push('/exams/admin')
        } catch (error: any) {
            console.error("Failed to save exam:", error)
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                alert(language === 'ar'
                    ? "عذراً، مساحة التخزين ممتلئة. يرجى حذف بعض الامتحانات القديمة لتتمكن من الحفظ."
                    : "Sorry, storage is full. Please delete some old exams to be able to save.")
            } else {
                alert(language === 'ar'
                    ? "حدث خطأ أثناء حفظ الامتحان. يرجى المحاولة مرة أخرى."
                    : "An error occurred while saving the exam. Please try again.")
            }
        }
    }

    return (
        <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/40">
                <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                        {language === 'ar' ? "منشئ الامتحانات" : "Exam Builder"}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground/70 font-medium text-base">
                        <span>{language === 'ar' ? "تصميم وإدارة اختبارات الموظفين" : "Design and manage employee exams"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 md:flex-none rounded-xl px-6 font-bold h-11 border-border/60"
                        onClick={() => router.push('/exams/admin')}
                    >
                        {language === 'ar' ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                        className="flex-1 md:flex-none rounded-xl px-8 font-bold h-11 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                        onClick={handleSaveExam}
                    >
                        <Save className="size-4 me-2" />
                        {language === 'ar' ? "حفظ الامتحان" : "Save Exam"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 items-start">
                {/* Exam Settings (Left/Right depending on RTL) */}
                <div className="lg:col-span-4 space-y-8 sticky top-6">
                    <Card className="border-border/50 bg-card rounded-[2.5rem] shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-8 pt-10 px-8 border-b border-border/40">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Layout className="size-5" />
                                </div>
                                <CardTitle className="text-xl font-bold">{language === 'ar' ? "معلومات الامتحان" : "Exam Info"}</CardTitle>
                            </div>
                            <CardDescription>
                                {language === 'ar' ? "حدد الإعدادات الأساسية للامتحان" : "Define the basic settings for the exam"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "عنوان الامتحان" : "Exam Title"}</Label>
                                <Input
                                    placeholder={language === 'ar' ? "أدخل عنوان الامتحان..." : "Enter exam title..."}
                                    className="h-14 rounded-2xl border-border/60 focus:ring-primary/20 text-lg px-4"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "القسم المستهدف" : "Target Department"}</Label>
                                <Select value={department} onValueChange={(v: Department) => setDepartment(v)}>
                                    <SelectTrigger className="h-14 rounded-2xl border-border/60 text-base px-4">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Inbound">Inbound</SelectItem>
                                        <SelectItem value="Outbound">Outbound</SelectItem>
                                        <SelectItem value="NOVIP">NOVIP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "وصف قصير" : "Short Description"}</Label>
                                <Textarea
                                    placeholder={language === 'ar' ? "اكتب وصفاً مختصراً..." : "Write a brief description..."}
                                    className="min-h-[120px] rounded-2xl border-border/60 resize-none text-base p-4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "مدة الامتحان (د)" : "Duration (min)"}</Label>
                                    <div className="relative">
                                        <Clock className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />
                                        <Input
                                            type="number"
                                            className="h-14 ps-12 rounded-2xl border-border/60 text-lg font-semibold"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "درجة النجاح" : "Passing Grade"}</Label>
                                    <div className="relative">
                                        <Target className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/40" />
                                        <Input
                                            type="number"
                                            className="h-14 ps-12 rounded-2xl border-border/60 text-lg font-semibold"
                                            value={passingGrade}
                                            onChange={(e) => setPassingGrade(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">{language === 'ar' ? "حالة الامتحان" : "Exam Status"}</Label>
                                <Select value={status} onValueChange={(v: ExamStatus) => setStatus(v)}>
                                    <SelectTrigger className={cn(
                                        "h-14 rounded-2xl border-border/60 text-base px-4",
                                        status === 'active' && "text-emerald-500 font-bold",
                                        status === 'closed' && "text-destructive font-bold",
                                        status === 'draft' && "text-amber-500 font-bold",
                                    )}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active" className="text-emerald-500 font-bold">Active</SelectItem>
                                        <SelectItem value="closed" className="text-destructive font-bold">Closed</SelectItem>
                                        <SelectItem value="draft" className="text-amber-500 font-bold">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-dashed border-2 border-primary/20 bg-primary/5 rounded-[2rem]">
                        <CardContent className="p-8 flex items-start gap-4">
                            <AlertCircle className="size-6 text-primary shrink-0 mt-1" />
                            <p className="text-sm leading-relaxed text-primary/80 font-medium">
                                {language === 'ar'
                                    ? "تأكد من مراجعة معايير التصحيح قبل الحفظ. للاسئلة المقالية، سيتم طلب التصحيح اليدوي من قبل المشرفين."
                                    : "Make sure to review correction criteria before saving. For short answer questions, manual correction will be required by supervisors."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Questions List (Right/Left) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-secondary/50 text-foreground border border-border/40 shadow-sm">
                                <HelpCircle className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black tracking-tight">{language === 'ar' ? "الأسئلة" : "Questions"}</h3>
                                <p className="text-sm text-muted-foreground font-medium mt-1">{questions.length} {language === 'ar' ? "سؤال مضاف" : "questions added"}</p>
                            </div>
                        </div>

                        <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl h-11 px-6 font-black gap-2 shadow-xl shadow-primary/10 w-full sm:w-auto">
                                    <Plus className="size-5" />
                                    {language === 'ar' ? "إضافة سؤال" : "Add Question"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                                <DialogHeader className="p-8 pb-4 bg-muted/40">
                                    <DialogTitle className="text-2xl font-black">
                                        {editingQuestionId
                                            ? (language === 'ar' ? "تعديل السؤال" : "Edit Question")
                                            : (language === 'ar' ? "إنشاء سؤال جديد" : "Create New Question")
                                        }
                                    </DialogTitle>
                                    <DialogDescription className="font-medium text-base">
                                        {language === 'ar' ? "املأ تفاصيل السؤال أدناه" : "Fill in the question details below"}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "نص السؤال" : "Question Text"}</Label>
                                            <Textarea
                                                placeholder={language === 'ar' ? "أدخل نص السؤال هنا..." : "Enter question text here..."}
                                                className="min-h-[100px] rounded-2xl border-border/60 resize-none text-lg font-medium p-4"
                                                value={newQuestion.text}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "صورة السؤال (اختياري)" : "Question Image (Optional)"}</Label>
                                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border/40 rounded-2xl bg-muted/5 group hover:bg-muted/10 transition-all cursor-pointer relative overflow-hidden">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={handleImageUpload}
                                                />
                                                {newQuestion.image ? (
                                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                                                        <img src={newQuestion.image} alt="Preview" className="w-full h-full object-cover" />
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="absolute top-2 right-2 rounded-full h-8 w-8 z-20"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setNewQuestion({ ...newQuestion, image: "" })
                                                            }}
                                                        >
                                                            <X className="size-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="size-8" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-bold">{language === 'ar' ? "اضغط لرفع صورة" : "Click to upload an image"}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{language === 'ar' ? "يدعم PNG, JPG حتى 5MB" : "Supports PNG, JPG up to 5MB"}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "نوع السؤال" : "Question Type"}</Label>
                                            <Select
                                                value={newQuestion.type}
                                                onValueChange={(v: QuestionType) => {
                                                    const correction: CorrectionType = v === 'short_answer' ? 'manual' : 'automatic'
                                                    setNewQuestion({ ...newQuestion, type: v, correctionType: correction })
                                                }}
                                            >
                                                <SelectTrigger className="h-14 rounded-2xl text-base px-4">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiple_choice">{language === 'ar' ? "اختيارات" : "Multiple Choice"}</SelectItem>
                                                    <SelectItem value="true_false">{language === 'ar' ? "صح أو خطأ" : "True or False"}</SelectItem>
                                                    <SelectItem value="short_answer">{language === 'ar' ? "إجابة قصيرة" : "Short Answer"}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "درجة السؤال" : "Question Grade"}</Label>
                                            <Input
                                                type="number"
                                                className="h-14 rounded-2xl text-lg font-semibold px-4"
                                                value={newQuestion.grade}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, grade: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "نوع التصحيح" : "Correction Type"}</Label>
                                        <Badge variant="outline" className={cn(
                                            "h-14 w-full flex justify-center text-sm font-bold rounded-2xl border-border/40",
                                            newQuestion.correctionType === 'automatic' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                                        )}>
                                            {newQuestion.correctionType === 'automatic'
                                                ? (language === 'ar' ? "تلقائي" : "Automatic")
                                                : (language === 'ar' ? "يدوي" : "Manual")
                                            }
                                        </Badge>
                                    </div>

                                    {/* Conditional fields based on type */}
                                    {newQuestion.type === 'multiple_choice' && (
                                        <div className="space-y-6 pt-6 border-t border-border/40">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "خيارات الإجابة" : "Answer Options"}</Label>
                                                <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-full border border-border/40">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground">{language === 'ar' ? "إجابات متعددة" : "Multiple Answers"}</span>
                                                    <Switch
                                                        checked={newQuestion.isMultipleCorrect}
                                                        onCheckedChange={(checked: boolean) => setNewQuestion({
                                                            ...newQuestion,
                                                            isMultipleCorrect: checked,
                                                            correctAnswer: "",
                                                            correctAnswers: []
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {newQuestion.options?.map((opt, idx) => (
                                                    <div key={idx} className="flex items-center gap-4 bg-muted/20 p-2 pe-4 rounded-2xl border border-border/20">
                                                        <div className="flex items-center justify-center p-2">
                                                            {newQuestion.isMultipleCorrect ? (
                                                                <Checkbox
                                                                    className="h-6 w-6 rounded-lg"
                                                                    checked={newQuestion.correctAnswers?.includes(opt) && opt !== ""}
                                                                    onCheckedChange={(checked: boolean) => {
                                                                        const current = newQuestion.correctAnswers || []
                                                                        if (checked) {
                                                                            setNewQuestion({ ...newQuestion, correctAnswers: [...current, opt] })
                                                                        } else {
                                                                            setNewQuestion({ ...newQuestion, correctAnswers: current.filter(c => c !== opt) })
                                                                        }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="radio"
                                                                    name="correct-opt"
                                                                    className="size-6 accent-primary cursor-pointer"
                                                                    checked={newQuestion.correctAnswer === opt && opt !== ""}
                                                                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: opt })}
                                                                />
                                                            )}
                                                        </div>
                                                        <Input
                                                            placeholder={`${language === 'ar' ? "الخيار" : "Option"} ${idx + 1}`}
                                                            className="h-12 rounded-xl border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-base"
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const val = e.target.value
                                                                const newOpts = [...(newQuestion.options || [])]
                                                                const oldVal = newOpts[idx]
                                                                newOpts[idx] = val

                                                                // Update correct answers if value changed
                                                                let updatedSingle = newQuestion.correctAnswer
                                                                if (updatedSingle === oldVal) updatedSingle = val

                                                                let updatedMulti = (newQuestion.correctAnswers || []).map(c => c === oldVal ? val : c)

                                                                setNewQuestion({
                                                                    ...newQuestion,
                                                                    options: newOpts,
                                                                    correctAnswer: updatedSingle,
                                                                    correctAnswers: updatedMulti
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium italic bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 text-blue-600/80">
                                                * {language === 'ar'
                                                    ? (newQuestion.isMultipleCorrect ? "حدد المربعات بجانب الإجابات الصحيحة" : "حدد الدائرة بجانب الإجابة الصحيحة لتحديد مفتاح التصحيح")
                                                    : (newQuestion.isMultipleCorrect ? "Check the boxes next to all correct answers" : "Select the bubble next to the correct answer to set the answer key")
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {newQuestion.type === 'true_false' && (
                                        <div className="space-y-6 pt-6 border-t border-border/40">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{language === 'ar' ? "الإجابة الصحيحة" : "Correct Answer"}</Label>
                                            <div className="grid grid-cols-2 gap-6">
                                                <Button
                                                    variant={newQuestion.correctAnswer === 'true' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-16 text-lg font-bold shadow-sm"
                                                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: 'true' })}
                                                >
                                                    {language === 'ar' ? "صح" : "True"}
                                                </Button>
                                                <Button
                                                    variant={newQuestion.correctAnswer === 'false' ? 'default' : 'outline'}
                                                    className="rounded-2xl h-16 text-lg font-bold shadow-sm"
                                                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: 'false' })}
                                                >
                                                    {language === 'ar' ? "خطأ" : "False"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="p-8 pt-6 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsAddingQuestion(false)
                                            setEditingQuestionId(null)
                                        }}
                                        className="rounded-xl font-bold h-11 px-6"
                                    >
                                        {language === 'ar' ? "إلغاء" : "Cancel"}
                                    </Button>
                                    <Button onClick={handleAddQuestion} disabled={!newQuestion.text} className="rounded-xl px-8 font-black h-11 shadow-lg shadow-primary/20">
                                        {editingQuestionId
                                            ? (language === 'ar' ? "حفظ التعديلات" : "Save Changes")
                                            : (language === 'ar' ? "تأكيد السؤال" : "Confirm Question")
                                        }
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-6">
                        {questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 bg-muted/5 border-2 border-dashed border-border/40 rounded-[3rem]">
                                <div className="p-6 rounded-full bg-muted/30 mb-6">
                                    <HelpCircle className="size-12 text-muted-foreground/30" />
                                </div>
                                <h4 className="text-xl font-bold text-muted-foreground/60">{language === 'ar' ? "لا يوجد أسئلة مضافة" : "No questions added yet"}</h4>
                                <p className="text-base text-muted-foreground/40 font-medium mb-8 max-w-xs text-center leading-relaxed">
                                    {language === 'ar' ? "ابدأ بإضافة أول سؤال للامتحان . يمكنك الاختيار من أنواع متعددة من الأسئلة." : "Start by adding your first exam question. You can choose from multiple question types."}
                                </p>
                                <Button onClick={() => setIsAddingQuestion(true)} variant="outline" className="rounded-2xl border-dashed border-2 px-6 h-11 font-bold text-muted-foreground/70 hover:text-primary hover:border-primary/50 hover:bg-primary/5">
                                    {language === 'ar' ? "إضافة سؤال الآن" : "Add Question Now"}
                                </Button>
                            </div>
                        ) : (
                            questions.map((q, index) => (
                                <Card key={q.id} className="border-border/50 bg-card rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                    <div className="flex">
                                        <div className="w-2 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                                        <CardContent className="p-8 flex-1">
                                            <div className="flex items-start justify-between gap-6">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <Badge variant="outline" className="rounded-lg bg-muted/50 px-3 py-1 font-bold text-xs border-border/60">
                                                            {language === 'ar' ? "سؤال" : "Question"} {index + 1}
                                                        </Badge>
                                                        <Badge className={cn(
                                                            "rounded-lg px-3 py-1 font-bold text-xs uppercase shadow-none",
                                                            q.type === 'multiple_choice' && "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border border-blue-500/20",
                                                            q.type === 'true_false' && "bg-purple-500/10 text-purple-600 hover:bg-purple-500/10 border-purple-500/20",
                                                            q.type === 'short_answer' && "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 border-amber-500/20",
                                                        )}>
                                                            {q.type.replace('_', ' ')}
                                                        </Badge>
                                                        <div className="flex items-center gap-1.5 text-xs font-black text-muted-foreground/60 ps-3 border-s-2 border-border/40">
                                                            <span>{q.grade} {language === 'ar' ? "نقطة" : "pts"}</span>
                                                        </div>
                                                    </div>

                                                    {q.image && (
                                                        <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-border/40 shadow-sm mb-2">
                                                            <img src={q.image} alt="Question" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}

                                                    <p className="text-xl font-bold leading-relaxed text-foreground/90">{q.text}</p>
                                                    {q.type !== 'short_answer' && (
                                                        <div className="flex flex-wrap items-center gap-2 pt-2">
                                                            <div className="flex items-center gap-2 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                                                                <CheckCircle2 className="size-4 text-emerald-500" />
                                                                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                                    {language === 'ar' ? "الإجابة الصحيحة:" : "Correct Answer:"}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {q.isMultipleCorrect ? (
                                                                    q.correctAnswers?.map((ans, i) => (
                                                                        <Badge key={i} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none rounded-lg px-3 py-1 font-bold">
                                                                            {ans}
                                                                        </Badge>
                                                                    ))
                                                                ) : (
                                                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none rounded-lg px-3 py-1 font-bold">
                                                                        {q.correctAnswer}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEditQuestion(q)}
                                                        className="rounded-2xl h-11 w-11 text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                                                    >
                                                        <Pencil className="size-5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeQuestion(q.id)}
                                                        className="rounded-2xl h-11 w-11 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
