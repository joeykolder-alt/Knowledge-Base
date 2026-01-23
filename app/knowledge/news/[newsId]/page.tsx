"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReadHistoryTable } from "@/components/knowledge/read-history-table"
import { ArrowLeft, Calendar, User, Clock, FileText, ImageIcon } from "lucide-react"
import { useLanguage } from "@/components/providers"

export default function NewsDetailPage() {
    const params = useParams()
    const { newsId } = params
    const { language } = useLanguage()
    const [news, setNews] = React.useState<any>(null)
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        const saved = localStorage.getItem('knowledge_news_v2')
        if (saved) {
            try {
                const newsItems = JSON.parse(saved)
                const item = newsItems.find((n: any) => n.id.toString() === newsId)
                if (item) {
                    setNews(item)
                }
            } catch (e) {
                console.error("Failed to parse news", e)
            }
        }
        setIsLoaded(true)
    }, [newsId])

    const t = {
        back: language === 'ar' ? "العودة للأخبار" : "Back to News",
        readTime: language === 'ar' ? "دقائق للقراءة" : "min read",
        interactionLog: language === 'ar' ? "سجل التفاعل" : "Interaction Log",
        notFound: language === 'ar' ? "الخبر غير موجود" : "News not found",
        by: language === 'ar' ? "بواسطة" : "By",
    }

    if (isLoaded && !news) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FileText className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <h2 className="text-xl font-bold">{t.notFound}</h2>
                <Link href="/knowledge/news" className="mt-4 text-primary font-bold hover:underline">
                    {t.back}
                </Link>
            </div>
        )
    }

    if (!news) return null

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
            <div className="space-y-4">
                <Link href="/knowledge/news" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 shadow-sm w-fit">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-tight">{t.back}</span>
                </Link>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">{news.category}</Badge>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight lg:text-5xl text-foreground">{news.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm font-medium pt-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-muted rounded-md"><User className="h-3.5 w-3.5" /></div>
                            <span>{t.by} {news.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-muted rounded-md"><Calendar className="h-3.5 w-3.5" /></div>
                            <span>{news.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-muted rounded-md"><Clock className="h-3.5 w-3.5" /></div>
                            <span>{news.readTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {news.image ? (
                <div className="aspect-video w-full rounded-[2rem] overflow-hidden border shadow-inner">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="aspect-video bg-muted rounded-[2rem] w-full flex flex-col items-center justify-center text-muted-foreground/30 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-dashed border-2">
                    <ImageIcon className="h-12 w-12 mb-2" />
                </div>
            )}

            <article className="prose prose-lg prose-slate dark:prose-invert max-w-none bg-card p-10 rounded-[2.5rem] border shadow-sm prose-p:leading-relaxed prose-headings:font-black">
                <div dangerouslySetInnerHTML={{ __html: news.summary }} />
            </article>

            <Separator className="my-12 opacity-50" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-black tracking-tight">{t.interactionLog}</h2>
                    <p className="text-sm text-muted-foreground font-medium">{language === 'ar' ? "قائمة الموظفين الذين شاهدوا هذا الخبر" : "List of employees who viewed this news"}</p>
                </div>
                <ReadHistoryTable />
            </div>
        </div>
    )
}
