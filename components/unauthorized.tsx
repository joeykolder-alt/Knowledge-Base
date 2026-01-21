import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

export function Unauthorized() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <Lock className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">403 Unauthorized</h1>
            <p className="max-w-[500px] text-muted-foreground text-lg">
                Sorry, you don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <div className="flex gap-4 pt-4">
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
                <Button variant="outline">Contact Support</Button>
            </div>
        </div>
    )
}
