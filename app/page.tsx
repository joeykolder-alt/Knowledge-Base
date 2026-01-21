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
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-[900] tracking-tighter text-foreground">
            Dashboard
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground/60 font-medium text-sm">
            <span>نظرة عامة على أداء النظام</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>آخر تحديث: منذ ٥ دقائق</span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100 font-bold text-xs text-primary">
            <span>Last 30 Days</span>
          </div>
          <button className="p-2 hover:bg-white rounded-xl transition-colors text-muted-foreground">
            <Activity className="size-4" />
          </button>
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
