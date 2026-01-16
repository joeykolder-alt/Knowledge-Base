"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ReadHistoryTable } from "@/components/knowledge/read-history-table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Share2, Printer, Eye } from "lucide-react"

export default function ArticlePage() {
    const params = useParams()
    const { shelfId, bookId } = params

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href={`/knowledge/shelves/${shelfId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 group border border-transparent hover:border-primary/20 shadow-sm">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-tight">Back to Books</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Article
                    </Button>
                </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-slate dark:prose-invert max-w-none">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">Standard Operating Procedures</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Updated March 10, 2024</span>
                        <span>•</span>
                        <span>By Admin User</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 124 views</span>
                    </div>
                </div>

                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3>1. Introduction</h3>
                    <p>
                        This document outlines the standard operating procedures (SOP) for network maintenance and troubleshooting.
                        Adherence to these protocols is mandatory for all technical staff.
                    </p>

                    <h3>2. Incident Response</h3>
                    <p>
                        In the event of a critical failure, the following steps must be taken immediately:
                    </p>
                    <ul>
                        <li>Identify the affected node or segment.</li>
                        <li>Notify the shift supervisor via the escalation channel.</li>
                        <li>Initiate the failover protocol to backup systems.</li>
                    </ul>

                    <h3>3. Communication Protocols</h3>
                    <div className="bg-muted p-4 rounded-md my-4 border-l-4 border-primary">
                        <strong>Note:</strong> All communications with external vendors must be logged in the proper ticketing system.
                        Failure to do so constitutes a compliance violation.
                    </div>

                    <p>
                        Please refer to the <strong>Employee Handbook</strong> for more details on administrative policies.
                    </p>
                </div>
            </article>

            <Separator className="my-8" />

            {/* Read History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Read History</h2>
                        <p className="text-sm text-muted-foreground">Log of employees who have accessed this document.</p>
                    </div>
                    <Button variant="outline" size="sm">Export Log</Button>
                </div>

                <ReadHistoryTable />
            </div>
        </div>
    )
}
