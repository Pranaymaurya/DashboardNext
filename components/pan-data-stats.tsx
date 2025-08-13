import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Database, TrendingUp, Image, ImageOff } from "lucide-react"

interface PANDataStatsProps {
  data: {
    pansSolicited: {
      withImage: number
      withoutImage: number
      total: number
    }
    dataReceived: {
      withImage: number
      withoutImage: number
      total: number
    }
  }
}

export function PANDataStats({ data }: PANDataStatsProps) {
  const completionRate = ((data.dataReceived.total / data.pansSolicited.total) * 100).toFixed(1)
  
  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANs Solicited Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 shadow-medium hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="block">PANs Solicited</span>
                <span className="text-sm font-normal text-muted-foreground">Total requests initiated</span>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {data.pansSolicited.total.toLocaleString()}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {/* <Database className="h-4 w-4 text-blue-500" /> */}
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {data.pansSolicited.withImage.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">KRA PANs</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Image className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-700 dark:text-green-300">
                  {data.pansSolicited.withoutImage.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">With Image</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <ImageOff className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {(data.pansSolicited.total - data.pansSolicited.withImage - data.pansSolicited.withoutImage).toLocaleString()}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Without Image</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Received Card */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500 shadow-medium hover:shadow-large transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <Database className="w-full h-full" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="block">Data Received</span>
                <span className="text-sm font-normal text-muted-foreground">Successfully processed</span>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {data.dataReceived.total.toLocaleString()}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Database className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {data.dataReceived.withImage.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">KRA PANs</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Image className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-xl font-bold text-green-700 dark:text-green-300">
                  {data.dataReceived.withoutImage.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">With Image</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <ImageOff className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {(data.dataReceived.total - data.dataReceived.withImage - data.dataReceived.withoutImage).toLocaleString()}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Without Image</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate Card */}
      <Card className="border-l-4 border-l-purple-500 shadow-medium">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Completion Rate</h3>
                <p className="text-sm text-muted-foreground">Data received vs solicited</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {completionRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                {data.dataReceived.total.toLocaleString()} of {data.pansSolicited.total.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(parseFloat(completionRate), 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {((data.pansSolicited.withImage / data.pansSolicited.total) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">KRA PANs Ratio</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {((data.dataReceived.withImage / data.dataReceived.total) * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">Success w/ Image</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {data.pansSolicited.total - data.dataReceived.total}
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((data.dataReceived.total / data.pansSolicited.total) * 100) >= 90 ? '🎯' : 
             Math.round((data.dataReceived.total / data.pansSolicited.total) * 100) >= 70 ? '📈' : '⚠️'}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Status</div>
        </div>
      </div>
    </div>
  )
}