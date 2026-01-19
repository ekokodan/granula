'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const solutions = [
    {
        image: '/images/product_residential_real.png',
        label: 'Residential Solutions',
        title: 'Power Your Home',
        description: 'Seamless integration with your existing electrical system. Never worry about power outages again.'
    },
    {
        image: '/images/product_commercial_real.png',
        label: 'Commercial Solutions',
        title: 'Scale Your Business',
        description: 'Reliable power for offices, shops, and small businesses. Keep operations running 24/7.'
    },
    {
        image: '/images/product_industrial_real.png',
        label: 'Industrial Solutions',
        title: 'Heavy-Duty Power',
        description: 'Industrial-grade systems for factories and large facilities. Maximum capacity, maximum reliability.'
    }
]

export default function SolutionsShowcase() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    // Fade crossfade transitions - each solution fades in and out
    const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.4], [1, 1, 0])
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0])
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.75, 1], [0, 1, 1])

    // Dramatic card scale - zoom in on enter, zoom out on exit
    const scale1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.4], [1.15, 1, 1, 0.85])
    const scale2 = useTransform(scrollYProgress, [0.25, 0.35, 0.5, 0.6, 0.75], [1.2, 1.1, 1, 1, 0.85])
    const scale3 = useTransform(scrollYProgress, [0.6, 0.7, 0.85, 1], [1.2, 1.1, 1, 1])

    // Ken Burns effect - image zooms within the card
    const imageScale1 = useTransform(scrollYProgress, [0, 0.33], [1.15, 1])
    const imageScale2 = useTransform(scrollYProgress, [0.25, 0.6], [1.15, 1])
    const imageScale3 = useTransform(scrollYProgress, [0.6, 1], [1.15, 1])

    const opacities = [opacity1, opacity2, opacity3]
    const scales = [scale1, scale2, scale3]
    const imageScales = [imageScale1, imageScale2, imageScale3]

    // Progress indicator
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

    return (
        <section
            ref={containerRef}
            className="relative bg-slate-900"
            style={{ height: '300vh' }}
        >
            {/* Sticky viewport */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        style={{ width: progressWidth }}
                    />
                </div>

                {/* Section label */}
                <div className="absolute top-8 left-8 z-20">
                    <span className="text-sm font-medium text-emerald-400 tracking-wider uppercase">
                        Our Solutions
                    </span>
                </div>

                {/* Stacked solution cards */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {solutions.map((solution, index) => (
                        <motion.div
                            key={index}
                            className="absolute inset-0 flex items-center justify-center will-change-transform"
                            style={{
                                opacity: opacities[index],
                                scale: scales[index]
                            }}
                        >
                            <div className="relative w-[90vw] h-[70vh] md:w-[80vw] md:h-[75vh] rounded-2xl overflow-hidden">
                                {/* Background image with Ken Burns zoom */}
                                <motion.div
                                    className="absolute inset-0 will-change-transform"
                                    style={{ scale: imageScales[index] }}
                                >
                                    <Image
                                        src={solution.image}
                                        alt={solution.title}
                                        fill
                                        className="object-cover"
                                        sizes="90vw"
                                        priority={index === 0}
                                    />
                                </motion.div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12">
                                    <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                                        {solution.label}
                                    </span>
                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mt-2">
                                        {solution.title}
                                    </h3>
                                    <p className="text-white/70 mt-4 max-w-xl text-lg md:text-xl">
                                        {solution.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    {solutions.map((_, index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 rounded-full bg-white/30"
                            style={{
                                opacity: useTransform(
                                    scrollYProgress,
                                    index === 0 ? [0, 0.33] :
                                    index === 1 ? [0.33, 0.66] :
                                    [0.66, 1],
                                    [1, 0.3]
                                ),
                                scale: useTransform(
                                    scrollYProgress,
                                    index === 0 ? [0, 0.33] :
                                    index === 1 ? [0.33, 0.66] :
                                    [0.66, 1],
                                    [1.5, 1]
                                )
                            }}
                        />
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 right-8 flex items-center gap-2 text-white/50 z-20">
                    <span className="text-sm">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        ↓
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
