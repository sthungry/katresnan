'use client'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'
import Link from 'next/link'

// Logo SVG inline (logo-light.svg — putih untuk navbar)
function LogoLight({ height = 36 }: { height?: number }) {
  return (
    <img
      src="/logo_light.svg"
      alt="Katresnan"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}
// Logo gelap untuk mobile menu (bg putih)
function LogoDark({ height = 36 }: { height?: number }) {
  return (
    <img
      src="/logo_dark.svg"
      alt="Katresnan"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}

const navLeft  = [
  { label: 'Fitur',      href: '#fitur' },
  { label: 'Cara Pesan', href: '#cara-pesan' },
  { label: 'Template',   href: '/portfolio' },
]
const navRight = [
  { label: 'Harga',      href: '#harga' },
  { label: 'Testimoni',  href: '#testimoni' },
  { label: 'Cek Order',  href: '/order' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Close on desktop resize
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Saat di atas (belum scroll): bg putih, logo gelap
  // Saat scroll ke bawah: transparan, logo putih
  const atTop = !scrolled && !menuOpen

  return (
    <>
      <header
        ref={menuRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          transition: 'background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease',
          background: atTop
            ? '#ffffff'
            : menuOpen
              ? '#ffffff'
              : 'rgba(255,255,255,0)',
          boxShadow: atTop
            ? '0 1px 0 rgba(0,0,0,0.06)'
            : menuOpen
              ? '0 1px 0 rgba(0,0,0,0.06)'
              : 'none',
          backdropFilter: atTop || menuOpen ? 'none' : 'blur(0px)',
        }}
      >
        {/* ── Desktop: tiga kolom — nav kiri | logo tengah | nav kanan ── */}
        <div className="hidden md:grid max-w-6xl mx-auto px-6"
          style={{ gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 64 }}>

          {/* Nav kiri */}
          <nav className="flex items-center gap-7 justify-start">
            {navLeft.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium whitespace-nowrap transition-colors duration-200"
                style={{ color: atTop ? '#3a3a3a' : '#ffffff', opacity: atTop ? 1 : 0.9 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = atTop ? '1' : '0.9')}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Logo tengah */}
          <Link href="/" className="flex items-center justify-center px-8">
            {atTop
              ? <LogoDark  height={32} />
              : <LogoLight height={32} />
            }
          </Link>

          {/* Nav kanan */}
          <nav className="flex items-center gap-7 justify-end">
            {navRight.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium whitespace-nowrap transition-colors duration-200"
                style={{ color: atTop ? '#3a3a3a' : '#ffffff', opacity: atTop ? 1 : 0.9 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = atTop ? '1' : '0.9')}>
                {l.label}
              </a>
            ))}
            <a href="#harga"
              className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap"
              style={{
                background: atTop ? '#03554e' : 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: atTop ? '1.5px solid transparent' : '1.5px solid rgba(255,255,255,0.45)',
                backdropFilter: atTop ? 'none' : 'blur(8px)',
              }}>
              Pesan Sekarang
            </a>
          </nav>
        </div>

        {/* ── Mobile: logo di tengah, hamburger kanan ── */}
        <div className="md:hidden flex items-center justify-between px-4" style={{ height: 56 }}>
          {/* Hamburger kiri */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
            style={{ background: 'transparent' }}>
            <svg width="20" height="20" fill="none" stroke={atTop ? '#3a3a3a' : '#ffffff'} strokeWidth="2" viewBox="0 0 24 24"
              style={{ transition: 'stroke 0.3s' }}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>

          {/* Logo tengah */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            {atTop
              ? <LogoDark  height={28} />
              : <LogoLight height={28} />
            }
          </Link>

          {/* Dark mode kanan */}
          <button onClick={toggle} aria-label="Toggle dark mode"
            className="w-9 h-9 flex items-center justify-center rounded-full text-base"
            style={{ background: 'transparent' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className="md:hidden overflow-hidden"
          style={{
            maxHeight: menuOpen ? '100vh' : '0',
            opacity: menuOpen ? 1 : 0,
            transition: 'max-height 0.32s ease, opacity 0.22s ease',
          }}>
          <div style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 16px 24px' }}>
            <div className="flex flex-col gap-0.5 mb-4">
              {[...navLeft, ...navRight].map((l, i) => (
                <a key={l.label} href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: '#2a2a2a',
                    transitionDelay: menuOpen ? `${i * 25}ms` : '0ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {l.label}
                </a>
              ))}
            </div>
            <a href="#harga" onClick={() => setMenuOpen(false)}
              className="block w-full text-center text-sm font-bold text-white py-3.5 rounded-2xl transition-colors"
              style={{ background: '#03554e' }}>
              🌸 Pesan Sekarang
            </a>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
          onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}