"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Pencil, FileText, Calendar, Printer, TrendingUp } from "lucide-react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ReportViewPage() {
    const { language } = useLanguage()
    const params = useParams()
    const router = useRouter()
    const reportId = params.id
    const [report, setReport] = React.useState<any>(null)

    React.useEffect(() => {
        const saved = localStorage.getItem('kpi_reports')
        if (saved) {
            try {
                const reports = JSON.parse(saved)
                const found = reports.find((r: any) => r.id === Number(reportId))
                if (found) {
                    setReport(found)
                }
            } catch (e) {
                console.error(e)
            }
        }
    }, [reportId])

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">
                    {language === 'ar' ? "التقرير غير موجود" : "Report not found"}
                </p>
                <Button asChild variant="outline">
                    <Link href="/kpi/reports">
                        {language === 'ar' ? "العودة للتقارير" : "Back to Reports"}
                    </Link>
                </Button>
            </div>
        )
    }

    const t = {
        title: language === 'ar' ? "عرض التقرير" : "View Report",
        edit: language === 'ar' ? "تعديل التقرير" : "Edit Report",
        back: language === 'ar' ? "العودة" : "Back",
        print: language === 'ar' ? "طباعة" : "Print",
        info: language === 'ar' ? "معلومات التقرير" : "Report Information",
        details: language === 'ar' ? "تفاصيل المؤشرات" : "KPI Details",
        cols: {
            kpi: language === 'ar' ? "المؤشر" : "KPI",
            desc: language === 'ar' ? "الوصف" : "Description",
            measure: language === 'ar' ? "القياس" : "Measure",
            note: language === 'ar' ? "ملاحظة" : "Note",
            imp: language === 'ar' ? "الأهمية" : "Imp.",
            util: language === 'ar' ? "الاستخدام" : "Util.",
            input: language === 'ar' ? "المدخلات" : "Input",
            output: language === 'ar' ? "المخرجات" : "Output",
            sla: language === 'ar' ? "SLA" : "SLA",
        }
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/kpi/reports">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{report.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1.5 capitalize">
                                <Calendar className="h-3.5 w-3.5" />
                                {report.monthLabel}
                            </div>
                            <span>•</span>
                            <div>
                                {new Date(report.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                        <Printer className="h-4 w-4" />
                        {t.print}
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2" asChild>
                        <Link href={`/kpi/main?id=${report.id}`}>
                            <Pencil className="h-4 w-4" />
                            {t.edit}
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Content Card */}
            <Card className="border shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{t.details}</CardTitle>
                            <CardDescription>{language === 'ar' ? "استعراض كامل لجميع مؤشرات الأداء الواردة في التقرير" : "Complete overview of all KPIs in this report"}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="font-bold">{t.cols.kpi}</TableHead>
                                    <TableHead className="font-bold">{t.cols.desc}</TableHead>
                                    <TableHead className="font-bold">{t.cols.measure}</TableHead>
                                    <TableHead className="font-bold">{t.cols.note}</TableHead>
                                    <TableHead className="w-[80px] text-center font-bold">{t.cols.imp}</TableHead>
                                    <TableHead className="w-[80px] text-center font-bold">{t.cols.util}</TableHead>
                                    <TableHead className="w-[80px] text-center font-bold">{t.cols.input}</TableHead>
                                    <TableHead className="w-[80px] text-center font-bold">{t.cols.output}</TableHead>
                                    <TableHead className="w-[80px] text-center font-bold">{t.cols.sla}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.rows.filter((r: any) => r.kpi || r.desc).map((row: any, idx: number) => (
                                    <TableRow key={row.id || idx} className="hover:bg-muted/20">
                                        <TableCell className="font-medium text-blue-600 dark:text-blue-400">{row.kpi}</TableCell>
                                        <TableCell>{row.desc}</TableCell>
                                        <TableCell>{row.measure}</TableCell>
                                        <TableCell className="max-w-[200px] text-muted-foreground italic text-sm">{row.note}</TableCell>
                                        <TableCell className="text-center font-mono">{row.imp}</TableCell>
                                        <TableCell className="text-center font-mono">{row.util}</TableCell>
                                        <TableCell className="text-center font-mono">{row.input}</TableCell>
                                        <TableCell className="text-center font-mono">{row.output}</TableCell>
                                        <TableCell className="text-center font-mono bg-blue-50/50 dark:bg-blue-900/10 font-bold">{row.sla}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
