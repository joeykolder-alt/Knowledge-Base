"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers"
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Award,
    BarChart3,
    FileEdit,
    Settings,
    Search,
    ChevronDown,
    LogOut,
    Sparkles,
    MessageSquarePlus,
    Library
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarRail,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

// --- Menu Data Structure ---
const data = {
    overview: [
        {
            title: "Dashboard",
            titleAr: "لوحة التحكم",
            url: "/",
            icon: LayoutDashboard,
        }
    ],
    knowledge: [
        {
            title: "Knowledge Base",
            titleAr: "قاعدة المعرفة",
            icon: BookOpen,
            items: [
                { title: "Shelves", titleAr: "الرفوف", url: "/knowledge/shelves" },
                { title: "News", titleAr: "الأخبار", url: "/knowledge/news" },
            ]
        }
    ],
    management: [
        {
            title: "Employees",
            titleAr: "الموظفين",
            icon: Users,
            items: [
                { title: "New Employee", titleAr: "موظف جديد", url: "/employees/new" },
                { title: "Employee Status", titleAr: "حالة الموظف", url: "/employees/status" },
            ]
        },
        {
            title: "Quality & Perf.",
            titleAr: "الجودة والأداء",
            icon: Award,
            items: [
                { title: "Daily Performance", titleAr: "الأداء اليومي", url: "/quality/daily" },
                { title: "Quality", titleAr: "الجودة", url: "/quality/main" },
                { title: "Top 3", titleAr: "أفضل 3", url: "/quality/top3" },
            ]
        },
        {
            title: "K.M KPIs",
            titleAr: "مؤشرات الأداء",
            icon: BarChart3,
            items: [
                { title: "KPI", titleAr: "المؤشرات", url: "/kpi/main" },
                { title: "KPI Reports", titleAr: "تقارير المؤشرات", url: "/kpi/reports" },
                { title: "TaskEM", titleAr: "المهام", url: "/kpi/taskem" },
                { title: "Requests Task", titleAr: "مهام الطلبات", url: "/kpi/requests-task" },
            ]
        }
    ],
    assessment: [
        {
            title: "Monthly Exams",
            titleAr: "الامتحانات الشهرية",
            icon: FileEdit,
            items: [
                { title: "Take Exam", titleAr: "إجراء الاختبار", url: "/exams/take" },
                { title: "Exam Result", titleAr: "نتائج الاختبار", url: "/exams/results" },
                { title: "Admin Exam", titleAr: "إدارة الامتحانات", url: "/exams/admin" },
                { title: "Exam Builder", titleAr: "بناء الامتحان", url: "/exams/builder" },
            ]
        }
    ],
    forms: [
        {
            title: "Forms",
            titleAr: "النماذج",
            icon: MessageSquarePlus,
            items: [
                { title: "Suggestions", titleAr: "صندوق الاقتراحات", url: "/form/suggestions" },
                { title: "Report Request", titleAr: "طلب تبليغ", url: "/form/report-request" }
            ]
        }
    ],
    system: [
        {
            title: "Settings",
            titleAr: "الإعدادات",
            icon: Settings,
            items: [
                { title: "Users", titleAr: "المستخدمين", url: "/settings/users" }
            ]
        }
    ]
}

export function AppSidebar() {
    const pathname = usePathname()
    const { language, direction } = useLanguage()
    const isRtl = direction === 'rtl'

    // Helper to check active state
    const isActive = (url: string) => pathname === url
    const isGroupActive = (items: { url: string }[]) => items.some(item => pathname.startsWith(item.url))

    return (
        <Sidebar
            collapsible="icon"
            side={isRtl ? "right" : "left"}
            variant="sidebar"
            className="border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
            <SidebarHeader className="h-24 flex items-center justify-between px-6 border-b border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md">
                <div className="flex items-center gap-4 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center justify-center size-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10 transition-transform hover:scale-105 duration-300">
                        <Library className="size-6 fill-white/20" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-black text-lg tracking-tighter text-foreground italic underline decoration-primary/50 underline-offset-4 decoration-2">Earthlink</span>
                        <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-70">
                            {language === 'ar' ? 'نولج بيس' : 'Knowledge Base'}
                        </span>
                    </div>
                </div>
                <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center hidden">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                        <Library className="size-5 fill-white/20" />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="py-8 gap-4 px-2">
                {/* Overview Group */}
                <SidebarGroup className="px-4">
                    <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400/80 mb-2">{language === 'ar' ? "نظرة عامة" : "Overview"}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {data.overview.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={language === 'ar' ? item.titleAr : item.title}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{language === 'ar' ? item.titleAr : item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Knowledge Center */}
                <CollapsibleSidebarGroup label={language === 'ar' ? "مركز المعرفة" : "Knowledge Center"} items={data.knowledge} language={language} pathname={pathname} isRtl={isRtl} />

                {/* Management Group */}
                <CollapsibleSidebarGroup label={language === 'ar' ? "الإدارة" : "Management"} items={data.management} language={language} pathname={pathname} isRtl={isRtl} />

                {/* Assessment Group */}
                <CollapsibleSidebarGroup label={language === 'ar' ? "التقييم" : "Assessment"} items={data.assessment} language={language} pathname={pathname} isRtl={isRtl} />

                {/* Forms Group */}
                <CollapsibleSidebarGroup label={language === 'ar' ? "النماذج" : "Forms"} items={data.forms} language={language} pathname={pathname} isRtl={isRtl} />

                {/* System Group */}
                <CollapsibleSidebarGroup label={language === 'ar' ? "النظام" : "System"} items={data.system} language={language} pathname={pathname} isRtl={isRtl} />

            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="h-16 px-4 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-muted/50 transition-all rounded-2xl group/user"
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 rounded-xl border-2 border-primary/20 group-hover/user:border-primary/50 transition-colors shadow-sm">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-bold">JD</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full" />
                                    </div>
                                    <div className="grid flex-1 text-start text-sm leading-tight ms-3">
                                        <span className="truncate font-bold text-foreground">John Doe</span>
                                        <span className="truncate text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Super Administrator</span>
                                    </div>
                                    <Settings className="ms-auto size-4 text-muted-foreground group-hover/user:rotate-90 transition-transform" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                                            <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">John Doe</span>
                                            <span className="truncate text-xs text-muted-foreground">admin@earthlink.iq</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Account Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

// Reusable Group Component for consistent layout
function CollapsibleSidebarGroup({ label, items, language, pathname, isRtl }: any) {
    const isActive = (url: string) => pathname === url; // Define isActive here for use in this component

    return (
        <SidebarGroup className="px-4">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                    {items.map((item: any) => {
                        // Check if any child is active
                        const isMainActive = item.items?.some((sub: any) => pathname.startsWith(sub.url))

                        // If it has sub-items (Collapsible Menu)
                        if (item.items) {
                            return (
                                <CollapsibleMenu key={item.title} item={item} language={language} pathname={pathname} isMainActive={isMainActive} isRtl={isRtl} />
                            )
                        }

                        // Single Item (Fallback)
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={language === 'ar' ? item.titleAr : item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{language === 'ar' ? item.titleAr : item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

// Collapsible Menu Item Component
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

function CollapsibleMenu({ item, language, pathname, isMainActive, isRtl }: any) {
    const [isOpen, setIsOpen] = React.useState(isMainActive)

    return (
        <Collapsible defaultOpen={isMainActive} open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={language === 'ar' ? item.titleAr : item.title}>
                        <item.icon />
                        <span>{language === 'ar' ? item.titleAr : item.title}</span>
                        <ChevronDown className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((sub: any) => {
                            const isSubActive = pathname === sub.url
                            return (
                                <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                                        <Link href={sub.url}>
                                            <span>{language === 'ar' ? sub.titleAr : sub.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

// Wrapper to export as Sidebar
export { AppSidebar as Sidebar }
