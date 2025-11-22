import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Factory, TreePine, Fuel, Zap,
  TrendingUp, Shield, Clock, Users, ArrowRight,
  CheckCircle, Phone, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

const solutions = [
  {
    icon: Building2,
    title: 'Commercial Buildings',
    description: 'Office complexes, retail centers, and hospitality venues with 20-100 KVA requirements.',
    features: ['Three-phase systems', 'Load management', 'Peak shaving'],
    capacity: '20-100 KVA',
  },
  {
    icon: Factory,
    title: 'Industrial Facilities',
    description: 'Factories, warehouses, and manufacturing plants requiring continuous power.',
    features: ['High-capacity storage', 'Generator integration', '24/7 monitoring'],
    capacity: '100-500 KVA',
  },
  {
    icon: TreePine,
    title: 'Estates & Mini-Grids',
    description: 'Residential estates, gated communities, and rural electrification projects.',
    features: ['Centralized management', 'Metering solutions', 'Scalable design'],
    capacity: '233 kWh - 5 MWh',
  },
  {
    icon: Fuel,
    title: 'EV Charging Stations',
    description: 'Electric vehicle charging infrastructure with integrated energy storage.',
    features: ['Fast charging support', 'Grid independence', 'Revenue tracking'],
    capacity: 'Custom',
  },
]

const benefits = [
  { icon: TrendingUp, title: 'ROI in 3-5 Years', description: 'Typical payback period on investment' },
  { icon: Shield, title: '15-Year Warranty', description: 'Extended coverage for grid-scale systems' },
  { icon: Clock, title: '99.9% Uptime', description: 'Redundant systems ensure reliability' },
  { icon: Users, title: 'Dedicated Support', description: 'Account manager for enterprise clients' },
]

const caseStudies = [
  {
    title: 'Tech Hub Office Complex',
    location: 'Victoria Island, Lagos',
    system: '60 KVA / 120 kWh',
    savings: '65% reduction in energy costs',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
  },
  {
    title: 'Sunrise Estate',
    location: 'Abuja',
    system: '500 kWh Mini-Grid',
    savings: '24/7 power for 50 homes',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
  },
  {
    title: 'GreenCharge EV Station',
    location: 'Lekki, Lagos',
    system: '233 kWh Storage',
    savings: 'Grid-independent charging',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600',
  },
]

export function Commercial() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Enterprise Solutions
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Commercial & <span className="gradient-text">Grid-Scale</span> Energy
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Large-scale energy storage solutions for businesses, estates, and infrastructure projects.
              Custom-designed systems with enterprise-grade support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact-form">
                <Button variant="primary" size="lg">
                  Request Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
              <Link to="/builder">
                <Button variant="secondary" size="lg">
                  Estimate Your System
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              Solutions for Every Scale
            </h2>
            <p className="text-lg text-navy/60">
              From commercial buildings to utility-scale projects, we deliver reliable energy infrastructure.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, i) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <solution.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy mb-3">
                  {solution.title}
                </h3>
                <p className="text-navy/60 mb-4">
                  {solution.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-navy">{solution.capacity}</span>
                </div>
                <ul className="space-y-2">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-navy/70 text-sm">
                      <CheckCircle className="w-4 h-4 text-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-navy py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-navy/60">
              See how our enterprise solutions are powering businesses across Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, i) => (
              <motion.div
                key={study.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg text-navy mb-1">
                    {study.title}
                  </h3>
                  <p className="text-navy/60 text-sm mb-3">{study.location}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-secondary">{study.system}</span>
                    <span className="text-navy/60">{study.savings}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="section-padding bg-surface-200">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                Request a Consultation
              </h2>
              <p className="text-lg text-navy/60">
                Tell us about your project and we'll design a custom solution for you.
              </p>
            </div>

            <form className="bg-white rounded-2xl p-8 shadow-card">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-navy font-medium mb-2">Company Name</label>
                  <input type="text" className="input-field" placeholder="Your company" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Contact Person</label>
                  <input type="text" className="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Email</label>
                  <input type="email" className="input-field" placeholder="email@company.com" />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Phone</label>
                  <input type="tel" className="input-field" placeholder="+234..." />
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Project Type</label>
                  <select className="input-field">
                    <option value="">Select type...</option>
                    <option value="commercial">Commercial Building</option>
                    <option value="industrial">Industrial Facility</option>
                    <option value="estate">Estate / Mini-Grid</option>
                    <option value="ev">EV Charging</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-navy font-medium mb-2">Estimated Load (KVA)</label>
                  <input type="text" className="input-field" placeholder="e.g., 50-100 KVA" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-navy font-medium mb-2">Project Details</label>
                <textarea
                  className="input-field min-h-[120px]"
                  placeholder="Tell us about your project requirements..."
                />
              </div>
              <Button variant="primary" size="lg" className="w-full">
                Submit Inquiry
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
              <a href="tel:+2348001234567" className="flex items-center gap-2 text-navy/60 hover:text-secondary transition-colors">
                <Phone className="w-5 h-5" />
                +234 800 123 4567
              </a>
              <a href="mailto:enterprise@pascalwatts.com" className="flex items-center gap-2 text-navy/60 hover:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
                enterprise@pascalwatts.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
