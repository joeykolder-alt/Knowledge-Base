"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Search,
    RotateCcw,
    TrendingUp,
    TrendingDown,
    PhoneIncoming,
    Activity,
    Calendar as CalendarIcon
} from "lucide-react"
import { format, isWithinInterval, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Type definition based on Excel
type DailyRecord = {
    date: string;
    agentId: string;
    id: string; // Employee ID
    name: string;
    customSchedule: string;
    excuse: string;
    netTime: string;
    loginScore: number;
    abandone: number;
    presentedTasks: number;
    work: number;
    target: number;
    targetExcuse: number;
    totalEvaluation: number | "OFF";
}

// Mock Data Generator with more realistic names and variety
const generateMockData = (): DailyRecord[] => {
    const data: DailyRecord[] = []

    // Extended list of mock employees to match "Quality" page style
    const employees = [
        { name: "Mustafa Abbas", id: "5967" },
        { name: "Sadiq Khalaf", id: "10955" },
        { name: "Muhammad Hussain", id: "11201" },
        { name: "Mariam Athir", id: "10877" },
        { name: "Hawraa Kadhim", id: "11976" },
        { name: "Ali Hussein", id: "10916" },
        { name: "Qasim Abdalhassan", id: "12484" },
        { name: "Majid Shaloul", id: "13594" },
        { name: "Ziyad Yasin", id: "14062" },
        { name: "Mahmoud Shakir", id: "10898" },
        { name: "Zena Majid", id: "11015" },
        { name: "Aya Hasan", id: "11240" },
        { name: "Yusra Ali", id: "11288" },
        { name: "Rand Tawfeeq", id: "11591" },
        { name: "Shams Zuhair", id: "11707" }
    ]

    // Generate data for the last 15 days
    for (let i = 0; i < 15; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        // Store date as simple YYYY-MM-DD string for easier display/filtering
        const dateStr = date.toISOString().split('T')[0]

        employees.forEach((emp) => {
            // Randomly determine if employee is OFF (approx 15% chance)
            const isOff = Math.random() < 0.15

            // Generate some random metrics
            const presentedTasks = isOff ? 0 : Math.floor(Math.random() * 150) + 50
            const work = isOff ? 0 : presentedTasks // Simplified equality for mock
            const loginScore = isOff ? 0 : parseFloat((Math.random() * 20).toFixed(2))
            const totalEval = isOff ? "OFF" : parseFloat((Math.random() * 30 + 70).toFixed(2))

            data.push({
                date: dateStr,
                agentId: emp.name.toLowerCase().replace(/\s/g, '').substring(0, 8),
                id: emp.id,
                name: emp.name,
                customSchedule: isOff ? "Off" : "8:00 AM - 4:30 PM",
                excuse: isOff ? "0:00:00" : (Math.random() > 0.7 ? "0:15:00" : "0:00:00"),
                netTime: isOff ? "0:00:00" : `${7 + Math.floor(Math.random())}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                loginScore: loginScore,
                abandone: isOff ? 0 : (Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0),
                presentedTasks: presentedTasks,
                work: work,
                target: 173,
                targetExcuse: isOff ? 0 : 160,
                totalEvaluation: totalEval,
            })
        })
    }
    return data
}

const MOCK_DATA = generateMockData()

export default function DailyPerformancePage() {
    const { language } = useLanguage()
    const [searchId, setSearchId] = useState("")
    const [dateFrom, setDateFrom] = useState<Date>()
    const [dateTo, setDateTo] = useState<Date>()
    const [results, setResults] = useState<DailyRecord[] | null>(null)
    const [isSearched, setIsSearched] = useState(false)

    const t = {
        title: language === 'ar' ? "الأداء اليومي" : "Daily Performance",
        searchSection: language === 'ar' ? "البحث والفلترة" : "Search & Filter",
        empIdPlaceholder: language === 'ar' ? "أدخل معرف الموظف (ID)" : "Enter Employee ID",
        dateFrom: language === 'ar' ? "من تاريخ" : "From Date",
        dateTo: language === 'ar' ? "إلى تاريخ" : "To Date",
        searchBtn: language === 'ar' ? "بحث" : "Search",
        clearBtn: language === 'ar' ? "تفريغ" : "Clear",
        pickDate: language === 'ar' ? "اختر تاريخ" : "Pick a date",
        availableRecords: language === 'ar' ? "السجلات المتاحة" : "Available Records",
        reloadData: language === 'ar' ? "إعادة تحميل البيانات" : "Reload Data",
        availableEmployees: language === 'ar' ? "الموظفون المتاحون:" : "Available employees:",
        stats: {
            highestEval: language === 'ar' ? "أعلى تقييم" : "Highest Eval",
            lowestEval: language === 'ar' ? "أدنى تقييم" : "Lowest Eval",
            highestCalls: language === 'ar' ? "أعلى مكالمات" : "Highest Calls",
            avgEval: language === 'ar' ? "متوسط التقييم" : "Avg Eval",
        },
        generalAnalysis: {
            title: language === 'ar' ? "التحليل العام" : "General Analysis",
            avgEval: language === 'ar' ? "متوسط التقييم النهائي" : "Avg Final Evaluation",
            avgCalls: language === 'ar' ? "متوسط عدد المكالمات" : "Avg Number of Calls",
            maxEval: language === 'ar' ? "أعلى تقييم" : "Highest Evaluation",
            maxCalls: language === 'ar' ? "أعلى عدد مكالمات" : "Highest Number of Calls",
            minEval: language === 'ar' ? "أقل تقييم" : "Lowest Evaluation",
            minCalls: language === 'ar' ? "أقل عدد مكالمات" : "Lowest Number of Calls",
        },
        table: {
            date: "Date",
            agentId: "Ag. ID",
            id: "ID",
            name: "Name",
            schedule: "Sched.",
            excuse: "Exc.",
            netTime: "Net",
            login: "Login",
            abandone: "Aban.",
            presented: "Tasks",
            work: "Work",
            target: "Tgt",
            targetExc: "T.Exc",
            total: "Score"
        }
    }

    const handleSearch = () => {
        let filtered = [...MOCK_DATA]

        // Filter by ID
        if (searchId.trim()) {
            filtered = filtered.filter(item => item.id.includes(searchId.trim()))
        }

        // Filter by Date Range
        if (dateFrom && dateTo) {
            filtered = filtered.filter(item => {
                const itemDate = parseISO(item.date)
                return isWithinInterval(itemDate, { start: dateFrom, end: dateTo })
            })
        }

        // Sort by Date (Oldest to Newest)
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setResults(filtered)
        setIsSearched(true)
    }

    const handleClear = () => {
        setSearchId("")
        setDateFrom(undefined)
        setDateTo(undefined)
        setResults(null)
        setIsSearched(false)
    }

    // Stats Calculation
    const stats = {
        maxEval: 0,
        minEval: 0,
        maxCalls: 0,
        minCalls: 0,
        avgEval: 0,
        avgCalls: 0
    }

    if (results && results.length > 0) {
        const validEvals = results
            .filter(r => r.totalEvaluation !== "OFF")
            .map(r => r.totalEvaluation as number)

        if (validEvals.length > 0) {
            stats.maxEval = Math.max(...validEvals)
            stats.minEval = Math.min(...validEvals)
            stats.avgEval = validEvals.reduce((a, b) => a + b, 0) / validEvals.length
        }

        const validTasks = results
            .filter(r => r.totalEvaluation !== "OFF")
            .map(r => r.presentedTasks)

        if (validTasks.length > 0) {
            stats.maxCalls = Math.max(...validTasks)
            stats.minCalls = Math.min(...validTasks)
            stats.avgCalls = validTasks.reduce((a, b) => a + b, 0) / validTasks.length
        }
    }

    // Get unique employees for the suggestions
    const uniqueEmployees = Array.from(new Set(MOCK_DATA.map(item => JSON.stringify({ name: item.name, id: item.id }))))
        .map(str => JSON.parse(str))
        .slice(0, 5)

    return (
        <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h1>
                <p className="text-muted-foreground">{language === 'ar' ? "عرض وتحليل بيانات الأداء اليومي" : "View and analyze daily performance data"}</p>
            </div>

            {/* Filter Section */}
            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Search className="w-5 h-5 text-primary" />
                            {t.searchSection}
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                                {t.availableRecords}: {MOCK_DATA.length}
                            </Badge>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setResults(null)
                                    setIsSearched(false)
                                    setSearchId("")
                                }}
                            >
                                <RotateCcw className="h-3 w-3 mr-2" />
                                {t.reloadData}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-end">
                    <div className="space-y-2">
                        <Label>{t.empIdPlaceholder}</Label>
                        <Input
                            placeholder="12345"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="bg-background/50"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">{t.availableEmployees}</span>
                            {uniqueEmployees.map((emp: any) => (
                                <Badge
                                    key={emp.id}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                                    onClick={() => setSearchId(emp.id)}
                                >
                                    {emp.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label>{t.dateFrom}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal bg-background/50",
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
                                    onSelect={setDateFrom}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label>{t.dateTo}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal bg-background/50",
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
                                    onSelect={setDateTo}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSearch} className="flex-1 gap-2 shadow-lg shadow-primary/20">
                            <Search className="w-4 h-4" />
                            {t.searchBtn}
                        </Button>
                        <Button onClick={handleClear} variant="outline" className="gap-2">
                            <RotateCcw className="w-4 h-4" />
                            {t.clearBtn}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section */}
            {isSearched && results && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title={t.stats.highestEval}
                            value={stats.maxEval.toFixed(2)}
                            icon={TrendingUp}
                            trend="High"
                            color="text-emerald-500"
                        />
                        <StatsCard
                            title={t.stats.lowestEval}
                            value={stats.minEval.toFixed(2)}
                            icon={TrendingDown}
                            trend="Low"
                            color="text-rose-500"
                        />
                        <StatsCard
                            title={t.stats.highestCalls}
                            value={stats.maxCalls.toString()}
                            icon={PhoneIncoming}
                            trend="Volume"
                            color="text-blue-500"
                        />
                        <StatsCard
                            title={t.stats.avgEval}
                            value={stats.avgEval.toFixed(2)}
                            icon={Activity}
                            trend="Average"
                            color="text-amber-500"
                        />
                    </div>

                    {/* Data Table */}
                    <Card className="border-border/50 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table className="text-xs">
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap w-[100px] px-2">{t.table.date}</TableHead>
                                        {/* <TableHead className="whitespace-nowrap px-2">{t.table.agentId}</TableHead> */}
                                        <TableHead className="whitespace-nowrap px-2">{t.table.id}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.name}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.schedule}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.excuse}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.netTime}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.login}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.abandone}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.presented}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.work}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.target}</TableHead>
                                        <TableHead className="whitespace-nowrap px-2">{t.table.targetExc}</TableHead>
                                        <TableHead className="text-right whitespace-nowrap px-2">{t.table.total}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.length > 0 ? results.map((row, i) => (
                                        <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium whitespace-nowrap px-2">{row.date}</TableCell>
                                            {/* <TableCell className="whitespace-nowrap px-2">{row.agentId}</TableCell> */}
                                            <TableCell className="whitespace-nowrap px-2">
                                                <Badge variant="outline" className="font-mono bg-background/50">{row.id}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium whitespace-nowrap px-2">{row.name}</TableCell>
                                            <TableCell className="whitespace-nowrap text-muted-foreground px-2">
                                                {row.customSchedule === "Off" ? "Off" : row.customSchedule.replace(" AM", "").replace(" PM", "").replace("8:00 - 4:30", "08:00-16:30")}
                                            </TableCell>
                                            <TableCell className="font-mono whitespace-nowrap px-2">{row.excuse}</TableCell>
                                            <TableCell className="font-mono whitespace-nowrap px-2">{row.netTime}</TableCell>
                                            <TableCell className="whitespace-nowrap px-2">{row.loginScore}</TableCell>
                                            <TableCell className="whitespace-nowrap px-2">{row.abandone}</TableCell>
                                            <TableCell className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap px-2">{row.presentedTasks}</TableCell>
                                            <TableCell className="whitespace-nowrap px-2">{row.work}</TableCell>
                                            <TableCell className="whitespace-nowrap px-2">{row.target}</TableCell>
                                            <TableCell className="whitespace-nowrap px-2">{row.targetExcuse}</TableCell>
                                            <TableCell className="text-right whitespace-nowrap px-2">
                                                {row.totalEvaluation === "OFF" ? (
                                                    <Badge variant="secondary">OFF</Badge>
                                                ) : (
                                                    <span className={cn(
                                                        "font-bold",
                                                        (row.totalEvaluation as number) >= 90 ? "text-emerald-600" :
                                                            (row.totalEvaluation as number) >= 80 ? "text-blue-600" :
                                                                "text-rose-600"
                                                    )}>
                                                        {row.totalEvaluation}%
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                                                {language === 'ar' ? "لا توجد نتائج مطابقة" : "No results found matching your criteria"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* General Analysis Section */}
                    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-8 duration-700">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                {t.generalAnalysis.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.avgEval}>{t.generalAnalysis.avgEval}</p>
                                    <p className="text-xl font-bold text-amber-500">{stats.avgEval.toFixed(2)}%</p>
                                </div>
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.avgCalls}>{t.generalAnalysis.avgCalls}</p>
                                    <p className="text-xl font-bold text-blue-500">{Math.round(stats.avgCalls)}</p>
                                </div>
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.maxEval}>{t.generalAnalysis.maxEval}</p>
                                    <p className="text-xl font-bold text-emerald-500">{stats.maxEval}%</p>
                                </div>
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.maxCalls}>{t.generalAnalysis.maxCalls}</p>
                                    <p className="text-xl font-bold text-emerald-500">{stats.maxCalls}</p>
                                </div>
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.minEval}>{t.generalAnalysis.minEval}</p>
                                    <p className="text-xl font-bold text-rose-500">{stats.minEval}%</p>
                                </div>
                                <div className="space-y-1 p-3 rounded-lg bg-background/50 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                                    <p className="text-xs text-muted-foreground truncate" title={t.generalAnalysis.minCalls}>{t.generalAnalysis.minCalls}</p>
                                    <p className="text-xl font-bold text-rose-500">{stats.minCalls}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-default group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {trend} Indicator
                </p>
            </CardContent>
        </Card>
    )
}
