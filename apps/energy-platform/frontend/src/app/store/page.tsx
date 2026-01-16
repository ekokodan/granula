'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import ProductCard from '@/components/product/ProductCard'
import ConsultationModal from '@/components/store/ConsultationModal'
import { products } from '@/data/mockProducts'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Filter, X } from 'lucide-react'

export default function StorePage() {
    const searchParams = useSearchParams()

    // Filter States
    const [priceRange, setPriceRange] = useState([0, 20000000])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedApplications, setSelectedApplications] = useState<string[]>([])
    const [selectedVoltages, setSelectedVoltages] = useState<string[]>([])

    // UI States
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [consultationOpen, setConsultationOpen] = useState(false)
    const [selectedProductForConsultation, setSelectedProductForConsultation] = useState<string>('')

    // Initialize from URL params
    useEffect(() => {
        if (!searchParams) return

        const categoryParam = searchParams.get('category')
        if (categoryParam) {
            if (['residential', 'commercial', 'industrial', 'minigrid'].includes(categoryParam)) {
                setSelectedApplications([categoryParam])
            } else {
                setSelectedCategories([categoryParam]) // Fallback logic
            }
        }
    }, [searchParams])

    // ... (rest of the file)



    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Price Filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false

        // Application Filter (Solution Type)
        if (selectedApplications.length > 0 && !selectedApplications.includes(product.application)) return false

        // Category Filter (Product Type)
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false

        // Voltage Filter (Mock logic - assuming added to product data or inferred)
        // In a real app, product.voltage would exist. For now, we skip if data missing.

        return true
    })

    const handleConsultationRequest = (productTitle: string) => {
        setSelectedProductForConsultation(productTitle)
        setConsultationOpen(true)
    }

    const clearFilters = () => {
        setPriceRange([0, 20000000])
        setSelectedCategories([])
        setSelectedApplications([])
        setSelectedVoltages([])
    }

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Deal of the Week Banner */}
                <div className="mb-16 relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/images/hero_bg_clean.png')] bg-cover bg-center opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold mb-4 border border-yellow-500/30">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                Deal of the Week
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                Complete 5kVA Solar Bundle
                            </h2>
                            <p className="text-lg text-gray-300 mb-8">
                                Get total energy independence with our best-selling residential package. Includes installation and 5-year warranty.
                            </p>
                            <div className="flex items-center gap-4">
                                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 border-0">
                                    Shop Now
                                </Button>
                                <div className="text-2xl font-bold text-yellow-400">
                                    ₦3,500,000 <span className="text-lg text-gray-400 line-through font-normal ml-2">₦4.2M</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block relative w-80 h-80">
                            {/* Floating Product Image */}
                            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full animate-pulse" />
                            <img
                                src="/images/product_residential_bundle.png"
                                alt="Deal Product"
                                className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-h5 font-bold text-gray-cool-900 mb-4 flex items-center justify-between">
                                Filters
                                {(selectedCategories.length > 0 || selectedApplications.length > 0) && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-primary-600 h-auto p-0 hover:bg-transparent">
                                        Reset
                                    </Button>
                                )}
                            </h3>
                        </div>

                        {/* Solution Type */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-cool-900">Solution Type</h4>
                            {['residential', 'commercial', 'industrial', 'minigrid'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`app-${type}`}
                                        checked={selectedApplications.includes(type)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) setSelectedApplications([...selectedApplications, type])
                                            else setSelectedApplications(selectedApplications.filter(a => a !== type))
                                        }}
                                    />
                                    <Label htmlFor={`app-${type}`} className="capitalize cursor-pointer">{type === 'minigrid' ? 'Mini Grid' : type}</Label>
                                </div>
                            ))}
                        </div>

                        {/* Product Type */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-cool-900">Product Type</h4>
                            {['Residential Bundle', 'Commercial Bundle', 'Battery', 'Inverter', 'Solar Panel'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cat-${type}`}
                                        checked={selectedCategories.includes(type)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) setSelectedCategories([...selectedCategories, type])
                                            else setSelectedCategories(selectedCategories.filter(c => c !== type))
                                        }}
                                    />
                                    <Label htmlFor={`cat-${type}`} className="cursor-pointer">{type}</Label>
                                </div>
                            ))}
                        </div>

                        {/* Voltage (Mock) */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-cool-900">Voltage</h4>
                            {['Low Voltage (48V)', 'High Voltage (>100V)'].map((volt) => (
                                <div key={volt} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`volt-${volt}`}
                                        checked={selectedVoltages.includes(volt)}
                                        onCheckedChange={(checked: boolean) => {
                                            if (checked) setSelectedVoltages([...selectedVoltages, volt])
                                            else setSelectedVoltages(selectedVoltages.filter(v => v !== volt))
                                        }}
                                    />
                                    <Label htmlFor={`volt-${volt}`} className="cursor-pointer">{volt}</Label>
                                </div>
                            ))}
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
                                            // Override click behavior for Industrial/MiniGrid
                                            onConsultation={() => handleConsultationRequest(product.title)}
                                            isConsultationOnly={['industrial', 'minigrid'].includes(product.application)}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-cool-200">
                                <p className="text-gray-cool-500">No products found matching your filters.</p>
                                <Button variant="link" onClick={clearFilters} className="mt-2 text-primary-600">
                                    Clear all filters
                                </Button>
                            </div>
                        )}
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
