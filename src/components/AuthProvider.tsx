'use client'
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabaseAuth, getProfile, type UserProfile, type UserPlan } from '@/lib/supabaseAuth'
import type { User, Session } from '@supabase/supabase-js'

// ─── Context Types ───────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  plan: UserPlan
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  plan: 'free',
  refreshProfile: async () => {},
  signOut: async () => {},
})

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const p = await getProfile(user.id)
    if (p) setProfile(p)
  }, [user])

  // Initialize: check existing session
  useEffect(() => {
    async function init() {
      try {
        const { data: { session: s } } = await supabaseAuth.auth.getSession()
        if (s?.user) {
          setSession(s)
          setUser(s.user)
          const p = await getProfile(s.user.id)
          setProfile(p)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) {
          const p = await getProfile(s.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabaseAuth.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }, [])

  const plan: UserPlan = profile?.plan ?? 'free'

  return (
    <AuthContext.Provider value={{
      user, profile, session, loading, plan,
      refreshProfile, signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
