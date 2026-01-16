'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Battery, Zap, ArrowRight, Calculator, ChevronDown } from 'lucide-react'
import { ScrollReveal, TextReveal } from '@/components/ScrollAnimations'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        {/* Hero Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Premium solar panels and inverter installation"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <ScrollReveal delay={0}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <Zap className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">New: Next-Gen Hybrid Inverter Technology</span>
          </div>
        </ScrollReveal>

        {/* Main Headline */}
        <ScrollReveal delay={0.1}>
          <TextReveal
            text="Transform Sunlight Into Savings with Premium Solar Inverters"
            className="text-display md:text-[72px] font-bold text-white mb-6"
          />
        </ScrollReveal>

        {/* Subheadline */}
        <ScrollReveal delay={0.2}>
          <p className="text-body-lg md:text-[24px] text-white/90 max-w-3xl mx-auto mb-12">
            Industry-leading solar inverters engineered for maximum efficiency and reliability.
            <br className="hidden md:block" />
            Achieve up to <span className="font-semibold text-white">98.5% conversion efficiency</span> with our advanced power management systems.
          </p>
        </ScrollReveal>

        {/* CTA Buttons */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 text-body-lg font-medium bg-white text-primary-700 hover:bg-gray-warm-50 shadow-xl hover:shadow-2xl transition-all duration-normal hover:scale-105 active:scale-95"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#calculator">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-body-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-normal backdrop-blur-sm bg-white/5"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your Savings
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: '98.5%', label: 'Peak Efficiency' },
              { number: '25+', label: 'Year Lifespan' },
              { number: '15', label: 'Year Warranty' }
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={0.5 + index * 0.1} direction="fade">
                <div className="text-center">
                  <div className="text-h2 font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-body text-white/80">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-white/60" />
        </div>
      </div>
    </section>
  )
}

