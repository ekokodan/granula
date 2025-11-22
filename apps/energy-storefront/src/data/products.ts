export interface Product {
  id: string
  name: string
  slug: string
  category: 'residential' | 'commercial' | 'grid-scale'
  type: 'bundle' | 'inverter' | 'battery' | 'solar' | 'accessory'
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  shortDescription: string
  specifications: {
    inverterKva?: number
    batteryKwh?: number
    solarKw?: number
    phaseType?: 'single' | 'three'
    batteryType?: 'wall-mount' | 'stackable'
    warranty: string
    backupHours?: string
    coverage?: string
  }
  components?: {
    name: string
    quantity: number
    specs: string
  }[]
  features: string[]
  inStock: boolean
  stockCount: number
  isNew?: boolean
  isFeatured?: boolean
  isDeal?: boolean
  dealEndDate?: string
}

export const products: Product[] = [
  // RESIDENTIAL BUNDLES
  {
    id: 'bundle-home-5kva',
    name: 'Home Essential 5KVA',
    slug: 'home-essential-5kva',
    category: 'residential',
    type: 'bundle',
    price: 4500,
    originalPrice: 5200,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800'
    ],
    description: 'Perfect starter system for small homes and apartments. Powers essential appliances including lights, fans, TV, and refrigerator.',
    shortDescription: 'Starter system for 2-3 bedroom homes',
    specifications: {
      inverterKva: 5,
      batteryKwh: 10,
      solarKw: 3,
      phaseType: 'single',
      batteryType: 'stackable',
      warranty: '10 years',
      backupHours: '6-8 hours',
      coverage: '2-3 Bedroom Home'
    },
    components: [
      { name: '5KVA Hybrid Inverter', quantity: 1, specs: 'Single Phase, MPPT' },
      { name: '5kWh Lithium Battery Module', quantity: 2, specs: 'Stackable, LiFePO4' },
      { name: '450W Solar Panels', quantity: 7, specs: 'Monocrystalline' },
      { name: 'Mounting Kit & Cables', quantity: 1, specs: 'Complete Set' }
    ],
    features: [
      'Complete plug-and-play system',
      '6-8 hours backup on essential load',
      'Smart monitoring via mobile app',
      'Zero maintenance lithium batteries',
      'Professional installation included'
    ],
    inStock: true,
    stockCount: 12,
    isNew: false,
    isFeatured: true,
    isDeal: true,
    dealEndDate: '2025-01-15'
  },
  {
    id: 'bundle-home-10kva',
    name: 'Home Premium 10KVA',
    slug: 'home-premium-10kva',
    category: 'residential',
    type: 'bundle',
    price: 8500,
    originalPrice: 9800,
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800'
    ],
    description: 'Our best-selling residential system. Powers your entire home including multiple ACs, with extended backup capability.',
    shortDescription: 'Complete solution for 4-5 bedroom homes',
    specifications: {
      inverterKva: 10,
      batteryKwh: 20,
      solarKw: 6,
      phaseType: 'single',
      batteryType: 'stackable',
      warranty: '10 years',
      backupHours: '8-12 hours',
      coverage: '4-5 Bedroom Home'
    },
    components: [
      { name: '10KVA Hybrid Inverter', quantity: 1, specs: 'Single Phase, Dual MPPT' },
      { name: '5kWh Lithium Battery Module', quantity: 4, specs: 'Stackable, LiFePO4' },
      { name: '450W Solar Panels', quantity: 14, specs: 'Monocrystalline' },
      { name: 'Mounting Kit & Cables', quantity: 1, specs: 'Complete Set' },
      { name: 'Smart Energy Monitor', quantity: 1, specs: 'WiFi Enabled' }
    ],
    features: [
      'Powers 2-3 AC units simultaneously',
      'Extended 8-12 hour backup',
      'Real-time energy monitoring',
      'Automatic grid switching',
      'Weather-resistant outdoor unit'
    ],
    inStock: true,
    stockCount: 8,
    isNew: false,
    isFeatured: true,
    isDeal: false
  },
  {
    id: 'bundle-home-12kva',
    name: 'Home Elite 12KVA',
    slug: 'home-elite-12kva',
    category: 'residential',
    type: 'bundle',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1545209463-e2827c2c1068?w=800',
    images: [
      'https://images.unsplash.com/photo-1545209463-e2827c2c1068?w=800'
    ],
    description: 'Top-tier residential system for luxury homes. Maximum power capacity with near off-grid capability.',
    shortDescription: 'Luxury solution for large homes',
    specifications: {
      inverterKva: 12,
      batteryKwh: 30,
      solarKw: 8,
      phaseType: 'single',
      batteryType: 'stackable',
      warranty: '10 years',
      backupHours: '12-16 hours',
      coverage: '5+ Bedroom Home'
    },
    components: [
      { name: '12KVA Hybrid Inverter', quantity: 1, specs: 'Single Phase, Triple MPPT' },
      { name: '5kWh Lithium Battery Module', quantity: 6, specs: 'Stackable, LiFePO4' },
      { name: '450W Solar Panels', quantity: 18, specs: 'Monocrystalline, Half-cut' },
      { name: 'Premium Mounting System', quantity: 1, specs: 'Aluminum, 25yr warranty' },
      { name: 'Smart Home Integration Hub', quantity: 1, specs: 'Supports Alexa, Google' }
    ],
    features: [
      'Near off-grid capability',
      'Smart home integration',
      'Premium aesthetic design',
      '24/7 priority support',
      'Annual maintenance included'
    ],
    inStock: true,
    stockCount: 5,
    isNew: true,
    isFeatured: true,
    isDeal: false
  },

  // COMMERCIAL BUNDLES
  {
    id: 'bundle-commercial-20kva',
    name: 'Business Pro 20KVA',
    slug: 'business-pro-20kva',
    category: 'commercial',
    type: 'bundle',
    price: 22000,
    originalPrice: 25000,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800',
    images: [
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800'
    ],
    description: 'Ideal for small offices, retail stores, and restaurants. Three-phase capability for commercial equipment.',
    shortDescription: 'Small business & office solution',
    specifications: {
      inverterKva: 20,
      batteryKwh: 40,
      solarKw: 15,
      phaseType: 'three',
      batteryType: 'stackable',
      warranty: '10 years',
      backupHours: '6-8 hours',
      coverage: 'Small Office/Retail'
    },
    components: [
      { name: '20KVA 3-Phase Inverter', quantity: 1, specs: 'Commercial Grade' },
      { name: '10kWh Lithium Battery Module', quantity: 4, specs: 'Stackable, LiFePO4' },
      { name: '550W Solar Panels', quantity: 28, specs: 'Commercial Grade' },
      { name: 'Industrial Mounting System', quantity: 1, specs: 'Heavy Duty' },
      { name: 'Energy Management System', quantity: 1, specs: 'Cloud Dashboard' }
    ],
    features: [
      'Three-phase power support',
      'Cloud-based monitoring dashboard',
      'Load prioritization',
      'Scheduled maintenance alerts',
      'ROI tracking reports'
    ],
    inStock: true,
    stockCount: 6,
    isNew: false,
    isFeatured: true,
    isDeal: true,
    dealEndDate: '2025-01-20'
  },
  {
    id: 'bundle-commercial-30kva',
    name: 'Business Elite 30KVA',
    slug: 'business-elite-30kva',
    category: 'commercial',
    type: 'bundle',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800'
    ],
    description: 'Enterprise-grade solution for medium businesses. Full facility backup with intelligent load management.',
    shortDescription: 'Medium business solution',
    specifications: {
      inverterKva: 30,
      batteryKwh: 60,
      solarKw: 25,
      phaseType: 'three',
      batteryType: 'stackable',
      warranty: '10 years',
      backupHours: '8-10 hours',
      coverage: 'Medium Office/Factory'
    },
    components: [
      { name: '30KVA 3-Phase Inverter', quantity: 1, specs: 'Enterprise Grade' },
      { name: '15kWh Lithium Battery Module', quantity: 4, specs: 'Stackable, LiFePO4' },
      { name: '550W Solar Panels', quantity: 46, specs: 'Commercial Grade' },
      { name: 'Ground Mount System', quantity: 1, specs: 'Heavy Duty Steel' },
      { name: 'SCADA Integration', quantity: 1, specs: 'Full Monitoring' }
    ],
    features: [
      'Enterprise SCADA integration',
      'Automatic generator sync',
      'Multi-site monitoring',
      'Predictive maintenance AI',
      'Dedicated account manager'
    ],
    inStock: true,
    stockCount: 3,
    isNew: false,
    isFeatured: false,
    isDeal: false
  },

  // GRID-SCALE
  {
    id: 'bundle-grid-233kwh',
    name: 'Grid Power 233kWh',
    slug: 'grid-power-233kwh',
    category: 'grid-scale',
    type: 'bundle',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
    images: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800'
    ],
    description: 'Entry-level grid-scale solution for estates, EV charging stations, and industrial facilities.',
    shortDescription: 'Estate & EV charging solution',
    specifications: {
      inverterKva: 100,
      batteryKwh: 233,
      solarKw: 100,
      phaseType: 'three',
      batteryType: 'stackable',
      warranty: '15 years',
      backupHours: '4-6 hours at full load',
      coverage: 'Small Estate/EV Station'
    },
    components: [
      { name: '100KVA Containerized Inverter', quantity: 1, specs: 'Outdoor Rated' },
      { name: '233kWh Battery Container', quantity: 1, specs: 'Modular, Climate Controlled' },
      { name: '550W Solar Panels', quantity: 182, specs: 'Utility Grade' },
      { name: 'Ground Mount Array', quantity: 1, specs: 'Engineered Steel' },
      { name: 'SCADA & Protection', quantity: 1, specs: 'Full Suite' }
    ],
    features: [
      'Containerized plug-and-play',
      'Remote monitoring & control',
      'Grid-tie capability',
      'Revenue-grade metering',
      'On-site commissioning'
    ],
    inStock: true,
    stockCount: 2,
    isNew: true,
    isFeatured: true,
    isDeal: false
  },

  // INDIVIDUAL COMPONENTS
  {
    id: 'inverter-5kva',
    name: '5KVA Hybrid Inverter',
    slug: '5kva-hybrid-inverter',
    category: 'residential',
    type: 'inverter',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    description: 'High-efficiency hybrid inverter with built-in MPPT solar charge controller.',
    shortDescription: '5KVA single-phase inverter',
    specifications: {
      inverterKva: 5,
      phaseType: 'single',
      warranty: '5 years'
    },
    features: [
      'Built-in 80A MPPT charger',
      'WiFi monitoring',
      'Pure sine wave output',
      'Wide input voltage range'
    ],
    inStock: true,
    stockCount: 25,
    isNew: false,
    isFeatured: false,
    isDeal: false
  },
  {
    id: 'battery-5kwh',
    name: '5kWh Lithium Battery Module',
    slug: '5kwh-lithium-battery',
    category: 'residential',
    type: 'battery',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    images: ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800'],
    description: 'Premium LiFePO4 battery module with 6000+ cycle life. Stackable design for easy expansion.',
    shortDescription: '5kWh stackable lithium battery',
    specifications: {
      batteryKwh: 5,
      batteryType: 'stackable',
      warranty: '10 years'
    },
    features: [
      '6000+ cycle life',
      'Built-in BMS',
      'Stackable up to 16 units',
      '-20 to 60C operating range'
    ],
    inStock: true,
    stockCount: 40,
    isNew: false,
    isFeatured: false,
    isDeal: false
  }
]

export const featuredProducts = products.filter(p => p.isFeatured)
export const dealProducts = products.filter(p => p.isDeal)
export const bundleProducts = products.filter(p => p.type === 'bundle')
export const residentialProducts = products.filter(p => p.category === 'residential')
export const commercialProducts = products.filter(p => p.category === 'commercial')
export const gridScaleProducts = products.filter(p => p.category === 'grid-scale')
