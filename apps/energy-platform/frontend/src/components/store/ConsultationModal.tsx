'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle, X } from 'lucide-react'

interface ConsultationModalProps {
    isOpen: boolean
    onClose: () => void
    productTitle?: string
}

export default function ConsultationModal({ isOpen, onClose, productTitle }: ConsultationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)
    }

    const handleClose = () => {
        setIsSuccess(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-cool-400 hover:text-gray-cool-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="mb-6">
                            <h2 className="text-h4 font-bold text-gray-cool-900">Request Expert Consultation</h2>
                            <p className="text-body-sm text-gray-cool-500 mt-1">
                                {productTitle
                                    ? `Interested in the ${productTitle}? Our engineers will analyze your needs and provide a custom solution.`
                                    : "Our engineers will analyze your needs and provide a custom solution for your facility."
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" required placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" required placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input id="email" type="email" required placeholder="john@company.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" required placeholder="+234..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name (Optional)</Label>
                                <Input id="company" placeholder="GridCo Industries" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="needs">Brief Description of Needs</Label>
                                <Textarea
                                    id="needs"
                                    placeholder="e.g., We need backup power for a 50-staff office with heavy machinery..."
                                    className="h-24"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
                                <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Request Consultation'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-h4 font-bold text-gray-cool-900 mb-2">Request Received!</h3>
                        <p className="text-body text-gray-cool-600 max-w-xs mx-auto mb-8">
                            Thank you for your interest. One of our energy experts will contact you within 24 hours.
                        </p>
                        <Button onClick={handleClose} className="w-full max-w-xs">
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
