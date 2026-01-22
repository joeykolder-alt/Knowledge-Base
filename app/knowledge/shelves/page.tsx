"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Book, Plus, Search, Library, Upload, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { useLanguage } from "@/components/providers"

interface Shelf {
    id: number;
    title: string;
    subtitle: string;
    books: number;
    cover: string;
}

export default function ShelvesPage() {
    const { language } = useLanguage()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [shelvesList, setShelvesList] = useState<Shelf[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('knowledge_shelves_v2')
        if (saved) {
            try {
                setShelvesList(JSON.parse(saved))
            } catch (e) {
                setShelvesList([])
            }
        } else {
            setShelvesList([])
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('knowledge_shelves_v2', JSON.stringify(shelvesList))
        }
    }, [shelvesList, isLoaded])

    const initialShelves: Shelf[] = []
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [currentShelfId, setCurrentShelfId] = useState<number | null>(null)

    const t = {
        title: language === 'ar' ? "الرفوف" : "The Shelves",
        subtitle: language === 'ar' ? "إدارة الرفوف والمحتوى" : "Manage shelves and content",
        searchPlaceholder: language === 'ar' ? "ابحث عن رف..." : "Search for a shelf...",
        addShelf: language === 'ar' ? "إضافة رف" : "Add Shelf",
        addTitle: language === 'ar' ? "إضافة رف جديد" : "Add New Shelf",
        editTitle: language === 'ar' ? "تعديل الرف" : "Edit Shelf",
        addDesc: language === 'ar' ? "قم بإنشاء رف جديد لتنظيم الكتب." : "Create a new shelf to organize books.",
        editDesc: language === 'ar' ? "تحديث تفاصيل الرف." : "Update shelf details.",
        nameLabel: language === 'ar' ? "الاسم" : "Name",
        namePlaceholder: language === 'ar' ? "اسم الرف" : "Shelf Name",
        descLabel: language === 'ar' ? "الوصف" : "Description",
        descPlaceholder: language === 'ar' ? "وصف الرف..." : "Shelf description...",
        coverLabel: language === 'ar' ? "صورة الغلاف" : "Cover Image",
        uploadText: language === 'ar' ? "اضغط لرفع صورة" : "Click to upload image",
        changeText: language === 'ar' ? "اضغط للتغيير" : "Click to change",
        saveBtn: language === 'ar' ? "حفظ التغييرات" : "Save Changes",
        createBtn: language === 'ar' ? "إنشاء الرف" : "Create Shelf",
        books: language === 'ar' ? "كتب" : "Books",
        viewDetails: language === 'ar' ? "عرض التفاصيل" : "View Details",
        edit: language === 'ar' ? "تعديل" : "Edit",
        delete: language === 'ar' ? "حذف" : "Delete",
        deleteConfirm: language === 'ar' ? "هل أنت متأكد أنك تريد حذف هذا الرف؟" : "Are you sure you want to delete this shelf?"
    }

    const handleSave = () => {
        if (!name) return

        let coverUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
        if (selectedFile) {
            coverUrl = URL.createObjectURL(selectedFile)
        }

        if (isEditing && currentShelfId) {
            setShelvesList(shelvesList.map(shelf =>
                shelf.id === currentShelfId
                    ? { ...shelf, title: name, subtitle: desc || shelf.subtitle, cover: selectedFile ? coverUrl : shelf.cover }
                    : shelf
            ))
        } else {
            const newShelf = {
                id: new Date().getTime(),
                title: name,
                subtitle: desc || "New Shelf",
                books: 0,
                cover: coverUrl
            }
            setShelvesList([...shelvesList, newShelf])
        }

        resetForm()
    }

    const resetForm = () => {
        setOpen(false)
        setName("")
        setDesc("")
        setSelectedFile(null)
        setIsEditing(false)
        setCurrentShelfId(null)
    }

    const handleEdit = (e: React.MouseEvent, shelf: Shelf) => {
        e.preventDefault()
        e.stopPropagation()
        setName(shelf.title)
        setDesc(shelf.subtitle)
        setCurrentShelfId(shelf.id)
        setIsEditing(true)
        setOpen(true)
    }

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm(t.deleteConfirm)) {
            setShelvesList(shelvesList.filter(shelf => shelf.id !== id))
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{t.title}</h2>
                    <p className="text-muted-foreground">{t.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors rtl:left-auto rtl:right-2.5" />
                        <Input placeholder={t.searchPlaceholder} className="pl-9 w-[250px] bg-card border-border rtl:pl-3 rtl:pr-9 focus-visible:ring-primary" />
                    </div>
                    <Dialog open={open} onOpenChange={(val) => !val && resetForm()}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-sm transition-all h-10 px-6">
                                <Plus className="me-2 h-4 w-4" />
                                {t.addShelf}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                            <DialogHeader>
                                <DialogTitle className="text-foreground">{isEditing ? t.editTitle : t.addTitle}</DialogTitle>
                                <DialogDescription className="text-muted-foreground">{isEditing ? t.editDesc : t.addDesc}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-foreground">{t.nameLabel}</Label>
                                    <Input
                                        id="name"
                                        placeholder={t.namePlaceholder}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desc" className="text-foreground">{t.descLabel}</Label>
                                    <Input
                                        id="desc"
                                        placeholder={t.descPlaceholder}
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-foreground">{t.coverLabel}</Label>
                                    <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-all hover:border-primary/50 bg-background/50">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                                        />
                                        {selectedFile ? (
                                            <div className="flex flex-col items-center text-center">
                                                <span className="text-primary font-bold text-sm break-all">{selectedFile.name}</span>
                                                <span className="text-xs text-muted-foreground mt-1">{t.changeText}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 mb-2 opacity-50" />
                                                <span className="text-sm font-medium">{t.uploadText}</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">{isEditing ? t.saveBtn : t.createBtn}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shelvesList.map((shelf) => (
                    <Card key={shelf.id} className="overflow-hidden border-border/50 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 bg-card group rounded-2xl">
                        {/* Cover Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img
                                src={shelf.cover}
                                alt={shelf.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
                        </div>

                        <CardContent className="p-5 text-center">
                            <CardTitle className="text-lg font-bold mb-1 leading-tight text-foreground">{shelf.title}</CardTitle>
                            <p className="text-sm text-muted-foreground font-medium">{shelf.subtitle}</p>
                        </CardContent>

                        <CardFooter className="grid grid-cols-3 gap-3 p-4 pt-0">
                            <Button
                                variant="outline"
                                className="bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white border-rose-200/50 dark:border-rose-900/50 h-10 font-bold text-xs rounded-lg"
                                onClick={(e) => handleDelete(e, shelf.id)}
                            >
                                {t.delete}
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-200/50 dark:border-emerald-900/50 h-10 font-bold text-xs rounded-lg"
                                onClick={(e) => handleEdit(e, shelf)}
                            >
                                {t.edit}
                            </Button>
                            <Link href={`/knowledge/shelves/${shelf.id}`} className="w-full">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 font-bold text-xs rounded-lg shadow-sm">
                                    {t.viewDetails}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
