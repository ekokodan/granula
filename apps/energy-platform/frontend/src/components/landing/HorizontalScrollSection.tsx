'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const features = [
    {
        image: '/images/products/vange/vange-10kwh.png',
        title: 'Grade-A Lithium Cells',
        subtitle: 'Premium Quality',
        description: 'Our batteries use only Grade-A lithium iron phosphate (LiFePO4) cells, ensuring maximum energy density and longevity.',
        stat: '98.5%',
        statLabel: 'Round-trip Efficiency',
        color: 'from-emerald-500 to-teal-600'
    },
    {
        image: '/images/products/vange/vange-11kva.png',
        title: '10+ Year Lifespan',
        subtitle: 'Built to Last',
        description: 'Engineered for Nigerian conditions with advanced thermal management and 6000+ charge cycles guaranteed.',
        stat: '6000+',
        statLabel: 'Charge Cycles',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        title: 'Clean Energy Future',
        subtitle: 'Sustainable Power',
        description: 'Reduce your carbon footprint while saving up to 50% on energy costs. Solar-ready and grid-independent.',
        stat: '50%',
        statLabel: 'Cost Savings',
        color: 'from-green-500 to-emerald-600'
    }
]

export default function HorizontalScrollSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    // Map vertical scroll to horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%'])

    // Progress line animation
    const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

    return (
        <section
            ref={containerRef}
            className="relative bg-gray-50"
            style={{ height: '300vh' }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Progress line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: lineWidth }}
                    />
                </div>

                {/* Section title */}
                <div className="absolute top-8 left-8 z-20">
                    <span className="text-sm font-medium text-emerald-600 tracking-wider uppercase">
                        Why Choose Us
                    </span>
                </div>

                {/* Horizontal track */}
                <motion.div
                    className="flex h-full will-change-transform"
                    style={{ x, width: '300vw' }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="w-screen h-full flex items-center justify-center px-8 md:px-16 lg:px-24"
                        >
                            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                                {/* Left: Product Image */}
                                <div className="relative">
                                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                                        {/* Gradient background */}
                                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-10`} />
                                        {/* Product image */}
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 256px, 320px"
                                        />
                                    </div>
                                    {/* Floating stat */}
                                    <div className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 bg-white rounded-2xl px-6 py-4 shadow-xl border border-gray-100">
                                        <div className="text-3xl md:text-4xl font-bold text-slate-900">{feature.stat}</div>
                                        <div className="text-sm text-slate-600">{feature.statLabel}</div>
                                    </div>
                                </div>

                                {/* Right: Content */}
                                <div className="text-center md:text-left">
                                    <span className="text-emerald-600 font-medium tracking-wider uppercase text-sm">
                                        {feature.subtitle}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mt-2 mb-6">
                                        {feature.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500">
                    <span className="text-sm">Scroll to explore</span>
                    <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        →
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
