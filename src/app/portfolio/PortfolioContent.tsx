'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAllPageData } from '@/lib/supabase'
import KatresnanLogo from '@/components/KatresnanLogo'
import { useTheme } from '@/components/ThemeProvider'
import type { Template, TemplateCategory } from '@/lib/supabase'

// ─── Icons ──────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

// Package tier icons
const PACKAGE_ICONS: Record<string, { label: string; color: string; icon: JSX.Element }> = {
  silver: {
    label: 'Silver', color: 'bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>,
  },
  gold: {
    label: 'Gold', color: 'bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  platinum: {
    label: 'Platinum', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
}

// ─── Template Card ──────────────────────────────────────────────────────────
function TemplateCard({ tpl, index }: { tpl: Template & { package_ids?: string[] }; index: number }) {
  const [imgErr, setImgErr]   = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const pkgIds: string[] = (tpl as any).package_ids || []

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`,
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-sage-900 border border-sage-100 dark:border-sage-800 hover:border-gold-300 dark:hover:border-gold-600/40 transition-all duration-300 hover:shadow-xl hover:shadow-sage-800/10 dark:hover:shadow-black/20 hover:-translate-y-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[9/16] overflow-hidden bg-ivory-100 dark:bg-sage-950">
          {!imgErr ? (
            <Image
              src={tpl.thumbnail_url}
              alt={tpl.name}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sage-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/>
              </svg>
              <span className="text-xs">{tpl.name}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-sage-900/90 via-sage-900/20 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}/>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {tpl.is_popular && (
              <span className="flex items-center gap-1 bg-gold-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                Populer
              </span>
            )}
            {!tpl.has_photo && (
              <span className="bg-sage-800/60 text-white/80 text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                Tanpa foto
              </span>
            )}
          </div>

          {/* Category pill */}
          {tpl.category && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-sage-900/60 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {tpl.style_label || tpl.category?.name}
              </span>
            </div>
          )}

          {/* Hover: Preview button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <a
              href={tpl.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="bg-white text-sage-800 font-semibold px-5 py-2.5 rounded-full text-sm shadow-xl hover:bg-ivory-100 transition-colors flex items-center gap-2"
            >
              <EyeIcon /> Lihat Demo
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="mb-2">
            <p className="font-serif font-bold text-sm text-sage-800 dark:text-ivory-200 truncate">{tpl.name}</p>
            <p className="text-[10px] text-sage-500 dark:text-sage-400 mt-0.5 line-clamp-2 leading-relaxed">{tpl.description}</p>
          </div>
          {/* Package badges */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {pkgIds.map(id => {
              const p = PACKAGE_ICONS[id] || PACKAGE_ICONS.silver
              return (
                <span key={id} className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${p.color}`}>
                  {p.icon} {p.label}
                </span>
              )
            })}
          </div>
          {/* CTA */}
          <Link
            href={`/demo?paket=${pkgIds[0] || 'silver'}`}
            className="w-full block text-center py-2 rounded-xl text-xs font-semibold bg-sage-800 dark:bg-sage-700 text-white hover:bg-sage-700 dark:hover:bg-sage-600 transition-colors"
          >
            Pilih Template Ini
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function PortfolioContent() {
  const { theme, toggle } = useTheme()
  const [templates,   setTemplates]   = useState<any[]>([])
  const [categories,  setCategories]  = useState<TemplateCategory[]>([])
  const [loading,     setLoading]     = useState(true)
  const [filterPkg,   setFilterPkg]   = useState<string>('semua')
  const [filterCat,   setFilterCat]   = useState<string>('semua')
  const [search,      setSearch]      = useState('')

  useEffect(() => {
    fetchAllPageData().then(({ templates: tmpls, categories: cats }) => {
      setTemplates(tmpls)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  // Filter
  const filtered = templates.filter(t => {
    const pkgIds: string[] = (t as any).package_ids || []
    const matchPkg = filterPkg === 'semua' || pkgIds.includes(filterPkg)
    const matchCat = filterCat === 'semua' || t.category_id === filterCat
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || (t.style_label || '').toLowerCase().includes(q) || (t.category?.name || '').toLowerCase().includes(q)
    return matchPkg && matchCat && matchSearch
  })

  const catCounts = categories.reduce((acc, cat) => {
    acc[cat.id] = templates.filter(t => {
      const pkgIds: string[] = (t as any).package_ids || []
      const matchPkg = filterPkg === 'semua' || pkgIds.includes(filterPkg)
      return t.category_id === cat.id && matchPkg
    }).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-[#0f1512] transition-colors duration-500">

      {/* ── Navbar ── */}
      <div className="sticky top-0 z-40 glass border-b border-sage-100 dark:border-sage-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {theme === 'dark' ? <KatresnanLogo variant="light" height={28}/> : <KatresnanLogo variant="dark" height={28}/>}
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
            </button>
            <Link href="/#harga" className="text-xs px-4 py-2 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-300 rounded-full hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors">
              Lihat Harga
            </Link>
            <Link href="/demo?paket=gold" className="text-xs px-4 py-2 btn-primary rounded-full font-bold">
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gold-200/20 dark:bg-gold-500/3 rounded-full blur-[100px]"/>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-sage-200/30 dark:bg-sage-500/3 rounded-full blur-[100px]"/>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-sage-600 dark:text-sage-400 font-medium mb-6">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
            {loading ? '...' : templates.length} template tersedia
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-sage-800 dark:text-ivory-200 mb-4 leading-tight">
            Temukan Template<br/>
            <span className="gradient-text">Impian Anda</span>
          </h1>
          <p className="text-sage-500 dark:text-sage-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Koleksi template undangan digital premium. Klik <strong className="text-sage-700 dark:text-sage-200">Lihat Demo</strong> untuk preview langsung.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari template, gaya, kategori..."
              className="w-full bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 focus:border-gold-400 dark:focus:border-gold-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-sage-800 dark:text-sage-200 outline-none transition-colors placeholder:text-sage-400 dark:placeholder:text-sage-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* ── Filter Paket ── */}
        <div className="flex gap-2 justify-start sm:justify-center mb-6 flex-wrap overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {[
            { id: 'semua',    label: 'Semua Template', count: templates.length },
            { id: 'silver',   label: 'Silver',         count: templates.filter(t => ((t as any).package_ids || []).includes('silver')).length },
            { id: 'gold',     label: 'Gold',            count: templates.filter(t => ((t as any).package_ids || []).includes('gold')).length },
            { id: 'platinum', label: 'Platinum',        count: templates.filter(t => ((t as any).package_ids || []).includes('platinum')).length },
          ].map(f => (
            <button key={f.id} onClick={() => { setFilterPkg(f.id); setFilterCat('semua') }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterPkg === f.id
                  ? 'bg-sage-800 dark:bg-sage-700 text-white shadow-lg shadow-sage-800/20'
                  : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 hover:border-gold-300 dark:hover:border-gold-600'
              }`}>
              <span>{f.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterPkg === f.id ? 'bg-white/20' : 'bg-sage-100 dark:bg-sage-800'}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* ── Filter Kategori ── */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-start sm:justify-center mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <button onClick={() => setFilterCat('semua')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterCat === 'semua'
                  ? 'bg-gold-500 text-white'
                  : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-500 dark:text-sage-400 hover:border-gold-300'
              }`}>
              Semua Gaya
            </button>
            {categories.filter(c => catCounts[c.id] > 0).map(cat => (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterCat === cat.id
                    ? 'bg-gold-500 text-white'
                    : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-500 dark:text-sage-400 hover:border-gold-300'
                }`}>
                {cat.name} ({catCounts[cat.id]})
              </button>
            ))}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900 animate-pulse">
                <div className="aspect-[9/16] bg-sage-100 dark:bg-sage-800"/>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-sage-100 dark:bg-sage-800 rounded w-2/3"/>
                  <div className="h-3 bg-sage-100 dark:bg-sage-800 rounded w-full"/>
                  <div className="h-8 bg-sage-100 dark:bg-sage-800 rounded-xl mt-3"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-12 h-12 mx-auto mb-4 text-sage-300 dark:text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="text-sage-600 dark:text-sage-400 font-medium text-lg">Tidak ada template ditemukan</p>
            <p className="text-sage-400 dark:text-sage-500 text-sm mt-2 mb-6">Coba filter atau pencarian lain</p>
            <button onClick={() => { setFilterPkg('semua'); setFilterCat('semua'); setSearch('') }}
              className="px-6 py-2.5 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 rounded-full text-sm hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors">
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <p className="text-sage-400 dark:text-sage-500 text-xs text-center mb-6">{filtered.length} template ditampilkan</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((tpl, i) => (
                <TemplateCard key={tpl.id} tpl={tpl} index={i}/>
              ))}
            </div>
          </>
        )}

        {/* ── CTA Bottom ── */}
        {!loading && filtered.length > 0 && (
          <div className="mt-16 text-center glass border border-sage-100 dark:border-sage-800 rounded-3xl p-10">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gold-100 dark:bg-sage-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-gold-500">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="font-serif font-bold text-2xl text-sage-800 dark:text-ivory-200 mb-3">Sudah menemukan yang cocok?</h2>
            <p className="text-sage-500 dark:text-sage-400 text-sm mb-6 max-w-sm mx-auto">
              Pilih paket, pilih template, dan undangan digitalmu siap dalam 1 hari kerja.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/#harga"
                className="px-6 py-3 border border-sage-300 dark:border-sage-600 text-sage-700 dark:text-sage-300 rounded-full font-semibold text-sm hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors">
                Lihat Harga
              </Link>
              <Link href="/demo?paket=gold" className="btn-primary px-6 py-3 rounded-full font-semibold text-sm">
                Pesan Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}