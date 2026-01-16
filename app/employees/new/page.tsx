"use client"

import * as React from "react"
import {
    Plus,
    Search,
    UserPlus,
    MoreVertical,
    Pencil,
    Trash2,
    Calendar as CalendarIcon,
    Phone,
    Hash,
    Briefcase,
    ShieldCheck,
    ShieldAlert,
    Filter,
    Download,
    Users,
    PhoneIncoming,
    PhoneOutgoing,
    Globe,
    TrendingUp,
    Settings,
    User,
    BarChart3
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
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/providers"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Types ---
interface Employee {
    id: string
    employeeId: string
    name: string
    phone: string
    joiningDate: string
    status: 'active' | 'inactive'
    department: 'INBOUND' | 'NONIP' | 'OUTBOUND' | 'SALES'
}

const STORAGE_KEY = 'earthlink_employees'

export default function NewEmployeePage() {
    const { language } = useLanguage()
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isReportOpen, setIsReportOpen] = React.useState(false)
    const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null)

    // Report Filter States
    const [reportDept, setReportDept] = React.useState<string>("SALES")
    const [reportMonth, setReportMonth] = React.useState<string>(new Date().getMonth().toString())
    const [reportYear, setReportYear] = React.useState<string>(new Date().getFullYear().toString())

    // Form State
    const [formData, setFormData] = React.useState<Partial<Employee>>({
        name: "",
        employeeId: "",
        phone: "",
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'active',
        department: 'SALES'
    })

    // --- Localization ---
    const t = {
        title: language === 'ar' ? "TR - الموظفين" : "TR - Employees",
        subtitle: language === 'ar' ? "النظام الفني لإدارة بيانات ومتابعة شؤون الموظفين" : "Technical system for managing employee data and monitoring",
        addBtn: language === 'ar' ? "إضافة موظف" : "Add Employee",
        searchPlaceholder: language === 'ar' ? "ابحث عن اسم، رقم..." : "Search name, ID...",
        tableHeaders: {
            name: language === 'ar' ? "الموظف" : "Employee",
            id: language === 'ar' ? "ID" : "ID",
            phone: language === 'ar' ? "رقم الهاتف" : "Phone",
            date: language === 'ar' ? "المباشرة" : "Joined",
            status: language === 'ar' ? "الحالة" : "Status",
            dept: language === 'ar' ? "القسم" : "Dept",
            actions: language === 'ar' ? "إجراء" : "Action",
        },
        form: {
            addTitle: language === 'ar' ? "إضافة موظف جديد" : "Add New Employee",
            editTitle: language === 'ar' ? "تعديل البيانات" : "Edit Employee",
            desc: language === 'ar' ? "أدخل المعلومات الأساسية للموظف." : "Enter basic employee info.",
            labelName: language === 'ar' ? "اسم الموظف" : "Name",
            labelId: language === 'ar' ? "الرقم الوظيفي" : "ID",
            labelPhone: language === 'ar' ? "رقم الهاتف" : "Phone",
            labelDate: language === 'ar' ? "تاريخ المباشرة" : "Join Date",
            labelStatus: language === 'ar' ? "الحالة" : "Status",
            labelDept: language === 'ar' ? "القسم" : "Dept",
            active: language === 'ar' ? "نشط" : "Active",
            inactive: language === 'ar' ? "غير نشط" : "Inactive",
            save: language === 'ar' ? "حفظ" : "Save",
            cancel: language === 'ar' ? "إلغاء" : "Cancel",
        },
        stats: {
            total: language === 'ar' ? "إجمالي كادر TR" : "Total TR Staff",
            active: language === 'ar' ? "الموظفون النشطون" : "Active TR Staff",
            inactive: language === 'ar' ? "غير نشط" : "Inactive",
        },
        report: {
            btn: language === 'ar' ? "التقارير" : "Reports",
            title: language === 'ar' ? "إحصائيات الموظفين" : "Employee Stats",
            desc: language === 'ar' ? "فلترة الموظفين حسب القسم وتاريخ الانضمام" : "Filter employees by department and join date",
            labelMonth: language === 'ar' ? "الشهر" : "Month",
            labelYear: language === 'ar' ? "السنة" : "Year",
            resultTitle: language === 'ar' ? "نتائج الحصر" : "Census Results",
            noResults: language === 'ar' ? "لا يوجد موظفين تطابق هذه المعايير" : "No employees match these criteria",
            totalCount: language === 'ar' ? "إجمالي العدد" : "Total Count",
        }
    }

    // --- Effects ---
    React.useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                setEmployees(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse employees", e)
            }
        } else {
            const mockData: Employee[] = [
                { id: '1', employeeId: '101', name: 'علي حسن', phone: '07701112233', joiningDate: '2023-11-01', status: 'active', department: 'SALES' },
                { id: '2', employeeId: '102', name: 'زينب عباس', phone: '07804445566', joiningDate: '2023-12-15', status: 'active', department: 'INBOUND' },
                { id: '3', employeeId: '103', name: 'عمر فاروق', phone: '07507778899', joiningDate: '2024-01-20', status: 'inactive', department: 'OUTBOUND' },
            ]
            setEmployees(mockData)
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
        }
    }, [employees, isLoaded])

    // --- Handlers ---
    const handleSave = () => {
        if (!formData.name || !formData.employeeId) return

        if (editingEmployee) {
            setEmployees(employees.map(emp =>
                emp.id === editingEmployee.id ? { ...emp, ...formData } as Employee : emp
            ))
        } else {
            const newEmp: Employee = {
                ...formData,
                id: Math.random().toString(36).substring(7),
            } as Employee
            setEmployees([newEmp, ...employees])
        }

        setIsDialogOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            name: "",
            employeeId: "",
            phone: "",
            joiningDate: new Date().toISOString().split('T')[0],
            status: 'active',
            department: 'SALES'
        })
        setEditingEmployee(null)
    }

    const handleEdit = (emp: Employee) => {
        setEditingEmployee(emp)
        setFormData(emp)
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm(language === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) {
            setEmployees(employees.filter(emp => emp.id !== id))
        }
    }

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === 'active').length,
        inactive: employees.filter(e => e.status === 'inactive').length,
    }

    const reportResults = employees.filter(emp => {
        const d = new Date(emp.joiningDate)
        return emp.department === reportDept &&
            d.getMonth() === parseInt(reportMonth) &&
            d.getFullYear() === parseInt(reportYear)
    })

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i.toString(),
        label: new Intl.DateTimeFormat(language === 'ar' ? 'ar-IQ' : 'en-US', { month: 'long' }).format(new Date(2024, i, 1))
    }))

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight">
                        {t.title}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        {t.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-10 px-6 border-border hover:bg-muted text-foreground rounded-lg font-bold shadow-sm transition-all gap-2">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                {t.report.btn}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border bg-card">
                            <DialogHeader className="p-6 bg-muted/30 border-b">
                                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                                    <BarChart3 className="size-5 text-primary" />
                                    {t.report.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    {t.report.desc}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-6 space-y-6">
                                {/* Filters */}
                                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.form.labelDept}</Label>
                                        <Select value={reportDept} onValueChange={setReportDept}>
                                            <SelectTrigger className="h-9 text-sm font-medium bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INBOUND">Inbound</SelectItem>
                                                <SelectItem value="OUTBOUND">Outbound</SelectItem>
                                                <SelectItem value="SALES">Sales</SelectItem>
                                                <SelectItem value="NONIP">Non-IP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.report.labelMonth}</Label>
                                        <Select value={reportMonth} onValueChange={setReportMonth}>
                                            <SelectTrigger className="h-9 text-sm font-medium bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">{t.report.labelYear}</Label>
                                        <Select value={reportYear} onValueChange={setReportYear}>
                                            <SelectTrigger className="h-9 text-sm font-medium bg-background border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                                            {t.report.resultTitle}
                                        </h4>
                                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3">
                                            {t.report.totalCount}: {reportResults.length}
                                        </Badge>
                                    </div>

                                    <div className="border border-border rounded-xl overflow-hidden bg-background max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {reportResults.length > 0 ? (
                                            <table className="w-full text-xs">
                                                <thead className="bg-muted border-b border-border">
                                                    <tr>
                                                        <th className="px-4 py-2 text-start font-bold text-muted-foreground uppercase tracking-tighter">{t.tableHeaders.name}</th>
                                                        <th className="px-4 py-2 text-start font-bold text-muted-foreground uppercase tracking-tighter">{t.tableHeaders.id}</th>
                                                        <th className="px-4 py-2 text-end font-bold text-muted-foreground uppercase tracking-tighter">{t.tableHeaders.date}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {reportResults.map(emp => (
                                                        <tr key={emp.id} className="hover:bg-muted/30">
                                                            <td className="px-4 py-2.5 font-bold text-foreground">{emp.name}</td>
                                                            <td className="px-4 py-2.5 font-black text-muted-foreground">{emp.employeeId.replace('TR-', '')}</td>
                                                            <td className="px-4 py-2.5 text-end text-muted-foreground font-medium">{new Date(emp.joiningDate).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="p-10 text-center space-y-2">
                                                <Users className="size-8 text-muted mx-auto" />
                                                <p className="text-xs font-bold text-muted-foreground">{t.report.noResults}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="p-4 bg-muted/30 border-t border-border">
                                <Button onClick={() => setIsReportOpen(false)} className="w-full font-bold h-10 shadow-sm">
                                    {language === 'ar' ? "إغلاق النافذة" : "Close Report"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) resetForm()
                    }}>
                        <DialogTrigger asChild>
                            <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold shadow-sm transition-all">
                                <Plus className="me-2 h-4 w-4" />
                                {t.addBtn}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border bg-card">
                            <DialogHeader className="p-6 bg-muted/30 border-b border-border">
                                <DialogTitle className="text-lg font-bold text-foreground">{editingEmployee ? t.form.editTitle : t.form.addTitle}</DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground">
                                    {t.form.desc}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelName}</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-10 bg-background border-border rounded-lg text-sm font-medium text-foreground"
                                            placeholder="Ali Hassan"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelId}</Label>
                                        <Input
                                            value={formData.employeeId}
                                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            className="h-10 bg-background border-border rounded-lg text-sm font-medium text-foreground"
                                            placeholder="101"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelPhone}</Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-10 bg-background border-border rounded-lg text-sm font-medium text-foreground"
                                            placeholder="0770XXXXXXX"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelDate}</Label>
                                        <Input
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                            className="h-10 bg-background border-border rounded-lg text-sm font-medium text-foreground"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelDept}</Label>
                                        <Select
                                            value={formData.department}
                                            onValueChange={(val: any) => setFormData({ ...formData, department: val })}
                                        >
                                            <SelectTrigger className="h-10 bg-background border-border rounded-lg text-sm font-medium text-foreground">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SALES">SALES</SelectItem>
                                                <SelectItem value="INBOUND">INBOUND</SelectItem>
                                                <SelectItem value="OUTBOUND">OUTBOUND</SelectItem>
                                                <SelectItem value="NONIP">NONIP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-muted-foreground uppercase">{t.form.labelStatus}</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={formData.status === 'active' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, status: 'active' })}
                                                className={cn("flex-1 h-10 rounded-lg text-xs font-bold transition-all",
                                                    formData.status === 'active' && "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                )}
                                            >
                                                {t.form.active}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.status === 'inactive' ? 'destructive' : 'outline'}
                                                onClick={() => setFormData({ ...formData, status: 'inactive' })}
                                                className="flex-1 h-10 rounded-lg text-xs font-bold"
                                            >
                                                {t.form.inactive}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="p-6 bg-muted/30 border-t border-border gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-10 font-bold text-muted-foreground hover:text-foreground">
                                    {t.form.cancel}
                                </Button>
                                <Button onClick={handleSave} className="h-10 font-bold px-8">
                                    {t.form.save}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { label: t.stats.total, value: stats.total, color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50" },
                    { label: t.stats.active, value: stats.active, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50" },
                    { label: t.stats.inactive, value: stats.inactive, color: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-900/50" },
                ].map((stat, i) => (
                    <div key={i} className={cn("p-5 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-1 bg-card", stat.color)}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</p>
                        <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* List Control Panel */}
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

            {/* Employee Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.name}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.id}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.dept}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.phone}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.date}</th>
                            <th className="px-6 py-4 text-start font-bold text-muted-foreground uppercase text-[10px] tracking-wider text-center">{t.tableHeaders.status}</th>
                            <th className="px-6 py-4 text-end font-bold text-muted-foreground uppercase text-[10px] tracking-wider">{t.tableHeaders.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredEmployees.map((emp) => {
                            // Department Icon Mapping
                            const getDeptIcon = (dept: string) => {
                                switch (dept) {
                                    case 'INBOUND': return { icon: PhoneIncoming, color: 'text-blue-500 bg-blue-500/10 border-blue-200/50' };
                                    case 'OUTBOUND': return { icon: PhoneOutgoing, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-200/50' };
                                    case 'NONIP': return { icon: Globe, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-200/50' };
                                    case 'SALES': return { icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-200/50' };
                                    default: return { icon: User, color: 'text-muted-foreground bg-muted/10 border-border/50' };
                                }
                            };
                            const deptInfo = getDeptIcon(emp.department);
                            const Icon = deptInfo.icon;

                            return (
                                <tr key={emp.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("size-8 rounded-lg flex items-center justify-center border shadow-sm", deptInfo.color)}>
                                                <Icon className="size-4" />
                                            </div>
                                            <span className="font-bold text-foreground">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-muted-foreground text-xs">
                                        {emp.employeeId.replace('TR-', '')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-[10px] font-bold border-border bg-background text-muted-foreground px-2 py-0">
                                            {emp.department}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-muted-foreground/70 tabular-nums">{emp.phone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {new Date(emp.joiningDate).toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            emp.status === 'active'
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : "bg-rose-500/10 text-rose-600"
                                        )}>
                                            <div className={cn("size-1.5 rounded-full", emp.status === 'active' ? "bg-emerald-500" : "bg-rose-500")} />
                                            {emp.status === 'active' ? t.form.active : t.form.inactive}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 rounded-lg shadow-xl border bg-card border-border">
                                                <DropdownMenuItem onClick={() => handleEdit(emp)} className="text-xs font-bold gap-2 cursor-pointer focus:bg-muted">
                                                    <Pencil className="h-3.5 w-3.5 text-blue-500" />
                                                    {language === 'ar' ? "تعديل" : "Edit"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(emp.id)} className="text-xs font-bold gap-2 text-rose-600 focus:text-rose-600 cursor-pointer focus:bg-rose-500/10">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    {language === 'ar' ? "حذف" : "Delete"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredEmployees.length === 0 && (
                    <div className="py-20 text-center">
                        <Users className="h-10 w-10 text-muted mx-auto mb-2" />
                        <p className="text-sm font-bold text-muted-foreground">لا يوجد موظفين حالياً</p>
                    </div>
                )}
            </div>
        </div>
    )
}
