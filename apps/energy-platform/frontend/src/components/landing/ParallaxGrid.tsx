'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const gridItems = [
    {
        image: '/images/product_commercial_real.png',
        title: 'Commercial',
        description: 'Scale your business power'
    },
    {
        image: '/images/product_industrial_real.png',
        title: 'Industrial',
        description: 'Heavy-duty solutions'
    },
    {
        image: '/images/product_residential_bundle.png',
        title: 'Bundles',
        description: 'Complete power packages'
    },
    {
        image: '/images/product_commercial_bundle.png',
        title: 'Enterprise',
        description: 'Custom installations'
    },
    {
        image: '/images/product_commercial_3d.png',
        title: 'Smart Systems',
        description: 'IoT-enabled monitoring'
    },
    {
        image: '/images/product_residential_3d.png',
        title: 'Home Ready',
        description: 'Plug and play setup'
    }
]

export default function ParallaxGrid() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    // Different parallax speeds for each column
    const yCol1 = useTransform(scrollYProgress, [0, 1], [100, -150])
    const yCol2 = useTransform(scrollYProgress, [0, 1], [50, -100])
    const yCol3 = useTransform(scrollYProgress, [0, 1], [150, -200])

    const columns = [
        { items: [gridItems[0], gridItems[3]], y: yCol1 },
        { items: [gridItems[1], gridItems[4]], y: yCol2 },
        { items: [gridItems[2], gridItems[5]], y: yCol3 }
    ]

    return (
        <section
            ref={containerRef}
            className="relative bg-white py-32 overflow-hidden"
        >
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <span className="text-emerald-600 font-medium tracking-wider uppercase text-sm">
                        Our Products
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mt-4">
                        Solutions for Every Scale
                    </h2>
                    <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
                        From residential to industrial, we have the perfect power solution for your needs.
                    </p>
                </motion.div>
            </div>

            {/* Parallax grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column, colIndex) => (
                        <motion.div
                            key={colIndex}
                            className="flex flex-col gap-6 will-change-transform"
                            style={{ y: column.y }}
                        >
                            {column.items.map((item, itemIndex) => (
                                <motion.div
                                    key={itemIndex}
                                    className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="aspect-[4/5] relative">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        {/* Light overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
