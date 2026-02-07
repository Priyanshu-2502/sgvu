"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Satellite, Brain, Map, Bell, Shield, Database, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import BannerBackground from "@/components/banner-crossfade"
import { bannerImages, bannerIntervalMs, bannerTransitionMs, bannerEasing } from "@/components/banner-config"
import LiveLocationAlert from "@/components/live-location-alert"
import Navigation from "@/components/navigation"

export default function HomePage() {
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
    <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <div className="flex-1">

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <BannerBackground
          images={bannerImages}
          intervalMs={bannerIntervalMs}
          transitionMs={bannerTransitionMs}
          easing={bannerEasing}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              AI-Powered Glacier Monitoring
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)] text-balance">
              Protecting Lives Through AI-Powered Glacier Intelligence
            </h1>
            <p className="text-lg sm:text-xl text-black mb-8 max-w-2xl mx-auto text-pretty">
              Advanced monitoring preventing GLOF disasters across India's mountain regions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Access Dashboard
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Learn More
                </Button>
              </Link>
              <LiveLocationAlert />
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Advanced AI</h3>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Himalayan Coverage</h3>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Real-time Intelligence</h3>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-primary">Disaster Prevention</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      {/* Technology Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              Technology Showcase
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our integrated platform combines multiple technologies to deliver accurate and timely glacier monitoring.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Satellite className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Satellite Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time satellite data analysis for comprehensive glacier coverage across the Himalayan region.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Drone Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Targeted drone surveillance for high-risk areas providing detailed imagery and data collection.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">AI/ML Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced algorithms analyze glacier changes, predict risks, and generate early warnings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Integrated Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unified data platform combining multiple sources for comprehensive risk assessment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              Our Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Protecting communities and infrastructure through advanced glacier monitoring.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-primary/20 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Advanced Detection Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our system can detect glacial changes weeks before traditional methods, providing crucial time for evacuation and preparation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Community Safety & Resilience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Empowering local communities with real-time information and evacuation protocols to enhance disaster preparedness.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary">150+</p>
                <p className="text-sm text-muted-foreground">Glaciers Monitored</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">1M+</p>
                <p className="text-sm text-muted-foreground">Lives Protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Collaboration Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4 font-[family-name:var(--font-playfair)]">
              Collaborating for a Safer India
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Working together with government agencies and research institutions to protect vulnerable communities.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="w-32 h-32 bg-card/50 rounded-lg flex items-center justify-center p-4">
              <p className="font-bold text-primary text-center">NDMA</p>
            </div>
            <div className="w-32 h-32 bg-card/50 rounded-lg flex items-center justify-center p-4">
              <p className="font-bold text-primary text-center">ISRO</p>
            </div>
            <div className="w-32 h-32 bg-card/50 rounded-lg flex items-center justify-center p-4">
              <p className="font-bold text-primary text-center">Government of India</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Historical Disasters Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-destructive mb-4 font-[family-name:var(--font-playfair)]">
              Historical Disasters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Past GLOF events that underscore the need for a system like GlacierWatch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Chamoli Disaster 2021
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A glacial lake outburst flood in Uttarakhand killed over 200 people and destroyed critical infrastructure, highlighting the urgent need for early warning systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Kedarnath Tragedy 2013
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Flash floods caused by glacier melt and cloud bursts resulted in thousands of casualties and massive destruction across the region.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Infographic */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                How GlacierWatch Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI-powered system processes satellite data to detect dangerous changes in glacial lakes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Satellite className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Satellite Data</h3>
                <p className="text-muted-foreground text-sm">
                  Continuous monitoring of glacial lakes using high-resolution satellite imagery and DEM data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">AI/ML Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced machine learning algorithms analyze NDWI patterns and detect risk indicators
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">QGIS Processing</h3>
                <p className="text-muted-foreground text-sm">
                  Geospatial analysis and flood modeling to predict potential impact zones
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-destructive-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">Early Alerts</h3>
                <p className="text-muted-foreground text-sm">
                  Real-time warnings sent to communities, government agencies, and disaster response teams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6 font-[family-name:var(--font-playfair)]">
                Critical Statistics
              </h2>
              <p className="text-lg text-muted-foreground">
                Understanding the scale of the glacier flood threat across the Himalayas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <Card className="text-center border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary mb-2">2000+</CardTitle>
                  <CardDescription className="text-lg">Himalayan Lakes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Glacial lakes monitored across the Himalayan region using satellite technology
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-destructive mb-2">350+</CardTitle>
                  <CardDescription className="text-lg">Dangerous Lakes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    High-risk glacial lakes identified as potentially dangerous for outburst floods
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-secondary/20 bg-secondary/5">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-secondary mb-2">20M+</CardTitle>
                  <CardDescription className="text-lg">People at Risk</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lives potentially affected by glacial lake outburst floods in downstream areas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
              Stay Informed, Stay Safe
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get real-time alerts and access our comprehensive monitoring dashboard to protect your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Access Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Subscribe to Alerts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary-foreground" />
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
  )
}
