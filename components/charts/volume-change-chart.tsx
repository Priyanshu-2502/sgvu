"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const volumeData = [
  { lake: "Imja Lake", change: 15.2, status: "increase" },
  { lake: "Tsho Rolpa", change: 8.7, status: "increase" },
  { lake: "Thulagi Lake", change: -2.1, status: "decrease" },
  { lake: "Dig Tsho", change: 3.4, status: "increase" },
  { lake: "Raphstreng Tsho", change: 12.8, status: "increase" },
]

export function VolumeChangeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          DEM Volume Change
        </CardTitle>
        <CardDescription>Digital elevation model analysis showing water volume changes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={volumeData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs fill-muted-foreground" />
            <YAxis dataKey="lake" type="category" width={100} className="text-xs fill-muted-foreground" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Lake</span>
                          <span className="font-bold text-muted-foreground">{label}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Volume Change</span>
                          <span className={`font-bold ${value > 0 ? "text-destructive" : "text-secondary"}`}>
                            {value > 0 ? "+" : ""}
                            {value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="change" radius={[0, 4, 4, 0]}>
              {volumeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.change > 0 ? "#ef4444" : "#22c55e"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
