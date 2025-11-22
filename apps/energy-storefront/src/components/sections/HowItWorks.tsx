import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, ShoppingCart, Wrench, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const steps = [
  {
    number: '01',
    icon: Calculator,
    title: 'Design Your System',
    description: 'Use our free System Builder to calculate your energy needs. Get personalized recommendations based on your appliances and goals.',
    color: 'secondary',
  },
  {
    number: '02',
    icon: ShoppingCart,
    title: 'Choose & Purchase',
    description: 'Select from our pre-configured bundles or customize your solution. Flexible payment options including financing available.',
    color: 'accent',
  },
  {
    number: '03',
    icon: Wrench,
    title: 'Professional Installation',
    description: 'Our certified technicians handle everything. From site assessment to final commissioning - we ensure perfection.',
    color: 'secondary',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Enjoy & Save',
    description: 'Start enjoying reliable power and watch your energy bills drop. 24/7 support and 10-year warranty included.',
    color: 'accent',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-navy overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Journey to <span className="gradient-text">Energy Freedom</span>
          </h2>
          <p className="text-lg text-white/60">
            From initial design to final installation, we make going solar simple and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-flex mb-6">
                    <span className={`font-mono text-7xl font-bold ${
                      step.color === 'secondary' ? 'text-secondary/20' : 'text-accent/20'
                    }`}>
                      {step.number}
                    </span>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center ${
                      step.color === 'secondary' ? 'bg-secondary' : 'bg-accent'
                    }`}>
                      <step.icon className="w-8 h-8 text-navy" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-semibold text-xl text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/builder">
            <Button variant="primary" size="lg">
              Start Your Free Energy Audit
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
