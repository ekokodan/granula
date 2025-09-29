import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.post('/auth/register', { email, password })
      toast.success('Account created! Check your email to verify.')
      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      toast.error('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    window.location.href = '/api/auth/oauth/google/start'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: 'url(/assets/18106012.jpg)', 
          width: '1785px',
          height: '1190px',
          left: 'calc(50% - 1785px/2 + 0.5px)',
          top: '393px'
        }}
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[538px] px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-[31.5px] font-normal leading-[60px] text-[#987628] font-['Boldonse'] mb-4">
            Granula.
          </h1>
        </div>

        {/* Welcome Section */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-[44px] font-semibold leading-[66px] text-center text-black font-body mb-4">
              Welcome
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-normal leading-[30px] text-black opacity-60 font-body">
                Already have an account?
              </span>
              <Link 
                to="/login" 
                className="text-[20px] font-medium leading-[30px] text-[#987628] border-b border-[#987628] px-2.5 py-2.5 font-body hover:opacity-80 transition-opacity"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full h-[78px] bg-white border border-black/10 rounded-[40px] flex items-center justify-center gap-3 px-5 py-6 hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 relative">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span className="text-[20px] font-normal leading-[30px] text-black font-body">
              Continue with Google
            </span>
          </Button>
        </div>

        {/* OR Divider */}
        <div className="text-center mb-12">
          <span className="text-[20px] font-medium leading-[30px] text-black font-body">OR</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[78px] bg-white border border-black opacity-60 rounded-[40px] px-6 py-6 text-[20px] font-normal leading-[30px] text-black font-body placeholder:text-black placeholder:opacity-100 focus:opacity-100 focus:border-[#987628] focus:ring-[#987628] transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[78px] bg-white border border-black opacity-60 rounded-[40px] px-6 py-6 pr-16 text-[20px] font-normal leading-[30px] text-black font-body placeholder:text-black placeholder:opacity-100 focus:opacity-100 focus:border-[#987628] focus:ring-[#987628] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 text-black hover:text-[#987628] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Create Account Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[78px] bg-[#987628] hover:bg-[#7a5e20] text-white rounded-[40px] px-5 py-6 flex items-center justify-center gap-3 text-[20px] font-semibold leading-[30px] font-body transition-colors disabled:opacity-50"
          >
            <span>Create account</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
            </svg>
          </Button>
        </form>

        {/* Terms and Conditions */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-[18px] font-normal leading-[27px] text-black opacity-60 font-body">
            By creating an account you're agreeing to our
          </p>
          <Link 
            to="/terms" 
            className="inline-block text-[18px] font-normal leading-[27px] text-[#987628] border-b border-[#987628] px-2.5 py-2.5 font-body hover:opacity-80 transition-opacity"
          >
            Terms and condition
          </Link>
        </div>
      </div>
    </div>
  )
}

export const Component = Register
