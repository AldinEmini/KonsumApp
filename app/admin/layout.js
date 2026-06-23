'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

function AdminGuard({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user && pathname !== '/admin/login') {
      router.replace('/admin/login')
    }
    if (user && pathname === '/admin/login') {
      router.replace('/admin/dashboard')
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#EF7B22]"/>
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') return null

  return children
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  )
}
