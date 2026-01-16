import { Metadata } from "next"
import { StatCard } from "@/components/dashboard/stat-card"
import { OverviewCharts } from "@/components/dashboard/overview-charts"
import { Activity, Book, Users, FileQuestion } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of system performance",
}

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground">نظرة عامة على أداء النظام</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="KPI مؤشرات"
          value="12"
          description="ACTIVE TRACKING"
          icon={Activity}
          variant="purple"
          trend="12% from last month"
          trendUp={true}
        />
        <StatCard
          title="عدد الاختبار"
          value="4"
          description="ACTIVE EXAMS"
          icon={FileQuestion}
          variant="orange"
          trend="2 new this week"
          trendUp={true}
        />
        <StatCard
          title="عدد الرفوف"
          value="8"
          description="TOTAL SHELVES"
          icon={Book}
          variant="emerald"
          trend="Stable"
          trendUp={true}
        />
        <StatCard
          title="عدد المستخدمين"
          value="156"
          description="REGISTERED USERS"
          icon={Users}
          variant="blue"
          trend="8% growth"
          trendUp={true}
        />
      </div>

      <OverviewCharts />
    </div>
  )
}
