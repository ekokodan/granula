'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const solutions = [
    {
        image: '/images/products/vange/vange-6kva.png',
        label: 'Residential Solutions',
        title: 'Power Your Home',
        description: 'Seamless integration with your existing electrical system. Never worry about power outages again.',
        stats: [
            { value: '5-15kVA', label: 'System Range' },
            { value: '24/7', label: 'Power Supply' },
            { value: '10yr', label: 'Warranty' },
        ],
        color: 'from-emerald-50 to-teal-50',
        accentColor: 'text-emerald-600',
        link: '/store?category=residential',
    },
    {
        image: '/images/products/vange/vange-11kva.png',
        label: 'Commercial Solutions',
        title: 'Scale Your Business',
        description: 'Reliable power for offices, shops, and small businesses. Keep operations running 24/7.',
        stats: [
            { value: '10-25kVA', label: 'System Range' },
            { value: '99.9%', label: 'Uptime' },
            { value: '₦0', label: 'Fuel Cost' },
        ],
        color: 'from-slate-50 to-gray-100',
        accentColor: 'text-slate-700',
        link: '/store?category=commercial',
    },
    {
        image: '/images/products/vange/vange-30-50kva-3phase.png',
        label: 'Industrial Solutions',
        title: 'Heavy-Duty Power',
        description: 'Industrial-grade systems for factories and large facilities. Maximum capacity, maximum reliability.',
        stats: [
            { value: '30-100kVA', label: 'System Range' },
            { value: '3-Phase', label: 'Power Output' },
            { value: 'Custom', label: 'Design' },
        ],
        color: 'from-gray-900 to-slate-800',
        accentColor: 'text-emerald-400',
        link: '/store?category=industrial',
    },
]

export default function SolutionsShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // Each card occupies a third of scroll progress
    const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.33], [1, 1, 0])
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.33, 0.53, 0.66], [0, 1, 1, 0])
    const opacity3 = useTransform(scrollYProgress, [0.53, 0.66, 1], [0, 1, 1])

    const y1 = useTransform(scrollYProgress, [0, 0.33], [0, -60])
    const y2 = useTransform(scrollYProgress, [0.2, 0.33, 0.53, 0.66], [60, 0, 0, -60])
    const y3 = useTransform(scrollYProgress, [0.53, 0.66, 1], [60, 0, 0])

    const opacities = [opacity1, opacity2, opacity3]
    const yValues = [y1, y2, y3]

    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

    // Active dot index
    const activeDot = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 2])

    return (
        <section
            ref={containerRef}
            className="relative bg-white"
            style={{ height: '300vh' }}
        >
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 z-20">
                    <motion.div
                        className="h-full bg-emerald-500"
                        style={{ width: progressWidth }}
                    />
                </div>

                {/* Section label */}
                <div className="absolute top-6 left-8 z-20">
                    <span className="text-xs font-semibold text-emerald-600 tracking-[0.2em] uppercase">
                        Our Solutions
                    </span>
                </div>

                {/* Solution cards */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {solutions.map((solution, index) => {
                        const isDark = index === 2
                        return (
                            <motion.div
                                key={index}
                                className="absolute inset-0 flex items-center justify-center px-6 md:px-12 will-change-transform"
                                style={{
                                    opacity: opacities[index],
                                    y: yValues[index],
                                }}
                            >
                                <div
                                    className={`relative w-full max-w-6xl h-[75vh] rounded-3xl overflow-hidden bg-gradient-to-br ${solution.color} shadow-sm`}
                                >
                                    {/* Content grid: text left, product right */}
                                    <div className="relative z-10 h-full flex flex-col md:flex-row items-center">
                                        {/* Text side */}
                                        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                            <span className={`text-xs font-semibold tracking-[0.15em] uppercase mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {solution.label}
                                            </span>
                                            <h3 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {solution.title}
                                            </h3>
                                            <p className={`text-base md:text-lg mb-8 max-w-md leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {solution.description}
                                            </p>

                                            {/* Stats row */}
                                            <div className="flex gap-6 md:gap-10 mb-8">
                                                {solution.stats.map((stat, si) => (
                                                    <div key={si}>
                                                        <div className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {stat.value}
                                                        </div>
                                                        <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                            {stat.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Link
                                                href={solution.link}
                                                className={`inline-flex items-center gap-2 text-sm font-semibold group/link ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'} transition-colors`}
                                            >
                                                Explore Solutions
                                                <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>

                                        {/* Product image side */}
                                        <div className="flex-1 relative h-full hidden md:flex items-center justify-center">
                                            {/* Glow behind product */}
                                            <div className={`absolute w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-200/40'}`} />
                                            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                                                <Image
                                                    src={solution.image}
                                                    alt={solution.title}
                                                    fill
                                                    className="object-contain drop-shadow-2xl"
                                                    sizes="(max-width: 768px) 50vw, 320px"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    {solutions.map((_, index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 rounded-full transition-colors"
                            style={{
                                backgroundColor: useTransform(
                                    activeDot,
                                    (v: number) => Math.round(v) === index ? '#10b981' : '#d1d5db'
                                ),
                                scale: useTransform(
                                    activeDot,
                                    (v: number) => Math.round(v) === index ? 1.5 : 1
                                ),
                            }}
                        />
                    ))}
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-8 right-8 flex items-center gap-2 text-slate-400 z-20">
                    <span className="text-xs tracking-wider uppercase">Scroll to explore</span>
                    <motion.span
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-sm"
                    >
                        ↓
                    </motion.span>
                </div>
            </div>
        </section>
    )
}
