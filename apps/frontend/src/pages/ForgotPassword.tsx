import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/auth/password/forgot', { email })
      toast.success('If the email exists, a reset link has been sent')
      navigate('/login')
    } catch (_) {
      toast.error('Unable to send reset link')
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
          <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
          <CardDescription className="text-center">Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send reset link'}</Button>
            <div className="text-sm text-center text-muted-foreground">
              Remembered? <Link to="/login" className="text-brand-gold hover:underline">Back to login</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export const Component = ForgotPassword

