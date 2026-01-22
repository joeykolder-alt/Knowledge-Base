"use client"

import * as React from "react"
import {
    Search,
    ClipboardList,
    Plus,
    CheckCircle2,
    Clock,
    Trash2,
    Calendar,
    User,
    ChevronLeft
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/providers"
import { cn } from "@/lib/utils"

// --- Types ---
interface Employee {
    id: string
    employeeId: string
    name: string
    department: string
}

interface Task {
    id: string
    employeeId: string
    title: string
    status: 'In Progress' | 'Done'
    createdAt: string
}

const EMP_STORAGE_KEY = 'earthlink_employees_v2'
const TASK_STORAGE_KEY = 'earthlink_employee_tasks'

export default function EmployeeStatusPage() {
    const { language } = useLanguage()
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
    const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)

    // New Task Form State
    const [taskType, setTaskType] = React.useState<string>("ISP")
    const [customTaskTitle, setCustomTaskTitle] = React.useState("")
    const [newTaskStatus, setNewTaskStatus] = React.useState<'In Progress' | 'Done'>('In Progress')

    // --- Localization ---
    const t = {
        title: language === 'ar' ? "حالة الموظفين والمهام" : "Employee Status & Tasks",
        subtitle: language === 'ar' ? "متابعة تقدم العمل وإسناد المهام للموظفين" : "Monitor work progress and assign tasks to employees",
        searchPlaceholder: language === 'ar' ? "ابحث عن موظف..." : "Search employee...",
        tableHeaders: {
            name: language === 'ar' ? "الموظف" : "Employee",
            id: language === 'ar' ? "ID" : "ID",
            tasks: language === 'ar' ? "المهام" : "Tasks",
            action: language === 'ar' ? "إجراء" : "Action",
        },
        taskDialog: {
            title: language === 'ar' ? "إدارة المهام لـ " : "Tasks for ",
            addTask: language === 'ar' ? "إضافة مهمة جديدة" : "Add New Task",
            taskName: language === 'ar' ? "اسم المهمة" : "Task Name",
            status: language === 'ar' ? "الحالة" : "Status",
            inProgress: language === 'ar' ? "قيد التنفيذ" : "In Progress",
            done: language === 'ar' ? "مكتملة" : "Done",
            save: language === 'ar' ? "حفظ المهمة" : "Save Task",
            noTasks: language === 'ar' ? "لا توجد مهام حالياً لهذا الموظف" : "No tasks assigned to this employee",
        },
        btnTask: language === 'ar' ? "المهام" : "Tasks",
    }

    // --- Loading Data ---
    React.useEffect(() => {
        const savedEmps = localStorage.getItem(EMP_STORAGE_KEY)
        if (savedEmps) {
            try {
                setEmployees(JSON.parse(savedEmps))
            } catch (e) {
                console.error("Failed to parse employees", e)
            }
        }

        const savedTasks = localStorage.getItem(TASK_STORAGE_KEY)
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks))
            } catch (e) {
                console.error("Failed to parse tasks", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // --- Save Tasks ---
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
        }
    }, [tasks, isLoaded])

    // --- Handlers ---
    const handleOpenTasks = (emp: Employee) => {
        setSelectedEmployee(emp)
        setIsTaskDialogOpen(true)
    }

    const handleAddTask = () => {
        const finalTitle = taskType === "Other" ? customTaskTitle : taskType
        if (!finalTitle || !selectedEmployee) return

        const newTask: Task = {
            id: Math.random().toString(36).substring(7),
            employeeId: selectedEmployee.id,
            title: finalTitle,
            status: newTaskStatus,
            createdAt: new Date().toISOString()
        }

        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updatedTasks))
        setCustomTaskTitle("")
        setTaskType("ISP")
    }

    const handleDeleteTask = (taskId: string) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId)
        setTasks(updatedTasks)
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updatedTasks))
    }

    const toggleTaskStatus = (taskId: string) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                return { ...t, status: t.status === 'Done' ? 'In Progress' : 'Done' } as Task
            }
            return t
        })
        setTasks(updatedTasks)
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(updatedTasks))
    }

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getEmployeeTaskStats = (empId: string) => {
        const empTasks = tasks.filter(t => t.employeeId === empId)
        const done = empTasks.filter(t => t.status === 'Done').length
        return { total: empTasks.length, done }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight">
                        {t.title}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        {t.subtitle}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors rtl:left-auto rtl:right-3" />
                    <Input
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 pl-9 pr-4 rounded-lg border-border bg-card text-foreground shadow-sm font-medium transition-all rtl:pl-4 rtl:pr-9 focus-visible:ring-primary"
                    />
                </div>
            </div>

            {/* Employee List Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.name}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.id}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.tasks}</th>
                            <th className="px-6 py-4 text-end font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.action}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredEmployees.map((emp) => {
                            const stats = getEmployeeTaskStats(emp.id)
                            return (
                                <tr key={emp.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg flex items-center justify-center border border-primary/20 bg-primary/5 text-primary">
                                                <User className="size-4" />
                                            </div>
                                            <span className="font-bold text-foreground">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-muted-foreground text-xs">
                                            {emp.employeeId.replace('TR-', '')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/20 bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                                <CheckCircle2 className="size-3" />
                                                {stats.done} {language === 'ar' ? "مكتمل" : "Done"}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] font-bold border-amber-500/20 bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                                <Clock className="size-3" />
                                                {stats.total - stats.done} {language === 'ar' ? "قيد التنفيذ" : "Pending"}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenTasks(emp)}
                                            className="h-8 rounded-lg font-bold text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all gap-2 text-foreground"
                                        >
                                            <ClipboardList className="size-3.5" />
                                            {t.btnTask}
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                    <div className="py-20 text-center">
                        <ClipboardList className="h-10 w-10 text-muted mx-auto mb-2" />
                        <p className="text-sm font-bold text-muted-foreground">
                            {language === 'ar' ? "لا يوجد موظفين مسجلين حالياً" : "No employees registered yet"}
                        </p>
                    </div>
                )}
            </div>

            {/* Tasks Management Dialog */}
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border bg-card">
                    <DialogHeader className="p-6 bg-muted/30 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <ClipboardList className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    {t.taskDialog.title} {selectedEmployee?.name}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    ID: {selectedEmployee?.employeeId.replace('TR-', '')}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        {/* Add Task Section */}
                        <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/20">
                            <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                                {t.taskDialog.addTask}
                            </h4>
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.taskDialog.taskName}</Label>
                                    <Select
                                        value={taskType}
                                        onValueChange={(val) => setTaskType(val)}
                                    >
                                        <SelectTrigger className="h-9 text-sm font-medium rounded-lg bg-background border-border text-foreground">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ISP">ISP</SelectItem>
                                            <SelectItem value="Grafana">Grafana</SelectItem>
                                            <SelectItem value="Contact Center Portal">Contact Center Portal</SelectItem>
                                            <SelectItem value="Agent Portal">Agent Portal</SelectItem>
                                            <SelectItem value="Alwatani Portal">Alwatani Portal</SelectItem>
                                            <SelectItem value="QGIS">QGIS</SelectItem>
                                            <SelectItem value="Postman">Postman</SelectItem>
                                            <SelectItem value="Other">{language === 'ar' ? "أخرى..." : "Other..."}</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {taskType === "Other" && (
                                        <Input
                                            value={customTaskTitle}
                                            onChange={(e) => setCustomTaskTitle(e.target.value)}
                                            placeholder={language === 'ar' ? "اكتب اسم المهمة هنا..." : "Type task name here..."}
                                            className="h-9 text-sm font-medium rounded-lg mt-2 animate-in slide-in-from-top-2 duration-200 bg-background border-border text-foreground"
                                        />
                                    )}
                                </div>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.taskDialog.status}</Label>
                                        <Select
                                            value={newTaskStatus}
                                            onValueChange={(val: any) => setNewTaskStatus(val)}
                                        >
                                            <SelectTrigger className="h-9 text-sm font-medium rounded-lg bg-background border-border text-foreground">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="In Progress">{t.taskDialog.inProgress}</SelectItem>
                                                <SelectItem value="Done">{t.taskDialog.done}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleAddTask} className="h-9 font-bold px-6 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                                        <Plus className="size-4 me-2" />
                                        {t.taskDialog.save}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center justify-between">
                                <span>{language === 'ar' ? "قائمة المهام الحالية" : "Current Tasks List"}</span>
                                <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-secondary text-secondary-foreground">
                                    {tasks.filter(t => t.employeeId === selectedEmployee?.id).length}
                                </Badge>
                            </h4>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tasks.filter(t => t.employeeId === selectedEmployee?.id).length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-border rounded-xl">
                                        <Clock className="size-8 text-muted mx-auto mb-2" />
                                        <p className="text-xs font-bold text-muted-foreground">{t.taskDialog.noTasks}</p>
                                    </div>
                                ) : (
                                    tasks.filter(t => t.employeeId === selectedEmployee?.id).map((task) => (
                                        <div
                                            key={task.id}
                                            className={cn(
                                                "group flex items-center justify-between p-3 rounded-xl border transition-all",
                                                task.status === 'Done' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border hover:bg-muted/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleTaskStatus(task.id)}
                                                    className={cn(
                                                        "size-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                        task.status === 'Done'
                                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                                            : "border-muted-foreground/30 hover:border-primary/50 bg-background"
                                                    )}
                                                >
                                                    {task.status === 'Done' && <CheckCircle2 className="size-3" />}
                                                </button>
                                                <div>
                                                    <p className={cn(
                                                        "text-sm font-bold transition-all",
                                                        task.status === 'Done' ? "text-muted-foreground line-through" : "text-foreground"
                                                    )}>
                                                        {task.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[9px] font-black uppercase text-muted-foreground/60">
                                                            {new Date(task.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className={cn(
                                                            "size-1 rounded-full",
                                                            task.status === 'Done' ? "bg-emerald-500/50" : "bg-blue-500/50"
                                                        )} />
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase",
                                                            task.status === 'Done' ? "text-emerald-500" : "text-blue-500"
                                                        )}>
                                                            {task.status === 'Done' ? t.taskDialog.done : t.taskDialog.inProgress}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="size-8 text-muted-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-4 bg-muted/30 border-t border-border">
                        <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)} className="w-full font-bold h-10 border-border hover:bg-muted text-foreground">
                            {language === 'ar' ? "إغلاق" : "Close"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
