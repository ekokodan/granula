'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { ArrowRight, Home, Building2, Factory } from 'lucide-react'

export default function ExploreSolutions() {
    return (
        <section className="py-section-lg bg-gray-warm-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-h2 font-bold text-gray-cool-900 mb-4">
                            Explore Our Solutions
                        </h2>
                        <p className="text-body-lg text-gray-cool-600 max-w-2xl mx-auto">
                            Find the perfect energy system for your specific needs.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Residential',
                            icon: Home,
                            description: 'Power your home with silent, reliable lithium energy.',
                            link: '/store?category=residential',
                            image: '/images/product_residential_real.png'
                        },
                        {
                            title: 'Commercial',
                            icon: Building2,
                            description: 'Keep your business running with 3-phase power backup.',
                            link: '/store?category=commercial',
                            image: '/images/product_commercial_real.png'
                        },
                        {
                            title: 'Industrial',
                            icon: Factory,
                            description: 'Scalable mini-grids for estates and large facilities.',
                            link: '/store?category=minigrid', // Will trigger consultation flow
                            image: '/images/product_industrial_real.png'
                        }
                    ].map((item, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <Link href={item.link} className="group block h-full">
                                <div className="bg-white rounded-2xl overflow-hidden border border-gray-cool-100 hover:border-primary-200 hover:shadow-xl transition-all duration-normal h-full flex flex-col">
                                    <div className="relative h-48 bg-gray-warm-50 p-6 flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-normal" />
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-normal">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-h4 font-bold text-gray-cool-900 group-hover:text-primary-700 transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <p className="text-body text-gray-cool-600 mb-6 flex-grow">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform duration-normal">
                                            View Solutions <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
