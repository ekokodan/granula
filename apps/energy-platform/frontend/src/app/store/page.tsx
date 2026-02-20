'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProductCard from '@/components/product/ProductCard'
import ConsultationModal from '@/components/store/ConsultationModal'
import { products, getFeaturedProduct, getBundles, getInStockProducts, getOnSaleProducts } from '@/data/mockProducts'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, X, Home, Building2, Factory, Zap, Battery, SunMedium, ArrowRight, Sparkles, Package, Check } from 'lucide-react'

export default function StorePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { addToCart } = useCart()

    // Deal banner state
    const [dealAdded, setDealAdded] = useState(false)
    const dealProduct = getFeaturedProduct()

    // Filter States
    const [priceRange, setPriceRange] = useState([0, 200000000])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedApplications, setSelectedApplications] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])

    // UI States
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [consultationOpen, setConsultationOpen] = useState(false)
    const [selectedProductForConsultation, setSelectedProductForConsultation] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>('all')

    // Initialize from URL params
    useEffect(() => {
        if (!searchParams) return

        const categoryParam = searchParams.get('category')
        if (categoryParam) {
            if (['residential', 'commercial', 'industrial'].includes(categoryParam)) {
                setActiveTab(categoryParam)
            } else {
                setSelectedCategories([categoryParam])
            }
        }
    }, [searchParams])

    // Derived Data
    const availableBrands = Array.from(new Set(products.map(p => p.brand || 'Other'))).filter(Boolean)

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Tab filter
        if (activeTab !== 'all') {
            if (product.application !== activeTab) {
                return false
            }
        }

        // Price Filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false

        // Category Filter (Product Type)
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || 'Other')) return false

        return true
    })

    const handleConsultationRequest = (productTitle: string) => {
        setSelectedProductForConsultation(productTitle)
        setConsultationOpen(true)
    }

    const clearFilters = () => {
        setPriceRange([0, 200000000])
        setSelectedCategories([])
        setSelectedApplications([])
        setSelectedBrands([])
        setActiveTab('all')
    }

    const tabs = [
        { id: 'all', label: 'All Products', icon: Sparkles },
        { id: 'residential', label: 'Residential', icon: Home },
        { id: 'commercial', label: 'Commercial', icon: Building2 },
        { id: 'industrial', label: 'Industrial', icon: Factory },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero Deal Banner */}
                <div className="mb-12 relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/images/hero_bg_clean.png')] bg-cover bg-center opacity-20" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-bold mb-4 border border-white/30">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                Deal of the Week
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {dealProduct?.title || 'Complete 5kVA Solar Bundle'}
                            </h2>
                            <p className="text-lg text-white/90 mb-6">
                                {dealProduct?.description || 'Get total energy independence with our best-selling residential package. Includes installation and 5-year warranty.'}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button 
                                    size="lg" 
                                    className={`border-0 transition-all ${
                                        dealAdded 
                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                            : 'bg-white text-emerald-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                        if (dealProduct) {
                                            addToCart(dealProduct, 1)
                                            setDealAdded(true)
                                            setTimeout(() => {
                                                router.push('/cart')
                                            }, 600)
                                        }
                                    }}
                                >
                                    {dealAdded ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            Shop Now
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                                <div className="text-2xl font-bold text-white">
                                    ₦{dealProduct ? dealProduct.price.toLocaleString() : '3,500,000'}
                                    {dealProduct?.originalPrice && (
                                        <span className="text-lg text-white/70 line-through font-normal ml-2">
                                            ₦{dealProduct.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block relative w-80 h-80">
                            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse" />
                            <Image
                                src={dealProduct?.image || '/images/product_residential_bundle.png'}
                                alt={dealProduct?.title || 'Deal Product'}
                                fill
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Products', value: filteredProducts.length, icon: Package },
                        { label: 'Bundles', value: filteredProducts.filter(p => p.isBundle).length, icon: Sparkles },
                        { label: 'In Stock', value: filteredProducts.filter(p => p.inStock).length, icon: Battery },
                        { label: 'On Sale', value: filteredProducts.filter(p => p.originalPrice).length, icon: Zap },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3 shadow-sm">
                            <div className="p-2 rounded-lg bg-emerald-50">
                                <stat.icon className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </span>
                                {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-emerald-600 h-auto p-0 hover:bg-transparent hover:text-emerald-700">
                                        Reset
                                    </Button>
                                )}
                            </h3>

                            {/* Brand Filter */}
                            <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-semibold text-slate-700">Brand</h4>
                                {availableBrands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={selectedBrands.includes(brand)}
                                            onCheckedChange={(checked: boolean) => {
                                                if (checked) setSelectedBrands([...selectedBrands, brand])
                                                else setSelectedBrands(selectedBrands.filter(b => b !== brand))
                                            }}
                                        />
                                        <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm text-slate-600">{brand}</Label>
                                    </div>
                                ))}
                            </div>

                            {/* Product Type */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-700">Product Type</h4>
                                {['Residential Bundle', 'Commercial Bundle', 'Industrial Bundle', 'Battery', 'Inverter', 'Solar Panel'].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cat-${type}`}
                                            checked={selectedCategories.includes(type)}
                                            onCheckedChange={(checked: boolean) => {
                                                if (checked) setSelectedCategories([...selectedCategories, type])
                                                else setSelectedCategories(selectedCategories.filter(c => c !== type))
                                            }}
                                        />
                                        <Label htmlFor={`cat-${type}`} className="cursor-pointer text-sm text-slate-600">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                            <h4 className="font-bold mb-2">Need Help Choosing?</h4>
                            <p className="text-sm text-emerald-50 mb-4">
                                Our experts can design a custom solution for your needs.
                            </p>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full bg-white text-emerald-700 hover:bg-emerald-50"
                                onClick={() => {
                                    setSelectedProductForConsultation('Custom Solution')
                                    setConsultationOpen(true)
                                }}
                            >
                                Get Free Consultation
                            </Button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <ProductCard
                                            {...product}
                                            product={product}
                                            onConsultation={() => handleConsultationRequest(product.title)}
                                            isConsultationOnly={product.application === 'industrial'}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-slate-500 mb-2">No products found matching your filters.</p>
                                <Button variant="link" onClick={clearFilters} className="text-emerald-600 hover:text-emerald-700">
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Filter Button */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
                    <Button 
                        onClick={() => setMobileFiltersOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 rounded-full px-6"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 bg-white rounded-3xl border border-gray-200 p-8 md:p-12 text-center shadow-sm">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Can't find what you're looking for?
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                        We offer custom solutions for unique requirements. From residential to utility-scale projects, our team can design the perfect system for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg" 
                            className="bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => {
                                setSelectedProductForConsultation('Custom Project')
                                setConsultationOpen(true)
                            }}
                        >
                            Request Custom Quote
                        </Button>
                        <Link href="/builder">
                            <Button size="lg" variant="outline" className="border-gray-300 text-slate-900 hover:bg-gray-50">
                                Use System Builder
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <ConsultationModal
                isOpen={consultationOpen}
                onClose={() => setConsultationOpen(false)}
                productTitle={selectedProductForConsultation}
            />
        </div>
    )
}
