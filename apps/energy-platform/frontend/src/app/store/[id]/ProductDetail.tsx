'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { products } from '@/data/mockProducts'
import { useCart } from '@/contexts/CartContext'
import { ArrowLeft, Check, ShoppingCart, Zap, Shield, Wrench, Home, Calculator } from 'lucide-react'

interface AddOn {
    id: string
    label: string
    description: string
    price: number | null
    priceLabel: string
    icon: React.ReactNode
}

const bundleAddOns: AddOn[] = [
    {
        id: 'insurance',
        label: 'Add Insurance',
        description: 'Comprehensive coverage for your solar investment',
        price: 50000,
        priceLabel: '₦50,000/year',
        icon: <Shield className="w-5 h-5" />
    },
    {
        id: 'maintenance',
        label: 'Add Annual Maintenance (3 years)',
        description: 'Professional maintenance and system checkups',
        price: 75000,
        priceLabel: '₦75,000/year',
        icon: <Wrench className="w-5 h-5" />
    },
    {
        id: 'installation',
        label: 'Add Installation',
        description: 'Professional installation by certified technicians',
        price: null,
        priceLabel: 'Calculator coming soon',
        icon: <Home className="w-5 h-5" />
    }
]

export default function ProductDetail() {
    const params = useParams()
    const router = useRouter()
    const productId = params.id as string
    const { addToCart } = useCart()
    
    const product = useMemo(() => {
        return products.find(p => p.id === productId)
    }, [productId])

    const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set())
    const [showConfirmation, setShowConfirmation] = useState(false)

    const toggleAddOn = (addOnId: string) => {
        const newSelected = new Set(selectedAddOns)
        if (newSelected.has(addOnId)) {
            newSelected.delete(addOnId)
        } else {
            newSelected.add(addOnId)
        }
        setSelectedAddOns(newSelected)
    }

    const calculateTotal = () => {
        if (!product) return 0
        let total = product.price
        selectedAddOns.forEach(addOnId => {
            const addOn = bundleAddOns.find(a => a.id === addOnId)
            if (addOn?.price) {
                total += addOn.price
            }
        })
        return total
    }

    const handleAddToCart = () => {
        if (!product || !product.inStock) return
        
        addToCart(product, 1, Array.from(selectedAddOns))
        setShowConfirmation(true)
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-gray-warm-50">
                <Navbar />
                <div className="pt-32 px-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-cool-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-cool-600 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/store">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Store
                        </Button>
                    </Link>
                </div>
            </main>
        )
    }

    const isIndustrial = product.application === 'industrial'

    return (
        <main className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <div className="pt-28 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link 
                        href="/store" 
                        className="inline-flex items-center text-gray-cool-600 hover:text-emerald-600 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Store
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-cool-100">
                            <div className="relative aspect-square">
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {product.isBundle && (
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        Bundle Deal
                                    </Badge>
                                )}
                                {product.originalPrice && (
                                    <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100">
                                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </Badge>
                                )}
                                <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Financing Available
                                </Badge>
                            </div>

                            {/* Category */}
                            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider">
                                {product.category}
                            </p>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-cool-900">
                                {product.title}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-cool-600 text-lg">
                                {product.description}
                            </p>

                            {/* Specs */}
                            <div className="bg-gray-cool-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-cool-900 mb-4">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {product.specs.map((spec, index) => (
                                        <div key={index} className="flex items-center text-gray-cool-600">
                                            <Zap className="h-4 w-4 mr-2 text-emerald-500" />
                                            <span>
                                                <span className="font-medium text-gray-cool-900">{spec.value}</span>{' '}
                                                {spec.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add-Ons for Bundles */}
                            {product.isBundle && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-cool-900">Optional Add-Ons</h3>
                                    <div className="space-y-3">
                                        {bundleAddOns.map((addOn) => (
                                            <div 
                                                key={addOn.id}
                                                onClick={() => addOn.price !== null && toggleAddOn(addOn.id)}
                                                className={`
                                                    flex items-center justify-between p-4 rounded-xl border-2 transition-all
                                                    ${addOn.price === null 
                                                        ? 'border-gray-cool-200 bg-gray-cool-50 cursor-not-allowed opacity-70' 
                                                        : selectedAddOns.has(addOn.id)
                                                            ? 'border-emerald-500 bg-emerald-50 cursor-pointer'
                                                            : 'border-gray-cool-200 hover:border-emerald-300 cursor-pointer'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`
                                                        w-10 h-10 rounded-lg flex items-center justify-center
                                                        ${selectedAddOns.has(addOn.id) ? 'bg-emerald-500 text-white' : 'bg-gray-cool-100 text-gray-cool-600'}
                                                    `}>
                                                        {selectedAddOns.has(addOn.id) ? <Check className="w-5 h-5" /> : addOn.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-cool-900">{addOn.label}</p>
                                                        <p className="text-sm text-gray-cool-500">{addOn.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {addOn.price !== null ? (
                                                        <p className="font-semibold text-gray-cool-900">{addOn.priceLabel}</p>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-gray-cool-500">
                                                            <Calculator className="w-4 h-4" />
                                                            <span className="text-sm">{addOn.priceLabel}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price & CTA */}
                            <div className="bg-white rounded-xl p-6 border border-gray-cool-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        {product.originalPrice && (
                                            <p className="text-gray-cool-400 line-through text-lg">
                                                ₦{product.originalPrice.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-3xl font-bold text-gray-cool-900">
                                            ₦{calculateTotal().toLocaleString()}
                                        </p>
                                        {selectedAddOns.size > 0 && (
                                            <p className="text-sm text-gray-cool-500">
                                                Including {selectedAddOns.size} add-on{selectedAddOns.size > 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </Badge>
                                </div>
                                
                                {showConfirmation ? (
                                    <div className="space-y-3">
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                            <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                                                <Check className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-green-900">Added to cart!</p>
                                                <p className="text-sm text-green-700">
                                                    {selectedAddOns.size > 0 && `With ${selectedAddOns.size} add-on${selectedAddOns.size > 1 ? 's' : ''}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button 
                                                variant="outline"
                                                onClick={() => setShowConfirmation(false)}
                                            >
                                                Continue Shopping
                                            </Button>
                                            <Button 
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => router.push('/cart')}
                                            >
                                                View Cart
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button 
                                        size="lg" 
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                                        disabled={!product.inStock}
                                        onClick={isIndustrial ? undefined : handleAddToCart}
                                    >
                                        {isIndustrial ? (
                                            <>
                                                <Zap className="w-5 h-5 mr-2" />
                                                Request Quote
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Add to Cart
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* Brand & Application */}
                            <div className="flex items-center gap-4 text-sm text-gray-cool-500">
                                <span>Brand: <span className="font-medium text-gray-cool-700">{product.brand}</span></span>
                                <span>•</span>
                                <span>Application: <span className="font-medium text-gray-cool-700 capitalize">{product.application}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-8 px-6 border-t border-gray-cool-200 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-cool-500 text-sm">
                        © 2026 GridCo Energy. All rights reserved.
                    </p>
                </div>
            </footer>
        </main>
    )
}
