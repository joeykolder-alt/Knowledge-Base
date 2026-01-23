"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReadHistoryTable } from "@/components/knowledge/read-history-table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Share2, Printer, Eye, PlusCircle, FileText, BookOpen } from "lucide-react"
import { useLanguage } from "@/components/providers"

export default function ArticlePage() {
    const params = useParams()
    const { shelfId, bookId } = params
    const { language } = useLanguage()
    const [articles, setArticles] = React.useState<any[]>([])
    const [bookTitle, setBookTitle] = React.useState<string>("")
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        // Load Book Title
        const shelfKey = `knowledge_books_shelf_${shelfId}_v2`
        const savedBooks = localStorage.getItem(shelfKey)
        if (savedBooks) {
            try {
                const books = JSON.parse(savedBooks)
                const currentBook = books.find((b: any) => b.id.toString() === bookId)
                if (currentBook) {
                    setBookTitle(currentBook.title)
                }
            } catch (e) {
                console.error("Failed to parse books", e)
            }
        }

        // Load Articles
        const articleKey = `knowledge_articles_book_${bookId}_v2`
        const savedArticles = localStorage.getItem(articleKey)
        if (savedArticles) {
            try {
                setArticles(JSON.parse(savedArticles))
            } catch (e) {
                setArticles([])
            }
        }
        setIsLoaded(true)
    }, [shelfId, bookId])

    const t = {
        back: language === 'ar' ? "العودة للكتب" : "Back to Books",
        share: language === 'ar' ? "مشاركة" : "Share",
        print: language === 'ar' ? "طباعة" : "Print",
        edit: language === 'ar' ? "تعديل الكتاب" : "Edit Book",
        addArticle: language === 'ar' ? "إضافة مقال" : "Add Article",
        readHistory: language === 'ar' ? "سجل القراءة" : "Read History",
        readHistoryDesc: language === 'ar' ? "سجل الموظفين الذين قاموا بالدخول إلى هذا المستند." : "Log of employees who have accessed this document.",
        exportLog: language === 'ar' ? "تصدير السجل" : "Export Log",
        noContent: language === 'ar' ? "لا يوجد محتوى في هذا الكتاب بعد. ابدأ بإضافة مقالات." : "No content in this book yet. Start by adding articles.",
        updatedBy: language === 'ar' ? "تحديث" : "Updated",
        by: language === 'ar' ? "بواسطة" : "By",
        views: language === 'ar' ? "مشاهدة" : "views"
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Link href={`/knowledge/shelves/${shelfId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 shadow-sm w-fit">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-tight">{t.back}</span>
                </Link>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="ghost" size="sm" className="h-9 font-bold text-xs rounded-lg hover:bg-muted">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t.share}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 font-bold text-xs rounded-lg hover:bg-muted">
                        <Printer className="h-4 w-4 mr-2" />
                        {t.print}
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 font-bold text-xs rounded-lg border-border hover:bg-muted">
                        <Edit className="h-4 w-4 mr-2" />
                        {t.edit}
                    </Button>
                    <Link href={`/knowledge/shelves/${shelfId}/book/${bookId}/add-article`}>
                        <Button size="sm" className="h-9 font-bold text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2">
                            <PlusCircle className="h-4 w-4" />
                            {t.addArticle}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Book Content */}
            <div className="space-y-10">
                {isLoaded && articles.length > 0 ? (
                    articles.map((article, idx) => (
                        <article key={article.id} className="prose prose-slate dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-6">
                                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">{article.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                                    <span>{t.updatedBy} {article.updatedAt}</span>
                                    <span>•</span>
                                    <span>{t.by} {article.author}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views} {t.views}</span>
                                </div>
                            </div>

                            <div
                                className="p-8 bg-card rounded-3xl border shadow-sm prose-p:leading-relaxed prose-headings:font-bold"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                            {idx < articles.length - 1 && <Separator className="my-10 opacity-50" />}
                        </article>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20 text-center px-6">
                        <div className="p-4 bg-background rounded-2xl shadow-sm border mb-4">
                            <BookOpen className="h-10 w-10 text-primary/40" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{bookTitle || "Book"}</h3>
                        <p className="text-muted-foreground font-medium max-w-sm">
                            {t.noContent}
                        </p>
                        <Link href={`/knowledge/shelves/${shelfId}/book/${bookId}/add-article`} className="mt-6">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 h-11">
                                <PlusCircle className="me-2 h-4 w-4" />
                                {t.addArticle}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <Separator className="my-12" />

            {/* Read History */}
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{t.readHistory}</h2>
                        <p className="text-sm text-muted-foreground font-medium">{t.readHistoryDesc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-10 font-bold px-4 rounded-xl border-border">
                        <FileText className="h-4 w-4 me-2" />
                        {t.exportLog}
                    </Button>
                </div>

                <ReadHistoryTable />
            </div>
        </div>
    )
}
