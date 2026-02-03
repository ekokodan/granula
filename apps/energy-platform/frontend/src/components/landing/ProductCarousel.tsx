'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, animate } from 'framer-motion'
import { products } from '@/data/mockProducts'
import { ArrowRight, Star } from 'lucide-react'
import { ScrollReveal } from '@/components/ScrollAnimations'

export default function ProductCarousel() {
    const [width, setWidth] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
        }
    }, [])

    return (
        <section className="py-section bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
                <ScrollReveal>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-h2 font-bold text-gray-cool-900 mb-4">
                                Featured Products
                            </h2>
                            <p className="text-body-lg text-gray-cool-600 max-w-xl">
                                Top-rated energy solutions selected for performance and reliability.
                            </p>
                        </div>
                        <div className="hidden md:flex gap-2">
                             <div className="text-sm text-gray-400">
                                Drag to explore
                             </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            <div className="pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
                <motion.div 
                    ref={carouselRef} 
                    className="cursor-grab active:cursor-grabbing overflow-hidden"
                >
                    <motion.div 
                        drag="x" 
                        dragConstraints={{ right: 0, left: -width }} 
                        className="flex gap-8 pb-12"
                        style={{ x }}
                    >
                        {products.map((product) => (
                            <motion.div 
                                key={product.id} 
                                className="min-w-[300px] md:min-w-[350px] relative group"
                            >
                                <Link href={`/store?category=${product.category}`}>
                                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                        {/* Image */}
                                        <div className="relative h-64 bg-gray-warm-50 p-6 flex items-center justify-center overflow-hidden">
                                            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                                {product.category}
                                            </div>
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                ))}
                                                <span className="text-xs text-gray-400 ml-1">(4.9)</span>
                                            </div>
                                            
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                                                {product.title}
                                            </h3>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div className="text-primary-700 font-bold">
                                                    ₦{product.price.toLocaleString()}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
