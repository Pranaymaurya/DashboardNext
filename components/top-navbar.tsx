"use client"

import { Search, Bell, ChevronDown, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function TopNavbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <nav className="text-sm text-gray-600 dark:text-gray-400">
            Home / <span className="text-gray-900 dark:text-white">Dashboard</span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search applications..."
              className="pl-10 w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              try {
                setDownloading(true)
                const currentUrl = window.location.origin + window.location.pathname
                const res = await fetch('/api/pdf', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    url: currentUrl,
                    size: 'full',
                    style: 'original',
                    landscape: false,
                    scale: 1,
                    timeout: 120000,
                    delay: 300
                  })
                })
                if (!res.ok) {
                  const err = await res.json().catch(() => ({}))
                  throw new Error(err?.error || 'Failed to generate PDF')
                }
                const blob = await res.blob()
                const href = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = href
                a.download = `dashboard-${Date.now()}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(href)
              } catch (e) {
                const message = e instanceof Error ? e.message : 'PDF generation failed'
                // eslint-disable-next-line no-alert
                alert(message)
              } finally {
                setDownloading(false)
              }
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {downloading ? 'Generating…' : 'Download PDF'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-600 text-white">MK</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white">Madhu Kumar</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">May 18, 2024</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
