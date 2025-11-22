import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Products } from '@/components/sections/Products'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Testimonials } from '@/components/sections/Testimonials'
import { CTA } from '@/components/sections/CTA'

export function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <Products />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  )
}
