'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, Home, Building2, Factory } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const { register, isLoading: authLoading } = useAuth()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        propertyType: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        if (name === 'password') {
            let strength = 0
            if (value.length >= 8) strength++
            if (value.length >= 12) strength++
            if (/[A-Z]/.test(value)) strength++
            if (/[a-z]/.test(value)) strength++
            if (/[0-9]/.test(value)) strength++
            if (/[^A-Za-z0-9]/.test(value)) strength++
            setPasswordStrength(strength)
        }
    }

    const selectPropertyType = (type: string) => {
        setFormData(prev => ({ ...prev, propertyType: type }))
        if (errors.propertyType) {
            setErrors(prev => ({ ...prev, propertyType: '' }))
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        setIsSubmitting(true)
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                propertyType: formData.propertyType || undefined,
            })
            router.push('/dashboard')
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Registration failed. Please try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 2) return 'bg-red-500'
        if (passwordStrength <= 4) return 'bg-amber-500'
        return 'bg-emerald-500'
    }

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak'
        if (passwordStrength <= 4) return 'Medium'
        return 'Strong'
    }

    const propertyTypes = [
        {
            value: 'RESIDENTIAL',
            label: 'Residential',
            icon: Home,
            description: '3-15kW for homes',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            value: 'COMMERCIAL',
            label: 'Commercial',
            icon: Building2,
            description: '20-500kW for business',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            value: 'INDUSTRIAL',
            label: 'Industrial',
            icon: Factory,
            description: '500kW+ for manufacturing',
            gradient: 'from-orange-500 to-amber-500'
        },
    ]

    return (
        <div className="min-h-screen flex bg-slate-950">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-10">
                        <Link href="/" className="inline-block mb-8">
                            <div className="relative h-10 w-28">
                                <Image
                                    src="/images/logo_white.png"
                                    alt="GridCo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Create your account
                        </h1>
                        <p className="text-slate-400">
                            Start your journey to energy independence
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Property Type Selection - Visual Cards */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                What type of installation?
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {propertyTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => selectPropertyType(type.value)}
                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                            formData.propertyType === type.value
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-slate-700 hover:border-slate-600 bg-slate-900'
                                        }`}
                                    >
                                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${type.gradient} mb-2`}>
                                            <type.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-sm font-medium text-white">{type.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{type.description}</div>
                                        {formData.propertyType === type.value && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                autoComplete="name"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        {/* Phone Field (Optional) */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                                Phone number (optional)
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+234 800 123 4567"
                                autoComplete="tel"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                            {formData.password && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Password strength</span>
                                        <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${(passwordStrength / 6) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                required
                                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-slate-950"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-400">
                                I agree to the{' '}
                                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 font-medium">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 font-medium">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                                <p className="text-sm text-red-400">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 text-white mt-4"
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting || authLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                    Create account
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="/images/product_residential_real.png"
                    alt="Solar panels installation"
                    fill
                    className="object-cover"
                    quality={90}
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/60 via-slate-950/40 to-slate-950" />

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-12">
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Join 50,000+ customers
                        </h3>
                        <p className="text-slate-300 mb-6">
                            From homes to factories across Nigeria, our inverters power the future of clean energy.
                        </p>
                        <div className="flex items-center space-x-8">
                            <div>
                                <div className="text-3xl font-bold text-white">98.5%</div>
                                <div className="text-slate-500 text-sm">Efficiency</div>
                            </div>
                            <div className="h-12 w-px bg-slate-700" />
                            <div>
                                <div className="text-3xl font-bold text-white">15yr</div>
                                <div className="text-slate-500 text-sm">Warranty</div>
                            </div>
                            <div className="h-12 w-px bg-slate-700" />
                            <div>
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-slate-500 text-sm">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
