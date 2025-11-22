import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CreditCard, Building2, Truck, Shield, ArrowLeft,
  CheckCircle, Lock, Phone, Mail
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

type PaymentMethod = 'card' | 'bank' | 'financing'

const paymentMethods = [
  { id: 'card' as const, name: 'Card Payment', icon: CreditCard, description: 'Visa, Mastercard, Verve' },
  { id: 'bank' as const, name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
  { id: 'financing' as const, name: 'Pay in Installments', icon: Shield, description: '6-24 month plans' },
]

export function Checkout() {
  const { items, getTotal, getSavings } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [step, setStep] = useState(1)

  const total = getTotal()
  const savings = getSavings()
  const shipping = total > 5000 ? 0 : 150
  const finalTotal = total + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-navy mb-4">Your cart is empty</h2>
          <Link to="/store">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container-custom">
        {/* Back Link */}
        <Link to="/store" className="inline-flex items-center gap-2 text-navy/60 hover:text-secondary mb-8">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary text-navy flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy font-medium mb-2">First Name</label>
                  <input type="text" className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Last Name</label>
                  <input type="text" className="input-field" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Email</label>
                  <input type="email" className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Phone</label>
                  <input type="tel" className="input-field" placeholder="+234 800 000 0000" />
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary text-navy flex items-center justify-center text-sm font-bold">2</span>
                Installation Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-navy font-medium mb-2">Street Address</label>
                  <input type="text" className="input-field" placeholder="123 Main Street" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-navy font-medium mb-2">City</label>
                    <input type="text" className="input-field" placeholder="Lagos" />
                  </div>
                  <div>
                    <label className="block text-navy font-medium mb-2">State</label>
                    <select className="input-field">
                      <option value="">Select state...</option>
                      <option value="lagos">Lagos</option>
                      <option value="abuja">Abuja</option>
                      <option value="rivers">Rivers</option>
                      <option value="ogun">Ogun</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Additional Notes</label>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Any special instructions for delivery or installation..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <h2 className="font-display text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary text-navy flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all",
                      paymentMethod === method.id
                        ? "bg-secondary/10 border-2 border-secondary"
                        : "bg-surface-100 border-2 border-transparent hover:border-secondary/30"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      paymentMethod === method.id ? "bg-secondary text-navy" : "bg-surface-300 text-navy/60"
                    )}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-navy">{method.name}</p>
                      <p className="text-sm text-navy/60">{method.description}</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      paymentMethod === method.id ? "border-secondary bg-secondary" : "border-navy/30"
                    )}>
                      {paymentMethod === method.id && <CheckCircle className="w-3 h-3 text-navy" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-4 border-t border-surface-300">
                  <div>
                    <label className="block text-navy font-medium mb-2">Card Number</label>
                    <input type="text" className="input-field" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-navy font-medium mb-2">Expiry Date</label>
                      <input type="text" className="input-field" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-navy font-medium mb-2">CVV</label>
                      <input type="text" className="input-field" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === 'bank' && (
                <div className="pt-4 border-t border-surface-300">
                  <div className="bg-surface-100 rounded-xl p-4">
                    <p className="text-navy font-medium mb-2">Bank Transfer Details</p>
                    <p className="text-navy/60 text-sm">
                      Transfer to: <strong>Pascal Watts Ltd</strong><br />
                      Bank: <strong>Guaranty Trust Bank</strong><br />
                      Account Number: <strong>0123456789</strong><br />
                      Reference: Your order number (provided after order)
                    </p>
                  </div>
                </div>
              )}

              {/* Financing Info */}
              {paymentMethod === 'financing' && (
                <div className="pt-4 border-t border-surface-300">
                  <div className="space-y-3">
                    <p className="text-navy font-medium">Choose your plan:</p>
                    {[
                      { months: 6, rate: '5%', monthly: Math.round(finalTotal * 1.05 / 6) },
                      { months: 12, rate: '7%', monthly: Math.round(finalTotal * 1.07 / 12) },
                      { months: 24, rate: '9%', monthly: Math.round(finalTotal * 1.09 / 24) },
                    ].map((plan) => (
                      <div
                        key={plan.months}
                        className="flex items-center justify-between p-3 bg-surface-100 rounded-xl"
                      >
                        <span className="font-medium text-navy">{plan.months} months</span>
                        <span className="text-navy/60">APR {plan.rate}</span>
                        <span className="font-bold text-secondary">{formatCurrency(plan.monthly)}/mo</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-card sticky top-24"
            >
              <h2 className="font-display text-xl font-bold text-navy mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy truncate">{item.product.name}</p>
                      <p className="text-sm text-navy/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-navy">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-surface-300">
                <div className="flex justify-between text-navy/60">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Savings</span>
                    <span>-{formatCurrency(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-navy/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between font-display text-xl font-bold text-navy pt-3 border-t border-surface-300">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button variant="primary" size="lg" className="w-full mt-6">
                <Lock className="w-4 h-4" />
                Place Order
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-navy/40 text-sm">
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Protected</span>
                </div>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t border-surface-300 text-center">
                <p className="text-navy/60 text-sm mb-2">Need help?</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <a href="tel:+2348001234567" className="flex items-center gap-1 text-secondary hover:underline">
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                  <a href="mailto:support@pascalwatts.com" className="flex items-center gap-1 text-secondary hover:underline">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
