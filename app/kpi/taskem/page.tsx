"use client"

import * as React from "react"
import {
    Plus,
    Calendar as CalendarIcon,
    X,
    User,
    Target,
    Clock,
    Trash2,
    Edit,
    RefreshCw,
    Hourglass,
    MoreHorizontal,
    Timer,
    CheckCircle2,
    TrendingUp,
    AlertCircle,
    BarChart3,
    ArrowUpRight,
    Search,
    LayoutList,
    Activity,
    FileText,
    Download,
    Eraser,
    ChevronRight,
    FileBarChart
} from "lucide-react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Task {
    id: number
    employeeName: string
    employeeId: string
    kpiName: string
    targetValue: string
    currentValue: string
    deadline: string
    progress: string
    status: string
    createdAt: string
}

const getTaskStatus = (task: Task, now: Date = new Date()) => {
    const progress = Number(task.progress)
    const isCompleted = progress >= 100
    const isFailed = !isCompleted && new Date(task.deadline) < now

    if (isCompleted) return 'DONE'
    if (isFailed) return 'FAILED'
    return 'IN_PROGRESS'
}

function CountdownTimer({ deadline, status }: { deadline: string, status: string }) {
    const [timeLeft, setTimeLeft] = React.useState("")
    const { language } = useLanguage()

    React.useEffect(() => {
        if (status === 'DONE') {
            setTimeLeft(language === 'ar' ? "مكتمل" : "Completed")
            return
        }

        const calculateTimeLeft = () => {
            const difference = +new Date(deadline) - +new Date()

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24))
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
                const minutes = Math.floor((difference / 1000 / 60) % 60)
                const seconds = Math.floor((difference / 1000) % 60)

                return `${days}d ${hours}h ${minutes}m ${seconds}s`
            }
            return language === 'ar' ? "منتهي" : "Expired"
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        setTimeLeft(calculateTimeLeft())

        return () => clearInterval(timer)
    }, [deadline, language, status])

    return <span className="font-mono text-sm font-bold tracking-tight">{timeLeft}</span>
}

function TaskCard({ task, t, now, handleEdit, handleDelete, handleOpenUpdate }: { task: Task, t: any, now: Date, handleEdit: any, handleDelete: any, handleOpenUpdate: any }) {
    const status = getTaskStatus(task, now)
    const remaining = Math.max(0, Number(task.targetValue) - Number(task.currentValue))
    const progress = Number(task.progress)

    const getStatusConfig = () => {
        if (status === 'DONE') return {
            label: "DONE",
            icon: CheckCircle2,
            stripClass: "bg-emerald-500",
            badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
            footerClass: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40",
            timerClass: "text-emerald-700 dark:text-emerald-500",
            buttonClass: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-800 text-emerald-700"
        }
        if (status === 'FAILED') return {
            label: "FAILED",
            icon: AlertCircle,
            stripClass: "bg-destructive",
            badgeClass: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400",
            footerClass: "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40",
            timerClass: "text-red-700 dark:text-red-500",
            buttonClass: "hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-800 text-red-700"
        }
        return {
            label: "IN PROGRESS",
            icon: Activity,
            stripClass: "bg-blue-500",
            badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
            footerClass: "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40",
            timerClass: "text-amber-700 dark:text-amber-500",
            buttonClass: "hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:text-amber-800 text-amber-700"
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <Card className="group relative overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Status Strip */}
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full z-10 transition-colors duration-300",
                statusConfig.stripClass
            )} />

            <CardHeader className="pb-4 pt-5 pl-7 pr-5">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={cn(
                        "font-mono text-[10px] tracking-widest border-0 py-1 px-2 uppercase rounded-md font-bold flex items-center gap-1.5",
                        statusConfig.badgeClass
                    )}>
                        <statusConfig.icon className="h-3 w-3" />
                        {statusConfig.label}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground opacity-50">#{task.id.toString().slice(-4)}</span>
                </div>

                <CardTitle className="text-lg font-bold leading-tight break-words pr-4 text-foreground" title={task.kpiName}>
                    {task.kpiName}
                </CardTitle>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border w-full">
                    <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.employeeName}`} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">{task.employeeName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{task.employeeName}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{t.empId}: {task.employeeId}</span>
                    </div>

                    {/* Action Menu - More Subtle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-muted-foreground hover:text-foreground hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Modify
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(task.id)}>
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pl-7 pr-5 pb-5">
                {/* Complex Metric Grid */}
                <div className="grid grid-cols-3 gap-0 border border-border rounded-lg overflow-hidden bg-muted/20">
                    <div className="p-3 flex flex-col items-center justify-center border-r border-border">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">{t.currentVal}</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{task.currentValue}</span>
                    </div>
                    <div className="p-3 flex flex-col items-center justify-center border-r border-border">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">{t.targetVal}</span>
                        <span className="text-lg font-bold">{task.targetValue}</span>
                    </div>
                    <div className="p-3 flex flex-col items-center justify-center bg-muted/40">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">{t.remaining}</span>
                        <span className="text-lg font-bold text-muted-foreground">{remaining}</span>
                    </div>
                </div>

                {/* Progress Block */}
                <div className="space-y-2.5">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {t.progress}
                        </div>
                        <span className="text-sm font-bold font-mono">{progress}%</span>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500 relative overflow-hidden",
                                statusConfig.stripClass
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                        </div>
                    </div>
                </div>

                {/* Timer Footer */}
                <div className={cn(
                    "rounded-md p-2.5 flex items-center justify-between border",
                    statusConfig.footerClass
                )}>
                    <div className={cn("flex items-center gap-2 text-xs font-medium", statusConfig.timerClass)}>
                        <Hourglass className="h-3.5 w-3.5" />
                        <CountdownTimer deadline={task.deadline} status={status} />
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenUpdate(task)}
                        className={cn("h-7 px-3 text-xs font-semibold", statusConfig.buttonClass)}
                    >
                        Update <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function TaskEmPage() {
    const { language } = useLanguage()
    const [open, setOpen] = React.useState(false)
    const [updateOpen, setUpdateOpen] = React.useState(false)
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [now, setNow] = React.useState(new Date())

    // Report Modal State
    const [reportOpen, setReportOpen] = React.useState(false)
    const [reportSearchName, setReportSearchName] = React.useState("")
    const [reportSearchId, setReportSearchId] = React.useState("")
    const [isGeneratingReport, setIsGeneratingReport] = React.useState(false)
    const [reportResult, setReportResult] = React.useState<any>(null)

    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Form and Editing State
    const [isEditing, setIsEditing] = React.useState(false)
    const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
    const [formData, setFormData] = React.useState({
        id: 0,
        employeeName: "",
        employeeId: "",
        kpiName: "",
        targetValue: "",
        currentValue: "",
        deadline: "",
        progress: ""
    })

    const [updateValue, setUpdateValue] = React.useState("")

    React.useEffect(() => {
        const saved = localStorage.getItem('kpi_tasks')
        if (saved) {
            try { setTasks(JSON.parse(saved)) } catch (e) { }
        }
    }, [])

    const t = {
        pageTitle: language === 'ar' ? "إدارة المهام" : "Task Management",
        pageSubtitle: language === 'ar' ? "نظرة شاملة على مؤشرات الأداء والمهام الحيوية" : "Comprehensive view of performance indicators and vital tasks",
        createTask: language === 'ar' ? "إسناد مهمة" : "Assign Task",
        searchPlaceholder: language === 'ar' ? "بحث عن مهمة أو موظف..." : "Search task or employee...",
        modalTitle: language === 'ar' ? "تكوين المهمة" : "Task Configuration",
        empSection: language === 'ar' ? "بيانات الموظف" : "Employee Details",
        kpiSection: language === 'ar' ? "محددات الأداء (KPI)" : "KPI Parameters",
        targetVal: language === 'ar' ? "الهدف" : "Target",
        currentVal: language === 'ar' ? "المحقق" : "Achieved",
        deadline: language === 'ar' ? "الإطار الزمني" : "Timeframe",
        progress: language === 'ar' ? "نسبة الإنجاز" : "Completion Rate",
        remaining: language === 'ar' ? "المتبقي" : "Remaining",
        status: language === 'ar' ? "الحالة" : "Status",
        efficiency: language === 'ar' ? "الكفاءة" : "Efficiency",
        actions: language === 'ar' ? "الإجراءات" : "Actions",
        update: language === 'ar' ? "تحديث البيانات" : "Update Data",
        report: language === 'ar' ? "تقرير الموظف" : "Employee Report",
        reportSubtitle: language === 'ar' ? "ابحث بالاسم أو بالـ ID للحصول على ملخص الإنجاز" : "Search by name or ID to get achievement summary",
        viewReport: language === 'ar' ? "عرض التقرير" : "View Report",
        downloadExcel: language === 'ar' ? "تنزيل Excel" : "Download Excel",
        clear: language === 'ar' ? "مسح" : "Clear",
        close: language === 'ar' ? "إغلاق" : "Close",
        empId: "ID",
    }

    const resetForm = () => {
        setFormData({
            id: 0,
            employeeName: "",
            employeeId: "",
            kpiName: "",
            targetValue: "",
            currentValue: "",
            deadline: "",
            progress: ""
        })
        setIsEditing(false)
        setSelectedTask(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setOpen(true)
    }

    const handleEdit = (task: Task) => {
        setFormData({ ...task })
        setIsEditing(true)
        setOpen(true)
    }

    const handleOpenUpdate = (task: Task) => {
        setSelectedTask(task)
        setUpdateValue(task.currentValue)
        setUpdateOpen(true)
    }

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.kpiName) return

        let updatedTasks = [...tasks]
        const progressNum = Math.min(Math.round((Number(formData.currentValue) / Number(formData.targetValue)) * 100) || 0, 100)
        const finalData = { ...formData, progress: progressNum.toString() }

        if (isEditing) {
            updatedTasks = updatedTasks.map(t => t.id === formData.id ? { ...t, ...finalData } : t)
        } else {
            const newTask: Task = {
                ...finalData,
                id: Date.now(),
                status: 'In Progress',
                createdAt: new Date().toISOString()
            }
            updatedTasks = [newTask, ...updatedTasks]
        }

        setTasks(updatedTasks)
        localStorage.setItem('kpi_tasks', JSON.stringify(updatedTasks))
        setOpen(false)
        resetForm()
    }

    const handleUpdateProgress = () => {
        if (!selectedTask) return
        const progressPercent = Math.min(Math.round((Number(updateValue) / Number(selectedTask.targetValue)) * 100) || 0, 100)
        const updatedTasks = tasks.map(t => t.id === selectedTask.id ? {
            ...t,
            currentValue: updateValue,
            progress: progressPercent.toString()
        } : t)
        setTasks(updatedTasks)
        localStorage.setItem('kpi_tasks', JSON.stringify(updatedTasks))
        setUpdateOpen(false)
        setSelectedTask(null)
        setUpdateValue("")
    }

    const handleGenerateReport = () => {
        if (!reportSearchName && !reportSearchId) return

        setIsGeneratingReport(true)

        // Simulate a small delay for "premium" feel
        setTimeout(() => {
            const employeeTasks = tasks.filter(task =>
                (reportSearchName && task.employeeName.toLowerCase().includes(reportSearchName.toLowerCase())) ||
                (reportSearchId && task.employeeId === reportSearchId)
            )

            if (employeeTasks.length > 0) {
                const totalTasks = employeeTasks.length
                const completedTasks = employeeTasks.filter(task => getTaskStatus(task, now) === 'DONE').length
                const failedTasks = employeeTasks.filter(task => getTaskStatus(task, now) === 'FAILED').length
                const activeTasks = employeeTasks.filter(task => getTaskStatus(task, now) === 'IN_PROGRESS').length
                const avgProgress = Math.round(employeeTasks.reduce((acc, task) => acc + Number(task.progress), 0) / totalTasks)

                setReportResult({
                    employeeName: employeeTasks[0].employeeName,
                    employeeId: employeeTasks[0].employeeId,
                    totalTasks,
                    completedTasks,
                    failedTasks,
                    activeTasks,
                    avgProgress,
                    tasks: employeeTasks
                })
            } else {
                setReportResult('no_data')
            }
            setIsGeneratingReport(false)
        }, 600)
    }

    const clearReport = () => {
        setReportSearchName("")
        setReportSearchId("")
        setReportResult(null)
    }

    const downloadExcel = () => {
        if (!reportResult || reportResult === 'no_data') return
        alert(language === 'ar' ? "بدء تحميل ملف Excel..." : "Starting Excel download...")
        // In a real app, you'd use a library like xlsx here
    }

    const handleDelete = (id: number) => {
        if (confirm("Confirm deletion?")) {
            const updated = tasks.filter(t => t.id !== id)
            setTasks(updated)
            localStorage.setItem('kpi_tasks', JSON.stringify(updated))
        }
    }

    const filteredTasks = tasks.filter(t =>
        t.kpiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Separate tasks by status using the current 'now'
    const inProgressTasks = filteredTasks.filter(t => getTaskStatus(t, now) === 'IN_PROGRESS')
    const failedTasks = filteredTasks.filter(t => getTaskStatus(t, now) === 'FAILED')
    const doneTasks = filteredTasks.filter(t => getTaskStatus(t, now) === 'DONE')

    return (
        <div className="space-y-8 pb-20 max-w-[1920px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                            <LayoutList className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.pageTitle}</h1>
                    </div>
                    <p className="text-muted-foreground text-lg ltr:pl-[3.25rem] rtl:pr-[3.25rem]">{t.pageSubtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => setReportOpen(true)} variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 text-primary">
                        <FileBarChart className="h-5 w-5 me-2" />
                        {t.report}
                    </Button>
                    <Button onClick={handleOpenCreate} size="lg" className="shadow-lg shadow-primary/20 transition-all">
                        <Plus className="h-5 w-5 me-2" />
                        {t.createTask}
                    </Button>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 border-0 shadow-2xl bg-background">
                    <div className="bg-primary text-primary-foreground px-6 py-6 flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                {t.modalTitle}
                            </DialogTitle>
                            <DialogDescription className="text-primary-foreground/80 mt-1">{isEditing ? "Modify existing parameters" : "Initialize new performance tracking metric"}</DialogDescription>
                        </div>
                    </div>

                    <div className="p-6 space-y-6 bg-background text-foreground">
                        {/* Employee Section */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 pb-1 border-b border-border">
                                <User className="h-3.5 w-3.5" /> {t.empSection}
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <Label className="text-xs font-medium">{language === 'ar' ? "الاسم" : "Full Name"}</Label>
                                    <Input value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} className="bg-muted/50 border-input" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">{language === 'ar' ? "المعرف" : "ID Code"}</Label>
                                    <Input value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="bg-muted/50 border-input font-mono" />
                                </div>
                            </div>
                        </div>

                        {/* KPI Section */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 pb-1 border-b border-border">
                                <TrendingUp className="h-3.5 w-3.5" /> {t.kpiSection}
                            </h4>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">{language === 'ar' ? "اسم المؤشر (KPI)" : "KPI Name"}</Label>
                                <Input value={formData.kpiName} onChange={(e) => setFormData({ ...formData, kpiName: e.target.value })} className="bg-muted/50 border-input" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-2">
                                    <Label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t.targetVal}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" value={formData.targetValue} onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })} className="h-9 bg-background border-input" />
                                        <Target className="h-4 w-4 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-2">
                                    <Label className="text-xs font-semibold text-blue-600 dark:text-blue-400">{t.currentVal}</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="number" value={formData.currentValue} onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })} className="h-9 bg-background border-input" />
                                        <BarChart3 className="h-4 w-4 text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">{t.deadline}</Label>
                                <Input type="datetime-local" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="bg-muted/50 border-input" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-muted/20 border-t border-border">
                        <Button variant="ghost" onClick={() => setOpen(false)}>{language === 'ar' ? "إلغاء التغييرات" : "Discard Changes"}</Button>
                        <Button onClick={handleSubmit} className="min-w-[140px] shadow-sm">{language === 'ar' ? "تأكيد وحفظ" : "Confirm & Save"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Employee Report Modal */}
            <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-0 shadow-2xl bg-background max-h-[95vh] flex flex-col">
                    <div className="bg-[#0039a6] text-white px-6 py-5 border-b border-white/10 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/15 p-2 rounded-lg backdrop-blur-sm">
                                    <FileBarChart className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <DialogTitle className="text-lg font-bold tracking-tight">{t.report}</DialogTitle>
                                    <DialogDescription className="text-white/70 text-xs font-medium">{t.reportSubtitle}</DialogDescription>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-muted">
                        <div className="space-y-6">
                            {/* Search Bar */}
                            <div className="flex flex-col md:flex-row gap-3 items-end bg-muted/20 p-4 rounded-xl border border-border/50">
                                <div className="flex-1 space-y-1.5 w-full">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest ml-1">{language === 'ar' ? "اسم الموظف" : "Employee Name"}</Label>
                                    <Input
                                        placeholder={language === 'ar' ? "مثال: Jawad" : "e.g. Jawad"}
                                        value={reportSearchName}
                                        onChange={(e) => setReportSearchName(e.target.value)}
                                        className="h-9 bg-background border-border/50 focus:ring-1 focus:ring-primary/30"
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5 w-full">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest ml-1">{language === 'ar' ? "المعرف (ID)" : "Employee ID"}</Label>
                                    <Input
                                        placeholder={language === 'ar' ? "مثال: 1001" : "e.g. 1001"}
                                        value={reportSearchId}
                                        onChange={(e) => setReportSearchId(e.target.value)}
                                        className="h-9 bg-background border-border/50 focus:ring-1 focus:ring-primary/30 font-mono"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                    <Button onClick={handleGenerateReport} className="flex-1 md:flex-none h-9 bg-[#0039a6] hover:bg-[#002d84] shadow-sm px-6">
                                        {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                                        {t.viewReport}
                                    </Button>
                                    <Button onClick={downloadExcel} variant="outline" className="flex-1 md:flex-none h-9 border-[#0039a6]/20 text-[#0039a6] hover:bg-[#0039a6]/5 px-4 font-semibold">
                                        <Download className="h-4 w-4 mr-2" />
                                        Excel
                                    </Button>
                                    <Button onClick={clearReport} variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground shrink-0 border border-border/50">
                                        <Eraser className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Report Content */}
                            <div className="min-h-[300px] flex flex-col items-center justify-center p-4">
                                {!reportResult ? (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="bg-muted/40 p-5 rounded-full inline-block animate-pulse">
                                            <Search className="h-10 w-10 text-muted-foreground/20" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground font-semibold text-sm">{language === 'ar' ? "اختر موظف لعرض التقرير" : "Select an employee to view report"}</p>
                                            <p className="text-muted-foreground/60 text-xs">{language === 'ar' ? "أدخل الاسم أو الرقم الوظيفي للبحث" : "Enter name or ID to start searching"}</p>
                                        </div>
                                    </div>
                                ) : reportResult === 'no_data' ? (
                                    <div className="text-center py-12 space-y-4">
                                        <div className="bg-destructive/5 p-5 rounded-full inline-block">
                                            <AlertCircle className="h-10 w-10 text-destructive/30" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-destructive font-bold">{language === 'ar' ? "لم يتم العثور على بيانات" : "No results found"}</p>
                                            <p className="text-muted-foreground text-xs">Please verify the name or ID and try again.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-6">
                                        {/* Summary Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-background border border-border/60 p-3 rounded-xl shadow-sm text-center group hover:border-[#0039a6]/30 transition-colors">
                                                <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1 tracking-tighter">{language === 'ar' ? "إجمالي المهام" : "TOTAL TASKS"}</span>
                                                <span className="text-2xl font-black text-[#0039a6]">{reportResult.totalTasks}</span>
                                            </div>
                                            <div className="bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/50 p-3 rounded-xl text-center group hover:border-emerald-500/30 transition-colors">
                                                <span className="text-[9px] uppercase font-bold text-emerald-700/70 dark:text-emerald-500 block mb-1 tracking-tighter">{language === 'ar' ? "مكتملة" : "COMPLETED"}</span>
                                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{reportResult.completedTasks}</span>
                                            </div>
                                            <div className="bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50 p-3 rounded-xl text-center group hover:border-blue-500/30 transition-colors">
                                                <span className="text-[9px] uppercase font-bold text-blue-700/70 dark:text-blue-500 block mb-1 tracking-tighter">{language === 'ar' ? "جارية" : "IN PROGRESS"}</span>
                                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{reportResult.activeTasks}</span>
                                            </div>
                                            <div className="bg-red-50/30 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/50 p-3 rounded-xl text-center group hover:border-red-500/30 transition-colors">
                                                <span className="text-[9px] uppercase font-bold text-red-700/70 dark:text-red-500 block mb-1 tracking-tighter">{language === 'ar' ? "متعثرة" : "FAILED"}</span>
                                                <span className="text-2xl font-black text-red-600 dark:text-red-400">{reportResult.failedTasks}</span>
                                            </div>
                                        </div>

                                        {/* Progress Area */}
                                        <div className="space-y-3 bg-muted/10 p-4 rounded-xl border border-border/50">
                                            <div className="flex justify-between items-center text-xs font-bold px-1">
                                                <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                                                    <TrendingUp className="h-3.5 w-3.5 text-[#0039a6]" />
                                                    {language === 'ar' ? "متوسط الإنجاز العام" : "Achievement Rate"}
                                                </span>
                                                <span className="font-mono text-[#0039a6] text-sm">{reportResult.avgProgress}%</span>
                                            </div>
                                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#0039a6] transition-all duration-500"
                                                    style={{ width: `${reportResult.avgProgress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Task List Preview */}
                                        <div className="space-y-2.5">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">{language === 'ar' ? "سجل المهام" : "Detailed Task Log"}</h4>
                                            <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20">
                                                {reportResult.tasks.map((task: any) => (
                                                    <div key={task.id} className="flex items-center justify-between p-2.5 bg-background border border-border/50 rounded-lg group hover:border-[#0039a6]/20 transition-all hover:translate-x-1 duration-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-1 h-7 rounded-full",
                                                                getTaskStatus(task) === 'DONE' ? "bg-emerald-500" :
                                                                    getTaskStatus(task) === 'FAILED' ? "bg-red-500" : "bg-blue-500"
                                                            )} />
                                                            <div className="space-y-0.5">
                                                                <p className="text-[13px] font-bold text-foreground group-hover:text-[#0039a6] transition-colors">{task.kpiName}</p>
                                                                <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                                    Progress: <span className="font-bold text-foreground/80">{task.progress}%</span> •
                                                                    Target: <span className="font-bold text-foreground/80">{task.targetValue}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[8px] font-bold border-0 px-2 py-0.5",
                                                            getTaskStatus(task) === 'DONE' ? "bg-emerald-50 text-emerald-700" :
                                                                getTaskStatus(task) === 'FAILED' ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                                                        )}>
                                                            {getTaskStatus(task)}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-muted/30 border-t border-border/50 shrink-0 flex justify-end">
                        <Button onClick={() => setReportOpen(false)} variant="secondary" className="px-10 h-9 font-semibold text-xs rounded-lg">{t.close}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Quick Update Modal */}
            <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{t.update}</DialogTitle>
                        <DialogDescription>{selectedTask?.kpiName}</DialogDescription>
                    </DialogHeader>
                    <div className="py-6 flex flex-col items-center gap-4">
                        <div className="w-full flex justify-between text-xs font-medium text-muted-foreground uppercase">
                            <span>Current: {selectedTask?.currentValue}</span>
                            <span>Target: {selectedTask?.targetValue}</span>
                        </div>
                        <Input
                            className="text-center text-3xl font-bold h-16 w-32 tracking-wider bg-muted/50"
                            type="number"
                            value={updateValue}
                            onChange={(e) => setUpdateValue(e.target.value)}
                            autoFocus
                        />
                        <span className="text-sm text-muted-foreground">Enter new value</span>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleUpdateProgress}>
                            {language === 'ar' ? "تحديث السجلات" : "Update Records"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Split Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                {/* Left Column: Active & Failed */}
                <div className="space-y-8">
                    {/* Active Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <Activity className="h-5 w-5 text-blue-500" />
                            <h2 className="text-lg font-bold tracking-tight text-foreground">{language === 'ar' ? "مهام جارية" : "Active Tasks"}</h2>
                            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0">{inProgressTasks.length}</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {inProgressTasks.map(task => (
                                <TaskCard key={task.id} task={task} t={t} now={now} handleEdit={handleEdit} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} />
                            ))}
                            {inProgressTasks.length === 0 && (
                                <div className="text-center py-10 bg-muted/10 rounded-lg border border-dashed border-border">
                                    <p className="text-muted-foreground text-sm">No active tasks</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Failed Section */}
                    {failedTasks.length > 0 && (
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-border">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                <h2 className="text-lg font-bold tracking-tight text-destructive">{language === 'ar' ? "تنبيهات" : "Needs Attention"}</h2>
                                <Badge variant="secondary" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-0">{failedTasks.length}</Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {failedTasks.map(task => (
                                    <TaskCard key={task.id} task={task} t={t} now={now} handleEdit={handleEdit} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Completed */}
                <div className="space-y-4 h-full">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{language === 'ar' ? "المهام المنجزة" : "Completed Archive"}</h2>
                        <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-0">{doneTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {doneTasks.map(task => (
                            <TaskCard key={task.id} task={task} t={t} now={now} handleEdit={handleEdit} handleDelete={handleDelete} handleOpenUpdate={handleOpenUpdate} />
                        ))}
                        {doneTasks.length === 0 && (
                            <div className="text-center py-20 bg-muted/10 rounded-lg border border-dashed border-border flex flex-col items-center justify-center">
                                <div className="bg-muted rounded-full p-4 mb-3">
                                    <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <p className="text-muted-foreground font-medium">No completed tasks yet</p>
                                <p className="text-xs text-muted-foreground/50 mt-1">Keep pushing forward!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Empty State (Global) */}
            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-3xl bg-muted/20 mt-8">
                    <div className="bg-card p-6 rounded-full shadow-lg shadow-border/50 mb-6">
                        <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{language === 'ar' ? "لا توجد مهام" : "No Tasks Found"}</h3>
                    <p className="text-muted-foreground">{language === 'ar' ? "المهام المسندة ستظهر هنا" : "Assigned tasks will appear here."}</p>
                </div>
            )}
        </div>
    )
}
