'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { AuthProvider } from '@/contexts/AuthContext'
import { SmoothScroll } from '@/components/SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </AuthProvider>
    </QueryClientProvider>
  )
}
