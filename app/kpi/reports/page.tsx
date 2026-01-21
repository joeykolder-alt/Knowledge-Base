"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { FileText, Trash2, LayoutDashboard, Pencil, Plus } from "lucide-react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface KpiReport {
    id: number;
    name: string;
    month: string;
    monthLabel: string;
    createdAt: string;
}

export default function KpiReportsPage() {
    const { language } = useLanguage()
    const router = useRouter()
    const [reports, setReports] = React.useState<KpiReport[]>([])

    React.useEffect(() => {
        const saved = localStorage.getItem('kpi_reports')
        if (saved) {
            try {
                setReports(JSON.parse(saved))
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    const handleEdit = (id: number) => {
        router.push(`/kpi/main?id=${id}`)
    }

    const handleDelete = (id: number) => {
        if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا التقرير؟' : 'Are you sure you want to delete this report?')) {
            const updated = reports.filter(r => r.id !== id)
            setReports(updated)
            localStorage.setItem('kpi_reports', JSON.stringify(updated))
        }
    }

    const t = {
        title: language === 'ar' ? "تقارير المؤشرات" : "KPI Reports",
        subtitle: language === 'ar' ? "عرض وإدارة تقارير الأداء المحفوظة" : "View and manage saved performance reports",
        noReports: language === 'ar' ? "لا توجد تقارير محفوظة" : "No saved reports found",
        cols: {
            name: language === 'ar' ? "اسم التقرير" : "Report Name",
            month: language === 'ar' ? "الشهر" : "Month",
            date: language === 'ar' ? "تاريخ الإنشاء" : "Created At",
            actions: language === 'ar' ? "إجراءات" : "Actions",
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
                    <p className="text-muted-foreground">{t.subtitle}</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/kpi/main">
                        <Plus className="me-2 h-4 w-4" />
                        {language === 'ar' ? "تقرير جديد" : "New Report"}
                    </Link>
                </Button>
            </div>

            <Card className="border shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[40%] font-semibold">{t.cols.name}</TableHead>
                                <TableHead className="font-semibold">{t.cols.month}</TableHead>
                                <TableHead className="font-semibold">{t.cols.date}</TableHead>
                                <TableHead className="text-end font-semibold">{t.cols.actions}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <LayoutDashboard className="h-8 w-8 text-muted-foreground/30" />
                                            <p>{t.noReports}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <Link href={`/kpi/reports/${report.id}`} className="truncate hover:text-blue-600 hover:underline transition-colors">
                                                    {report.name}
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                                                {report.monthLabel}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(report.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell className="text-end">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(report.id)}
                                                    className="text-muted-foreground hover:text-blue-600 transition-colors h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(report.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
