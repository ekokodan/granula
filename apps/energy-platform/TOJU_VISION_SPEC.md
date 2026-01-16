# Pascal Watts / Greek Cope Energy Platform - Complete Vision Specification

## Executive Summary

This document extracts and synthesizes the complete product vision from multiple stakeholder meetings (Oct 22, Oct 30, Nov 14, Nov 22, 2025) for a **premium digital retail platform** for alternative energy storage solutions in Nigeria. The platform targets high-end residential, commercial, and grid-scale customers with lithium battery storage systems, inverters, and solar solutions.

---

## 1. BUSINESS CONTEXT

### Company Overview
- **Brand Name**: Greek Cope (operating as Pascal Watts)
- **Business Model**: Digital-first retail platform for premium energy storage solutions
- **Partnership**: Distributing for an established lithium battery manufacturer (see brochure for equipment specs)
- **Target Launch**: January 2026
- **Quarterly Investment**: ~$65,000 USD per quarter for inventory
- **Target Margin**: ~40% (~$20,000+ per quarter)

### Value Proposition
The platform differentiates from traditional retail channels (like Alaba market) by:
1. **Grade-A Equipment**: Premium lithium battery storage vs. low-grade alternatives
2. **Complete Customer Journey**: Build > Buy > Finance > Install > Insure > Support
3. **Technical Expertise**: Team has hands-on installation and design experience
4. **Digital-First**: Online storefront as the PRIMARY distribution channel
5. **Premium Experience**: Apple-inspired design signaling quality and trust

### Market Segments

| Segment | Inverter Size | Battery Storage | Description |
|---------|--------------|-----------------|-------------|
| **Residential** | 5-12 KVA | 5-20 kWh | High-net-worth homeowners, reduce grid dependence by 70%+ |
| **Commercial** | 12-30 KVA | 30-60 kWh | SMEs, offices, retail - three-phase systems |
| **Industrial/Mini-Grid** | 50+ KVA | 233 kWh - 5 MWh | Estates, EV charging, large developments |

### Key Differentiators of Equipment
From the brochure shared:
- **Stackable battery modules** - compact, aesthetic, space-efficient
- **Three-phase inverter systems** - cost of 3 single-phase units in 1
- **Modular design** - scalable as needs grow
- **Long warranty** - 10+ year lifespan
- **Aesthetic appeal** - can be displayed anywhere, modern look

---

## 2. WEBSITE STRUCTURE & PAGES

### 2.1 Landing Page (Homepage)

**Purpose**: Marketing, credibility building, and lead capture

**Sections (in order)**:

1. **Hero Section**
   - Full-screen immersive background with equipment imagery
   - Strong headline about energy independence
   - Key CTAs: "Build Your System" and "Shop Bundles"
   - Stats: efficiency %, warranty years, cost savings %

2. **Credibility Section**
   - Social proof (testimonials, case studies)
   - Trust signals (certifications, partnerships)
   - Real results (e.g., "50% power cost reduction" - real example from VGC installation)

3. **Product Categories Slider**
   - **Personal/Residential Solutions** - image on left, description on right
   - **Commercial Solutions** - image on right, description on left (alternate)
   - **Mini-Grid Solutions** - image on left, description on right
   - **Control & Automation** - additional category
   - Each category card should feature PNG product images with transparent backgrounds sitting on the page background for 3D effect

4. **System Builder CTA**
   - "Build Your Own System on Your Own Terms"
   - Interactive preview of the builder tool
   - Link to full system builder page

5. **About Us Section**
   - Company story and expertise
   - Team technical credentials
   - Mission statement

6. **Footer**
   - Navigation links
   - Contact information
   - Social links

**Design Notes from Toju**:
- White/light background preferred so equipment images "stand out"
- PNG images with transparent backgrounds for equipment (3D floating effect)
- Equipment images should be the hero - not stock photos with backgrounds
- Reference: Zabira website for color scheme and typography
- Dark mode sections acceptable but primary background should be white

### 2.2 Store Front

**Purpose**: Product browsing and purchase

**Key Features**:

1. **Bundle-First Display**
   - Bundles should be the PRIMARY view - not individual components
   - "Deal of the Day" or "Deal of the Month" promotional banner at top
   - Featured bundles section before individual products

2. **Product Grid with Filters**
   - Filter by: Batteries (wall-mount, stackable), Inverters (single-phase, three-phase), Combiner boxes, WiFi monitors
   - Filter by: Residential, Commercial, Industrial
   - Stock indicator on each product

3. **Product Cards**
   - Interactive hover showing specs
   - PNG images on transparent background
   - Quick-view capability
   - "Add to Bundle" vs "Buy Individual"

4. **Deals Page**
   - Quarterly inventory clearance
   - Weekly/monthly deals section
   - Countdown timers for promotions

5. **Shopping Cart & Checkout**
   - Secure checkout
   - Multiple payment options
   - Financing option at checkout
   - Insurance add-on option
   - Installation service add-on

### 2.3 System Builder (Interactive Calculator)

**Purpose**: Help customers design their ideal energy system and capture leads

**This is a CRITICAL feature - must be highly polished**

**Flow Design - Option A (Preferred by Toju)**:
Single page with calculator sidebar showing real-time updates

```
+------------------------------------------+----------------+
|  [Residential] [Commercial] [Industrial] |                |
|  (buttons at top to switch context)      |   CALCULATOR   |
|                                          |   SIDEBAR      |
|  +-- Appliance Selection Grid --+        |                |
|  | [Fan] [TV] [Fridge] [AC]    |        |  Total Load:   |
|  | [Lights] [Pumps] [etc.]     |        |  4.5 kW        |
|  +------------------------------+        |                |
|                                          |  Backup Time:  |
|  Each appliance: qty selector            |  8 hours       |
|                                          |                |
|  +-- Energy Goals --+                    |  Recommended:  |
|  | [ ] Standard Backup                   |  - 10kVA Inv   |
|  | [ ] Partial Off-Grid                  |  - 30kWh Batt  |
|  | [ ] Full Off-Grid                     |  - 12 Panels   |
|  +------------------+                    |                |
|                                          |  Est. Cost:    |
|  +-- Roof Space --+                      |  $12,500       |
|  | Available sqm for panels              |                |
|  +----------------+                      | [Get Report]   |
|                                          | [Buy Now]      |
+------------------------------------------+----------------+
```

**Required Inputs**:

1. **Property Type** (determines appliance options)
   - Residential
   - Commercial
   - Industrial/Mini-Grid (redirect to contact form - too complex for self-service)

2. **Appliances/Load Selection**
   - Residential: Fans, TVs, Fridges, ACs, Lights, Water Pumps, etc.
   - Commercial: Additional items for office equipment, machinery
   - Each item has: icon, name, typical wattage, quantity selector
   - Real-time load calculation as items are added

3. **Energy Objectives**
   - Standard Backup (grid-tied with battery backup)
   - Partial Off-Grid (reduce grid dependence)
   - Full Off-Grid (complete energy independence)

4. **Backup Time Required**
   - User specifies hours of backup needed
   - This determines battery bank sizing
   - Example: 15kW inverter + 30kWh battery = ~2 hours at full load

5. **Roof Space Available** (for solar sizing)
   - Each panel needs ~2 sqm
   - Limits maximum solar array size
   - Input in square meters

**Calculations Required** (formulas to be provided by Toju):
- Total load estimation (kW)
- Recommended inverter size (kVA)
- Battery bank size (kWh) based on backup time
- Solar panel array size (kW) based on roof space and objectives
- Multiple scenarios (optimal, budget, premium)

**Output/Report**:
1. **Summary Card** on screen
2. **Downloadable PDF Report** containing:
   - Sales code (links to specific bundle)
   - Total load estimate
   - Table with scenarios: different battery/inverter/solar combinations
   - Recommended bundle with pricing
   - Disclaimer (estimates only, professional assessment recommended)

3. **Lead Capture**
   - Email required before PDF download
   - Feeds into sales funnel
   - Sales rep follows up

### 2.4 Commercial & Mini-Grid Solutions Page

**Purpose**: Lead capture for complex projects

**Design**:
- Showcase capabilities and past projects
- Case studies with results
- Contact form for consultation request
- NOT self-service (these need custom engineering)

### 2.5 Financing Page

**Purpose**: Enable purchases through financing partners

**Features**:
- Partner financing options display
- Eligibility checker
- Application flow (redirect to partner or embedded)
- Calculator for monthly payments

### 2.6 Insurance Page

**Purpose**: Offer equipment protection plans

**Features**:
- Insurance packages display
- Coverage details
- Quote generator
- Integration with checkout

### 2.7 Installation Services Page

**Purpose**: Professional installation booking

**Features**:
- Service packages (basic install, premium with monitoring setup)
- Coverage areas
- Scheduling system
- Portfolio of past installations

### 2.8 Support/After-Sales Page

**Purpose**: Customer support and warranty claims

**Features**:
- FAQ section
- Ticket submission
- Warranty registration
- Documentation/manuals download

---

## 3. DESIGN SPECIFICATIONS

### 3.1 Visual Direction

**Primary Reference**: Apple.com
- Clean, uncluttered interfaces
- Sophisticated typography
- Premium feel through whitespace
- Purposeful animations
- Scroll-based reveals

**Secondary Reference**: Zabira website
- Typography style
- Color scheme approach
- Layout patterns

### 3.2 Color Scheme

**Background**: WHITE/Light as primary (Toju's explicit preference)
- Equipment images need to "pop" and stand out
- Dark sections acceptable for contrast but not dominant

**Accent Colors**:
- Energy green for CTAs and highlights
- Dark gray/black for text
- Subtle gradients for depth

### 3.3 Equipment Imagery

**CRITICAL REQUIREMENT**:
- All equipment images should be **PNG with transparent backgrounds**
- Equipment should appear to "float" on the page background
- Creates 3D premium effect
- No stock photos with random backgrounds

**Image Treatment**:
- High-resolution product shots
- Multiple angles where relevant
- Consistent lighting/style across all products
- Size: minimum 2000px width for hero images

### 3.4 Typography

From Think Bridge reference:
- Clean sans-serif primary font
- Strong hierarchy (display, headings, body)
- Readable on all devices

### 3.5 Animations

**Scroll-Based**:
- Elements reveal as user scrolls
- Parallax on hero images
- Smooth transitions between sections
- Progress indicator

**Interactive**:
- Hover states on cards
- Smooth calculator updates
- Loading states during calculations

**Performance Considerations** (from Apple study):
- Run animations only once per session to save resources
- Implement reduced motion for accessibility
- Optimize for lower-end devices

### 3.6 Navigation

**Desktop**:
- Sticky header that changes on scroll
- Clear primary navigation
- Prominent CTAs (Build System, Shop)

**Mobile**:
- Hamburger menu
- Bottom navigation bar consideration
- Thumb-friendly touch targets

**Sidebar Navigation** (discussed):
- Floating sidebar that appears on scroll
- Contains key CTAs: Build System, Buy System
- Similar to Think Bridge implementation

---

## 4. TECHNICAL REQUIREMENTS

### 4.1 E-Commerce Functionality

**Product Management**:
- Bundle creation and management
- Individual product inventory
- Stock tracking (just-in-time inventory model)
- Pricing management
- Discount/promotion system

**Cart & Checkout**:
- Persistent cart
- Guest checkout option
- Multiple payment methods
- Order confirmation emails
- Order tracking

**Inventory Model**:
- Quarterly restocking
- Stock indicators on products
- Pre-order capability for out-of-stock items

### 4.2 Lead Capture & CRM

**Forms**:
- System builder report request
- Commercial/mini-grid inquiry
- General contact
- Newsletter signup

**Data Captured**:
- Email (required)
- Name
- Phone
- Project type
- System requirements

**Integration**:
- Sales funnel/pipeline
- Email automation
- CRM system (to be determined)

### 4.3 Calculator Engine

**Backend Logic Required**:
- Load calculation from appliance selection
- Inverter sizing algorithm
- Battery sizing based on backup hours
- Solar array sizing based on roof space
- Scenario generation (budget/optimal/premium)
- PDF report generation

**Formulas** (Toju to provide):
- kW load from appliance list
- kVA inverter = load * safety factor
- kWh battery = load * backup hours * depth of discharge factor
- Solar kW = battery kWh / peak sun hours * system losses

### 4.4 Admin Panel

**Needed Features**:
- Product/bundle management
- Order management
- Lead management
- Content management
- Inventory tracking
- Report generation

---

## 5. USER JOURNEYS

### 5.1 Residential Customer Journey

1. **Awareness**: Lands on homepage, sees value proposition
2. **Interest**: Explores residential solutions section
3. **Consideration**: Uses system builder to size their needs
4. **Intent**: Downloads PDF report (captured as lead)
5. **Evaluation**: Browses recommended bundles in store
6. **Purchase**: Adds bundle to cart, selects financing/insurance options
7. **Fulfillment**: Completes checkout, schedules installation
8. **Post-Sale**: Receives system, gets ongoing support

### 5.2 Commercial Customer Journey

1. **Awareness**: Lands on homepage
2. **Interest**: Clicks through to commercial solutions
3. **Consideration**: Reviews capabilities and case studies
4. **Intent**: Submits inquiry form (captured as lead)
5. **Consultation**: Sales rep contacts for site assessment
6. **Proposal**: Custom proposal generated
7. **Purchase**: Direct sale with sales rep assistance
8. **Fulfillment**: Professional installation scheduled

### 5.3 Quick Buyer Journey

1. **Lands on store** (direct or from ad)
2. **Browses bundles** or uses filters
3. **Selects product** and views details
4. **Adds to cart**
5. **Checks out** with payment
6. **Receives confirmation**

---

## 6. PRIORITY & PHASES

### Phase 1 - MVP (Target: January 2026)

**Must Have**:
- [x] Landing page with all sections
- [ ] Store front with bundle-first display
- [ ] System builder (residential focus)
- [ ] Basic checkout flow
- [ ] Lead capture functionality
- [ ] Mobile responsive

### Phase 2 - Enhanced

**Should Have**:
- [ ] Financing integration
- [ ] Insurance add-on
- [ ] Installation booking
- [ ] Admin panel for inventory
- [ ] PDF report generation
- [ ] Email automation

### Phase 3 - Scale

**Nice to Have**:
- [ ] Commercial system builder
- [ ] Customer portal
- [ ] Order tracking
- [ ] Review/rating system
- [ ] Affiliate/partner portal

---

## 7. CONTENT REQUIREMENTS

### Images Needed
- [ ] All product images as PNGs with transparent backgrounds
- [ ] Installation photos (before/after)
- [ ] Team photos
- [ ] Case study images
- [ ] Icon set for appliances

### Copy Needed
- [ ] Homepage headlines and body copy
- [ ] Product descriptions for each bundle
- [ ] Product specs for individual items
- [ ] FAQ content
- [ ] Terms and conditions
- [ ] Privacy policy

### Technical Documentation
- [ ] Calculator formulas from Toju
- [ ] Product specifications from manufacturer
- [ ] Warranty terms
- [ ] Installation requirements

---

## 8. SUCCESS METRICS

**Business Metrics**:
- Quarterly sales vs. inventory cost ($65K investment, $20K+ margin target)
- Lead-to-customer conversion rate
- Average order value
- Bundle vs. individual purchase ratio

**Website Metrics**:
- System builder completion rate
- Report download rate
- Cart abandonment rate
- Time on site
- Mobile vs. desktop conversion

---

## 9. OUTSTANDING QUESTIONS

1. **Calculator Formulas**: Toju to provide exact formulas for inverter/battery/solar sizing
2. **Financing Partners**: Which partners to integrate?
3. **Insurance Provider**: Which provider for equipment insurance?
4. **Payment Gateway**: Which Nigerian payment processor?
5. **CRM System**: Which CRM for lead management?
6. **Hosting**: Where will production be hosted?

---

## 10. REFERENCE MATERIALS

- [x] Manufacturer brochure (shared via WhatsApp)
- [ ] Zabira website reference
- [x] Apple.com design patterns
- [x] Think Bridge sidebar navigation pattern
- [ ] Product catalog with specifications

---

## APPENDIX: Key Quotes from Meetings

> "The landing page or the store front is a major or is a primary distribution channel... literally basically we are selling online. That's our primary [channel]."

> "We want the pictures... to be as intuitive as interactive as possible that literally when you click or when your cursor goes over a bundle... [it] extracts all the information."

> "We are trying to build a sense of FOMO... that's why targeting is very very important."

> "Our approach is to cover the entire supply chain... from end to end. Now what do we mean by this? Like literally the customer can come to our site, can literally build their own system for themselves."

> "I think we should stick with the white color. So that the pictures can kind of stand out... using a more wide [white] background will kind of work."

> "PNG files... just the items alone without the background... the equipment kind of like sit on the page directly without any background."

---

*Document compiled from meeting transcripts: Oct 22, Oct 30, Nov 14, Nov 22, 2025*
*Last updated: December 14, 2025*
