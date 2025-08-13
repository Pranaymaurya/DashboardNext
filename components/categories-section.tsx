import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoriesSectionProps {
  data: {
    individual: { ri: number; nri: number }
    nonIndividual: { ri: number; nri: number }
  }
}

export function CategoriesSection({ data }: CategoriesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual</TabsTrigger>
            <TabsTrigger value="non-individual">Non Individual</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>RI</span>
                <span className="text-blue-600 dark:text-blue-400">{data.individual.ri}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${data.individual.ri}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>NRI</span>
                <span className="text-emerald-600 dark:text-emerald-400">{data.individual.nri}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
                  style={{ width: `${data.individual.nri}%` }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="non-individual" className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>RI</span>
                <span className="text-purple-600 dark:text-purple-400">{data.nonIndividual.ri}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${data.nonIndividual.ri}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>NRI</span>
                <span className="text-orange-600 dark:text-orange-400">{data.nonIndividual.nri}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
                  style={{ width: `${data.nonIndividual.nri}%` }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
