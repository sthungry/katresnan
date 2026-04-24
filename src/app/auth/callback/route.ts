import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Auth Callback Route ────────────────────────────────────────────────────
// Handles email confirmation redirect from Supabase
// URL: /auth/callback?code=xxx
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard after email confirmation
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
