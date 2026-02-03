'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion'

const categories = [
    {
        id: 'residential',
        title: 'Residential Solutions',
        description: 'Complete energy independence for your home. Power your ACs, freezers, and essential appliances without the grid.',
        image: '/images/product_residential_real.png',
        link: '/store?category=residential',
        reverse: false,
        color: 'from-blue-400/20 to-cyan-400/20'
    },
    {
        id: 'commercial',
        title: 'Commercial Power',
        description: 'Reliable three-phase systems for offices, retail, and SMEs. Reduce operational costs and ensure business continuity.',
        image: '/images/product_commercial_real.png',
        link: '/store?category=commercial',
        reverse: true,
        color: 'from-indigo-400/20 to-purple-400/20'
    },
    {
        id: 'minigrid',
        title: 'Industrial & Mini-Grid',
        description: 'Scalable megawatt-class storage for estates, factories, and communities. High-capacity, long-duration power.',
        image: '/images/product_industrial_real.png',
        link: '/contact',
        reverse: false,
        color: 'from-amber-400/20 to-orange-400/20'
    }
]

function FloatingCard({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            className={className}
            initial="initial"
            whileHover="hover"
            animate="animate"
        >
            <motion.div
                variants={{
                    initial: { y: 0, scale: 1 },
                    animate: {
                        y: [-10, 10, -10],
                        transition: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    },
                    hover: {
                        y: -20,
                        scale: 1.05,
                        transition: { duration: 0.4, ease: "easeOut" }
                    }
                }}
                className="w-full h-full relative"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}

function ParallaxText({ text, reverse = false }: { text: string, reverse?: boolean }) {
    const { scrollYProgress } = useScroll()
    const y = useTransform(scrollYProgress, [0, 1], reverse ? [-100, 100] : [100, -100])

    return (
        <motion.div
            style={{ y }}
            className={`absolute top-0 ${reverse ? '-right-24' : '-left-24'} text-[120px] lg:text-[180px] font-bold text-gray-cool-100/40 select-none pointer-events-none z-0 hidden lg:block uppercase tracking-tighter leading-none whitespace-nowrap`}
        >
            {text}
        </motion.div>
    )
}

function FloatingParticles({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-xl bg-gradient-to-br ${color}`}
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: 0.3
                    }}
                    animate={{
                        y: [null, Math.random() * -100 + "%"],
                        x: [null, (Math.random() - 0.5) * 50 + "%"],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        width: Math.random() * 100 + 50 + "px",
                        height: Math.random() * 100 + 50 + "px",
                    }}
                />
            ))}
        </div>
    )
}

export default function ProductCategories() {
    return (
        <section className="py-section-xl bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-32">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-h1 font-bold text-gray-cool-900 mb-6"
                        >
                            Solutions for Every Need
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-body-lg text-gray-cool-600 max-w-2xl mx-auto"
                        >
                            Whether you need to power a single home or an entire estate, we have the premium equipment to match.
                        </motion.p>
                    </div>
                </ScrollReveal>

                <div className="space-y-40">
                    {categories.map((category, index) => (
                        <div key={category.id} className="relative group/container">
                            <ParallaxText text={category.id} reverse={category.reverse} />

                            <div className={`flex flex-col ${category.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32 relative z-10`}>
                                {/* Image Side with 3D Tilt */}
                                <div className="w-full lg:w-1/2 relative">
                                    <FloatingCard className="relative aspect-[4/3] w-full cursor-pointer">
                                        <FloatingParticles color={category.color} />

                                        {/* Glow Effect */}
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-full blur-3xl opacity-40`}
                                            variants={{
                                                hover: { opacity: 0.6, scale: 1.1 }
                                            }}
                                            transition={{ duration: 0.4 }}
                                        />

                                        <div className="relative z-10 w-full h-full">
                                            <Image
                                                src={category.image}
                                                alt={category.title}
                                                fill
                                                className="object-contain drop-shadow-2xl"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </FloatingCard>
                                </div>

                                {/* Content Side */}
                                <div className="w-full lg:w-1/2 text-center lg:text-left">
                                    <ScrollReveal>
                                        <div className="inline-flex items-center space-x-2 mb-6">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: 32 }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                                className="h-px bg-primary-500"
                                            />
                                            <span className="text-sm font-bold text-primary-600 uppercase tracking-widest">0{index + 1}</span>
                                        </div>
                                        <h3 className="text-5xl md:text-6xl font-bold text-gray-cool-900 mb-8 tracking-tight">
                                            {category.title}
                                        </h3>
                                        <p className="text-xl text-gray-cool-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                            {category.description}
                                        </p>
                                        <Link href={category.link}>
                                            <Button variant="outline" size="lg" className="group border-gray-cool-200 hover:border-primary-500 hover:text-primary-700 h-14 px-8 text-lg rounded-full">
                                                Explore Solutions
                                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}