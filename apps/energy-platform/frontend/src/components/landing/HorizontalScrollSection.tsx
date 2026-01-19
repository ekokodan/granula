'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Battery, Zap, Shield, Leaf } from 'lucide-react'

const features = [
    {
        icon: Battery,
        title: 'Grade-A Lithium Cells',
        subtitle: 'Premium Quality',
        description: 'Our batteries use only Grade-A lithium iron phosphate (LiFePO4) cells, ensuring maximum energy density and longevity.',
        stat: '98.5%',
        statLabel: 'Round-trip Efficiency',
        color: 'from-emerald-500 to-teal-600'
    },
    {
        icon: Shield,
        title: '10+ Year Lifespan',
        subtitle: 'Built to Last',
        description: 'Engineered for Nigerian conditions with advanced thermal management and 6000+ charge cycles guaranteed.',
        stat: '6000+',
        statLabel: 'Charge Cycles',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        icon: Leaf,
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
            className="relative bg-slate-900"
            style={{ height: '300vh' }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Progress line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: lineWidth }}
                    />
                </div>

                {/* Section title */}
                <div className="absolute top-8 left-8 z-20">
                    <span className="text-sm font-medium text-emerald-400 tracking-wider uppercase">
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
                                {/* Left: Icon and visual */}
                                <div className="relative">
                                    <div className={`w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto`}>
                                        <feature.icon className="w-24 h-24 md:w-32 md:h-32 text-white" strokeWidth={1} />
                                    </div>
                                    {/* Floating stat */}
                                    <div className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 bg-white rounded-2xl px-6 py-4 shadow-2xl">
                                        <div className="text-3xl md:text-4xl font-bold text-slate-900">{feature.stat}</div>
                                        <div className="text-sm text-slate-600">{feature.statLabel}</div>
                                    </div>
                                </div>

                                {/* Right: Content */}
                                <div className="text-center md:text-left">
                                    <span className="text-emerald-400 font-medium tracking-wider uppercase text-sm">
                                        {feature.subtitle}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-6">
                                        {feature.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50">
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
