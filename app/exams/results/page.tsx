"use client"

import * as React from "react"
import { useLanguage } from "@/components/providers"
import { useRouter } from "next/navigation"
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
    Search,
    User,
    Building2,
    IdCard,
    Trophy,
    XCircle,
    CheckCircle2,
    Calendar,
    FileText,
    ArrowRight,
    Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function StudentResultPage() {
    const { language, direction } = useLanguage()
    const router = useRouter()

    // Form State
    const [employeeName, setEmployeeName] = React.useState("")
    const [employeeId, setEmployeeId] = React.useState("")
    const [department, setDepartment] = React.useState("")

    // Result State
    const [hasSearched, setHasSearched] = React.useState(false)
    const [foundResults, setFoundResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedResult, setSelectedResult] = React.useState<any | null>(null)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setHasSearched(false)

        // Simulate network delay
        setTimeout(() => {
            const allResults = JSON.parse(localStorage.getItem("exam_results") || "[]")

            const matches = allResults.filter((res: any) =>
                res.employeeId.toLowerCase().trim() === employeeId.toLowerCase().trim() &&
                // Ideally we match name/dept too, but usually ID is unique enough. 
                // Let's match Dept at least to be strict as requested.
                (res.department === department) &&
                res.published === true
            )

            setFoundResults(matches)
            setHasSearched(true)
            setLoading(false)
        }, 800)
    }

    const t = {
        title: language === 'ar' ? "نتائج الامتحانات" : "Exam Results",
        subtitle: language === 'ar' ? "أدخل بياناتك لعرض النتائج المنشورة" : "Enter your details to view published results",
        name: language === 'ar' ? "الاسم الكامل" : "Full Name",
        id: language === 'ar' ? "رقم الموظف" : "Employee ID",
        dept: language === 'ar' ? "القسم" : "Department",
        search: language === 'ar' ? "عرض النتائج" : "View Results",
        noResults: language === 'ar' ? "لا توجد نتائج منشورة مطابقة لهذه البيانات" : "No published results found for these details",
        resultsFound: language === 'ar' ? "النتائج المتاحة:" : "Available Results:",
        score: language === 'ar' ? "الدرجة" : "Score",
        status: language === 'ar' ? "الحالة" : "Status",
        date: language === 'ar' ? "التاريخ" : "Date",
        passed: language === 'ar' ? "ناجح" : "Passed",
        failed: language === 'ar' ? "راسب" : "Failed",
        waiting: language === 'ar' ? "قيد المراجعة" : "Under Review",
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
            <div className="w-full max-w-4xl space-y-8">

                {/* Search Card */}
                <Card className="border-border/40 bg-card shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="text-center pt-10 pb-6 border-b border-border/40 bg-muted/10">
                        <div className="mx-auto size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 shadow-lg shadow-primary/10">
                            <Trophy className="size-8" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">{t.title}</CardTitle>
                        <CardDescription className="text-base font-medium">{t.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10">
                        <form onSubmit={handleSearch} className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 font-bold text-sm ps-1">
                                    <User className="size-4 text-primary" />
                                    {t.name}
                                </Label>
                                <Input
                                    required
                                    placeholder={language === 'ar' ? "الاسم..." : "Name..."}
                                    className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20 px-4 text-base"
                                    value={employeeName}
                                    onChange={e => setEmployeeName(e.target.value)}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-sm ps-1">
                                        <IdCard className="size-4 text-primary" />
                                        {t.id}
                                    </Label>
                                    <Input
                                        required
                                        placeholder="1234..."
                                        className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20 px-4 text-base"
                                        value={employeeId}
                                        onChange={e => setEmployeeId(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-sm ps-1">
                                        <Building2 className="size-4 text-primary" />
                                        {t.dept}
                                    </Label>
                                    <Select required value={department} onValueChange={setDepartment}>
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-none px-4 text-base">
                                            <SelectValue placeholder={language === 'ar' ? "اختر..." : "Select..."} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Inbound">Inbound</SelectItem>
                                            <SelectItem value="Outbound">Outbound</SelectItem>
                                            <SelectItem value="NOVIP">NOVIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl font-black text-lg gap-2 shadow-xl shadow-primary/20 mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Search className="size-5" />
                                        {t.search}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Results List */}
                {hasSearched && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
                        {foundResults.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {foundResults.map((result) => (
                                    <Card key={result.id} className="border-border/50 bg-card rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                        <CardHeader className="p-6 pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                                        <FileText className="size-3" />
                                                        {language === 'ar' ? "امتحان" : "Exam"}
                                                    </div>
                                                    <CardTitle className="text-xl font-black line-clamp-1 leading-tight">{language === 'ar' ? result.examTitle : result.examTitle}</CardTitle>
                                                </div>
                                                <Badge className={cn(
                                                    "h-8 px-3 rounded-lg font-black text-xs uppercase tracking-wider border-none",
                                                    result.status === 'passed' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                                )}>
                                                    {result.status === 'passed' ? t.passed : t.failed}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-4">
                                            <div className="flex bg-muted/30 rounded-2xl p-4 items-center justify-between border border-border/40">
                                                <div className="space-y-1">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{t.score}</span>
                                                    <div className={cn(
                                                        "text-3xl font-black",
                                                        result.score >= 50 ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        {result.score}
                                                    </div>
                                                </div>
                                                <div className="h-10 w-[1px] bg-border/60" />
                                                <div className="space-y-1 text-end">
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{t.date}</span>
                                                    <div className="text-sm font-bold flex items-center gap-1.5 text-foreground justify-end">
                                                        <Calendar className="size-3.5 opacity-50" />
                                                        {result.date}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Note for manual correction */}
                                            {result.correctionType === 'waiting' && !result.published && (
                                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 p-2 rounded-lg">
                                                    <div className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                                    Waiting for final review
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full mt-4 h-10 rounded-xl font-bold bg-secondary/50 hover:bg-secondary/70 border-none gap-2"
                                                onClick={() => setSelectedResult(result)}
                                            >
                                                <Eye className="size-4" />
                                                {language === 'ar' ? "عرض التفاصيل" : "View Details"}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card rounded-[2.5rem] border-dashed border-2 border-border/60">
                                <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                                    <XCircle className="size-8 opacity-50" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{t.noResults}</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto">{language === 'ar' ? "تأكد من صحة البيانات المدخلة أو تواصل مع المشرف" : "Check your details or contact the administrator"}</p>
                            </div>
                        )}
                    </div>
                )}
                {/* View Details Dialog */}
                <Dialog open={!!selectedResult} onOpenChange={(open) => !open && setSelectedResult(null)}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] border-border/40 bg-card shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black">
                                {language === 'ar' ? "تفاصيل الامتحان" : "Exam Details"}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium">
                                {language === 'ar' ? "مراجعة إجاباتك ونتائج التصحيح" : "Review your answers and correction results"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 pt-6">
                            {selectedResult?.answers.map((ans: any, idx: number) => (
                                <div key={idx} className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm text-foreground/80">
                                                Q{idx + 1}: {ans.question}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground/60 border-border/40">
                                                    {ans.points} {language === 'ar' ? "نقاط" : "Points"}
                                                </Badge>
                                                {ans.earnedPoints !== undefined && (
                                                    <Badge className={cn(
                                                        "text-[9px] font-black border-none",
                                                        ans.earnedPoints === ans.points ? "bg-emerald-500/10 text-emerald-500" :
                                                            ans.earnedPoints > 0 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                                    )}>
                                                        {language === 'ar' ? "الدرجة:" : "Earned:"} {ans.earnedPoints}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <Badge className={cn(
                                            "rounded-lg font-black text-[9px] border-none shrink-0",
                                            ans.earnedPoints === ans.points ? "bg-emerald-500/10 text-emerald-500" :
                                                ans.earnedPoints > 0 ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                                        )}>
                                            {ans.earnedPoints === ans.points ? (language === 'ar' ? "صحيح" : "CORRECT") :
                                                ans.earnedPoints > 0 ? (language === 'ar' ? "جزئي" : "PARTIAL") :
                                                    (language === 'ar' ? "خطأ" : "INCORRECT")}
                                        </Badge>
                                    </div>
                                    <div className="ps-4 border-s-2 border-primary/20 bg-primary/5 p-3 rounded-e-xl">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {language === 'ar' ? "إجابتك:" : "Your Answer:"} <span className="text-foreground">{JSON.stringify(ans.answer).replace(/^"|"$/g, '')}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
