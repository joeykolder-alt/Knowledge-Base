"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts"
import { useLanguage } from "@/components/providers"

const data = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 3200 },
    { name: "Mar", total: 2800 },
    { name: "Apr", total: 4500 },
    { name: "May", total: 3800 },
    { name: "Jun", total: 5200 },
]

const dataActivity = [
    { name: "Jan", val: 45 },
    { name: "Feb", val: 52 },
    { name: "Mar", val: 48 },
    { name: "Apr", val: 61 },
    { name: "May", val: 55 },
    { name: "Jun", val: 67 },
]

const dataUsers = [
    { name: "Jan", val: 7 },
    { name: "Feb", val: 10 },
    { name: "Mar", val: 12 },
    { name: "Apr", val: 14 },
    { name: "May", val: 16 },
    { name: "Jun", val: 18 },
]

const dataKPIEvolution = [
    { name: "Jan", val: 1.0 },
    { name: "Feb", val: 1.0 },
    { name: "Mar", val: 1.0 },
    { name: "Apr", val: 2.0 },
    { name: "May", val: 4.0 },
    { name: "Jun", val: 5.0 },
]

const dataExamEmployees = [
    { name: "Jan", val: 6 },
    { name: "Feb", val: 10 },
    { name: "Mar", val: 12 },
    { name: "Apr", val: 14 },
    { name: "May", val: 16 },
    { name: "Jun", val: 18 },
]

export function OverviewCharts() {
    const { language } = useLanguage()

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Books (Blue Gradient) */}
            <Card className="shadow-sm border border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground">{language === 'ar' ? "عدد الكتب" : "Books Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                            <Tooltip
                                cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBlue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 2: Shelves (Emerald Gradient) */}
            <Card className="shadow-sm border border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground">{language === 'ar' ? "عدد الرفوف" : "Shelves Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataActivity} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                            <Tooltip
                                cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fill="url(#colorEmerald)" dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 3: Registered Users (Blue-Royal Gradient) */}
            <Card className="shadow-sm border border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground">{language === 'ar' ? "عدد المستخدمين" : "Users Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataUsers} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRoyalBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                            <Tooltip
                                cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={3} fill="url(#colorRoyalBlue)" dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 4: KPI Evolution (Orange Gradient) */}
            <Card className="shadow-sm border border-border bg-card">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground">{language === 'ar' ? "تطور مؤشرات KPI" : "KPI Evolution"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataKPIEvolution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                            <Tooltip
                                cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={3} fill="url(#colorOrange)" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 5: Exam Employees (Cyan Gradient) */}
            <Card className="shadow-sm border border-border bg-card md:col-span-2 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground">{language === 'ar' ? "موظفو الامتحان (شهري)" : "Exam Employees (Monthly)"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dataExamEmployees} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/60" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                            <Tooltip
                                cursor={{ stroke: 'var(--border)', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                                labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={3} fill="url(#colorCyan)" dot={{ r: 4, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
