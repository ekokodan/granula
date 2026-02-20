'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Clock, Send, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setIsSubmitting(false)
        setIsSubmitted(true)
        
        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'general',
                message: ''
            })
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-gray-warm-50">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-cool-900 mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-gray-cool-600 max-w-2xl mx-auto">
                        Have a question about our products or services? We're here to help. 
                        Reach out to our team and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-cool-200 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-cool-900 mb-6">Send us a Message</h2>
                            
                            {isSubmitted ? (
                                <div className="py-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-cool-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-cool-600">
                                        Thank you for contacting us. We'll get back to you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input 
                                                id="name" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required 
                                                placeholder="John Doe" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input 
                                                id="email" 
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                                placeholder="john@example.com" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input 
                                                id="phone" 
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+234 800 000 0000" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="flex h-10 w-full rounded-md border border-gray-cool-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="sales">Sales</option>
                                                <option value="support">Technical Support</option>
                                                <option value="installation">Installation</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea 
                                            id="message" 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required 
                                            placeholder="Tell us how we can help you..."
                                            rows={6}
                                            className="resize-none"
                                        />
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Information Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-cool-200 p-6 shadow-sm">
                            <h3 className="font-bold text-gray-cool-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Image 
                                            src="/images/icons/icon-phone.png" 
                                            alt="Phone" 
                                            width={32} 
                                            height={32} 
                                            className="w-8 h-8 object-contain" 
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-cool-500 mb-1">Phone</p>
                                        <p className="font-medium text-gray-cool-900">+234 800 GRIDCO</p>
                                        <p className="text-sm text-gray-cool-600">Mon-Fri, 8AM-6PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Image 
                                            src="/images/icons/icon-email.png" 
                                            alt="Email" 
                                            width={32} 
                                            height={32} 
                                            className="w-8 h-8 object-contain" 
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-cool-500 mb-1">Email</p>
                                        <p className="font-medium text-gray-cool-900">info@gridco.ng</p>
                                        <p className="text-sm text-gray-cool-600">We reply within 24hrs</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Image 
                                            src="/images/icons/icon-chat.png" 
                                            alt="WhatsApp" 
                                            width={32} 
                                            height={32} 
                                            className="w-8 h-8 object-contain" 
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-cool-500 mb-1">WhatsApp</p>
                                        <a 
                                            href="https://wa.me/2348000000000" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="font-medium text-emerald-600 hover:text-emerald-700"
                                        >
                                            Chat with us
                                        </a>
                                        <p className="text-sm text-gray-cool-600">Quick responses</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Image 
                                            src="/images/icons/icon-location.png" 
                                            alt="Location" 
                                            width={32} 
                                            height={32} 
                                            className="w-8 h-8 object-contain" 
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-cool-500 mb-1">Office Address</p>
                                        <p className="font-medium text-gray-cool-900">123 Solar Avenue</p>
                                        <p className="text-sm text-gray-cool-600">Victoria Island, Lagos</p>
                                        <p className="text-sm text-gray-cool-600">Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5" />
                                <h3 className="font-bold">Business Hours</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-emerald-50">Monday - Friday</span>
                                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-50">Saturday</span>
                                    <span className="font-medium">9:00 AM - 3:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-emerald-50">Sunday</span>
                                    <span className="font-medium">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
