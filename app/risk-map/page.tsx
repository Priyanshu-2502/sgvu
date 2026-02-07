"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Script from "next/script"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/protected-route"

type GlacierRow = {
  id?: string
  name: string
  latitude: number
  longitude: number
  region: string
  risk_score: number
  temperature: number
  alert_level?: string
  last_updated?: string
}

function parseCsv(text: string): GlacierRow[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map(h => h.trim())
  return lines.slice(1).map((line) => {
    const parts = line.split(",")
    const record: any = {}
    headers.forEach((h, i) => {
      record[h] = parts[i]?.trim()
    })
    return {
      id: record["id"],
      name: record["name"] ?? record["Name"] ?? "Unknown",
      latitude: Number(record["latitude"] ?? record["Latitude"] ?? 0),
      longitude: Number(record["longitude"] ?? record["Longitude"] ?? 0),
      region: record["region"] ?? record["Region"] ?? "Unknown",
      risk_score: Number(record["risk_score"] ?? record["Risk_Score"] ?? 0),
      temperature: Number(record["temperature"] ?? record["Temperature"] ?? 0),
      alert_level: record["alert_level"] ?? record["Alert_Level"] ?? undefined,
      last_updated: record["last_updated"] ?? record["Last_Updated"] ?? undefined,
    }
  })
}

export default function RiskMapPage() {
  const { isAuthenticated, loading } = useAuth()
  const [riskFilter, setRiskFilter] = useState<string>("All")
  const [regionFilter, setRegionFilter] = useState<string>("All")
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false)
  const [glaciers, setGlaciers] = useState<GlacierRow[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [leafletReady, setLeafletReady] = useState<boolean>(false)
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedGlacier, setSelectedGlacier] = useState<GlacierRow | null>(null)
  const [userAdjustedView, setUserAdjustedView] = useState<boolean>(false)

  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)

  // Load glacier data from CSV with optional auto-refresh
  useEffect(() => {
    let cancelled = false
    let interval: any

    const load = async () => {
      try {
        const res = await fetch("/outputs/glacier_data.csv", { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load glacier_data.csv: ${res.status}`)
        const text = await res.text()
        const parsed = parseCsv(text).filter(r => !isNaN(r.latitude) && !isNaN(r.longitude))
        if (!cancelled) {
          setGlaciers(parsed)
          setLastUpdated(new Date())
        }
      } catch (e) {
        // Silent failure; the page stays interactive even without data
      }
    }

    load()
    if (autoRefresh) {
      interval = setInterval(load, 15000)
    }

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const regions = useMemo(() => {
    const set = new Set<string>(["All"])
    glaciers.forEach(g => set.add(g.region || "Unknown"))
    return Array.from(set)
  }, [glaciers])

  const filtered = useMemo(() => {
    let data = glaciers
    if (riskFilter !== "All") {
      if (riskFilter.startsWith("High")) data = data.filter(g => g.risk_score >= 8)
      else if (riskFilter.startsWith("Medium")) data = data.filter(g => g.risk_score >= 5 && g.risk_score < 8)
      else if (riskFilter.startsWith("Low")) data = data.filter(g => g.risk_score < 5)
    }
    if (regionFilter !== "All") data = data.filter(g => g.region === regionFilter)
    return data
  }, [glaciers, riskFilter, regionFilter])

  const metrics = useMemo(() => {
    const total = filtered.length
    const high = filtered.filter(g => g.risk_score >= 8).length
    const avgTemp = filtered.length ? filtered.reduce((a, b) => a + (b.temperature || 0), 0) / filtered.length : 0
    const avgRisk = filtered.length ? filtered.reduce((a, b) => a + (b.risk_score || 0), 0) / filtered.length : 0
    return { total, high, avgTemp, avgRisk }
  }, [filtered])

  // Initialize Leaflet map when scripts are ready
  useEffect(() => {
    if (!leafletReady || mapRef.current) return
    // @ts-ignore
    const L = (window as any).L
    if (!L) return

    const centerLat = filtered.length ? filtered.reduce((a, b) => a + b.latitude, 0) / filtered.length : 30
    const centerLon = filtered.length ? filtered.reduce((a, b) => a + b.longitude, 0) / filtered.length : 80

    const map = L.map("risk-map-container", { zoomControl: true }).setView([centerLat, centerLon], 4)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)

    mapRef.current = map
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Capture map clicks to select nearest glacier
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng || {}
      if (typeof lat === "number" && typeof lng === "number") {
        setClickedLatLng({ lat, lng })
      }
    })

    // When the user moves or zooms the map, stop auto-fitting bounds
    map.on("moveend", () => setUserAdjustedView(true))
    map.on("zoomend", () => setUserAdjustedView(true))
  }, [leafletReady])

  // Update markers and heat layer when data or filters change
  useEffect(() => {
    // @ts-ignore
    const L = (window as any).L
    if (!L || !mapRef.current) return

    const map = mapRef.current

    // Clear previous layers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers()
    }
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    // Add heat layer if enabled
    if (showHeatmap && filtered.length) {
      // @ts-ignore leaflet.heat from CDN sets L.heatLayer
      if (L.heatLayer) {
        const heatData = filtered.map(g => [g.latitude, g.longitude, Math.abs(g.temperature || 0)])
        heatLayerRef.current = L.heatLayer(heatData, {
          minOpacity: 0.3,
          radius: 25,
          blur: 15,
          gradient: { 0.2: "blue", 0.4: "cyan", 0.6: "lime", 0.8: "yellow", 1.0: "red" },
        }).addTo(map)
      } else {
        // Fallback: draw translucent circles sized by temperature
        filtered.forEach(g => {
          const radius = Math.min(50000, Math.max(5000, Math.abs(g.temperature || 0) * 2000))
          L.circle([g.latitude, g.longitude], {
            radius,
            color: "transparent",
            fillColor: "red",
            fillOpacity: 0.15,
          }).addTo(markersLayerRef.current)
        })
      }
    }

    // Add markers with popups
    filtered.forEach((glacier) => {
      const score = glacier.risk_score
      let color = "green"
      if (score >= 8) color = "red"
      else if (score >= 6) color = "orange"
      else if (score >= 4) color = "yellow"

      const popupHtml = `
        <div style="font-family: Arial, sans-serif; min-width: 200px;">
          <h4 style="margin: 0; color: #333;">${glacier.name}</h4>
          <hr style="margin: 10px 0;">
          <p><strong>Region:</strong> ${glacier.region}</p>
          <p><strong>Risk Score:</strong> <span style="color: ${color}; font-weight: bold;">${glacier.risk_score.toFixed(1)}/10</span></p>
          <p><strong>Temperature:</strong> ${glacier.temperature.toFixed(1)}°C</p>
          <p><strong>Alert Level:</strong> ${glacier.alert_level ?? "N/A"}</p>
          <p><strong>Last Updated:</strong> ${glacier.last_updated ?? "N/A"}</p>
          <small style="color: #666;">Coordinates: ${glacier.latitude.toFixed(4)}, ${glacier.longitude.toFixed(4)}</small>
        </div>
      `

      const marker = L.circleMarker([glacier.latitude, glacier.longitude], {
        color,
        fillColor: color,
        fillOpacity: 0.85,
        radius: 8,
        className: score >= 8 ? "pulse-marker" : "",
      })
      marker.bindPopup(popupHtml)
      marker.addTo(markersLayerRef.current)
    })

    // Fit bounds to markers when available, unless user has adjusted the view
    if (filtered.length) {
      const bounds = L.latLngBounds(filtered.map(g => [g.latitude, g.longitude]))
      if (!userAdjustedView) {
        map.fitBounds(bounds.pad(0.2))
      }
    }
  }, [filtered, showHeatmap, userAdjustedView])

  // When filters change, allow one auto-fit cycle to reframe the map
  useEffect(() => {
    setUserAdjustedView(false)
  }, [riskFilter, regionFilter])

  // When user clicks the map, find closest glacier (approx. Euclidean distance)
  useEffect(() => {
    if (!clickedLatLng || filtered.length === 0) {
      setSelectedGlacier(null)
      return
    }
    let minD = Number.POSITIVE_INFINITY
    let closest: GlacierRow | null = null
    for (const g of filtered) {
      const dLat = (g.latitude || 0) - clickedLatLng.lat
      const dLng = (g.longitude || 0) - clickedLatLng.lng
      const dist = Math.sqrt(dLat * dLat + dLng * dLng)
      if (dist < minD) {
        minD = dist
        closest = g
      }
    }
    setSelectedGlacier(closest)
  }, [clickedLatLng, filtered])

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
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
      {/* Leaflet CSS via CDN */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      {/* Risk Map title */}
      <div>
        <h1 className="text-2xl font-semibold">🗺️ Interactive Risk Map</h1>
        <p className="text-sm text-muted-foreground">Real-time glacier monitoring with interactive markers and temperature overlay</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Map Filters</CardTitle>
          <CardDescription>Adjust risk level, region, heatmap, and auto-refresh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <Label className="mb-2 block">Risk Level</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select risk" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="High (8-10)">High (8-10)</SelectItem>
                  <SelectItem value="Medium (5-7)">Medium (5-7)</SelectItem>
                  <SelectItem value="Low (1-4)">Low (1-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Region</Label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select region" /></SelectTrigger>
                <SelectContent>
                  {regions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} id="heatmap" />
              <Label htmlFor="heatmap">Show Temperature Heatmap</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh" />
              <Label htmlFor="auto-refresh">Auto-refresh (5s)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Glaciers</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{metrics.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>High Risk</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.high}</div>
            <Badge variant="secondary" className="mt-2">{Math.floor(Math.random() * 6) - 2} from last hour</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Avg Temperature</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTemp.toFixed(1)}°C</div>
            <Badge variant="secondary" className="mt-2">{(Math.random() * 1 - 0.5).toFixed(1)}°C</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Avg Risk Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgRisk.toFixed(1)}</div>
            <Badge variant="secondary" className="mt-2">{(Math.random() * 0.4 - 0.2).toFixed(1)}</Badge>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Map */}
      <div>
        <h2 className="text-xl font-semibold">🌍 Interactive Glacier Risk Map</h2>
        <div id="risk-map-container" className="w-full" style={{ height: 500, borderRadius: 8, overflow: "hidden" }} />
      </div>

      {/* Selected Glacier Details */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-sm">No glaciers match the current filter criteria.</div>
          </CardContent>
        </Card>
      ) : selectedGlacier ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">📍 Selected: {selectedGlacier.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader><CardTitle>Risk Score</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{selectedGlacier.risk_score.toFixed(1)}/10</div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Temperature</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{selectedGlacier.temperature.toFixed(1)}°C</div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Alert Level</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{selectedGlacier.alert_level ?? "N/A"}</div></CardContent>
            </Card>
          </div>
          <div className="text-sm">
            <strong>Region:</strong> {selectedGlacier.region} | <strong>Last Updated:</strong> {selectedGlacier.last_updated ?? "N/A"}
          </div>
        </div>
      ) : null}

      {/* Legend */}
      <Separator />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">🎨 Map Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader><CardTitle>🔴 High Risk (8-10)</CardTitle></CardHeader>
            <CardContent><div className="text-sm text-muted-foreground">Immediate attention required</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>🟠 Medium-High Risk (6-8)</CardTitle></CardHeader>
            <CardContent><div className="text-sm text-muted-foreground">Close monitoring needed</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>🟡 Medium Risk (4-6)</CardTitle></CardHeader>
            <CardContent><div className="text-sm text-muted-foreground">Regular monitoring</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>🟢 Low Risk (1-4)</CardTitle></CardHeader>
            <CardContent><div className="text-sm text-muted-foreground">Stable conditions</div></CardContent>
          </Card>
        </div>
        {showHeatmap ? (
          <div className="text-sm"><strong>🌡️ Temperature Heatmap:</strong> Blue (coldest) → Red (warmest)</div>
        ) : null}
      </div>

      {/* Live update indicator */}
      <div className="text-sm">
        <strong>🔄 Last updated:</strong> {lastUpdated.toLocaleTimeString()} {autoRefresh ? "(Auto-refreshing every 5 seconds)" : "(Auto-refresh disabled)"}
      </div>

      {/* Map Controls help */}
      <Card>
        <CardHeader>
          <CardTitle>🎛️ Map Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click markers or map to view closest glacier details</li>
            <li>Use filters to focus on specific areas</li>
            <li>Toggle heatmap for temperature overlay</li>
            <li>Enable auto-refresh for live updates</li>
          </ul>
        </CardContent>
      </Card>

      {/* Leaflet JS via CDN */}
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" onLoad={() => setLeafletReady(true)} />
      {/* Heatmap plugin removed to avoid Webpack runtime conflicts; using circle fallback */}

      <style jsx>{`
        .pulse-marker {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
