'use client'

import Navbar from '@/components/layout/Navbar'
import StickyHero from '@/components/landing/StickyHero'
import CurvedTopEdge from '@/components/landing/CurvedTopEdge'
import HeroContent from '@/components/landing/HeroContent'
import HorizontalScrollSection from '@/components/landing/HorizontalScrollSection'
import SolutionsShowcase from '@/components/landing/SolutionsShowcase'
import ParallaxGrid from '@/components/landing/ParallaxGrid'
import FixedFooter from '@/components/landing/FixedFooter'

export default function HomePage() {
    return (
        <div className="relative">
            {/* Fixed background hero */}
            <StickyHero />

            {/* Fixed footer (behind content) */}
            <FixedFooter />

            {/* Navbar */}
            <Navbar />

            {/* Main scrolling content overlay */}
            <main className="relative z-10">
                {/* Hero content section - transparent to show StickyHero */}
                <HeroContent />

                {/* Content sections with curved top edge */}
                <div className="relative bg-gray-50">
                    {/* Curved transition from hero */}
                    <CurvedTopEdge fillColor="#f9fafb" />

                    {/* Horizontal scroll feature section */}
                    <HorizontalScrollSection />

                    {/* Solutions showcase - Residential, Commercial, Industrial */}
                    <SolutionsShowcase />

                    {/* Parallax product grid */}
                    <ParallaxGrid />

                    {/* CTA Section */}
                    <section className="bg-white py-32">
                        <div className="max-w-4xl mx-auto text-center px-6">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                                Ready to Power Up?
                            </h2>
                            <p className="text-xl text-slate-600 mb-8">
                                Join thousands of Nigerians who have made the switch to reliable, clean energy.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href="/builder"
                                    className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Build Your System
                                </a>
                                <a
                                    href="/store"
                                    className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium border-2 border-slate-200 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Browse Products
                                </a>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Spacer to reveal fixed footer - OUTSIDE bg-slate-900 container */}
                <div className="h-screen" />
            </main>
        </div>
    )
}
