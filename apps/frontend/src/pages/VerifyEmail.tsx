import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import api from '@/lib/api'
import { toast } from 'sonner'

export default function VerifyEmail() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const emailParam = params.get('email') || ''
  const [email, setEmail] = useState(emailParam)
  const [sending, setSending] = useState(false)

  const resend = async () => {
    if (!email) return
    setSending(true)
    try {
      await api.post('/auth/resend-verification', { email })
      toast.success('Verification email sent')
    } catch (_) {
      toast.error('Unable to resend verification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We sent a verification link to your email. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">Email</div>
          <div className="font-mono text-sm break-all">{email || '—'}</div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => {
              const next = encodeURIComponent('/onboarding/plan-selection')
              const emailQS = email ? `&email=${encodeURIComponent(email)}` : ''
              window.location.href = `/login?verified=1&next=${next}${emailQS}`
            }}
          >
            Complete account setup
          </Button>
          <Button onClick={resend} disabled={!email || sending} variant="outline" className="w-full">
            {sending ? 'Sending…' : 'Resend verification email'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already verified?{' '}
            <Link to={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`} className="text-brand-gold hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export const Component = VerifyEmail
