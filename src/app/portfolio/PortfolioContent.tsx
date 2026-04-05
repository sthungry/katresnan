'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAllPageData, filterTemplatesByPackage } from '@/lib/supabase'
import KatresnanLogo from '@/components/KatresnanLogo'
import type { Template, TemplateCategory } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
type FilterType = 'semua' | 'silver' | 'gold' | string

// ─── Template Card ────────────────────────────────────────────────────────────
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
  const isGoldPlus = tpl.has_photo
  const packageBadges = pkgIds.map(id => ({
    silver:   { label: 'Silver',   color: 'bg-slate-700 text-slate-200',  emoji: '🌸' },
    gold:     { label: 'Gold',     color: 'bg-amber-800/60 text-amber-200', emoji: '💍' },
    platinum: { label: 'Platinum', color: 'bg-purple-800/60 text-purple-200', emoji: '👑' },
  }[id] || { label: id, color: 'bg-gray-700 text-gray-200', emoji: '📦' }))

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
        className="relative rounded-3xl overflow-hidden cursor-pointer bg-[#111d17] border-2 border-[#1a3028] hover:border-[#4ecdc4]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#03554e]/20 hover:-translate-y-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[9/16] overflow-hidden bg-[#0f1a13]">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#3a5a48]">
              <span className="text-5xl">{tpl.category?.emoji || '🎨'}</span>
              <span className="text-xs">{tpl.name}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}/>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {tpl.is_popular && (
              <span className="bg-[#e8879a] text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                ⭐ Populer
              </span>
            )}
            {!isGoldPlus && (
              <span className="bg-black/60 text-white/80 text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                🚫 Tanpa foto
              </span>
            )}
          </div>

          {/* Category pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="bg-black/60 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {tpl.category?.emoji} {tpl.style_label || tpl.category?.name}
            </span>
          </div>

          {/* Hover: Preview button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <a
              href={tpl.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="bg-white text-[#03554e] font-bold px-6 py-2.5 rounded-full text-sm shadow-xl hover:bg-[#ffdce2] transition-colors flex items-center gap-2"
            >
              👁 Lihat Demo
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-[#e8f0e8] truncate">{tpl.name}</p>
              <p className="text-[10px] text-[#5a9e80] mt-0.5 line-clamp-2 leading-relaxed">{tpl.description}</p>
            </div>
          </div>
          {/* Package badges */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {packageBadges.map((b, i) => (
              <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${b.color}`}>
                {b.emoji} {b.label}
              </span>
            ))}
          </div>
          {/* CTA */}
          <Link
            href={`/demo?paket=${pkgIds[0] || 'silver'}`}
            className="mt-3 w-full block text-center py-2 rounded-xl text-xs font-bold bg-[#03554e]/20 border border-[#03554e]/40 text-[#4ecdc4] hover:bg-[#03554e]/40 transition-colors truncate"
          >
            Pilih Template Ini →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PortfolioContent() {
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

  // Count per category (filtered by package)
  const catCounts = categories.reduce((acc, cat) => {
    acc[cat.id] = templates.filter(t => {
      const pkgIds: string[] = (t as any).package_ids || []
      const matchPkg = filterPkg === 'semua' || pkgIds.includes(filterPkg)
      return t.category_id === cat.id && matchPkg
    }).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-[#0f1a13]">

      {/* ── Navbar ── */}
      <div className="sticky top-0 z-40 bg-[#0f1a13]/95 backdrop-blur border-b border-[#1a3028] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <KatresnanLogo variant="light" height={28} />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/#harga" className="text-xs px-4 py-2 bg-[#1a2e1d] border border-[#2a4a38] text-[#7aaa90] rounded-full hover:border-[#4ecdc4] transition-colors">
              Lihat Harga
            </Link>
            <Link href="/demo?paket=gold" className="text-xs px-4 py-2 bg-[#03554e] text-white rounded-full font-bold hover:bg-[#04665e] transition-colors">
              Pesan Sekarang →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden px-4 py-20 text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#03554e]/10 rounded-full blur-3xl"/>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#e8879a]/10 rounded-full blur-3xl"/>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#1a2e1d] border border-[#2a4a38] rounded-full px-4 py-2 text-xs text-[#7aaa90] font-medium mb-6">
            ✨ {loading ? '...' : templates.length} template tersedia
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-[#e8f0e8] mb-4 leading-tight">
            Temukan Template<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ecdc4] to-[#e8879a]">
              Impian Kamu
            </span>
          </h1>
          <p className="text-[#7aaa90] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Koleksi template undangan digital premium. Klik <strong className="text-[#e8f0e8]">👁 Lihat Demo</strong> untuk preview langsung.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a5a48]">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari template, gaya, kategori..."
              className="w-full bg-[#1a2e1d] border-2 border-[#2a4a38] focus:border-[#4ecdc4] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#e8f0e8] outline-none transition-colors placeholder:text-[#3a5a48]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* ── Filter Paket ── */}
        <div className="flex gap-2 justify-start sm:justify-center mb-6 flex-wrap overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {[
            { id: 'semua',    label: 'Semua Template',    emoji: '🎨', count: templates.length },
            { id: 'silver',   label: 'Silver (tanpa foto)',emoji: '🌸', count: templates.filter(t => ((t as any).package_ids || []).includes('silver')).length },
            { id: 'gold',     label: 'Gold',               emoji: '💍', count: templates.filter(t => ((t as any).package_ids || []).includes('gold')).length },
            { id: 'platinum', label: 'Platinum',           emoji: '👑', count: templates.filter(t => ((t as any).package_ids || []).includes('platinum')).length },
          ].map(f => (
            <button key={f.id} onClick={() => { setFilterPkg(f.id); setFilterCat('semua') }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterPkg === f.id
                  ? 'bg-[#03554e] text-white shadow-lg shadow-[#03554e]/30'
                  : 'bg-[#1a2e1d] border border-[#2a4a38] text-[#7aaa90] hover:border-[#4ecdc4]'
              }`}>
              <span>{f.emoji}</span>
              <span className="hidden sm:inline">{f.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterPkg === f.id ? 'bg-white/20' : 'bg-[#2a4a38]'}`}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* ── Filter Kategori ── */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap justify-start sm:justify-center mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <button onClick={() => setFilterCat('semua')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterCat === 'semua'
                  ? 'bg-[#e8879a] text-white'
                  : 'bg-[#1a2e1d] border border-[#2a4a38] text-[#5a9e80] hover:border-[#e8879a]/50'
              }`}>
              Semua Gaya
            </button>
            {categories.filter(c => catCounts[c.id] > 0).map(cat => (
              <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterCat === cat.id
                    ? 'bg-[#e8879a] text-white'
                    : 'bg-[#1a2e1d] border border-[#2a4a38] text-[#5a9e80] hover:border-[#e8879a]/50'
                }`}>
                {cat.emoji} {cat.name} ({catCounts[cat.id]})
              </button>
            ))}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border-2 border-[#1a3028] bg-[#111d17] animate-pulse">
                <div className="aspect-[9/16] bg-[#1a2e1d]"/>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#1a2e1d] rounded w-2/3"/>
                  <div className="h-3 bg-[#1a2e1d] rounded w-full"/>
                  <div className="h-8 bg-[#1a2e1d] rounded-xl mt-3"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#5a9e80] font-medium text-lg">Tidak ada template ditemukan</p>
            <p className="text-[#3a5a48] text-sm mt-2 mb-6">Coba filter atau pencarian lain</p>
            <button onClick={() => { setFilterPkg('semua'); setFilterCat('semua'); setSearch('') }}
              className="px-6 py-2.5 bg-[#1a2e1d] border border-[#2a4a38] text-[#7aaa90] rounded-full text-sm hover:border-[#4ecdc4] transition-colors">
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#3a5a48] text-xs text-center mb-6">{filtered.length} template ditampilkan</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((tpl, i) => (
                <TemplateCard key={tpl.id} tpl={tpl} index={i}/>
              ))}
            </div>
          </>
        )}

        {/* ── CTA Bottom ── */}
        {!loading && filtered.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-br from-[#03554e]/30 to-[#1a2e1d] border border-[#2a4a38] rounded-3xl p-10">
            <p className="text-4xl mb-4">💒</p>
            <h2 className="font-display font-bold text-2xl text-[#e8f0e8] mb-3">Sudah menemukan yang cocok?</h2>
            <p className="text-[#7aaa90] text-sm mb-6 max-w-sm mx-auto">
              Pilih paket, pilih template, dan undangan digitalmu siap dalam 1 hari kerja.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/#harga"
                className="px-6 py-3 border-2 border-[#4ecdc4] text-[#4ecdc4] rounded-full font-bold text-sm hover:bg-[#4ecdc4]/10 transition-colors">
                Lihat Harga
              </Link>
              <Link href="/demo?paket=gold"
                className="px-6 py-3 bg-[#03554e] hover:bg-[#04665e] text-white rounded-full font-bold text-sm transition-colors shadow-lg">
                Pesan Sekarang →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}