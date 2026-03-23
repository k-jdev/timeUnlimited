"use client"

import { useState } from "react"

interface WatchGalleryProps {
  images: string[]
  watchName: string
}

export function WatchGallery({ images, watchName }: WatchGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex flex-col gap-0.5 pt-4 lg:w-[732px] lg:shrink-0 lg:pt-[30px]">
      <div className="relative h-[300px] overflow-hidden bg-[#111113] sm:h-[400px] lg:h-[682px]">
        <img
          src={images[selectedImage]}
          alt={watchName}
          className="absolute top-1/2 left-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 object-cover sm:size-[340px] lg:size-[682px]"
          style={{ filter: "drop-shadow(0px 4px 88px rgba(0,0,0,0.64))" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-0.5 lg:flex lg:flex-wrap">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`relative h-[160px] overflow-hidden bg-[#111113] transition-opacity lg:h-[364.5px] lg:min-w-[200px] lg:flex-[1_0_0] ${
              selectedImage === i
                ? "opacity-100"
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <img
              src={img}
              alt={`${watchName} - ${i + 1}`}
              className="absolute inset-0 size-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
