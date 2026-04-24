'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/lib/supabaseAuth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nama: '', email: '', wa: '', password: '', confirmPw: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPw, setShowPw] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
    setGlobalError('')
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.nama.trim()) e.nama = 'Nama wajib diisi'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (form.wa && !/^[0-9]{9,15}$/.test(form.wa)) e.wa = 'Nomor tidak valid (angka saja)'
    if (form.password.length < 6) e.password = 'Minimal 6 karakter'
    if (form.password !== form.confirmPw) e.confirmPw = 'Password tidak sama'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setGlobalError('')

    const { data, error } = await signUp(form.email.trim(), form.password, {
      nama: form.nama.trim(),
      wa: form.wa.trim(),
    })

    if (error) {
      const msg = error.message.includes('already registered')
        ? 'Email sudah terdaftar. Silakan login.'
        : 'Gagal mendaftar: ' + error.message
      setGlobalError(msg)
      setLoading(false)
      return
    }

    // If email confirmation is disabled, redirect directly
    if (data?.session) {
      router.push('/dashboard')
      return
    }

    // If email confirmation required
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <h1><span className="accent">✦</span> Katresnan<span className="accent">.</span></h1>
          </div>
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16, color: '#3B82F6' }}><ion-icon name="mail-unread-outline"></ion-icon></div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--tw-prose-body, #0f172a)', marginBottom: 8 }}>
              Cek Email Kamu!
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Kami sudah mengirim link konfirmasi ke <strong style={{ color: '#0f172a' }}>{form.email}</strong>.
              <br />Klik link tersebut untuk mengaktifkan akun kamu.
            </p>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
              💡 Tidak menerima email? Cek folder <strong>Spam</strong> atau tunggu beberapa menit.
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/auth/login"
                className="auth-btn auth-btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Sudah Konfirmasi? Masuk →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Logo */}
        <div className="auth-logo">
          <h1>
            <span className="accent">✦</span> Katresnan<span className="accent">.</span>
          </h1>
          <p>Buat Akun Gratis</p>
        </div>

        {/* Card */}
        <form className="auth-card" onSubmit={handleSubmit}>

          {globalError && (
            <div className="auth-error" style={{ marginBottom: '1rem' }}>
              <ion-icon name="warning" style={{ color: '#F59E0B' }}></ion-icon> {globalError}
            </div>
          )}

          {/* Free plan badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span className="auth-plan-badge auth-plan-free"><ion-icon name="gift-outline" style={{ marginRight: 4, transform: 'translateY(2px)' }}></ion-icon> Mulai Gratis</span>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              Explore dashboard & atur undangan. Bayar nanti kapan saja.
            </p>
          </div>

          {/* Nama */}
          <div className="auth-field">
            <label className="auth-label">
              Nama Lengkap <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`auth-input ${errors.nama ? 'auth-input-error' : ''}`}
              value={form.nama}
              onChange={e => update('nama', e.target.value)}
              placeholder="contoh: Budi Santoso"
              autoComplete="name"
            />
            {errors.nama && <p className="auth-field-error"><ion-icon name="warning" style={{ color: '#EF4444' }}></ion-icon> {errors.nama}</p>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
            />
            {errors.email && <p className="auth-field-error"><ion-icon name="warning" style={{ color: '#EF4444' }}></ion-icon> {errors.email}</p>}
          </div>

          {/* WhatsApp */}
          <div className="auth-field">
            <label className="auth-label">
              WhatsApp <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none' }}>(opsional)</span>
            </label>
            <div className="auth-input-group">
              <div className="auth-input-prefix">🇮🇩 +62</div>
              <input
                type="tel"
                className={`auth-input ${errors.wa ? 'auth-input-error' : ''}`}
                value={form.wa}
                onChange={e => update('wa', e.target.value.replace(/\D/g, ''))}
                placeholder="812xxxxxxxx"
                autoComplete="tel"
              />
            </div>
            {errors.wa && <p className="auth-field-error"><ion-icon name="warning" style={{ color: '#EF4444' }}></ion-icon> {errors.wa}</p>}
          </div>

          <div className="auth-divider"><span>Keamanan Akun</span></div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">
              Password <span className="required">*</span>
            </label>
            <div className="auth-password-wrap">
              <input
                type={showPw ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
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
            {errors.password && <p className="auth-field-error"><ion-icon name="warning" style={{ color: '#EF4444' }}></ion-icon> {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label">
              Konfirmasi Password <span className="required">*</span>
            </label>
            <input
              type={showPw ? 'text' : 'password'}
              className={`auth-input ${errors.confirmPw ? 'auth-input-error' : ''}`}
              value={form.confirmPw}
              onChange={e => update('confirmPw', e.target.value)}
              placeholder="Ulangi password"
              autoComplete="new-password"
            />
            {errors.confirmPw && <p className="auth-field-error"><ion-icon name="warning" style={{ color: '#EF4444' }}></ion-icon> {errors.confirmPw}</p>}
          </div>

          {/* Submit */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <><ion-icon name="sync-outline" class="animate-spin"></ion-icon> Membuat akun...</>
              ) : (
                <><ion-icon name="rocket-outline" style={{ marginRight: 6, transform: 'translateY(2px)' }}></ion-icon> Daftar Gratis Sekarang</>
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
              Daftar dengan Google
            </button>
          </div>

          {/* Features teaser */}
          <div className="auth-features">
            {[
              'Dashboard wedding',
              'Pilih tema & template',
              'Isi data pengantin',
              'Preview undangan',
            ].map(f => (
              <div key={f} className="auth-feature-item">
                <ion-icon name="checkmark-circle" style={{ color: '#10B981', marginRight: 4, transform: 'translateY(2px)' }}></ion-icon> {f}
              </div>
            ))}
          </div>

          {/* Terms */}
          <p className="auth-terms">
            Dengan mendaftar, kamu menyetujui{' '}
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link> dan{' '}
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link> kami.
          </p>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Sudah punya akun? <Link href="/auth/login">Masuk di sini</Link>
        </p>

      </div>
    </div>
  )
}
