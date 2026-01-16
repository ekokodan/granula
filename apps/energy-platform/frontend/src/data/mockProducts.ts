export const products = [
    {
        id: 'bundle-res-1',
        title: 'Starter Home Backup Bundle',
        price: 3500000,
        originalPrice: 3800000,
        category: 'Residential Bundle',
        image: '/images/product_residential_bundle.png',
        specs: [
            { label: 'Inverter', value: '5kVA' },
            { label: 'Battery', value: '5kWh' },
            { label: 'Backup', value: '6-8 Hrs' },
            { label: 'Warranty', value: '5 Years' }
        ],
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
        image: '/images/product_residential_bundle.png',
        specs: [
            { label: 'Inverter', value: '10kVA' },
            { label: 'Battery', value: '15kWh' },
            { label: 'Backup', value: '12-16 Hrs' },
            { label: 'Warranty', value: '10 Years' }
        ],
        isBundle: true,
        inStock: true,
        application: 'residential',
        type: 'bundle'
    },
    {
        id: 'bundle-comm-1',
        title: 'SME Office Power Pack',
        price: 12500000,
        category: 'Commercial Bundle',
        image: '/images/product_commercial_bundle.png',
        specs: [
            { label: 'Inverter', value: '20kVA (3-Phase)' },
            { label: 'Battery', value: '30kWh' },
            { label: 'Backup', value: '8-10 Hrs' },
            { label: 'Warranty', value: '10 Years' }
        ],
        isBundle: true,
        inStock: true,
        application: 'commercial',
        type: 'bundle'
    },
    {
        id: 'bat-1',
        title: 'Lithium Iron Phosphate 5kWh',
        price: 1200000,
        category: 'Battery',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Capacity', value: '5.12kWh' },
            { label: 'Voltage', value: '48V' },
            { label: 'Cycles', value: '6000+' },
            { label: 'DOD', value: '90%' }
        ],
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'battery'
    },
    {
        id: 'inv-1',
        title: 'Hybrid Inverter 5kW',
        price: 850000,
        category: 'Inverter',
        image: '/images/product_residential_real.png',
        specs: [
            { label: 'Output', value: '5000W' },
            { label: 'MPPT', value: 'Dual' },
            { label: 'Efficiency', value: '97.6%' },
            { label: 'Type', value: 'Hybrid' }
        ],
        isBundle: false,
        inStock: true,
        application: 'residential',
        type: 'inverter'
    },
    {
        id: 'inv-2',
        title: 'Commercial Inverter 50kW',
        price: 4500000,
        category: 'Inverter',
        image: '/images/product_commercial_real.png',
        specs: [
            { label: 'Output', value: '50kW' },
            { label: 'Phase', value: '3-Phase' },
            { label: 'Efficiency', value: '98.5%' },
            { label: 'Type', value: 'Grid-Tie' }
        ],
        isBundle: false,
        inStock: false,
        application: 'commercial',
        type: 'inverter'
    }
]
