import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Battery,
  Zap,
  Sun,
  Wifi,
  Shield,
  Leaf,
  Wrench,
  Clock,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Battery,
    title: 'Premium Lithium Technology',
    description: 'Grade-A LiFePO4 batteries with 6000+ cycle life. Stackable, modular design for easy scaling.',
    color: 'secondary',
  },
  {
    icon: Zap,
    title: '3-4x Space Efficient',
    description: 'Our compact systems use a fraction of the space compared to traditional setups.',
    color: 'accent',
  },
  {
    icon: Sun,
    title: 'Solar Integration',
    description: 'Seamless solar panel integration to maximize energy independence and savings.',
    color: 'secondary',
  },
  {
    icon: Wifi,
    title: 'Smart Monitoring',
    description: 'Real-time energy tracking via mobile app. Know your consumption and savings instantly.',
    color: 'accent',
  },
  {
    icon: Shield,
    title: '10-Year Warranty',
    description: 'Industry-leading warranty coverage with dedicated support team.',
    color: 'secondary',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Reduce your carbon footprint while enjoying reliable, clean energy.',
    color: 'accent',
  },
]

const benefits = [
  { icon: TrendingUp, value: '70%', label: 'Lower energy costs' },
  { icon: Clock, value: '24/7', label: 'Reliable backup power' },
  { icon: Wrench, value: 'Zero', label: 'Maintenance hassle' },
]

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Why Choose Pascal Watts
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
            Premium Technology, <span className="gradient-text">Unmatched Value</span>
          </h2>
          <p className="text-lg text-navy/60">
            We bring Grade-A energy solutions that outperform traditional systems in every way.
            Experience the future of power independence.
          </p>
        </motion.div>

        {/* Benefits Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mb-16 p-8 bg-navy rounded-3xl"
        >
          {benefits.map((benefit, i) => (
            <div key={benefit.label} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-white">{benefit.value}</p>
                <p className="text-white/60 text-sm">{benefit.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group p-8 rounded-2xl bg-surface-100 hover:bg-white hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                feature.color === 'secondary'
                  ? 'bg-secondary/10 group-hover:bg-secondary/20'
                  : 'bg-accent/10 group-hover:bg-accent/20'
              }`}>
                <feature.icon className={`w-7 h-7 ${
                  feature.color === 'secondary' ? 'text-secondary' : 'text-accent'
                }`} />
              </div>
              <h3 className="font-display font-semibold text-xl text-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-navy/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
