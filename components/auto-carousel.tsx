"use client"

import * as React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function AutoCarousel() {
  const [api, setApi] = React.useState<import("@/components/ui/carousel").CarouselApi | null>(null)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (!api) return
    const interval = setInterval(() => {
      if (!paused) api.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [api, paused])

  const images = [
    { src: "/Himalayas.jpg", alt: "Himalayan glacier range" },
    { src: "/Gemini_Generated_Image_3bm8mh3bm8mh3bm8.png", alt: "Monitoring visualization" },
    { src: "/generated-image.png", alt: "Community and monitoring" },
  ]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="rounded-lg overflow-hidden border border-border bg-background">
                <div className="relative w-full h-64 md:h-80">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  )
}