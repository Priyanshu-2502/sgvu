"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Phone } from "lucide-react"

type Coords = { lat: number; lng: number } | null

function getRegion(lat: number, lng: number) {
  const inHimalaya = lat >= 26 && lat <= 36 && lng >= 74 && lng <= 97
  return inHimalaya ? "Himalayan Region (India)" : "Outside target region"
}

function assessRisk(lat: number, lng: number) {
  const month = new Date().getMonth() + 1 // 1-12
  const inHimalaya = lat >= 26 && lat <= 36 && lng >= 74 && lng <= 97
  let level: "Low" | "Moderate" | "High" = "Low"
  if (inHimalaya) {
    if (month >= 6 && month <= 9) level = "High" // Monsoon period
    else if ([3, 4, 5, 10, 11].includes(month)) level = "Moderate"
    else level = "Low"
  }
  const summary =
    level === "High"
      ? "Elevated GLOF risk due to monsoon and melt conditions."
      : level === "Moderate"
      ? "Seasonal vigilance advised; monitor local advisories."
      : "No immediate risk indicators detected for your area."
  return { level, summary }
}

export default function LiveLocationAlert() {
  const [open, setOpen] = React.useState(false)
  const [coords, setCoords] = React.useState<Coords>(null)
  const [status, setStatus] = React.useState<"idle" | "loading" | "error" | "ready">("idle")
  const [errorMsg, setErrorMsg] = React.useState<string>("")

  const requestLocation = React.useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error")
      setErrorMsg("Geolocation not supported in this browser.")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        setStatus("ready")
      },
      (err) => {
        setStatus("error")
        setErrorMsg(err.message || "Failed to get location. Please allow permission.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }, [])

  React.useEffect(() => {
    if (open && status === "idle") {
      requestLocation()
    }
  }, [open, status, requestLocation])

  const level = coords ? assessRisk(coords.lat, coords.lng).level : null
  const summary = coords ? assessRisk(coords.lat, coords.lng).summary : null
  const region = coords ? getRegion(coords.lat, coords.lng) : null

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <MapPin className="w-4 h-4" /> Live Location
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" /> Location-wise Alert & Assistance
            </DialogTitle>
          </DialogHeader>

          {status === "loading" && (
            <Alert>
              <AlertDescription>Fetching your live location… please wait.</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Alert className="border-destructive/40">
                <AlertDescription>
                  {errorMsg || "Unable to retrieve location. You can retry or enter details manually."}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={requestLocation}>
                  Retry Location
                </Button>
              </div>
            </div>
          )}

          {status === "ready" && coords && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Your Coordinates</div>
                  <div className="text-sm">Lat: {coords.lat.toFixed(4)} | Lng: {coords.lng.toFixed(4)}</div>
                  <div className="text-sm">Region: {region}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Risk Level</div>
                  <Badge variant={level === "High" ? "destructive" : level === "Moderate" ? "secondary" : "outline"}>
                    {level}
                  </Badge>
                </div>
              </div>

              <Alert>
                <AlertDescription>{summary}</AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Warnings</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Avoid riverbanks and downstream areas of glacier lakes.</li>
                    <li>Stay updated with local administration advisories.</li>
                    <li>Prepare an emergency kit and evacuation plan.</li>
                    <li>Do not attempt to cross flooded streams.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Evacuation Plan</h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Identify nearest safe high-ground routes.</li>
                    <li>Keep essential documents and medicines accessible.</li>
                    <li>Coordinate with neighbors and local disaster teams.</li>
                    <li>Follow official evacuation instructions promptly.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2"><Phone className="w-4 h-4" /> Contact Support</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <a href="tel:112">Emergency Helpline 112</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:100">Police 100</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:101">Fire 101</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="tel:108">Ambulance 108</a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  For SDRF/NDRF assistance, contact your State Disaster Management authority or dial 112 for routing.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={requestLocation}>Refresh Location</Button>
                <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}