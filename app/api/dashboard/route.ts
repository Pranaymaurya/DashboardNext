import { type NextRequest, NextResponse } from "next/server"

// Mock data generator
function generateMockData(timeRange: string, viewType: string, fromDate?: string, toDate?: string) {
  let baseMultiplier = 1

  if (timeRange === "custom" && fromDate && toDate) {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
    baseMultiplier = Math.max(daysDiff / 30, 0.1) // Scale based on date range
  } else if (timeRange === "month") {
    baseMultiplier = 30
  } else {
    baseMultiplier = 1
  }

  const typeMultiplier = viewType === "individual" ? 1.2 : 0.8

  return {
    kycStats: {
      totalKYCs: Math.floor(3456 * baseMultiplier * typeMultiplier),
      newKYC: {
        count: Math.floor(3000 * baseMultiplier * typeMultiplier),
        change: 12,
      },
      modifiedKYC: {
        count: Math.floor(456 * baseMultiplier * typeMultiplier),
        change: -8,
      },
    },
    comparisonData: [
      {
        category: "Individual",
        today: Math.floor(350 * typeMultiplier),
        yesterday: Math.floor(280 * typeMultiplier),
      },
      {
        category: "Non Individual",
        today: Math.floor(280 * typeMultiplier),
        yesterday: Math.floor(220 * typeMultiplier),
      },
    ],
    categoriesData: {
      individual: {
        ri: 85,
        nri: 65,
      },
      nonIndividual: {
        ri: 75,
        nri: 45,
      },
    },
    statusCards: [
      { label: "KYC Initiated", count: Math.floor(234 * typeMultiplier), icon: "rocket", color: "blue" },
      { label: "Under Process", count: Math.floor(45 * typeMultiplier), icon: "clock", color: "orange" },
      { label: "Registered", count: Math.floor(350 * typeMultiplier), icon: "check", color: "green" },
      { label: "Validated", count: Math.floor(654 * typeMultiplier), icon: "shield", color: "emerald" },
      { label: "Hold", count: Math.floor(269 * typeMultiplier), icon: "pause", color: "cyan" },
      { label: "Docs Pending", count: Math.floor(100 * typeMultiplier), icon: "file-x", color: "red" },
    ],
    solicitedData: {
      solicited: Math.floor(3456 * typeMultiplier),
      received: Math.floor(2800 * typeMultiplier),
      consumed: Math.floor(2200 * typeMultiplier),
      pending: Math.floor(600 * typeMultiplier),
    },
    panDataStats: {
      pansSolicited: {
        withImage: Math.floor(400 * typeMultiplier),
        withoutImage: Math.floor(250 * typeMultiplier),
        total: Math.floor(956 * typeMultiplier),
      },
      dataReceived: {
        withImage: Math.floor(300 * typeMultiplier),
        withoutImage: Math.floor(100 * typeMultiplier),
        total: Math.floor(320 * typeMultiplier),
      },
    },
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "today"
  const viewType = searchParams.get("viewType") || "individual"
  const fromDate = searchParams.get("fromDate")
  const toDate = searchParams.get("toDate")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const data = generateMockData(timeRange, viewType, fromDate || undefined, toDate || undefined)

  return NextResponse.json(data)
}
