'use client'
import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  fetchPackages, fetchTemplatesByPackage, fetchCategories,
  type Package, type Template, type TemplateCategory
} from '@/lib/supabase'

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function TemplateSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border-2 border-[#ffdce2] dark:border-[#2a4a38] bg-white dark:bg-[#1a2e1d] animate-pulse">
      <div className="aspect-[9/16] bg-[#ffdce2] dark:bg-[#2a4a38]"/>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-1/2"/>
        <div className="h-3 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-full"/>
        <div className="flex gap-1.5">
          <div className="flex-1 h-8 bg-[#ffdce2] dark:bg-[#2a4a38] rounded-lg"/>
          <div className="flex-1 h-8 bg-[#2a3028] dark:bg-[#0a1510] rounded-lg"/>
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
          alt={tpl.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
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
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="font-display font-bold text-sm text-[#1a2e1d] dark:text-[#e8f0e8]">{tpl.name}</p>
          <p className="text-[10px] text-[#8a9e8c] leading-tight mt-0.5">{tpl.description}</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => !disabled && onSelect()}
            disabled={disabled}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
              selected
                ? 'bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13]'
                : disabled
                  ? 'bg-[#f0f0f0] dark:bg-[#2a3028] text-[#c0c0c0] cursor-not-allowed'
                  : 'bg-[#fffde8] dark:bg-[#1a3028] text-[#03554e] dark:text-[#4ecdc4] border border-[#ffdce2] dark:border-[#2a4a38] hover:bg-[#ffdce2]/50'
            }`}
          >
            {selected ? '✓ Dipilih' : disabled ? '🔒 Limit' : '+ Pilih'}
          </button>
          <a
            href={tpl.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 py-2 rounded-lg text-[10px] font-bold bg-[#1a2e1d] dark:bg-[#0a1510] text-white flex items-center justify-center gap-1 hover:bg-[#03554e] transition-colors"
          >
            👁 Preview
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
function DemoInner() {
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

  // Load data from Supabase
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
      // Only show categories that exist in fetched templates
      const usedCatIds = new Set(tmpls.map(t => t.category_id))
      setCategories(cats.filter(c => usedCatIds.has(c.id)))
      setLoading(false)
    })
  }, [paketId])

  const limit = pkg?.max_themes || 1
  const limitReached = selected.length >= limit

  // Filter by category
  const filtered = filterCat === 'semua'
    ? templates
    : templates.filter(t => t.category_id === filterCat)

  function toggle(id: string) {
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
              </span>
            </div>
          )}

          <button onClick={proceed}
            className={`flex items-center gap-1.5 font-bold text-sm px-5 py-2 rounded-full transition-all ${
              canProceed
                ? 'bg-[#03554e] dark:bg-[#1a5c52] text-white hover:bg-[#023d38] shadow-md'
                : 'bg-[#ffdce2] dark:bg-[#2a3028] text-[#e8879a] dark:text-[#ffb3c1] cursor-pointer hover:bg-[#f9b8c4]'
            }`}>
            {canProceed ? 'Pesan →' : 'Pilih Tema ↓'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8" id="template-grid">

        {/* Title */}
        <div className="text-center mb-8">
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
            </div>
          )}

          {showError && (
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-5 py-3 text-sm font-semibold mb-3 animate-pulse">
              ⚠️ Pilih minimal 1 tema sebelum melanjutkan ke pembayaran!
            </div>
          )}

          {/* Limit indicator */}
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
            limitReached
              ? 'bg-[#fce4ec] dark:bg-[#3a1a20] border-[#e8879a]/40 text-[#e8879a]'
              : showError
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-500'
                : 'bg-white dark:bg-[#1a2e1d] border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90]'
          }`}>
            {limitReached ? '🔒' : showError ? '⚠️' : '☑️'}
            {selected.length} / {limit} tema dipilih
            {!limitReached && (
              <span className="text-[#8a9e8c] text-xs font-normal">({limit - selected.length} lagi)</span>
            )}
          </div>
        </div>

        {/* Category filter — dari DB */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            <button
              onClick={() => setFilterCat('semua')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterCat === 'semua'
                  ? 'bg-[#03554e] text-white dark:bg-[#4ecdc4] dark:text-[#0f1a13]'
                  : 'bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90] hover:border-[#f9b8c4]'
              }`}
            >
              Semua
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterCat === cat.id
                    ? 'bg-[#03554e] text-white dark:bg-[#4ecdc4] dark:text-[#0f1a13]'
                    : 'bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90] hover:border-[#f9b8c4]'
                }`}>
                {cat.emoji} {cat.name}
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
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-[#8a9e8c]">Tidak ada template di kategori ini.</p>
                </div>
              )
              : filtered.map(tpl => (
                  <TemplateCard
                    key={tpl.id}
                    tpl={tpl}
                    selected={selected.includes(tpl.id)}
                    onSelect={() => toggle(tpl.id)}
                    limitReached={limitReached && !selected.includes(tpl.id)}
                  />
                ))
          }
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {!canProceed && (
          <div className="bg-[#fffde8]/95 dark:bg-[#1a2e1d]/95 backdrop-blur border-t border-[#ffdce2] dark:border-[#2a4a38] px-4 py-3">
            <p className="text-center text-sm text-[#8a9e8c] dark:text-[#5a9e80]">
              👆 Pilih template yang kamu suka, lalu lanjutkan ke pembayaran
            </p>
          </div>
        )}
        {canProceed && (
          <div className="bg-white/95 dark:bg-[#1a2e1d]/95 backdrop-blur border-t border-[#ffdce2] dark:border-[#2a4a38] px-4 py-4 shadow-2xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#1a2e1d] dark:text-[#e8f0e8] truncate">
                  {pkg?.emoji} Paket {pkg?.name} — {selected.length} tema dipilih
                </p>
                <p className="text-xs text-[#6b8f72] dark:text-[#7aaa90] truncate">
                  {selected.map(id => templates.find(t => t.id === id)?.name).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {pkg && (
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[#8a9e8c]">Total</p>
                    <p className="font-display font-bold text-[#03554e] dark:text-[#4ecdc4]">
                      {formatRp(pkg.price)}
                    </p>
                  </div>
                )}
                <button onClick={proceed}
                  className="bg-[#03554e] dark:bg-[#1a5c52] hover:bg-[#023d38] text-white font-bold px-7 py-3 rounded-full transition-colors shadow-lg text-sm whitespace-nowrap">
                  Lanjut ke Pembayaran →
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
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <div className="text-4xl mb-3" style={{ animation: 'float 2s ease-in-out infinite' }}>🌸</div>
          <p className="text-[#6b8f72]">Memuat template...</p>
        </div>
      </div>
    }>
      <DemoInner />
    </Suspense>
  )
}