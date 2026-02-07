"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, MapPin, Calendar, Filter, Download, RefreshCw, MapIcon, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/protected-route"
import { NDWIChart } from "@/components/charts/ndwi-chart"
import { RiskRainfallChart } from "@/components/charts/risk-rainfall-chart"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts"
import LiveLocationAlert from "@/components/live-location-alert"

// Mock data for demonstration
const mockLakeData = [
  {
    id: 1,
    name: "Imja Lake",
    state: "Sikkim",
    riskScore: 85,
    alertLevel: "Critical",
    lat: 27.9,
    lng: 86.9,
    lastUpdate: "2024-01-15",
    area: "1.2 km²",
    ndwi: 0.78,
  },
  {
    id: 2,
    name: "Tsho Rolpa",
    state: "Himachal Pradesh",
    riskScore: 72,
    alertLevel: "High",
    lat: 28.4,
    lng: 86.5,
    lastUpdate: "2024-01-15",
    area: "1.65 km²",
    ndwi: 0.65,
  },
  {
    id: 3,
    name: "Thulagi Lake",
    state: "Uttarakhand",
    riskScore: 58,
    alertLevel: "Medium",
    lat: 28.7,
    lng: 84.2,
    lastUpdate: "2024-01-14",
    area: "0.8 km²",
    ndwi: 0.52,
  },
  {
    id: 4,
    name: "Dig Tsho",
    state: "Arunachal Pradesh",
    riskScore: 34,
    alertLevel: "Low",
    lat: 28.1,
    lng: 85.8,
    lastUpdate: "2024-01-14",
    area: "0.45 km²",
    ndwi: 0.38,
  },
  {
    id: 5,
    name: "Raphstreng Tsho",
    state: "Sikkim",
    riskScore: 67,
    alertLevel: "High",
    lat: 27.8,
    lng: 88.2,
    lastUpdate: "2024-01-15",
    area: "0.92 km²",
    ndwi: 0.61,
  },
]

const mockForecastData = [
  { month: "Jan", ndwi: 0.45, risk: 35 },
  { month: "Feb", ndwi: 0.48, risk: 38 },
  { month: "Mar", ndwi: 0.52, risk: 42 },
  { month: "Apr", ndwi: 0.58, risk: 48 },
  { month: "May", ndwi: 0.65, risk: 55 },
  { month: "Jun", ndwi: 0.72, risk: 62 },
  { month: "Jul", ndwi: 0.78, risk: 68 },
  { month: "Aug", ndwi: 0.75, risk: 65 },
  { month: "Sep", ndwi: 0.68, risk: 58 },
  { month: "Oct", ndwi: 0.62, risk: 52 },
  { month: "Nov", ndwi: 0.55, risk: 45 },
  { month: "Dec", ndwi: 0.48, risk: 40 },
]

function getAlertColor(level: string) {
  switch (level) {
    case "Critical":
      return "bg-red-500"
    case "High":
      return "bg-orange-500"
    case "Medium":
      return "bg-yellow-500"
    case "Low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

function getAlertBadgeVariant(level: string) {
  switch (level) {
    case "Critical":
      return "destructive"
    case "High":
      return "destructive"
    case "Medium":
      return "secondary"
    case "Low":
      return "secondary"
    default:
      return "secondary"
  }
}

// Hex color mapping for charts (red, orange, yellow, green)
function getAlertColorHex(level: string) {
  switch (level) {
    case "Critical":
      return "#ef4444" // red
    case "High":
      return "#f59e0b" // orange
    case "Medium":
      return "#eab308" // yellow
    case "Low":
      return "#22c55e" // green
    default:
      return "#6b7280" // gray
  }
}

export default function AlertsPage() {
  const { isAuthenticated, loading } = useAuth()
  const [selectedLake, setSelectedLake] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Streamlit-like controls and data
  type AlertRow = {
    id: string
    name: string
    latitude: number
    longitude: number
    region: string
    risk_score: number
    temperature: number
    alert_level: "Critical" | "High" | "Medium" | "Low"
    last_updated: string
    lake_id?: string
  }

  const [autoRefresh, setAutoRefresh] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<string[]>(["Critical", "High", "Medium", "Low"])
  const [timeRange, setTimeRange] = useState("Last 24 Hours")
  const [alerts, setAlerts] = useState<AlertRow[]>([])

  // Load alerts from CSV under public/outputs/alerts_data.csv
  useEffect(() => {
    let cancelled = false

    const parseCsv = (text: string) => {
      const lines = text.trim().split(/\r?\n/)
      if (lines.length <= 1) return [] as AlertRow[]
      const headers = lines[0].split(",").map((h) => h.replace(/^\"|\"$/g, ""))
      const body = lines.slice(1)
      const rows = body.map((l) => l.split(",").map((c) => c.replace(/^\"|\"$/g, "")))
      const mapped: AlertRow[] = rows.map((r) => {
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => (obj[h] = r[i] ?? ""))
        return {
          id: obj.id,
          name: obj.name,
          latitude: parseFloat(obj.latitude),
          longitude: parseFloat(obj.longitude),
          region: obj.region,
          risk_score: parseFloat(obj.risk_score),
          temperature: parseFloat(obj.temperature),
          alert_level: (obj.alert_level as AlertRow["alert_level"]) || "Low",
          last_updated: obj.last_updated,
          lake_id: obj.lake_id,
        }
      })
      return mapped
    }

    const load = async () => {
      try {
        const res = await fetch("/outputs/alerts_data.csv", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load alerts_data.csv: ${res.status}`)
        const text = await res.text()
        const parsed = parseCsv(text)
        if (!cancelled) {
          setAlerts(parsed)
          setLastUpdated(new Date())
        }
      } catch (e) {
        // fail silently; show placeholder if missing
      }
    }

    load()
    let timer: any
    if (autoRefresh) {
      timer = setInterval(load, 15000)
    }
    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [autoRefresh])

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => severityFilter.includes(a.alert_level))
  }, [alerts, severityFilter])

  const counts = useMemo(() => {
    const byLevel: Record<AlertRow["alert_level"], number> = { Critical: 0, High: 0, Medium: 0, Low: 0 }
    for (const a of alerts) {
      byLevel[a.alert_level] = (byLevel[a.alert_level] || 0) + 1
    }
    return byLevel
  }, [alerts])

  const distributionData = useMemo(() => [
    { name: "Critical", value: counts.Critical, color: getAlertColorHex("Critical") },
    { name: "High", value: counts.High, color: getAlertColorHex("High") },
    { name: "Medium", value: counts.Medium, color: getAlertColorHex("Medium") },
    { name: "Low", value: counts.Low, color: getAlertColorHex("Low") },
  ], [counts])

  const responseTimeData = useMemo(() => [
    { Alert_Type: "Critical", Avg_Response_Time: Math.round((Math.random() * (15 - 5) + 5) * 10) / 10 },
    { Alert_Type: "High", Avg_Response_Time: Math.round((Math.random() * (45 - 15) + 15) * 10) / 10 },
    { Alert_Type: "Medium", Avg_Response_Time: Math.round((Math.random() * (120 - 45) + 45) * 10) / 10 },
    { Alert_Type: "Low", Avg_Response_Time: Math.round((Math.random() * (360 - 120) + 120) * 10) / 10 },
  ], [alerts.length, lastUpdated])

  const handleRefresh = () => {
    setLastUpdated(new Date())
    // In a real app, this would trigger data refresh
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="flex-1">

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-card to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-playfair)]">
                  Glacier Flood Alerts
                </h1>
                <p className="text-lg text-muted-foreground">
                  Real-time monitoring and risk assessment of glacial lakes across the Himalayas
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LiveLocationAlert />
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-red-700">Critical</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-orange-700">High Risk</div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">8</div>
                  <div className="text-sm text-yellow-700">Medium Risk</div>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-sm text-green-700">Low Risk</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
            {/* Integrated Alerts management sections */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Live Alert Summary
                </CardTitle>
                <CardDescription>Real-time alerts and notification management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Critical</div>
                    <div className="text-2xl font-bold">{counts.Critical}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">High</div>
                    <div className="text-2xl font-bold">{counts.High}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Medium</div>
                    <div className="text-2xl font-bold">{counts.Medium}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Total Active</div>
                    <div className="text-2xl font-bold">{alerts.length}</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    {(["Critical", "High", "Medium", "Low"] as const).map((level) => (
                      <label key={level} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={severityFilter.includes(level)}
                          onCheckedChange={(v) => {
                            setSeverityFilter((prev) => {
                              const checked = Boolean(v)
                              if (checked) return Array.from(new Set([...prev, level]))
                              return prev.filter((x) => x !== level)
                            })
                          }}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Time Range</span>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Last Hour">Last Hour</SelectItem>
                        <SelectItem value="Last 6 Hours">Last 6 Hours</SelectItem>
                        <SelectItem value="Last 24 Hours">Last 24 Hours</SelectItem>
                        <SelectItem value="Last Week">Last Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
          <Switch checked={autoRefresh} onCheckedChange={(v) => setAutoRefresh(Boolean(v))} />
          <span className="text-sm">Auto-refresh (15s)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Filtered by selected alert levels</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredAlerts.length > 0 ? (
                  <Accordion type="multiple" className="space-y-3">
                    {filteredAlerts.map((alert) => (
                      <AccordionItem key={alert.id} value={alert.id} className="border rounded-md">
                        <AccordionTrigger className="px-4 py-2">
                          {alert.alert_level} - {alert.name} (Risk: {alert.risk_score.toFixed(1)})
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Risk Score</div>
                              <div className="text-lg font-semibold">{alert.risk_score.toFixed(1)}/10</div>
                              <div className="text-sm text-muted-foreground mt-2">Location</div>
                              <div className="text-sm">{alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Alert Level</div>
                              <div className="text-lg font-semibold">{alert.alert_level}</div>
                              <div className="text-sm text-muted-foreground mt-2">Last Updated</div>
                              <div className="text-sm">{alert.last_updated}</div>
                            </div>
                            <div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Acknowledge</Button>
                                <Button variant="secondary" size="sm">View Details</Button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="text-sm font-semibold">Risk Assessment</div>
                            {alert.risk_score >= 8 ? (
                              <Alert variant="destructive" className="mt-2">
                                <AlertTitle>Immediate Action Required</AlertTitle>
                                <AlertDescription>
                                  Immediate evacuation may be required. Deploy emergency response teams.
                                </AlertDescription>
                              </Alert>
                            ) : alert.risk_score >= 6 ? (
                              <Alert className="mt-2">
                                <AlertTitle>Enhanced Monitoring</AlertTitle>
                                <AlertDescription>
                                  Prepare contingency measures and increase monitoring frequency.
                                </AlertDescription>
                              </Alert>
                            ) : alert.risk_score >= 4 ? (
                              <Alert className="mt-2">
                                <AlertTitle>Routine Monitoring</AlertTitle>
                                <AlertDescription>
                                  Continue routine monitoring with slight increase in frequency.
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <Alert className="mt-2">
                                <AlertTitle>Normal Conditions</AlertTitle>
                                <AlertDescription>
                                  Systems operating normally with standard monitoring protocols.
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : alerts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No data loaded. Place alerts_data.csv under public/outputs/.</div>
                ) : (
                  <div className="text-sm">No alerts match the current filter criteria.</div>
                )}
              </CardContent>
            </Card>

            {/* Distribution & Response Time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Current Alert Distribution</CardTitle>
                  <CardDescription>Share of alerts by level</CardDescription>
                </CardHeader>
                <CardContent>
                  {alerts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                          {distributionData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-sm text-muted-foreground">No current alerts to display distribution.</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Response Times (minutes)</CardTitle>
                  <CardDescription>Demo ranges by alert type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Alert_Type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Avg_Response_Time">
                        {responseTimeData.map((entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={getAlertColorHex(entry.Alert_Type)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Response Protocols */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Emergency Response Protocols</CardTitle>
                <CardDescription>Standard operating procedures by alert level</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="space-y-3">
                  <AccordionItem value="critical" className="border rounded-md">
                    <AccordionTrigger className="px-4 py-2">🔴 Critical Alert Protocol</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold">Immediate Actions Required:</div>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Alert emergency response teams within 5 minutes</li>
                          <li>Initiate evacuation procedures for high-risk areas</li>
                          <li>Coordinate with local authorities and rescue services</li>
                          <li>Deploy monitoring equipment for real-time updates</li>
                          <li>Establish communication channels with affected communities</li>
                        </ol>
                        <div className="font-semibold mt-3">Contact Information:</div>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Emergency Coordinator: +1-800-GLACIER</li>
                          <li>Local Authorities: Contact local emergency services</li>
                          <li>Media Relations: communications@glacierwatch.pro</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="high" className="border rounded-md">
                    <AccordionTrigger className="px-4 py-2">🟠 High Alert Protocol</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold">Enhanced Monitoring Actions:</div>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Increase monitoring frequency to every 30 minutes</li>
                          <li>Notify emergency response teams within 30 minutes</li>
                          <li>Prepare evacuation plans and equipment</li>
                          <li>Issue public advisories through official channels</li>
                          <li>Coordinate with meteorological services</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="medium" className="border rounded-md">
                    <AccordionTrigger className="px-4 py-2">🟡 Medium Alert Protocol</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold">Standard Response Actions:</div>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Monitor situation every 2 hours</li>
                          <li>Inform local authorities within 2 hours</li>
                          <li>Update public information systems</li>
                          <li>Review and test emergency equipment</li>
                          <li>Brief response teams on current conditions</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 text-sm">
                  <strong>🔄 System Status:</strong> Online | <strong>Last Updated:</strong> {lastUpdated.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>

            {/* Historical Alert Trends */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Historical Alert Trends
                </CardTitle>
                <CardDescription>Daily counts by alert level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={(() => {
                      const byDate: Record<string, { Critical: number; High: number; Medium: number; Low: number }> = {}
                      for (const a of alerts) {
                        const d = (a.last_updated || "").split(" ")[0]
                        if (!byDate[d]) byDate[d] = { Critical: 0, High: 0, Medium: 0, Low: 0 }
                        // @ts-ignore
                        byDate[d][a.alert_level]++
                      }
                      return Object.entries(byDate)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([date, vals]) => ({ date, ...vals }))
                    })()}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Critical" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="High" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Medium" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Low" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Tabs defaultValue="current" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Location Alert</TabsTrigger>
              <TabsTrigger value="india">All India Map Alert</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            {/* Current Location Alert Tab */}
            <TabsContent value="current" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Nearby Glacial Lakes
                  </CardTitle>
                  <CardDescription>Glacial lakes within 100km of your current location (approximate)</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Mock Map Container */}
                  <div className="w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">
                        Showing glacial lakes near your location with risk indicators
                      </p>
                    </div>
                  </div>

                  {/* Nearby Lakes List */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Lakes in Your Area</h4>
                    {mockLakeData.slice(0, 3).map((lake) => (
                      <Card
                        key={lake.id}
                        className="border-l-4"
                        style={{ borderLeftColor: getAlertColor(lake.alertLevel).replace("bg-", "#") }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-foreground">{lake.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                {lake.state} • {lake.area}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={getAlertBadgeVariant(lake.alertLevel)} className="mb-2">
                                {lake.alertLevel}
                              </Badge>
                              <p className="text-sm text-muted-foreground">Risk: {lake.riskScore}%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* All India Map Alert Tab */}
            <TabsContent value="india" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-primary" />
                        All India Glacial Lake Monitoring
                      </CardTitle>
                      <CardDescription>Comprehensive view of all monitored glacial lakes across India</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock India Map */}
                  <div className="w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive India Map</p>
                      <p className="text-sm text-muted-foreground">
                        Risk polygons: Green (Low), Yellow (Medium), Orange (High), Red (Critical)
                      </p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">Low Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm">Medium Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-sm">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">Critical Risk</span>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Lake Name</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead>Risk Score</TableHead>
                          <TableHead>Alert Level</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>NDWI</TableHead>
                          <TableHead>Last Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockLakeData.map((lake) => (
                          <TableRow key={lake.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{lake.name}</TableCell>
                            <TableCell>{lake.state}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getAlertColor(lake.alertLevel).replace("bg-", "#") }}
                                ></div>
                                {lake.riskScore}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getAlertBadgeVariant(lake.alertLevel)}>{lake.alertLevel}</Badge>
                            </TableCell>
                            <TableCell>{lake.area}</TableCell>
                            <TableCell>{lake.ndwi}</TableCell>
                            <TableCell>{lake.lastUpdate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <NDWIChart />
                <RiskRainfallChart />
              </div>

              {/* Forecast Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Monthly Forecast Summary
                  </CardTitle>
                  <CardDescription>Key metrics and predictions for the next 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-destructive mb-2">High</div>
                      <div className="text-sm text-muted-foreground">Peak Risk Period</div>
                      <div className="text-sm text-muted-foreground">June - August</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">0.78</div>
                      <div className="text-sm text-muted-foreground">Peak NDWI</div>
                      <div className="text-sm text-muted-foreground">Expected in July</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">12</div>
                      <div className="text-sm text-muted-foreground">Lakes at Risk</div>
                      <div className="text-sm text-muted-foreground">Requiring monitoring</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optional: Flood Runout Path */}
              <Card>
                <CardHeader>
                  <CardTitle>Flood Runout Path Simulation</CardTitle>
                  <CardDescription>DEM-based modeling showing potential flood impact zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 bg-card border border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Flood Path Simulation</p>
                      <p className="text-sm text-muted-foreground">
                        Based on digital elevation models and historical data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                  GlacierWatch
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Protecting communities through advanced AI-powered glacier monitoring and early warning systems.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="hover:text-primary transition-colors">
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/risk-map" className="hover:text-primary transition-colors">
                    Risk Map
                  </Link>
                </li>
                <li>
                  <Link href="/impacts" className="hover:text-primary transition-colors">
                    Impacts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Research Papers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Emergency</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-destructive transition-colors">
                    Report Incident
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-destructive transition-colors">
                    Emergency Contacts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-destructive transition-colors">
                    Evacuation Plans
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 GlacierWatch. All rights reserved. Built for community safety and disaster prevention.</p>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </ProtectedRoute>
  )
}
