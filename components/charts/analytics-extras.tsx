"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend,
} from "recharts"

type TimePoint = {
  date: string
  risk_score: number
  temperature: number
  lake_area: number
  population_at_risk: number
  alerts_count: number
}

function generateTimeSeries(days: number): TimePoint[] {
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
      risk_score: riskScore,
      temperature: seasonalTemp,
      lake_area: 1000 + 200 * Math.sin((2 * Math.PI * idx) / 365) + (Math.random() * 100 - 50),
      population_at_risk: Math.floor(12000 + Math.random() * 6000),
      alerts_count: Math.max(0, Math.floor(riskScore - 5) + Math.floor(Math.random() * 6 - 2)),
    })
  }
  return out
}

function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length)
  if (n === 0) return 0
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0
  let dx2 = 0
  let dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    num += dx * dy
    dx2 += dx * dx
    dy2 += dy * dy
  }
  const den = Math.sqrt(dx2 * dy2)
  if (!isFinite(den) || den === 0) return 0
  return num / den
}

function CorrelationMatrixTable({ data }: { data: TimePoint[] }) {
  const keys = ["risk_score", "temperature", "lake_area", "population_at_risk", "alerts_count"] as const
  const matrix = useMemo(() => {
    const cols: Record<string, number[]> = {}
    for (const k of keys) cols[k] = data.map((d) => d[k]) as number[]
    const out: number[][] = []
    for (let i = 0; i < keys.length; i++) {
      const row: number[] = []
      for (let j = 0; j < keys.length; j++) {
        const r = pearson(cols[keys[i]], cols[keys[j]])
        row.push(r)
      }
      out.push(row)
    }
    return out
  }, [data])

  const label = (k: (typeof keys)[number]) => {
    switch (k) {
      case "risk_score":
        return "Risk"
      case "temperature":
        return "Temp"
      case "lake_area":
        return "Lake Area"
      case "population_at_risk":
        return "Pop Risk"
      case "alerts_count":
        return "Alerts"
    }
  }

  const colorFor = (v: number) => {
    const clamped = Math.max(-1, Math.min(1, v))
    const hue = clamped > 0 ? 200 : 0 // blue for positive, red for negative
    const intensity = Math.round(Math.abs(clamped) * 70) + 20
    return `hsl(${hue}deg 80% ${100 - intensity}% / 0.8)`
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left">Var</th>
            {keys.map((k) => (
              <th key={k} className="p-2 text-left whitespace-nowrap">{label(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="p-2 font-medium whitespace-nowrap">{label(keys[i])}</td>
              {row.map((v, j) => (
                <td key={j} className="p-2 text-center" style={{ background: colorFor(v) }}>
                  {v.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AnalyticsExtras() {
  const ts = useMemo(() => generateTimeSeries(90), [])

  // Model metrics (Our vs Benchmark)
  const modelMetrics = [
    { Metric: "Accuracy", Our: 0.92, Benchmark: 0.85 },
    { Metric: "Precision", Our: 0.89, Benchmark: 0.80 },
    { Metric: "Recall", Our: 0.94, Benchmark: 0.85 },
    { Metric: "F1-Score", Our: 0.91, Benchmark: 0.82 },
    { Metric: "AUC-ROC", Our: 0.95, Benchmark: 0.88 },
  ]

  // Regional dataset
  const regional = [
    { Region: "Himalayas", Glaciers_Count: 85, Avg_Risk_Score: 7.2, High_Risk_Glaciers: 12, Population_Affected: 150000, Temperature_Change: 2.1, Economic_Impact_M: 450 },
    { Region: "Alps", Glaciers_Count: 45, Avg_Risk_Score: 5.8, High_Risk_Glaciers: 8, Population_Affected: 80000, Temperature_Change: 1.8, Economic_Impact_M: 200 },
    { Region: "Andes", Glaciers_Count: 62, Avg_Risk_Score: 6.4, High_Risk_Glaciers: 9, Population_Affected: 120000, Temperature_Change: 1.9, Economic_Impact_M: 380 },
    { Region: "Alaska", Glaciers_Count: 38, Avg_Risk_Score: 4.9, High_Risk_Glaciers: 4, Population_Affected: 25000, Temperature_Change: 2.3, Economic_Impact_M: 120 },
    { Region: "Rockies", Glaciers_Count: 25, Avg_Risk_Score: 5.1, High_Risk_Glaciers: 3, Population_Affected: 40000, Temperature_Change: 1.6, Economic_Impact_M: 180 },
    { Region: "Caucasus", Glaciers_Count: 15, Avg_Risk_Score: 6.8, High_Risk_Glaciers: 7, Population_Affected: 60000, Temperature_Change: 2.0, Economic_Impact_M: 250 },
    { Region: "Patagonia", Glaciers_Count: 20, Avg_Risk_Score: 5.9, High_Risk_Glaciers: 5, Population_Affected: 30000, Temperature_Change: 1.7, Economic_Impact_M: 160 },
  ]

  // Radar data for three regions
  const radarSubjects = [
    { subject: "Risk Score", Himalayas: 7.2, Alps: 5.8, Andes: 6.4 },
    { subject: "Temp Change", Himalayas: 2.1, Alps: 1.8, Andes: 1.9 },
    { subject: "Econ Impact", Himalayas: 4.5, Alps: 2.0, Andes: 3.8 }, // scaled
    { subject: "Pop Impact", Himalayas: 3.0, Alps: 1.6, Andes: 2.4 }, // scaled
  ]

  return (
    <>
      {/* Correlation + Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
          <CardDescription>Relationships between key variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CorrelationMatrixTable data={ts} />
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">AI Risk Prediction Model</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={modelMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="Metric" className="text-xs fill-muted-foreground" />
                  <YAxis domain={[0, 1]} className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Our" name="Our Model" fill="#22c55e" />
                  <Bar dataKey="Benchmark" name="Industry Benchmark" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Risk Assessment</CardTitle>
          <CardDescription>Comparative analysis across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" dataKey="Population_Affected" name="Population Affected" className="text-xs fill-muted-foreground" />
                  <YAxis type="number" dataKey="Avg_Risk_Score" name="Average Risk Score" domain={[0, 10]} className="text-xs fill-muted-foreground" />
                  <ZAxis type="number" dataKey="Economic_Impact_M" range={[100, 400]} name="Economic Impact (M)" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(val: any, name: string) => [val, name]} />
                  <Scatter name="Regions" data={regional} fill="hsl(var(--secondary))" />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-muted-foreground mt-2">Bubble size encodes economic impact (millions).</div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarSubjects}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Radar name="Himalayas" dataKey="Himalayas" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  <Radar name="Garhwal" dataKey="Alps" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
                  <Radar name="Ladakh" dataKey="Andes" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}