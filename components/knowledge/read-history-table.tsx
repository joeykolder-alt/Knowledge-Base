import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const employees = [
    { name: "Ahmed Ali", dept: "Network Ops", views: 5, date: "2024-03-10", initial: "AA", status: "Active" },
    { name: "Sarah Smith", dept: "Customer Support", views: 2, date: "2024-03-11", initial: "SS", status: "Pending" },
    { name: "M. Khalid", dept: "Engineering", views: 12, date: "2024-03-12", initial: "MK", status: "Active" },
    { name: "John Doe", dept: "Management", views: 1, date: "2024-03-12", initial: "JD", status: "Inactive" },
    { name: "Rana H.", dept: "HR", views: 3, date: "2024-03-09", initial: "RH", status: "Active" },
]

export function ReadHistoryTable() {
    return (
        <div className="rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700">
            <Table>
                <TableHeader>
                    <TableRow className="dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <TableHead className="w-[250px] text-slate-600 dark:text-slate-400">Employee</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Department</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-600 dark:text-slate-400">View Count</TableHead>
                        <TableHead className="text-right text-slate-600 dark:text-slate-400">Last Viewed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((emp, i) => (
                        <TableRow key={i} className="dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <TableCell className="font-medium text-slate-900 dark:text-slate-200">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs dark:bg-primary/20 dark:text-blue-300">{emp.initial}</AvatarFallback>
                                    </Avatar>
                                    <span>{emp.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-slate-400">{emp.dept}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn(
                                    "font-normal",
                                    emp.status === "Active" && "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
                                    emp.status === "Pending" && "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
                                    emp.status === "Inactive" && "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
                                )}>
                                    {emp.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <span className="text-slate-500 dark:text-slate-400">{emp.views} times</span>
                            </TableCell>
                            <TableCell className="text-right text-slate-500 dark:text-slate-400">{emp.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
