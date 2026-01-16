'use client'

import { ScrollReveal } from '@/components/ScrollAnimations'
import { CheckCircle2 } from 'lucide-react'

export default function AboutSection() {
    return (
        <section className="py-section-xl bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <ScrollReveal>
                        <h2 className="text-h2 font-bold text-gray-cool-900 mb-8">
                            Why Choose GridCo?
                        </h2>
                        <p className="text-body-lg text-gray-cool-600 mb-12 leading-relaxed">
                            We are not just another vendor. We are energy engineers committed to solving Nigeria's power crisis with premium, long-lasting technology. Our partnership with top-tier manufacturers ensures you get Grade-A equipment that stands the test of time.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            {[
                                'Direct Manufacturer Partnership',
                                'Certified Installation Team',
                                'Comprehensive Warranty Support',
                                'After-Sales Service & Maintenance',
                                'Transparent Pricing',
                                'Nationwide Delivery'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
                                    <span className="text-body font-medium text-gray-cool-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
