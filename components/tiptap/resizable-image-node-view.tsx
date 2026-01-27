"use client"

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import React, { useEffect, useRef, useState } from "react"

export const ResizableImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, selected } = props
    // Initial width from attributes or default to 100% or auto.
    // Storing in state for smooth resizing.
    const [width, setWidth] = useState(node.attrs.width || 'auto')

    // Update local state if node attribute changes externally (e.g. undo/redo)
    useEffect(() => {
        setWidth(node.attrs.width || 'auto')
    }, [node.attrs.width])

    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const startX = e.clientX
        const startWidth = imageRef.current ? imageRef.current.offsetWidth : 0

        const onMouseMove = (e: MouseEvent) => {
            const currentX = e.clientX
            const diff = currentX - startX
            const newWidth = startWidth + diff
            if (newWidth > 20) { // minimum width
                setWidth(`${newWidth}px`)
            }
        }

        const onMouseUp = (e: MouseEvent) => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            // Update the actual node attribute on mouse up
            // We calculate the final width based on the current state or ref
            if (imageRef.current) {
                updateAttributes({ width: `${imageRef.current.offsetWidth}px` })
            }
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    return (
        <NodeViewWrapper className="relative inline-block leading-none select-none max-w-full">
            <div ref={containerRef} className={`relative inline-block ${selected ? 'ring-2 ring-primary rounded-sm' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt}
                    title={node.attrs.title}
                    style={{ width: width, height: 'auto', display: 'block', maxWidth: '100%' }}
                    className="transition-[width] duration-0 ease-linear" // Remove transition during resize for performance
                />

                {/* Resize Handle */}
                <div
                    className="absolute right-0 bottom-0 w-3 h-3 bg-primary border-2 border-white cursor-nwse-resize rounded-tl-sm shadow-sm z-10"
                    onMouseDown={onMouseDown}
                    style={{ touchAction: 'none' }}
                />
            </div>
        </NodeViewWrapper>
    )
}
