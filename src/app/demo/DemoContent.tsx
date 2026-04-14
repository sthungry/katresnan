'use client'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  fetchPackages, fetchTemplatesByPackage, fetchCategories,
  type Package, type Template, type TemplateCategory
} from '@/lib/supabase'
<<<<<<< HEAD
import { useTheme } from '@/components/ThemeProvider'
import KatresnanLogo from '@/components/KatresnanLogo'

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
=======
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function TemplateSkeleton() {
  return (
<<<<<<< HEAD
    <div className="rounded-2xl overflow-hidden border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900 animate-pulse">
      <div className="aspect-[9/16] bg-sage-100 dark:bg-sage-800"/>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-sage-100 dark:bg-sage-800 rounded w-1/2"/>
        <div className="h-3 bg-sage-100 dark:bg-sage-800 rounded w-full"/>
        <div className="flex gap-1.5">
          <div className="flex-1 h-8 bg-sage-100 dark:bg-sage-800 rounded-lg"/>
          <div className="flex-1 h-8 bg-sage-200 dark:bg-sage-700 rounded-lg"/>
=======
    <div className="rounded-2xl overflow-hidden border-2 border-[#ffdce2] dark:border-[#2a4a38] bg-white dark:bg-[#1a2e1d] animate-pulse">
      <div className="aspect-[9/16] bg-[#ffdce2] dark:bg-[#2a4a38]"/>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-1/2"/>
        <div className="h-3 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-full"/>
        <div className="flex gap-1.5">
          <div className="flex-1 h-8 bg-[#ffdce2] dark:bg-[#2a4a38] rounded-lg"/>
          <div className="flex-1 h-8 bg-[#2a3028] dark:bg-[#0a1510] rounded-lg"/>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        </div>
      </div>
    </div>
  )
}

// ─── Template Card ──────────────────────────────────────────────────────────
function TemplateCard({
  tpl, selected, onSelect, limitReached,
}: {
  tpl: Template
  selected: boolean
  onSelect: () => void
  limitReached: boolean
}) {
  const disabled = !selected && limitReached
<<<<<<< HEAD

  return (
    <div className={`relative group rounded-2xl overflow-hidden border transition-all duration-200 bg-white dark:bg-sage-900 flex flex-col
      ${selected
        ? 'border-sage-800 dark:border-gold-500 shadow-xl ring-2 ring-sage-800/20 dark:ring-gold-500/20 scale-[1.02]'
        : disabled
          ? 'border-sage-100 dark:border-sage-800 opacity-40 cursor-not-allowed'
          : 'border-sage-100 dark:border-sage-800 hover:border-gold-300 dark:hover:border-gold-600 hover:shadow-lg cursor-pointer'
      }
    `}>
      <div className="relative aspect-[9/16] overflow-hidden bg-ivory-100 dark:bg-sage-950" onClick={() => !disabled && onSelect()}>
        <Image
          src={tpl.thumbnail_url}
=======
  const imgSrc = tpl.thumbnail_url?.startsWith('http') ? tpl.thumbnail_url : tpl.thumbnail_url

  return (
    <div className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-[#1a2e1d] flex flex-col
      ${selected
        ? 'border-[#03554e] dark:border-[#4ecdc4] shadow-xl ring-2 ring-[#03554e]/20 dark:ring-[#4ecdc4]/20 scale-[1.02]'
        : disabled
          ? 'border-[#eee] dark:border-[#1a2820] opacity-40 cursor-not-allowed'
          : 'border-[#ffdce2] dark:border-[#2a4a38] hover:border-[#f9b8c4] hover:shadow-lg cursor-pointer'
      }
    `}>
      <div className="relative aspect-[9/16] overflow-hidden bg-[#f5f5f5]" onClick={() => !disabled && onSelect()}>
        <Image
          src={imgSrc}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          alt={tpl.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
<<<<<<< HEAD
        <div className={`absolute inset-0 transition-opacity ${selected ? 'bg-sage-800/15 dark:bg-gold-500/10' : 'bg-black/0 group-hover:bg-black/5'}`}/>
        {selected && (
          <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-sage-800 dark:bg-gold-500 rounded-full flex items-center justify-center text-white dark:text-sage-950 shadow-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        )}
        {tpl.is_popular && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-gold-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            Populer
          </div>
        )}
        {tpl.category && (
          <div className="absolute bottom-2.5 left-2.5 bg-sage-900/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            {tpl.style_label || tpl.category.name}
=======
        <div className={`absolute inset-0 transition-opacity ${selected ? 'bg-[#03554e]/15' : 'bg-black/0 group-hover:bg-black/8'}`}/>
        {selected && (
          <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-[#03554e] dark:bg-[#4ecdc4] rounded-full flex items-center justify-center text-white dark:text-[#0f1a13] text-sm font-bold shadow-lg">✓</div>
        )}
        {tpl.is_popular && (
          <div className="absolute top-2.5 left-2.5 bg-[#e8879a] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow">⭐ Populer</div>
        )}
        {/* Category badge */}
        {tpl.category && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/50 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            {tpl.category.emoji} {tpl.style_label || tpl.category.name}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div>
<<<<<<< HEAD
          <p className="font-serif font-bold text-sm text-sage-800 dark:text-ivory-200">{tpl.name}</p>
          <p className="text-[10px] text-sage-500 dark:text-sage-400 leading-tight mt-0.5">{tpl.description}</p>
=======
          <p className="font-display font-bold text-sm text-[#1a2e1d] dark:text-[#e8f0e8]">{tpl.name}</p>
          <p className="text-[10px] text-[#8a9e8c] leading-tight mt-0.5">{tpl.description}</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => !disabled && onSelect()}
            disabled={disabled}
<<<<<<< HEAD
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
              selected
                ? 'bg-sage-800 dark:bg-gold-500 text-white dark:text-sage-950'
                : disabled
                  ? 'bg-sage-100 dark:bg-sage-800 text-sage-300 dark:text-sage-600 cursor-not-allowed'
                  : 'bg-ivory-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-700'
            }`}
          >
            {selected ? (
              <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Dipilih</>
            ) : disabled ? (
              <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Limit</>
            ) : '+ Pilih'}
=======
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
              selected
                ? 'bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13]'
                : disabled
                  ? 'bg-[#f0f0f0] dark:bg-[#2a3028] text-[#c0c0c0] cursor-not-allowed'
                  : 'bg-[#fffde8] dark:bg-[#1a3028] text-[#03554e] dark:text-[#4ecdc4] border border-[#ffdce2] dark:border-[#2a4a38] hover:bg-[#ffdce2]/50'
            }`}
          >
            {selected ? '✓ Dipilih' : disabled ? '🔒 Limit' : '+ Pilih'}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          </button>
          <a
            href={tpl.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
<<<<<<< HEAD
            className="flex-1 py-2 rounded-lg text-[10px] font-bold bg-sage-800 dark:bg-sage-700 text-white flex items-center justify-center gap-1 hover:bg-sage-700 dark:hover:bg-sage-600 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
=======
            className="flex-1 py-2 rounded-lg text-[10px] font-bold bg-[#1a2e1d] dark:bg-[#0a1510] text-white flex items-center justify-center gap-1 hover:bg-[#03554e] transition-colors"
          >
            👁 Preview
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
function DemoInner() {
<<<<<<< HEAD
  const { theme, toggle } = useTheme()
=======
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  const params   = useSearchParams()
  const router   = useRouter()
  const paketId  = params.get('paket') || 'silver'

  const [pkg,        setPkg]        = useState<Package | null>(null)
  const [templates,  setTemplates]  = useState<Template[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState<string[]>([])
  const [filterCat,  setFilterCat]  = useState('semua')
  const [showError,  setShowError]  = useState(false)

<<<<<<< HEAD
=======
  // Load data from Supabase
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  useEffect(() => {
    setLoading(true)
    setSelected([])
    Promise.all([
      fetchPackages(),
      fetchTemplatesByPackage(paketId),
      fetchCategories(),
    ]).then(([pkgs, tmpls, cats]) => {
      const found = pkgs.find(p => p.id === paketId) || pkgs[0]
      setPkg(found)
      setTemplates(tmpls)
<<<<<<< HEAD
=======
      // Only show categories that exist in fetched templates
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
      const usedCatIds = new Set(tmpls.map(t => t.category_id))
      setCategories(cats.filter(c => usedCatIds.has(c.id)))
      setLoading(false)
    })
  }, [paketId])

  const limit = pkg?.max_themes || 1
  const limitReached = selected.length >= limit

<<<<<<< HEAD
=======
  // Filter by category
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  const filtered = filterCat === 'semua'
    ? templates
    : templates.filter(t => t.category_id === filterCat)

<<<<<<< HEAD
  function toggle_(id: string) {
=======
  function toggle(id: string) {
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= limit) return prev
      return [...prev, id]
    })
    setShowError(false)
  }

  function proceed() {
    if (selected.length === 0) {
      setShowError(true)
      document.getElementById('template-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    router.push(`/checkout?paket=${paketId}&templates=${selected.join(',')}`)
  }

  const canProceed = selected.length > 0

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-ivory-100 dark:bg-[#0f1512] transition-colors duration-500">

      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-sage-100 dark:border-sage-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/#harga" className="flex items-center gap-1.5 text-sage-600 dark:text-sage-300 hover:text-sage-800 dark:hover:text-white text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              <span className="hidden sm:inline">Kembali</span>
            </Link>
          </div>

          {/* Package badge */}
          {pkg && (
            <div className="flex items-center gap-2 glass rounded-full px-4 py-1.5">
              <span className="font-serif font-bold text-sm text-sage-800 dark:text-ivory-200">Paket {pkg.name}</span>
              <span className="hidden sm:inline text-xs text-sage-500 dark:text-sage-400">— max {limit} tema</span>
              <span className="hidden sm:inline text-xs font-bold text-sage-700 dark:text-gold-400">
                {formatRp(pkg.price)}
=======
    <div className="min-h-screen bg-[#fffde8] dark:bg-[#0f1a13]">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#fffde8]/95 dark:bg-[#0f1a13]/95 backdrop-blur border-b border-[#ffdce2] dark:border-[#1a3028] px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link href="/#harga" className="flex items-center gap-1.5 text-[#03554e] dark:text-[#4ecdc4] hover:opacity-80 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          {/* Package badge */}
          {pkg && (
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-full px-4 py-1.5 shadow-sm">
              <span>{pkg.emoji}</span>
              <span className="font-bold text-sm text-[#1a2e1d] dark:text-[#e8f0e8]">Paket {pkg.name}</span>
              <span className="hidden sm:inline text-xs text-[#8a9e8c]">— max {limit} tema</span>
              <span className="hidden sm:inline text-xs font-bold text-[#03554e] dark:text-[#4ecdc4]">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.price)}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              </span>
            </div>
          )}

<<<<<<< HEAD
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
            </button>
            <button onClick={proceed}
              className={`flex items-center gap-1.5 font-semibold text-sm px-5 py-2 rounded-full transition-all ${
                canProceed
                  ? 'btn-primary'
                  : 'bg-sage-100 dark:bg-sage-800 text-sage-500 dark:text-sage-400 cursor-pointer hover:bg-sage-200 dark:hover:bg-sage-700'
              }`}>
              {canProceed ? 'Pesan' : 'Pilih Tema'}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d={canProceed ? "M17 8l4 4m0 0l-4 4m4-4H3" : "M19 14l-7 7m0 0l-7-7m7 7V3"}/>
              </svg>
            </button>
          </div>
=======
          <button onClick={proceed}
            className={`flex items-center gap-1.5 font-bold text-sm px-5 py-2 rounded-full transition-all ${
              canProceed
                ? 'bg-[#03554e] dark:bg-[#1a5c52] text-white hover:bg-[#023d38] shadow-md'
                : 'bg-[#ffdce2] dark:bg-[#2a3028] text-[#e8879a] dark:text-[#ffb3c1] cursor-pointer hover:bg-[#f9b8c4]'
            }`}>
            {canProceed ? 'Pesan →' : 'Pilih Tema ↓'}
          </button>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8" id="template-grid">

        {/* Title */}
        <div className="text-center mb-8">
<<<<<<< HEAD
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-sage-800 dark:text-ivory-200 mb-2">
            Pilih Template{' '}
            {pkg && <span className="gradient-text">Paket {pkg.name}</span>}
          </h1>
          <p className="text-sage-500 dark:text-sage-400 text-sm mb-4">
            Klik <strong className="text-sage-700 dark:text-sage-300">Preview</strong> untuk melihat demo live, lalu <strong className="text-sage-700 dark:text-sage-300">+ Pilih</strong> untuk memilih.
          </p>

          {pkg?.id === 'silver' && (
            <div className="inline-flex items-center gap-2 bg-gold-50 dark:bg-gold-900/20 border border-gold-200/60 dark:border-gold-700/40 text-gold-700 dark:text-gold-400 rounded-full px-4 py-2 text-xs font-semibold mb-3">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              Paket Silver menggunakan template undangan tanpa foto prewedding
=======
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-2">
            Pilih Template{' '}
            {pkg && <span className="gradient-text">Paket {pkg.name}</span>}
          </h1>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm mb-4">
            Klik <strong>👁 Preview</strong> untuk melihat demo live, lalu <strong>+ Pilih</strong> untuk memilih.
          </p>

          {pkg?.id === 'silver' && (
            <div className="inline-flex items-center gap-2 bg-[#fce4ec] dark:bg-[#3a1a20] border border-[#f9b8c4]/50 text-[#c2185b] dark:text-[#ffb3c1] rounded-full px-4 py-2 text-xs font-semibold mb-3">
              🌸 Paket Silver menggunakan template undangan tanpa foto prewedding
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            </div>
          )}

          {showError && (
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-5 py-3 text-sm font-semibold mb-3 animate-pulse">
<<<<<<< HEAD
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Pilih minimal 1 tema sebelum melanjutkan ke pembayaran!
=======
              ⚠️ Pilih minimal 1 tema sebelum melanjutkan ke pembayaran!
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            </div>
          )}

          {/* Limit indicator */}
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
            limitReached
<<<<<<< HEAD
              ? 'bg-gold-50 dark:bg-gold-900/20 border-gold-300/60 dark:border-gold-700/40 text-gold-600 dark:text-gold-400'
              : showError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-500'
                : 'bg-white dark:bg-sage-900 border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400'
          }`}>
            {limitReached ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            )}
            {selected.length} / {limit} tema dipilih
            {!limitReached && (
              <span className="text-sage-400 dark:text-sage-500 text-xs font-normal">({limit - selected.length} lagi)</span>
=======
              ? 'bg-[#fce4ec] dark:bg-[#3a1a20] border-[#e8879a]/40 text-[#e8879a]'
              : showError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-500'
                : 'bg-white dark:bg-[#1a2e1d] border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90]'
          }`}>
            {limitReached ? '🔒' : showError ? '⚠️' : '☑️'}
            {selected.length} / {limit} tema dipilih
            {!limitReached && (
              <span className="text-[#8a9e8c] text-xs font-normal">({limit - selected.length} lagi)</span>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Category filter */}
=======
        {/* Category filter — dari DB */}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            <button
              onClick={() => setFilterCat('semua')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterCat === 'semua'
<<<<<<< HEAD
                  ? 'bg-sage-800 dark:bg-sage-700 text-white'
                  : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 hover:border-gold-300'
=======
                  ? 'bg-[#03554e] text-white dark:bg-[#4ecdc4] dark:text-[#0f1a13]'
                  : 'bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90] hover:border-[#f9b8c4]'
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              }`}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterCat === cat.id
<<<<<<< HEAD
                    ? 'bg-sage-800 dark:bg-sage-700 text-white'
                    : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 hover:border-gold-300'
                }`}>
                {cat.name}
=======
                    ? 'bg-[#03554e] text-white dark:bg-[#4ecdc4] dark:text-[#0f1a13]'
                    : 'bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90] hover:border-[#f9b8c4]'
                }`}>
                {cat.emoji} {cat.name}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              </button>
            ))}
          </div>
        )}

        {/* Template grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-28">
          {loading
            ? [...Array(6)].map((_, i) => <TemplateSkeleton key={i}/>)
            : filtered.length === 0
              ? (
                <div className="col-span-full text-center py-16">
<<<<<<< HEAD
                  <svg className="w-10 h-10 mx-auto mb-3 text-sage-300 dark:text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <p className="text-sage-500 dark:text-sage-400">Tidak ada template di kategori ini.</p>
=======
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-[#8a9e8c]">Tidak ada template di kategori ini.</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                </div>
              )
              : filtered.map(tpl => (
                  <TemplateCard
                    key={tpl.id}
                    tpl={tpl}
                    selected={selected.includes(tpl.id)}
<<<<<<< HEAD
                    onSelect={() => toggle_(tpl.id)}
=======
                    onSelect={() => toggle(tpl.id)}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                    limitReached={limitReached && !selected.includes(tpl.id)}
                  />
                ))
          }
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {!canProceed && (
<<<<<<< HEAD
          <div className="bg-ivory-100/95 dark:bg-[#0f1512]/95 backdrop-blur border-t border-sage-100 dark:border-sage-800 px-4 py-3">
            <p className="text-center text-sm text-sage-500 dark:text-sage-400 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7l4-4 4 4"/><path d="M12 3v13"/><path d="M20 21H4"/></svg>
              Pilih template yang Anda suka, lalu lanjutkan ke pembayaran
=======
          <div className="bg-[#fffde8]/95 dark:bg-[#1a2e1d]/95 backdrop-blur border-t border-[#ffdce2] dark:border-[#2a4a38] px-4 py-3">
            <p className="text-center text-sm text-[#8a9e8c] dark:text-[#5a9e80]">
              👆 Pilih template yang kamu suka, lalu lanjutkan ke pembayaran
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            </p>
          </div>
        )}
        {canProceed && (
<<<<<<< HEAD
          <div className="glass border-t border-sage-100 dark:border-sage-800 px-4 py-4 shadow-2xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-sage-800 dark:text-ivory-200 truncate">
                  Paket {pkg?.name} — {selected.length} tema dipilih
                </p>
                <p className="text-xs text-sage-500 dark:text-sage-400 truncate">
=======
          <div className="bg-white/95 dark:bg-[#1a2e1d]/95 backdrop-blur border-t border-[#ffdce2] dark:border-[#2a4a38] px-4 py-4 shadow-2xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1a2e1d] dark:text-[#e8f0e8] truncate">
                  {pkg?.emoji} Paket {pkg?.name} — {selected.length} tema dipilih
                </p>
                <p className="text-xs text-[#6b8f72] dark:text-[#7aaa90] truncate">
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                  {selected.map(id => templates.find(t => t.id === id)?.name).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {pkg && (
                  <div className="text-right hidden sm:block">
<<<<<<< HEAD
                    <p className="text-xs text-sage-400">Total</p>
                    <p className="font-serif font-bold text-sage-800 dark:text-gold-400">
=======
                    <p className="text-xs text-[#8a9e8c]">Total</p>
                    <p className="font-display font-bold text-[#03554e] dark:text-[#4ecdc4]">
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                      {formatRp(pkg.price)}
                    </p>
                  </div>
                )}
                <button onClick={proceed}
<<<<<<< HEAD
                  className="btn-primary font-bold px-7 py-3 rounded-full text-sm whitespace-nowrap flex items-center gap-2">
                  Lanjut ke Pembayaran
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
=======
                  className="bg-[#03554e] dark:bg-[#1a5c52] hover:bg-[#023d38] text-white font-bold px-7 py-3 rounded-full transition-colors shadow-lg text-sm whitespace-nowrap">
                  Lanjut ke Pembayaran →
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DemoContent() {
  return (
    <Suspense fallback={
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 dark:bg-[#0f1512]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sage-200 dark:border-sage-700 border-t-sage-800 dark:border-t-sage-300 animate-spin mx-auto mb-3"/>
          <p className="text-sage-500 dark:text-sage-400 text-sm">Memuat template...</p>
=======
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <div className="text-4xl mb-3" style={{ animation: 'float 2s ease-in-out infinite' }}>🌸</div>
          <p className="text-[#6b8f72]">Memuat template...</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        </div>
      </div>
    }>
      <DemoInner />
    </Suspense>
  )
}