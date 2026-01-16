import { Metadata } from "next"
import { StatCard } from "@/components/dashboard/stat-card"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { Activity, Book, Users, FileQuestion } from "lucide-react"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Overview of system performance",
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="KPI Indicators"
                    value="98.5%"
                    trend="+2.5%"
                    trendUp={true}
                    description="from last month"
                    icon={Activity}
                />
                <StatCard
                    title="Exam Count"
                    value="1,240"
                    trend="+12%"
                    trendUp={true}
                    description="completed this month"
                    icon={FileQuestion}
                />
                <StatCard
                    title="Shelf Count"
                    value="48"
                    description="Across 12 categories"
                    icon={Book}
                />
                <StatCard
                    title="Active Users"
                    value="3,400"
                    trend="+5%"
                    trendUp={true}
                    description="active now"
                    icon={Users}
                />
            </div>

            <OverviewCharts />
        </div>
    )
}
