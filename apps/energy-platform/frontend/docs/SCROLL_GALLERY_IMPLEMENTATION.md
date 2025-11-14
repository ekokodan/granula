# Scroll Gallery Implementation Guide

## Overview

This guide explains how to implement a **sticky scroll gallery** feature where:
- When a user scrolls into a gallery section, the viewport locks
- Scrolling through the section changes images smoothly
- After all images are viewed, normal scrolling resumes
- Similar to Apple.com and Salpha Energy website experiences

## Core Concept

The feature uses **CSS `position: sticky`** combined with **Framer Motion's `useScroll`** hook:

1. **Scroll Container**: Creates scroll space (e.g., `500vh` for 5 images)
2. **Sticky Container**: Sticks to viewport top while scrolling through the container
3. **Scroll Progress**: Tracks progress from 0 to 1 as you scroll through the container
4. **Image Transitions**: Images fade/scale based on scroll progress

## Architecture

```
┌─────────────────────────────────────┐
│ Container (500vh height)            │ ← Creates scroll space
│ ┌─────────────────────────────────┐ │
│ │ Sticky Container (sticky top-0) │ │ ← Locks viewport
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Image 1 (opacity: 1)        │ │ │
│ │ │ Image 2 (opacity: 0)        │ │ │ ← Overlay images
│ │ │ Image 3 (opacity: 0)        │ │ │
│ │ │ Image 4 (opacity: 0)        │ │ │
│ │ │ Image 5 (opacity: 0)        │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Step-by-Step Implementation

### 1. Install Dependencies

```bash
npm install framer-motion
# or
yarn add framer-motion
```

### 2. Component Structure

```tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image' // or regular <img> tag
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
  
  // Calculate scroll height (100vh per image)
  const scrollHeight = items.length * 100

  // Track scroll progress through container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  })

  // ... rest of implementation
}
```

### 3. Create Scroll Container

The container creates the scrollable space:

```tsx
<div 
  ref={containerRef} 
  className="relative w-full" 
  style={{ height: `${scrollHeight}vh` }}
/>
```

**Key Points:**
- `ref={containerRef}` - Required for `useScroll` to track
- `height: ${scrollHeight}vh` - Creates scroll space (e.g., 500vh for 5 images)
- This container is invisible but creates the scroll distance

### 4. Create Sticky Container

The sticky container locks the viewport:

```tsx
<div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-[100]">
  {/* Images go here */}
</div>
```

**Key Points:**
- `sticky top-0` - Sticks to top of viewport
- `h-screen` - Full viewport height
- `overflow-hidden` - Prevents scrollbars
- `z-[100]` - Ensures it's above other content
- **MUST be inside** the scroll container for sticky to work

### 5. Calculate Image Transforms

For each image, calculate opacity and scale based on scroll progress:

```tsx
const imageTransforms = items.map((_, index) => {
  // Calculate opacity: fade in/out based on distance from current image
  const opacity = useTransform(smoothProgress, (progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    const currentIndex = clampedProgress * items.length
    const distance = Math.abs(currentIndex - index)
    
    // Fade transition within 0.3 of an image
    if (distance < 0.3) {
      return Math.max(0, 1 - (distance / 0.3))
    }
    return 0
  })

  // Calculate scale: slight zoom effect
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
```

**How it works:**
- `progress` goes from 0 to 1 as you scroll through container
- `currentIndex = progress * items.length` - which image should be visible
- `distance` - how far current image is from this image
- Images fade in/out smoothly as you scroll

### 6. Render Images

```tsx
{items.map((item, index) => {
  const { opacity, scale } = imageTransforms[index]
  
  return (
    <motion.div
      key={index}
      className="absolute inset-0 h-full w-full"
      style={{
        opacity,
        scale,
        zIndex: items.length - index, // Later images on top
      }}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        priority={index === 0}
        sizes="100vw"
      />
      
      {/* Optional: Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h3>{item.title}</h3>
      </div>
    </motion.div>
  )
})}
```

**Key Points:**
- All images are `absolute` positioned, overlaying each other
- `zIndex` ensures correct stacking order
- `opacity` and `scale` animate based on scroll progress

### 7. Complete Component

```tsx
'use client'

import { useRef } from 'react'
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  })

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

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className}`} 
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Sticky container - INSIDE scroll container */}
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
                sizes="100vw"
              />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
```

## Usage

```tsx
<ScrollGallery
  items={[
    {
      image: "https://example.com/image1.jpg",
      title: "Image 1",
      description: "Description 1"
    },
    {
      image: "https://example.com/image2.jpg",
      title: "Image 2",
      description: "Description 2"
    },
    // ... more items
  ]}
/>
```

## Key Configuration Options

### Scroll Height Per Image

```tsx
const scrollHeight = items.length * 100 // 100vh per image
// Or customize:
const scrollHeight = items.length * 150 // 150vh per image (slower transitions)
```

### Transition Smoothness

```tsx
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 300,  // Higher = faster response
  damping: 40,     // Higher = less bounce
  restDelta: 0.001 // When to stop animating
})
```

### Fade Transition Distance

```tsx
if (distance < 0.3) { // 0.3 = 30% of image transition
  return Math.max(0, 1 - (distance / 0.3))
}
// Change 0.3 to 0.5 for longer fade transitions
```

### Scroll Offset

```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end start'],
  // Options:
  // 'start start' - Start tracking when container top hits viewport top
  // 'end start' - Stop tracking when container bottom hits viewport top
  // 'start end' - Start when container top hits viewport bottom
  // 'end end' - Stop when container bottom hits viewport bottom
})
```

## Common Issues & Solutions

### Issue 1: Sticky Not Working

**Problem**: Viewport doesn't lock, page keeps scrolling

**Solution**: 
- Ensure sticky container is **inside** scroll container
- Check parent elements don't have `overflow: hidden`
- Verify `position: sticky` is applied correctly

### Issue 2: Images Not Changing

**Problem**: Stuck on first image

**Solution**:
- Verify `containerRef` is attached to scroll container
- Check `scrollYProgress` is updating (add debug logs)
- Ensure `smoothProgress` is connected to `scrollYProgress`

### Issue 3: White Space Above Gallery

**Problem**: Large gap before gallery appears

**Solution**:
- Remove padding/margin from parent section
- Ensure scroll container starts immediately
- Check for absolutely positioned headers pushing content down

### Issue 4: Images Flickering

**Problem**: Images flash or flicker during transitions

**Solution**:
- Preload all images: `priority={true}` or use `loading="eager"`
- Increase transition distance (change `0.3` to `0.5`)
- Adjust spring animation damping

### Issue 5: Scroll Progress Tracking Wrong Section

**Problem**: Progress updates when scrolling other sections

**Solution**:
- Verify `containerRef` is unique to this component
- Check `offset` configuration matches your needs
- Add detection logic to only update when in gallery (see advanced section)

## Advanced: Adding Detection Logic

If you need to prevent progress updates when not in gallery:

```tsx
const [isInGallery, setIsInGallery] = useState(false)
const clampedProgressValue = useMotionValue(0)

useEffect(() => {
  const checkPosition = () => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const inGallery = rect.top <= 0 && rect.bottom > 0
    setIsInGallery(inGallery)
  }

  window.addEventListener('scroll', checkPosition, { passive: true })
  return () => window.removeEventListener('scroll', checkPosition)
}, [])

useEffect(() => {
  const unsubscribe = scrollYProgress.on('change', (latest) => {
    if (isInGallery) {
      clampedProgressValue.set(Math.max(0, Math.min(1, latest)))
    } else {
      clampedProgressValue.set(0)
    }
  })
  
  return () => unsubscribe()
}, [isInGallery, scrollYProgress, clampedProgressValue])

const smoothProgress = useSpring(clampedProgressValue, {
  stiffness: 300,
  damping: 40,
})
```

## Performance Tips

1. **Image Optimization**: Use Next.js `Image` component or optimize images
2. **Lazy Loading**: Only load images when needed
3. **Debounce Scroll**: Use `requestAnimationFrame` for scroll handlers
4. **Reduce Re-renders**: Use `useMemo` for expensive calculations
5. **GPU Acceleration**: Ensure transforms use `transform` not `top/left`

## Browser Compatibility

- **Sticky**: Modern browsers (Chrome 56+, Firefox 32+, Safari 13+)
- **Framer Motion**: All modern browsers
- **Fallback**: For older browsers, consider `position: fixed` with scroll calculations

## Alternative Implementations

### Without Framer Motion

```tsx
useEffect(() => {
  const handleScroll = () => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, 
      (window.innerHeight - rect.top) / rect.height
    ))
    
    // Update image opacity manually
    items.forEach((_, index) => {
      const currentIndex = progress * items.length
      const distance = Math.abs(currentIndex - index)
      const opacity = distance < 0.3 ? 1 - (distance / 0.3) : 0
      // Apply opacity to image element
    })
  }
  
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [items])
```

### With GSAP ScrollTrigger

```tsx
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  items.forEach((_, index) => {
    gsap.to(`.image-${index}`, {
      opacity: index === 0 ? 1 : 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const currentIndex = Math.floor(progress * items.length)
          // Update opacity based on currentIndex
        }
      }
    })
  })
}, [items])
```

## Summary

The key to this feature is:

1. **Scroll Container**: Creates scroll space (`height: ${items.length * 100}vh`)
2. **Sticky Container**: Locks viewport (`position: sticky; top: 0`)
3. **Scroll Progress**: Tracks 0-1 through container (`useScroll`)
4. **Image Transforms**: Calculate opacity/scale based on progress (`useTransform`)
5. **Smooth Animation**: Spring animation for fluid transitions (`useSpring`)

The sticky container must be **inside** the scroll container for proper behavior.

