'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  color: string
}

interface ParticleBackgroundProps {
  className?: string
  particleCount?: number
  colors?: string[]
}

export default function ParticleBackground({
  className = '',
  particleCount = 80,
  colors = ['#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0']
}: ParticleBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Mouse position as motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Track mouse position
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1
      mouseX.set(normalizedX)
      mouseY.set(normalizedY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, prefersReducedMotion])

  // Transform mouse position to rotation (inverted for natural feel)
  const rotateX = useTransform(mouseY, [-1, 1], [8, -8])  // Inverted Y
  const rotateY = useTransform(mouseX, [-1, 1], [-8, 8])  // Inverted X

  // Add spring physics for the "floaty" feel
  const smoothRotateX = useSpring(rotateX, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  })
  const smoothRotateY = useSpring(rotateY, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  })

  // Generate particles in a radial pattern
  const particles = useMemo(() => {
    const items: Particle[] = []
    const rings = 8 // Number of concentric rings

    for (let ring = 1; ring <= rings; ring++) {
      const radius = (ring / rings) * 50 // Percentage from center
      const particlesInRing = Math.floor(6 + ring * 3) // More particles in outer rings

      for (let i = 0; i < particlesInRing; i++) {
        const angle = (i / particlesInRing) * Math.PI * 2
        const jitter = (Math.random() - 0.5) * 5 // Add some randomness

        items.push({
          id: items.length,
          x: 50 + Math.cos(angle) * radius + jitter,
          y: 50 + Math.sin(angle) * radius + jitter,
          size: 2 + Math.random() * 4,
          opacity: 0.3 + (1 - ring / rings) * 0.5, // Brighter in center
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    // Add some random scattered particles
    for (let i = 0; i < 20; i++) {
      items.push({
        id: items.length,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    return items
  }, [colors])

  if (prefersReducedMotion) {
    // Static version for reduced motion
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-radial from-emerald-900/20 via-transparent to-transparent" />
      </div>
    )
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Radial gradient base */}
        <div className="absolute inset-0 bg-gradient-radial from-emerald-900/30 via-emerald-950/20 to-transparent" />

        {/* Particle dots */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translateZ(${particle.size * 10}px)`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}

        {/* Central glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            transform: 'translateZ(50px)',
          }}
        />
      </motion.div>
    </div>
  )
}
