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
    ChevronDown,
    LogOut,
    MessageSquarePlus,
} from "lucide-react"

import { Logo } from "@/components/ui/logo"

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

    return (
        <Sidebar
            collapsible="offcanvas"
            side={isRtl ? "right" : "left"}
            variant="sidebar"
            className="border-sidebar-border bg-sidebar text-sidebar-foreground"
        >
            <SidebarHeader className="h-24 flex items-center justify-center px-6 border-b border-sidebar-border/50 bg-sidebar/50 backdrop-blur-md">
                <div className="flex items-center justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
                    <Logo />
                </div>
                <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center hidden">
                    <Logo showText={false} />
                </div>
            </SidebarHeader>

            <SidebarContent className="py-8 gap-6 px-2 no-scrollbar">
                {/* Overview Group */}
                <SidebarGroup className="px-4">
                    <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">{language === 'ar' ? "نظرة عامة" : "Overview"}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {data.overview.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={language === 'ar' ? item.titleAr : item.title}
                                        className={cn(
                                            "h-11 px-4 rounded-xl transition-all duration-300 relative group/btn",
                                            isActive(item.url)
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className={cn(
                                                "size-5 transition-all duration-300",
                                                isActive(item.url) ? "stroke-[2.5px] fill-primary/10" : "stroke-[1.5px]"
                                            )} />
                                            <span className="ms-3">{language === 'ar' ? item.titleAr : item.title}</span>
                                            <div className="sidebar-active-indicator" />
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
interface SidebarItem {
    title: string;
    titleAr: string;
    url?: string;
    icon?: React.ElementType;
    items?: SidebarItem[];
}

interface GroupProps {
    label: string;
    items: SidebarItem[];
    language: string;
    pathname: string;
    isRtl: boolean;
}

function CollapsibleSidebarGroup({ label, items, language, pathname, isRtl }: GroupProps) {
    const isActive = (url: string) => pathname === url; // Define isActive here for use in this component

    return (
        <SidebarGroup className="px-4 mb-2">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="gap-2">
                    {items.map((item) => {
                        // Check if any child is active
                        const isMainActive = item.items?.some((sub) => pathname.startsWith(sub.url || '')) ?? false

                        // If it has sub-items (Collapsible Menu)
                        if (item.items) {
                            return (
                                <CollapsibleMenu key={item.title} item={item} language={language} pathname={pathname} isMainActive={isMainActive} />
                            )
                        }

                        // Single Item (Fallback)
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.url || '')}
                                    tooltip={language === 'ar' ? item.titleAr : item.title}
                                    className={cn(
                                        "h-11 px-4 rounded-xl transition-all duration-300 relative group/btn",
                                        isActive(item.url || '')
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <Link href={item.url!}>
                                        {item.icon && <item.icon className={cn(
                                            "size-5 transition-all duration-300",
                                            isActive(item.url || '') ? "stroke-[2.5px] fill-primary/10" : "stroke-[1.5px]"
                                        )} />}
                                        <span className="ms-3">{language === 'ar' ? item.titleAr : item.title}</span>
                                        <div className="sidebar-active-indicator" />
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

interface CollapsibleMenuProps {
    item: SidebarItem;
    language: string;
    pathname: string;
    isMainActive: boolean;
}

function CollapsibleMenu({ item, language, pathname, isMainActive }: CollapsibleMenuProps) {
    const [isOpen, setIsOpen] = React.useState(isMainActive)

    return (
        <Collapsible defaultOpen={isMainActive} open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={language === 'ar' ? item.titleAr : item.title}
                        className={cn(
                            "h-11 px-4 rounded-xl transition-all duration-300 group/btn",
                            isMainActive
                                ? "bg-primary/5 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        {item.icon && <item.icon className={cn(
                            "size-5 transition-all duration-300",
                            isMainActive ? "stroke-[2.5px] fill-primary/10" : "stroke-[1.5px]"
                        )} />}
                        <span className="ms-3">{language === 'ar' ? item.titleAr : item.title}</span>
                        <ChevronDown className="ms-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 opacity-50" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="ms-9 ps-4 border-s border-muted/50 gap-1 mt-1">
                        {item.items?.map((sub) => {
                            const isSubActive = pathname === sub.url
                            return (
                                <SidebarMenuSubItem key={sub.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className={cn(
                                            "h-9 px-4 rounded-lg transition-all duration-200 relative group/sub",
                                            isSubActive
                                                ? "text-primary font-bold"
                                                : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/30"
                                        )}
                                    >
                                        <Link href={sub.url!}>
                                            <span className="text-[13px]">{language === 'ar' ? sub.titleAr : sub.title}</span>
                                            {isSubActive && <div className="absolute left-[-1.1rem] rtl:left-auto rtl:right-[-1.1rem] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />}
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
