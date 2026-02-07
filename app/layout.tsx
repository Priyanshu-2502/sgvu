import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Script from "next/script"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Glacier Watch - AI-Powered Glacier Monitoring & Disaster Prevention",
  description: "Advanced AI-powered glacier monitoring and disaster prevention platform for the Himalayan region",
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${inter.variable} bg-background text-foreground`}>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
        {/* Botpress Webchat scripts */}
        <Script
          src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
          strategy="afterInteractive"
        />
        {/* Robust loader: wait for injector readiness (window.botpress), then attach init script */}
        <Script id="botpress-init-loader" strategy="afterInteractive">
          {`
            (function () {
              function loadInitScript() {
                var s = document.createElement('script');
                s.src = 'https://files.bpcontent.cloud/2025/09/26/18/20250926181214-KTDHQRTS.js';
                s.async = true;
                document.body.appendChild(s);
              }

              function isReady() {
                return !!(window.botpress && typeof window.botpress.init === 'function');
              }

              // Try immediate, then poll up to ~30s
              if (isReady()) {
                loadInitScript();
                return;
              }

              var attempts = 0;
              var maxAttempts = 60; // ~30s at 500ms
              var interval = setInterval(function () {
                attempts++;
                if (isReady()) {
                  clearInterval(interval);
                  loadInitScript();
                } else if (attempts >= maxAttempts) {
                  clearInterval(interval);
                  console.warn('Botpress injector not ready after 30s; chatbot may be unavailable.');
                }
              }, 500);
            })();
          `}
        </Script>
        {/* Auto-open the chat bubble once webchat API is available */}
        <Script id="botpress-auto-open" strategy="afterInteractive">
          {`
            (function () {
              var tries = 0;
              var max = 60; // ~30s at 500ms
              var tick = setInterval(function () {
                tries++;
                var w = window.botpress;
                if (w && typeof w.open === 'function') {
                  try { w.open(); } catch (e) {}
                  clearInterval(tick);
                } else if (tries >= max) {
                  clearInterval(tick);
                }
              }, 500);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
