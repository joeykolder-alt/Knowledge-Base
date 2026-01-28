"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Search, Bell } from "lucide-react"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"

export function Header() {
  const { setTheme, theme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  // Add safety check for Sidebar context, although it should be present.
  const { state } = useSidebar()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 transition-all duration-300">
        <div className="flex h-20 items-center justify-between px-8 bg-background/60 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/40">
          <div className="flex items-center gap-6">
            <SidebarTrigger className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all h-10 w-10 border border-transparent hover:border-primary/20 rounded-xl" />
          </div>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            <div className="w-full flex-1 md:w-auto md:flex-none hidden lg:block" />
            <nav className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-muted/50">
              <div className="h-10 w-10" />
              <div className="w-[1px] h-4 bg-muted-foreground/20 mx-1" />
              <div className="h-10 w-10" />
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-8 bg-background/60 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/40">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all h-10 w-10 border border-transparent hover:border-primary/20 rounded-xl" />

          {/* Show Logo here only when sidebar is collapsed */}
          {state === "collapsed" && (
            <div className="animate-in fade-in zoom-in duration-300">
              <Logo showText={false} className="py-0" />
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-6">
          <div className="w-full flex-1 md:w-auto md:flex-none hidden lg:block">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={language === 'ar' ? "ابحث عن أي شيء..." : "Search for anything..."}
                className="pl-11 rtl:pl-4 rtl:pr-11 h-11 w-[320px] bg-background/50 border-muted rounded-full focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
              <div className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-40 group-focus-within:opacity-0 transition-opacity">
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-muted/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm text-sm font-bold tracking-widest text-muted-foreground"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </Button>
            <div className="w-[1px] h-4 bg-muted-foreground/20 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm text-muted-foreground"
            >
              {mounted && theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-primary" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
