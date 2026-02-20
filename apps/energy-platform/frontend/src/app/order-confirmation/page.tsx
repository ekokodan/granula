'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Mail, Phone, Package, Calendar, ArrowRight } from 'lucide-react'

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order') || `GC${Date.now()}`
    const total = searchParams.get('total') || '0'

    const nextSteps = [
        {
            icon: Mail,
            title: 'Confirmation Email Sent',
            description: 'Check your inbox for order details and receipt. Please also check your spam folder.'
        },
        {
            icon: Phone,
            title: 'Installation Scheduling',
            description: 'Our team will contact you within 24 hours to schedule your professional installation.'
        },
        {
            icon: Package,
            title: 'Delivery & Installation',
            description: 'Your equipment will be delivered and installed within 5-7 business days of scheduling.'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-6">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-cool-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-gray-cool-600">
                        Thank you for choosing GridCo Energy
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-cool-100">
                        <div>
                            <p className="text-sm text-gray-cool-500 mb-1">Order Number</p>
                            <p className="text-2xl font-bold text-gray-cool-900 font-mono">{orderNumber}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:text-right">
                            <p className="text-sm text-gray-cool-500 mb-1">Order Total</p>
                            <p className="text-2xl font-bold text-emerald-600">₦{Number(total).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-gray-cool-500 mb-1">Order Date</p>
                            <p className="font-medium text-gray-cool-900">
                                {new Date().toLocaleDateString('en-NG', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-cool-500 mb-1">Payment Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium text-xs border border-green-200">
                                Confirmed
                            </span>
                        </div>
                    </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-cool-900 mb-6 flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                        What Happens Next
                    </h2>
                    
                    <div className="space-y-6">
                        {nextSteps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                        <step.icon className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-cool-900">{step.title}</h3>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            Step {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-gray-cool-600 text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Info */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-cool-900 mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-cool-600 mb-4">
                        Our customer support team is here to assist you with any questions about your order.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-cool-700">
                            <Phone className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">+234 800 GRIDCO</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-cool-700">
                            <Mail className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">support@gridco.ng</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/store" className="flex-1">
                        <Button variant="outline" className="w-full border-gray-cool-300 hover:bg-gray-50">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                            Back to Home
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-warm-50">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    )
}
