# Energy Platform - Premium Design System Specification

## 🎨 Design Philosophy

**Goal**: Create a premium, Apple-inspired design system that conveys quality, trust, and sophistication for high-end energy storage solutions.

**Core Principles**:
1. **Simplicity**: Clean, uncluttered interfaces
2. **Clarity**: Clear visual hierarchy and communication
3. **Depth**: Subtle layering and depth through shadows and blur
4. **Motion**: Purposeful, smooth animations
5. **Quality**: Attention to every detail

---

## 📐 Typography System

### Font Stack
```css
/* Primary Font Stack */
font-family: 
  -apple-system, 
  BlinkMacSystemFont, 
  "SF Pro Display", 
  "SF Pro Text",
  "Helvetica Neue", 
  Helvetica, 
  Arial, 
  sans-serif;

/* Monospace (for code/data) */
font-family: 
  "SF Mono", 
  Monaco, 
  "Cascadia Code", 
  "Roboto Mono", 
  monospace;
```

### Type Scale

| Name | Size (Desktop) | Size (Mobile) | Line Height | Weight | Use Case |
|------|---------------|---------------|-------------|--------|----------|
| Display | 72px / 4.5rem | 48px / 3rem | 1.1 | 700 | Hero headlines |
| H1 | 56px / 3.5rem | 40px / 2.5rem | 1.15 | 600 | Page titles |
| H2 | 40px / 2.5rem | 32px / 2rem | 1.2 | 600 | Section headers |
| H3 | 32px / 2rem | 24px / 1.5rem | 1.25 | 600 | Subsection headers |
| H4 | 24px / 1.5rem | 20px / 1.25rem | 1.3 | 600 | Card titles |
| H5 | 20px / 1.25rem | 18px / 1.125rem | 1.35 | 600 | Small headers |
| H6 | 18px / 1.125rem | 16px / 1rem | 1.4 | 600 | Labels |
| Body Large | 20px / 1.25rem | 18px / 1.125rem | 1.5 | 400 | Large body text |
| Body | 17px / 1.0625rem | 16px / 1rem | 1.5 | 400 | Standard body |
| Body Small | 15px / 0.9375rem | 14px / 0.875rem | 1.5 | 400 | Small text |
| Caption | 13px / 0.8125rem | 12px / 0.75rem | 1.4 | 400 | Captions, labels |
| Overline | 11px / 0.6875rem | 10px / 0.625rem | 1.4 | 600 | Uppercase labels |

### Letter Spacing
```css
/* Headings */
letter-spacing: -0.02em; /* H1-H3 */
letter-spacing: -0.01em; /* H4-H6 */

/* Body Text */
letter-spacing: -0.011em; /* Body Large */
letter-spacing: -0.022em; /* Body */
letter-spacing: -0.016em; /* Body Small */

/* Uppercase */
letter-spacing: 0.08em; /* Overline, buttons */
```

---

## 🎨 Color System

### Primary Colors (Energy Green)

```css
/* Light Mode */
--energy-50: #f0fdf4;
--energy-100: #dcfce7;
--energy-200: #bbf7d0;
--energy-300: #86efac;
--energy-400: #4ade80;
--energy-500: #22c55e;  /* Primary */
--energy-600: #16a34a;  /* Primary Dark */
--energy-700: #15803d;
--energy-800: #166534;
--energy-900: #14532d;

/* Dark Mode */
--energy-dark-50: #0a2818;
--energy-dark-100: #14532d;
--energy-dark-200: #166534;
--energy-dark-300: #15803d;
--energy-dark-400: #16a34a;
--energy-dark-500: #22c55e;  /* Primary */
--energy-dark-600: #4ade80;
--energy-dark-700: #86efac;
--energy-dark-800: #bbf7d0;
--energy-dark-900: #dcfce7;
```

### Neutral Grays (Warm & Cool)

```css
/* Warm Grays (for backgrounds) */
--gray-warm-50: #fafaf9;
--gray-warm-100: #f5f5f4;
--gray-warm-200: #e7e5e4;
--gray-warm-300: #d6d3d1;
--gray-warm-400: #a8a29e;
--gray-warm-500: #78716c;
--gray-warm-600: #57534e;
--gray-warm-700: #44403c;
--gray-warm-800: #292524;
--gray-warm-900: #1c1917;

/* Cool Grays (for text) */
--gray-cool-50: #f9fafb;
--gray-cool-100: #f3f4f6;
--gray-cool-200: #e5e7eb;
--gray-cool-300: #d1d5db;
--gray-cool-400: #9ca3af;
--gray-cool-500: #6b7280;
--gray-cool-600: #4b5563;
--gray-cool-700: #374151;
--gray-cool-800: #1f2937;
--gray-cool-900: #111827;
```

### Semantic Colors

```css
/* Success */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Info */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

### Gradients

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);

/* Hero Gradient */
--gradient-hero: linear-gradient(135deg, #22c55e 0%, #15803d 100%);

/* Subtle Background */
--gradient-subtle: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(34,197,94,0.05) 100%);

/* Glass Effect */
--gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
```

---

## 📏 Spacing System

### Base Unit: 8px

```css
/* Spacing Scale */
--space-0: 0;
--space-1: 4px;   /* 0.5 * base */
--space-2: 8px;   /* 1 * base */
--space-3: 12px;  /* 1.5 * base */
--space-4: 16px;  /* 2 * base */
--space-5: 20px;  /* 2.5 * base */
--space-6: 24px;  /* 3 * base */
--space-8: 32px;  /* 4 * base */
--space-10: 40px; /* 5 * base */
--space-12: 48px; /* 6 * base */
--space-16: 64px; /* 8 * base */
--space-20: 80px; /* 10 * base */
--space-24: 96px; /* 12 * base */
--space-32: 128px; /* 16 * base */
--space-40: 160px; /* 20 * base */
--space-48: 192px; /* 24 * base */
```

### Section Spacing

```css
/* Vertical Rhythm */
--section-xs: 48px;   /* Small sections */
--section-sm: 64px;   /* Medium sections */
--section-md: 80px;   /* Standard sections */
--section-lg: 96px;   /* Large sections */
--section-xl: 120px;  /* Extra large sections */
--section-2xl: 160px; /* Hero sections */
```

---

## 🎭 Shadow System

### Elevation Levels

```css
/* Subtle (Cards, Buttons) */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Small (Hover states) */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Medium (Modals, Dropdowns) */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Large (Popovers, Tooltips) */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Extra Large (Overlays) */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Colored Shadows (for energy theme) */
--shadow-energy: 0 10px 15px -3px rgba(34, 197, 94, 0.1), 
                 0 4px 6px -2px rgba(34, 197, 94, 0.05);

/* Inner Shadow */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

---

## 🔲 Border Radius

```css
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

---

## ⚡ Animation & Transitions

### Timing Functions

```css
/* Easing Curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);      /* Preferred */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Durations

```css
--duration-fast: 150ms;    /* Micro-interactions */
--duration-normal: 200ms;  /* Standard transitions */
--duration-slow: 300ms;    /* Complex animations */
--duration-slower: 500ms;  /* Page transitions */
```

### Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Shimmer (Loading) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

---

## 🎯 Component Specifications

### Buttons

#### Primary Button
```css
/* Base */
padding: 12px 24px;
border-radius: var(--radius-lg);
font-size: 17px;
font-weight: 500;
letter-spacing: 0.01em;
transition: all var(--duration-normal) var(--ease-out);

/* Default State */
background: var(--gradient-primary);
color: white;
box-shadow: var(--shadow-md);

/* Hover State */
transform: scale(1.02);
box-shadow: var(--shadow-lg);

/* Active State */
transform: scale(0.98);

/* Disabled State */
opacity: 0.5;
cursor: not-allowed;
```

#### Secondary Button
```css
/* Base */
padding: 12px 24px;
border-radius: var(--radius-lg);
font-size: 17px;
font-weight: 500;
background: transparent;
border: 2px solid var(--energy-500);
color: var(--energy-600);

/* Hover State */
background: var(--energy-50);
border-color: var(--energy-600);
```

### Cards

#### Product Card
```css
/* Base */
background: white;
border-radius: var(--radius-xl);
padding: var(--space-6);
box-shadow: var(--shadow-md);
transition: all var(--duration-normal) var(--ease-out);

/* Hover State */
transform: translateY(-4px);
box-shadow: var(--shadow-xl);
```

#### Glass Card
```css
/* Base */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: var(--radius-xl);
box-shadow: var(--shadow-lg);
```

### Forms

#### Input Field
```css
/* Base */
padding: 12px 16px;
border-radius: var(--radius-md);
border: 1px solid var(--gray-cool-300);
font-size: 17px;
transition: all var(--duration-normal) var(--ease-out);

/* Focus State */
border-color: var(--energy-500);
box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
outline: none;

/* Error State */
border-color: var(--error-500);
box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
```

#### Floating Label
```css
/* Label starts inside input */
position: absolute;
left: 16px;
top: 12px;
color: var(--gray-cool-500);
transition: all var(--duration-normal) var(--ease-out);
pointer-events: none;

/* Label when focused/filled */
transform: translateY(-24px) scale(0.85);
color: var(--energy-600);
font-weight: 500;
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Container Max Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1400px;  /* Apple-style max width */
```

---

## 🎬 Interaction Patterns

### Hover Effects

```css
/* Subtle Scale */
.hover-scale {
  transition: transform var(--duration-normal) var(--ease-out);
}
.hover-scale:hover {
  transform: scale(1.02);
}

/* Lift Effect */
.hover-lift {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Loading States

```css
/* Skeleton Loader */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-cool-200) 0%,
    var(--gray-cool-100) 50%,
    var(--gray-cool-200) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

### Scroll Animations

```css
/* Fade In On Scroll */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 🌓 Dark Mode

### Dark Mode Colors

```css
/* Backgrounds */
--bg-dark: #000000;
--bg-dark-secondary: #1c1c1e;
--bg-dark-tertiary: #2c2c2e;

/* Text */
--text-dark-primary: #ffffff;
--text-dark-secondary: rgba(255, 255, 255, 0.8);
--text-dark-tertiary: rgba(255, 255, 255, 0.6);

/* Borders */
--border-dark: rgba(255, 255, 255, 0.1);
```

---

## 📐 Layout Guidelines

### Grid System

```css
/* 12-Column Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}

/* Responsive Gutters */
--gutter-mobile: var(--space-4);
--gutter-tablet: var(--space-6);
--gutter-desktop: var(--space-8);
```

### Content Width

```css
/* Standard Content */
.content-width {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Wide Content */
.content-width-wide {
  max-width: var(--container-2xl);
  margin: 0 auto;
  padding: 0 var(--space-8);
}
```

---

## ✅ Quality Checklist

### Visual Quality
- [ ] Consistent spacing throughout
- [ ] Proper typography hierarchy
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Smooth animations (60fps)
- [ ] High-quality imagery
- [ ] Consistent border radius
- [ ] Proper shadow usage

### Interaction Quality
- [ ] Clear hover states
- [ ] Accessible focus states
- [ ] Loading states for async actions
- [ ] Error states with helpful messages
- [ ] Success feedback for actions
- [ ] Smooth page transitions

### Responsive Quality
- [ ] Mobile-first approach
- [ ] Touch-friendly targets (44x44px minimum)
- [ ] Readable text on all sizes
- [ ] Proper image scaling
- [ ] Navigation works on mobile
- [ ] Forms usable on mobile

---

## 🚀 Implementation Notes

1. **Start with Tailwind Config**: Extend Tailwind with these custom values
2. **Create Utility Classes**: Build reusable utility classes for common patterns
3. **Component Library**: Build components using these specifications
4. **Documentation**: Keep this document updated as the system evolves
5. **Testing**: Test on real devices, not just browsers
6. **Performance**: Optimize animations for 60fps
7. **Accessibility**: Test with screen readers and keyboard navigation

---

This design system provides the foundation for creating a premium, Apple-inspired experience. Every component should follow these guidelines to maintain consistency and quality throughout the platform.

