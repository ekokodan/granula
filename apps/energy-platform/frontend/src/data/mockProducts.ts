// Real product data from Vange and CESC catalogs
// Prices in Nigerian Naira (₦)

export interface ProductSpec {
    label: string
    value: string
}

export interface Product {
    id: string
    title: string
    price: number
    originalPrice?: number
    category: string
    brand: string
    image: string
    specs: ProductSpec[]
    description: string
    isBundle: boolean
    inStock: boolean
    application: 'residential' | 'commercial' | 'industrial'
    type: 'inverter' | 'battery' | 'panel' | 'bundle' | 'generator' | 'other'
}

export const products: Product[] = [
    // ============ VANGE SOLAR PANELS (LONGI) ============
    {
        id: 'SP-LONG-475W',
        title: 'LONGi Solar Panel 475W Mono-Half Cut',
        price: 108900,
        category: 'Solar Panel',
        brand: 'LONGi',
        image: '/images/products/vange/vange-6kva.png', // Using inverter as placeholder for panels
        specs: [
            { label: 'Power', value: '475W' },
            { label: 'Type', value: 'Mono PERC Half-Cut' },
            { label: 'Model', value: 'LR7-54HVH-475M Hi-Mo 10' },
            { label: 'Warranty', value: '25 Years' }
        ],
        description: 'High-efficiency monocrystalline solar panel with half-cut cell technology. Tier 1 manufacturer LONGi delivers exceptional performance and reliability.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'panel'
    },
    {
        id: 'SP-LONG-535W',
        title: 'LONGi Bifacial Solar Panel 535W',
        price: 137500,
        category: 'Solar Panel',
        brand: 'LONGi',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Power', value: '535W' },
            { label: 'Type', value: 'Mono Bifacial Half-Cut' },
            { label: 'Efficiency', value: '21.5%+' },
            { label: 'Warranty', value: '30 Years' }
        ],
        description: 'Bifacial high power panel captures sunlight from both sides for up to 30% more energy production. Ideal for ground-mount and carport installations.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'panel'
    },
    {
        id: 'SP-LONG-645W',
        title: 'LONGi Bifacial Solar Panel 645W',
        price: 165000,
        category: 'Solar Panel',
        brand: 'LONGi',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Power', value: '645W' },
            { label: 'Type', value: 'Mono Bifacial' },
            { label: 'Model', value: 'LR7-72HYD-645M BF-Hi-Mo9' },
            { label: 'Warranty', value: '30 Years' }
        ],
        description: 'Premium 645W bifacial panel for commercial and industrial installations. Maximum power output and durability.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'panel'
    },

    // ============ VANGE LITHIUM BATTERIES ============
    {
        id: 'BT-VG-5WLI',
        title: 'Vange 5.2kWh Lithium Battery',
        price: 1320000,
        category: 'Battery',
        brand: 'Vange',
        image: '/images/products/vange/vange-5kwh.png',
        specs: [
            { label: 'Capacity', value: '5.2kWh' },
            { label: 'Voltage', value: '51.2V 100AH' },
            { label: 'Type', value: 'LiFePO4' },
            { label: 'Mounting', value: 'Wall Mounted' }
        ],
        description: 'Compact wall-mounted lithium battery perfect for residential backup systems. Grade-A LiFePO4 cells with 6000+ cycle life.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'BT-VG-7WLI',
        title: 'Vange 7.68kWh Lithium Battery',
        price: 1440000,
        category: 'Battery',
        brand: 'Vange',
        image: '/images/products/vange/vange-10kwh.png',
        specs: [
            { label: 'Capacity', value: '7.68kWh' },
            { label: 'Voltage', value: '25.6V 300AH' },
            { label: 'Type', value: 'LiFePO4' },
            { label: 'Mounting', value: 'Wall Mounted' }
        ],
        description: 'Mid-capacity lithium battery for extended backup time. Perfect for larger homes and small offices.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'BT-VG-10WGLI',
        title: 'Vange 10.3kWh Lithium Battery',
        price: 2400000,
        category: 'Battery',
        brand: 'Vange',
        image: '/images/products/vange/vange-10kwh.png',
        specs: [
            { label: 'Capacity', value: '10.3kWh' },
            { label: 'Voltage', value: '51.2V 200AH' },
            { label: 'Type', value: 'LiFePO4' },
            { label: 'Mounting', value: 'Wall/Ground' }
        ],
        description: 'Versatile high-capacity battery with dual mounting options. Ideal for whole-home backup and small commercial applications.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'BT-VG-15GLI',
        title: 'Vange 15.4kWh Ground Battery',
        price: 2760000,
        category: 'Battery',
        brand: 'Vange',
        image: '/images/products/vange/vange-15kwh.png',
        specs: [
            { label: 'Capacity', value: '15.4kWh' },
            { label: 'Voltage', value: '51.2V 300AH' },
            { label: 'Type', value: 'LiFePO4' },
            { label: 'Mounting', value: 'Ground Mounted' }
        ],
        description: 'Commercial-grade ground-mounted battery for extended runtime. Powers medium-sized businesses and large homes.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'battery'
    },
    {
        id: 'BT-VG-17GLI',
        title: 'Vange 17kWh Ground Battery',
        price: 3000000,
        category: 'Battery',
        brand: 'Vange',
        image: '/images/products/vange/vange-15kwh.png',
        specs: [
            { label: 'Capacity', value: '17kWh' },
            { label: 'Voltage', value: '51.2V 330AH' },
            { label: 'Type', value: 'LiFePO4' },
            { label: 'Mounting', value: 'Ground Mounted' }
        ],
        description: 'Maximum capacity single-unit battery for demanding applications. Extended backup time with robust construction.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'battery'
    },

    // ============ VANGE TRANSFORMER-BASED HYBRID INVERTERS ============
    {
        id: 'IN-VG-1HTB',
        title: 'Vange 1.5kVA Hybrid Inverter',
        price: 190000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-1.5kva.png',
        specs: [
            { label: 'Capacity', value: '1.5kVA' },
            { label: 'Voltage', value: '12V' },
            { label: 'MPPT', value: '60A' },
            { label: 'Type', value: 'Transformer-Based Hybrid' }
        ],
        description: 'Compact entry-level hybrid inverter perfect for small apartments. Handles lights, fans, TV, and charging devices.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-3HTB',
        title: 'Vange 3kVA Hybrid Inverter',
        price: 320000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-3.8kva.png',
        specs: [
            { label: 'Capacity', value: '3kVA' },
            { label: 'Voltage', value: '24V' },
            { label: 'MPPT', value: '60A' },
            { label: 'Type', value: 'Transformer-Based Hybrid' }
        ],
        description: 'Popular residential inverter with excellent reliability. Powers essential home appliances including refrigerator.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-5HTB',
        title: 'Vange 5kVA Hybrid Inverter',
        price: 480000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Capacity', value: '5kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'MPPT', value: '60A' },
            { label: 'Type', value: 'Transformer-Based Hybrid' }
        ],
        description: 'Versatile 5kVA inverter for medium homes. Supports air conditioning and heavy appliances.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-6HTB',
        title: 'Vange 6.3kVA Dual MPPT Inverter',
        price: 530000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Capacity', value: '6.3kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'MPPT', value: '120A' },
            { label: 'Type', value: 'Transformer-Based Hybrid' }
        ],
        description: 'Enhanced 6.3kVA inverter with dual MPPT controllers for optimal solar charging. Perfect for larger homes.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-12HTB',
        title: 'Vange 12.5kVA Hybrid Inverter',
        price: 1300000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-11kva.png',
        specs: [
            { label: 'Capacity', value: '12.5kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'Type', value: 'Transformer-Based Hybrid' },
            { label: 'Application', value: 'Small Commercial' }
        ],
        description: 'Commercial-grade 12.5kVA inverter for offices and retail spaces. Reliable power for business operations.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-15HTB',
        title: 'Vange 15kVA Hybrid Inverter',
        price: 1750000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-11kva.png',
        specs: [
            { label: 'Capacity', value: '15kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'Model', value: 'VG-INVH-15K-0SW' },
            { label: 'Type', value: 'Transformer-Based Hybrid' }
        ],
        description: 'High-capacity 15kVA transformer-based inverter for demanding commercial applications.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-11HTLUP',
        title: 'Vange 11kW Dual MPPT Inverter',
        price: 1000000,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-11kva.png',
        specs: [
            { label: 'Capacity', value: '11kW' },
            { label: 'Voltage', value: '48V' },
            { label: 'MPPT', value: 'Dual 150A' },
            { label: 'Type', value: 'Un-Paralleled' }
        ],
        description: 'Advanced 11kW inverter with dual 150A MPPT controllers. High solar input capacity for maximum energy harvest.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },

    // ============ VANGE HIGH VOLTAGE 3-PHASE INVERTERS ============
    {
        id: 'IN-VG-3HV',
        title: 'Vange EAST 30kVA 3-Phase Inverter',
        price: 14000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '30kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Type', value: 'Off-Grid Solar Inverter' }
        ],
        description: 'Industrial-grade 30kVA 3-phase off-grid inverter. Powers factories, warehouses, and large commercial facilities.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-4HV',
        title: 'Vange EAST 40kVA 3-Phase Inverter',
        price: 15000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '40kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Type', value: 'Off-Grid Solar Inverter' }
        ],
        description: 'Heavy-duty 40kVA industrial inverter for demanding applications. Robust construction and reliable performance.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-6HV',
        title: 'Vange EAST 60kVA 3-Phase Inverter',
        price: 18000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '60kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Features', value: 'WiFi Monitoring' }
        ],
        description: '60kVA industrial inverter with WiFi monitoring. Remote diagnostics and control for large-scale installations.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-8HV',
        title: 'Vange EAST 80kVA 3-Phase Inverter',
        price: 26000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '80kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Features', value: 'WiFi Monitoring' }
        ],
        description: 'Premium 80kVA industrial system for manufacturing facilities. Maximum reliability and efficiency.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-10HV',
        title: 'Vange EAST 100kVA 3-Phase Inverter',
        price: 29000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '100kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Features', value: 'WiFi Monitoring' }
        ],
        description: 'Top-tier 100kVA industrial inverter for heavy manufacturing and mini-grid applications.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },
    {
        id: 'IN-VG-12HV',
        title: 'Vange EAST 120kVA 3-Phase Inverter',
        price: 31000000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Capacity', value: '120kVA' },
            { label: 'Voltage', value: '360V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Features', value: 'WiFi Monitoring' }
        ],
        description: 'Maximum capacity 120kVA inverter for large industrial facilities and community mini-grids.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },

    // ============ VANGE PURE SINE WAVE NON-HYBRID INVERTERS ============
    {
        id: 'IN-VG-1NH',
        title: 'Vange 1.2kVA Pure Sine Wave Inverter',
        price: 250000,
        category: 'Pure Sine Wave Non-Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-1.5kva.png',
        specs: [
            { label: 'Capacity', value: '1.2kVA' },
            { label: 'Voltage', value: '12V DC to 230V AC' },
            { label: 'Type', value: 'Pure Sine Wave' },
            { label: 'Application', value: 'Basic Backup' }
        ],
        description: 'Budget-friendly pure sine wave inverter for basic backup needs. Perfect for lighting and small appliances.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-2NH',
        title: 'Vange 2.5kVA Pure Sine Wave Inverter',
        price: 345000,
        category: 'Pure Sine Wave Non-Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-3.8kva.png',
        specs: [
            { label: 'Capacity', value: '2.5kVA' },
            { label: 'Voltage', value: '24V DC to 230V AC' },
            { label: 'Type', value: 'Pure Sine Wave' },
            { label: 'Application', value: 'Residential Backup' }
        ],
        description: 'Reliable 2.5kVA non-hybrid inverter for homes with existing battery banks.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-5NH',
        title: 'Vange 5kVA Pure Sine Wave Inverter',
        price: 580000,
        category: 'Pure Sine Wave Non-Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Capacity', value: '5kVA' },
            { label: 'Voltage', value: '48V DC to 230V AC' },
            { label: 'Type', value: 'Pure Sine Wave' },
            { label: 'Application', value: 'Home/Office' }
        ],
        description: 'High-capacity pure sine wave inverter for medium to large homes and small offices.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'IN-VG-7NH',
        title: 'Vange 7kW Pure Sine Wave Inverter',
        price: 650000,
        category: 'Pure Sine Wave Non-Hybrid Inverter',
        brand: 'Vange',
        image: '/images/products/vange/vange-7.5kva.png',
        specs: [
            { label: 'Capacity', value: '7kW' },
            { label: 'Voltage', value: '48V DC to 230V AC' },
            { label: 'Type', value: 'Pure Sine Wave' },
            { label: 'Application', value: 'Large Residential' }
        ],
        description: 'Premium 7kW pure sine wave inverter for large homes with high power demands.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },

    // ============ VANGE ALL-IN-ONE SYSTEMS ============
    {
        id: 'IN-VG-5I5B',
        title: 'Vange 5kVA Inverter + 5kWh Battery Bundle',
        price: 2000000,
        category: 'Inverter&Battery All-in-one',
        brand: 'Vange',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Inverter', value: '5kVA Hybrid' },
            { label: 'Battery', value: '5kWh Lithium' },
            { label: 'Type', value: 'All-in-One System' },
            { label: 'Warranty', value: '5 Years' }
        ],
        description: 'Complete plug-and-play system with 5kVA inverter and 5kWh lithium battery. Perfect starter solution for homes.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'IN-VG-5IB',
        title: 'Vange 5kWh Expansion Battery',
        price: 1300000,
        category: 'Inverter&Battery All-in-one',
        brand: 'Vange',
        image: '/images/products/vange/vange-5kwh.png',
        specs: [
            { label: 'Capacity', value: '5kWh' },
            { label: 'Type', value: 'Lithium Expansion' },
            { label: 'Compatibility', value: 'All-in-One Systems' },
            { label: 'Mounting', value: 'Stackable' }
        ],
        description: 'Additional 5kWh battery module for expanding all-in-one system capacity. Easy plug-and-play installation.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },

    // ============ VANGE PORTABLE GENERATORS ============
    {
        id: 'IN-VG-3PSG',
        title: 'Vange 300W Portable Power Station',
        price: 298000,
        category: 'Portable Solar Generator',
        brand: 'Vange',
        image: '/images/products/vange/vange-1.5kva.png',
        specs: [
            { label: 'Power', value: '300W' },
            { label: 'Capacity', value: '300Wh' },
            { label: 'Model', value: 'G300W' },
            { label: 'Weight', value: 'Portable' }
        ],
        description: 'Compact portable power station for camping, outdoor events, and emergency backup. USB and AC outlets.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'generator'
    },
    {
        id: 'IN-VG-5PSG',
        title: 'Vange 300W/500Wh Portable Power Station',
        price: 350000,
        category: 'Portable Solar Generator',
        brand: 'Vange',
        image: '/images/products/vange/vange-1.5kva.png',
        specs: [
            { label: 'Power', value: '300W' },
            { label: 'Capacity', value: '500Wh' },
            { label: 'Model', value: 'VGE-300W' },
            { label: 'Solar Input', value: 'Yes' }
        ],
        description: 'Enhanced portable power station with larger capacity. Solar charging compatible.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'generator'
    },
    {
        id: 'IN-VG-1PSG',
        title: 'Vange 500W/1kWh Portable Power Station',
        price: 550000,
        category: 'Portable Solar Generator',
        brand: 'Vange',
        image: '/images/products/vange/vange-3.8kva.png',
        specs: [
            { label: 'Power', value: '500W' },
            { label: 'Capacity', value: '1kWh' },
            { label: 'Model', value: 'VGE-500W' },
            { label: 'Runtime', value: 'Extended' }
        ],
        description: 'Premium portable generator with 1kWh capacity. Perfect for extended outdoor activities and backup power.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'generator'
    },

    // ============ CESC INVERTERS ============
    {
        id: 'INSP-CESC-6LV',
        title: 'CESC Saturn 6kVA Low Voltage Inverter',
        price: 1047900,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '6kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'Phase', value: 'Single Phase' },
            { label: 'Series', value: 'Saturn' }
        ],
        description: 'CESC Saturn series 6kVA low voltage hybrid inverter. Reliable performance for residential and small commercial applications.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'INSP-CESC-8LV',
        title: 'CESC Saturn 8kVA Low Voltage Inverter',
        price: 2001300,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '8kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'Phase', value: 'Single Phase' },
            { label: 'Series', value: 'Saturn' }
        ],
        description: 'CESC Saturn 8kVA inverter for larger residential homes and small businesses. Enhanced power capacity.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'INSP-CESC-10LV',
        title: 'CESC Saturn 10kVA Low Voltage Inverter',
        price: 2154600,
        category: 'Transformer Based Hybrid Inverter',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '10kVA' },
            { label: 'Voltage', value: '48V' },
            { label: 'Phase', value: 'Single Phase' },
            { label: 'Series', value: 'Saturn' }
        ],
        description: 'High-capacity CESC Saturn 10kVA inverter for commercial applications and large homes.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'IN3P-CESC-12HV',
        title: 'CESC Mars 12kVA 3-Phase Inverter',
        price: 2280600,
        category: 'High Voltage Hybrid Inverter',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '12kVA' },
            { label: 'Voltage', value: '120V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Series', value: 'Mars High Voltage' }
        ],
        description: 'CESC Mars series 12kVA 3-phase high voltage inverter for commercial installations.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'IN3P-CESC-30HV',
        title: 'CESC Mars 30kVA 3-Phase Inverter',
        price: 4620000,
        category: 'High Voltage Hybrid Inverter',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '30kVA' },
            { label: 'Voltage', value: '120V' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Series', value: 'Mars High Voltage' }
        ],
        description: 'Industrial-grade CESC Mars 30kVA 3-phase inverter for large commercial and industrial facilities.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },

    // ============ CESC BATTERIES ============
    {
        id: 'BT-CESC-5WFLI',
        title: 'CESC Saturn 5kWh Lithium Battery',
        price: 1050000,
        category: 'Battery',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '5kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Type', value: 'Lithium Ion' },
            { label: 'Mounting', value: 'Wall/Floor' }
        ],
        description: 'CESC Saturn series 5kWh lithium ion battery with flexible wall or floor mounting options.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'BT-CESC-10WLI',
        title: 'CESC Saturn 10kWh Lithium Battery',
        price: 1848000,
        category: 'Battery',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '10kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Type', value: 'Lithium Ion' },
            { label: 'Mounting', value: 'Wall/Floor' }
        ],
        description: 'High-capacity CESC 10kWh battery for extended backup time and commercial applications.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'battery'
    },
    {
        id: 'BT-CESC-15WLI',
        title: 'CESC Saturn 15kWh Lithium Battery',
        price: 2583000,
        category: 'Battery',
        brand: 'CESC',
        image: '/images/products/placeholder-cesc.png',
        specs: [
            { label: 'Capacity', value: '16.8kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Type', value: 'Lithium Ion' },
            { label: 'Mounting', value: 'Floor Mounted' }
        ],
        description: 'Premium CESC 15kWh lithium battery for commercial and small industrial applications.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'battery'
    },

    // ============ CUSTOM BUNDLES ============
    {
        id: 'bundle-res-starter',
        title: 'Residential Starter Bundle',
        price: 1800000,
        originalPrice: 1840000,
        category: 'Residential Bundle',
        brand: 'Vange',
        image: '/images/products/vange/vange-6kva.png',
        specs: [
            { label: 'Inverter', value: 'Vange 3kVA Hybrid' },
            { label: 'Battery', value: 'Vange 5.2kWh Lithium' },
            { label: 'Panels', value: '4x LONGi 475W' },
            { label: 'Backup', value: '6-8 Hours' }
        ],
        description: 'Complete residential solar system with 3kVA inverter, 5.2kWh battery, and 1.9kW solar array. Perfect for small to medium homes.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'bundle-res-premium',
        title: 'Premium Home Independence Bundle',
        price: 3500000,
        originalPrice: 3720000,
        category: 'Residential Bundle',
        brand: 'Vange',
        image: '/images/products/vange/vange-11kva.png',
        specs: [
            { label: 'Inverter', value: 'Vange 6.3kVA Dual MPPT' },
            { label: 'Battery', value: 'Vange 10.3kWh Lithium' },
            { label: 'Panels', value: '6x LONGi 535W' },
            { label: 'Backup', value: '12-16 Hours' }
        ],
        description: 'Premium complete home system with 6.3kVA dual MPPT inverter, 10.3kWh battery, and 3.2kW solar array. True energy independence.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'bundle-comm-office',
        title: 'SME Office Power Pack',
        price: 6500000,
        originalPrice: 6900000,
        category: 'Commercial Bundle',
        brand: 'Vange',
        image: '/images/products/vange/vange-11kva.png',
        specs: [
            { label: 'Inverter', value: 'Vange 12.5kVA Hybrid' },
            { label: 'Battery', value: 'Vange 15.4kWh Lithium' },
            { label: 'Panels', value: '10x LONGi 535W' },
            { label: 'Backup', value: '8-12 Hours' }
        ],
        description: 'Complete commercial solution with 12.5kVA inverter, 15.4kWh battery, and 5.35kW solar array. Powers offices, shops, and small businesses.',
        isBundle: true,
        inStock: true,
        application: 'commercial',
        type: 'bundle'
    },
    {
        id: 'bundle-ind-factory',
        title: 'Industrial Factory Power System',
        price: 35000000,
        originalPrice: 38000000,
        category: 'Industrial Bundle',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Inverter', value: 'Vange EAST 60kVA 3-Phase' },
            { label: 'Battery', value: '2x Vange 17kWh (34kWh Total)' },
            { label: 'Panels', value: '60x LONGi 645W' },
            { label: 'Monitoring', value: 'WiFi + SCADA' }
        ],
        description: 'Heavy-duty industrial system with 60kVA 3-phase inverter, 34kWh battery bank, and 38.7kW solar array. Includes WiFi monitoring and SCADA integration.',
        isBundle: true,
        inStock: true,
        application: 'industrial',
        type: 'bundle'
    },
    {
        id: 'bundle-minigrid',
        title: 'Mini-Grid Community System',
        price: 85000000,
        category: 'Industrial Bundle',
        brand: 'Vange',
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        specs: [
            { label: 'Inverter', value: 'Vange EAST 120kVA 3-Phase' },
            { label: 'Battery', value: '120kWh Battery Bank' },
            { label: 'Coverage', value: '50+ Homes/Businesses' },
            { label: 'Monitoring', value: 'Full SCADA + Metering' }
        ],
        description: 'Complete mini-grid solution powering entire communities. Includes 120kVA inverter, massive battery bank, solar array, metering, and billing system.',
        isBundle: true,
        inStock: true,
        application: 'industrial',
        type: 'bundle'
    }
]

// Helper functions
export const getFeaturedProduct = () => products.find(p => p.id === 'bundle-res-starter')
export const getProductsByApplication = (app: string) => products.filter(p => p.application === app)
export const getProductsByType = (type: string) => products.filter(p => p.type === type)
export const getBundles = () => products.filter(p => p.isBundle)
export const getInStockProducts = () => products.filter(p => p.inStock)
export const getOnSaleProducts = () => products.filter(p => p.originalPrice)
