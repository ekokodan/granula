import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, SlidersHorizontal, X, Package, Zap, Battery, Sun } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { products, bundleProducts } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'bundles', name: 'Bundles (Recommended)' },
  { id: 'residential', name: 'Residential' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'grid-scale', name: 'Grid-Scale' },
]

const productTypes = [
  { id: 'all', name: 'All Types', icon: Package },
  { id: 'bundle', name: 'Bundles', icon: Package },
  { id: 'inverter', name: 'Inverters', icon: Zap },
  { id: 'battery', name: 'Batteries', icon: Battery },
  { id: 'solar', name: 'Solar Panels', icon: Sun },
]

const sortOptions = [
  { id: 'featured', name: 'Featured' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'newest', name: 'Newest First' },
]

export function Store() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const activeCategory = searchParams.get('category') || 'bundles'
  const activeType = searchParams.get('type') || 'all'
  const activeSort = searchParams.get('sort') || 'featured'

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (activeCategory === 'bundles') {
      result = result.filter(p => p.type === 'bundle')
    } else if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }

    // Type filter
    if (activeType !== 'all') {
      result = result.filter(p => p.type === activeType)
    }

    // Sort
    switch (activeSort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return result
  }, [activeCategory, activeType, activeSort])

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value === 'all' || value === 'featured') {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Banner */}
      <section className="bg-navy py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Energy Solutions <span className="gradient-text">Store</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Browse our complete range of premium energy solutions. We recommend starting with our
              pre-configured bundles for the best value and easiest installation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bundles First Banner */}
      {activeCategory !== 'bundles' && (
        <div className="bg-secondary/10 border-b border-secondary/20">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-secondary" />
                <p className="text-navy">
                  <strong>Pro tip:</strong> Our bundles include everything you need at a better price.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateFilter('category', 'bundles')}
              >
                View Bundles
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn(
            "w-full lg:w-64 flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg text-navy">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-1 hover:bg-surface-200 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-navy mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-colors",
                        (activeCategory === cat.id || (cat.id === 'bundles' && !searchParams.get('category')))
                          ? "bg-secondary/10 text-secondary font-medium"
                          : "hover:bg-surface-200 text-navy/70"
                      )}
                    >
                      {cat.name}
                      {cat.id === 'bundles' && (
                        <span className="ml-2 text-xs bg-secondary text-navy px-2 py-0.5 rounded-full">
                          Best Value
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-navy mb-3">Product Type</h4>
                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateFilter('type', type.id)}
                      className={cn(
                        "w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg transition-colors",
                        activeType === type.id
                          ? "bg-secondary/10 text-secondary font-medium"
                          : "hover:bg-surface-200 text-navy/70"
                      )}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="ghost"
                className="w-full text-navy/60 hover:text-navy"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-navy/60">
                  Showing <strong className="text-navy">{filteredProducts.length}</strong> products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={activeSort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="px-4 py-2 bg-white rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-secondary/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="hidden sm:flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'grid' ? "bg-secondary text-navy" : "text-navy/60 hover:text-navy"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'list' ? "bg-secondary text-navy" : "text-navy/60 hover:text-navy"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-xl text-navy mb-2">
                  No products found
                </h3>
                <p className="text-navy/60 mb-6">
                  Try adjusting your filters or browse our recommended bundles.
                </p>
                <Button onClick={() => setSearchParams(new URLSearchParams())}>
                  View All Products
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
