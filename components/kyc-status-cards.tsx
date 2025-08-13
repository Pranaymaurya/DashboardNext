import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Clock, CheckCircle, Shield, Pause, FileX,} from "lucide-react"

interface StatusCard {
  label: string
  count: number
  icon: string
  color: string
}

interface KYCStatusCardsProps {
  data: StatusCard[]
}

const iconMap = {
  "KYC Initiated": Rocket,
  "Under Process": Clock,
  Registered: CheckCircle,
  Validated: Shield,
  Hold: Pause,
  "Docs Pending": FileX,
}

const colorMap = {
  "KYC Initiated": "text-blue-600",
  "Under Process": "text-orange-600",
  Registered: "text-green-600",
  Validated: "text-emerald-600",
  Hold: "text-cyan-600",
  "Docs Pending": "text-red-600",
}

export function KYCStatusCards({ data }: KYCStatusCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.map((item, index) => {
        const Icon = iconMap[item.label as keyof typeof iconMap] || Rocket
        const colorClass = colorMap[item.label as keyof typeof colorMap] || "text-blue-600"

        return (
          <Card key={index} className="text-center">
            <CardContent className="p-4">
              <Icon className={`h-8 w-8 mx-auto mb-2 ${colorClass}`} />
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
