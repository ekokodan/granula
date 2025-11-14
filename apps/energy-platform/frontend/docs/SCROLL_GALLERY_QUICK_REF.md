# Scroll Gallery Quick Reference

## Minimal Implementation

```tsx
'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export function ScrollGallery({ items }) {
  const containerRef = useRef(null)
  const scrollHeight = items.length * 100

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
  })

  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {items.map((item, index) => {
          const opacity = useTransform(smoothProgress, (p) => {
            const current = Math.max(0, Math.min(1, p)) * items.length
            const distance = Math.abs(current - index)
            return distance < 0.3 ? 1 - (distance / 0.3) : 0
          })

          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              style={{ opacity, zIndex: items.length - index }}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
```

## Key Rules

1. **Container height** = `items.length * 100vh` (creates scroll space)
2. **Sticky container** must be **inside** scroll container
3. **Sticky** uses `top-0` to lock viewport
4. **Images** overlay each other with `absolute` positioning
5. **Opacity** calculated from scroll progress (0-1) × items.length

## Formula

```
scrollProgress (0-1) → currentImageIndex (0-items.length)
currentImageIndex - imageIndex = distance
opacity = distance < 0.3 ? 1 - (distance / 0.3) : 0
```

## Common Mistakes

❌ Sticky container outside scroll container  
❌ Wrong container height calculation  
❌ Missing `ref` on scroll container  
❌ Images not absolutely positioned  
❌ Wrong z-index order  

## Checklist

- [ ] Scroll container has `ref={containerRef}`
- [ ] Scroll container height = `items.length * 100vh`
- [ ] Sticky container is **inside** scroll container
- [ ] Sticky container has `sticky top-0`
- [ ] Images are `absolute` positioned
- [ ] Images have correct `zIndex` order
- [ ] `useScroll` target points to scroll container
- [ ] `useTransform` calculates opacity from progress

