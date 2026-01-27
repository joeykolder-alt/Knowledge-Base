"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, User, Clock, ArrowRight, FileQuestion, Upload, X, ImageIcon, AlertCircle, Pencil, Trash2, MoreVertical } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/providers"
import TiptapEditor from "@/components/tiptap-editor"

const initialNewsItems: any[] = []

export default function NewsPage() {
    const { language } = useLanguage()
    const [newsItems, setNewsItems] = React.useState<any[]>([])
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [newNews, setNewNews] = React.useState({ title: "", summary: "", category: "New" })
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)

    // Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('knowledge_news_v2')
        if (saved) {
            try {
                setNewsItems(JSON.parse(saved))
            } catch (e) {
                setNewsItems([])
            }
        } else {
            setNewsItems([])
        }
        setIsLoaded(true)
    }, [])


    // Save to localStorage
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('knowledge_news_v2', JSON.stringify(newsItems))
        }
    }, [newsItems, isLoaded])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const resetForm = () => {
        setNewNews({ title: "", summary: "", category: "New" })
        setSelectedImage(null)
        setImagePreview(null)
        setEditingId(null)
    }

    const handleEdit = (news: any) => {
        setNewNews({ title: news.title, summary: news.summary, category: news.category })
        setImagePreview(news.image)
        setEditingId(news.id)
        setOpen(true)
    }

    const handleDelete = (id: number) => {
        if (confirm(language === 'ar' ? "هل أنت متأكد من حذف هذا الخبر؟" : "Are you sure you want to delete this news?")) {
            setNewsItems(newsItems.filter(item => item.id !== id))
        }
    }

    const handleSaveNews = () => {
        if (!newNews.title || !newNews.summary) return

        if (editingId) {
            setNewsItems(newsItems.map(item =>
                item.id === editingId
                    ? { ...item, ...newNews, image: imagePreview }
                    : item
            ))
        } else {
            const item = {
                id: Date.now(),
                ...newNews,
                date: new Date().toISOString().split('T')[0],
                author: "Admin",
                readTime: "3 min",
                image: imagePreview
            }
            setNewsItems([item, ...newsItems])
        }

        setOpen(false)
        resetForm()
    }

    // Helper to strip HTML for summary view
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    }

    const t = {
        title: language === 'ar' ? "الأخبار" : "News",
        subtitle: language === 'ar' ? "إدارة الأخبار والمحتوى" : "Manage news and content",
        search: language === 'ar' ? "ابحث عن خبر..." : "Search news...",
        addNews: language === 'ar' ? "إضافة خبر" : "Add News",
        dialogTitle: editingId
            ? (language === 'ar' ? "تعديل الخبر" : "Edit News")
            : (language === 'ar' ? "إضافة خبر جديد" : "Add New News"),
        newsTitle: language === 'ar' ? "عنوان الخبر" : "News Title",
        newsSummary: language === 'ar' ? "وصف مختصر..." : "Short summary...",
        uploadText: language === 'ar' ? "اختر صورة أو اسحبها هنا" : "Choose an image or drag it here",
        cancel: language === 'ar' ? "إلغاء" : "Cancel",
        add: editingId
            ? (language === 'ar' ? "حفظ التعديلات" : "Save Changes")
            : (language === 'ar' ? "إضافة" : "Add"),
    }

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">{t.title}</h2>
                    <p className="text-muted-foreground font-medium">{t.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input placeholder={t.search} className="pl-10 w-[200px] md:w-[300px] bg-background border-border rounded-xl focus-visible:ring-primary/20 transition-all font-medium text-foreground" />
                    </div>

                    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl px-6 h-10 font-bold">
                                <Plus className="me-2 h-4 w-4" />
                                {t.addNews}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border border-border shadow-2xl rounded-3xl bg-card max-h-[90vh] flex flex-col">
                            <div className="bg-primary p-6 text-primary-foreground shrink-0 leading-none">
                                <DialogHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold">{t.dialogTitle}</DialogTitle>
                                            <DialogDescription className="text-primary-foreground/70 text-xs mt-1">
                                                {language === 'ar' ? "قم بتعبئة البيانات لنشر الخبر في ساحة الأخبار" : "Fill in the details to publish news to the feed"}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <div className="p-6 space-y-5 bg-card overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t.newsTitle}</Label>
                                    <Input
                                        placeholder={t.newsTitle}
                                        value={newNews.title}
                                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                        className="h-12 bg-background border-border focus-visible:ring-primary/20 text-base font-semibold rounded-xl text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{language === 'ar' ? "محتوى الخبر" : "News Content"}</Label>
                                    <div className="min-h-[300px]">
                                        <TiptapEditor
                                            value={newNews.summary}
                                            onChange={(val) => setNewNews({ ...newNews, summary: val })}
                                            placeholder={t.newsSummary}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{language === 'ar' ? "الصورة المرفقة" : "Attached Image"}</Label>
                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id="news-image-upload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <label
                                            htmlFor="news-image-upload"
                                            className={cn(
                                                "flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden leading-none",
                                                imagePreview
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-border hover:border-primary/40 bg-muted/20 hover:bg-primary/5"
                                            )}
                                        >
                                            {imagePreview ? (
                                                <div className="relative w-full h-full">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Upload className="h-8 w-8 text-white animate-bounce" />
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg h-7 w-7"
                                                        onClick={(e) => { e.preventDefault(); resetForm(); }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-3 bg-background rounded-full shadow-sm border border-border group-hover/upload:scale-110 transition-transform">
                                                        <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                                                    </div>
                                                    <span className="text-sm font-bold text-muted-foreground/60">{t.uploadText}</span>
                                                    <span className="text-[10px] text-muted-foreground/40 font-medium tracking-tight">Support: PNG, JPG, WEBP (Max 5MB)</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="p-6 bg-muted/20 border-t border-border gap-3 shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="px-8 h-12 border-rose-200/50 text-rose-500 hover:bg-rose-50/50 hover:text-rose-600 font-bold rounded-xl dark:border-rose-900/50"
                                >
                                    {t.cancel}
                                </Button>
                                <Button
                                    onClick={handleSaveNews}
                                    className="px-10 h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                                >
                                    {t.add}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsItems.map((news) => (
                    <Card key={news.id} className={cn(
                        "flex flex-col h-full transition-all duration-500 border bg-card overflow-hidden group hover:shadow-2xl hover:-translate-y-1 rounded-3xl",
                        news.category === 'Important'
                            ? "border-emerald-500/20 shadow-emerald-500/5 ring-1 ring-emerald-500/10"
                            : "border-border/50 shadow-sm"
                    )}>
                        <div className="aspect-[16/10] w-full bg-muted relative overflow-hidden shrink-0">
                            {news.image ? (
                                <img src={news.image} alt={news.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground/20">
                                    <ImageIcon className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-md">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-32 rounded-xl border-border bg-card">
                                        <DropdownMenuItem onClick={() => handleEdit(news)} className="gap-2 font-bold cursor-pointer text-foreground">
                                            <Pencil className="h-3.5 w-3.5 text-primary" />
                                            {language === 'ar' ? "تعديل" : "Edit"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(news.id)} className="gap-2 font-bold text-rose-600 focus:text-rose-600 cursor-pointer focus:bg-rose-500/10">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            {language === 'ar' ? "حذف" : "Delete"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Badge className={cn(
                                "absolute top-4 right-4 z-10 backdrop-blur-md border px-3 py-1 font-bold",
                                news.category === 'Important'
                                    ? "bg-emerald-500/80 text-white border-emerald-400/50"
                                    : "bg-black/40 text-white border-white/20"
                            )}>
                                {news.category}
                            </Badge>
                        </div>

                        <CardHeader className="pt-5 pb-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                <Calendar className="h-3 w-3" />
                                {news.date}
                                <span className="text-muted-foreground/30">•</span>
                                <Clock className="h-3 w-3" />
                                {news.readTime}
                            </div>
                            <CardTitle className="text-xl font-black text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {news.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex-1 pt-0">
                            <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                                {stripHtml(news.summary || "")}
                            </p>
                        </CardContent>

                        <CardFooter className="pt-4 pb-6 px-6">
                            <div className="flex items-center justify-between w-full pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7 border-2 border-primary/20 bg-primary/5 shadow-sm text-primary">
                                        <AvatarFallback className="text-[8px] font-bold">{news.author.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-[11px] font-bold text-foreground/80 lowercase">{news.author}</span>
                                </div>
                                <Link href={`/knowledge/news/${news.id}`}>
                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 font-bold gap-2 text-xs rounded-lg">
                                        {language === 'ar' ? "قراءة المزيد" : "Read More"}
                                        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                                    </Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function Avatar({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("inline-flex items-center justify-center rounded-full overflow-hidden shrink-0", className)}>
            {children}
        </div>
    )
}

function AvatarFallback({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("w-full h-full flex items-center justify-center", className)}>
            {children}
        </div>
    )
}