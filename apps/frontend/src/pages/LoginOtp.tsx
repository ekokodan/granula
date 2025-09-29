import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import api from '@/lib/api'
import { authStore } from '@/store/auth'

export default function LoginOtp() {
  const navigate = useNavigate()
  const { fetchMe, setAccessToken } = authStore()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/auth/otp/request', { email })
      toast.success('OTP sent to your email')
      setStep('verify')
    } catch (_) {
      toast.error('Unable to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/otp/verify', { email, code })
      const token = data?.access_token as string
      setAccessToken(token)
      await fetchMe()
      toast.success('Signed in')
      navigate('/dashboard')
    } catch (_) {
      toast.error('Invalid or expired code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gold-gradient" />
          </div>
          <CardTitle className="text-2xl text-center">Sign in with OTP</CardTitle>
          <CardDescription className="text-center">
            {step === 'request' ? 'Get a one-time code via email' : 'Enter the code we sent to your email'}
          </CardDescription>
        </CardHeader>
        {step === 'request' ? (
          <form onSubmit={requestCode}>
            <CardContent className="space-y-4">
              <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send code'}</Button>
              <div className="text-sm text-center text-muted-foreground">
                Prefer password? <Link to="/login" className="text-brand-gold hover:underline">Sign in</Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            <CardContent className="space-y-4">
              <Input type="text" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify & sign in'}</Button>
              <div className="text-sm text-center text-muted-foreground">
                Wrong email? <button type="button" className="text-brand-gold hover:underline" onClick={() => setStep('request')}>Change</button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}

export const Component = LoginOtp

