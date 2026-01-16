# Implementation Guide for AI Agent

This document provides step-by-step implementation instructions for building the Greek Cope / Pascal Watts energy platform based on the stakeholder vision.

---

## CURRENT STATE ASSESSMENT

### What's Already Built:
1. **Landing Page** (`/frontend/src/app/page.tsx`)
   - Hero section with parallax ✅
   - Product gallery with scroll animations ✅
   - Features section ✅
   - CTA section ✅
   - Footer ✅

2. **Components**
   - ScrollAnimations (ScrollReveal, Parallax, TextReveal) ✅
   - HeroSection ✅
   - ScrollGallery ✅
   - UI components (Button, Input, Card) ✅

3. **Backend Structure**
   - Express.js API with routes ✅
   - Prisma schema defined ✅
   - Authentication middleware ✅
   - Calculator route exists (needs enhancement) ✅

### What Needs to Be Built:
1. **Rebrand to Greek Cope / Pascal Watts** (currently "SolarVolt Pro")
2. **Store front page** with bundle-first display
3. **System Builder page** with interactive calculator
4. **Product detail pages**
5. **Shopping cart & checkout flow**
6. **Lead capture & PDF report generation**
7. **Backend integration** (currently mock data)
8. **Design updates** (white background, PNG product images)

---

## PHASE 1: IMMEDIATE UPDATES

### Task 1.1: Rebrand from SolarVolt Pro to Greek Cope

**Files to update:**
- `/frontend/src/app/page.tsx` - Change all "SolarVolt Pro" to "Greek Cope"
- Logo component - Update icon and text
- Footer - Update company name
- Meta tags - Update site title and description

**Brand Identity:**
```
Name: Greek Cope (or Pascal Watts)
Tagline: "Premium Energy Storage Solutions"
```

### Task 1.2: Update Color Scheme to White Background

**Current**: Dark hero sections
**Target**: White/light backgrounds with equipment images that "pop"

**Update `/frontend/tailwind.config.js`:**
- Ensure white is primary background
- Keep dark sections for contrast in CTAs only

**Update `/frontend/src/app/page.tsx`:**
- Change `bg-gray-cool-900` sections to `bg-white`
- Adjust text colors accordingly
- Keep hero with dark overlay for readability

### Task 1.3: Update Image Strategy

**Current**: Unsplash stock photos
**Target**: PNG product images with transparent backgrounds

**Placeholder approach until real images arrive:**
1. Create a `/public/products/` directory
2. Use placeholder product images
3. Implement image components that handle transparent PNGs

```tsx
// Example product image component
<div className="relative">
  <Image
    src="/products/inverter-10kva.png"
    alt="10kVA Hybrid Inverter"
    width={600}
    height={400}
    className="object-contain" // Not object-cover for transparent PNGs
  />
</div>
```

---

## PHASE 2: STORE FRONT PAGE

### Task 2.1: Create Store Page Structure

**File**: `/frontend/src/app/store/page.tsx`

**Layout:**
```
+-------------------------------------------------------+
|  [Promo Banner - Deal of the Month]                   |
+-------------------------------------------------------+
|                                                       |
|  Featured Bundles                                     |
|  +--------+  +--------+  +--------+  +--------+      |
|  | Bundle |  | Bundle |  | Bundle |  | Bundle |      |
|  |   1    |  |   2    |  |   3    |  |   4    |      |
|  +--------+  +--------+  +--------+  +--------+      |
|                                                       |
+-------------------------------------------------------+
|  [Filters Sidebar]  |  Product Grid                  |
|  - Category         |  +------+  +------+  +------+  |
|  - Type             |  |      |  |      |  |      |  |
|  - Price Range      |  +------+  +------+  +------+  |
|  - Phase (1/3)      |  +------+  +------+  +------+  |
|                     |  |      |  |      |  |      |  |
|                     |  +------+  +------+  +------+  |
+-------------------------------------------------------+
```

### Task 2.2: Create Product Components

**Files to create:**

1. `/frontend/src/components/store/ProductCard.tsx`
```tsx
interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  category: 'bundle' | 'inverter' | 'battery' | 'panel' | 'accessory';
  specs: {
    capacity?: string;
    phase?: '1-phase' | '3-phase';
    warranty?: string;
  };
  inStock: boolean;
}
```

2. `/frontend/src/components/store/BundleCard.tsx`
```tsx
interface BundleCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number; // For showing discount
  items: {
    inverter: string;
    battery: string;
    panels?: string;
    accessories?: string[];
  };
  forPropertyType: 'residential' | 'commercial';
  featured?: boolean;
}
```

3. `/frontend/src/components/store/FilterSidebar.tsx`
```tsx
interface FilterState {
  category: string[];
  priceRange: [number, number];
  phase: string[];
  propertyType: string[];
  inStockOnly: boolean;
}
```

4. `/frontend/src/components/store/PromoBanner.tsx`
```tsx
interface PromoBannerProps {
  title: string;
  description: string;
  discount?: string;
  endDate?: Date;
  ctaText: string;
  ctaLink: string;
}
```

### Task 2.3: Create Store API Endpoints

**Backend updates needed:**

1. `/backend/src/routes/products.ts` - Enhance with:
   - GET `/api/products/bundles` - List all bundles (sorted by featured)
   - GET `/api/products/bundles/:id` - Bundle detail
   - GET `/api/products?category=&phase=&priceMin=&priceMax=` - Filtered products
   - GET `/api/products/deals` - Current deals/promotions

2. Seed database with sample products and bundles

---

## PHASE 3: SYSTEM BUILDER

### Task 3.1: Create System Builder Page

**File**: `/frontend/src/app/calculator/page.tsx`

**This is the MOST IMPORTANT feature**

### Task 3.2: System Builder Component Structure

```
/frontend/src/components/calculator/
├── SystemBuilder.tsx          # Main container
├── PropertyTypeSelector.tsx   # Residential/Commercial/Industrial tabs
├── ApplianceGrid.tsx          # Grid of appliance cards with qty selectors
├── ApplianceCard.tsx          # Individual appliance with icon, wattage, qty
├── EnergyGoalsSelector.tsx    # Radio buttons for backup level
├── BackupTimeSlider.tsx       # Hours of backup needed
├── RoofSpaceInput.tsx         # Square meters available
├── CalculatorSidebar.tsx      # Real-time calculation display
├── RecommendationCard.tsx     # Shows recommended system
├── ReportModal.tsx            # Email capture for PDF download
└── types.ts                   # TypeScript interfaces
```

### Task 3.3: Appliance Data Structure

```typescript
// /frontend/src/data/appliances.ts

export interface Appliance {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  watts: number;
  category: 'lighting' | 'cooling' | 'kitchen' | 'entertainment' | 'office' | 'industrial';
  availableFor: ('residential' | 'commercial' | 'industrial')[];
  defaultQty: number;
  maxQty: number;
}

export const appliances: Appliance[] = [
  // Residential
  { id: 'ceiling_fan', name: 'Ceiling Fan', icon: 'Fan', watts: 75, category: 'cooling', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'standing_fan', name: 'Standing Fan', icon: 'Fan', watts: 50, category: 'cooling', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'led_bulb', name: 'LED Bulb', icon: 'Lightbulb', watts: 10, category: 'lighting', availableFor: ['residential', 'commercial', 'industrial'], defaultQty: 0, maxQty: 100 },
  { id: 'tv_32', name: 'TV (32")', icon: 'Tv', watts: 50, category: 'entertainment', availableFor: ['residential'], defaultQty: 0, maxQty: 5 },
  { id: 'tv_55', name: 'TV (55"+)', icon: 'Tv', watts: 150, category: 'entertainment', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 10 },
  { id: 'fridge_small', name: 'Refrigerator (Small)', icon: 'Refrigerator', watts: 150, category: 'kitchen', availableFor: ['residential'], defaultQty: 0, maxQty: 3 },
  { id: 'fridge_large', name: 'Refrigerator (Large)', icon: 'Refrigerator', watts: 300, category: 'kitchen', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 5 },
  { id: 'freezer', name: 'Freezer', icon: 'Snowflake', watts: 200, category: 'kitchen', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 5 },
  { id: 'ac_1hp', name: 'AC (1HP)', icon: 'AirVent', watts: 1000, category: 'cooling', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 10 },
  { id: 'ac_1_5hp', name: 'AC (1.5HP)', icon: 'AirVent', watts: 1500, category: 'cooling', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 10 },
  { id: 'ac_2hp', name: 'AC (2HP)', icon: 'AirVent', watts: 2000, category: 'cooling', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'water_pump', name: 'Water Pump', icon: 'Droplets', watts: 750, category: 'utility', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 5 },
  { id: 'washing_machine', name: 'Washing Machine', icon: 'Shirt', watts: 500, category: 'kitchen', availableFor: ['residential'], defaultQty: 0, maxQty: 2 },
  { id: 'microwave', name: 'Microwave', icon: 'Microwave', watts: 1200, category: 'kitchen', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 3 },
  { id: 'laptop', name: 'Laptop', icon: 'Laptop', watts: 65, category: 'office', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'desktop', name: 'Desktop Computer', icon: 'Monitor', watts: 300, category: 'office', availableFor: ['residential', 'commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'printer', name: 'Printer', icon: 'Printer', watts: 50, category: 'office', availableFor: ['commercial'], defaultQty: 0, maxQty: 10 },

  // Commercial specific
  { id: 'server', name: 'Server', icon: 'Server', watts: 500, category: 'office', availableFor: ['commercial'], defaultQty: 0, maxQty: 20 },
  { id: 'pos_system', name: 'POS System', icon: 'CreditCard', watts: 100, category: 'office', availableFor: ['commercial'], defaultQty: 0, maxQty: 20 },
];
```

### Task 3.4: Calculator Logic

```typescript
// /frontend/src/lib/calculator.ts

interface CalculatorInput {
  propertyType: 'residential' | 'commercial';
  appliances: { [applianceId: string]: number }; // id -> quantity
  energyGoal: 'standard' | 'partial-offgrid' | 'full-offgrid';
  backupHours: number;
  roofSpaceSqm: number;
}

interface CalculatorOutput {
  totalLoadWatts: number;
  totalLoadKW: number;
  recommendedInverterKVA: number;
  recommendedBatteryKWH: number;
  recommendedSolarKW: number;
  maxSolarFromRoof: number;
  scenarios: {
    budget: SystemScenario;
    optimal: SystemScenario;
    premium: SystemScenario;
  };
  recommendedBundle?: Bundle;
}

interface SystemScenario {
  name: string;
  inverterKVA: number;
  batteryKWH: number;
  solarKW: number;
  estimatedCostUSD: number;
  backupHoursAtFullLoad: number;
  dailySolarGenerationKWH: number;
}

export function calculateSystem(input: CalculatorInput): CalculatorOutput {
  // 1. Calculate total load
  const totalLoadWatts = Object.entries(input.appliances).reduce((sum, [id, qty]) => {
    const appliance = appliances.find(a => a.id === id);
    return sum + (appliance ? appliance.watts * qty : 0);
  }, 0);

  const totalLoadKW = totalLoadWatts / 1000;

  // 2. Safety factor based on goal
  const safetyFactor = input.energyGoal === 'full-offgrid' ? 1.5 :
                       input.energyGoal === 'partial-offgrid' ? 1.3 : 1.2;

  // 3. Inverter sizing (round up to standard sizes)
  const rawInverterKVA = totalLoadKW * safetyFactor;
  const standardSizes = [5, 8, 10, 12, 15, 20, 25, 30];
  const recommendedInverterKVA = standardSizes.find(s => s >= rawInverterKVA) || 30;

  // 4. Battery sizing
  // Battery kWh = Load kW × Backup Hours × DoD factor (0.8 for lithium)
  const dodFactor = 0.8; // Depth of discharge for lithium
  const batteryEfficiency = 0.95;
  const recommendedBatteryKWH = Math.ceil(
    (totalLoadKW * input.backupHours) / (dodFactor * batteryEfficiency)
  );

  // 5. Solar sizing
  // Solar kW = (Daily energy needs kWh) / (Peak sun hours × system efficiency)
  const peakSunHours = 5; // Nigeria average
  const systemEfficiency = 0.8;
  const dailyEnergyKWH = totalLoadKW * 8; // Assume 8 hours of usage
  const recommendedSolarKW = Math.ceil(
    dailyEnergyKWH / (peakSunHours * systemEfficiency)
  );

  // 6. Max solar from roof space
  // Each kW needs approximately 5 sqm (for ~400W panels)
  const maxSolarFromRoof = Math.floor(input.roofSpaceSqm / 5);

  // 7. Generate scenarios
  // ... (implement budget/optimal/premium variations)

  return {
    totalLoadWatts,
    totalLoadKW,
    recommendedInverterKVA,
    recommendedBatteryKWH,
    recommendedSolarKW,
    maxSolarFromRoof,
    scenarios: generateScenarios(totalLoadKW, input),
    recommendedBundle: findMatchingBundle(recommendedInverterKVA, recommendedBatteryKWH)
  };
}
```

### Task 3.5: PDF Report Generation

```typescript
// /frontend/src/lib/report-generator.ts

import jsPDF from 'jspdf';

export async function generateSystemReport(
  calculation: CalculatorOutput,
  customerEmail: string
): Promise<Blob> {
  const doc = new jsPDF();

  // Header with logo
  doc.setFontSize(24);
  doc.text('Greek Cope', 20, 30);
  doc.setFontSize(12);
  doc.text('Energy System Recommendation Report', 20, 40);

  // Sales Code
  const salesCode = generateSalesCode();
  doc.text(`Sales Code: ${salesCode}`, 20, 55);

  // Summary section
  doc.setFontSize(16);
  doc.text('System Summary', 20, 75);
  doc.setFontSize(12);
  doc.text(`Total Estimated Load: ${calculation.totalLoadKW.toFixed(1)} kW`, 20, 85);

  // Recommendations table
  doc.text('Recommended Configuration:', 20, 100);
  doc.text(`• Inverter: ${calculation.recommendedInverterKVA} kVA`, 25, 110);
  doc.text(`• Battery: ${calculation.recommendedBatteryKWH} kWh`, 25, 120);
  doc.text(`• Solar: ${calculation.recommendedSolarKW} kW`, 25, 130);

  // Scenarios table
  // ... add scenario comparison table

  // Disclaimer
  doc.setFontSize(10);
  doc.text('DISCLAIMER: These estimates are for guidance only. A professional site', 20, 250);
  doc.text('assessment is recommended before purchase. Actual requirements may vary.', 20, 258);

  // Footer
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 280);
  doc.text('www.greekcope.com | info@greekcope.com', 20, 288);

  return doc.output('blob');
}
```

---

## PHASE 4: CHECKOUT FLOW

### Task 4.1: Shopping Cart

**File**: `/frontend/src/components/cart/ShoppingCart.tsx`

**Features:**
- Persistent cart (localStorage + API sync)
- Update quantities
- Remove items
- Bundle vs individual item display
- Subtotal, tax, total calculation
- Promo code input
- Proceed to checkout button

### Task 4.2: Checkout Page

**File**: `/frontend/src/app/checkout/page.tsx`

**Steps:**
1. Cart Review
2. Customer Information (shipping address)
3. Add-ons (Installation, Insurance, Financing)
4. Payment Method
5. Order Confirmation

### Task 4.3: Add-on Options at Checkout

```tsx
// Installation service add-on
interface InstallationOption {
  id: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
}

// Insurance add-on
interface InsuranceOption {
  id: string;
  name: string;
  coverage: string;
  pricePercentage: number; // % of order total
  duration: string;
}

// Financing option
interface FinancingOption {
  partnerId: string;
  partnerName: string;
  interestRate: number;
  minDownPayment: number;
  maxTerm: number;
}
```

---

## PHASE 5: BACKEND INTEGRATION

### Task 5.1: Connect Routes to Database

**Priority order:**
1. Products & Bundles (read operations)
2. User registration/login
3. Cart persistence
4. Order creation
5. Lead capture (calculator reports)

### Task 5.2: Seed Database

Create seed script with:
- 5-10 bundles (residential and commercial)
- 20+ individual products
- Sample pricing
- Product images paths

### Task 5.3: Email Integration

Set up Nodemailer for:
- Order confirmations
- PDF report delivery
- Lead notifications to sales team
- Password reset

---

## FILE CREATION CHECKLIST

### New Pages
- [ ] `/frontend/src/app/store/page.tsx`
- [ ] `/frontend/src/app/calculator/page.tsx`
- [ ] `/frontend/src/app/checkout/page.tsx`
- [ ] `/frontend/src/app/products/[id]/page.tsx`
- [ ] `/frontend/src/app/bundles/[id]/page.tsx`

### New Components
- [ ] `/frontend/src/components/store/ProductCard.tsx`
- [ ] `/frontend/src/components/store/BundleCard.tsx`
- [ ] `/frontend/src/components/store/FilterSidebar.tsx`
- [ ] `/frontend/src/components/store/PromoBanner.tsx`
- [ ] `/frontend/src/components/calculator/SystemBuilder.tsx`
- [ ] `/frontend/src/components/calculator/ApplianceGrid.tsx`
- [ ] `/frontend/src/components/calculator/CalculatorSidebar.tsx`
- [ ] `/frontend/src/components/cart/ShoppingCart.tsx`
- [ ] `/frontend/src/components/cart/CartItem.tsx`
- [ ] `/frontend/src/components/checkout/CheckoutForm.tsx`
- [ ] `/frontend/src/components/common/FloatingSidebar.tsx`

### Data Files
- [ ] `/frontend/src/data/appliances.ts`
- [ ] `/frontend/src/data/products.ts` (mock data)
- [ ] `/frontend/src/data/bundles.ts` (mock data)

### Utility Files
- [ ] `/frontend/src/lib/calculator.ts`
- [ ] `/frontend/src/lib/report-generator.ts`
- [ ] `/frontend/src/lib/cart.ts`

### Backend Updates
- [ ] `/backend/src/routes/products.ts` - Enhance endpoints
- [ ] `/backend/src/routes/calculator.ts` - Add PDF generation
- [ ] `/backend/src/routes/cart.ts` - Create cart endpoints
- [ ] `/backend/src/routes/checkout.ts` - Create checkout endpoints
- [ ] `/backend/prisma/seed.ts` - Add product/bundle seed data

---

## DESIGN TOKENS REFERENCE

### Colors to Use
```css
/* Backgrounds */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-dark: #111827;

/* Text */
--text-primary: #111827;
--text-secondary: #6b7280;
--text-on-dark: #ffffff;

/* Accent */
--accent-primary: #22c55e;
--accent-hover: #16a34a;

/* UI */
--border: #e5e7eb;
--border-hover: #d1d5db;
```

### Spacing Scale
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## TESTING CHECKLIST

### Functional Tests
- [ ] System builder calculates correctly
- [ ] Filtering products works
- [ ] Cart persists across sessions
- [ ] Checkout flow completes
- [ ] PDF report generates
- [ ] Email capture works

### Visual Tests
- [ ] White backgrounds throughout
- [ ] Product images display correctly
- [ ] Animations are smooth
- [ ] Mobile responsive
- [ ] Dark mode sections contrast well

### Performance Tests
- [ ] Page load < 3s
- [ ] Images optimized
- [ ] Animations at 60fps
- [ ] No layout shifts

---

*This implementation guide should be used in conjunction with TOJU_VISION_SPEC.md for complete context.*
