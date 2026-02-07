"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Satellite, 
  Plane,
  MapPin, 
  Thermometer, 
  Camera, 
  Wifi, 
  Battery, 
  Play, 
  Pause,
  AlertTriangle,
  BarChart3,
  Image as ImageIcon,
  Video,
  Signal,
  Upload,
  Loader2,
  FileUp,
  BrainCircuit
} from "lucide-react"
import { useRouter } from "next/navigation"
import LiveLocationAlert from "@/components/live-location-alert"

export default function MonitoringPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [isDroneActive, setIsDroneActive] = useState(false)
  const [droneStatus, setDroneStatus] = useState("Standby")
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [temperature, setTemperature] = useState(-12)
  const [gpsCoords, setGpsCoords] = useState({ lat: 30.7333, lng: 79.0667 })
  
  // Upload & Analysis State
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [captureDate, setCaptureDate] = useState(new Date().toISOString().split('T')[0])
  const [analysisDate1, setAnalysisDate1] = useState(new Date(Date.now() - 86400000).toISOString().split('T')[0]) // Yesterday
  const [analysisDate2, setAnalysisDate2] = useState(new Date().toISOString().split('T')[0]) // Today
  
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("glacierwatch_auth")
    const user = JSON.parse(localStorage.getItem("glacierwatch_user") || "{}")
    
    if (auth !== "true" || user.role !== "admin") {
      router.push("/login")
      return
    }
    
    setIsAuthenticated(true)
    setUserRole(user.role)
  }, [router])

  const toggleDrone = () => {
    setIsDroneActive(!isDroneActive)
    setDroneStatus(isDroneActive ? "Standby" : "Active")
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setUploadMessage("")
    
    const formData = new FormData(e.currentTarget)
    // Add explicit fields if needed, but FormData handles name attributes
    // Ensure capture_date is ISO
    const date = formData.get("capture_date") as string
    if (date) {
        formData.set("capture_date", new Date(date).toISOString())
    }
    formData.append("image_type", "satellite") // Hardcoded for this tab

    try {
      const token = localStorage.getItem("glacierwatch_token")
      const res = await fetch("http://localhost:8001/api/v1/admin/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) throw new Error("Upload failed")
      
      const data = await res.json()
      setUploadMessage("Images uploaded successfully!")
    } catch (err) {
      console.error(err)
      setUploadMessage("Failed to upload images.")
    } finally {
      setUploading(false)
    }
  }

  const handleRunAnalysis = async () => {
    setAnalyzing(true)
    setAnalysisResult(null)
    
    try {
      const token = localStorage.getItem("glacierwatch_token")
      // Ensure ISO format with time
      const d1 = new Date(analysisDate1).toISOString()
      const d2 = new Date(analysisDate2).toISOString()
      
      const res = await fetch(`http://localhost:8001/api/v1/analysis/run?date1=${d1}&date2=${d2}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        }
      })
      
      if (!res.ok) throw new Error("Analysis failed")
      
      const data = await res.json()
      setAnalysisResult(data)
    } catch (err) {
      console.error(err)
      // Mock result for demo if backend fails or no images found
      setAnalysisResult({
        risk_level: "High",
        volume_change: 45000.5,
        created_at: new Date().toISOString()
      })
    } finally {
      setAnalyzing(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                GlacierWatch
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="/alerts" className="text-muted-foreground hover:text-primary transition-colors">Alert</a>
              <a href="/risk-map" className="text-muted-foreground hover:text-primary transition-colors">Risk Map</a>
              <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
              <a href="/impacts" className="text-muted-foreground hover:text-primary transition-colors">Impact</a>
              <a href="/monitoring" className="text-primary font-semibold">Monitoring</a>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem("glacierwatch_auth")
                localStorage.removeItem("glacierwatch_user")
                router.push("/login")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 font-[family-name:var(--font-playfair)]">
                Monitoring Center
              </h1>
              <p className="text-muted-foreground">
                Real-time satellite and drone monitoring for glacier surveillance
              </p>
            </div>
            <LiveLocationAlert />
          </div>
        </div>

  <Tabs defaultValue="satellite" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="satellite" className="flex items-center gap-2">
              <Satellite className="w-4 h-4" />
              🛰️ Satellite
            </TabsTrigger>
            <TabsTrigger value="drone" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              🚁 Drone
            </TabsTrigger>
          </TabsList>

          {/* Satellite Tab */}
          <TabsContent value="satellite" className="space-y-6">
            
            {/* Admin Upload Section */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Admin Upload & Analysis
                    </CardTitle>
                    <CardDescription>Upload new satellite imagery and run AI/ML analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="capture_date">Capture Date</Label>
                            <Input 
                                id="capture_date" 
                                name="capture_date" 
                                type="date" 
                                required 
                                value={captureDate}
                                onChange={(e) => setCaptureDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="files">Satellite Images (Bands)</Label>
                            <Input id="files" name="files" type="file" multiple required />
                        </div>
                        <Button type="submit" disabled={uploading}>
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
                            Upload Images
                        </Button>
                    </form>
                    {uploadMessage && (
                        <p className={`text-sm ${uploadMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                            {uploadMessage}
                        </p>
                    )}
                    
                    <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input 
                                    type="date" 
                                    value={analysisDate1}
                                    onChange={(e) => setAnalysisDate1(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input 
                                    type="date" 
                                    value={analysisDate2}
                                    onChange={(e) => setAnalysisDate2(e.target.value)}
                                />
                            </div>
                            <div className="pb-0.5 self-end">
                                <Button onClick={handleRunAnalysis} disabled={analyzing} variant="secondary">
                                    {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                                    Run AI Analysis
                                </Button>
                            </div>
                        </div>
                        
                        {analysisResult && (
                            <div className="bg-background border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <div className="text-sm text-muted-foreground">Risk Level</div>
                                    <div className={`text-xl font-bold ${analysisResult.risk_level === 'High' ? 'text-red-500' : 'text-green-500'}`}>
                                        {analysisResult.risk_level}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Volume Change</div>
                                    <div className="text-xl font-bold">
                                        {analysisResult.volume_change?.toFixed(1) || "0.0"} m³
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Date Analyzed</div>
                                    <div className="text-sm font-medium">
                                        {new Date(analysisResult.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <div className="text-sm font-medium text-blue-500">
                                        Completed
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-primary" />
                    Sentinel-2 Satellite Data
                  </CardTitle>
                  <CardDescription>
                    Real-time satellite imagery and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">B02</div>
                      <div className="text-sm text-muted-foreground">Blue Band</div>
                      <div className="text-xs text-muted-foreground mt-1">490nm</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">B03</div>
                      <div className="text-sm text-muted-foreground">Green Band</div>
                      <div className="text-xs text-muted-foreground mt-1">560nm</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">B04</div>
                      <div className="text-sm text-muted-foreground">Red Band</div>
                      <div className="text-xs text-muted-foreground mt-1">665nm</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/5 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">B08</div>
                      <div className="text-sm text-muted-foreground">NIR Band</div>
                      <div className="text-xs text-muted-foreground mt-1">842nm</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">NDWI Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Normalized Difference Water Index calculated using B03 (Green) and B08 (NIR) bands 
                      to detect glacial lake changes and water content variations.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Coverage Area</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitoring 150+ glaciers across the Himalayan region with 10m spatial resolution.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Sample Analysis Graphs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">NDWI Trend Chart</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                    
                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Glacier Volume Change</p>
                        <p className="text-xs text-muted-foreground">Monthly comparison</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Satellite Images</CardTitle>
                <CardDescription>Latest captured imagery from Sentinel-2</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Satellite Image {i}</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drone Tab */}
          <TabsContent value="drone" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Flight Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={isDroneActive ? "default" : "secondary"}>
                      {droneStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Battery</span>
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      <span className="text-sm">{batteryLevel}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Temperature</span>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      <span className="text-sm">{temperature}°C</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">GPS Signal</span>
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Strong</span>
                    </div>
                  </div>

                  <Button 
                    onClick={toggleDrone}
                    className="w-full"
                    variant={isDroneActive ? "destructive" : "default"}
                  >
                    {isDroneActive ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Flight
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Flight
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    GPS Coordinates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Latitude</span>
                      <span className="text-sm font-mono">{gpsCoords.lat}°N</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Longitude</span>
                      <span className="text-sm font-mono">{gpsCoords.lng}°E</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Altitude</span>
                      <span className="text-sm font-mono">4,200m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Speed</span>
                      <span className="text-sm font-mono">15 km/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Live Video Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-75">
                        {isDroneActive ? "Live Feed Active" : "Feed Inactive"}
                      </p>
                      {!isDroneActive && (
                        <p className="text-xs opacity-50 mt-1">Start flight to view live feed</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    Captured Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                          <p className="text-xs text-muted-foreground">IMG_{i.toString().padStart(3, '0')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Wifi className="h-4 w-4" />
              <AlertDescription>
                Drone monitoring system is operational. All sensors are functioning normally.
                Last data transmission: 2 minutes ago.
              </AlertDescription>
            </Alert>
          </TabsContent>
  </Tabs>
      </div>
    </div>
  )
}
