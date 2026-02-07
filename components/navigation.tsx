"use client"

import { AlertTriangle, Bell, LogOut, Home, Info, AlertCircle, Map, BarChart3, Activity, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!isAuthenticated) {
    return null
  }

  const isAdmin = user?.role === 'admin'

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { href: "/", label: "Home", icon: Home },
        { href: "/alerts", label: "Alerts", icon: AlertCircle },
        { href: "/risk-map", label: "Risk Map", icon: Map },
        { href: "/about", label: "About", icon: Info },
        { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
        { href: "/impacts", label: "Impacts", icon: Activity },
        { href: "/monitoring", label: "Monitoring", icon: Settings },
      ]
    } else {
      return [
          { href: "/", label: "Home", icon: Home },
          { href: "/alerts", label: "Alerts", icon: AlertCircle },
        { href: "/impacts", label: "Impacts", icon: Activity },
                { href: "/about", label: "About", icon: Info }
      ]
    }
  }

  const navItems = getNavItems()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="flex items-center space-x-2 p-6 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
          GlacierWatch
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-border">
        <Link href="/profile" className="flex items-center space-x-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profile_picture ? `http://localhost:8001${user.profile_picture}` : undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2 mr-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
            GlacierWatch
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Desktop User Info & Logout */}
        <div className="hidden md:flex items-center space-x-4">
           <Link href="/profile" className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profile_picture ? `http://localhost:8001${user.profile_picture}` : undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-sm">
                 <p className="font-medium hover:underline">{user?.name}</p>
              </div>
           </Link>
           <Button
              variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
             </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
