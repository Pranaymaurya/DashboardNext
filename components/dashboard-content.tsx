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
import { Calendar, Home } from "lucide-react"
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
        try {
          ;(window as any).__PDF_READY__ = true
          document.body.setAttribute('data-dashboard-loaded', 'true')
        } catch {}
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
      <div className="min-h-screen bg-gray-50 p-6" data-loading="true">
        {/* Loading State - PDF generation will wait until this disappears */}
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stats cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              {/* Chart skeleton */}
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              {/* Status cards skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={`status-skeleton-${i}`} className="h-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {/* Right column skeleton */}
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-dashboard-loaded="true">
      {/* Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-content="dashboard-main">
          {/* Left Column - Main Stats and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* KYC Stats Cards */}
            <div data-component="kyc-stats">
              <KYCStatsCards data={dashboardData.kycStats} />
            </div>

            {/* Comparison Chart */}
            <div data-component="comparison-chart">
              <ComparisonChart data={dashboardData.comparisonData} />
            </div>

            {/* KYC Status Cards */}
            <div data-component="status-cards">
              <KYCStatusCards data={dashboardData.statusCards} />
            </div>
          </div>

          {/* Right Column - Categories, Solicited Chart, PAN Stats */}
          <div className="space-y-6">
            <div data-component="categories">
              <CategoriesSection data={dashboardData.categoriesData} />
            </div>
            
            <div data-component="solicited-chart">
              <SolicitedChart data={dashboardData.solicitedData} />
            </div>
            
            {/* Uncomment when needed */}
            {/* <div data-component="pan-stats">
              <PANDataStats data={dashboardData.panDataStats} />
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}