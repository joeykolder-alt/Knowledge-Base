"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/providers"
import TiptapEditor from "@/components/tiptap-editor"

export default function EditArticlePage() {
    const params = useParams()
    const router = useRouter()
    const { shelfId, bookId, articleId } = params
    const { language } = useLanguage()
    const [title, setTitle] = React.useState("")
    const [content, setContent] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)

    const t = {
        back: language === 'ar' ? "العودة" : "Back",
        pageTitle: language === 'ar' ? "تعديل المقال" : "Edit Article",
        articleTitle: language === 'ar' ? "عنوان المقال" : "Article Title",
        titlePlaceholder: language === 'ar' ? "أدخل عنوان المقال" : "Enter article title",
        content: language === 'ar' ? "محتوى المقال" : "Article Content",
        save: language === 'ar' ? "حفظ التعديلات" : "Save Changes",
        cancel: language === 'ar' ? "إلغاء" : "Cancel",
        saving: language === 'ar' ? "جاري الحفظ..." : "Saving...",
    }

    React.useEffect(() => {
        const key = `knowledge_articles_book_${bookId}_v2`
        const saved = localStorage.getItem(key)
        if (saved) {
            try {
                const articles = JSON.parse(saved)
                const article = articles.find((a: any) => a.id.toString() === articleId)
                if (article) {
                    setTitle(article.title)
                    setContent(article.content)
                } else {
                    router.push(`/knowledge/shelves/${shelfId}/book/${bookId}`)
                }
            } catch (e) {
                console.error("Failed to parse articles", e)
            }
        }
        setIsLoading(false)
    }, [bookId, articleId, router, shelfId])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !content) return

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        const key = `knowledge_articles_book_${bookId}_v2`
        const saved = localStorage.getItem(key)

        if (saved) {
            try {
                const articles = JSON.parse(saved)
                const updatedArticles = articles.map((a: any) =>
                    a.id.toString() === articleId
                        ? { ...a, title, content, updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
                        : a
                )
                localStorage.setItem(key, JSON.stringify(updatedArticles))
            } catch (e) {
                console.error("Failed to update article", e)
            }
        }

        setIsSubmitting(false)
        router.push(`/knowledge/shelves/${shelfId}/book/${bookId}`)
    }

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Link href={`/knowledge/shelves/${shelfId}/book/${bookId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 shadow-sm">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                            <span className="text-sm font-bold tracking-tight">{t.back}</span>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">{t.pageTitle}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        <X className="me-2 h-4 w-4" />
                        {t.cancel}
                    </Button>
                    <Button onClick={handleSave} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold">
                        {isSubmitting ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent me-2" />
                        ) : (
                            <Save className="me-2 h-4 w-4" />
                        )}
                        {isSubmitting ? t.saving : t.save}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t.articleTitle}</Label>
                        <Input
                            id="title"
                            placeholder={t.titlePlaceholder}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t.content}</Label>
                        <div className="min-h-[400px]">
                            <TiptapEditor
                                value={content}
                                onChange={setContent}
                                placeholder={t.titlePlaceholder}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
