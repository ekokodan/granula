import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getSavings } = useCartStore()
  const total = getTotal()
  const savings = getSavings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-300">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-secondary" />
                <h2 className="font-display font-bold text-xl text-navy">Your Cart</h2>
                <span className="bg-secondary text-navy text-sm font-semibold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
              >
                <X className="w-6 h-6 text-navy/60" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-surface-400 mb-4" />
                  <h3 className="font-display font-semibold text-lg text-navy mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-navy/60 mb-6">
                    Start adding products to power up your home!
                  </p>
                  <Button onClick={closeCart} variant="primary">
                    <Link to="/store">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-surface-100 rounded-xl"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-navy truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-navy/60 capitalize">
                          {item.product.category} • {item.product.type}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-lg hover:bg-surface-300 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-lg hover:bg-surface-300 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-display font-bold text-navy">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-surface-300 p-6 space-y-4">
                {/* Savings */}
                {savings > 0 && (
                  <div className="flex items-center justify-between text-secondary">
                    <span className="font-medium">You're saving</span>
                    <span className="font-bold">{formatCurrency(savings)}</span>
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-navy/60">Subtotal</span>
                  <span className="font-display font-bold text-2xl text-navy">
                    {formatCurrency(total)}
                  </span>
                </div>

                <p className="text-sm text-navy/60">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Link to="/checkout" onClick={closeCart}>
                  <Button variant="primary" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={closeCart}
                  className="w-full text-center text-navy/60 hover:text-secondary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
