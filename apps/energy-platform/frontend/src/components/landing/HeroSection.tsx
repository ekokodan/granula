'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight, ChevronDown } from 'lucide-react'
import { ScrollReveal, TextReveal } from '@/components/ScrollAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image with Parallax */}
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: backgroundY, opacity }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
                <Image
                    src="/images/hero_bg_clean.png"
                    alt="Premium energy storage system"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                />
            </motion.div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
                {/* Badge */}
                <ScrollReveal delay={0}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                        <Zap className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium text-white">Premium Lithium Storage Solutions</span>
                    </div>
                </ScrollReveal>

                {/* Main Headline */}
                <ScrollReveal delay={0.1}>
                    <TextReveal
                        text="True Energy Independence Starts Here"
                        className="text-display md:text-[72px] font-bold text-white mb-6"
                    />
                </ScrollReveal>

                {/* Subheadline */}
                <ScrollReveal delay={0.2}>
                    <p className="text-body-lg md:text-[24px] text-white/90 max-w-3xl mx-auto mb-12">
                        Power your home or business with Grade-A lithium battery systems.
                        <br className="hidden md:block" />
                        Reliable, efficient, and designed for Nigeria's unique energy needs.
                    </p>
                </ScrollReveal>

                {/* CTA Buttons */}
                <ScrollReveal delay={0.3}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/builder">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-body-lg font-medium bg-white text-primary-700 hover:bg-gray-warm-50 shadow-xl hover:shadow-2xl transition-all duration-normal hover:scale-105 active:scale-95"
                            >
                                Build Your System
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/store">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-body-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-normal backdrop-blur-sm bg-white/5"
                            >
                                Shop Bundles
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Stats */}
                <ScrollReveal delay={0.4}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { number: '98.5%', label: 'Efficiency' },
                            { number: '10+', label: 'Year Lifespan' },
                            { number: '50%', label: 'Cost Savings' }
                        ].map((stat, index) => (
                            <ScrollReveal key={index} delay={0.5 + index * 0.1} direction="fade">
                                <div className="text-center">
                                    <div className="text-h2 font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-body text-white/80">{stat.label}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-6 w-6 text-white/60" />
                </div>
            </div>
        </section>
    )
}
