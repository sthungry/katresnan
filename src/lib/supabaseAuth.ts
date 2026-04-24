import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ─── Auth-aware Supabase Client ─────────────────────────────────────────────
// This client has persistSession: true (default) so auth state survives refresh.
// Use this for ALL authenticated operations (dashboard, profile, etc.)
// The original `supabase` client in supabase.ts is for PUBLIC data (packages, templates).

export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: { 'x-client-info': 'katresnan-auth' }
  }
})

// ─── Types ──────────────────────────────────────────────────────────────────
export type UserPlan = 'free' | 'silver' | 'gold' | 'platinum'

export interface UserProfile {
  id: string
  nama: string
  email: string
  wa: string
  plan: UserPlan
  package_id: string | null
  template_id: string | null
  order_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, metadata: { nama: string; wa: string }) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: metadata, // stored in raw_user_meta_data, used by trigger
    },
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabaseAuth.auth.signOut()
  return { error }
}

export async function signInWithGoogle(customRedirect?: string) {
  const defaultRedirect = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined;
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: customRedirect || defaultRedirect,
    },
  })
  return { data, error }
}

export async function getSession() {
  const { data: { session }, error } = await supabaseAuth.auth.getSession()
  return { session, error }
}

export async function getUser() {
  const { data: { user }, error } = await supabaseAuth.auth.getUser()
  return { user, error }
}

// ─── Profile helpers ─────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseAuth
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) { console.error('getProfile:', error.message); return null }
  return data as UserProfile
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabaseAuth
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// ─── Feature Gating ──────────────────────────────────────────────────────────
// Defines which features are available per plan

const PLAN_HIERARCHY: Record<UserPlan, number> = {
  free: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
}

export type FeatureId =
  | 'dashboard' | 'theme' | 'guests' | 'checkin' | 'ucapan'
  | 'template_wa' | 'planner' | 'nabung' | 'wishlist' | 'rekening' | 'alamat'

const FEATURE_MIN_PLAN: Record<FeatureId, UserPlan> = {
  dashboard: 'free',
  theme: 'free',           // Can fill data, but undangan not active until paid
  guests: 'silver',
  checkin: 'silver',
  ucapan: 'silver',
  template_wa: 'silver',
  wishlist: 'silver',
  rekening: 'silver',
  alamat: 'silver',
  planner: 'gold',
  nabung: 'gold',
}

export function canAccessFeature(userPlan: UserPlan, feature: FeatureId): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[FEATURE_MIN_PLAN[feature]]
}

export function getMinPlanForFeature(feature: FeatureId): UserPlan {
  return FEATURE_MIN_PLAN[feature]
}

export function getPlanLabel(plan: UserPlan): string {
  const labels: Record<UserPlan, string> = {
    free: 'Free',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  }
  return labels[plan]
}

export function getPlanEmoji(plan: UserPlan): string {
  const emojis: Record<UserPlan, string> = {
    free: '🆓',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
  }
  return emojis[plan]
}
