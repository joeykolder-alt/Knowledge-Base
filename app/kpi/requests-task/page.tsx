"use client"

import * as React from "react"
import {
    Plus,
    User,
    FileText,
    Clock,
    Trash2,
    Edit,
    MoreHorizontal,
    CheckCircle2,
    Activity,
    Search,
    ClipboardList,
    AlertCircle,
    Calendar,
    Send,
    RefreshCw
} from "lucide-react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface RequestTask {
    id: number
    employeeName: string
    employeeId: string
    title: string
    details: string
    status: 'In Progress' | 'Completed' | 'Cancelled'
    createdAt: string
    completedAt?: string
}

export default function RequestsTaskPage() {
    const { language } = useLanguage()
    const [tasks, setTasks] = React.useState<RequestTask[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)

    const [formData, setFormData] = React.useState({
        id: 0,
        employeeName: "",
        employeeId: "",
        title: "",
        details: "",
        status: 'In Progress' as RequestTask['status']
    })

    React.useEffect(() => {
        const saved = localStorage.getItem('request_tasks')
        if (saved) {
            try { setTasks(JSON.parse(saved)) } catch (_) { }
        }
    }, [])

    const t = {
        title: language === 'ar' ? "مهام الطلبات" : "Requests Task",
        description: language === 'ar' ? "إدارة وتتبع مهام الطلبات والمتابعات الفورية." : "Manage and track request tasks and immediate follow-ups.",
        createRequest: language === 'ar' ? "إنشاء طلب جديد" : "Create New Request",
        modalSubtitle: language === 'ar' ? "أدخل بيانات الطلب لبدء المتابعة" : "Enter request details to start tracking",
        empName: language === 'ar' ? "اسم الموظف" : "Employee Name",
        empId: language === 'ar' ? "المعرف (ID)" : "Employee ID",
        requestTitle: language === 'ar' ? "عنوان الطلب" : "Request Title",
        requestDetails: language === 'ar' ? "تفاصيل الطلب" : "Request Details",
        save: language === 'ar' ? "حفظ الطلب" : "Save Request",
        cancel: language === 'ar' ? "إلغاء" : "Cancel",
        searchPlaceholder: language === 'ar' ? "بحث عن موظف أو عنوان طلب..." : "Search for employee or request title...",
        inProgress: language === 'ar' ? "قيد التنفيذ" : "In Progress",
        completed: language === 'ar' ? "مكتمل" : "Completed",
        notice: language === 'ar' ? "سيتم إنشاء الطلب مباشرة ضمن In Progress مع تسجيل وقت الفتح." : "The request will be created directly under In Progress with current time logged.",
        revert: language === 'ar' ? "إعادة إلى قيد التنفيذ" : "Revert to In Progress",
        createdAtLabel: language === 'ar' ? "تاريخ الإنشاء" : "Created At",
        completedAtLabel: language === 'ar' ? "تاريخ الإكمال" : "Completed At",
    }

    const resetForm = () => {
        setFormData({ id: 0, employeeName: "", employeeId: "", title: "", details: "", status: 'In Progress' })
        setIsEditing(false)
    }

    const handleOpenCreate = () => {
        resetForm()
        setIsCreateModalOpen(true)
    }

    const handleEdit = (task: RequestTask) => {
        setFormData({
            id: task.id,
            employeeName: task.employeeName,
            employeeId: task.employeeId,
            title: task.title,
            details: task.details,
            status: task.status
        })
        setIsEditing(true)
        setIsCreateModalOpen(true)
    }

    const handleSubmit = () => {
        if (!formData.employeeName || !formData.title) return

        let updatedTasks = [...tasks]
        if (isEditing) {
            updatedTasks = updatedTasks.map(t => t.id === formData.id ? { ...t, ...formData } as RequestTask : t)
        } else {
            const newTask: RequestTask = {
                ...formData,
                id: new Date().getTime(),
                status: 'In Progress',
                createdAt: new Date().toISOString()
            }
            updatedTasks = [newTask, ...updatedTasks]
        }

        setTasks(updatedTasks)
        localStorage.setItem('request_tasks', JSON.stringify(updatedTasks))
        setIsCreateModalOpen(false)
        resetForm()
    }

    const handleDelete = (id: number) => {
        if (confirm(language === 'ar' ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this request?")) {
            const updated = tasks.filter(t => t.id !== id)
            setTasks(updated)
            localStorage.setItem('request_tasks', JSON.stringify(updated))
        }
    }

    const toggleStatus = (id: number) => {
        const updated = tasks.map(t => {
            if (t.id === id) {
                const isCompleting = t.status === 'In Progress'
                const newStatus = isCompleting ? 'Completed' : 'In Progress'
                return {
                    ...t,
                    status: newStatus as RequestTask['status'],
                    completedAt: isCompleting ? new Date().toISOString() : undefined
                }
            }
            return t
        })
        setTasks(updated)
        localStorage.setItem('request_tasks', JSON.stringify(updated))
    }

    const filteredTasks = tasks.filter(t =>
        t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const d = new Date(dateString)
        return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(d)
    }

    const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress')
    const completedTasks = filteredTasks.filter(t => t.status === 'Completed')

    const TaskCard = ({ task }: { task: RequestTask }) => (
        <Card key={task.id} className="group relative overflow-hidden bg-card border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full z-10",
                task.status === 'In Progress' ? "bg-blue-500" : "bg-emerald-500"
            )} />

            <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className={cn(
                        "font-bold text-[10px] tracking-widest px-2 py-0.5 rounded-md border-0 uppercase flex items-center gap-1.5",
                        task.status === 'In Progress'
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    )}>
                        {task.status === 'In Progress' ? <Activity className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {task.status === 'In Progress' ? t.inProgress : t.completed}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(task.id)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <CardTitle className="text-lg font-bold line-clamp-1">{task.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-6">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed min-h-[60px]">
                    {task.details}
                </p>

                <div className="pt-4 border-t border-border/50 flex flex-col gap-4">
                    {task.status === 'In Progress' && (
                        <Button
                            onClick={() => toggleStatus(task.id)}
                            className="w-full bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-500/20 transition-all font-bold h-9 group/done shadow-sm"
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2 group-hover/done:scale-110 transition-transform" />
                            {language === 'ar' ? "تحديد كمكتمل" : "Mark as Done"}
                        </Button>
                    )}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.employeeName}`} />
                                    <AvatarFallback className="text-[10px]">{task.employeeName.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">{task.employeeName}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-medium">ID: {task.employeeId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border/30">
                            <div className="flex items-center justify-between text-xs font-semibold text-foreground/80">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                    <span>{t.createdAtLabel}:</span>
                                </div>
                                <span className="font-mono bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">
                                    {formatDate(task.createdAt)}
                                </span>
                            </div>
                            {task.status === 'Completed' && task.completedAt && (
                                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>{t.completedAtLabel}:</span>
                                    </div>
                                    <span className="font-mono bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                                        {formatDate(task.completedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                            <ClipboardList className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h1>
                    </div>
                    <p className="text-muted-foreground text-lg ltr:pl-[3.25rem] rtl:pr-[3.25rem]">{t.description}</p>
                </div>

                <Button onClick={handleOpenCreate} size="lg" className="shadow-lg shadow-primary/20 transition-all font-bold">
                    <Plus className="h-5 w-5 me-2" />
                    {t.createRequest}
                </Button>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={t.searchPlaceholder}
                    className="pl-10 bg-card/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                {/* Left Column: In Progress */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{t.inProgress}</h2>
                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0">{inProgressTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {inProgressTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {inProgressTasks.length === 0 && (
                            <div className="text-center py-10 bg-muted/10 rounded-lg border border-dashed border-border">
                                <p className="text-muted-foreground text-sm">No active requests</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Completed */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{t.completed}</h2>
                        <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-0">{completedTasks.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {completedTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {completedTasks.length === 0 && (
                            <div className="text-center py-20 bg-muted/10 rounded-lg border border-dashed border-border flex flex-col items-center justify-center">
                                <div className="bg-muted rounded-full p-4 mb-3">
                                    <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <p className="text-muted-foreground font-medium">No completed requests</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
                    <div className="bg-card p-6 rounded-full shadow-lg mb-4">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">{language === 'ar' ? "لا توجد طلبات" : "No Requests Found"}</h3>
                    <p className="text-muted-foreground">{language === 'ar' ? "ابدأ بإنشاء أول طلب لمتابعته هنا" : "Start by creating your first request to track here."}</p>
                    <Button onClick={handleOpenCreate} variant="outline" className="mt-6 border-primary text-primary hover:bg-primary/10">
                        {t.createRequest}
                    </Button>
                </div>
            )}

            {/* Create/Edit Request Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 shadow-2xl bg-background">
                    <div className="bg-primary text-primary-foreground px-8 py-8">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Send className="h-6 w-6" />
                            {isEditing ? (language === 'ar' ? "تعديل الطلب" : "Edit Request") : t.createRequest}
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 mt-1 font-medium italic">
                            {t.modalSubtitle}
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-8 bg-background">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> {t.empName}
                                </Label>
                                <Input
                                    value={formData.employeeName}
                                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                                    placeholder={language === 'ar' ? "مثال: Jawad" : "e.g. Jawad"}
                                    className="bg-muted/30 border-input h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5" /> {t.empId}
                                </Label>
                                <Input
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    placeholder={language === 'ar' ? "مثال: 1001" : "e.g. 1001"}
                                    className="bg-muted/30 border-input h-11 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <FileText className="h-3.5 w-3.5" /> {t.requestTitle}
                            </Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={language === 'ar' ? "مثال: Task" : "e.g. Task"}
                                className="bg-muted/30 border-input h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5" /> {t.requestDetails}
                            </Label>
                            <Textarea
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                placeholder={language === 'ar' ? "تفاصيل الطلب..." : "Request details..."}
                                className="bg-muted/30 border-input min-h-[120px] resize-none"
                            />
                        </div>

                        {isEditing && formData.status === 'Completed' && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/50 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                        {language === 'ar' ? "هذا الطلب مكتمل" : "This request is completed"}
                                    </p>
                                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                                        {language === 'ar' ? "يمكنك إعادته للمتابعة إذا لزم الأمر" : "You can revert it to follow-up if needed"}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setFormData({ ...formData, status: 'In Progress' })}
                                    className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold"
                                >
                                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                                    {t.revert}
                                </Button>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/50 rounded-xl">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
                                {t.notice}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-muted/20 border-t border-border gap-3">
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="px-8 font-bold">
                            {t.cancel}
                        </Button>
                        <Button onClick={handleSubmit} className="px-10 font-black shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                            {t.save}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
