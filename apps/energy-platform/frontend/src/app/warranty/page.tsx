import Navbar from '@/components/layout/Navbar'
import { Shield, XCircle } from 'lucide-react'
import Image from 'next/image'

export default function WarrantyPage() {
    const warrantyTiers = [
        {
            image: '/images/icons/icon-battery.png',
            name: 'Batteries',
            period: '5-10 Years',
            color: 'emerald',
            details: [
                'LiFePO4 batteries: 10-year manufacturer warranty',
                'Standard lithium batteries: 5-7 year warranty',
                'Covers manufacturing defects and capacity degradation',
                'Minimum 80% capacity retention at end of warranty',
                'Cycle life guarantee: 6000+ cycles for LiFePO4'
            ]
        },
        {
            image: '/images/icons/icon-inverter.png',
            name: 'Inverters',
            period: '2-5 Years',
            color: 'blue',
            details: [
                'Transformer-based inverters: 5-year warranty',
                'Pure sine wave inverters: 3-year warranty',
                'Hybrid inverters: 3-5 year warranty (model dependent)',
                'Covers electronic component failures',
                'MPPT controller and display unit included'
            ]
        },
        {
            image: '/images/icons/icon-solar.png',
            name: 'Solar Panels',
            period: '25 Years',
            color: 'amber',
            details: [
                'Performance warranty: 25 years',
                'Product warranty: 10-12 years',
                'Minimum 80% efficiency at year 25',
                'Linear power degradation guarantee',
                'Covers manufacturing defects, discoloration, and delamination'
            ]
        },
        {
            image: '/images/icons/icon-bundle.png',
            name: 'Complete Bundles',
            period: '5 Years',
            color: 'purple',
            details: [
                'Comprehensive 5-year system warranty',
                'Covers all components in the bundle',
                'Installation workmanship guarantee: 1 year',
                'Priority service for warranty claims',
                'Free annual maintenance (if maintenance plan included)'
            ]
        }
    ]

    const claimSteps = [
        {
            step: '1',
            title: 'Contact Support',
            description: 'Email warranty@gridco.ng or call +234 800 GRIDCO with your order number and issue description.'
        },
        {
            step: '2',
            title: 'Provide Documentation',
            description: 'Submit proof of purchase, installation records, and photos/videos of the issue.'
        },
        {
            step: '3',
            title: 'Assessment',
            description: 'Our technical team will review your claim within 48 hours and may schedule an inspection.'
        },
        {
            step: '4',
            title: 'Resolution',
            description: 'Approved claims are resolved through repair, replacement, or credit based on warranty terms.'
        }
    ]

    const covered = [
        'Manufacturing defects in materials and workmanship',
        'Component failures during normal use',
        'Performance degradation beyond specified limits',
        'Installation defects (within 1 year of installation)',
        'Premature battery capacity loss',
        'Inverter electronic failures'
    ]

    const notCovered = [
        'Damage from improper installation or unauthorized modifications',
        'Normal wear and tear',
        'Damage from power surges, lightning, or natural disasters',
        'Misuse, abuse, or neglect',
        'Cosmetic damage that doesn\'t affect performance',
        'Accessories and consumables (cables, fuses, etc.)',
        'Labor costs after initial warranty period',
        'Products purchased from unauthorized resellers'
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                        <Shield className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Product Warranty
                    </h1>
                    <p className="text-lg text-gray-cool-600 max-w-2xl mx-auto">
                        We stand behind the quality of our products. Every GridCo Energy system comes with comprehensive warranty coverage.
                    </p>
                </div>

                {/* Warranty Tiers */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {warrantyTiers.map((tier, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <Image 
                                        src={tier.image} 
                                        alt={tier.name} 
                                        width={40} 
                                        height={40} 
                                        className="w-10 h-10 object-contain" 
                                    />
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-cool-900">{tier.name}</h3>
                                        <p className={`text-${tier.color}-600 font-semibold`}>{tier.period} Warranty</p>
                                    </div>
                                </div>
                            </div>
                            <ul className="space-y-2.5">
                                {tier.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="flex items-start gap-2">
                                        <Shield className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-cool-700 text-sm">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* How to Make a Claim */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 md:p-12 shadow-sm mb-12">
                    <h2 className="text-3xl font-bold text-gray-cool-900 mb-8 text-center">How to Make a Warranty Claim</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {claimSteps.map((step, index) => (
                            <div key={index} className="relative">
                                {index < claimSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-cool-200 -z-10" />
                                )}
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full font-bold text-2xl mb-4">
                                        {step.step}
                                    </div>
                                    <h3 className="font-bold text-gray-cool-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-cool-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What's Covered vs Not Covered */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Image 
                                src="/images/icons/icon-clipboard.png" 
                                alt="What's Covered" 
                                width={32} 
                                height={32} 
                                className="w-8 h-8 object-contain" 
                            />
                            <h2 className="text-2xl font-bold text-gray-cool-900">What's Covered</h2>
                        </div>
                        <ul className="space-y-3">
                            {covered.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-cool-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div id="returns" className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <XCircle className="h-8 w-8 text-red-600" />
                            <h2 className="text-2xl font-bold text-gray-cool-900">What's Not Covered</h2>
                        </div>
                        <ul className="space-y-3">
                            {notCovered.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-cool-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact for Warranty Claims */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Need Help with a Warranty Claim?</h2>
                    <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
                        Our warranty support team is ready to assist you. Contact us with your order details and we'll guide you through the process.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="mailto:warranty@gridco.ng" className="flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
                            <Image 
                                src="/images/icons/icon-email.png" 
                                alt="Email" 
                                width={20} 
                                height={20} 
                                className="w-5 h-5 object-contain" 
                            />
                            warranty@gridco.ng
                        </a>
                        <a href="tel:+2348000000000" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors border-2 border-white/30">
                            <Image 
                                src="/images/icons/icon-phone.png" 
                                alt="Phone" 
                                width={20} 
                                height={20} 
                                className="w-5 h-5 object-contain" 
                            />
                            +234 800 GRIDCO
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
