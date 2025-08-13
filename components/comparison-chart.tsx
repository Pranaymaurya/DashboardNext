"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ComparisonChartProps {
  data: Array<{
    category: string
    today: number
    yesterday: number
  }>
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{`${label}`}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Individual vs Non-Individual</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="category" className="text-muted-foreground" tick={{ fontSize: 12 }} />
            <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="today"
              fill="url(#todayGradient)"
              name="Today"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-90 transition-all duration-300"
            />
            <Bar
              dataKey="yesterday"
              fill="url(#yesterdayGradient)"
              name="Yesterday"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-90 transition-all duration-300"
            />
            <defs>
              <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="yesterdayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
