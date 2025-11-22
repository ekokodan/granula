import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Adebayo Okonkwo',
    role: 'Homeowner, VGC Lagos',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    content: 'Since installing the Pascal Watts system, my electricity bills have dropped by over 60%. The installation was seamless, and the support team is always responsive.',
    rating: 5,
    savings: '$150/month',
    system: 'Home Premium 10KVA',
  },
  {
    id: 2,
    name: 'Chioma Nwachukwu',
    role: 'CEO, Bright Retail Ltd',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    content: 'We needed reliable power for our retail stores. Pascal Watts delivered a three-phase system that keeps our operations running 24/7. Best investment we made.',
    rating: 5,
    savings: '$400/month',
    system: 'Business Pro 20KVA',
  },
  {
    id: 3,
    name: 'Emmanuel Okoro',
    role: 'Property Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    content: 'As a developer, offering reliable power is a major selling point. Pascal Watts helped us design and install systems for our entire estate. Residents love it!',
    rating: 5,
    savings: '70% grid reduction',
    system: 'Grid Power 233kWh',
  },
  {
    id: 4,
    name: 'Funke Adeleke',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    content: 'No more generator noise disturbing our customers! The system is quiet, efficient, and our food stays fresh even during outages. Highly recommend Pascal Watts.',
    rating: 5,
    savings: '$250/month',
    system: 'Business Pro 20KVA',
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={ref} className="section-padding bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Customer Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-6">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg text-navy/60">
            See what our customers say about their energy transformation journey.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-card-hover p-8 md:p-12"
          >
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-secondary/20 mb-6" />

            {/* Content */}
            <p className="text-xl md:text-2xl text-navy/80 font-medium leading-relaxed mb-8">
              "{testimonials[activeIndex].content}"
            </p>

            {/* Author & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-display font-semibold text-navy">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-navy/60 text-sm">
                    {testimonials[activeIndex].role}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-secondary">
                    {testimonials[activeIndex].savings}
                  </p>
                  <p className="text-navy/60 text-sm">Savings</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-lg text-navy">
                    {testimonials[activeIndex].system}
                  </p>
                  <p className="text-navy/60 text-sm">System</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-secondary hover:text-navy transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeIndex ? 'bg-secondary w-8' : 'bg-navy/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-secondary hover:text-navy transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
