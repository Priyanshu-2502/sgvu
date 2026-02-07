"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Satellite,
  Brain,
  Map,
  Bell,
  Users,
  Target,
  Eye,
  Globe,
  Cloud,
  Wifi,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/protected-route"
 
export default function AboutPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

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
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                About GlacierWatch
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-blue-800 dark:text-blue-100 mb-6 font-[family-name:var(--font-playfair)] text-balance">
                Pioneering Glacier Flood Prevention Through AI
              </h1>
              <p className="text-xl text-blue-700/80 dark:text-blue-200/90 mb-8 max-w-3xl mx-auto text-pretty">
                Our mission is to protect vulnerable communities from glacial lake outburst floods using cutting-edge
                artificial intelligence and satellite monitoring technology.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-[family-name:var(--font-playfair)] text-blue-700 dark:text-blue-300">
                      Our Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700/80 dark:text-blue-200/90 leading-relaxed">
                      To develop and deploy advanced AI/ML systems that provide early warning for glacial lake outburst
                      floods, protecting millions of lives across the Himalayan region. We combine satellite technology,
                      machine learning, and geospatial analysis to create the world's most comprehensive glacier
                      monitoring system.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-[family-name:var(--font-playfair)] text-blue-600 dark:text-blue-200">
                      Our Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700/80 dark:text-blue-200/90 leading-relaxed">
                      To create a world where no community is caught unprepared by glacier floods. We envision a global
                      network of AI-powered monitoring systems that provide real-time risk assessment and early warnings,
                      enabling proactive disaster management and community resilience.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16 bg-blue-50/50 dark:bg-blue-900/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-blue-800 dark:text-blue-100 mb-6 font-[family-name:var(--font-playfair)]">
                  Our Expert Team
                </h2>
                <p className="text-lg text-blue-700/80 dark:text-blue-200/90 max-w-2xl mx-auto">
                  A multidisciplinary team of researchers, engineers, and domain experts working together to advance
                  glacier monitoring technology.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* ...team member cards... */}
                <Card className="text-center border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="relative w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-blue-100 dark:bg-blue-800">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-blue-600 dark:text-blue-300" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-blue-800 dark:text-blue-100">Priyanshu Sinha</CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-300 font-medium">AI/ML Lead</CardDescription>
                    <div className="mt-2">
                      <Link href="https://linkedin.com" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                        {/* ...svg... */}
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-700/70 dark:text-blue-300/70">
                      PhD in Machine Learning, specializing in satellite image analysis and deep learning for
                      environmental monitoring.
                    </p>
                  </CardContent>
                </Card>
                {/* ...other team members... */}
              </div>
            </div>
          </div>
        </section>

        {/* Data Pipeline Diagram */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                  Advanced Data Pipeline
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our comprehensive system processes multiple data sources through sophisticated AI algorithms to deliver
                  accurate and timely flood warnings.
                </p>
              </div>
              {/* ...pipeline content... */}
            </div>
          </div>
        </section>

        {/* Future Scope */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6 font-[family-name:var(--font-playfair)]">
                  Future Roadmap
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our vision extends beyond the Himalayas to create a global network of glacier monitoring systems.
                </p>
              </div>
              {/* ...future scope cards... */}
              <div className="text-center mt-12">
                <Button size="lg" className="text-lg px-8">
                  Join Our Research Initiative
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {/* ...footer columns... */}
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 GlacierWatch. All rights reserved. Built for community safety and disaster prevention.</p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
