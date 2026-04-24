'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn, signInWithGoogle } from '@/lib/supabaseAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError('')

    const { data, error: err } = await signIn(email.trim(), password)

    if (err) {
      const msg = err.message.includes('Invalid login')
        ? 'Email atau password salah. Coba lagi.'
        : err.message.includes('Email not confirmed')
          ? 'Email belum dikonfirmasi. Cek inbox kamu.'
          : 'Gagal masuk: ' + err.message
      setError(msg)
      setLoading(false)
      return
    }

    if (data?.session) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Logo */}
        <div className="auth-logo">
          <h1>
            <span className="accent">✦</span> Katresnan<span className="accent">.</span>
          </h1>
          <p>Masuk ke Dashboard</p>
        </div>

        {/* Card */}
        <form className="auth-card" onSubmit={handleSubmit}>

          {error && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              <ion-icon name="warning" style={{ color: '#F59E0B' }}></ion-icon> {error}
            </div>
          )}

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">
              Password <span className="required">*</span>
            </label>
            <div className="auth-password-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className="auth-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                <ion-icon name={showPw ? "eye-off-outline" : "eye-outline"}></ion-icon>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? (
                <><ion-icon name="sync-outline" class="animate-spin"></ion-icon> Memverifikasi...</>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </div>

          <div className="auth-divider"><span>Atau</span></div>

          <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="auth-btn"
              onClick={async () => {
                setLoading(true);
                await signInWithGoogle();
              }}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8055 10.2292C19.8055 9.55056 19.7508 8.86667 19.6328 8.19531H10.2V12.0492H15.6016C15.3773 13.2911 14.6571 14.3898 13.6023 15.0875V17.5866H16.825C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"></path>
                <path d="M10.2 20C12.9 20 15.1711 19.1044 16.8297 17.5866L13.607 15.0875C12.7086 15.6972 11.5508 16.0428 10.2047 16.0428C7.59141 16.0428 5.38047 14.2828 4.58672 11.9172H1.26562V14.4922C2.96172 17.8695 6.41953 20 10.2 20Z" fill="#34A853"></path>
                <path d="M4.58203 11.9125C4.16484 10.6706 4.16484 9.33406 4.58203 8.09219V5.51719H1.26562C-0.421875 8.88281 -0.421875 12.1219 1.26562 15.4875L4.58203 11.9125Z" fill="#FBBC04"></path>
                <path d="M10.2 3.95781C11.6203 3.93594 13.0008 4.47188 14.0414 5.45781L16.8945 2.60469C15.0867 0.904688 12.6867 -0.0210938 10.2 0.000781252C6.41953 0.000781252 2.96172 2.13125 1.26562 5.51719L4.58203 8.09219C5.37109 5.72188 7.58672 3.95781 10.2 3.95781Z" fill="#EA4335"></path>
              </svg>
              Masuk dengan Google
            </button>
          </div>

          {/* Terms */}
          <p className="auth-terms">
            Dengan masuk, kamu menyetujui{' '}
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link> dan{' '}
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link> kami.
          </p>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Belum punya akun? <Link href="/auth/register">Daftar Gratis</Link>
        </p>

      </div>
    </div>
  )
}
