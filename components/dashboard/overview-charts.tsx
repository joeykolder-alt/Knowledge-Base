"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
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
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="grid gap-6 md:grid-cols-2 min-h-[400px]" />

    return (
        <div className="grid gap-6 md:grid-cols-2 min-w-0">
            {/* Chart 1: Books (Blue Gradient) */}
            <Card className="shadow-sm border bg-card rounded-[2rem]">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "عدد الكتب" : "Books Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] px-4 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid hsl(var(--border))', padding: '12px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 2: Shelves (Emerald Gradient) */}
            <Card className="shadow-sm border bg-card rounded-[2rem]">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "عدد الرفوف" : "Shelves Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] px-4 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid hsl(var(--border))', padding: '12px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 3: Registered Users (Blue-Royal Gradient) */}
            <Card className="shadow-sm border bg-card rounded-[2rem]">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "عدد المستخدمين" : "Users Count"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] px-4 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid hsl(var(--border))', padding: '12px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="val" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 4: KPI Evolution (Orange Gradient) */}
            <Card className="shadow-sm border bg-card rounded-[2rem]">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "تطور مؤشرات KPI" : "KPI Evolution"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] px-4 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataKPIEvolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid hsl(var(--border))', padding: '12px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="val" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* NEW Chart 5: Exam Employees (Monthly) */}
            <Card className="shadow-sm border bg-card rounded-[2rem] md:col-span-2">
                <CardHeader className="pt-8 px-8">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{language === 'ar' ? "موظفو الامتحان (شهري)" : "Exam Employees (Monthly)"}</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px] px-4 pb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataExamEmployees} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dy: 10 }} />
                            <YAxis stroke="currentColor" className="text-muted-foreground/40" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tick={{ dx: -10 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid hsl(var(--border))', padding: '12px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="val" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
