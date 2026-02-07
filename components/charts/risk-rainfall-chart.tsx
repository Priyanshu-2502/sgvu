"use client"

import { Scatter, ScatterChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

const correlationData = [
  { rainfall: 120, risk: 35, lake: "Dig Tsho" },
  { rainfall: 180, risk: 58, lake: "Thulagi Lake" },
  { rainfall: 220, risk: 67, lake: "Raphstreng Tsho" },
  { rainfall: 280, risk: 72, lake: "Tsho Rolpa" },
  { rainfall: 350, risk: 85, lake: "Imja Lake" },
  { rainfall: 160, risk: 42, lake: "Chorabari Lake" },
  { rainfall: 240, risk: 61, lake: "Satopanth Lake" },
  { rainfall: 300, risk: 78, lake: "Vasudhara Lake" },
]

export function RiskRainfallChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-secondary" />
          Risk vs Rainfall Correlation
        </CardTitle>
        <CardDescription>Relationship between precipitation levels and flood risk scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              dataKey="rainfall"
              name="Rainfall (mm)"
              className="text-xs fill-muted-foreground"
              domain={[100, 400]}
            />
            <YAxis
              type="number"
              dataKey="risk"
              name="Risk Score"
              className="text-xs fill-muted-foreground"
              domain={[30, 90]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="font-semibold text-foreground">{data.lake}</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Rainfall</span>
                            <span className="font-bold text-primary">{data.rainfall}mm</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Risk Score</span>
                            <span className="font-bold text-destructive">{data.risk}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Scatter dataKey="risk" fill="hsl(var(--secondary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
