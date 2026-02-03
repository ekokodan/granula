'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import ProductCard from '@/components/product/ProductCard'
import ConsultationModal from '@/components/store/ConsultationModal'
import { products, getFeaturedProduct, getBundles, getInStockProducts, getOnSaleProducts } from '@/data/mockProducts'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, X, Home, Building2, Factory, Zap, Battery, SunMedium, ArrowRight, Sparkles, Package } from 'lucide-react'

export default function StorePage() {
    const searchParams = useSearchParams()

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
            if (['residential', 'commercial', 'industrial', 'minigrid'].includes(categoryParam)) {
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
            if (activeTab === 'industrial') {
                if (product.application !== 'industrial' && product.application !== 'minigrid') return false
            } else if (product.application !== activeTab) {
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
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero Deal Banner */}
                <div className="mb-12 relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
                    <div className="absolute inset-0 bg-[url('/images/hero_bg_clean.png')] bg-cover bg-center opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold mb-4 border border-emerald-500/30">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Deal of the Week
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                Complete 5kVA Solar Bundle
                            </h2>
                            <p className="text-lg text-slate-300 mb-6">
                                Get total energy independence with our best-selling residential package. Includes installation and 5-year warranty.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <div className="text-2xl font-bold text-emerald-400">
                                    ₦3,500,000 
                                    <span className="text-lg text-slate-500 line-through font-normal ml-2">₦3.8M</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block relative w-80 h-80">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                            <Image
                                src="/images/product_residential_bundle.png"
                                alt="Deal Product"
                                fill
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                        <div key={i} className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <stat.icon className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </span>
                                {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-emerald-400 h-auto p-0 hover:bg-transparent hover:text-emerald-300">
                                        Reset
                                    </Button>
                                )}
                            </h3>

                            {/* Brand Filter */}
                            <div className="space-y-3 mb-6">
                                <h4 className="text-sm font-semibold text-slate-300">Brand</h4>
                                {availableBrands.map((brand) => (
                                    <div key={brand} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${brand}`}
                                            checked={selectedBrands.includes(brand)}
                                            onCheckedChange={(checked: boolean) => {
                                                if (checked) setSelectedBrands([...selectedBrands, brand])
                                                else setSelectedBrands(selectedBrands.filter(b => b !== brand))
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                        <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm text-slate-400">{brand}</Label>
                                    </div>
                                ))}
                            </div>

                            {/* Product Type */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-300">Product Type</h4>
                                {['Residential Bundle', 'Commercial Bundle', 'Industrial Bundle', 'Battery', 'Inverter', 'Solar Panel'].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`cat-${type}`}
                                            checked={selectedCategories.includes(type)}
                                            onCheckedChange={(checked: boolean) => {
                                                if (checked) setSelectedCategories([...selectedCategories, type])
                                                else setSelectedCategories(selectedCategories.filter(c => c !== type))
                                            }}
                                            className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                        <Label htmlFor={`cat-${type}`} className="cursor-pointer text-sm text-slate-400">{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                            <h4 className="font-bold mb-2">Need Help Choosing?</h4>
                            <p className="text-sm text-emerald-100 mb-4">
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
                                            onConsultation={() => handleConsultationRequest(product.title)}
                                            isConsultationOnly={['industrial', 'minigrid'].includes(product.application)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-900 rounded-2xl border border-dashed border-slate-700">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="h-8 w-8 text-slate-500" />
                                </div>
                                <p className="text-slate-400 mb-2">No products found matching your filters.</p>
                                <Button variant="link" onClick={clearFilters} className="text-emerald-400 hover:text-emerald-300">
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
                <div className="mt-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Can't find what you're looking for?
                    </h3>
                    <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
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
                            <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
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
