"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                month_caption: "flex justify-center pt-1 relative items-center h-7",
                caption_label: "hidden",
                nav: "space-x-1 flex items-center",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 z-10"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 z-10"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex",
                weekday:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
                week: "flex w-full mt-2",
                day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                range_end: "day-range-end",
                selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                today: "bg-accent text-accent-foreground font-bold underline decoration-2 underline-offset-4",
                outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                disabled: "text-muted-foreground opacity-50",
                range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                hidden: "invisible",
                dropdowns: "flex items-center justify-center gap-2",
                dropdown: "flex items-center",
                dropdown_month: "flex",
                dropdown_year: "flex",
                ...classNames,
            }}
            components={{
                Dropdown: ({ value, onChange, options, ...props }) => {
                    const selected = options?.find((option) => option.value === value)
                    const handleChange = (newValue: string) => {
                        const event = {
                            target: { value: newValue },
                        } as React.ChangeEvent<HTMLSelectElement>
                        onChange?.(event)
                    }
                    return (
                        <Select
                            value={value?.toString()}
                            onValueChange={(val) => handleChange(val)}
                        >
                            <SelectTrigger className="h-7 pr-2 pl-2 text-xs font-bold border-none bg-transparent hover:bg-muted/50 focus:ring-0 transition-colors w-fit gap-1 shadow-none">
                                <SelectValue>{selected?.label}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto min-w-[8rem] z-[120]">
                                {options?.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value.toString()}
                                        className="text-xs font-medium"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                },
            }}
            captionLayout="dropdown"
            startMonth={new Date(new Date().getFullYear() - 100, 0)}
            endMonth={new Date(new Date().getFullYear() + 20, 11)}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
