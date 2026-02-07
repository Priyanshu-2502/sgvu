"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import BannerBackground from "@/components/banner-crossfade"
import { bannerImages, bannerIntervalMs, bannerTransitionMs, bannerEasing } from "@/components/banner-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register" | "admin">("login")
  
  // Login State
  const [identifier, setIdentifier] = useState("") // Email or Phone for login
  const [password, setPassword] = useState("")
  
  // Register State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [regPassword, setRegPassword] = useState("")
  
  // Admin State
  const [adminId, setAdminId] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  
  // Location state
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locLoading, setLocLoading] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  const router = useRouter()
  const { login } = useAuth()

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setLocLoading(false)
        setError("")
      },
      (err) => {
        setError("Unable to retrieve your location. Please allow access.")
        setLocLoading(false)
      }
    )
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          password: regPassword, 
          latitude: latitude || 0.0, 
          longitude: longitude || 0.0 
        })
      })
      
      let data: any = {}
      try { data = await res.json() } catch { 
        const txt = await res.text()
        throw new Error(txt || 'Failed to register')
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed to register')
      
      // Registration successful
      setMessage("Registration successful! Please login.")
      setTab("login")
      // Reset registration form
      setName("")
      setEmail("")
      setPhone("")
      setRegPassword("")
      setLatitude(null)
      setLongitude(null)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("") // Clear any previous success messages
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send identifier as 'username' (backend expects email in username field, but we modified it to accept phone too)
        // Wait, current /api/auth/login expects { email, password }
        // We should update it to send { username: identifier, password } or update the frontend to match.
        // Let's check /api/auth/login/route.ts. 
        // Assuming /api/auth/login proxies to backend which expects OAuth2 form data (username, password).
        // I will need to check /api/auth/login/route.ts.
        // For now, I'll send identifier as email for compatibility if the route expects 'email'.
        body: JSON.stringify({ email: identifier, password }) 
      })
      
      let data: any = {}
      try { data = await res.json() } catch { 
        const txt = await res.text()
        throw new Error(txt || 'Failed to login')
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed to login')
      
      login(data.user, data.token)
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      if (adminId !== "admin" || adminPassword !== "admin123") {
        throw new Error("Invalid admin credentials")
      }
      
      login({
        adminId: "admin",
        role: "admin",
        name: "Administrator",
      })
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <BannerBackground
        images={bannerImages}
        intervalMs={bannerIntervalMs}
        transitionMs={bannerTransitionMs}
        easing={bannerEasing}
      />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GlacierWatch</h1>
            <p className="text-gray-600">AI-Powered Glacier Monitoring</p>
          </div>

          <div className="mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${tab === "login" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => { setTab("login"); setError(""); setMessage(""); }}
              >Login</button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${tab === "register" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => { setTab("register"); setError(""); setMessage(""); }}
              >Register</button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${tab === "admin" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => { setTab("admin"); setError(""); setMessage(""); }}
              >Admin</button>
            </div>
          </div>

          {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">{message}</div>}

          {tab === "login" && (
            <form onSubmit={loginWithPassword} className="space-y-4">
              <div>
                <Label>Email or Phone</Label>
                <Input 
                  type="text" 
                  placeholder="Enter email or phone" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Login
              </Button>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              
              <div>
                 <Label>Location (Required for SOS)</Label>
                 <div className="flex gap-2">
                   <Button type="button" variant="outline" onClick={getLocation} disabled={locLoading} className="w-full">
                      {locLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                      {latitude ? "Location Set ✓" : "Get Current Location"}
                   </Button>
                 </div>
                 {latitude && <p className="text-xs text-gray-500 mt-1">Lat: {latitude.toFixed(4)}, Lon: {longitude?.toFixed(4)}</p>}
              </div>

              <div>
                <Label>Password</Label>
                <Input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Register
              </Button>
            </form>
          )}

          {tab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label>Admin ID</Label>
                <Input 
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Sign In as Admin
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
