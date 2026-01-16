'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { Calculator, ArrowRight } from 'lucide-react'

export default function SystemBuilderCTA() {
    return (
        <section className="py-section-xl bg-gray-cool-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal>
                        <div>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-700 mb-8">
                                <Calculator className="h-4 w-4 text-primary-400" />
                                <span className="text-sm font-medium text-primary-300">Interactive System Builder</span>
                            </div>

                            <h2 className="text-h1 font-bold text-white mb-6">
                                Build Your Own System on Your Own Terms
                            </h2>

                            <p className="text-body-lg text-gray-cool-300 mb-10 leading-relaxed">
                                Not sure what you need? Our interactive tool helps you calculate your load, select your appliances, and recommends the perfect inverter and battery combination for your budget.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/builder">
                                    <Button size="lg" className="h-14 px-8 text-body-lg bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-900/20">
                                        Start Building Now
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-cool-700 bg-gray-cool-800/50 backdrop-blur-sm">
                            {/* Mockup of the builder interface */}
                            <div className="aspect-[16/10] relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-cool-800">
                                    <span className="text-gray-cool-500">Interactive Builder Preview UI</span>
                                </div>
                                {/* 
                    Ideally, we would place a screenshot of the actual builder here.
                    For now, we can use a placeholder or a generic tech image.
                 */}
                                <Image
                                    src="/images/builder_ui_mockup_1765747408138.png"
                                    alt="System Builder Interface"
                                    fill
                                    className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-slow"
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}
