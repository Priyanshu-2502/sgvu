"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

const seasonalData = [
  { month: "Jan", avgRisk: 25, maxRisk: 45, minRisk: 15 },
  { month: "Feb", avgRisk: 28, maxRisk: 48, minRisk: 18 },
  { month: "Mar", avgRisk: 35, maxRisk: 55, minRisk: 22 },
  { month: "Apr", avgRisk: 42, maxRisk: 62, minRisk: 28 },
  { month: "May", avgRisk: 58, maxRisk: 78, minRisk: 38 },
  { month: "Jun", avgRisk: 72, maxRisk: 92, minRisk: 52 },
  { month: "Jul", avgRisk: 85, maxRisk: 95, minRisk: 65 },
  { month: "Aug", avgRisk: 78, maxRisk: 88, minRisk: 58 },
  { month: "Sep", avgRisk: 65, maxRisk: 75, minRisk: 45 },
  { month: "Oct", avgRisk: 48, maxRisk: 68, minRisk: 32 },
  { month: "Nov", avgRisk: 35, maxRisk: 55, minRisk: 25 },
  { month: "Dec", avgRisk: 28, maxRisk: 48, minRisk: 18 },
]

export function SeasonalTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Seasonal Risk Patterns
        </CardTitle>
        <CardDescription>Monthly risk trends showing seasonal variations in glacier flood danger</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
            <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <div className="font-semibold text-foreground mb-2">{label} Risk Levels</div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Min</span>
                          <span className="font-bold text-secondary">{payload[0]?.value}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Avg</span>
                          <span className="font-bold text-primary">{payload[1]?.value}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Max</span>
                          <span className="font-bold text-destructive">{payload[2]?.value}%</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="minRisk"
              stackId="1"
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="avgRisk"
              stackId="2"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="maxRisk"
              stackId="3"
              stroke="hsl(var(--destructive))"
              fill="hsl(var(--destructive))"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
