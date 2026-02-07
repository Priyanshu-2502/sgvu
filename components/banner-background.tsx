"use client"

import * as React from "react"

const bannerImages = [
  "/Himalayas.jpg",
  "/186b8f80-3852-51b8-8315-20ab5286ab8d.jpg",
  "/Gemini_Generated_Image_vrc7avvrc7avvrc7.png",
  "/Gemini_Generated_Image_ox23faox23faox23.png",
  "/Gemini_Generated_Image_3bm8mh3bm8mh3bm8.png",
  "/aweinspiring-glacier-portraits-unveiling-majestic-ice-formations-tibets-himalayas-china-experience-raw-untamed-beauty-tibet-359043428.webp",
  "/generated-image.png",
  "/himalayan-glacier-lake-with-snow-capped-mountains-.jpg",
]

export default function BannerBackground() {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    // Preload images to avoid flicker between slides
    bannerImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % bannerImages.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background"
      style={{
        backgroundImage: `url('${bannerImages[index]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.9,
      }}
    />
  )
}