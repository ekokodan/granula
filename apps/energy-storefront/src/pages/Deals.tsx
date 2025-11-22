import { motion } from 'framer-motion'
import { Clock, Percent, Bell, Zap } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { dealProducts } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { formatCurrency, calculateSavings } from '@/lib/utils'

// Mock deal end date (replace with actual data)
const dealEndDate = new Date()
dealEndDate.setDate(dealEndDate.getDate() + 7)

export function Deals() {
  const mainDeal = dealProducts[0]
  const otherDeals = dealProducts.slice(1)

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Percent className="w-4 h-4 text-accent" />
              <span className="text-accent font-medium">Limited Time Offers</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Quarterly <span className="gradient-text-gold">Clearance Deals</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Huge savings on our premium energy solutions. Stock is limited - once they're gone, they're gone!
            </p>

            {/* Countdown */}
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-white/60 text-sm mb-3 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Deals end in:
              </p>
              <CountdownTimer endDate={dealEndDate} />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Featured Deal */}
        {mainDeal && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-navy" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">Deal of the Week</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-card-hover overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative aspect-square md:aspect-auto">
                  <img
                    src={mainDeal.image}
                    alt={mainDeal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-accent text-navy font-bold text-lg px-4 py-2">
                      {calculateSavings(mainDeal.originalPrice!, mainDeal.price)}% OFF
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-2">
                    {mainDeal.category} Bundle
                  </span>
                  <h3 className="font-display text-3xl font-bold text-navy mb-4">
                    {mainDeal.name}
                  </h3>
                  <p className="text-navy/60 mb-6">
                    {mainDeal.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {mainDeal.specifications?.inverterKva && (
                      <div className="bg-surface-100 rounded-xl p-3">
                        <p className="text-navy/60 text-sm">Inverter</p>
                        <p className="font-semibold text-navy">{mainDeal.specifications.inverterKva} KVA</p>
                      </div>
                    )}
                    {mainDeal.specifications?.batteryKwh && (
                      <div className="bg-surface-100 rounded-xl p-3">
                        <p className="text-navy/60 text-sm">Battery</p>
                        <p className="font-semibold text-navy">{mainDeal.specifications.batteryKwh} kWh</p>
                      </div>
                    )}
                    {mainDeal.specifications?.backupHours && (
                      <div className="bg-surface-100 rounded-xl p-3">
                        <p className="text-navy/60 text-sm">Backup</p>
                        <p className="font-semibold text-navy">{mainDeal.specifications.backupHours}</p>
                      </div>
                    )}
                    {mainDeal.specifications?.warranty && (
                      <div className="bg-surface-100 rounded-xl p-3">
                        <p className="text-navy/60 text-sm">Warranty</p>
                        <p className="font-semibold text-navy">{mainDeal.specifications.warranty}</p>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-end gap-4 mb-6">
                    <span className="font-display text-4xl font-bold text-navy">
                      {formatCurrency(mainDeal.price)}
                    </span>
                    <span className="text-xl text-navy/40 line-through mb-1">
                      {formatCurrency(mainDeal.originalPrice!)}
                    </span>
                    <span className="text-secondary font-semibold mb-1">
                      Save {formatCurrency(mainDeal.originalPrice! - mainDeal.price)}
                    </span>
                  </div>

                  {/* Stock Warning */}
                  <div className="flex items-center gap-2 text-red-500 mb-6">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-medium">Only {mainDeal.stockCount} units left!</span>
                  </div>

                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    Claim This Deal
                  </Button>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Other Deals */}
        {otherDeals.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">More Deals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherDeals.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="bg-navy rounded-3xl p-8 md:p-12 text-center">
          <Bell className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Subscribe to get notified about our quarterly deals and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            <Button variant="primary">
              Notify Me
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
