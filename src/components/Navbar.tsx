'use client'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'
import Link from 'next/link'

<<<<<<< HEAD
function LogoLight({ height = 32 }: { height?: number }) {
  return (
    <img src="/logo_light.svg" alt="Katresnan" height={height}
      style={{ height, width: 'auto', display: 'block' }} />
  )
}
function LogoDark({ height = 32 }: { height?: number }) {
  return (
    <img src="/logo_dark.svg" alt="Katresnan" height={height}
      style={{ height, width: 'auto', display: 'block' }} />
  )
}

// SVG Icons
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

const navLinks = [
  { label: 'Fitur',      href: '#fitur' },
  { label: 'Cara Pesan', href: '#cara-pesan' },
  { label: 'Harga',      href: '#harga' },
  { label: 'Testimoni',  href: '#testimoni' },
  { label: 'Template',   href: '/portfolio' },
=======
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
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
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

<<<<<<< HEAD
=======
  // Close on outside click
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

<<<<<<< HEAD
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
=======
  // Close on desktop resize
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

<<<<<<< HEAD
=======
  // Lock scroll when menu open
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

<<<<<<< HEAD
=======
  // Saat di atas (belum scroll): bg putih, logo gelap
  // Saat scroll ke bawah: transparan, logo putih
  const atTop = !scrolled && !menuOpen

>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  return (
    <>
      <header
        ref={menuRef}
<<<<<<< HEAD
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-sm'
            : 'bg-transparent'
        }`}
      >
        {/* ── Desktop ── */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-8 items-center justify-between h-[72px]">
          {/* Logo kiri */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {scrolled
              ? (theme === 'dark' ? <LogoLight height={30} /> : <LogoDark height={30} />)
              : (theme === 'dark' ? <LogoLight height={30} /> : <LogoDark height={30} />)
            }
          </Link>

          {/* Nav tengah */}
          <nav className="flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="text-[13px] font-medium tracking-wide uppercase text-sage-700 dark:text-sage-300 hover:text-sage-900 dark:hover:text-white transition-colors duration-200">
=======
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
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                {l.label}
              </a>
            ))}
          </nav>

<<<<<<< HEAD
          {/* Kanan: dark mode + CTA */}
          <div className="flex items-center gap-4">
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <a href="#harga"
              className="btn-primary text-sm px-6 py-2.5">
              Pesan Sekarang
            </a>
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="lg:hidden flex items-center justify-between px-5 h-[60px]">
          {/* Logo kiri */}
          <Link href="/" className="flex items-center">
            {theme === 'dark' ? <LogoLight height={26} /> : <LogoDark height={26} />}
          </Link>

          <div className="flex items-center gap-2">
            {/* Dark mode */}
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu"
              className="w-9 h-9 flex items-center justify-center">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24" className="text-sage-700 dark:text-sage-300">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div className="lg:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: menuOpen ? '100vh' : '0', opacity: menuOpen ? 1 : 0 }}>
          <div className="bg-ivory-100 dark:bg-sage-950 border-t border-sage-100 dark:border-sage-800 px-5 py-4">
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((l, i) => (
                <a key={l.label} href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-sage-700 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors">
=======
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
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                  {l.label}
                </a>
              ))}
            </div>
            <a href="#harga" onClick={() => setMenuOpen(false)}
<<<<<<< HEAD
              className="block w-full text-center btn-primary text-sm py-3.5">
              Pesan Sekarang
=======
              className="block w-full text-center text-sm font-bold text-white py-3.5 rounded-2xl transition-colors"
              style={{ background: '#03554e' }}>
              🌸 Pesan Sekarang
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            </a>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm"
=======
        <div className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(2px)' }}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}