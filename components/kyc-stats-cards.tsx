import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KYCStatsProps {
  data: {
    totalKYCs: number
    newKYC: { count: number; change: number }
    modifiedKYC: { count: number; change: number }
  }
}

export function KYCStatsCards({ data }: KYCStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total KYCs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{data.totalKYCs.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Overall applications</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">New KYC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {data.newKYC.count.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 mt-1">
            <TrendingUp className="h-4 w-4 animate-pulse" />
            <span className="font-medium">+{data.newKYC.change}%</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">vs previous period</div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Modified KYC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{data.modifiedKYC.count}</div>
          <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 mt-1">
            <TrendingDown className="h-4 w-4 animate-pulse" />
            <span className="font-medium">{data.modifiedKYC.change}%</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{data.modifiedKYC.count} for KRA</div>
        </CardContent>
      </Card>
    </div>
  )
}
