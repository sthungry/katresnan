'use client'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'
import Link from 'next/link'

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        ref={menuRef}
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
                {l.label}
              </a>
            ))}
          </nav>

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
                  {l.label}
                </a>
              ))}
            </div>
            <a href="#harga" onClick={() => setMenuOpen(false)}
              className="block w-full text-center btn-primary text-sm py-3.5">
              Pesan Sekarang
            </a>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)} />
      )}
    </>
  )
}