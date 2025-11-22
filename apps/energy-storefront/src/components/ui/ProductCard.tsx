import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Zap, Clock, Battery, Sun } from 'lucide-react'
import { Product } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency, calculateSavings } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()

  const savings = product.originalPrice
    ? calculateSavings(product.originalPrice, product.price)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="badge bg-secondary text-navy font-semibold">
            New
          </span>
        )}
        {product.isDeal && savings > 0 && (
          <span className="badge bg-accent text-navy font-semibold">
            {savings}% OFF
          </span>
        )}
        {product.stockCount <= 5 && product.stockCount > 0 && (
          <span className="badge bg-red-500 text-white font-semibold">
            Only {product.stockCount} left
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.slug}`}
            className="p-3 bg-white rounded-full text-navy hover:bg-secondary hover:scale-110 transition-all"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => addItem(product)}
            className="p-3 bg-secondary rounded-full text-navy hover:bg-secondary-400 hover:scale-110 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="text-xs font-medium text-secondary uppercase tracking-wider">
          {product.category} {product.type === 'bundle' && '• Bundle'}
        </span>

        {/* Title */}
        <h3 className="mt-2 font-display font-semibold text-lg text-navy group-hover:text-secondary transition-colors">
          <Link to={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="mt-1 text-sm text-navy/60 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Specs Preview (for bundles) */}
        {product.type === 'bundle' && product.specifications && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.specifications.inverterKva && (
              <span className="inline-flex items-center gap-1 text-xs bg-surface-200 px-2 py-1 rounded-lg text-navy/70">
                <Zap className="w-3 h-3" />
                {product.specifications.inverterKva} KVA
              </span>
            )}
            {product.specifications.batteryKwh && (
              <span className="inline-flex items-center gap-1 text-xs bg-surface-200 px-2 py-1 rounded-lg text-navy/70">
                <Battery className="w-3 h-3" />
                {product.specifications.batteryKwh} kWh
              </span>
            )}
            {product.specifications.backupHours && (
              <span className="inline-flex items-center gap-1 text-xs bg-surface-200 px-2 py-1 rounded-lg text-navy/70">
                <Clock className="w-3 h-3" />
                {product.specifications.backupHours}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-2xl text-navy">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-navy/40 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.type === 'bundle' && (
              <span className="text-xs text-secondary">Installation included</span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            className={cn(
              "p-2 rounded-xl transition-all",
              product.inStock
                ? "bg-secondary/10 text-secondary hover:bg-secondary hover:text-navy"
                : "bg-surface-200 text-navy/30 cursor-not-allowed"
            )}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
