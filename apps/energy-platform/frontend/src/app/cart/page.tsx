'use client'

import { useCart } from '@/contexts/CartContext'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

const ADD_ON_LABELS: Record<string, string> = {
    insurance: 'Insurance (₦50,000/year)',
    maintenance: 'Maintenance (₦75,000/year)',
    installation: 'Installation (TBD)'
}

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

    const subtotal = getCartTotal()
    const tax = subtotal * 0.075
    const total = subtotal + tax

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-warm-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-32 w-32 bg-gray-cool-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="h-16 w-16 text-gray-cool-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-cool-900 mb-4">Your cart is empty</h1>
                        <p className="text-gray-cool-600 mb-8 max-w-md">
                            Start building your energy independence by browsing our solar products and bundles.
                        </p>
                        <Link href="/store">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Browse Store
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-cool-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-cool-600">{getCartCount()} item{getCartCount() !== 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <div key={`${item.product.id}-${index}`} className="bg-white rounded-2xl border border-gray-cool-100 p-6 shadow-sm">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative h-32 w-32 bg-gray-warm-50 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.title}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <Link href={`/store/${item.product.id}`}>
                                                    <h3 className="text-lg font-semibold text-gray-cool-900 hover:text-emerald-600 transition-colors">
                                                        {item.product.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-cool-500">{item.product.category}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="text-gray-cool-400 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        {/* Selected Add-ons */}
                                        {item.selectedAddOns.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-cool-700 mb-1">Add-ons:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.selectedAddOns.map((addOn) => (
                                                        <span key={addOn} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">
                                                            {ADD_ON_LABELS[addOn] || addOn}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quantity and Price */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="h-8 w-8"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="font-semibold text-gray-cool-900 min-w-[2rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="h-8 w-8"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-cool-900">
                                                    ₦{(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                                {item.product.originalPrice && (
                                                    <p className="text-sm text-gray-cool-400 line-through">
                                                        ₦{(item.product.originalPrice * item.quantity).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href="/store">
                            <Button variant="outline" className="w-full">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-cool-200 p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-cool-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Tax (7.5%)</span>
                                    <span className="font-medium">₦{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-cool-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-emerald-600">Free</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-cool-200 pt-4 mb-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-bold text-gray-cool-900">Total</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        ₦{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base">
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>

                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <p className="text-xs text-emerald-800">
                                    <span className="font-semibold">Secure Checkout:</span> Your payment information is encrypted and secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
