'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(!initialUser)

  useEffect(() => {
    if (initialUser) return
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d?.user || null))
      .finally(() => setLoading(false))
  }, [initialUser])

  const login = async (email, password) => {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!r.ok) {
      const d = await r.json()
      throw new Error(d.error || 'Hyrja dështoi')
    }
    const d = await r.json()
    setUser(d.user)
    return d.user
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext) || { user: null, loading: false }
}
