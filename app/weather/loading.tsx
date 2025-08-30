import { Card, CardContent } from "@/components/ui/card"
import { Cloud } from "lucide-react"

export default function WeatherLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 bg-muted rounded w-64 mb-2 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse" />
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Cloud className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    </div>
  )
}
