import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { authStore } from '@/store/auth'
import { Button as UIButton } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = authStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const verified = params.get('verified')
    const reason = params.get('reason')
    if (verified === '1') {
      toast.success('Email verified! You can now sign in.')
    } else if (verified === '0') {
      toast.error('Verification failed' + (reason ? `: ${reason}` : ''))
    }
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back!')
      const params = new URLSearchParams(location.search)
      const next = params.get('next')
      const storeUser = authStore.getState().user
      if (next) {
        navigate(next)
      } else if (storeUser && !storeUser.onboarding_complete) {
        navigate('/onboarding/plan-selection')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error('Invalid email or password')
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
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <UIButton
              type="button"
              variant="outline"
              onClick={() => (window.location.href = '/api/auth/oauth/google/start')}
              className="w-full"
            >
              Continue with Google
            </UIButton>
            <div className="text-center text-sm text-muted-foreground">OR</div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-gold hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <Link to="/forgot-password" className="text-brand-gold hover:underline">Forgot password?</Link>
              {' '}•{' '}
              <Link to="/login/otp" className="text-brand-gold hover:underline">Sign in with OTP</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export const Component = Login
