# Scroll Animation Analysis & Implementation Guide

## 📊 Analysis of Premium Scroll Effects

Based on analysis of [Salpha Energy](https://salphaenergy.com/) and Apple-style websites, here are the key scroll effects and techniques used:

### **1. Smooth Scroll (Lenis/Locomotive Scroll)**
- **What it does**: Replaces native browser scroll with smooth, momentum-based scrolling
- **Effect**: Buttery smooth 60fps scrolling experience
- **Libraries**: 
  - `lenis` - Lightweight, performant smooth scroll
  - `locomotive-scroll` - More features, parallax built-in
  - `react-lenis` - React wrapper for Lenis

### **2. Scroll-Triggered Animations (Framer Motion/GSAP)**
- **What it does**: Animates elements as they enter/exit viewport
- **Effects**: Fade-in, slide-up, scale, rotate
- **Libraries**:
  - `framer-motion` - React-first, easy to use
  - `@react-spring/web` - Physics-based animations
  - `gsap` + `ScrollTrigger` - Most powerful, complex

### **3. Parallax Effects**
- **What it does**: Background/images move at different speeds
- **Effect**: Creates depth and immersion
- **Implementation**: 
  - CSS `transform: translateY()` based on scroll
  - Libraries: `react-spring`, `react-parallax`, `react-scroll-parallax`

### **4. Sticky Sections**
- **What it does**: Sections stick to viewport while scrolling
- **Effect**: Creates immersive full-screen sections
- **Implementation**: CSS `position: sticky` + scroll detection

### **5. Scroll Progress Indicators**
- **What it does**: Shows scroll progress (top bar, percentage)
- **Effect**: Visual feedback on page position
- **Implementation**: Custom hook + scroll listener

### **6. Image Reveal on Scroll**
- **What it does**: Images load/reveal as you scroll
- **Effect**: Performance + visual interest
- **Implementation**: Intersection Observer + CSS masks/clips

---

## 🎯 Recommended Stack for Your Project

### **Primary Choice: Framer Motion + Lenis**

**Why:**
- ✅ React-first (works perfectly with Next.js)
- ✅ Easy to learn and implement
- ✅ Great performance
- ✅ Excellent TypeScript support
- ✅ Active community

**Packages:**
```json
{
  "framer-motion": "^10.16.16",
  "lenis": "^0.1.24",
  "react-lenis": "^1.0.3"
}
```

### **Alternative: GSAP (More Powerful)**

**Why:**
- ✅ Most powerful animation library
- ✅ ScrollTrigger plugin is industry standard
- ✅ More complex but more control
- ⚠️ Steeper learning curve
- ⚠️ Larger bundle size

**Packages:**
```json
{
  "gsap": "^3.12.2",
  "@studio-freight/lenis": "^1.0.42"
}
```

---

## 🛠️ Implementation Plan

### **Phase 1: Smooth Scroll (Lenis)**

```typescript
// lib/smooth-scroll.ts
import Lenis from 'lenis'

export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 2,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
```

### **Phase 2: Scroll Animations (Framer Motion)**

```typescript
// components/ScrollReveal.tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### **Phase 3: Parallax Effects**

```typescript
// hooks/useParallax.ts
import { useScroll, useTransform } from 'framer-motion'

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}
```

### **Phase 4: Scroll Progress**

```typescript
// hooks/useScrollProgress.ts
import { useScroll } from 'framer-motion'

export function useScrollProgress() {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}
```

---

## 📦 Installation Commands

```bash
cd apps/energy-platform/frontend

# Option 1: Framer Motion + Lenis (Recommended)
npm install framer-motion lenis react-lenis

# Option 2: GSAP (More Powerful)
npm install gsap @studio-freight/lenis
```

---

## 🎨 Common Scroll Effects Breakdown

### **1. Fade In Up (Most Common)**
```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### **2. Parallax Background**
```tsx
const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

<motion.div style={{ y }}>
  Background Image
</motion.div>
```

### **3. Sticky Section**
```tsx
<motion.section
  style={{ position: 'sticky', top: 0 }}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
>
  Content
</motion.section>
```

### **4. Scale on Scroll**
```tsx
const { scrollYProgress } = useScroll()
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

<motion.div style={{ scale }}>
  Image
</motion.div>
```

### **5. Text Reveal**
```tsx
<motion.h1
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ staggerChildren: 0.1 }}
>
  {text.split(' ').map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      {word}{' '}
    </motion.span>
  ))}
</motion.h1>
```

---

## 🚀 Quick Implementation Steps

1. **Install packages**
2. **Set up Lenis smooth scroll**
3. **Create reusable animation components**
4. **Add scroll-triggered animations to sections**
5. **Implement parallax effects**
6. **Add scroll progress indicator**

---

## 💡 Best Practices

1. **Performance**: Use `viewport={{ once: true }}` to animate only once
2. **Easing**: Use custom easing curves for premium feel
3. **Threshold**: Set appropriate `margin` for when animations trigger
4. **Stagger**: Use staggered animations for lists
5. **Reduce Motion**: Respect `prefers-reduced-motion`

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lenis Smooth Scroll](https://github.com/studio-freight/lenis)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Apple Scroll Effects Analysis](https://tympanus.net/codrops/)

