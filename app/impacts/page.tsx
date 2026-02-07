"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  GraduationCap,
  Globe,
  Shield,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/protected-route"

export default function ImpactsPage() {
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
        <section className="py-16 lg:py-24 bg-gradient-to-br from-card to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">
                Real-World Impact
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)] text-balance">
                Protecting Lives, Empowering Communities
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
                GlacierWatch creates meaningful impact across communities, governments, and scientific institutions,
                building resilience against glacier flood disasters.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Community Impact */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-[family-name:var(--font-playfair)] text-primary">
                      Community
                    </CardTitle>
                    <CardDescription>Lives and property protection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Early warning alerts save lives through timely evacuations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Property damage prevention through advance notice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Community preparedness and resilience building</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Reduced economic losses from flood disasters</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Government Impact */}
                <Card className="border-secondary/20 bg-secondary/5">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <CardTitle className="text-xl font-[family-name:var(--font-playfair)] text-secondary">
                      Government
                    </CardTitle>
                    <CardDescription>SDRF/NDRF support systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Enhanced disaster response coordination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Data-driven policy making for risk management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Resource allocation optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Inter-agency collaboration improvement</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Scientific Impact */}
                <Card className="border-accent/20 bg-accent/5">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-xl font-[family-name:var(--font-playfair)] text-accent">
                      Scientists
                    </CardTitle>
                    <CardDescription>Research and data access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Comprehensive glacial lake datasets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Advanced AI/ML models for research</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Climate change impact studies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Collaborative research opportunities</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Global Impact */}
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-destructive-foreground" />
                    </div>
                    <CardTitle className="text-xl font-[family-name:var(--font-playfair)] text-destructive">
                      Global
                    </CardTitle>
                    <CardDescription>Worldwide scaling potential</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Nepal and Bhutan expansion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Western Ghats monitoring systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Arctic glacier surveillance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>International collaboration framework</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6 font-[family-name:var(--font-playfair)]">
                  Measurable Impact
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Quantifying the real-world benefits of our glacier monitoring and early warning system
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center border-primary/20">
                  <CardContent className="p-6">
                    <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                    <div className="text-sm text-muted-foreground">Lives Protected</div>
                    <div className="text-xs text-muted-foreground mt-1">Through early warning alerts</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-secondary/20">
                  <CardContent className="p-6">
                    <Building2 className="w-12 h-12 text-secondary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-secondary mb-2">₹500Cr</div>
                    <div className="text-sm text-muted-foreground">Property Saved</div>
                    <div className="text-xs text-muted-foreground mt-1">Prevented damage value</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-accent/20">
                  <CardContent className="p-6">
                    <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
                    <div className="text-3xl font-bold text-accent mb-2">25</div>
                    <div className="text-sm text-muted-foreground">Research Papers</div>
                    <div className="text-xs text-muted-foreground mt-1">Published using our data</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-destructive/20">
                  <CardContent className="p-6">
                    <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <div className="text-3xl font-bold text-destructive mb-2">15</div>
                    <div className="text-sm text-muted-foreground">Government Agencies</div>
                    <div className="text-xs text-muted-foreground mt-1">Using our alert system</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Chamoli 2021 Case Study */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                  Case Study: Chamoli Flood 2021
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Analyzing the devastating Chamoli disaster and how GlacierWatch could have made a difference
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                        <div>
                          <CardTitle className="text-destructive">The Disaster</CardTitle>
                          <CardDescription>February 7, 2021</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Location</h4>
                            <p className="text-sm text-muted-foreground">
                              Rishiganga and Dhauliganga valleys, Uttarakhand
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Casualties</h4>
                            <p className="text-sm text-muted-foreground">200+ lives lost, 400+ missing</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Infrastructure</h4>
                            <p className="text-sm text-muted-foreground">
                              Hydropower projects destroyed, bridges washed away
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-primary" />
                        <div>
                          <CardTitle className="text-primary">GlacierWatch Solution</CardTitle>
                          <CardDescription>How we could have helped</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Early Detection</h4>
                            <p className="text-sm text-muted-foreground">
                              AI monitoring would have detected unstable conditions 24-48 hours earlier
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Automated Alerts</h4>
                            <p className="text-sm text-muted-foreground">
                              Immediate notifications to NDRF, local authorities, and communities
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">Evacuation Planning</h4>
                            <p className="text-sm text-muted-foreground">
                              Flood path modeling would have guided safe evacuation routes
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Case Study Map Overlay */}
              <div className="mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Chamoli Flood Impact Analysis</CardTitle>
                    <CardDescription className="text-center">
                      Satellite imagery and flood path reconstruction showing the disaster's extent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Interactive Case Study Map</p>
                        <p className="text-sm text-muted-foreground">
                          Showing flood path, affected areas, and potential early warning zones
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6 font-[family-name:var(--font-playfair)]">
                  Success Stories
                </h2>
                <p className="text-lg text-muted-foreground">
                  Real examples of how GlacierWatch has made a difference in communities
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-primary mb-3" />
                    <CardTitle className="text-lg">Sikkim Alert Success</CardTitle>
                    <CardDescription>March 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Early warning system detected rising water levels in Imja Lake, triggering evacuation of 500
                      families 18 hours before potential breach.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      500 Lives Saved
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-secondary mb-3" />
                    <CardTitle className="text-lg">Himachal Prevention</CardTitle>
                    <CardDescription>August 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      AI analysis identified critical NDWI changes in Tsho Rolpa, enabling preemptive drainage operations
                      that prevented major flooding.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Disaster Prevented
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Calendar className="w-10 h-10 text-accent mb-3" />
                    <CardTitle className="text-lg">Research Breakthrough</CardTitle>
                    <CardDescription>September 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our dataset enabled breakthrough research on glacier dynamics, published in Nature Climate Change,
                      advancing global understanding.
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Scientific Impact
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 font-[family-name:var(--font-playfair)]">
                Join the Impact
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Be part of the solution. Whether you're a researcher, government official, or community leader, there are
                ways to contribute to glacier flood prevention.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8">
                  Partner With Us
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Access Research Data
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-12">
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
    </ProtectedRoute>
  )
}
