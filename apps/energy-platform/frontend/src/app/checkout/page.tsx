'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import { Loader2, CreditCard, Truck, ShieldCheck, ArrowRight, Receipt } from 'lucide-react'

const ADD_ON_LABELS: Record<string, string> = {
    insurance: 'Insurance (₦50,000/year)',
    maintenance: 'Maintenance (₦75,000/year)',
    installation: 'Installation'
}

function CheckoutContent() {
    const router = useRouter()
    const { items, getCartTotal } = useCart()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState(1) // 1: Shipping, 2: Payment

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart')
        }
    }, [items, router])

    const subtotal = getCartTotal()
    const tax = subtotal * 0.075
    const total = subtotal + tax

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        
        // Generate order number and redirect
        const orderNumber = `GC${Date.now()}`
        router.push(`/order-confirmation?order=${orderNumber}&total=${total}`)
    }

    if (items.length === 0) {
        return null // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <div className="mb-12">
                    <h1 className="text-h2 font-bold text-gray-cool-900">Checkout</h1>
                    <p className="text-gray-cool-600">Complete your purchase securely.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Forms */}
                    <div className="flex-grow space-y-8">

                        {/* Shipping Information */}
                        <div className={`bg-white p-8 rounded-2xl border ${step === 1 ? 'border-primary-500 ring-1 ring-primary-500/20 shadow-lg' : 'border-gray-cool-200 opacity-60'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    1
                                </div>
                                <h2 className="text-h4 font-bold text-gray-cool-900">Shipping Information</h2>
                            </div>

                            {step === 1 && (
                                <form id="shipping-form" onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" required placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" required placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" required placeholder="123 Solar Street" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" required placeholder="Lagos" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input id="state" required placeholder="Lagos" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" required placeholder="+234..." />
                                    </div>

                                    <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12">
                                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Payment Information */}
                        <div className={`bg-white p-8 rounded-2xl border ${step === 2 ? 'border-primary-500 ring-1 ring-primary-500/20 shadow-lg' : 'border-gray-cool-200 opacity-60'}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    2
                                </div>
                                <h2 className="text-h4 font-bold text-gray-cool-900">Payment Method</h2>
                            </div>

                            {step === 2 && (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="p-4 border border-primary-200 bg-primary-50 rounded-xl flex items-center gap-4 cursor-pointer">
                                        <div className="h-5 w-5 rounded-full border-2 border-primary-600 flex items-center justify-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="font-bold text-gray-cool-900">Paystack / Card Payment</div>
                                            <div className="text-sm text-gray-cool-500">Secure payment via Paystack</div>
                                        </div>
                                        <CreditCard className="h-6 w-6 text-primary-600" />
                                    </div>

                                    <div className="p-4 border border-gray-cool-200 rounded-xl flex items-center gap-4 cursor-pointer hover:border-gray-cool-300">
                                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                        <div className="flex-grow">
                                            <div className="font-bold text-gray-cool-900">Bank Transfer</div>
                                            <div className="text-sm text-gray-cool-500">Direct transfer to our corporate account</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-cool-500 bg-gray-50 p-3 rounded-lg">
                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                        Your payment information is encrypted and secure.
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white h-12" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                `Pay ₦${total.toLocaleString()}`
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl border border-gray-cool-200 shadow-sm sticky top-24">
                            <h3 className="text-h5 font-bold text-gray-cool-900 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {items.map((item, index) => (
                                    <div key={`${item.product.id}-${index}`} className="flex gap-4">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0">
                                            <Image 
                                                src={item.product.image} 
                                                alt={item.product.title} 
                                                fill
                                                className="object-contain p-2" 
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="font-medium text-gray-cool-900 text-sm line-clamp-2">{item.product.title}</div>
                                            <div className="text-sm text-gray-cool-500">Qty: {item.quantity}</div>
                                            {item.selectedAddOns.length > 0 && (
                                                <div className="text-xs text-emerald-600 mt-1">
                                                    + {item.selectedAddOns.map(a => ADD_ON_LABELS[a] || a).join(', ')}
                                                </div>
                                            )}
                                            <div className="font-bold text-primary-700">₦{(item.product.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-cool-100 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Tax (7.5%)</span>
                                    <span>₦{tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-cool-200 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-cool-900">Total</span>
                                    <span className="text-2xl font-bold text-primary-700">₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Financing Option */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Receipt className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-900 mb-1">Apply for Financing</p>
                                        <p className="text-xs text-blue-700 mb-2">Financing partnerships coming soon. Pay for your solar system in flexible installments.</p>
                                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100" disabled>
                                            Coming Soon
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary-50 p-3 rounded-lg flex gap-3 items-start">
                                <Truck className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-primary-800">
                                    <span className="font-bold">Free Installation</span> included with this bundle. Our team will contact you to schedule.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-warm-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
