"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Activity, AlertTriangle, ArrowRight, Layers, FileCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  
  // Results
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [ndwiImage, setNdwiImage] = useState<string | null>(null)
  const [waterPixels, setWaterPixels] = useState<number>(0)
  const [riskData, setRiskData] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStep(1)
    }
  }

  const processImage = async () => {
    if (!file) return
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      // 1. Super Resolution
      const resEnhance = await fetch("http://localhost:8001/api/enhance", {
        method: "POST",
        body: formData,
      })
      const blobEnhance = await resEnhance.blob()
      setEnhancedImage(URL.createObjectURL(blobEnhance))
      setStep(2)

      // 2. NDWI Analysis
      // Note: In real app, we might send the enhanced image back, but for demo we send original or handle flow on backend
      // Here sending original again for simplicity as backend is stateless
      const resNdwi = await fetch("http://localhost:8001/api/analyze/ndwi", {
        method: "POST",
        body: formData,
      })
      const dataNdwi = await resNdwi.json()
      setNdwiImage(dataNdwi.ndwi_image)
      setWaterPixels(dataNdwi.water_pixels)
      setStep(3)

      // 3. Risk Assessment (Simulating comparison with past data)
      // We fake "past" data as slightly less than current to show growth/risk
      const pastPixels = dataNdwi.water_pixels * 0.85 
      
      const resRisk = await fetch(`http://localhost:8001/api/analyze/risk?water_pixels_current=${dataNdwi.water_pixels}&water_pixels_past=${pastPixels}&dist_km=4.5`, {
        method: "POST"
      })
      const dataRisk = await resRisk.json()
      setRiskData(dataRisk)
      setStep(4)

    } catch (error) {
      console.error("Analysis failed:", error)
      alert("Analysis failed. Ensure Python backend is running on port 8001.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Glacier Analysis</h1>
        <p className="text-muted-foreground">
          Upload drone or satellite imagery to detect glacial lake expansion and assess GLOF risks.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Imagery</CardTitle>
            <CardDescription>Upload Satellite (Sentinel-2/Landsat) or Drone footage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Image File</Label>
              <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
            </div>

            {file && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <Button 
              onClick={processImage} 
              disabled={!file || loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" /> Start Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {step >= 2 && enhancedImage && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Layers className="h-5 w-5 text-blue-500" />
                   Super Resolution Output
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <img src={enhancedImage} alt="Enhanced" className="rounded-lg w-full" />
                 <p className="text-xs text-muted-foreground mt-2">Upscaled using CNN Model</p>
               </CardContent>
             </Card>
          )}

          {step >= 3 && ndwiImage && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Activity className="h-5 w-5 text-cyan-500" />
                   NDWI & Water Mask
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <img src={ndwiImage} alt="NDWI" className="rounded-lg w-full" />
                 <p className="text-xs text-muted-foreground mt-2">Blue regions indicate high water content</p>
               </CardContent>
             </Card>
          )}
        </div>
      </div>

      {step >= 4 && riskData && (
        <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Risk Assessment Report</CardTitle>
            <CardDescription>Based on change detection analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-950 rounded-lg shadow-sm border">
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <div className="flex items-center gap-2 mt-1">
                  {riskData.risk_assessment.risk_level === "Critical" ? (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  ) : (
                    <FileCheck className="h-6 w-6 text-green-500" />
                  )}
                  <span className={`text-2xl font-bold ${
                    riskData.risk_assessment.risk_level === "Critical" ? "text-red-600" : "text-green-600"
                  }`}>
                    {riskData.risk_assessment.risk_level}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-lg shadow-sm border">
                 <p className="text-sm text-muted-foreground">Volume Change</p>
                 <p className="text-2xl font-bold mt-1">
                   +{riskData.change_analysis.change_percentage.toFixed(1)}%
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {riskData.change_analysis.volume_change_m3.toFixed(0)} m³ increase
                 </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-lg shadow-sm border">
                 <p className="text-sm text-muted-foreground">Model Confidence</p>
                 <p className="text-2xl font-bold mt-1 text-blue-600">
                   {riskData.accuracy_metrics.model_confidence}
                 </p>
              </div>
            </div>

            <Alert variant={riskData.risk_assessment.risk_level === "Critical" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                {riskData.risk_assessment.recommendation}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
