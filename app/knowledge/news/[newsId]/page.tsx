"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ReadHistoryTable } from "@/components/knowledge/read-history-table"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"

export default function NewsDetailPage() {
    const params = useParams()
    // Mock lookups based on ID

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="space-y-4">
                <Link href="/knowledge/news" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to News
                </Link>

                <div className="space-y-2">
                    <div className="flex gap-2 mb-4">
                        <Badge>Technical</Badge>
                        <Badge variant="outline">Important</Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">New Network Infrastructure Upgrade Phase 1</h1>

                    <div className="flex items-center gap-6 text-muted-foreground text-sm pt-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>CTO Office</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>March 12, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>8 min read</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="aspect-video bg-muted rounded-xl w-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border">
                <span className="text-lg font-medium">Feature Image Placeholder</span>
            </div>

            <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <p className="lead">
                    We are excited to announce the commencement of the Phase 1 upgrades for our core network infrastructure.
                    This project aims to increase capacity by 300% and reduce latency for our fiber customers.
                </p>
                <p>
                    The upgrade process will begin on Monday, March 18th, and will continue for two weeks.
                    During this time, some maintenance windows will be scheduled during off-peak hours (3:00 AM - 5:00 AM).
                </p>
                <h3>What this means for employees:</h3>
                <ul>
                    <li>Support staff should be aware of potential alerts during the maintenance window.</li>
                    <li>Sales teams can start promoting the new speed tiers starting in April.</li>
                </ul>
            </article>

            <Separator className="my-8" />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Interaction Log</h2>
                <ReadHistoryTable />
            </div>
        </div>
    )
}
