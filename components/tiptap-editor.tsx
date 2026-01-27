"use client"

import * as React from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import Youtube from "@tiptap/extension-youtube"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Highlight } from '@tiptap/extension-highlight'
import TextAlign from "@tiptap/extension-text-align"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import ImageResize from 'tiptap-extension-resize-image'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'
import { ResizableImageNodeView } from './tiptap/resizable-image-node-view'

// Define the custom extension
const ResizableImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => ({
                    width: attributes.width,
                }),
                parseHTML: (element) => element.getAttribute('width'),
            },
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageNodeView)
    },
})

import { all, createLowlight } from "lowlight"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Baseline, // Add Baseline
    Highlighter, // Add Highlighter
    Quote,
    Code,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Image as ImageIcon,
    Table as TableIcon,
    Youtube as YoutubeIcon,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
    Divide,
    Link as LinkIcon,
    Unlink
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Setup lowlight
const lowlight = createLowlight(all)

interface TiptapEditorProps {
    value: string
    onChange: (content: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const [youtubeUrl, setYoutubeUrl] = React.useState("")
    const [imageUrl, setImageUrl] = React.useState("")
    const [linkUrl, setLinkUrl] = React.useState("")
    const [openYoutube, setOpenYoutube] = React.useState(false)
    const [openImage, setOpenImage] = React.useState(false)
    const [openLink, setOpenLink] = React.useState(false)

    if (!editor) {
        return null
    }

    const addYoutubeVideo = () => {
        if (youtubeUrl) {
            editor.commands.setYoutubeVideo({ src: youtubeUrl })
            setYoutubeUrl("")
            setOpenYoutube(false)
        }
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl("")
            setOpenImage(false)
        }
    }

    const setLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl("")
            setOpenLink(false)
        }
    }

    const unsetLink = () => {
        editor.chain().focus().unsetLink().run()
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted text-primary")}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted text-primary")}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted text-primary")}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn("h-8 w-8", editor.isActive('strike') && "bg-muted text-primary")}
                    title="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                {/* Text Color */}
                <div className="relative inline-flex items-center justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.getAttributes('textStyle').color && "bg-muted text-primary")}
                        title="Text Color"
                    >
                        <Baseline className="h-4 w-4" style={{ color: editor.getAttributes('textStyle').color }} />
                    </Button>
                    <input
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                    />
                </div>

                {/* Highlight */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.commands.toggleHighlight && editor.commands.toggleHighlight()}
                    disabled={!editor.can().toggleHighlight()}
                    className={cn("h-8 w-8", editor.isActive('highlight') && "bg-muted text-primary")}
                    title="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 1 }) && "bg-muted text-primary")}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 2 }) && "bg-muted text-primary")}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={cn("h-8 w-8", editor.isActive('heading', { level: 3 }) && "bg-muted text-primary")}
                    title="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={cn("h-8 w-8", editor.isActive({ textAlign: 'left' }) && "bg-muted text-primary")}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={cn("h-8 w-8", editor.isActive({ textAlign: 'center' }) && "bg-muted text-primary")}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={cn("h-8 w-8", editor.isActive({ textAlign: 'right' }) && "bg-muted text-primary")}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={cn("h-8 w-8", editor.isActive({ textAlign: 'justify' }) && "bg-muted text-primary")}
                    title="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-muted text-primary")}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-muted text-primary")}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn("h-8 w-8", editor.isActive('blockquote') && "bg-muted text-primary")}
                    title="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={cn("h-8 w-8", editor.isActive('codeBlock') && "bg-muted text-primary")}
                    title="Code Block"
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                {/* Link Controls */}
                <Dialog open={openLink} onOpenChange={setOpenLink}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", editor.isActive('link') && "bg-muted text-primary")}
                            title="Add Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Link</DialogTitle>
                            <DialogDescription>Enter the URL for the link.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="link-url">Link URL</Label>
                            <Input
                                id="link-url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={setLink}>Set Link</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={unsetLink}
                    disabled={!editor.isActive('link')}
                    className="h-8 w-8"
                    title="Unlink"
                >
                    <Unlink className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-1">
                {/* Table Controls */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", editor.isActive('table') && "bg-muted text-primary")}
                            title="Table"
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                            Insert Table
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>
                            Add Column Before
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
                            Add Column After
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>
                            Delete Column
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>
                            Add Row Before
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
                            Add Row After
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>
                            Delete Row
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>
                            Delete Table
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Image Dialog */}
                <Dialog open={openImage} onOpenChange={setOpenImage}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Image">
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Image</DialogTitle>
                            <DialogDescription>Upload an image from your device or enter a URL.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="image-upload">Upload from Device</Label>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            const reader = new FileReader()
                                            reader.onload = (event) => {
                                                const result = event.target?.result as string
                                                if (result) {
                                                    editor.chain().focus().setImage({ src: result }).run()
                                                    setOpenImage(false)
                                                }
                                            }
                                            reader.readAsDataURL(file)
                                        }
                                    }}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or via URL</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                    id="image-url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={addImage} disabled={!imageUrl}>Add from URL</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Youtube Dialog */}
                <Dialog open={openYoutube} onOpenChange={setOpenYoutube}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Add YouTube Video">
                            <YoutubeIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add YouTube Video</DialogTitle>
                            <DialogDescription>Enter the URL of the YouTube video.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="youtube-url">Video URL</Label>
                            <Input
                                id="youtube-url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={addYoutubeVideo}>Add Video</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-1 ml-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

const TiptapEditor = ({ value, onChange, placeholder }: TiptapEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We use CodeBlockLowlight instead
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0',
            }),
            ResizableImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Youtube.configure({
                controls: true,
            }),
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
                dir: 'auto',
            },
        },
    })

    return (
        <div className="border rounded-xl overflow-hidden bg-background shadow-sm flex flex-col min-h-[500px]">
            <style jsx global>{`
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0;
                    overflow: hidden;
                }
                .ProseMirror td,
                .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #ced4da;
                    padding: 3px 5px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f1f3f5;
                }
                .ProseMirror img {
                    display: block;
                    height: auto;
                    cursor: pointer;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }
                .ProseMirror .image-resizer {
                    display: inline-flex;
                    position: relative;
                }
                .ProseMirror .image-resizer .resize-trigger {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 15px;
                    height: 15px;
                    border: 2px solid #3b82f6; 
                    border-left: transparent;
                    border-top: transparent;
                    cursor: nwse-resize;
                    opacity: 0; 
                    transition: opacity 0.2s ease;
                }
                .ProseMirror .image-resizer:hover .resize-trigger,
                .ProseMirror .image-resizer.ProseMirror-selectednode .resize-trigger {
                    opacity: 1;
                }
            `}</style>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="flex-1 overflow-y-auto cursor-text" />
        </div>
    )
}

export default TiptapEditor
