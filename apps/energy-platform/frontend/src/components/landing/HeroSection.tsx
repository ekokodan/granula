'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Luxury easing curve - smooth and heavy, not bouncy
const luxuryEase = [0.22, 1, 0.36, 1] as const

// Motion variants
const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
}

// Masked headline reveal - text slides up from below
const headlineReveal = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
        y: '0%',
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: luxuryEase
        }
    }
}

// Fade up for secondary elements
const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut'
        }
    }
}

// Ken Burns effect for background
const imageScale = {
    hidden: { scale: 1.15, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 2.5,
            ease: 'circOut'
        }
    }
}

// Button hover micro-interaction
const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: 'easeInOut' }
    },
    tap: { scale: 0.98 }
}

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [imageLoaded, setImageLoaded] = useState(false)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
        >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
                className="absolute inset-0 z-0"
                variants={imageScale}
                initial="hidden"
                animate={imageLoaded ? 'visible' : 'hidden'}
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
                <Image
                    src="/images/hero_bg_clean.png"
                    alt="Premium energy storage system"
                    fill
                    className="object-cover will-change-transform"
                    priority
                    quality={90}
                    sizes="100vw"
                    onLoad={() => setImageLoaded(true)}
                />
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center"
                variants={staggerContainer}
                initial="hidden"
                animate={imageLoaded ? 'visible' : 'hidden'}
                style={{ opacity: contentOpacity }}
            >
                {/* Badge */}
                <motion.div variants={fadeInUp}>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">Premium Lithium Storage Solutions</span>
                    </div>
                </motion.div>

                {/* Main Headline - Masked Reveal */}
                <div className="mb-6">
                    {/* Line 1 */}
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] will-change-transform"
                            variants={headlineReveal}
                        >
                            True Energy Independence
                        </motion.h1>
                    </div>
                    {/* Line 2 */}
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] will-change-transform"
                            variants={headlineReveal}
                        >
                            <span className="text-emerald-400">Starts Here</span>
                        </motion.h1>
                    </div>
                </div>

                {/* Subheadline */}
                <motion.p
                    className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed"
                    variants={fadeInUp}
                >
                    Power your home or business with Grade-A lithium battery systems.
                    <br className="hidden md:block" />
                    Reliable, efficient, and designed for Nigeria&apos;s unique energy needs.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    variants={fadeInUp}
                >
                    <Link href="/builder">
                        <motion.div
                            variants={buttonHover}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg font-medium bg-white text-slate-900 hover:bg-white shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                Build Your System
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </Link>
                    <Link href="/store">
                        <motion.div
                            variants={buttonHover}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-colors backdrop-blur-sm bg-white/5"
                            >
                                Shop Bundles
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    variants={fadeInUp}
                >
                    {[
                        { number: '98.5%', label: 'Efficiency' },
                        { number: '10+', label: 'Year Lifespan' },
                        { number: '50%', label: 'Cost Savings' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="text-center"
                            variants={fadeInUp}
                        >
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                            <div className="text-base text-white/70">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                    <ChevronDown className="h-6 w-6 text-white/50" />
                </motion.div>
            </motion.div>
        </section>
    )
}
