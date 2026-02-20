'use client'

import Navbar from '@/components/layout/Navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Recycle, RefreshCw, Leaf, Mail } from 'lucide-react'
import Link from 'next/link'

export default function EndOfLifePage() {
    return (
        <main className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-6">
                        Coming Soon
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-cool-900 mb-6">
                        Battery Replacement & Trade-In
                    </h1>
                    <p className="text-lg md:text-xl text-gray-cool-600 max-w-2xl mx-auto">
                        Our comprehensive end-of-life service for solar batteries — trade in your old batteries, 
                        get premium replacements, and ensure responsible recycling for a sustainable future.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Trade-In Program */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-cool-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                <RefreshCw className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-cool-900 mb-3">
                                Trade-In Program
                            </h3>
                            <p className="text-gray-cool-600">
                                Get value for your old batteries when you upgrade. We&apos;ll assess your existing 
                                batteries and offer competitive trade-in credit toward new GridCo energy storage.
                            </p>
                        </div>

                        {/* Battery Replacement */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-cool-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                <Recycle className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-cool-900 mb-3">
                                Battery Replacement
                            </h3>
                            <p className="text-gray-cool-600">
                                Seamless replacement service for aging or underperforming batteries. Our certified 
                                technicians handle removal, installation, and system reconfiguration.
                            </p>
                        </div>

                        {/* Responsible Recycling */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-cool-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                <Leaf className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-cool-900 mb-3">
                                Responsible Recycling
                            </h3>
                            <p className="text-gray-cool-600">
                                We ensure all retired batteries are processed through certified recycling partners. 
                                Recover valuable materials while protecting the environment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-center shadow-xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Want to be notified?
                        </h2>
                        <p className="text-emerald-100 mb-8">
                            Be the first to know when our Battery Trade-In program launches. 
                            Get early access and exclusive launch offers.
                        </p>
                        <Link href="mailto:info@gridco.ng?subject=Battery%20Trade-In%20Interest">
                            <Button 
                                size="lg" 
                                className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                Contact Us
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-8 px-6 border-t border-gray-cool-200">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-cool-500 text-sm">
                        © 2026 GridCo Energy. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    )
}
