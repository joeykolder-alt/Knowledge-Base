"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
} from "lucide-react"

interface RichTextEditorProps extends React.HTMLAttributes<HTMLDivElement> {
    placeholder?: string
}

export function RichTextEditor({ className, placeholder, ...props }: RichTextEditorProps) {
    return (
        <div className={cn("border rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring", className)} {...props}>
            <div className="flex items-center gap-1 p-2 bg-muted/40 border-b">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Strikethrough className="h-4 w-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="h-4 w-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><List className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered className="h-4 w-4" /></Button>
                </div>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><LinkIcon className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon className="h-4 w-4" /></Button>
                </div>
            </div>
            <div
                className="p-4 min-h-[200px] outline-none prose prose-sm max-w-none dark:prose-invert"
                contentEditable
                suppressContentEditableWarning
            >
                <p className="text-muted-foreground/50">{placeholder || "Start writing..."}</p>
            </div>
        </div>
    )
}
