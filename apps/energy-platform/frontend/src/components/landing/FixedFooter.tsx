'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

export default function FixedFooter() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[-1] bg-slate-950">
            <div className="h-screen flex flex-col items-center justify-center px-6">
                {/* Giant logo/brand */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <Image
                            src="/images/logo_black.png"
                            alt="GridCo"
                            width={200}
                            height={200}
                            className="w-24 h-24 md:w-36 md:h-36 object-contain brightness-0 invert"
                        />
                    </div>
                    <h2 className="text-6xl md:text-8xl lg:text-[12rem] font-bold text-white/10 tracking-tighter">
                        GRIDCO
                    </h2>
                </div>

                {/* Footer links */}
                <div className="max-w-5xl mx-auto w-full">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Products</h4>
                            <ul className="space-y-2">
                                <li><Link href="/store" className="text-white/50 hover:text-white transition-colors">Batteries</Link></li>
                                <li><Link href="/store" className="text-white/50 hover:text-white transition-colors">Inverters</Link></li>
                                <li><Link href="/store" className="text-white/50 hover:text-white transition-colors">Solar Panels</Link></li>
                                <li><Link href="/store" className="text-white/50 hover:text-white transition-colors">Bundles</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Solutions</h4>
                            <ul className="space-y-2">
                                <li><Link href="/builder" className="text-white/50 hover:text-white transition-colors">Residential</Link></li>
                                <li><Link href="/builder" className="text-white/50 hover:text-white transition-colors">Commercial</Link></li>
                                <li><Link href="/builder" className="text-white/50 hover:text-white transition-colors">Industrial</Link></li>
                                <li><Link href="/builder" className="text-white/50 hover:text-white transition-colors">Custom</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Services</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/services/end-of-life" className="text-white/50 hover:text-white transition-colors inline-flex items-center gap-2">
                                        Battery Trade-In
                                        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0">
                                            Coming Soon
                                        </Badge>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-white/50 hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/about" className="text-white/50 hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="/about" className="text-white/50 hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="/about" className="text-white/50 hover:text-white transition-colors">Press</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><Link href="/help" className="text-white/50 hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="/services/installation" className="text-white/50 hover:text-white transition-colors">Installation</Link></li>
                                <li><Link href="/warranty" className="text-white/50 hover:text-white transition-colors">Warranty</Link></li>
                                <li><Link href="/warranty#returns" className="text-white/50 hover:text-white transition-colors">Returns</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/40 text-sm">
                            © 2026 GridCo Energy. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-white/40 hover:text-white text-sm transition-colors">Terms</Link>
                            <Link href="/privacy#cookies" className="text-white/40 hover:text-white text-sm transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
