"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Download,
  Filter,
  MapIcon,
  TrendingUp,
  AlertTriangle,
  Users,
  Database,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Upload,
  Eye,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/protected-route"
import { NDWIChart } from "@/components/charts/ndwi-chart"
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart"
import { RiskRainfallChart } from "@/components/charts/risk-rainfall-chart"
import { VolumeChangeChart } from "@/components/charts/volume-change-chart"
import { SeasonalTrendsChart } from "@/components/charts/seasonal-trends-chart"
import { AdvancedAnalytics } from "@/components/charts/advanced-analytics"
import { AnalyticsExtras } from "@/components/charts/analytics-extras"
import { AnalyticsForecast } from "@/components/charts/analytics-forecast"
import LiveLocationAlert from "@/components/live-location-alert"
import React from "react"

// Mock data for dashboard
const mockLakeData = [
  {
    id: 1,
    name: "Imja Lake",
    state: "Sikkim",
    riskScore: 85,
    alertLevel: "Critical",
    area: 1.2,
    ndwi: 0.78,
    lastUpdate: "2024-01-15",
    coordinates: "27.9°N, 86.9°E",
  },
  {
    id: 2,
    name: "Tsho Rolpa",
    state: "Himachal Pradesh",
    riskScore: 72,
    alertLevel: "High",
    area: 1.65,
    ndwi: 0.65,
    lastUpdate: "2024-01-15",
    coordinates: "28.4°N, 86.5°E",
  },
  {
    id: 3,
    name: "Thulagi Lake",
    state: "Uttarakhand",
    riskScore: 58,
    alertLevel: "Medium",
    area: 0.8,
    ndwi: 0.52,
    lastUpdate: "2024-01-14",
    coordinates: "28.7°N, 84.2°E",
  },
  {
    id: 4,
    name: "Dig Tsho",
    state: "Arunachal Pradesh",
    riskScore: 34,
    alertLevel: "Low",
    area: 0.45,
    ndwi: 0.38,
    lastUpdate: "2024-01-14",
    coordinates: "28.1°N, 85.8°E",
  },
  {
    id: 5,
    name: "Raphstreng Tsho",
    state: "Sikkim",
    riskScore: 67,
    alertLevel: "High",
    area: 0.92,
    ndwi: 0.61,
    lastUpdate: "2024-01-15",
    coordinates: "27.8°N, 88.2°E",
  },
]

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLayers, setSelectedLayers] = useState({
    satellite: true,
    ndwi: true,
    ai: false,
    dem: false,
    flood: false,
  })
  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      // Stats
      try {
        const res = await fetch("/outputs/statistics.json", { cache: "no-store" })
        if (res.ok) setStats(await res.json())
      } catch (err) {}

      // Analysis
      try {
        const token = localStorage.getItem("glacierwatch_token")
        if (token) {
            const res = await fetch("http://localhost:8001/api/v1/analysis/", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                if (data.length > 0) setLatestAnalysis(data[data.length - 1])
            }
        }
      } catch (err) {}
    }
    loadData()
  }, [])

  const handleLayerToggle = (layer: string) => {
    setSelectedLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev],
    }))
  }

  const filteredLakes = mockLakeData.filter(
    (lake) =>
      lake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lake.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Bell className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ProtectedRoute requiredRole="admin">
    <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="flex-1">

      {/* Dashboard Header */}
      <section className="py-8 bg-gradient-to-br from-card to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-playfair)]">
                  Research Dashboard
                </h1>
                <p className="text-muted-foreground">Advanced analytics and monitoring for {user?.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <LiveLocationAlert />
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Database className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">2,847</div>
                  <div className="text-sm text-muted-foreground">Total Lakes</div>
                </CardContent>
              </Card>
              <Card className="border-destructive/20">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-destructive">
                    {latestAnalysis ? latestAnalysis.risk_level : "23"}
                  </div>
                  <div className="text-sm text-muted-foreground">High Risk (Latest)</div>
                </CardContent>
              </Card>
              <Card className="border-secondary/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary">156</div>
                  <div className="text-sm text-muted-foreground">Monitored</div>
                </CardContent>
              </Card>
              <Card className="border-accent/20">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent">47</div>
                  <div className="text-sm text-muted-foreground">Researchers</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="map">Interactive Map</TabsTrigger>
                <TabsTrigger value="data">Data Table</TabsTrigger>
                <TabsTrigger value="upload">Upload Data</TabsTrigger>
                <TabsTrigger value="outputs">Outputs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NDWIChart />
                  <RiskDistributionChart />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Latest high-priority notifications from the monitoring system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">Critical Alert: Imja Lake</h4>
                          <p className="text-sm text-muted-foreground">
                            NDWI increased by 15% in the last 48 hours. Risk score: 85%
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">High Risk: Tsho Rolpa</h4>
                          <p className="text-sm text-muted-foreground">
                            Sustained growth pattern detected. Monitoring increased.
                          </p>
                          <p className="text-xs text-muted-foreground">6 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <VolumeChangeChart />
                  <RiskRainfallChart />
                  <SeasonalTrendsChart />
                </div>

                {/* Interactive Advanced Analytics */}
                <AdvancedAnalytics />

                {/* Predictive Analytics & Summary */}
                <AnalyticsForecast />

                {/* Correlation & Regional Risk Assessment */}
                <AnalyticsExtras />

                {/* Advanced Analytics (Python Outputs) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Analytics</CardTitle>
                    <CardDescription>
                      Live previews of CSV outputs generated by your Python script (place files under
                      <code> public/outputs/</code>).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Time Series (90 days)</h4>
                        <CsvTable path="/outputs/time_series.csv" title="Time Series" maxRows={10} />
                        <p className="text-xs text-muted-foreground">
                          Expected columns: <code>date, temperature, risk_score, lake_area, population_at_risk, alerts_count</code>
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Regional Summary</h4>
                        <CsvTable path="/outputs/regional_data.csv" title="Regional Data" maxRows={10} />
                        <p className="text-xs text-muted-foreground">
                          Expected columns: <code>Region, Glaciers_Count, Avg_Risk_Score, High_Risk_Glaciers, Population_Affected, Temperature_Change, Economic_Impact_M</code>
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">30-Day Risk Forecast</h4>
                        <CsvTable path="/outputs/forecast.csv" title="Risk Forecast" maxRows={30} />
                        <p className="text-xs text-muted-foreground">
                          Expected columns: <code>date, predicted_risk, confidence_upper, confidence_lower</code>
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground">Model Performance</h4>
                        <CsvTable path="/outputs/performance.csv" title="Model Performance" maxRows={30} />
                        <p className="text-xs text-muted-foreground">
                          Expected columns: <code>date, accuracy, false_positive_rate, false_negative_rate</code>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-muted-foreground">
                      Ensure your Python script saves these CSVs to <code>public/outputs/</code>:
                      <code> time_series.csv, regional_data.csv, forecast.csv, performance.csv</code>.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Interactive Map Tab */}
              <TabsContent value="map" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-primary" />
                        Interactive Monitoring Map
                      </CardTitle>
                      <CardDescription>Toggle layers to customize your view</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Advanced Interactive Map</p>
                          <p className="text-sm text-muted-foreground">Multi-layer visualization with real-time data</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-secondary" />
                        Map Layers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(selectedLayers).map(([layer, enabled]) => (
                          <div key={layer} className="flex items-center justify-between">
                            <Label htmlFor={layer} className="text-sm capitalize">
                              {layer === "ndwi"
                                ? "NDWI Polygons"
                                : layer === "ai"
                                  ? "AI Polygons"
                                  : layer === "dem"
                                    ? "DEM Slope"
                                    : layer === "flood"
                                      ? "Flood Runout Path"
                                      : `${layer} RGB`}
                            </Label>
                            <Button
                              variant={enabled ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleLayerToggle(layer)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {enabled ? "On" : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Data Table Tab */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Comprehensive Lake Database</CardTitle>
                        <CardDescription>Sortable and filterable data for all monitored lakes</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search lakes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                          />
                        </div>
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
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Lake Name</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Risk Score</TableHead>
                            <TableHead>Alert Level</TableHead>
                            <TableHead>Area (km²)</TableHead>
                            <TableHead>NDWI</TableHead>
                            <TableHead>Coordinates</TableHead>
                            <TableHead>Last Update</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLakes.map((lake) => (
                            <TableRow key={lake.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">{lake.name}</TableCell>
                              <TableCell>{lake.state}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      lake.alertLevel === "Critical"
                                        ? "bg-red-500"
                                        : lake.alertLevel === "High"
                                          ? "bg-orange-500"
                                          : lake.alertLevel === "Medium"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                    }`}
                                  ></div>
                                  {lake.riskScore}%
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    lake.alertLevel === "Critical" || lake.alertLevel === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {lake.alertLevel}
                                </Badge>
                              </TableCell>
                              <TableCell>{lake.area}</TableCell>
                              <TableCell>{lake.ndwi}</TableCell>
                              <TableCell className="text-sm">{lake.coordinates}</TableCell>
                              <TableCell>{lake.lastUpdate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Upload Data Tab */}
              <TabsContent value="upload" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload New Data
                    </CardTitle>
                    <CardDescription>Upload drone/satellite data for analysis (Future feature)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Upload Data Files</h3>
                      <p className="text-muted-foreground mb-4">
                        Drag and drop your satellite imagery, DEM files, or drone survey data
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Select Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">
                        Supported formats: GeoTIFF, Shapefile, KML, CSV
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Outputs Tab */}
              <TabsContent value="outputs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Backend Outputs</CardTitle>
                    <CardDescription>Charts and stats generated by your Python scripts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg bg-card">
                        <div className="text-sm text-muted-foreground">Total Glaciers Monitored</div>
                        <div className="text-2xl font-bold">{stats ? stats["Total Glaciers Monitored"]?.toLocaleString() : "—"}</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-card">
                        <div className="text-sm text-muted-foreground">High Risk Glaciers</div>
                        <div className="text-2xl font-bold">{stats ? stats["High Risk Glaciers"]?.toLocaleString() : "—"}</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-card">
                        <div className="text-sm text-muted-foreground">People at Risk</div>
                        <div className="text-2xl font-bold">{stats ? stats["People at Risk"]?.toLocaleString() : "—"}</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-card">
                        <div className="text-sm text-muted-foreground">Hours Since Last Alert</div>
                        <div className="text-2xl font-bold">{stats ? stats["Hours Since Last Alert"]?.toLocaleString() : "—"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Risk Trend</CardTitle>
                          <CardDescription>From outputs/risk_trend_chart.html</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <iframe src="/outputs/risk_trend_chart.html" className="w-full h-[420px] rounded-md border" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Temperature Monitoring</CardTitle>
                          <CardDescription>From outputs/temperature_chart.html</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <iframe src="/outputs/temperature_chart.html" className="w-full h-[420px] rounded-md border" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Regional Risk Overview</CardTitle>
                          <CardDescription>From outputs/regional_risk_chart.html</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <iframe src="/outputs/regional_risk_chart.html" className="w-full h-[420px] rounded-md border" />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link href="/outputs/glacier_data.csv" className="text-sm underline text-primary">Download glacier_data.csv</Link>
                      <Link href="/outputs/alerts_data.csv" className="text-sm underline text-primary">Download alerts_data.csv</Link>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Place generated files under <code>public/outputs/</code> to serve them at <code>/outputs/*</code>.</p>

                    {/* Outputs Summary (mirrors Python print statements) */}
                    <div className="mt-4 p-4 border rounded-lg bg-card">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Outputs Summary</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>- statistics.json: Current statistics</li>
                        <li>To view charts, open the .html files in a web browser.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                GlacierWatch
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 GlacierWatch Research Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// HtmlIframe component for displaying HTML charts
const HtmlIframe: React.FC<{ path: string; title: string }> = ({ path, title }) => {
  const [src, setSrc] = useState<string>(path)
  useEffect(() => {
    const ts = Date.now()
    setSrc(`${path}?v=${ts}`)
  }, [path])

  return (
    <div>
      <iframe
        title={title}
        src={src}
        className="w-full h-[420px] rounded-md border"
        loading="lazy"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        If the chart looks blank, open directly: <a href={path} target="_blank" rel="noreferrer" className="underline">{path}</a>
      </p>
    </div>
  )
}

// Lightweight CSV preview component for Python outputs
const CsvTable: React.FC<{ path: string; title: string; maxRows?: number }> = ({ path, title, maxRows = 10 }) => {
  const [rows, setRows] = useState<string[][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(path, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
        const text = await res.text()
        // Simple CSV parse (no quoted commas). Suitable for our synthetic data.
        const lines = text.trim().split(/\r?\n/)
        const parsed = lines.map((l) => l.split(",").map((c) => c.replace(/^\"|\"$/g, "")))
        if (!cancelled) setRows(parsed.slice(0, Math.max(1, maxRows + 1)))
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load CSV")
      }
    }
    load()
    return () => { cancelled = true }
  }, [path, maxRows])

  if (error) {
    return <div className="text-sm text-destructive">{title} failed to load: {error}</div>
  }
  if (!rows) {
    return <div className="text-sm text-muted-foreground">Loading {title}…</div>
  }

  const headers = rows[0] || []
  const body = rows.slice(1)

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, idx) => (
              <TableHead key={idx} className="whitespace-nowrap">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((r, rIdx) => (
            <TableRow key={rIdx}>
              {r.map((c, cIdx) => (
                <TableCell key={cIdx} className="whitespace-nowrap text-xs">{c}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-2 text-[10px] text-muted-foreground">Showing up to {maxRows} rows</div>
    </div>
  )
}
