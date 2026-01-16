'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye, Zap } from 'lucide-react'

interface ProductCardProps {
    id: string
    title: string
    price: number
    originalPrice?: number
    image: string
    category: string
    specs: { label: string; value: string }[]
    isBundle?: boolean
    inStock?: boolean
    isConsultationOnly?: boolean
    onConsultation?: () => void
}

export default function ProductCard({
    id,
    title,
    price,
    originalPrice,
    image,
    category,
    specs,
    isBundle = false,
    inStock = true,
    isConsultationOnly = false,
    onConsultation
}: ProductCardProps) {
    return (
        <div className="group relative bg-white rounded-2xl border border-gray-cool-100 hover:border-primary-200 hover:shadow-xl transition-all duration-normal flex flex-col h-full overflow-hidden">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isBundle && (
                    <Badge className="bg-primary-600 hover:bg-primary-700 text-white border-none">
                        Bundle Deal
                    </Badge>
                )}
                {!inStock && (
                    <Badge variant="destructive">Out of Stock</Badge>
                )}
                {originalPrice && (
                    <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100">
                        Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                    </Badge>
                )}
            </div>

            {/* Image Area */}
            <div className="relative aspect-square bg-gray-warm-50 p-8 group-hover:bg-gray-warm-100 transition-colors duration-normal overflow-visible perspective-1000">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-4 group-hover:rotate-1 transition-all duration-500 ease-out drop-shadow-lg group-hover:drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)]"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-normal bg-black/5 backdrop-blur-[2px]">
                    <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-normal">
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white hover:bg-primary-50 hover:text-primary-600 shadow-lg">
                            <Eye className="h-5 w-5" />
                        </Button>
                        <Button size="icon" className="rounded-full h-10 w-10 bg-primary-600 hover:bg-primary-700 shadow-lg" onClick={isConsultationOnly ? onConsultation : undefined}>
                            {isConsultationOnly ? <Zap className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-medium text-primary-600 mb-2 uppercase tracking-wider">
                    {category}
                </div>

                <Link href={`/store/${id}`}>
                    <h3 className="text-h5 font-semibold text-gray-cool-900 mb-2 hover:text-primary-700 transition-colors">
                        {title}
                    </h3>
                </Link>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 text-sm">
                    {specs.slice(0, 4).map((spec, index) => (
                        <div key={index} className="flex items-center text-gray-cool-600">
                            <Zap className="h-3 w-3 mr-1.5 text-primary-400" />
                            <span className="truncate">
                                <span className="font-medium text-gray-cool-900">{spec.value}</span> {spec.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-cool-100">
                    <div className="flex flex-col">
                        {originalPrice && (
                            <span className="text-sm text-gray-cool-400 line-through">
                                ₦{originalPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="text-xl font-bold text-gray-cool-900">
                            ₦{price.toLocaleString()}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 -mr-2"
                        onClick={isConsultationOnly ? onConsultation : undefined}
                    >
                        {isConsultationOnly ? 'Request Quote' : 'View Details'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
