"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FileText, ArrowLeft, Pencil, Trash2, PlusCircle, Upload, ImageIcon, X } from "lucide-react"
import { useLanguage } from "@/components/providers"

// Mock Books
const initialBooks = [
    { id: 1, title: 'Standard Operating Procedures', articles: 15, author: 'Admin', cover: null },
    { id: 2, title: 'Troubleshooting Guide 101', articles: 8, author: 'Tech Lead', cover: null },
    { id: 3, title: 'Safety Protocols', articles: 4, author: 'HR', cover: null },
    { id: 4, title: 'Customer Service Scripts', articles: 22, author: 'Support Lead', cover: null },
]

export default function BooksPage() {
    const params = useParams()
    const shelfId = params.shelfId
    const { language } = useLanguage()
    const [open, setOpen] = React.useState(false)
    const [booksList, setBooksList] = React.useState<any[]>([])
    const [isLoaded, setIsLoaded] = React.useState(false)

    // Load from localStorage on mount or shelfId change
    React.useEffect(() => {
        const key = `knowledge_books_shelf_${shelfId}`
        const saved = localStorage.getItem(key)
        const defaults = getInitialBooks()
        if (saved) {
            try {
                const localData = JSON.parse(saved)
                // Merge logic: add defaults if they don't exist by title
                const merged = [...localData]
                defaults.forEach(def => {
                    if (!merged.find(m => m.title === def.title)) {
                        merged.push(def)
                    }
                })
                setBooksList(merged)
            } catch (e) {
                setBooksList(defaults)
            }
        } else {
            setBooksList(defaults)
        }
        setIsLoaded(true)
    }, [shelfId])

    // Save to localStorage when books change
    React.useEffect(() => {
        if (isLoaded) {
            const key = `knowledge_books_shelf_${shelfId}`
            localStorage.setItem(key, JSON.stringify(booksList))
        }
    }, [booksList, shelfId, isLoaded])

    function getInitialBooks() {
        if (shelfId === "1" || shelfId === "5" || shelfId === "6") {
            return []
        }
        if (shelfId === "2") {
            return [
                { id: 1, title: 'FastPay - تطبيق ونقاط بيع 💳', articles: 12, author: 'Finance', cover: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop' },
                { id: 2, title: 'تعبئة وشراء كارتات الوطني عبر تطبيق كي كارد (Qi Services)', articles: 8, author: 'Tech', cover: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop' },
                { id: 3, title: 'تعبئة وشراء كارتات الوطني عبر تطبيق كي كارد (Super Qi)', articles: 10, author: 'Tech', cover: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800&auto=format&fit=crop' },
                { id: 4, title: 'مكاتب الوكلاء 🏢', articles: 25, author: 'Operations', cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop' },
                { id: 5, title: 'مراكز البيع الخاصة بالوطني للإنترنت 🏢', articles: 18, author: 'Sales', cover: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop' },
                { id: 6, title: 'تجديد الاشتراك عبر منصة تبادل (Visa/MasterCard) 💳', articles: 15, author: 'Finance', cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop' },
                { id: 7, title: 'شراء بطاقات التعبئة عبر تطبيق طماطة 🛒', articles: 7, author: 'Sales', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop' },
            ]
        }
        if (shelfId === "3") {
            return [
                {
                    id: 1,
                    title: 'المجمعات السكنية 🏠',
                    details: '📌 جدول المجمعات المفعلة وأرقام الدعم الخاصة بها',
                    articles: 10,
                    author: 'Support',
                    cover: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
                }
            ]
        }
        if (shelfId === "4") {
            return [
                {
                    id: 1,
                    title: 'ALMANASA',
                    details: '❓ General Inquiry',
                    articles: 5,
                    author: 'Admin',
                    cover: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'
                }
            ]
        }
        return initialBooks
    }
    const [title, setTitle] = React.useState("")
    const [details, setDetails] = React.useState("")
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [imagePreview, setImagePreview] = React.useState<string | null>(null)

    const t = {
        back: language === 'ar' ? "العودة للرفوف" : "Back to Shelves",
        pageTitle: language === 'ar' ? `الكتب في الرف #${shelfId}` : `Books in Shelf #${shelfId}`,
        addBook: language === 'ar' ? "إضافة كتاب" : "Add Book",
        createTitle: language === 'ar' ? "إنشاء كتاب جديد" : "Create New Book",
        createDesc: language === 'ar' ? "قم بإنشاء كتاب ليحتوي المقالات." : "Create a book to hold articles.",
        bookTitle: language === 'ar' ? "عنوان الكتاب" : "Book Title",
        titlePlaceholder: language === 'ar' ? "عنوان الكتاب" : "Book Title",
        details: language === 'ar' ? "التفاصيل" : "Details",
        detailsPlaceholder: language === 'ar' ? "وصف الكتاب..." : "Book description...",
        createBtn: language === 'ar' ? "إنشاء كتاب" : "Create Book",
        saveBtn: language === 'ar' ? "حفظ التغييرات" : "Save Changes",
        editTitle: language === 'ar' ? "تعديل الكتاب" : "Edit Book",
        editDesc: language === 'ar' ? "تعديل اسم وتفاصيل الكتاب." : "Edit book name and details.",
        articles: language === 'ar' ? "مقالات" : "Articles",
        openBook: language === 'ar' ? "فتح الكتاب" : "Open Book",
        edit: language === 'ar' ? "تعديل" : "Edit",
        delete: language === 'ar' ? "حذف" : "Delete",
        addArticle: language === 'ar' ? "إضافة مقال" : "Add Article",
        deleteConfirm: language === 'ar' ? "هل أنت متأكد من حذف هذا الكتاب؟" : "Are you sure you want to delete this book?",
        coverLabel: language === 'ar' ? "غلاف الكتاب" : "Book Cover",
        uploadText: language === 'ar' ? "اضغط لرفع صورة" : "Click to upload image",
        changeText: language === 'ar' ? "اضغط للتغيير" : "Click to change",
    }

    const [isEditing, setIsEditing] = React.useState(false)
    const [currentBookId, setCurrentBookId] = React.useState<number | null>(null)

    const resetForm = () => {
        setOpen(false)
        setTitle("")
        setDetails("")
        setSelectedFile(null)
        setImagePreview(null)
        setIsEditing(false)
        setCurrentBookId(null)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title) return

        if (isEditing && currentBookId) {
            setBooksList(booksList.map((book: any) =>
                book.id === currentBookId
                    ? { ...book, title: title, details: details, cover: imagePreview || book.cover }
                    : book
            ))
        } else {
            const newBook = {
                id: Date.now(),
                title: title,
                articles: 0,
                author: 'Admin',
                details: details,
                cover: imagePreview
            }
            setBooksList([...booksList, newBook])
        }

        resetForm()
    }

    const handleEdit = (book: any) => {
        setTitle(book.title)
        setDetails(book.details || "")
        setImagePreview(book.cover || null)
        setIsEditing(true)
        setCurrentBookId(book.id)
        setOpen(true)
    }

    const handleDeleteBook = (e: React.MouseEvent, id: number) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm(t.deleteConfirm)) {
            setBooksList(booksList.filter(b => b.id !== id))
        }
    }

    return (
        <div className="space-y-6" >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                    <Link href="/knowledge/shelves" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 shadow-sm">
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                        <span className="text-sm font-bold tracking-tight">{t.back}</span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-[#0039a6]">{t.pageTitle}</h1>
                </div>

                <Dialog open={open} onOpenChange={(val) => !val && resetForm()}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setOpen(true)}>
                            <Plus className="me-2 h-4 w-4" />
                            {t.addBook}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? t.editTitle : t.createTitle}</DialogTitle>
                            <DialogDescription>
                                {isEditing ? t.editDesc : t.createDesc}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">{t.bookTitle}</Label>
                                <Input
                                    id="title"
                                    placeholder={t.titlePlaceholder}
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="details">{t.details}</Label>
                                <Textarea
                                    id="details"
                                    placeholder={t.detailsPlaceholder}
                                    className="resize-none min-h-[100px]"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.coverLabel}</Label>
                                <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors hover:border-primary/50 relative overflow-hidden h-32">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <Upload className="h-6 w-6 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                            <span className="text-xs font-medium">{t.uploadText}</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <DialogFooter>
                                <Button type="submit">{isEditing ? t.saveBtn : t.createBtn}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {booksList.map((book: any) => (
                    <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 cursor-default bg-card overflow-hidden border-border/50 rounded-2xl">
                        <div className="aspect-[16/10] bg-muted relative overflow-hidden group">
                            {book.cover ? (
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/10 text-blue-600/30">
                                    <FileText className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardHeader className="pt-4 pb-1">
                            <CardTitle className="text-lg font-black leading-tight group-hover:text-[#0039a6] transition-colors line-clamp-2">
                                {book.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-1 space-y-2">
                            {book.details && (
                                <p className="text-xs text-muted-foreground font-normal line-clamp-2 leading-relaxed">
                                    {book.details}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-[11px] text-[#0039a6]/60 font-medium bg-blue-50/50 dark:bg-blue-900/10 w-fit px-2 py-0.5 rounded-md">
                                <span>{book.articles} {t.articles}</span>
                                <span className="opacity-30">•</span>
                                <span>{book.author}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center gap-2 p-4 pt-0">
                            <Link href={`/knowledge/shelves/${shelfId}/book/${book.id}`} className="flex-1">
                                <Button variant="secondary" className="w-full">
                                    {t.openBook}
                                </Button>
                            </Link>
                            <div className="flex shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title={t.edit}
                                    className="h-9 w-9"
                                    onClick={() => handleEdit(book)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Link href={`/knowledge/shelves/${shelfId}/book/${book.id}/add-article`}>
                                    <Button variant="ghost" size="icon" title={t.addArticle} className="h-9 w-9">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title={t.delete}
                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => handleDeleteBook(e, book.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div >
    )
}
