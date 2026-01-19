'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

// Luxury easing curve
const luxuryEase = [0.22, 1, 0.36, 1] as const

const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
}

const headlineReveal = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
        y: '0%',
        opacity: 1,
        transition: { duration: 1.2, ease: luxuryEase }
    }
}

const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
}

const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3, ease: 'easeInOut' } },
    tap: { scale: 0.98 }
}

export default function HeroContent() {
    return (
        <section className="min-h-screen flex items-center justify-center py-32">
            <motion.div
                className="max-w-7xl mx-auto px-6 lg:px-8 text-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
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
                    <div className="overflow-hidden">
                        <motion.h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] will-change-transform"
                            variants={headlineReveal}
                        >
                            True Energy Independence
                        </motion.h1>
                    </div>
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
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    variants={fadeInUp}
                >
                    <Link href="/builder">
                        <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                            <Button size="lg" className="h-14 px-8 text-lg font-medium bg-white text-slate-900 hover:bg-white shadow-xl">
                                Build Your System
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </Link>
                    <Link href="/store">
                        <motion.div variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5">
                                Shop Bundles
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}
