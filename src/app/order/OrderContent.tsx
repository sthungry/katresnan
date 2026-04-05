'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import KatresnanLogo from '@/components/KatresnanLogo'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Order {
  id: string; nama: string; email: string; wa: string
  package_id: string; template_text_1: string; template_text_2: string
  metode_bayar: string; harga: number; kode_unik: number; total: number
  status: string; catatan: string; created_at: string; updated_at: string
}

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  label: string; emoji: string; color: string; bg: string; step: number; desc: string
}> = {
  pending: {
    label: 'Menunggu Pembayaran', emoji: '⏳', step: 1,
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    desc: 'Pesanan kamu sudah masuk. Silakan selesaikan pembayaran.',
  },
  menunggu_konfirmasi: {
    label: 'Verifikasi Pembayaran', emoji: '🔍', step: 2,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    desc: 'Pembayaran sedang kami verifikasi. Biasanya 1-3 jam kerja.',
  },
  diproses: {
    label: 'Sedang Diproses', emoji: '✏️', step: 3,
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    desc: 'Tim kami sedang mengerjakan undangan digitalmu.',
  },
  selesai: {
    label: 'Selesai', emoji: '🎉', step: 4,
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    desc: 'Undangan digitalmu sudah selesai! Cek WhatsApp atau email kamu.',
  },
  dibatalkan: {
    label: 'Dibatalkan', emoji: '❌', step: 0,
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    desc: 'Pesanan ini dibatalkan. Hubungi kami jika ada pertanyaan.',
  },
}

const STEPS = [
  { label: 'Pesanan Masuk',   step: 1 },
  { label: 'Verifikasi Bayar', step: 2 },
  { label: 'Diproses',        step: 3 },
  { label: 'Selesai',         step: 4 },
]

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

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
          className="w-full bg-white dark:bg-[#1a2e1d] border-2 border-[#ffdce2] dark:border-[#2a4a38] focus:border-[#03554e] dark:focus:border-[#4ecdc4] rounded-2xl px-5 py-4 pr-36 text-sm text-[#1a2e1d] dark:text-[#e8f0e8] outline-none transition-colors placeholder:text-[#c0c0c0] font-mono tracking-widest uppercase shadow-sm"
        />
        <button
          onClick={() => input && onSearch(input)}
          disabled={!input || loading}
          className="absolute right-2 top-2 bottom-2 bg-[#03554e] hover:bg-[#023d38] disabled:opacity-50 text-white font-bold px-5 rounded-xl transition-colors text-sm"
        >
          {loading ? '⏳' : 'Cek →'}
        </button>
      </div>
      <p className="text-xs text-center text-[#8a9e8c] mt-3">
        Order ID dikirim ke email kamu saat checkout · 8 karakter
      </p>
    </div>
  )
}

// ─── Order Card ──────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const cfg   = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const short = order.id?.slice(0, 8).toUpperCase() || '—'

  const PACKAGE_EMOJI: Record<string, string> = { silver: '🌸', gold: '💍', platinum: '👑' }
  const pkgEmoji = PACKAGE_EMOJI[order.package_id || ''] || '📦'

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 animate-fade-in">

      {/* Status Banner */}
      <div className={`rounded-3xl border-2 p-6 ${cfg.bg} ${cfg.borderColor}`}>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{cfg.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className={`font-display font-bold text-xl ${cfg.color}`}>{cfg.label}</p>
            <p className="text-sm text-[#6b8f72] dark:text-[#7aaa90] mt-1 leading-relaxed">{cfg.desc}</p>
          </div>
        </div>

        {/* Progress steps */}
        {order.status !== 'dibatalkan' && (
          <div className="mt-5 flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done    = cfg.step > s.step
              const active  = cfg.step === s.step
              
              return (
                <div key={s.step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                      done   ? 'bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13] border-[#03554e] dark:border-[#4ecdc4]'
                      : active ? `${cfg.bg} ${cfg.color} border-current`
                      : 'bg-white dark:bg-[#1a2e1d] text-[#c0c0c0] border-[#e8e8e8] dark:border-[#2a4a38]'
                    }`}>
                      {done ? '✓' : s.step}
                    </div>
                    <span className={`text-[9px] font-medium text-center leading-tight w-14 ${
                      active ? cfg.color : done ? 'text-[#03554e] dark:text-[#4ecdc4]' : 'text-[#c0c0c0]'
                    }`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${done ? 'bg-[#03554e] dark:bg-[#4ecdc4]' : 'bg-[#e8e8e8] dark:bg-[#2a4a38]'}`}/>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Order */}
      <div className="bg-white dark:bg-[#1a2e1d] rounded-3xl border-2 border-[#ffdce2] dark:border-[#2a4a38] overflow-hidden">
        <div className="bg-gradient-to-r from-[#03554e] to-[#057a71] px-6 py-4">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Detail Pesanan</p>
          <p className="text-white font-mono font-bold text-lg mt-0.5">#{short}</p>
        </div>
        <div className="p-5 space-y-3.5 text-sm">
          <Row label="Nama" value={order.nama}/>
          <Row label="Email" value={order.email}/>
          <Row label="WhatsApp" value={'+62 ' + order.wa}/>
          <div className="border-t border-[#ffdce2] dark:border-[#2a4a38] pt-3.5 space-y-3.5">
            <Row label="Paket" value={`${pkgEmoji} Paket ${(order.package_id || '').charAt(0).toUpperCase() + (order.package_id || '').slice(1)}`} bold/>
            <Row label="Template" value={[order.template_text_1, order.template_text_2].filter(Boolean).join(' + ') || '—'}/>
            <Row label="Metode Bayar" value={(order.metode_bayar || '').toUpperCase()}/>
          </div>
          <div className="border-t border-[#ffdce2] dark:border-[#2a4a38] pt-3.5 space-y-3.5">
            <Row label="Harga Paket" value={formatRp(order.harga)}/>
            {order.kode_unik > 0 && <Row label="Kode Unik" value={`+ ${formatRp(order.kode_unik)}`} accent/>}
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1a2e1d] dark:text-[#e8f0e8]">Total Bayar</span>
              <span className="font-display font-bold text-xl text-[#03554e] dark:text-[#4ecdc4]">{formatRp(order.total)}</span>
            </div>
          </div>
          {order.created_at && (
            <div className="border-t border-[#ffdce2] dark:border-[#2a4a38] pt-3.5">
              <Row label="Waktu Pesan" value={formatDate(order.created_at)}/>
            </div>
          )}
        </div>
      </div>

      {/* CTA sesuai status */}
      {order.status === 'pending' && (
        <Link href={`/checkout?paket=${order.package_id}`}
          className="block w-full bg-[#03554e] hover:bg-[#023d38] text-white font-bold py-4 rounded-2xl text-center transition-colors shadow-lg">
          ⚡ Lanjutkan Pembayaran
        </Link>
      )}
      {(order.status === 'menunggu_konfirmasi' || order.status === 'diproses') && (
        <a href={`https://wa.me/6285150000715?text=${encodeURIComponent('Halo Katresnan! Saya ingin cek status pesanan.\nOrder ID: #' + short + '\nNama: ' + order.nama)}`}
          target="_blank" rel="noopener noreferrer"
          className="block w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl text-center transition-colors shadow-lg">
          💬 Tanya Status via WhatsApp
        </a>
      )}
      {order.status === 'selesai' && (
        <div className="bg-[#fffde8] dark:bg-[#1a2e1d] border-2 border-[#ffdce2] dark:border-[#2a4a38] rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">💒</p>
          <p className="font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1">Undangan sudah aktif!</p>
          <p className="text-xs text-[#6b8f72] dark:text-[#7aaa90]">Link undangan sudah dikirim ke WhatsApp & email kamu.</p>
        </div>
      )}
      {order.status === 'dibatalkan' && (
        <Link href="/#harga"
          className="block w-full bg-[#e8879a] hover:bg-[#d4657a] text-white font-bold py-4 rounded-2xl text-center transition-colors">
          🔄 Pesan Ulang
        </Link>
      )}

      <p className="text-center text-xs text-[#8a9e8c] pt-2">
        Ada pertanyaan?{' '}
        <a href="https://wa.me/6285150000715" target="_blank" rel="noopener noreferrer"
          className="text-[#03554e] dark:text-[#4ecdc4] underline underline-offset-2 font-medium">
          Hubungi kami via WhatsApp
        </a>
      </p>
    </div>
  )
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[#8a9e8c] flex-shrink-0">{label}</span>
      <span className={`text-right truncate ${bold ? 'font-bold text-[#1a2e1d] dark:text-[#e8f0e8]' : accent ? 'text-orange-500 font-medium' : 'text-[#1a2e1d] dark:text-[#e8f0e8]'}`}>{value}</span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function OrderInner() {
  const params  = useSearchParams()
  const [input,   setInput]   = useState('')
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [searched,setSearched]= useState(false)

  // Auto-search kalau ada ?id= di URL
  useEffect(() => {
    const id = params.get('id')
    if (id) search(id)
  }, [])

  async function search(rawId: string) {
    // Bersihkan input — hapus #, spasi, ambil 8 karakter, uppercase
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

    // Gunakan RPC function yang sudah dibuat di Supabase
    const { data, error: err } = await supabase
      .rpc('search_order_by_short_id', { short_id: shortId })
      .single()

    if (err || !data) {
      setError('Order ID tidak ditemukan. Pastikan kode sudah benar (contoh: ABC12345).')
      setLoading(false)
      return
    }
    setOrder(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fffde8] dark:bg-[#0f1a13]">

      {/* Header */}
      <div className="bg-[#fffde8]/95 dark:bg-[#0f1a13]/95 backdrop-blur border-b border-[#ffdce2] dark:border-[#1a3028] px-4 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <KatresnanLogo variant="auto" height={28} />
          </Link>
          <span className="text-xs text-[#8a9e8c] bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-full px-3 py-1">
            📦 Cek Status Order
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#03554e] to-[#e8879a] text-3xl mb-5 shadow-lg">
            📦
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-3">
            Cek Status Pesanan
          </h1>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm max-w-sm mx-auto leading-relaxed">
            Masukkan <strong>8 karakter Order ID</strong> yang dikirim ke email kamu saat checkout.
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
              <div className="w-12 h-12 rounded-full border-4 border-[#ffdce2] dark:border-[#2a4a38] border-t-[#03554e] dark:border-t-[#4ecdc4] animate-spin"/>
              <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm">Mencari pesanan...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-6 text-center">
            <p className="text-4xl mb-3">🔍</p>
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
              { icon: '📋', title: 'Order Masuk',    desc: 'Pesanan tersimpan di sistem kami' },
              { icon: '✏️', title: 'Diproses',       desc: 'Tim kami mengerjakan undanganmu' },
              { icon: '🎉', title: 'Selesai & Aktif',desc: 'Link undangan siap disebarkan' },
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-2xl p-4 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-bold text-xs text-[#1a2e1d] dark:text-[#e8f0e8] mb-1">{item.title}</p>
                <p className="text-[10px] text-[#8a9e8c] leading-tight">{item.desc}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-[#6b8f72]">Memuat...</p>
        </div>
      </div>
    }>
      <OrderInner />
    </Suspense>
  )
}