'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

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
    // Clear error when user starts typing
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-warm-50 via-white to-energy-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10 animate-fadeInUp">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="relative h-12 w-32">
              <Image
                src="/images/logo_black.png"
                alt="gridco"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-h2 font-semibold text-gray-cool-900 mb-2">
            Welcome back
          </h1>
          <p className="text-body text-gray-cool-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-cool-200 p-8 animate-scaleIn">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email address"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting || authLoading}
              className="transition-all duration-normal"
            />

            {/* Password Field */}
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting || authLoading}
                className="transition-all duration-normal"
              />
              <div className="mt-2 flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-700 hover:text-primary-800 transition-colors duration-fast"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-error-50 border border-error-200 p-4 animate-fadeIn">
                <p className="text-sm text-error-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-body font-medium bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-normal hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting || authLoading}
            >
              {isSubmitting || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-cool-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-cool-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login (Placeholder) */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 border-gray-cool-300 hover:bg-gray-cool-50 transition-all duration-normal"
              disabled
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 border-gray-cool-300 hover:bg-gray-cool-50 transition-all duration-normal"
              disabled
            >
              Apple
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <p className="text-body text-gray-cool-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors duration-fast"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

