import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Users, Award, Target, Globe, Shield,
  CheckCircle, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

const stats = [
  { value: 500, suffix: '+', label: 'Installations Completed' },
  { value: 15, suffix: ' MW', label: 'Total Capacity Deployed' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
  { value: 70, suffix: '%', label: 'Avg. Cost Reduction' },
]

const values = [
  {
    icon: Target,
    title: 'Quality First',
    description: 'We only offer Grade-A products from certified manufacturers with proven track records.',
  },
  {
    icon: Users,
    title: 'Customer Success',
    description: 'Your success is our success. We provide end-to-end support from design to maintenance.',
  },
  {
    icon: Globe,
    title: 'Local Impact',
    description: 'Built for Africa, by Africans. We understand the unique challenges of our power infrastructure.',
  },
  {
    icon: Shield,
    title: 'Reliability',
    description: 'Every system comes with comprehensive warranty and dedicated after-sales support.',
  },
]

const team = [
  {
    name: 'Toju Adeyemi',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    bio: 'Electrical engineer with 15+ years in power systems and renewable energy.',
  },
  {
    name: 'Chioma Okafor',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    bio: 'Operations expert ensuring seamless project delivery across Nigeria.',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Technical Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    bio: 'Licensed engineer specializing in large-scale battery storage systems.',
  },
]

const certifications = [
  'ISO 9001:2015 Quality Management',
  'NEMSA Certified',
  'Authorized Distributor - Leading Battery Brands',
  'Solar Energy Society of Nigeria Member',
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              About Pascal Watts
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Powering Africa's <span className="gradient-text">Energy Future</span>
            </h1>
            <p className="text-xl text-white/70">
              We're on a mission to bring reliable, affordable energy to every home and business in Africa
              through premium energy storage solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-surface-200">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  className="font-display text-4xl md:text-5xl font-bold gradient-text"
                />
                <p className="text-navy/60 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={ref} className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-navy/70">
                <p>
                  Pascal Watts was born from a simple frustration: why should Nigerians settle for unreliable
                  power when world-class solutions exist? Our founder, an electrical engineer who spent years
                  working on power systems, saw firsthand the gap between what the market offered and what
                  customers actually needed.
                </p>
                <p>
                  The local market was flooded with low-quality products from questionable sources. Customers
                  were paying premium prices for systems that failed within months. Installation was often
                  amateurish, and after-sales support was non-existent.
                </p>
                <p>
                  We set out to change that. By partnering directly with Grade-A manufacturers, employing
                  certified engineers, and providing genuine support, we're raising the standard for energy
                  solutions in Africa.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
                  alt="Pascal Watts Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-navy" />
                  <div>
                    <p className="font-display font-bold text-2xl text-navy">Since 2020</p>
                    <p className="text-navy/70 text-sm">Serving Nigeria</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-navy">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              The principles that guide everything we do at Pascal Watts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-navy/60 max-w-2xl mx-auto">
              Experienced professionals dedicated to powering your success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-secondary/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display font-semibold text-lg text-navy">
                  {member.name}
                </h3>
                <p className="text-secondary font-medium text-sm mb-2">
                  {member.role}
                </p>
                <p className="text-navy/60 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-surface-200 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display font-semibold text-xl text-navy mb-2">
                Certifications & Partnerships
              </h3>
              <p className="text-navy/60">
                We maintain the highest standards in the industry.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg"
                >
                  <Award className="w-5 h-5 text-secondary" />
                  <span className="text-navy text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-navy rounded-3xl p-8 md:p-16 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
              Join hundreds of satisfied customers who have transformed their energy experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/builder">
                <Button variant="primary" size="lg">
                  Design Your System
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/store">
                <Button variant="secondary" size="lg">
                  Browse Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
