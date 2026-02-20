'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

export default function HelpPage() {
    const [openItems, setOpenItems] = useState<string[]>([])

    const faqCategories = [
        {
            category: 'Products',
            icon: '📦',
            questions: [
                {
                    q: 'What is the difference between LiFePO4 and standard lithium batteries?',
                    a: 'LiFePO4 (Lithium Iron Phosphate) batteries offer superior safety, longer cycle life (6000+ cycles vs 3000-5000), better thermal stability, and longer warranty periods (10 years vs 5-7 years). They\'re ideal for long-term solar installations despite slightly higher upfront cost.'
                },
                {
                    q: 'How do I choose the right inverter size for my home?',
                    a: 'Calculate your total wattage of appliances you want to run simultaneously. Add 20-30% buffer for surge capacity. For example, if you need to run 3000W of appliances, choose a 3.8-5kVA inverter. Our system builder tool can help you calculate this automatically.'
                },
                {
                    q: 'Can I expand my solar system later?',
                    a: 'Yes! Most of our systems are expandable. You can add more solar panels (if your inverter MPPT can handle it), add battery banks in parallel, or upgrade to a larger inverter. Our bundles are designed with future expansion in mind.'
                },
                {
                    q: 'What is MPPT and why does it matter?',
                    a: 'MPPT (Maximum Power Point Tracking) is a solar charge controller that maximizes energy harvest from solar panels. Dual MPPT controllers allow connecting panels with different orientations or shading conditions, increasing overall system efficiency by 20-30%.'
                }
            ]
        },
        {
            category: 'Ordering',
            icon: '🛒',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept debit/credit card payments via Paystack (Visa, Mastercard, Verve), bank transfers, and USSD payments. For large commercial orders, we can arrange payment terms with approved credit.'
                },
                {
                    q: 'How long does delivery take?',
                    a: 'In-stock items ship within 5-7 business days to Lagos, Abuja, and Port Harcourt. Other locations may take 7-14 days. Custom orders and industrial systems typically ship within 2-4 weeks depending on specifications.'
                },
                {
                    q: 'Do you offer bulk discounts?',
                    a: 'Yes! We offer volume discounts for orders of 5+ systems, developers, and commercial installations. Contact our sales team at sales@gridco.ng for a custom quote.'
                },
                {
                    q: 'Can I cancel or modify my order?',
                    a: 'Orders can be modified or cancelled within 24 hours of placement. After that, a cancellation fee may apply. Contact customer support immediately if you need to make changes.'
                }
            ]
        },
        {
            category: 'Installation',
            icon: '🔧',
            questions: [
                {
                    q: 'Is professional installation required?',
                    a: 'While not legally required, we strongly recommend professional installation for safety and warranty purposes. Improper installation can void warranties and create safety hazards. Our certified installers ensure optimal system performance.'
                },
                {
                    q: 'How long does installation take?',
                    a: 'Residential systems (5-10kVA) typically take 1-2 days. Commercial systems (12-30kVA) take 2-4 days. Large industrial installations may take 1-2 weeks depending on complexity and site conditions.'
                },
                {
                    q: 'Do I need any permits or approvals?',
                    a: 'For grid-tied systems, you may need approval from your electricity distribution company (DISCO). Off-grid systems generally don\'t require permits. Our installation team can advise on local requirements and assist with documentation.'
                },
                {
                    q: 'What if my roof can\'t support solar panels?',
                    a: 'We offer ground-mounted solar solutions, carport installations, and pole-mounted arrays. Our site assessment team will evaluate your property and recommend the best mounting option for your situation.'
                }
            ]
        },
        {
            category: 'Financing',
            icon: '💳',
            questions: [
                {
                    q: 'Do you offer financing or payment plans?',
                    a: 'We\'re currently establishing partnerships with financing providers to offer flexible payment options. Subscribe to our newsletter or check back soon for updates on financing availability.'
                },
                {
                    q: 'Are there government incentives for solar in Nigeria?',
                    a: 'The Nigerian government offers tax incentives and import duty waivers for renewable energy equipment. Additionally, the Central Bank of Nigeria has intervention funds for solar projects. Contact us for information on accessing these programs.'
                },
                {
                    q: 'What is the ROI on a solar investment?',
                    a: 'Most residential systems pay for themselves in 3-5 years through fuel and grid electricity savings. Commercial systems often see ROI in 2-4 years. Actual payback depends on your current energy costs and usage patterns.'
                },
                {
                    q: 'Can I use solar to reduce my NEPA bill?',
                    a: 'Yes! Hybrid systems can work with grid power, automatically switching to solar during the day and battery at night. This can reduce your NEPA bill by 70-90% while providing backup during outages.'
                }
            ]
        },
        {
            category: 'Warranty',
            icon: '🛡️',
            questions: [
                {
                    q: 'What does the warranty cover?',
                    a: 'Warranties cover manufacturing defects, performance degradation beyond specified limits, and component failures. Batteries (5-10 years), inverters (2-5 years), and solar panels (25 years) each have specific warranty terms. See our warranty page for details.'
                },
                {
                    q: 'How do I make a warranty claim?',
                    a: 'Email warranty@gridco.ng with your order number, photos of the issue, and description. Our team will review within 48 hours and schedule an inspection if needed. Most claims are resolved within 7-14 days.'
                },
                {
                    q: 'Does installation affect warranty?',
                    a: 'Using our certified installers ensures full warranty coverage. Third-party installation may void certain warranty terms. We offer 1-year workmanship warranty on our installations.'
                },
                {
                    q: 'What happens if a product is discontinued?',
                    a: 'If a warrantied product is discontinued, we\'ll replace it with an equivalent or superior model at no extra cost. Our warranty commitments remain valid regardless of product availability.'
                }
            ]
        },
        {
            category: 'Technical',
            icon: '⚡',
            questions: [
                {
                    q: 'How do I maintain my solar system?',
                    a: 'Clean panels quarterly (or monthly in dusty areas), check battery water levels monthly (for lead-acid), inspect connections annually, and monitor system performance via inverter display. We offer annual maintenance packages for comprehensive care.'
                },
                {
                    q: 'Why is my battery not charging fully?',
                    a: 'Common causes: insufficient solar panel capacity, shading, incorrect MPPT settings, aging batteries, or high load during charging. Check inverter display for error codes and contact support if issues persist.'
                },
                {
                    q: 'Can I run air conditioning on solar?',
                    a: 'Yes! A 1.5HP AC requires about 1500-2000W. You\'ll need at least a 5kVA inverter and 10kWh+ battery for reliable all-day AC operation. We recommend 2.5-3kW of solar panels for AC-heavy setups.'
                },
                {
                    q: 'What happens during rainy season?',
                    a: 'Solar panels still generate power on cloudy days (20-40% of sunny day output). Your battery bank provides backup during low-sun periods. Properly sized systems account for seasonal variations in solar production.'
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-5xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <Image 
                            src="/images/icons/icon-help.png" 
                            alt="Help Center" 
                            width={56} 
                            height={56} 
                            className="w-14 h-14 object-contain" 
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Help Center
                    </h1>
                    <p className="text-lg text-gray-cool-600 max-w-2xl mx-auto">
                        Find answers to common questions about our solar products, installation, and services.
                    </p>
                </div>

                {/* FAQ Accordion by Category */}
                <div className="space-y-8 mb-12">
                    {faqCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-cool-900 mb-6 flex items-center gap-3">
                                <span className="text-3xl">{category.icon}</span>
                                {category.category}
                            </h2>
                            
                            <Accordion.Root type="multiple" value={openItems} onValueChange={setOpenItems}>
                                {category.questions.map((item, index) => {
                                    const value = `${categoryIndex}-${index}`
                                    return (
                                        <Accordion.Item 
                                            key={index} 
                                            value={value}
                                            className="border-b border-gray-cool-100 last:border-0"
                                        >
                                            <Accordion.Header>
                                                <Accordion.Trigger className="flex items-center justify-between w-full py-4 text-left hover:text-emerald-600 transition-colors group">
                                                    <span className="font-semibold text-gray-cool-900 group-hover:text-emerald-600 pr-4">
                                                        {item.q}
                                                    </span>
                                                    <ChevronDown 
                                                        className={`h-5 w-5 text-gray-cool-400 transition-transform flex-shrink-0 ${
                                                            openItems.includes(value) ? 'rotate-180' : ''
                                                        }`} 
                                                    />
                                                </Accordion.Trigger>
                                            </Accordion.Header>
                                            <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                                                <div className="pb-4 text-gray-cool-700 leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </Accordion.Content>
                                        </Accordion.Item>
                                    )
                                })}
                            </Accordion.Root>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
                        Our customer support team is here to help. Reach out and we'll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                                <Image 
                                    src="/images/icons/icon-email.png" 
                                    alt="Contact Support" 
                                    width={24} 
                                    height={24} 
                                    className="w-6 h-6 object-contain mr-2" 
                                />
                                Contact Support
                            </Button>
                        </Link>
                        <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                <Image 
                                    src="/images/icons/icon-chat.png" 
                                    alt="WhatsApp Chat" 
                                    width={24} 
                                    height={24} 
                                    className="w-6 h-6 object-contain mr-2" 
                                />
                                WhatsApp Chat
                            </Button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}
