"use client"

import * as React from "react"
import {
    Search,
    Eraser,
    TrendingUp,
    TrendingDown,
    Award,
    Calendar,
    Target,
    AlertTriangle,
    MessageSquare,
    BarChart3,
    User,
    Download,
    FileText,
    Star,
    RefreshCw
} from "lucide-react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

interface QualityRecord {
    id: number
    employeeName: string
    date: string
    callSrc: string
    score: number
    weakestArea: string
    note: string
}

export default function QualityMainPage() {
    const { language } = useLanguage()
    const [employeeName, setEmployeeName] = React.useState("")
    const [dateFrom, setDateFrom] = React.useState("")
    const [dateTo, setDateTo] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<any>(null)
    const [records, setRecords] = React.useState<QualityRecord[]>([])

    // Load records from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('quality_records')
        if (saved) {
            try {
                let parsed = JSON.parse(saved)

                // Clean "التأهيلية" from notes
                parsed = parsed.map((record: any) => ({
                    ...record,
                    note: record.note ? record.note.replace('التأهيلية', '').trim() : record.note
                }))

                // Check if data has the new structure (callSrc instead of callType)
                // OR if data contains old 'Time Management' values
                const hasOldStructure = parsed.length > 0 && !('callSrc' in parsed[0])
                const hasOldTimeManagement = parsed.some((record: any) => record.weakestArea === 'Time Management')

                if (hasOldStructure || hasOldTimeManagement) {
                    // Old data structure, clear and reload with new dummy data
                    localStorage.removeItem('quality_records')
                    window.location.reload()
                    return
                }
                setRecords(parsed)
            } catch (_) { }
        } else {
            // Initialize with dummy data
            const dummyData: QualityRecord[] = [
                { id: 1, employeeName: "أحمد علي", date: "2026-01-15", callSrc: "12345", score: 85, weakestArea: "Diagnosis", note: "أداء جيد ولكن يحتاج تحسين في دقة التشخيص" },
                { id: 2, employeeName: "أحمد علي", date: "2026-01-18", callSrc: "67890", score: 92, weakestArea: "Answer & Ending", note: "مهارات تواصل ممتازة" },
                { id: 3, employeeName: "أحمد علي", date: "2026-01-22", callSrc: "23456", score: 78, weakestArea: "Diagnosis", note: "يحتاج طرح المزيد من الأسئلة " },
                { id: 4, employeeName: "أحمد علي", date: "2026-01-25", callSrc: "78901", score: 88, weakestArea: "Documentation", note: "أداء جيد بشكل عام" },
                { id: 5, employeeName: "أحمد علي", date: "2026-01-26", callSrc: "34567", score: 90, weakestArea: "Problem Solving", note: "تحسن ملحوظ في الأداء" },

                { id: 6, employeeName: "سارة محمد", date: "2026-01-16", callSrc: "45678", score: 95, weakestArea: "Problem Solving", note: "خدمة عملاء متميزة" },
                { id: 7, employeeName: "سارة محمد", date: "2026-01-20", callSrc: "56789", score: 90, weakestArea: "Answer & Ending", note: "نهج احترافي جداً" },
                { id: 8, employeeName: "سارة محمد", date: "2026-01-24", callSrc: "89012", score: 87, weakestArea: "Diagnosis", note: "معرفة تقنية جيدة" },
                { id: 9, employeeName: "سارة محمد", date: "2026-01-26", callSrc: "90123", score: 93, weakestArea: "Documentation", note: "أداء متميز" },

                { id: 10, employeeName: "محمد حسن", date: "2026-01-17", callSrc: "11234", score: 65, weakestArea: "Answer & Ending", note: "يحتاج طرح المزيد من الأسئلة" },
                { id: 11, employeeName: "محمد حسن", date: "2026-01-21", callSrc: "22345", score: 70, weakestArea: "Diagnosis", note: "يتحسن ولكن لا يزال بحاجة للعمل" },
                { id: 12, employeeName: "محمد حسن", date: "2026-01-23", callSrc: "33456", score: 68, weakestArea: "Answer & Ending", note: "يحتاج طرح المزيد من الأسئلة " },
                { id: 13, employeeName: "محمد حسن", date: "2026-01-26", callSrc: "44567", score: 72, weakestArea: "Diagnosis", note: "تحسن طفيف" },

                { id: 14, employeeName: "فاطمة كريم", date: "2026-01-14", callSrc: "55678", score: 82, weakestArea: "Documentation", note: "معالجة جيدة للمكالمات" },
                { id: 15, employeeName: "فاطمة كريم", date: "2026-01-19", callSrc: "66789", score: 86, weakestArea: "Problem Solving", note: "بناء علاقة ممتاز مع العملاء" },
                { id: 16, employeeName: "فاطمة كريم", date: "2026-01-23", callSrc: "77890", score: 89, weakestArea: "Diagnosis", note: "نهج شامل جداً" },
                { id: 17, employeeName: "فاطمة كريم", date: "2026-01-25", callSrc: "88901", score: 91, weakestArea: "Answer & Ending", note: "أداء ممتاز" },

                { id: 18, employeeName: "علي جواد", date: "2026-01-15", callSrc: "99012", score: 88, weakestArea: "Documentation", note: "مهارات قوية في حل المشاكل" },
                { id: 19, employeeName: "علي جواد", date: "2026-01-20", callSrc: "10123", score: 84, weakestArea: "Diagnosis", note: "أداء جيد بشكل عام" },
                { id: 20, employeeName: "علي جواد", date: "2026-01-24", callSrc: "21234", score: 87, weakestArea: "Problem Solving", note: "تحسن مستمر" },

                { id: 21, employeeName: "زينب أحمد", date: "2026-01-16", callSrc: "32345", score: 79, weakestArea: "Answer & Ending", note: "يحتاج تحسين في إنهاء المكالمات" },
                { id: 22, employeeName: "زينب أحمد", date: "2026-01-21", callSrc: "43456", score: 81, weakestArea: "Diagnosis", note: "أداء متوسط" },
                { id: 23, employeeName: "زينب أحمد", date: "2026-01-25", callSrc: "54567", score: 83, weakestArea: "Documentation", note: "تحسن ملحوظ" },

                { id: 24, employeeName: "حسين عباس", date: "2026-01-17", callSrc: "65678", score: 56, weakestArea: "Diagnosis", note: "يحتاج طرح المزيد من الأسئلة " },
                { id: 25, employeeName: "حسين عباس", date: "2026-01-22", callSrc: "76789", score: 62, weakestArea: "Answer & Ending", note: "أداء ضعيف يحتاج تدريب" },
                { id: 26, employeeName: "حسين عباس", date: "2026-01-26", callSrc: "87890", score: 59, weakestArea: "Diagnosis", note: "يحتاج طرح المزيد من الأسئلة " },

                { id: 27, employeeName: "مريم خالد", date: "2026-01-18", callSrc: "98901", score: 94, weakestArea: "Documentation", note: "أداء ممتاز ومتميز" },
                { id: 28, employeeName: "مريم خالد", date: "2026-01-22", callSrc: "19012", score: 96, weakestArea: "Problem Solving", note: "موظفة نموذجية" },
                { id: 29, employeeName: "مريم خالد", date: "2026-01-25", callSrc: "20123", score: 97, weakestArea: "Answer & Ending", note: "أفضل أداء في الفريق" },

                { id: 30, employeeName: "يوسف رشيد", date: "2026-01-19", callSrc: "31234", score: 75, weakestArea: "Answer & Ending", note: "أداء مقبول" },
                { id: 31, employeeName: "يوسف رشيد", date: "2026-01-23", callSrc: "42345", score: 77, weakestArea: "Diagnosis", note: "يحتاج المزيد من التركيز" },
                { id: 32, employeeName: "يوسف رشيد", date: "2026-01-26", callSrc: "53456", score: 80, weakestArea: "Documentation", note: "تحسن جيد" },
            ]
            setRecords(dummyData)
            localStorage.setItem('quality_records', JSON.stringify(dummyData))
        }
    }, [])

    const t = {
        pageTitle: language === 'ar' ? "إدارة الجودة" : "Quality Management",
        pageSubtitle: language === 'ar' ? "تتبع شامل لمعايير الجودة وأداء الموظفين" : "Comprehensive quality standards and employee performance tracking",
        employeeName: language === 'ar' ? "اسم الموظف" : "Employee Name",
        dateFrom: language === 'ar' ? "من تاريخ" : "From Date",
        dateTo: language === 'ar' ? "إلى تاريخ" : "To Date",
        search: language === 'ar' ? "بحث" : "Search",
        clear: language === 'ar' ? "تفريغ" : "Clear",
        summary: language === 'ar' ? "ملخص الأداء" : "Performance Summary",
        totalEvaluations: language === 'ar' ? "إجمالي التقييمات" : "Total Evaluations",
        avgScore: language === 'ar' ? "متوسط الدرجة" : "Average Score",
        lastEvaluation: language === 'ar' ? "آخر تقييم" : "Last Evaluation",
        bestScore: language === 'ar' ? "أفضل درجة" : "Best Score",
        performanceTrend: language === 'ar' ? "تتبع الأداء" : "Performance Trend",
        weaknessAnalysis: language === 'ar' ? "تحليل محاور الضعف" : "Weakness Analysis",
        scoreDistribution: language === 'ar' ? "توزيع الدرجات" : "Score Distribution",
        detailsTable: language === 'ar' ? "تفاصيل التقييمات" : "Evaluation Details",
        date: language === 'ar' ? "التاريخ" : "Date",
        callSrc: language === 'ar' ? "Call SRC" : "Call SRC",
        result: language === 'ar' ? "النتيجة" : "Result",
        weakestArea: language === 'ar' ? "أضعف محور" : "Weakest Area",
        note: language === 'ar' ? "الملاحظة" : "Note",
        mostWeakArea: language === 'ar' ? "أكثر محور ضعف" : "Most Common Weakness",
        mostFrequentNote: language === 'ar' ? "أكثر ملاحظة مكررة" : "Most Frequent Note",
        repetitions: language === 'ar' ? "التكرارات" : "Repetitions",
        generalAnalysis: language === 'ar' ? "التحليل العام" : "General Analysis",
        topEmployee: language === 'ar' ? "أعلى موظف" : "Top Employee",
        lowestEmployee: language === 'ar' ? "أدنى موظف" : "Lowest Employee",
        noData: language === 'ar' ? "لا توجد بيانات" : "No data available"
    }

    const handleSearch = () => {
        if (!employeeName.trim()) return

        const filteredRecords = records.filter(r => {
            const matchesName = r.employeeName.toLowerCase().includes(employeeName.toLowerCase())
            const recordDate = new Date(r.date)
            const fromDate = dateFrom ? new Date(dateFrom) : null
            const toDate = dateTo ? new Date(dateTo) : null

            const inDateRange = (!fromDate || recordDate >= fromDate) && (!toDate || recordDate <= toDate)
            return matchesName && inDateRange
        })

        if (filteredRecords.length === 0) {
            setSearchResults('no_data')
            return
        }

        const totalEvaluations = filteredRecords.length
        const avgScore = Math.round(filteredRecords.reduce((acc, r) => acc + r.score, 0) / totalEvaluations)
        const bestScore = Math.max(...filteredRecords.map(r => r.score))
        const lastEvaluation = new Date(Math.max(...filteredRecords.map(r => new Date(r.date).getTime()))).toLocaleDateString()

        // Performance trend data (group by date)
        const trendData = filteredRecords
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(r => ({
                date: new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                score: r.score
            }))

        // Weakness analysis
        const weaknessCount: Record<string, number> = {}
        filteredRecords.forEach(r => {
            weaknessCount[r.weakestArea] = (weaknessCount[r.weakestArea] || 0) + 1
        })
        const weaknessData = Object.entries(weaknessCount).map(([name, value]) => ({ name, value }))

        // Score distribution
        const scoreRanges = { '0-50': 0, '51-70': 0, '71-85': 0, '86-100': 0 }
        filteredRecords.forEach(r => {
            if (r.score <= 50) scoreRanges['0-50']++
            else if (r.score <= 70) scoreRanges['51-70']++
            else if (r.score <= 85) scoreRanges['71-85']++
            else scoreRanges['86-100']++
        })
        const distributionData = Object.entries(scoreRanges).map(([range, count]) => ({ range, count }))

        // Most common weakness
        const mostWeakArea = Object.entries(weaknessCount).sort((a, b) => b[1] - a[1])[0]

        // Most frequent note
        const noteCount: Record<string, number> = {}
        filteredRecords.forEach(r => {
            if (r.note) noteCount[r.note] = (noteCount[r.note] || 0) + 1
        })
        const mostFrequentNote = Object.entries(noteCount).sort((a, b) => b[1] - a[1])[0]

        setSearchResults({
            employeeName: filteredRecords[0].employeeName,
            totalEvaluations,
            avgScore,
            lastEvaluation,
            bestScore,
            trendData,
            weaknessData,
            distributionData,
            records: filteredRecords,
            mostWeakArea,
            mostFrequentNote
        })
    }

    const handleClear = () => {
        setEmployeeName("")
        setDateFrom("")
        setDateTo("")
        setSearchResults(null)
    }

    // General analysis (all employees)
    const getGeneralAnalysis = () => {
        if (records.length === 0) return null

        const employeeScores: Record<string, number[]> = {}
        records.forEach(r => {
            if (!employeeScores[r.employeeName]) employeeScores[r.employeeName] = []
            employeeScores[r.employeeName].push(r.score)
        })

        const employeeAvgs = Object.entries(employeeScores).map(([name, scores]) => ({
            name,
            avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        }))

        const sortedEmployees = employeeAvgs.sort((a, b) => b.avg - a.avg)
        const topEmployee = sortedEmployees[0]
        const lowestEmployee = sortedEmployees[sortedEmployees.length - 1]

        return { topEmployee, lowestEmployee }
    }

    const generalAnalysis = getGeneralAnalysis()

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

    return (
        <div className="space-y-8 pb-20 max-w-[1920px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                            <Award className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.pageTitle}</h1>
                    </div>
                    <p className="text-muted-foreground text-lg ltr:pl-[3.25rem] rtl:pr-[3.25rem]">{t.pageSubtitle}</p>
                </div>
            </div>

            {/* Search Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Search className="h-5 w-5" />
                            {language === 'ar' ? "بحث عن موظف" : "Employee Search"}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                                {language === 'ar' ? "السجلات المتاحة" : "Available Records"}: {records.length}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    localStorage.removeItem('quality_records')
                                    window.location.reload()
                                }}
                            >
                                <RefreshCw className="h-3 w-3 mr-2" />
                                {language === 'ar' ? "إعادة تحميل البيانات" : "Reload Data"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs font-semibold">{t.employeeName}</Label>
                            <Input
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                placeholder={language === 'ar' ? "أدخل الاسم..." : "Enter name..."}
                                className="h-10"
                            />
                            {records.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs text-muted-foreground">{language === 'ar' ? "الموظفون المتاحون:" : "Available employees:"}</span>
                                    {Array.from(new Set(records.map(r => r.employeeName))).slice(0, 5).map((name) => (
                                        <Badge
                                            key={name}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                                            onClick={() => setEmployeeName(name)}
                                        >
                                            {name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">{t.dateFrom}</Label>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">{t.dateTo}</Label>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <Button onClick={handleSearch} className="flex-1 md:flex-none">
                            <Search className="h-4 w-4 mr-2" />
                            {t.search}
                        </Button>
                        <Button onClick={handleClear} variant="outline">
                            <Eraser className="h-4 w-4 mr-2" />
                            {t.clear}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            {searchResults && searchResults !== 'no_data' && (
                <div className="space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-primary/20">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                                        <User className="h-3.5 w-3.5" />
                                        {searchResults.employeeName}
                                    </div>
                                    <Separator />
                                    <div className="text-2xl font-bold text-primary">{searchResults.totalEvaluations}</div>
                                    <p className="text-xs text-muted-foreground">{t.totalEvaluations}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-500/20">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                                        <Target className="h-3.5 w-3.5" />
                                        {t.avgScore}
                                    </div>
                                    <Separator />
                                    <div className="text-2xl font-bold text-emerald-600">{searchResults.avgScore}%</div>
                                    <p className="text-xs text-muted-foreground">{t.avgScore}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-500/20">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {t.lastEvaluation}
                                    </div>
                                    <Separator />
                                    <div className="text-lg font-bold text-blue-600">{searchResults.lastEvaluation}</div>
                                    <p className="text-xs text-muted-foreground">{t.lastEvaluation}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-500/20">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                                        <Star className="h-3.5 w-3.5" />
                                        {t.bestScore}
                                    </div>
                                    <Separator />
                                    <div className="text-2xl font-bold text-amber-600">{searchResults.bestScore}%</div>
                                    <p className="text-xs text-muted-foreground">{t.bestScore}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Performance Trend */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <TrendingUp className="h-4 w-4" />
                                    {t.performanceTrend}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={searchResults.trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="score" stroke="#0088FE" strokeWidth={2} name={language === 'ar' ? "الدرجة" : "Score"} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Score Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BarChart3 className="h-4 w-4" />
                                    {t.scoreDistribution}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={searchResults.distributionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry: any) => {
                                                const percent = (entry.percent || 0) * 100;
                                                // Only show label if percentage is greater than 5%
                                                if (percent < 5) return null;
                                                return `${entry.range}: ${percent.toFixed(0)}%`
                                            }}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {searchResults.distributionData.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Weakness Analysis Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="h-4 w-4" />
                                {t.weaknessAnalysis}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={searchResults.weaknessData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#FF8042" name={language === 'ar' ? "التكرارات" : "Occurrences"} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Most Common Issues */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-red-500/20 bg-red-50/20 dark:bg-red-950/10">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm font-semibold">
                                        <AlertTriangle className="h-4 w-4" />
                                        {t.mostWeakArea}
                                    </div>
                                    <div className="text-xl font-bold text-foreground">{searchResults.mostWeakArea?.[0] || 'N/A'}</div>
                                    <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-0">
                                        {t.repetitions}: {searchResults.mostWeakArea?.[1] || 0}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10">
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                                        <MessageSquare className="h-4 w-4" />
                                        {t.mostFrequentNote}
                                    </div>
                                    <div className="text-lg font-bold text-foreground line-clamp-2">{searchResults.mostFrequentNote?.[0] || 'N/A'}</div>
                                    <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-0">
                                        {t.repetitions}: {searchResults.mostFrequentNote?.[1] || 0}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                {t.detailsTable}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-3 font-semibold">{t.date}</th>
                                            <th className="text-left p-3 font-semibold">{t.callSrc}</th>
                                            <th className="text-left p-3 font-semibold">{t.result}</th>
                                            <th className="text-left p-3 font-semibold">{t.weakestArea}</th>
                                            <th className="text-left p-3 font-semibold">{t.note}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.records.map((record: QualityRecord) => (
                                            <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30">
                                                <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className="font-mono text-sm text-muted-foreground">
                                                        {record.callSrc}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className={cn(
                                                        "font-bold",
                                                        record.score >= 86 ? "text-emerald-600" :
                                                            record.score >= 71 ? "text-blue-600" :
                                                                record.score >= 51 ? "text-amber-600" : "text-red-600"
                                                    )}>
                                                        {record.score}%
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 text-xs">
                                                        {record.weakestArea}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-muted-foreground max-w-[300px] truncate">{record.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {searchResults === 'no_data' && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <div className="space-y-4">
                            <div className="bg-muted/40 p-5 rounded-full inline-block">
                                <AlertTriangle className="h-10 w-10 text-muted-foreground/20" />
                            </div>
                            <p className="text-muted-foreground font-semibold">{t.noData}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* General Analysis */}
            {generalAnalysis && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="h-5 w-5" />
                            {t.generalAnalysis}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                <div className="bg-emerald-500 p-3 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">{t.topEmployee}</p>
                                    <p className="text-xl font-bold text-foreground">{generalAnalysis.topEmployee.name}</p>
                                    <Badge className="bg-emerald-600 text-white mt-1">{generalAnalysis.topEmployee.avg}% {t.avgScore}</Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                                <div className="bg-red-500 p-3 rounded-full">
                                    <TrendingDown className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase">{t.lowestEmployee}</p>
                                    <p className="text-xl font-bold text-foreground">{generalAnalysis.lowestEmployee.name}</p>
                                    <Badge className="bg-red-600 text-white mt-1">{generalAnalysis.lowestEmployee.avg}% {t.avgScore}</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
