"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Receipt,
  FileCheck,
  Bell,
  Menu,
  X,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type MenuItem = {
  icon: LucideIcon
  label: string
  active?: boolean
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Applications" },
  { icon: CreditCard, label: "Billing" },
  { icon: Receipt, label: "Rate Card" },
  { icon: FileCheck, label: "Agreement Copy" },
  { icon: Bell, label: "Notices" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50",
          "fixed lg:relative h-full",
          isCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-16"
            : "translate-x-0 w-64"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "lg:justify-center"
            )}
          >
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-gray-900 dark:text-white">
                Axis MF
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                    item.active
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isCollapsed && "lg:justify-center lg:px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile menu toggle button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(false)}
        aria-label="Open sidebar"
        aria-expanded={!isCollapsed}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  )
}
