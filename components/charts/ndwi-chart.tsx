"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const ndwiData = [
  { month: "Jan", ndwi: 0.45, year: "2024" },
  { month: "Feb", ndwi: 0.48, year: "2024" },
  { month: "Mar", ndwi: 0.52, year: "2024" },
  { month: "Apr", ndwi: 0.58, year: "2024" },
  { month: "May", ndwi: 0.65, year: "2024" },
  { month: "Jun", ndwi: 0.72, year: "2024" },
  { month: "Jul", ndwi: 0.78, year: "2024" },
  { month: "Aug", ndwi: 0.75, year: "2024" },
  { month: "Sep", ndwi: 0.68, year: "2024" },
  { month: "Oct", ndwi: 0.62, year: "2024" },
  { month: "Nov", ndwi: 0.55, year: "2024" },
  { month: "Dec", ndwi: 0.48, year: "2024" },
]

export function NDWIChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          NDWI Time Series
        </CardTitle>
        <CardDescription>Normalized Difference Water Index trends showing lake growth patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ndwiData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
            <YAxis domain={[0.3, 0.8]} className="text-xs fill-muted-foreground" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                          <span className="font-bold text-muted-foreground">{label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">NDWI</span>
                          <span className="font-bold text-primary">{payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="ndwi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
