'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/ScrollAnimations'
import { Shield, Award, Users } from 'lucide-react'

export default function CredibilitySection() {
    return (
        <section className="py-section-lg bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h2 className="text-h2 font-bold text-gray-cool-900 mb-4">
                            Trusted by Homeowners & Businesses
                        </h2>
                        <p className="text-body-lg text-gray-cool-600 max-w-2xl mx-auto">
                            We deliver premium energy solutions with proven results and certified expertise.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: Shield,
                            title: 'Certified Quality',
                            description: 'All equipment meets international safety and performance standards (CE, UL, IEC).'
                        },
                        {
                            icon: Users,
                            title: 'Expert Team',
                            description: 'Our engineers have hands-on experience designing complex off-grid systems.'
                        },
                        {
                            icon: Award,
                            title: 'Proven Results',
                            description: 'Real-world installations delivering 50%+ reduction in power costs for our clients.'
                        }
                    ].map((item, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-cool-100 hover:shadow-md transition-shadow duration-normal">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
                                    <item.icon className="h-6 w-6 text-primary-600" />
                                </div>
                                <h3 className="text-h4 font-semibold text-gray-cool-900 mb-3">{item.title}</h3>
                                <p className="text-body text-gray-cool-600">{item.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Testimonial / Case Study Highlight */}
                <ScrollReveal delay={0.3}>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-cool-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-64 lg:h-auto">
                                <Image
                                    src="/images/credibility_home_1765747359016.png"
                                    alt="Modern home with solar installation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center space-x-1 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <blockquote className="text-h4 font-medium text-gray-cool-900 mb-6">
                                    "Since installing the 10kVA system, we've reduced our diesel generator usage by 90%. The system runs silently and the app monitoring is fantastic."
                                </blockquote>
                                <div>
                                    <div className="font-semibold text-gray-cool-900">Dr. Adewale</div>
                                    <div className="text-gray-cool-500">VGC Resident, Lagos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
