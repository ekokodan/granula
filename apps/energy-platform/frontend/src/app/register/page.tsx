'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Calculate password strength
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
    if (passwordStrength <= 2) return 'bg-error-500'
    if (passwordStrength <= 4) return 'bg-warning-500'
    return 'bg-primary-600'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 4) return 'Medium'
    return 'Strong'
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
            Create your account
          </h1>
          <p className="text-body text-gray-cool-600">
            Start your journey to energy independence
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-cool-200 p-8 animate-scaleIn">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <Input
              label="Full name"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              autoComplete="name"
              disabled={isSubmitting || authLoading}
            />

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
            />

            {/* Phone Field (Optional) */}
            <Input
              label="Phone number (optional)"
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
              disabled={isSubmitting || authLoading}
            />

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-cool-700 mb-2">
                Property type (optional)
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                disabled={isSubmitting || authLoading}
                className="flex h-12 w-full rounded-lg border border-gray-cool-300 bg-white px-4 py-3 text-body focus:outline-none focus:ring-2 focus:ring-energy-500 focus:border-energy-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-normal ease-out"
              >
                <option value="">Select property type</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="GRID_SCALE">Grid Scale</option>
              </select>
            </div>

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
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isSubmitting || authLoading}
              />
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-cool-600">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-error-600' : passwordStrength <= 4 ? 'text-warning-600' : 'text-primary-700'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-cool-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-slow ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 6) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isSubmitting || authLoading}
            />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1 h-4 w-4 rounded border-gray-cool-300 text-primary-700 focus:ring-primary-500 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-cool-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-700 hover:text-primary-800 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-700 hover:text-primary-800 font-medium">
                  Privacy Policy
                </Link>
              </label>
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
              className="w-full h-12 text-body font-medium bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-normal hover:scale-[1.02] active:scale-[0.98] mt-6"
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

        {/* Sign In Link */}
        <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <p className="text-body text-gray-cool-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-700 hover:text-primary-800 transition-colors duration-fast"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

