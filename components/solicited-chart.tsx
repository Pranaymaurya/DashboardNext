"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"

interface SolicitedChartProps {
  data: {
    solicited: number
    received: number
    consumed: number
    pending: number
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Value: {data.value.toLocaleString()}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Percentage: {((data.value / data.payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

export function SolicitedChart({ data }: SolicitedChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const total = data.solicited + data.received + data.consumed + data.pending

  const chartData = [
    { name: "No of PANs Solicited", value: data.solicited, color: "#3B82F6", total }, // Bright Blue
    { name: "Received", value: data.received, color: "#10B981", total }, // Emerald Green
    { name: "Consumed", value: data.consumed, color: "#F59E0B", total }, // Amber Orange
    { name: "Pending", value: data.pending, color: "#EF4444", total }, // Red
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solicited & Unsolicited</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? "#ffffff" : "none"}
                  strokeWidth={activeIndex === index ? 3 : 0}
                  style={{
                    filter:
                      activeIndex === index
                        ? "brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
                        : "brightness(1)",
                    transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", fontWeight: "500" }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{total.toLocaleString()}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total PANs</div>
        </div>
      </CardContent>
    </Card>
  )
}
