'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface GalleryItem {
  image: string
  title: string
  description?: string
}

interface ScrollGalleryProps {
  items: GalleryItem[]
  className?: string
}

export function ScrollGallery({ items, className = '' }: ScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const scrollHeight = items.length * 100

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Create smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  })

  // Debug: State for displaying values
  const [debugProgress, setDebugProgress] = useState(0)
  const [debugImageIndex, setDebugImageIndex] = useState(0)

  // Debug: Log scroll progress and update state
  useEffect(() => {
    const unsubscribeProgress = scrollYProgress.on('change', (latest) => {
      setDebugProgress(latest)
    })
    
    const unsubscribeSmooth = smoothProgress.on('change', (latest) => {
      const clampedProgress = Math.max(0, Math.min(1, latest))
      const imageIndex = Math.min(Math.floor(clampedProgress * items.length), items.length - 1)
      setDebugImageIndex(imageIndex)
    })
    
    return () => {
      unsubscribeProgress()
      unsubscribeSmooth()
    }
  }, [scrollYProgress, smoothProgress, items.length])

  // Create transforms for each image
  const imageTransforms = items.map((_, index) => {
    const opacity = useTransform(smoothProgress, (progress) => {
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const currentIndex = clampedProgress * items.length
      const distance = Math.abs(currentIndex - index)
      
      if (distance < 0.3) {
        return Math.max(0, 1 - (distance / 0.3))
      }
      return 0
    })

    const scale = useTransform(smoothProgress, (progress) => {
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const currentIndex = clampedProgress * items.length
      const distance = Math.abs(currentIndex - index)
      
      if (distance < 0.3) {
        return Math.max(0.98, 1 - (distance / 0.3) * 0.02)
      }
      return 0.98
    })

    return { opacity, scale }
  })

  // Calculate active dot for progress indicator
  const activeDotIndex = useTransform(smoothProgress, (progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    return Math.min(Math.floor(clampedProgress * items.length), items.length - 1)
  })

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`} 
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Debug Info */}
      <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg z-[200] text-xs font-mono pointer-events-none">
        <div>Scroll Progress: {debugProgress.toFixed(3)}</div>
        <div>Current Image: {debugImageIndex + 1}/{items.length}</div>
        <div>Container Height: {scrollHeight}vh</div>
      </div>

      {/* Sticky container - INSIDE scroll container, locks viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-[100]">
        {items.map((item, index) => {
          const { opacity, scale } = imageTransforms[index]
          
          return (
            <motion.div
              key={index}
              className="absolute inset-0 h-full w-full"
              style={{
                opacity,
                scale,
                zIndex: items.length - index,
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
                sizes="100vw"
                unoptimized={item.image.includes('unsplash')}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                  className="text-center px-6 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-h1 md:text-display font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-body-lg md:text-h4 text-white/90">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )
        })}
        
        {/* Progress indicator dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center space-x-2">
            {items.map((_, index) => {
              const width = useTransform(activeDotIndex, (active) => 
                active === index ? 24 : 8
              )
              const bgColor = useTransform(activeDotIndex, (active) => 
                active === index ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'
              )
              
              return (
                <motion.div
                  key={index}
                  className="h-1.5 rounded-full"
                  style={{
                    width,
                    backgroundColor: bgColor,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
