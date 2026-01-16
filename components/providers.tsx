"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define props manually to avoid import issues
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

type Language = 'en' | 'ar'
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
    language: Language
    direction: Direction
    toggleLanguage: () => void
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = React.useState<Language>('en')
    const [isLoaded, setIsLoaded] = React.useState(false)

    const direction = language === 'ar' ? 'rtl' : 'ltr'

    React.useEffect(() => {
        const storedLang = localStorage.getItem('language') as Language
        if (storedLang) {
            setLanguage(storedLang)
        }
        setIsLoaded(true)
    }, [])

    React.useEffect(() => {
        if (!isLoaded) return
        document.documentElement.dir = direction
        document.documentElement.lang = language
        localStorage.setItem('language', language)
    }, [direction, language, isLoaded])

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en')
    }

    if (!isLoaded) {
        return null // or a loader
    }

    return (
        <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const context = React.useContext(LanguageContext)
    if (!context) throw new Error("useLanguage must be used within LanguageProvider")
    return context
}
