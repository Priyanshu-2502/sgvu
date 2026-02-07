"use client"

import * as React from "react"
import Image from "next/image"

export const DEFAULT_BANNER_IMAGES = [
  "/Himalayas.jpg",
  "/186b8f80-3852-51b8-8315-20ab5286ab8d.jpg",
  "/Gemini_Generated_Image_vrc7avvrc7avvrc7.png",
  "/Gemini_Generated_Image_ox23faox23faox23.png",
  "/Gemini_Generated_Image_3bm8mh3bm8mh3bm8.png",
  "/generated-image.png",
  "/himalayan-glacier-lake-with-snow-capped-mountains-.jpg",
]

type BannerSlideProps = {
  images?: string[]
  intervalMs?: number
  transitionMs?: number
  easing?: string
}

export default function BannerSlide({
  images = DEFAULT_BANNER_IMAGES,
  intervalMs = 3000,
  transitionMs = 800,
  easing = "ease-in-out",
}: BannerSlideProps) {
  const [showA, setShowA] = React.useState(true)
  const [imgA, setImgA] = React.useState(images[0] ?? "")
  const [imgB, setImgB] = React.useState(images[1] ?? images[0] ?? "")
  const idxRef = React.useRef(0)
  const [animating, setAnimating] = React.useState(false)
  const timerRef = React.useRef<number | null>(null)

  // Preload images to avoid flashes
  React.useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [images])

  // Reset when images change
  React.useEffect(() => {
    setImgA(images[0] ?? "")
    setImgB(images[1] ?? images[0] ?? "")
    idxRef.current = 0
    setShowA(true)
  }, [images])

  React.useEffect(() => {
    const tick = () => {
      if (images.length === 0) return
      const nextIndex = (idxRef.current + 1) % images.length
      const nextSrc = images[nextIndex]

      // Preload the next image and only start animation once it’s ready
      const preload = new window.Image()
      preload.src = nextSrc
      const startSlide = (src: string) => {
        if (showA) {
          setImgB(src)
        } else {
          setImgA(src)
        }
        setAnimating(true)
        window.setTimeout(() => {
          setAnimating(false)
          setShowA((prev) => !prev)
          idxRef.current = nextIndex
          // Schedule next tick after the slide completes and the display interval elapses
          timerRef.current = window.setTimeout(tick, intervalMs)
        }, transitionMs)
      }
      preload.onload = () => startSlide(nextSrc)
      // If the next image fails, reuse the current visible image to avoid a blank slide
      const fallbackSrc = showA ? imgA : imgB
      preload.onerror = () => startSlide(fallbackSrc || "/placeholder.svg")
    }

    timerRef.current = window.setTimeout(tick, intervalMs)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [images, intervalMs, transitionMs, showA])

  // Compute transforms for sliding
  const aTransform = animating
    ? showA
      ? "translateX(-100%)"
      : "translateX(0)"
    : showA
    ? "translateX(0)"
    : "translateX(-100%)"

  const bTransform = animating
    ? showA
      ? "translateX(0)"
      : "translateX(100%)"
    : showA
    ? "translateX(100%)"
    : "translateX(0)"

  return (
    <div className="absolute inset-0 relative overflow-hidden">
      {/* Layer A */}
      <Image
        src={imgA || "/placeholder.svg"}
        alt="Banner image"
        fill
        priority
        quality={100}
        sizes="100vw"
        style={{
          objectFit: "cover",
          transform: aTransform,
          transition: `transform ${transitionMs}ms ${easing}`,
          willChange: "transform",
          filter: "contrast(105%) saturate(110%)",
        }}
      />

      {/* Layer B */}
      <Image
        src={imgB || "/placeholder.svg"}
        alt="Banner image"
        fill
        priority
        quality={100}
        sizes="100vw"
        style={{
          objectFit: "cover",
          transform: bTransform,
          transition: `transform ${transitionMs}ms ${easing}`,
          willChange: "transform",
          filter: "contrast(105%) saturate(110%)",
        }}
      />

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-transparent pointer-events-none" />
    </div>
  )
}