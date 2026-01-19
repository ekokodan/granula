'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function StickyHero() {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start']
    })

    // Subtle zoom out as user scrolls
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

    return (
        <div
            ref={ref}
            className="fixed inset-0 z-[1] overflow-hidden"
        >
            <motion.div
                className="absolute inset-0 will-change-transform"
                style={{ scale, opacity }}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />

                {/* Background image */}
                <Image
                    src="/images/hero_bg_clean.png"
                    alt="Energy storage systems"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                />
            </motion.div>
        </div>
    )
}
