'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { SmoothScroll } from '@/components/SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
