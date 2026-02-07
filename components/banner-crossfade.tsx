"use client"

import * as React from "react"

// Default images used by the banner slideshow. You can edit these or
// pass a custom list via the component props.
export const DEFAULT_BANNER_IMAGES = [
  "/Himalayas.jpg",
  "/186b8f80-3852-51b8-8315-20ab5286ab8d.jpg",
  "/Gemini_Generated_Image_vrc7avvrc7avvrc7.png",
  "/Gemini_Generated_Image_ox23faox23faox23.png",
  "/Gemini_Generated_Image_3bm8mh3bm8mh3bm8.png",
  "/aweinspiring-glacier-portraits-unveiling-majestic-ice-formations-tibets-himalayas-china-experience-raw-untamed-beauty-tibet-359043428.webp",
  "/generated-image.png",
  "/himalayan-glacier-lake-with-snow-capped-mountains-.jpg",
]

type BannerBackgroundProps = {
  images?: string[]
  intervalMs?: number // time each image stays visible
  transitionMs?: number // crossfade duration
  easing?: string // CSS timing function, e.g. 'ease-in-out'
}

export default function BannerBackground({
  images = DEFAULT_BANNER_IMAGES,
  intervalMs = 3000,
  transitionMs = 800,
  easing = "ease-in-out",
}: BannerBackgroundProps) {
  // Two-layer crossfade state
  const [showA, setShowA] = React.useState(true)
  const [imgA, setImgA] = React.useState(images[0] ?? "")
  const [imgB, setImgB] = React.useState(images[1] ?? images[0] ?? "")
  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Preload images
  React.useEffect(() => {
    images.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [images])

  React.useEffect(() => {
    if (images.length === 0) return

    const id = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length

      // Prepare the hidden layer with the upcoming image
      if (showA) {
        setImgB(images[nextIndex])
      } else {
        setImgA(images[nextIndex])
      }

      // Trigger crossfade
      setShowA((s) => !s)

      // After the fade completes, commit the currentIndex
      const commitId = setTimeout(() => {
        setCurrentIndex(nextIndex)
      }, transitionMs)

      return () => clearTimeout(commitId)
    }, intervalMs)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, currentIndex, intervalMs, transitionMs, showA])

  return (
    <div className="absolute inset-0 bg-black">
      {/* Layer A */}
      <div
        className={"absolute inset-0"}
        style={{
          backgroundImage: `url('${imgA}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transitionProperty: "opacity",
          transitionDuration: `${transitionMs}ms`,
          transitionTimingFunction: easing,
          willChange: "opacity",
          filter: "contrast(105%) saturate(110%)",
          opacity: showA ? 1 : 0,
        }}
      />

      {/* Layer B */}
      <div
        className={"absolute inset-0"}
        style={{
          backgroundImage: `url('${imgB}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transitionProperty: "opacity",
          transitionDuration: `${transitionMs}ms`,
          transitionTimingFunction: easing,
          willChange: "opacity",
          filter: "contrast(105%) saturate(110%)",
          opacity: showA ? 0 : 1,
        }}
      />

      {/* Tint/gradient overlay to match original styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-transparent pointer-events-none" />
    </div>
  )
}