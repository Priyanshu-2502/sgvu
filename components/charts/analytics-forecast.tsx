"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ComposedChart,
  Area,
  Legend,
} from "recharts"

type ForecastPoint = {
  date: string
  predicted_risk: number
  confidence_upper: number
  confidence_lower: number
}

type PerfPoint = {
  date: string
  accuracy: number
  false_positive_rate: number
  false_negative_rate: number
}

function generateForecast(days: number): ForecastPoint[] {
  const now = new Date()
  const out: ForecastPoint[] = []
  const currentRisk = 6 + Math.random() * 2
  for (let i = 0; i <= days; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const trend = 0.02 * i
    const seasonal = 0.5 * Math.sin((2 * Math.PI * i) / 7)
    const noise = (Math.random() - 0.5) * 0.6
    let pred = currentRisk + trend + seasonal + noise
    pred = Math.max(1, Math.min(10, pred))
    const upper = Math.min(10, pred + (0.5 + Math.random()))
    const lower = Math.max(1, pred - (0.5 + Math.random()))
    out.push({
      date: d.toISOString().slice(0, 10),
      predicted_risk: pred,
      confidence_upper: upper,
      confidence_lower: lower,
    })
  }
  return out
}

function generatePerformance(days: number): PerfPoint[] {
  const now = new Date()
  const out: PerfPoint[] = []
  const baseAcc = 90
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const accuracy = baseAcc + (Math.random() - 0.5) * 10
    const fpr = 2 + Math.random() * 6
    const fnr = 1 + Math.random() * 5
    out.push({
      date: d.toISOString().slice(0, 10),
      accuracy,
      false_positive_rate: fpr,
      false_negative_rate: fnr,
    })
  }
  return out
}

export function AnalyticsForecast() {
  const forecast = useMemo(() => generateForecast(30), [])
  const perf = useMemo(() => generatePerformance(30), [])

  const [reportSuccess, setReportSuccess] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)
  const [refreshSuccess, setRefreshSuccess] = useState<string | null>(null)

  return (
    <>
      {/* Predictive Analytics & Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics & Forecasting</CardTitle>
          <CardDescription>30-day risk outlook and model performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold mb-2">30-Day Risk Forecast</div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={forecast}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis domain={[0, 10]} className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  {/* Approximate CI with upper/lower lines and shaded predicted area */}
                  <Line type="monotone" dataKey="confidence_upper" name="Confidence Upper" stroke="hsl(var(--secondary))" strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="confidence_lower" name="Confidence Lower" stroke="hsl(var(--secondary))" strokeDasharray="4 4" dot={false} />
                  <Area type="monotone" dataKey="predicted_risk" name="Predicted Risk (area)" fill="hsl(var(--destructive))" fillOpacity={0.15} stroke="none" />
                  <Line type="monotone" dataKey="predicted_risk" name="Predicted Risk" stroke="hsl(var(--destructive))" strokeWidth={2} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Model Performance Over Time</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={perf}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="hsl(var(--primary))" dot />
                  <Line type="monotone" dataKey="false_positive_rate" name="False Positive Rate (%)" stroke="hsl(var(--secondary))" dot />
                  <Line type="monotone" dataKey="false_negative_rate" name="False Negative Rate (%)" stroke="hsl(var(--destructive))" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Summary & Recommendations</CardTitle>
          <CardDescription>Highlights, findings, and actionable steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-semibold mb-2">Key Insights</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Temperature correlation: ~0.76 with risk scores</li>
                <li>Seasonal patterns: ~15% higher risk in summer</li>
                <li>Regional hotspots: Himalayas trending highest</li>
                <li>Prediction accuracy: ~92% for 7-day forecasts</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Critical Findings</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Risk trend: ~3.2% increase in average scores</li>
                <li>Alert frequency: ~12% more vs previous period</li>
                <li>Response efficiency: ~8% improvement</li>
                <li>Coverage gaps: 3 regions need monitoring</li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Recommendations</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Increase monitoring in high-risk regions</li>
                <li>Deploy additional sensors in gap areas</li>
                <li>Enhance models with weather integration</li>
                <li>Improve alerts for faster response</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Button onClick={() => setReportSuccess("Analytics report exported successfully!")} className="w-full">
                📊 Export Analytics Report
              </Button>
              {reportSuccess && (
                <div className="text-xs text-primary mt-2">{reportSuccess}</div>
              )}
            </div>
            <div>
              <Button onClick={() => setDownloadSuccess("Forecast data downloaded!")} className="w-full">
                📈 Download Forecast Data
              </Button>
              {downloadSuccess && (
                <div className="text-xs text-primary mt-2">{downloadSuccess}</div>
              )}
            </div>
            <div>
              <Button onClick={() => setRefreshSuccess("All data refreshed!")} variant="secondary" className="w-full">
                🔄 Refresh All Data
              </Button>
              {refreshSuccess && (
                <div className="text-xs text-primary mt-2">{refreshSuccess}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}