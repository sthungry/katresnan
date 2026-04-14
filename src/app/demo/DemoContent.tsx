'use client'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  fetchPackages, fetchTemplatesByPackage, fetchCategories,
  type Package, type Template, type TemplateCategory
} from '@/lib/supabase'
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

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function TemplateSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900 animate-pulse">
      <div className="aspect-[9/16] bg-sage-100 dark:bg-sage-800"/>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-sage-100 dark:bg-sage-800 rounded w-1/2"/>
        <div className="h-3 bg-sage-100 dark:bg-sage-800 rounded w-full"/>
        <div className="flex gap-1.5">
          <div className="flex-1 h-8 bg-sage-100 dark:bg-sage-800 rounded-lg"/>
          <div className="flex-1 h-8 bg-sage-200 dark:bg-sage-700 rounded-lg"/>
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
          alt={tpl.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
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
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="font-serif font-bold text-sm text-sage-800 dark:text-ivory-200">{tpl.name}</p>
          <p className="text-[10px] text-sage-500 dark:text-sage-400 leading-tight mt-0.5">{tpl.description}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => !disabled && onSelect()}
            disabled={disabled}
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
          </button>
          <a
            href={tpl.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 py-2 rounded-lg text-[10px] font-bold bg-sage-800 dark:bg-sage-700 text-white flex items-center justify-center gap-1 hover:bg-sage-700 dark:hover:bg-sage-600 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
function DemoInner() {
  const { theme, toggle } = useTheme()
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
      const usedCatIds = new Set(tmpls.map(t => t.category_id))
      setCategories(cats.filter(c => usedCatIds.has(c.id)))
      setLoading(false)
    })
  }, [paketId])

  const limit = pkg?.max_themes || 1
  const limitReached = selected.length >= limit

  const filtered = filterCat === 'semua'
    ? templates
    : templates.filter(t => t.category_id === filterCat)

  function toggle_(id: string) {
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
              </span>
            </div>
          )}

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
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8" id="template-grid">

        {/* Title */}
        <div className="text-center mb-8">
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
            </div>
          )}

          {showError && (
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-5 py-3 text-sm font-semibold mb-3 animate-pulse">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Pilih minimal 1 tema sebelum melanjutkan ke pembayaran!
            </div>
          )}

          {/* Limit indicator */}
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
            limitReached
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
            )}
          </div>
        </div>

        {/* Category filter */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            <button
              onClick={() => setFilterCat('semua')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterCat === 'semua'
                  ? 'bg-sage-800 dark:bg-sage-700 text-white'
                  : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 hover:border-gold-300'
              }`}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterCat === cat.id
                    ? 'bg-sage-800 dark:bg-sage-700 text-white'
                    : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 text-sage-600 dark:text-sage-400 hover:border-gold-300'
                }`}>
                {cat.name}
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
                  <svg className="w-10 h-10 mx-auto mb-3 text-sage-300 dark:text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <p className="text-sage-500 dark:text-sage-400">Tidak ada template di kategori ini.</p>
                </div>
              )
              : filtered.map(tpl => (
                  <TemplateCard
                    key={tpl.id}
                    tpl={tpl}
                    selected={selected.includes(tpl.id)}
                    onSelect={() => toggle_(tpl.id)}
                    limitReached={limitReached && !selected.includes(tpl.id)}
                  />
                ))
          }
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {!canProceed && (
          <div className="bg-ivory-100/95 dark:bg-[#0f1512]/95 backdrop-blur border-t border-sage-100 dark:border-sage-800 px-4 py-3">
            <p className="text-center text-sm text-sage-500 dark:text-sage-400 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 7l4-4 4 4"/><path d="M12 3v13"/><path d="M20 21H4"/></svg>
              Pilih template yang Anda suka, lalu lanjutkan ke pembayaran
            </p>
          </div>
        )}
        {canProceed && (
          <div className="glass border-t border-sage-100 dark:border-sage-800 px-4 py-4 shadow-2xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-sage-800 dark:text-ivory-200 truncate">
                  Paket {pkg?.name} — {selected.length} tema dipilih
                </p>
                <p className="text-xs text-sage-500 dark:text-sage-400 truncate">
                  {selected.map(id => templates.find(t => t.id === id)?.name).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {pkg && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-sage-400">Total</p>
                    <p className="font-serif font-bold text-sage-800 dark:text-gold-400">
                      {formatRp(pkg.price)}
                    </p>
                  </div>
                )}
                <button onClick={proceed}
                  className="btn-primary font-bold px-7 py-3 rounded-full text-sm whitespace-nowrap flex items-center gap-2">
                  Lanjut ke Pembayaran
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
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
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 dark:bg-[#0f1512]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sage-200 dark:border-sage-700 border-t-sage-800 dark:border-t-sage-300 animate-spin mx-auto mb-3"/>
          <p className="text-sage-500 dark:text-sage-400 text-sm">Memuat template...</p>
        </div>
      </div>
    }>
      <DemoInner />
    </Suspense>
  )
}