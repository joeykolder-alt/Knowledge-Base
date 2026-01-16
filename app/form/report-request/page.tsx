"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, User, CreditCard, MessageSquare, Briefcase, FileWarning, AlertTriangle } from "lucide-react"

export default function ReportRequestPage() {
    const { language } = useLanguage()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const t = {
        title: language === 'ar' ? "طلب تبليغ" : "Report Request",
        subtitle: language === 'ar' ? "يرجى تقديم تفاصيل التبليغ بدقة لضمان المعالجة السريعة." : "Please submit report details accurately to ensure quick processing.",
        formTitle: language === 'ar' ? "تقديم بلاغ جديد" : "Submit New Report",
        formDesc: language === 'ar' ? "إملأ النموذج أدناه ببيانات التبليغ." : "Fill out the form below with report data.",
        nameLabel: language === 'ar' ? "اسم الموظف" : "Employee Name",
        namePlaceholder: language === 'ar' ? "الاسم الكامل" : "Full Name",
        idLabel: language === 'ar' ? "رقم الموظف" : "Employee ID",
        deptLabel: language === 'ar' ? "القسم" : "Department",
        typeLabel: language === 'ar' ? "نوع التبليغ" : "Report Type",
        reportTitle: language === 'ar' ? "عنوان التبليغ" : "Report Title",
        titlePlaceholder: language === 'ar' ? "عنوان مختصر للتبليغ" : "Brief report title",
        detailsLabel: language === 'ar' ? "تفاصيل التبليغ" : "Report Details",
        detailsPlaceholder: language === 'ar' ? "يرجى وصف التبليغ بالتفصيل..." : "Please describe the report in detail...",
        submitBtn: language === 'ar' ? "إرسال التبليغ" : "Submit Report",
        submitting: language === 'ar' ? "جاري الإرسال..." : "Sending...",
        success: language === 'ar' ? "شكراً لك! تم إرسال التبليغ بنجاح." : "Thank you! Your report has been submitted successfully.",
        deptOptions: {
            placeholder: language === 'ar' ? "اختر القسم" : "Select Department",
            inbound: "Inbound",
            outbound: "Outbound",
            nonVoice: "Non-Voice"
        },
        typeOptions: {
            placeholder: language === 'ar' ? "اختر نوع التبليغ" : "Select Report Type",
            tech: language === 'ar' ? "مشكلة تقنية" : "Technical Issue",
            admin: language === 'ar' ? "مخالفة إدارية" : "Administrative Violation",
            other: language === 'ar' ? "أخرى" : "Other"
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        alert(t.success)
    }

    return (
        <div className="container max-w-2xl mx-auto py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h1>
                <p className="text-muted-foreground">
                    {t.subtitle}
                </p>
            </div>

            <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-destructive/10 rounded-lg text-destructive">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{t.formTitle}</CardTitle>
                            <CardDescription>{t.formDesc}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    {t.nameLabel}
                                </Label>
                                <Input id="name" placeholder={t.namePlaceholder} required className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="id" className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    {t.idLabel}
                                </Label>
                                <Input id="id" placeholder="EMP-1234" required className="bg-background/50" />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="department" className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    {t.deptLabel}
                                </Label>
                                <div className="relative">
                                    <select
                                        id="department"
                                        required
                                        defaultValue=""
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value="" disabled>{t.deptOptions.placeholder}</option>
                                        <option value="inbound">{t.deptOptions.inbound}</option>
                                        <option value="outbound">{t.deptOptions.outbound}</option>
                                        <option value="non-voice">{t.deptOptions.nonVoice}</option>
                                    </select>
                                    {/* Custom arrow if needed, but native is accessible. Adding a small pointer-events-none icon for style safely */}
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none rtl:right-auto rtl:left-0">
                                        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type" className="flex items-center gap-2">
                                    <FileWarning className="h-4 w-4 text-muted-foreground" />
                                    {t.typeLabel}
                                </Label>
                                <div className="relative">
                                    <select
                                        id="type"
                                        required
                                        defaultValue=""
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        <option value="" disabled>{t.typeOptions.placeholder}</option>
                                        <option value="technical">{t.typeOptions.tech}</option>
                                        <option value="violation">{t.typeOptions.admin}</option>
                                        <option value="other">{t.typeOptions.other}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none rtl:right-auto rtl:left-0">
                                        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                {t.reportTitle}
                            </Label>
                            <Input id="title" placeholder={t.titlePlaceholder} required className="bg-background/50" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="details">{t.detailsLabel}</Label>
                            <Textarea
                                id="details"
                                placeholder={t.detailsPlaceholder}
                                className="min-h-[150px] bg-background/50 resize-y"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 border-t border-border/50 py-4 flex justify-end">
                        <Button type="submit" size="lg" className="w-full md:w-auto min-w-[150px] bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? (
                                t.submitting
                            ) : (
                                <>
                                    {t.submitBtn}
                                    <Send className="ms-2 h-4 w-4 rtl:rotate-180" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
