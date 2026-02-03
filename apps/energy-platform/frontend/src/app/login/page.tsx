'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Zap, Shield, BarChart3, Headphones } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { login, isLoading: authLoading } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

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
            await login(formData.email, formData.password)
            router.push('/dashboard')
        } catch (error: any) {
            setErrors({
                submit: error.message || 'Login failed. Please check your credentials.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const features = [
        { icon: BarChart3, text: 'Real-time energy monitoring' },
        { icon: Shield, text: 'Performance analytics & insights' },
        { icon: Zap, text: 'Maintenance alerts & scheduling' },
        { icon: Headphones, text: '24/7 customer support' },
    ]

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 to-teal-700">
                <Image
                    src="/images/hero_bg_clean.png"
                    alt="Solar energy technology"
                    fill
                    className="object-cover opacity-30"
                    quality={90}
                    priority
                />

                {/* Overlay Content */}
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="max-w-md">
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
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Power your world with clean energy
                        </h2>
                        <p className="text-white/90 text-lg mb-8">
                            Access your dashboard to monitor system performance, track energy production, and manage your installation.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-white/20">
                                        <feature.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-white/90">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10">
                        <Link href="/" className="inline-block">
                            <div className="relative h-10 w-28">
                                <Image
                                    src="/images/logo_black.png"
                                    alt="GridCo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-slate-600">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={isSubmitting || authLoading}
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                            <div className="mt-2 flex items-center justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting || authLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-50 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-gray-300 bg-white text-slate-700 hover:bg-gray-50 transition-all"
                            disabled
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-gray-300 bg-white text-slate-700 hover:bg-gray-50 transition-all"
                            disabled
                        >
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                            </svg>
                            Apple
                        </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
