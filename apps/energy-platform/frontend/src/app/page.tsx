'use client'

import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import ExploreSolutions from '@/components/landing/ExploreSolutions'
import CredibilitySection from '@/components/landing/CredibilitySection'
import ProductCategories from '@/components/landing/ProductCategories'
import SystemBuilderCTA from '@/components/landing/SystemBuilderCTA'
import AboutSection from '@/components/landing/AboutSection'
import { ScrollProgress } from '@/components/ScrollAnimations'
import Link from 'next/link'
import Image from 'next/image'
import { Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollProgress />
      <Navbar />

      <main>
        <HeroSection />
        <ExploreSolutions />
        <CredibilitySection />
        <ProductCategories />
        <SystemBuilderCTA />
        <AboutSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-cool-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="relative h-11 w-28 mb-6">
                <Image
                  src="/images/logo_white.png"
                  alt="gridco"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-body-sm text-gray-cool-400 leading-relaxed">
                Premium energy storage solutions for Nigeria.
              </p>
            </div>

            <div>
              <h4 className="text-body font-semibold mb-4">Shop</h4>
              <ul className="space-y-3 text-body-sm text-gray-cool-400">
                <li><Link href="/store?category=residential" className="hover:text-white transition-colors">Residential Bundles</Link></li>
                <li><Link href="/store?category=commercial" className="hover:text-white transition-colors">Commercial Systems</Link></li>
                <li><Link href="/store" className="hover:text-white transition-colors">Inverters</Link></li>
                <li><Link href="/store" className="hover:text-white transition-colors">Batteries</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-body font-semibold mb-4">Services</h4>
              <ul className="space-y-3 text-body-sm text-gray-cool-400">
                <li><Link href="/builder" className="hover:text-white transition-colors">System Builder</Link></li>
                <li><Link href="/install" className="hover:text-white transition-colors">Installation</Link></li>
                <li><Link href="/finance" className="hover:text-white transition-colors">Financing</Link></li>
                <li><Link href="/insurance" className="hover:text-white transition-colors">Insurance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-body font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-body-sm text-gray-cool-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-cool-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-body-sm text-gray-cool-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GridCo. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-body-sm text-gray-cool-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-body-sm text-gray-cool-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer >
    </div >
  )
}
