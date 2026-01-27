"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, User, CreditCard, MessageSquare } from "lucide-react"

import { useLanguage } from "@/components/providers"

export default function SuggestionsPage() {
    const { language } = useLanguage()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const t = {
        title: language === 'ar' ? "صندوق الاقتراحات" : "Suggestions Box",
        subtitle: language === 'ar' ? "نحن نقدر ملاحظاتك. يرجى مشاركة اقتراحاتك لمساعدتنا على التحسن." : "We value your feedback. Please share your suggestions to help us improve.",
        formTitle: language === 'ar' ? "أرسل اقتراحاً" : "Submit a Suggestion",
        formDesc: language === 'ar' ? "إملأ النموذج أدناه لطرح أفكارك." : "Fill out the form below to voice your ideas.",
        nameLabel: language === 'ar' ? "اسم الموظف" : "Employee Name",
        namePlaceholder: language === 'ar' ? "الاسم الكامل" : "Full Name",
        idLabel: language === 'ar' ? "رقم الموظف" : "Employee ID",
        suggestionTitle: language === 'ar' ? "عنوان الاقتراح" : "Suggestion Title",
        titlePlaceholder: language === 'ar' ? "عنوان مختصر للاقتراح" : "Brief title of your suggestion",
        detailsLabel: language === 'ar' ? "تفاصيل الاقتراح" : "Suggestion Details",
        detailsPlaceholder: language === 'ar' ? "يرجى وصف اقتراحك بالتفصيل..." : "Please describe your suggestion in detail...",
        submitBtn: language === 'ar' ? "إرسال الاقتراح" : "Submit Suggestion",
        submitting: language === 'ar' ? "جاري الإرسال..." : "Sending...",
        success: language === 'ar' ? "شكراً لك! تم إرسال اقتراحك بنجاح." : "Thank you! Your suggestion has been submitted successfully."
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        // You would normally show a toast here, assuming sonner or similar is installed.
        // Alert for now or just visual feedback.
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
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                            <MessageSquare className="h-6 w-6" />
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

                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                {t.suggestionTitle}
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
                        <Button type="submit" size="lg" className="w-full md:w-auto min-w-[150px]" disabled={isSubmitting}>
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
