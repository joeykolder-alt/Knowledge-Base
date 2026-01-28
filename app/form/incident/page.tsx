"use client"

import { useState } from "react"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, MapPin, AlertCircle, Send, FileText } from "lucide-react"

export default function IncidentFormPage() {
    const { language } = useLanguage()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [issueType, setIssueType] = useState("")

    const t = {
        pageTitle: language === 'ar' ? "نموذج الحادث" : "Incident Form",
        subPhoneLabel: language === 'ar' ? "رقم هاتف الاشتراك" : "Subscription Phone Number",
        subPhonePlaceholder: language === 'ar' ? "أدخل رقم الهاتف" : "Enter phone number",
        zoneLabel: language === 'ar' ? "المنطقة" : "Zone",
        zonePlaceholder: language === 'ar' ? "أدخل المنطقة" : "Enter zone",
        issueTypeLabel: language === 'ar' ? "نوع المشكلة" : "Issue Type",
        issueTypePlaceholder: language === 'ar' ? "اختر نوع المشكلة" : "Select issue type",
        otherIssueLabel: language === 'ar' ? "اكتب نوع المشكلة" : "Describe Problem",
        otherIssuePlaceholder: language === 'ar' ? "يرجى وصف المشكلة" : "Please describe the problem",
        submitBtn: language === 'ar' ? "إرسال" : "Submit",
        submitting: language === 'ar' ? "جاري الإرسال..." : "Sending...",
        typeOptions: {
            changeZone: language === 'ar' ? "تغيير المنطقة" : "Change Zone",
            noService: language === 'ar' ? "لا توجد خدمة" : "No Service",
            slowService: language === 'ar' ? "بطء أو انقطاع في الخدمة" : "Slow Service or Interruptions",
            problemReport: language === 'ar' ? "تقرير مشكلة" : "Problem Report",
            other: language === 'ar' ? "أخرى" : "Other"
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        alert(language === 'ar' ? "تم الإرسال بنجاح" : "Submitted successfully")
    }

    return (
        <div className="container max-w-2xl mx-auto py-12 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {t.pageTitle}
                </h1>
            </div>

            <Card className="border-border/50 shadow-xl bg-card/95 backdrop-blur-sm">
                <CardHeader />
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        {/* Subscription Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-primary" />
                                {t.subPhoneLabel}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder={t.subPhonePlaceholder}
                                required
                                className="h-11 bg-background/50 focus:bg-background transition-colors"
                            />
                        </div>

                        {/* Zone */}
                        <div className="space-y-2">
                            <Label htmlFor="zone" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                {t.zoneLabel}
                            </Label>
                            <Input
                                id="zone"
                                placeholder={t.zonePlaceholder}
                                required
                                className="h-11 bg-background/50 focus:bg-background transition-colors"
                            />
                        </div>

                        {/* Issue Type */}
                        <div className="space-y-2">
                            <Label htmlFor="issueType" className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                {t.issueTypeLabel}
                            </Label>
                            <div className="relative">
                                <select
                                    id="issueType"
                                    required
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none transition-colors focus:bg-background"
                                >
                                    <option value="" disabled>{t.issueTypePlaceholder}</option>
                                    <option value="change-zone">{t.typeOptions.changeZone}</option>
                                    <option value="no-service">{t.typeOptions.noService}</option>
                                    <option value="slow-service">{t.typeOptions.slowService}</option>
                                    <option value="problem-report">{t.typeOptions.problemReport}</option>
                                    <option value="other">{t.typeOptions.other}</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none rtl:right-auto rtl:left-0">
                                    <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Other Issue Description field (matches user request exactly) */}
                        {issueType === "other" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor="otherDetails" className="flex items-center gap-2 text-primary">
                                    <FileText className="h-4 w-4" />
                                    {t.otherIssueLabel}
                                </Label>
                                <Input
                                    id="otherDetails"
                                    placeholder={t.otherIssuePlaceholder}
                                    required
                                    className="h-11 bg-background/50 focus:bg-background transition-colors"
                                    autoFocus
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t border-border/50 py-6 flex justify-center">
                        <Button type="submit" size="lg" className="w-full sm:w-auto min-w-[200px] text-lg font-semibold shadow-lg shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? t.submitting : (
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
