"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { ArrowLeft, Save, FileText, FileSpreadsheet, Plus, Trash2, TrendingUp } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

export default function KpiMainPage() {
    const { language } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const reportId = searchParams.get('id')

    // State
    const [reportName, setReportName] = React.useState("")
    const [month, setMonth] = React.useState("september")
    const [rows, setRows] = React.useState([
        { id: 1, kpi: "", desc: "", measure: "", note: "", imp: "", util: "", input: "", output: "", sla: "" },
        { id: 2, kpi: "", desc: "", measure: "", note: "", imp: "", util: "", input: "", output: "", sla: "" },
        { id: 3, kpi: "", desc: "", measure: "", note: "", imp: "", util: "", input: "", output: "", sla: "" },
        { id: 4, kpi: "", desc: "", measure: "", note: "", imp: "", util: "", input: "", output: "", sla: "" },
    ])

    const t = {
        back: language === 'ar' ? "العودة" : "Back",
        title: language === 'ar' ? "إنتاجية المؤشرات" : "KPI Productivity",
        subtitle: language === 'ar' ? "إدارة وتتبع مؤشرات الأداء الرئيسية الخاصة بك" : "Manage and track your key performance indicators",
        reportNamePlace: language === 'ar' ? "أدخل اسم تقرير المؤشرات..." : "Enter KPI report name...",
        save: language === 'ar' ? "حفظ" : "Save",
        pdf: "PDF",
        excel: "Excel",
        cols: {
            kpi: language === 'ar' ? "المؤشر" : "KPI",
            desc: language === 'ar' ? "الوصف" : "Description",
            measure: language === 'ar' ? "القياس" : "Measure",
            note: language === 'ar' ? "ملاحظة" : "Note",
            imp: language === 'ar' ? "الأهمية" : "Imp.",
            util: language === 'ar' ? "الاستخدام" : "Util.",
            input: language === 'ar' ? "المدخلات" : "Input",
            output: language === 'ar' ? "المخرجات" : "Output",
            sla: language === 'ar' ? "اتفاقية مستوى الخدمة" : "SLA",
        },
        months: [
            { val: "january", label: language === 'ar' ? "يناير" : "January" },
            { val: "february", label: language === 'ar' ? "فبراير" : "February" },
            { val: "march", label: language === 'ar' ? "مارس" : "March" },
            { val: "april", label: language === 'ar' ? "أبريل" : "April" },
            { val: "may", label: language === 'ar' ? "مايو" : "May" },
            { val: "june", label: language === 'ar' ? "يونيو" : "June" },
            { val: "july", label: language === 'ar' ? "يوليو" : "July" },
            { val: "august", label: language === 'ar' ? "أغسطس" : "August" },
            { val: "september", label: language === 'ar' ? "سبتمبر" : "September" },
            { val: "october", label: language === 'ar' ? "أكتوبر" : "October" },
            { val: "november", label: language === 'ar' ? "نوفمبر" : "November" },
            { val: "december", label: language === 'ar' ? "ديسمبر" : "December" },
        ],
        addRow: language === 'ar' ? "إضافة صف جديد" : "Add New Row",
    }

    React.useEffect(() => {
        if (reportId) {
            const saved = localStorage.getItem('kpi_reports')
            if (saved) {
                try {
                    const reports = JSON.parse(saved)
                    const report = reports.find((r: any) => r.id === Number(reportId))
                    if (report) {
                        setReportName(report.name)
                        setMonth(report.month)
                        setRows(report.rows)
                    }
                } catch (e) {
                    console.error("Error parsing reports", e)
                }
            }
        }
    }, [reportId])

    const updateRow = (id: number, field: string, value: string) => {
        setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r))
    }

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            kpi: "", desc: "", measure: "", note: "", imp: "", util: "", input: "", output: "", sla: ""
        }])
    }

    const deleteRow = (id: number) => {
        setRows(rows.filter(r => r.id !== id))
    }

    const handleExportPDF = () => {
        const doc = new jsPDF()

        // Title
        doc.setFontSize(18)
        doc.text(reportName || t.title, 14, 22)

        // Month
        doc.setFontSize(11)
        doc.setTextColor(100)
        const monthLabel = t.months.find(m => m.val === month)?.label || month
        doc.text(`${t.title} - ${monthLabel}`, 14, 30)

        const tableColumn = [
            t.cols.kpi, t.cols.desc, t.cols.measure, t.cols.note,
            t.cols.imp, t.cols.util, t.cols.input, t.cols.output, t.cols.sla
        ]

        const tableRows = rows.filter(r => r.kpi || r.desc).map(row => [
            row.kpi, row.desc, row.measure, row.note,
            row.imp, row.util, row.input, row.output, row.sla
        ])

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        })

        doc.save(`${reportName || 'kpi-report'}.pdf`)
    }

    const handleSaveReport = () => {
        // Fallback name if empty
        const defaultName = language === 'ar'
            ? `${t.title} - ${t.months.find(m => m.val === month)?.label || month}`
            : `${t.title} - ${t.months.find(m => m.val === month)?.label || month}`;

        const finalName = reportName.trim() || defaultName;

        try {
            const raw = localStorage.getItem('kpi_reports')
            let existingReports = []
            if (raw) {
                try {
                    existingReports = JSON.parse(raw)
                    if (!Array.isArray(existingReports)) existingReports = []
                } catch (e) {
                    existingReports = []
                }
            }

            if (reportId) {
                const updatedReports = existingReports.map((r: any) => {
                    if (r.id === Number(reportId)) {
                        return {
                            ...r,
                            name: finalName,
                            month: month,
                            monthLabel: t.months.find(m => m.val === month)?.label || month,
                            rows: rows
                        }
                    }
                    return r
                })
                localStorage.setItem('kpi_reports', JSON.stringify(updatedReports))
            } else {
                const newReport = {
                    id: Date.now(),
                    name: finalName,
                    month: month,
                    monthLabel: t.months.find(m => m.val === month)?.label || month,
                    createdAt: new Date().toISOString(),
                    rows: rows
                }
                localStorage.setItem('kpi_reports', JSON.stringify([newReport, ...existingReports]))
            }

            // Small confirmation for the user
            alert(language === 'ar' ? "تم حفظ التقرير بنجاح!" : "Report saved successfully!")
            router.push('/kpi/reports')
        } catch (error) {
            console.error("Save failed", error)
            alert(language === 'ar' ? "فشل الحفظ. يرجى المحاولة مرة أخرى." : "Save failed. Please try again.")
        }
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between bg-card p-6 rounded-xl border shadow-sm">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 -ms-2">
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            </Link>
                        </Button>
                        <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground">{t.title}</h1>
                            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="w-full md:w-[300px]">
                        <Input
                            placeholder={t.reportNamePlace}
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            className="bg-background"
                        />
                    </div>
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="w-[130px] bg-background">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {t.months.map(m => (
                                <SelectItem key={m.val} value={m.val}>{m.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 w-9"
                            title={t.save}
                            onClick={handleSaveReport}
                        >
                            <Save className="h-4 w-4" />
                        </Button>

                        <Button size="icon" variant="destructive" className="bg-red-500 hover:bg-red-600 shadow-sm h-9 w-9" title={t.pdf} onClick={handleExportPDF}>
                            <FileText className="h-4 w-4" />
                        </Button>

                        <Button size="icon" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-9 w-9" title={t.excel}>
                            <FileSpreadsheet className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <Card className="overflow-hidden border shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[1200px]">
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px] font-bold uppercase text-xs tracking-wider">{t.cols.kpi}</TableHead>
                                    <TableHead className="w-[200px] font-bold uppercase text-xs tracking-wider">{t.cols.desc}</TableHead>
                                    <TableHead className="w-[150px] font-bold uppercase text-xs tracking-wider">{t.cols.measure}</TableHead>
                                    <TableHead className="w-[150px] font-bold uppercase text-xs tracking-wider">{t.cols.note}</TableHead>
                                    <TableHead className="w-[100px] font-bold uppercase text-xs tracking-wider">{t.cols.imp}</TableHead>
                                    <TableHead className="w-[100px] font-bold uppercase text-xs tracking-wider">{t.cols.util}</TableHead>
                                    <TableHead className="w-[100px] font-bold uppercase text-xs tracking-wider">{t.cols.input}</TableHead>
                                    <TableHead className="w-[100px] font-bold uppercase text-xs tracking-wider">{t.cols.output}</TableHead>
                                    <TableHead className="w-[100px] font-bold uppercase text-xs tracking-wider">{t.cols.sla}</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id} className="group hover:bg-muted/30">
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.kpi}
                                                onChange={(e) => updateRow(row.id, 'kpi', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                                placeholder={t.cols.kpi}
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.desc}
                                                onChange={(e) => updateRow(row.id, 'desc', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.measure}
                                                onChange={(e) => updateRow(row.id, 'measure', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Textarea
                                                value={row.note}
                                                onChange={(e) => updateRow(row.id, 'note', e.target.value)}
                                                className="min-h-[36px] h-9 resize-y py-1.5 border-transparent focus:border-input bg-transparent shadow-none"
                                                rows={1}
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.imp}
                                                onChange={(e) => updateRow(row.id, 'imp', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.util}
                                                onChange={(e) => updateRow(row.id, 'util', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.input}
                                                onChange={(e) => updateRow(row.id, 'input', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.output}
                                                onChange={(e) => updateRow(row.id, 'output', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1">
                                            <Input
                                                value={row.sla}
                                                onChange={(e) => updateRow(row.id, 'sla', e.target.value)}
                                                className="h-9 border-transparent focus:border-input bg-transparent shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-1 text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground/50 group-hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={() => deleteRow(row.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button variant="outline" onClick={addRow} className="gap-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary">
                    <Plus className="h-4 w-4" />
                    {t.addRow}
                </Button>
            </div>
        </div>
    )
}
