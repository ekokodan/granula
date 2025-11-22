import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Building2, Factory } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { featuredProducts } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const categories = [
  { id: 'all', name: 'All Solutions', icon: Package },
  { id: 'residential', name: 'Residential', icon: Package },
  { id: 'commercial', name: 'Commercial', icon: Building2 },
  { id: 'grid-scale', name: 'Grid-Scale', icon: Factory },
]

export function Products() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = activeCategory === 'all'
    ? featuredProducts
    : featuredProducts.filter(p => p.category === activeCategory)

  return (
    <section ref={ref} className="section-padding bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Our Solutions
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
            Complete Energy <span className="gradient-text">Bundles</span>
          </h2>
          <p className="text-lg text-navy/60">
            Pre-configured systems designed for maximum efficiency. Each bundle includes everything
            you need - inverter, batteries, solar panels, and professional installation.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300",
                activeCategory === category.id
                  ? "bg-navy text-white shadow-lg"
                  : "bg-white text-navy/70 hover:bg-navy/5"
              )}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.slice(0, 6).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/store">
            <Button variant="dark" size="lg">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
