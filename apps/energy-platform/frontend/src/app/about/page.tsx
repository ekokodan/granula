'use client'

import Navbar from '@/components/layout/Navbar'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 z-0">
                    <div className="absolute inset-0 bg-[url('/images/hero_bg_1765747345563.png')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-gray-900/90" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <ScrollReveal>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
                            Powering Nigeria's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
                                Energy Future
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            We are on a mission to democratize access to reliable, clean energy through advanced technology and premium engineering.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <ScrollReveal>
                            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/product_industrial_real.png"
                                    alt="Our Technology"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <div className="text-sm font-bold uppercase tracking-widest mb-2 text-primary-400">Since 2023</div>
                                    <div className="text-2xl font-bold">Engineering Excellence</div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <div className="space-y-12">
                            <ScrollReveal delay={0.2}>
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-4">
                                        Our Mission
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-cool-900 mb-4">
                                        Reliable Power as a Right
                                    </h2>
                                    <p className="text-lg text-gray-cool-600 leading-relaxed">
                                        We believe that consistent electricity is the bedrock of productivity and quality of life. By combining cutting-edge lithium storage with smart solar integration, we provide systems that just work—silently, efficiently, and indefinitely.
                                    </p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.4}>
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-sm font-bold mb-4">
                                        Our Vision
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-cool-900 mb-4">
                                        A Grid-Optional World
                                    </h2>
                                    <p className="text-lg text-gray-cool-600 leading-relaxed">
                                        We envision a future where homes and businesses generate, store, and manage their own power, independent of centralized grid failures.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-24 bg-gray-warm-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-cool-900">Why Choose GridCo</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                image: '/images/icons/icon-solar.png',
                                title: 'Clean Energy',
                                desc: 'Zero emissions, zero noise. Just pure, renewable power.'
                            },
                            {
                                image: '/images/icons/icon-battery.png',
                                title: 'Premium Storage',
                                desc: 'Tier-1 Lithium Iron Phosphate (LFP) cells with 6000+ cycles.'
                            },
                            {
                                image: '/images/icons/icon-inverter.png',
                                title: 'Smart Systems',
                                desc: 'AI-driven energy management that optimizes your usage.'
                            },
                            {
                                image: '/images/icons/icon-globe.png',
                                title: 'Nationwide Support',
                                desc: 'Installation and maintenance teams across 36 states.'
                            }
                        ].map((item, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-cool-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <Image 
                                        src={item.image} 
                                        alt={item.title} 
                                        width={48} 
                                        height={48} 
                                        className="w-12 h-12 object-contain mb-6" 
                                    />
                                    <h3 className="text-xl font-bold text-gray-cool-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-cool-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gray-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6">Ready to Switch to Premium Power?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join hundreds of satisfied homeowners and businesses who have taken control of their energy.
                    </p>
                    <Button size="lg" className="bg-primary-600 hover:bg-primary-500 text-white h-14 px-8 text-lg rounded-full shadow-lg shadow-primary-900/50">
                        Explore Our Store <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>
        </div>
    )
}
