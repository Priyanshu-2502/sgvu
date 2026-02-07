"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, ThermometerSun, Waves, Users, MapPin } from "lucide-react"

type TimePoint = {
  date: string
  temperature: number
  risk_score: number
  lake_area: number
  population_at_risk: number
  alerts_count: number
}

function generateTimeSeriesData(days: number): TimePoint[] {
  const now = new Date()
  const out: TimePoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const idx = days - i
    const seasonalTemp = -5 + 10 * Math.sin((2 * Math.PI * idx) / 365) + (Math.random() * 6 - 3)
    const baseRisk = 5 + 2 * Math.sin((2 * Math.PI * idx) / 30) + (Math.random() * 3 - 1)
    const tempRiskImpact = Math.max(0, (seasonalTemp + 5) / 10)
    let riskScore = baseRisk + tempRiskImpact + (Math.random() * 2 - 1)
    riskScore = Math.max(1, Math.min(10, riskScore))
    out.push({
      date: d.toISOString().slice(0, 10),
      temperature: seasonalTemp,
      risk_score: riskScore,
      lake_area: 1000 + 200 * Math.sin((2 * Math.PI * idx) / 365) + (Math.random() * 100 - 50),
      population_at_risk: Math.floor(12000 + Math.random() * 6000),
      alerts_count: Math.max(0, Math.floor(riskScore - 5) + Math.floor(Math.random() * 6 - 2)),
    })
  }
  return out
}

export function AdvancedAnalytics() {
  const [analysisPeriod, setAnalysisPeriod] = useState("Last 90 Days")
  const [glacierRegion, setGlacierRegion] = useState("Global")
  const [metricFocus, setMetricFocus] = useState("Risk Score")

  const days = useMemo(() => {
    switch (analysisPeriod) {
      case "Last 30 Days":
        return 30
      case "Last 90 Days":
        return 90
      case "Last Year":
        return 365
      default:
        return 365
    }
  }, [analysisPeriod])

  const data = useMemo(() => generateTimeSeriesData(days), [days])

  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
  const pct = (n: number) => `${n.toFixed(1)}%`

  const predictionAccuracy = 85 + Math.random() * 10
  const responseTimeMin = 8 + Math.random() * 7
  const riskReductionPct = 15 + Math.random() * 10
  const systemUptimePct = 99.5 + Math.random() * 0.4
  const dataPointsPerDay = 250_000 + Math.floor(Math.random() * 50_000)

  const focusClass = (name: string) =>
    metricFocus === name ? "ring-2 ring-primary/60 shadow-md" : ""

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Advanced Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Comprehensive data analysis and predictive modeling for glacier risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Analysis Period</label>
            <Select value={analysisPeriod} onValueChange={setAnalysisPeriod}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                <SelectItem value="Last Year">Last Year</SelectItem>
                <SelectItem value="All Time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Region Focus</label>
            <Select value={glacierRegion} onValueChange={setGlacierRegion}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="Himalayas">Himalayas</SelectItem>
                <SelectItem value="Garhwal">Garhwal</SelectItem>
                <SelectItem value="Kumaon">Kumaon</SelectItem>
                <SelectItem value="Ladakh">Ladakh</SelectItem>
                <SelectItem value="Zanskar">Zanskar</SelectItem>
                <SelectItem value="Pir Panjal">Pir Panjal</SelectItem>
                <SelectItem value="Shivalik">Shivalik</SelectItem>
                <SelectItem value="Sikkim">Sikkim</SelectItem>
                <SelectItem value="Arunachal">Arunachal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Primary Metric</label>
            <Select value={metricFocus} onValueChange={setMetricFocus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Risk Score">Risk Score</SelectItem>
                <SelectItem value="Temperature">Temperature</SelectItem>
                <SelectItem value="Lake Area">Lake Area</SelectItem>
                <SelectItem value="Population Impact">Population Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-primary/30 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Prediction Accuracy</div>
              <div className="text-2xl font-bold text-primary">{pct(predictionAccuracy)}</div>
              <div className="text-xs text-muted-foreground">Δ {pct(Math.random() * 5 - 2)}</div>
            </CardContent>
          </Card>
          <Card className="border-secondary/30 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Avg Response Time</div>
              <div className="text-2xl font-bold text-secondary">{responseTimeMin.toFixed(1)}m</div>
              <div className="text-xs text-muted-foreground">Δ {(Math.random() * 3 - 1).toFixed(1)}m</div>
            </CardContent>
          </Card>
          <Card className="border-accent/30 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Risk Reduction</div>
              <div className="text-2xl font-bold text-accent">{pct(riskReductionPct)}</div>
              <div className="text-xs text-muted-foreground">Δ {pct(Math.random() * 4 + 1)}</div>
            </CardContent>
          </Card>
          <Card className="border-muted/30 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">System Uptime</div>
              <div className="text-2xl font-bold">{systemUptimePct.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Δ 0.1%</div>
            </CardContent>
          </Card>
          <Card className="border-muted/30 bg-white">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground">Data Points/Day</div>
              <div className="text-2xl font-bold">{dataPointsPerDay.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Δ {Math.floor(1000 + Math.random() * 4000).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Map */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Analytics Map (Himalayas)
            </CardTitle>
            <CardDescription>Interactive regional view for quick spatial insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 rounded-md overflow-hidden border">
              <iframe
                title="Analytics Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=79,26,92,31&amp;layer=mapnik"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Source: OpenStreetMap • Drag/scroll to explore</div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`${focusClass("Risk Score")} bg-white`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline" className="mr-2">{glacierRegion}</Badge>
                <TrendingUp className="w-4 h-4 text-destructive" /> Risk Score Trends
              </CardTitle>
              <CardDescription>Daily risk score over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis domain={[0, 10]} className="text-xs fill-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                            <div className="font-semibold text-foreground mb-1">{label}</div>
                            <div>Risk Score: {payload[0]?.value}</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="risk_score" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`${focusClass("Temperature")} bg-white`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-primary" /> Temperature Variations
              </CardTitle>
              <CardDescription>Daily temperature with seasonal pattern</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                            <div className="font-semibold text-foreground mb-1">{label}</div>
                            <div>Temperature: {Number(payload[0]?.value).toFixed(2)}°C</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="temperature" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`${focusClass("Lake Area")} bg-white`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-secondary" /> Lake Area Changes
              </CardTitle>
              <CardDescription>Simulated lake area variation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                            <div className="font-semibold text-foreground mb-1">{label}</div>
                            <div>Lake Area: {Number(payload[0]?.value).toFixed(0)} m²</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="lake_area" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`${focusClass("Population Impact")} bg-white`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" /> Population Risk Assessment
              </CardTitle>
              <CardDescription>Estimated population at risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                            <div className="font-semibold text-foreground mb-1">{label}</div>
                            <div>Population at Risk: {Number(payload[0]?.value).toLocaleString()}</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="population_at_risk" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}