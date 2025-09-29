import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const t = params.get('token') || ''
    setToken(t)
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/auth/password/reset', { token, password })
      toast.success('Password has been reset')
      navigate('/login')
    } catch (e) {
      toast.error('Reset failed or token expired')
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
          <CardTitle className="text-2xl text-center">Reset password</CardTitle>
          <CardDescription className="text-center">Set a new password for your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading || !token}>{isLoading ? 'Saving...' : 'Reset password'}</Button>
            <div className="text-sm text-center text-muted-foreground">
              Back to <Link to="/login" className="text-brand-gold hover:underline">Login</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export const Component = ResetPassword

