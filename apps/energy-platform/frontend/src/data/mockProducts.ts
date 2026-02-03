export const products = [
    // ============ RESIDENTIAL BUNDLES ============
    {
        id: 'bundle-res-1',
        title: 'Starter Home Backup Bundle',
        price: 3500000,
        originalPrice: 3800000,
        category: 'Residential Bundle',
        brand: 'GridCo',
        image: '/images/product_residential_bundle.png',
        specs: [
            { label: 'Inverter', value: '5kVA' },
            { label: 'Battery', value: '5kWh' },
            { label: 'Backup', value: '6-8 Hrs' },
            { label: 'Warranty', value: '5 Years' }
        ],
        description: 'Perfect for small homes and apartments. Handles essential loads like lights, fans, TV, and charging devices.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'bundle-res-2',
        title: 'Premium Home Independence',
        price: 8200000,
        originalPrice: 8500000,
        category: 'Residential Bundle',
        brand: 'GridCo',
        image: '/images/product_residential_3d.png',
        specs: [
            { label: 'Inverter', value: '10kVA' },
            { label: 'Battery', value: '15kWh' },
            { label: 'Backup', value: '12-16 Hrs' },
            { label: 'Warranty', value: '10 Years' }
        ],
        description: 'Full home coverage including AC, refrigerator, and water heater. True energy independence for medium to large homes.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'bundle-res-3',
        title: 'Compact Urban Backup',
        price: 2200000,
        category: 'Residential Bundle',
        brand: 'GridCo',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Inverter', value: '3kVA' },
            { label: 'Battery', value: '3kWh' },
            { label: 'Backup', value: '4-5 Hrs' },
            { label: 'Warranty', value: '3 Years' }
        ],
        description: 'Ideal for flats and small spaces. Quiet operation, compact design.',
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },

    // ============ COMMERCIAL BUNDLES ============
    {
        id: 'bundle-comm-1',
        title: 'SME Office Power Pack',
        price: 12500000,
        category: 'Commercial Bundle',
        brand: 'GridCo',
        image: '/images/product_commercial_bundle.png',
        specs: [
            { label: 'Inverter', value: '20kVA' },
            { label: 'Battery', value: '30kWh' },
            { label: 'Backup', value: '8-10 Hrs' },
            { label: 'Warranty', value: '10 Years' }
        ],
        description: 'Keep your office running during outages. Powers computers, servers, lighting, and AC.',
        isBundle: true,
        inStock: true,
        application: 'commercial',
        type: 'bundle'
    },
    {
        id: 'bundle-comm-2',
        title: 'Retail Store Solution',
        price: 18500000,
        originalPrice: 20000000,
        category: 'Commercial Bundle',
        brand: 'GridCo',
        image: '/images/product_commercial_3d.png',
        specs: [
            { label: 'Inverter', value: '30kVA' },
            { label: 'Battery', value: '50kWh' },
            { label: 'Backup', value: '10-14 Hrs' },
            { label: 'Warranty', value: '10 Years' }
        ],
        description: 'Perfect for supermarkets, malls, and retail spaces. Handles refrigeration and high loads.',
        isBundle: true,
        inStock: true,
        application: 'commercial',
        type: 'bundle'
    },
    {
        id: 'bundle-comm-3',
        title: 'Hotel & Hospitality Pack',
        price: 35000000,
        category: 'Commercial Bundle',
        brand: 'GridCo',
        image: '/images/product_commercial_real.png',
        specs: [
            { label: 'Inverter', value: '50kVA' },
            { label: 'Battery', value: '100kWh' },
            { label: 'Backup', value: '12-18 Hrs' },
            { label: 'Warranty', value: '15 Years' }
        ],
        description: 'Enterprise-grade solution for hotels, hospitals, and large facilities. Zero downtime guarantee.',
        isBundle: true,
        inStock: false,
        application: 'commercial',
        type: 'bundle'
    },

    // ============ INDUSTRIAL / MINI-GRID ============
    {
        id: 'bundle-ind-1',
        title: 'Factory Power System',
        price: 75000000,
        category: 'Industrial Bundle',
        brand: 'GridCo',
        image: '/images/product_industrial_3d.png',
        specs: [
            { label: 'Capacity', value: '100kVA' },
            { label: 'Battery', value: '200kWh' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Warranty', value: '15 Years' }
        ],
        description: 'Heavy-duty industrial power for manufacturing and production facilities. Custom engineering included.',
        isBundle: true,
        inStock: true,
        application: 'industrial',
        type: 'bundle'
    },
    {
        id: 'bundle-ind-2',
        title: 'Mini-Grid Community System',
        price: 150000000,
        category: 'Industrial Bundle',
        brand: 'GridCo',
        image: '/images/product_industrial_real.png',
        specs: [
            { label: 'Capacity', value: '250kVA' },
            { label: 'Coverage', value: '50+ Homes' },
            { label: 'Monitoring', value: 'SCADA' },
            { label: 'Warranty', value: '20 Years' }
        ],
        description: 'Power entire communities with reliable, clean energy. Includes metering and billing system.',
        isBundle: true,
        inStock: true,
        application: 'minigrid',
        type: 'bundle'
    },

    // ============ STANDALONE BATTERIES ============
    {
        id: 'bat-1',
        title: 'LiFePO4 Battery 5kWh',
        price: 1200000,
        category: 'Battery',
        brand: 'Pylontech',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Capacity', value: '5.12kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Cycles', value: '6000+' },
            { label: 'DOD', value: '90%' }
        ],
        description: 'Premium lithium iron phosphate battery. Safe, long-lasting, and stackable.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'bat-2',
        title: 'LiFePO4 Battery 10kWh',
        price: 2200000,
        originalPrice: 2400000,
        category: 'Battery',
        brand: 'Pylontech',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Capacity', value: '10.24kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Cycles', value: '6000+' },
            { label: 'DOD', value: '95%' }
        ],
        description: 'Double capacity for extended backup. Ideal for whole-home systems.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'bat-3',
        title: 'High Voltage Battery 15kWh',
        price: 3800000,
        category: 'Battery',
        brand: 'BYD',
        image: '/images/product_commercial_real.png',
        specs: [
            { label: 'Capacity', value: '15.36kWh' },
            { label: 'Voltage', value: '102V' },
            { label: 'Cycles', value: '8000+' },
            { label: 'DOD', value: '100%' }
        ],
        description: 'High voltage design for commercial applications. Maximum efficiency.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'battery'
    },

    // ============ STANDALONE INVERTERS ============
    {
        id: 'inv-1',
        title: 'Hybrid Inverter 5kW',
        price: 850000,
        category: 'Inverter',
        brand: 'Growatt',
        image: '/images/product_residential_3d.png',
        specs: [
            { label: 'Output', value: '5000W' },
            { label: 'MPPT', value: 'Dual' },
            { label: 'Efficiency', value: '97.6%' },
            { label: 'Type', value: 'Hybrid' }
        ],
        description: 'Versatile hybrid inverter for solar, grid, and battery integration.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'inv-2',
        title: 'Hybrid Inverter 8kW',
        price: 1350000,
        originalPrice: 1500000,
        category: 'Inverter',
        brand: 'Growatt',
        image: '/images/product_residential_3d.png',
        specs: [
            { label: 'Output', value: '8000W' },
            { label: 'MPPT', value: 'Triple' },
            { label: 'Efficiency', value: '98.2%' },
            { label: 'Type', value: 'Hybrid' }
        ],
        description: 'Higher capacity for larger homes. Smart monitoring included.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'inv-3',
        title: 'Commercial Inverter 30kW',
        price: 3200000,
        category: 'Inverter',
        brand: 'SMA',
        image: '/images/product_commercial_3d.png',
        specs: [
            { label: 'Output', value: '30kW' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Efficiency', value: '98.5%' },
            { label: 'Type', value: 'Grid-Tie' }
        ],
        description: 'German engineering for commercial installations. Industry-leading reliability.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'inv-4',
        title: 'Commercial Inverter 50kW',
        price: 4500000,
        category: 'Inverter',
        brand: 'Victron',
        image: '/images/product_commercial_real.png',
        specs: [
            { label: 'Output', value: '50kW' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Efficiency', value: '98.5%' },
            { label: 'Type', value: 'Grid-Tie' }
        ],
        description: 'Premium Victron inverter for demanding commercial applications.',
        isBundle: false,
        inStock: false,
        application: 'commercial',
        type: 'inverter'
    },
    {
        id: 'inv-5',
        title: 'Industrial Inverter 100kW',
        price: 12000000,
        category: 'Inverter',
        brand: 'ABB',
        image: '/images/product_industrial_3d.png',
        specs: [
            { label: 'Output', value: '100kW' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Efficiency', value: '99.0%' },
            { label: 'Type', value: 'Central' }
        ],
        description: 'Industrial-grade central inverter for large-scale installations.',
        isBundle: false,
        inStock: true,
        application: 'industrial',
        type: 'inverter'
    },

    // ============ SOLAR PANELS ============
    {
        id: 'panel-1',
        title: 'Monocrystalline Panel 550W',
        price: 185000,
        category: 'Solar Panel',
        brand: 'JA Solar',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Power', value: '550W' },
            { label: 'Efficiency', value: '21.3%' },
            { label: 'Type', value: 'Mono PERC' },
            { label: 'Warranty', value: '25 Years' }
        ],
        description: 'High-efficiency monocrystalline panel. Tier 1 manufacturer.',
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'panel'
    },
    {
        id: 'panel-2',
        title: 'Bifacial Panel 600W',
        price: 220000,
        originalPrice: 250000,
        category: 'Solar Panel',
        brand: 'LONGi',
        image: '/images/product_commercial_real.png',
        specs: [
            { label: 'Power', value: '600W' },
            { label: 'Efficiency', value: '22.5%' },
            { label: 'Type', value: 'Bifacial' },
            { label: 'Warranty', value: '30 Years' }
        ],
        description: 'Dual-sided power generation. Up to 30% more energy from reflected light.',
        isBundle: false,
        inStock: true,
        application: 'commercial',
        type: 'panel'
    }
]

// Helper functions
export const getFeaturedProduct = () => products.find(p => p.id === 'bundle-res-1')
export const getProductsByApplication = (app: string) => products.filter(p => p.application === app)
export const getProductsByType = (type: string) => products.filter(p => p.type === type)
export const getBundles = () => products.filter(p => p.isBundle)
export const getInStockProducts = () => products.filter(p => p.inStock)
export const getOnSaleProducts = () => products.filter(p => p.originalPrice)
