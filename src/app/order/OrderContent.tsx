'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import KatresnanLogo from '@/components/KatresnanLogo'
import { useTheme } from '@/components/ThemeProvider'

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

// ─── Types ──────────────────────────────────────────────────────────────────
interface Order {
  id: string; nama: string; email: string; wa: string
  package_id: string; template_text_1: string; template_text_2: string
  metode_bayar: string; harga: number; kode_unik: number; total: number
  status: string; catatan: string; created_at: string; updated_at: string
}

// ─── Status Config ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  label: string; icon: JSX.Element; color: string; bg: string; step: number; desc: string
}> = {
  pending: {
    label: 'Menunggu Pembayaran', step: 1,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    desc: 'Pesanan kamu sudah masuk. Silakan selesaikan pembayaran.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  },
  menunggu_konfirmasi: {
    label: 'Verifikasi Pembayaran', step: 2,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    desc: 'Pembayaran sedang kami verifikasi. Biasanya 1-3 jam kerja.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  diproses: {
    label: 'Sedang Diproses', step: 3,
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    desc: 'Tim kami sedang mengerjakan undangan digitalmu.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  },
  selesai: {
    label: 'Selesai', step: 4,
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    desc: 'Undangan digitalmu sudah selesai! Cek WhatsApp atau email kamu.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>,
  },
  dibatalkan: {
    label: 'Dibatalkan', step: 0,
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    desc: 'Pesanan ini dibatalkan. Hubungi kami jika ada pertanyaan.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  },
}

const STEPS = [
  { label: 'Pesanan Masuk',   step: 1 },
  { label: 'Verifikasi Bayar', step: 2 },
  { label: 'Diproses',        step: 3 },
  { label: 'Selesai',         step: 4 },
]

const PACKAGE_ICONS: Record<string, { label: string; icon: JSX.Element }> = {
  silver: { label: 'Silver', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg> },
  gold: { label: 'Gold', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  platinum: { label: 'Platinum', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
}

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Search Form ────────────────────────────────────────────────────────────
function SearchForm({ onSearch, loading }: { onSearch: (id: string) => void; loading: boolean }) {
  const [input, setInput] = useState('')
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          value={input}
          onChange={e => setInput(e.target.value.trim().toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && input && onSearch(input)}
          placeholder="Masukkan Order ID — contoh: ABC12345"
          maxLength={8}
          className="w-full bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 focus:border-gold-400 dark:focus:border-gold-500 rounded-2xl px-5 py-4 pr-36 text-sm text-sage-800 dark:text-sage-200 outline-none transition-colors placeholder:text-sage-400 font-mono tracking-widest uppercase"
        />
        <button
          onClick={() => input && onSearch(input)}
          disabled={!input || loading}
          className="absolute right-2 top-2 bottom-2 bg-sage-800 dark:bg-sage-700 hover:bg-sage-700 dark:hover:bg-sage-600 disabled:opacity-50 text-white font-bold px-5 rounded-xl transition-colors text-sm"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" className="opacity-25"/><path d="M4 12a8 8 0 018-8" className="opacity-75"/></svg>
          ) : 'Cek'}
        </button>
      </div>
      <p className="text-xs text-center text-sage-400 dark:text-sage-500 mt-3">
        Order ID dikirim ke email kamu saat checkout · 8 karakter
      </p>
    </div>
  )
}

// ─── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const cfg   = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const short = order.id?.slice(0, 8).toUpperCase() || '—'
  const pkgInfo = PACKAGE_ICONS[order.package_id || ''] || PACKAGE_ICONS.silver

  return (
    <div className="w-full max-w-lg mx-auto space-y-4" style={{ opacity: 0, animation: 'fadeUp 0.5s ease forwards' }}>

      {/* Status Banner */}
      <div className={`rounded-2xl border p-6 ${cfg.bg} border-sage-200/50 dark:border-sage-700/50`}>
        <div className="flex items-start gap-4">
          <div className={cfg.color}>{cfg.icon}</div>
          <div className="flex-1 min-w-0">
            <p className={`font-serif font-bold text-xl ${cfg.color}`}>{cfg.label}</p>
            <p className="text-sm text-sage-500 dark:text-sage-400 mt-1 leading-relaxed">{cfg.desc}</p>
          </div>
        </div>

        {/* Progress steps */}
        {order.status !== 'dibatalkan' && (
          <div className="mt-5 flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done   = cfg.step > s.step
              const active = cfg.step === s.step
              return (
                <div key={s.step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                      done   ? 'bg-sage-800 dark:bg-sage-600 text-white border-sage-800 dark:border-sage-600'
                      : active ? `${cfg.bg} ${cfg.color} border-current`
                      : 'bg-white dark:bg-sage-900 text-sage-300 border-sage-200 dark:border-sage-700'
                    }`}>
                      {done ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : s.step}
                    </div>
                    <span className={`text-[9px] font-medium text-center leading-tight w-14 ${
                      active ? cfg.color : done ? 'text-sage-700 dark:text-sage-300' : 'text-sage-300 dark:text-sage-600'
                    }`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${done ? 'bg-sage-800 dark:bg-sage-600' : 'bg-sage-200 dark:bg-sage-700'}`}/>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Order */}
      <div className="bg-white dark:bg-sage-900 rounded-2xl border border-sage-100 dark:border-sage-800 overflow-hidden">
        <div className="bg-sage-800 dark:bg-sage-900 px-6 py-4 border-b border-sage-700">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Detail Pesanan</p>
          <p className="text-white font-mono font-bold text-lg mt-0.5">#{short}</p>
        </div>
        <div className="p-5 space-y-3.5 text-sm">
          <Row label="Nama" value={order.nama}/>
          <Row label="Email" value={order.email}/>
          <Row label="WhatsApp" value={'+62 ' + order.wa}/>
          <div className="border-t border-sage-100 dark:border-sage-800 pt-3.5 space-y-3.5">
            <Row label="Paket" value={`Paket ${(order.package_id || '').charAt(0).toUpperCase() + (order.package_id || '').slice(1)}`} bold/>
            <Row label="Template" value={[order.template_text_1, order.template_text_2].filter(Boolean).join(' + ') || '—'}/>
            <Row label="Metode Bayar" value={(order.metode_bayar || '').toUpperCase()}/>
          </div>
          <div className="border-t border-sage-100 dark:border-sage-800 pt-3.5 space-y-3.5">
            <Row label="Harga Paket" value={formatRp(order.harga)}/>
            {order.kode_unik > 0 && <Row label="Kode Unik" value={`+ ${formatRp(order.kode_unik)}`} accent/>}
            <div className="flex justify-between items-center">
              <span className="font-bold text-sage-800 dark:text-ivory-200">Total Bayar</span>
              <span className="font-serif font-bold text-xl text-sage-800 dark:text-gold-400">{formatRp(order.total)}</span>
            </div>
          </div>
          {order.created_at && (
            <div className="border-t border-sage-100 dark:border-sage-800 pt-3.5">
              <Row label="Waktu Pesan" value={formatDate(order.created_at)}/>
            </div>
          )}
        </div>
      </div>

      {/* CTA sesuai status */}
      {order.status === 'pending' && (
        <Link href={`/checkout?paket=${order.package_id}`}
          className="flex items-center justify-center gap-2 w-full bg-sage-800 hover:bg-sage-700 text-white font-bold py-4 rounded-2xl text-center transition-colors shadow-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Lanjutkan Pembayaran
        </Link>
      )}
      {(order.status === 'menunggu_konfirmasi' || order.status === 'diproses') && (
        <a href={`https://wa.me/6285150000715?text=${encodeURIComponent('Halo Katresnan! Saya ingin cek status pesanan.\nOrder ID: #' + short + '\nNama: ' + order.nama)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl text-center transition-colors shadow-lg">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
          Tanya Status via WhatsApp
        </a>
      )}
      {order.status === 'selesai' && (
        <div className="bg-ivory-100 dark:bg-sage-900/50 border border-sage-100 dark:border-sage-800 rounded-2xl p-5 text-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 mx-auto mb-2 text-gold-500">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p className="font-bold text-sage-800 dark:text-ivory-200 mb-1">Undangan sudah aktif!</p>
          <p className="text-xs text-sage-500 dark:text-sage-400">Link undangan sudah dikirim ke WhatsApp & email kamu.</p>
        </div>
      )}
      {order.status === 'dibatalkan' && (
        <Link href="/#harga"
          className="flex items-center justify-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl text-center transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Pesan Ulang
        </Link>
      )}

      <p className="text-center text-xs text-sage-400 dark:text-sage-500 pt-2">
        Ada pertanyaan?{' '}
        <a href="https://wa.me/6285150000715" target="_blank" rel="noopener noreferrer"
          className="text-sage-700 dark:text-sage-300 underline underline-offset-2 decoration-gold-300 dark:decoration-gold-600 font-medium hover:text-sage-900 dark:hover:text-white transition-colors">
          Hubungi kami via WhatsApp
        </a>
      </p>
    </div>
  )
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sage-400 dark:text-sage-500 flex-shrink-0">{label}</span>
      <span className={`text-right truncate ${bold ? 'font-bold text-sage-800 dark:text-ivory-200' : accent ? 'text-gold-600 dark:text-gold-400 font-medium' : 'text-sage-700 dark:text-sage-300'}`}>{value}</span>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────
function OrderInner() {
  const { theme, toggle } = useTheme()
  const params  = useSearchParams()
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [searched,setSearched]= useState(false)

  useEffect(() => {
    const id = params.get('id')
    if (id) search(id)
  }, [])

  async function search(rawId: string) {
    const shortId = rawId.replace(/^#/, '').replace(/\s/g, '').slice(0, 8).toUpperCase()
    if (shortId.length < 6) {
      setError('Order ID minimal 6 karakter.')
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)
    setSearched(true)

    const { supabase } = await import('@/lib/supabase')

    const { data, error: err } = await supabase
      .rpc('search_order_by_short_id', { short_id: shortId })
      .single()

    if (err || !data) {
      setError('Order ID tidak ditemukan. Pastikan kode sudah benar (contoh: ABC12345).')
      setLoading(false)
      return
    }
    setOrder(data as Order)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ivory-100 dark:bg-[#0f1512] transition-colors duration-500">

      {/* Header */}
      <div className="glass border-b border-sage-100 dark:border-sage-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {theme === 'dark' ? <KatresnanLogo variant="light" height={28}/> : <KatresnanLogo variant="dark" height={28}/>}
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full flex items-center justify-center text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors">
              {theme === 'dark' ? <SunIcon/> : <MoonIcon/>}
            </button>
            <span className="text-xs text-sage-500 dark:text-sage-400 bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-700 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Cek Status Order
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sage-100 to-gold-100 dark:from-sage-800 dark:to-sage-700 mb-5 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-sage-600 dark:text-sage-300">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-sage-800 dark:text-ivory-200 mb-3">
            Cek Status Pesanan
          </h1>
          <p className="text-sage-500 dark:text-sage-400 text-sm max-w-sm mx-auto leading-relaxed">
            Masukkan <strong className="text-sage-700 dark:text-sage-300">8 karakter Order ID</strong> yang dikirim ke email kamu saat checkout.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchForm onSearch={search} loading={loading}/>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-sage-200 dark:border-sage-700 border-t-sage-800 dark:border-t-sage-300 animate-spin"/>
              <p className="text-sage-500 dark:text-sage-400 text-sm">Mencari pesanan...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-red-300 dark:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p className="font-bold text-red-700 dark:text-red-300 mb-1">Order tidak ditemukan</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {!loading && order && <OrderCard order={order}/>}

        {/* Empty state */}
        {!loading && !order && !error && !searched && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>, title: 'Order Masuk', desc: 'Pesanan tersimpan di sistem kami' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>, title: 'Diproses',    desc: 'Tim kami mengerjakan undanganmu' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>, title: 'Selesai & Aktif', desc: 'Link undangan siap disebarkan' },
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-sage-900 border border-sage-100 dark:border-sage-800 rounded-2xl p-4 text-center">
                <div className="text-sage-400 dark:text-sage-500 flex justify-center mb-2">{item.icon}</div>
                <p className="font-serif font-bold text-xs text-sage-800 dark:text-ivory-200 mb-1">{item.title}</p>
                <p className="text-[10px] text-sage-400 dark:text-sage-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrderContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-ivory-100 dark:bg-[#0f1512]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-sage-200 dark:border-sage-700 border-t-sage-800 dark:border-t-sage-300 animate-spin mx-auto mb-3"/>
          <p className="text-sage-500 dark:text-sage-400 text-sm">Memuat...</p>
        </div>
      </div>
    }>
      <OrderInner />
    </Suspense>
  )
}