"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KYCStatsCards } from "@/components/kyc-stats-cards"
import { KYCStatusCards } from "@/components/kyc-status-cards"
import { ComparisonChart } from "@/components/comparison-chart"
import { CategoriesSection } from "@/components/categories-section"
import { SolicitedChart } from "@/components/solicited-chart"
import { PANDataStats } from "@/components/pan-data-stats"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import type { DashboardData } from "@/types/dashboard"

export function DashboardContent() {
  const [timeRange, setTimeRange] = useState("today")
  const [viewType, setViewType] = useState("individual")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 1, 1), // Feb 1, 2025
    to: new Date(2025, 1, 12), // Feb 12, 2025
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let url = `/api/dashboard?timeRange=${timeRange}&viewType=${viewType}`
        if (timeRange === "custom" && customDateRange?.from && customDateRange?.to) {
          url += `&fromDate=${customDateRange.from.toISOString()}&toDate=${customDateRange.to.toISOString()}`
        }
        const response = await fetch(url)
        const data: DashboardData = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, viewType, customDateRange])

  const handleCustomDateChange = (dateRange: DateRange | undefined) => {
    setCustomDateRange(dateRange)
    if (dateRange?.from && dateRange?.to) {
      setTimeRange("custom")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

        <div className="flex flex-wrap gap-2">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={viewType} onValueChange={setViewType}>
            <TabsList>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="non-individual">Non-Individual</TabsTrigger>
            </TabsList>
          </Tabs>

          {timeRange === "custom" ? (
            <DatePickerWithRange date={customDateRange} onDateChange={handleCustomDateChange} />
          ) : (
            <Button variant="outline" size="sm" disabled>
              <Calendar className="h-4 w-4 mr-2" />
              {timeRange === "today"
                ? "Today"
                : timeRange === "month"
                  ? format(new Date(), "MMM yyyy")
                  : "Select Range"}
            </Button>
          )}
        </div>
      </div>

      {dashboardData && (
        <>
          <KYCStatsCards data={dashboardData.kycStats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComparisonChart data={dashboardData.comparisonData} />
            <CategoriesSection data={dashboardData.categoriesData} />
          </div>

          <KYCStatusCards data={dashboardData.statusCards} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SolicitedChart data={dashboardData.solicitedData} />
            <PANDataStats data={dashboardData.panDataStats} />
          </div>
        </>
      )}
    </div>
  )
}
