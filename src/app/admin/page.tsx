'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { OrderStatus } from '@/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Order {
  id: string; nama: string; email: string; wa: string
  package_id: string; template_text_1: string; template_text_2: string
  metode_bayar: string; harga: number; kode_unik: number; total: number
  status: OrderStatus; catatan: string; created_at: string; updated_at: string
}
interface Stats {
  total: number; pending: number; menunggu_konfirmasi: number
  diproses: number; selesai: number; dibatalkan: number
  revenue_total: number; revenue_bulan_ini: number; order_hari_ini: number
}
interface WeddingInfo {
  link_unik: string | null
  template_id: string | null
  pria_nama_panggilan: string | null
  wanita_nama_panggilan: string | null
  status_pengisian: string | null
  edit_token: string | null
}

// ─── Config ──────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'katresnan2024'

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:             { label: 'Menunggu Bayar',   color: 'text-amber-700',  bg: 'bg-amber-50 dark:bg-amber-900/20',   dot: 'bg-amber-400' },
  menunggu_konfirmasi: { label: 'Verifikasi',        color: 'text-blue-700',   bg: 'bg-blue-50 dark:bg-blue-900/20',     dot: 'bg-blue-400' },
  diproses:            { label: 'Diproses',           color: 'text-purple-700', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-400' },
  selesai:             { label: 'Selesai',            color: 'text-green-700',  bg: 'bg-green-50 dark:bg-green-900/20',   dot: 'bg-green-400' },
  dibatalkan:          { label: 'Dibatalkan',         color: 'text-red-700',    bg: 'bg-red-50 dark:bg-red-900/20',       dot: 'bg-red-400' },
}

const PKG_CFG: Record<string, { label: string; color: string }> = {
  silver:   { label: 'Silver',   color: 'text-slate-400' },
  gold:     { label: 'Gold',     color: 'text-amber-400' },
  platinum: { label: 'Platinum', color: 'text-purple-400' },
}

const STATUS_FLOW: Record<string, string[]> = {
  pending:             ['menunggu_konfirmasi', 'dibatalkan'],
  menunggu_konfirmasi: ['diproses', 'dibatalkan'],
  diproses:            ['selesai', 'dibatalkan'],
  selesai:             [],
  dibatalkan:          [],
}

const TEMPLATE_LIST = [
  { id: 'floral-premium',   name: 'Floral Premium',       category: 'Premium'  },
  { id: 'jogja-floral',     name: 'Jogja Floral',         category: 'Premium'  },
  { id: 'java14-elegant',   name: 'Java 14 Ivory Gold',   category: 'Premium'  },
  { id: 'floral-classic',   name: 'Floral Classic',       category: 'Floral'   },
  { id: 'floral-story',     name: 'Floral Story',         category: 'Floral'   },
  { id: 'gold-classic',     name: 'Elegant Gold Classic', category: 'Elegant'  },
  { id: 'gold-story',       name: 'Elegant Gold Story',   category: 'Elegant'  },
  { id: 'minimal-classic',  name: 'Modern Minimal',       category: 'Modern'   },
  { id: 'midnight-classic', name: 'Midnight Blue',        category: 'Modern'   },
  { id: 'sage-classic',     name: 'Rustic Sage',          category: 'Rustic'   },
  { id: 'tropical-classic', name: 'Tropical Green',       category: 'Rustic'   },
  { id: 'islamic-navy',     name: 'Islamic Navy',         category: 'Islami'   },
  { id: 'islamic-gold',     name: 'Islamic Gold',         category: 'Islami'   },
]

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  if (!s) return '--'
  const d = new Date(s)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return Math.floor(diff / 60) + ' menit lalu'
  if (diff < 86400) return Math.floor(diff / 3600) + ' jam lalu'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass]    = useState('')
  const [err,  setErr]     = useState('')
  const [load, setLoad]    = useState(false)

  function handleLogin() {
    setLoad(true)
    setTimeout(() => {
      if (pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('katresnan_admin', '1')
        onLogin()
      } else {
        setErr('Password salah!')
        setLoad(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0f1a13] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl text-[#e8f0e8] mb-1">Katresnan Admin</h1>
          <p className="text-[#5a9e80] text-sm">Dashboard manajemen pesanan</p>
        </div>
        <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#7aaa90] uppercase tracking-wider block mb-2">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setErr('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Masukkan password admin"
              className="w-full bg-[#0f1a13] border border-[#2a4a38] focus:border-[#4ecdc4] rounded-xl px-4 py-3 text-[#e8f0e8] outline-none text-sm transition-colors placeholder:text-[#3a5a48]"
            />
            {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
          </div>
          <button
            onClick={handleLogin}
            disabled={!pass || load}
            className="w-full bg-[#03554e] hover:bg-[#04665e] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {load ? 'Masuk...' : 'Masuk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-2xl p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-[#4ecdc4] flex-shrink-0 ${color || 'bg-[#0f1a13]'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[#5a9e80] text-xs font-medium">{label}</p>
        <p className="font-bold text-xl text-[#e8f0e8] truncate">{value}</p>
        {sub && <p className="text-[#3a5a48] text-xs">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order, onStatusChange, onDetail }: {
  order: Order
  onStatusChange: (id: string, status: string) => void
  onDetail: (order: Order) => void
}) {
  const cfg          = STATUS_CFG[order.status] || STATUS_CFG.pending
  const pkg          = PKG_CFG[order.package_id] || { label: order.package_id, color: 'text-gray-400' }
  const nextStatuses = STATUS_FLOW[order.status] || []
  const short        = order.id.slice(0, 8).toUpperCase()

  return (
    <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-2xl p-4 hover:border-[#3a5a48] transition-colors">
      <div className="flex items-start gap-3">
        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-sm text-[#4ecdc4]">#{short}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className={`text-xs font-semibold ${pkg.color}`}>{pkg.label}</span>
              </div>
              <p className="font-bold text-[#e8f0e8] mt-1">{order.nama}</p>
              <p className="text-[#5a9e80] text-xs">
                {order.email} · {order.wa ? '+62 ' + order.wa : '--'}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-[#4ecdc4]">{formatRp(order.total)}</p>
              <p className="text-[#3a5a48] text-xs">{formatDate(order.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={() => onDetail(order)}
              className="text-xs px-3 py-1.5 bg-[#0f1a13] border border-[#2a4a38] text-[#7aaa90] rounded-lg hover:border-[#4ecdc4] hover:text-[#4ecdc4] transition-colors"
            >
              Detail
            </button>
            <a
              href={`https://wa.me/62${order.wa}?text=${encodeURIComponent('Halo ' + order.nama + '! Pesanan undangan digital kamu (Order #' + short + ') sedang kami proses ya')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-[#0f1a13] border border-[#2a4a38] text-[#25D366] rounded-lg hover:border-[#25D366] transition-colors"
            >
              WA
            </a>
            {nextStatuses.map(ns => (
              <button
                key={ns}
                onClick={() => onStatusChange(order.id, ns)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors border ${
                  ns === 'dibatalkan'
                    ? 'border-red-800 text-red-400 hover:bg-red-900/20'
                    : 'border-[#03554e] text-[#4ecdc4] bg-[#03554e]/20 hover:bg-[#03554e]/40'
                }`}
              >
                {ns === 'menunggu_konfirmasi' ? 'Konfirmasi' :
                 ns === 'diproses'            ? 'Proses' :
                 ns === 'selesai'             ? 'Selesai' :
                 ns === 'dibatalkan'          ? 'Batalkan' : ns}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ order, onClose, onStatusChange }: {
  order: Order
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const cfg          = STATUS_CFG[order.status] || STATUS_CFG.pending
  const short        = order.id.slice(0, 8).toUpperCase()
  const nextStatuses = STATUS_FLOW[order.status] || []

  const [tab,        setTab]        = useState<'info' | 'undangan' | 'edit'>('info')
  const [wedding,    setWedding]    = useState<WeddingInfo | null>(null)
  const [loadingW,   setLoadingW]   = useState(true)
  const [selTpl,     setSelTpl]     = useState('floral-premium')
  const [savingTpl,  setSavingTpl]  = useState(false)
  const [genLink,    setGenLink]    = useState(false)
  const [genToken,   setGenToken]   = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [copiedEdit, setCopiedEdit] = useState(false)

  useEffect(() => {
    supabase
      .from('wedding_data')
      .select('link_unik, template_id, pria_nama_panggilan, wanita_nama_panggilan, status_pengisian, edit_token')
      .eq('order_id', order.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setWedding(data as WeddingInfo)
          setSelTpl(data.template_id || 'floral-premium')
        }
        setLoadingW(false)
      })
  }, [order.id])

  async function saveTemplate() {
    setSavingTpl(true)
    await supabase.from('wedding_data').update({ template_id: selTpl }).eq('order_id', order.id)
    setWedding(w => w ? { ...w, template_id: selTpl } : w)
    setSavingTpl(false)
  }

  async function generateLink() {
    setGenLink(true)
    const { data, error } = await supabase.rpc('generate_link_unik', { p_order_id: order.id })
    if (!error && data) {
      setWedding(w => w
        ? { ...w, link_unik: data }
        : { link_unik: data, template_id: selTpl, pria_nama_panggilan: null, wanita_nama_panggilan: null, status_pengisian: null, edit_token: null }
      )
    }
    setGenLink(false)
  }

  async function generateEditToken() {
    setGenToken(true)
    const { data, error } = await supabase.rpc('generate_edit_token', { p_order_id: order.id })
    if (!error && data) setWedding(w => w ? { ...w, edit_token: data } : w)
    setGenToken(false)
  }

  const origin      = typeof window !== 'undefined' ? window.location.origin : 'https://katresnan.id'
  const undanganUrl = wedding?.link_unik ? `${origin}/undangan/${wedding.link_unik}` : null
  const editUrl     = wedding?.edit_token ? `${origin}/isi-data?order=${order.id}&token=${wedding.edit_token}` : null
  const adminEditUrl = `${origin}/isi-data?order=${order.id}&admin=1`

  function copyLink() {
    if (!undanganUrl) return
    navigator.clipboard.writeText(undanganUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  function copyEditLink() {
    if (!editUrl) return
    navigator.clipboard.writeText(editUrl)
    setCopiedEdit(true); setTimeout(() => setCopiedEdit(false), 2000)
  }

  function sendWA() {
    if (!undanganUrl) return
    const nama = wedding?.pria_nama_panggilan && wedding?.wanita_nama_panggilan
      ? `${wedding.pria_nama_panggilan} & ${wedding.wanita_nama_panggilan}`
      : order.nama
    const msg = `Halo Kak ${order.nama}!\n\nUndangan digital pernikahan *${nama}* sudah siap!\n\nLink undangan:\n${undanganUrl}\n\nSilakan dicek dan bagikan ke tamu undangan ya.\n\n_Katresnan - Undangan Digital_`
    window.open(`https://wa.me/62${order.wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  function sendEditLinkWA() {
    if (!editUrl) return
    const nama = wedding?.pria_nama_panggilan && wedding?.wanita_nama_panggilan
      ? `${wedding.pria_nama_panggilan} & ${wedding.wanita_nama_panggilan}`
      : order.nama
    const msg = `Halo Kak ${order.nama}!\n\nBerikut link untuk mengisi data pernikahan *${nama}*:\n\nLink Edit Data:\n${editUrl}\n\nLink ini khusus untuk Kak ${order.nama}, harap jangan disebarkan ya.\n\n_Katresnan - Undangan Digital_`
    window.open(`https://wa.me/62${order.wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const groupedTpl = TEMPLATE_LIST.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {} as Record<string, typeof TEMPLATE_LIST>)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#1a2e1d] border border-[#2a4a38] rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#03554e] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Detail Order</p>
            <p className="text-white font-mono font-bold text-lg">#{short}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg font-bold"
          >
            x
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2a4a38] flex-shrink-0">
          {(['info', 'undangan', 'edit'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                tab === t
                  ? 'text-[#4ecdc4] border-b-2 border-[#4ecdc4]'
                  : 'text-[#5a9e80] hover:text-[#e8f0e8]'
              }`}
            >
              {t === 'info' ? 'Info Order' : t === 'undangan' ? 'Undangan' : 'Edit Data'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">

          {/* Tab Info */}
          {tab === 'info' && (
            <div className="p-5 space-y-3 text-sm">
              {([
                ['Nama',        order.nama],
                ['Email',       order.email],
                ['WhatsApp',    '+62 ' + order.wa],
                ['Paket',       order.package_id],
                ['Template 1',  order.template_text_1 || '--'],
                ['Template 2',  order.template_text_2 || '--'],
                ['Metode',      (order.metode_bayar || '').toUpperCase()],
                ['Harga Paket', formatRp(order.harga)],
                ['Kode Unik',   '+' + formatRp(order.kode_unik)],
                ['Total',       formatRp(order.total)],
                ['Catatan',     order.catatan || '--'],
                ['Waktu Pesan', order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '--'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-[#5a9e80] flex-shrink-0">{label}</span>
                  <span className="text-[#e8f0e8] text-right">{value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-[#2a4a38]">
                <span className="text-[#5a9e80]">Status</span>
                <span className={`font-bold ${cfg.color}`}>{cfg.label}</span>
              </div>
            </div>
          )}

          {/* Tab Undangan */}
          {tab === 'undangan' && (
            <div className="p-5 space-y-4 text-sm">
              {loadingW ? (
                <div className="text-center py-6 text-[#5a9e80]">Memuat data...</div>
              ) : (
                <>
                  {/* Status data */}
                  <div className="bg-[#111d17] rounded-2xl p-4">
                    <p className="text-[#5a9e80] text-xs uppercase tracking-widest mb-3 font-bold">
                      Status Data
                    </p>
                    {wedding?.pria_nama_panggilan ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#5a9e80]">Nama</span>
                          <span className="text-[#e8f0e8] font-semibold text-right">
                            {wedding.pria_nama_panggilan} &amp; {wedding.wanita_nama_panggilan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5a9e80]">Kelengkapan</span>
                          <span className={`font-bold ${wedding.status_pengisian === 'lengkap' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {wedding.status_pengisian === 'lengkap' ? 'Lengkap' : 'Sebagian'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-yellow-400 text-xs mb-2">Customer belum mengisi data</p>
                        <a
                          href={`/isi-data?order=${order.id}&admin=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4ecdc4] text-xs underline"
                        >
                          Isi data sekarang
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Pilih template */}
                  <div className="bg-[#111d17] rounded-2xl p-4">
                    <p className="text-[#5a9e80] text-xs uppercase tracking-widest mb-3 font-bold">Template</p>
                    <select
                      value={selTpl}
                      onChange={e => setSelTpl(e.target.value)}
                      className="w-full bg-[#1a2e1d] border border-[#2a4a38] text-[#e8f0e8] rounded-xl px-3 py-2.5 text-sm outline-none mb-3"
                    >
                      {Object.entries(groupedTpl).map(([cat, tmpls]) => (
                        <optgroup key={cat} label={cat}>
                          {tmpls.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={saveTemplate}
                        disabled={savingTpl}
                        className="flex-1 bg-[#03554e] hover:bg-[#04665e] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                      >
                        {savingTpl ? 'Menyimpan...' : 'Simpan Template'}
                      </button>
                      {wedding?.link_unik && (
                        <a
                          href={`/undangan/${wedding.link_unik}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 bg-[#1a2e1d] border border-[#2a4a38] hover:border-[#4ecdc4] text-[#4ecdc4] rounded-xl text-sm transition-colors flex items-center"
                        >
                          Preview
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Link undangan */}
                  <div className="bg-[#111d17] rounded-2xl p-4">
                    <p className="text-[#5a9e80] text-xs uppercase tracking-widest mb-3 font-bold">Link Undangan</p>
                    {undanganUrl ? (
                      <div className="space-y-3">
                        <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                          <p className="text-[#4ecdc4] text-xs font-mono truncate">{undanganUrl}</p>
                          <button
                            onClick={copyLink}
                            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                              copied ? 'bg-green-600 text-white' : 'bg-[#2a4a38] text-[#4ecdc4] hover:bg-[#03554e]'
                            }`}
                          >
                            {copied ? 'Tersalin' : 'Salin'}
                          </button>
                        </div>
                        <button
                          onClick={sendWA}
                          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                          Kirim ke Customer via WhatsApp
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[#5a9e80] text-xs">Link belum dibuat.</p>
                        <button
                          onClick={generateLink}
                          disabled={genLink}
                          className="w-full bg-[#4ecdc4] hover:bg-[#3dbdb4] disabled:opacity-50 text-[#1a2e1d] font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                          {genLink ? 'Membuat link...' : 'Generate Link Undangan'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab Edit Data */}
          {tab === 'edit' && (
            <div className="p-5 space-y-4 text-sm">

              {/* Token keamanan */}
              <div className="bg-[#111d17] rounded-2xl p-4 space-y-3">
                <p className="text-[#5a9e80] text-xs uppercase tracking-widest font-bold">Token Keamanan Customer</p>
                {wedding?.edit_token ? (
                  <div className="space-y-2">
                    <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-xl px-3 py-2 flex items-center gap-2">
                      <p className="text-[#4ecdc4] text-xs font-mono truncate flex-1">
                        {wedding.edit_token.slice(0, 8)}...{wedding.edit_token.slice(-4)}
                      </p>
                      <span className="text-green-400 text-xs font-bold flex-shrink-0">Aktif</span>
                    </div>
                    <button
                      onClick={generateEditToken}
                      disabled={genToken}
                      className="w-full py-2 rounded-xl border border-[#2a4a38] text-[#5a9e80] text-xs font-medium hover:border-yellow-600 hover:text-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {genToken ? 'Regenerating...' : 'Regenerate Token (link lama tidak berlaku)'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={generateEditToken}
                    disabled={genToken}
                    className="w-full bg-[#03554e] hover:bg-[#04665e] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {genToken ? 'Membuat token...' : 'Generate Token'}
                  </button>
                )}
              </div>

              {/* Link edit customer */}
              {editUrl && (
                <div className="bg-[#111d17] rounded-2xl p-4 space-y-3">
                  <p className="text-[#5a9e80] text-xs uppercase tracking-widest font-bold">Link Edit untuk Customer</p>
                  <div className="bg-[#1a2e1d] border border-[#2a4a38] rounded-xl px-3 py-2.5">
                    <p className="text-[#4ecdc4] text-[10px] font-mono break-all leading-relaxed">{editUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyEditLink}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        copiedEdit
                          ? 'bg-green-600 text-white'
                          : 'bg-[#2a4a38] text-[#4ecdc4] hover:bg-[#03554e] hover:text-white'
                      }`}
                    >
                      {copiedEdit ? 'Tersalin!' : 'Salin Link'}
                    </button>
                    <button
                      onClick={sendEditLinkWA}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors"
                    >
                      Kirim WA
                    </button>
                  </div>
                  <p className="text-[#5a9e80] text-[10px] leading-relaxed">
                    Link ini hanya untuk customer. Token bisa di-regenerate jika disalahgunakan.
                  </p>
                </div>
              )}

              {/* Edit langsung admin */}
              <div className="bg-[#111d17] rounded-2xl p-4 space-y-3">
                <p className="text-[#5a9e80] text-xs uppercase tracking-widest font-bold">Edit Langsung (Admin)</p>
                <p className="text-[#5a9e80] text-xs">Admin tidak perlu token.</p>
                <a
                  href={adminEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-[#03554e] hover:bg-[#04665e] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Buka Form Edit (Admin)
                </a>
              </div>

              {/* Ringkasan data */}
              {wedding?.pria_nama_panggilan && (
                <div className="bg-[#111d17] rounded-2xl p-4 space-y-2">
                  <p className="text-[#5a9e80] text-xs uppercase tracking-widest font-bold mb-3">Data Tersimpan</p>
                  {([
                    ['Pengantin', `${wedding.pria_nama_panggilan} & ${wedding.wanita_nama_panggilan}`],
                    ['Status',    wedding.status_pengisian === 'lengkap' ? 'Lengkap' : 'Sebagian'],
                    ['Template',  wedding.template_id || '--'],
                    ['Link',      wedding.link_unik || '--'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <span className="text-[#5a9e80] flex-shrink-0">{k}</span>
                      <span className="text-[#e8f0e8] text-right text-xs truncate max-w-[180px]">{v}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer actions */}
        {nextStatuses.length > 0 && (
          <div className="px-5 py-4 border-t border-[#2a4a38] flex gap-2 flex-wrap flex-shrink-0">
            {nextStatuses.map(ns => (
              <button
                key={ns}
                onClick={() => { onStatusChange(order.id, ns); onClose() }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  ns === 'dibatalkan'
                    ? 'bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50'
                    : 'bg-[#03554e] hover:bg-[#04665e] text-white'
                }`}
              >
                {ns === 'menunggu_konfirmasi' ? 'Konfirmasi Bayar' :
                 ns === 'diproses'            ? 'Tandai Diproses' :
                 ns === 'selesai'             ? 'Tandai Selesai' :
                 ns === 'dibatalkan'          ? 'Batalkan' : ns}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed,       setAuthed]   = useState(false)
  const [orders,       setOrders]   = useState<Order[]>([])
  const [stats,        setStats]    = useState<Stats | null>(null)
  const [loading,      setLoading]  = useState(true)
  const [filterStatus, setFilter]   = useState<string>('semua')
  const [search,       setSearch]   = useState('')
  const [detail,       setDetail]   = useState<Order | null>(null)
  const [toast,        setToast]    = useState<string | null>(null)
  const [updating,     setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('katresnan_admin') === '1') setAuthed(true)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    const [ordersRes, statsRes] = await Promise.all([
      supabase.rpc('get_all_orders_admin', { p_status: null, p_limit: 100, p_offset: 0 }),
      supabase.rpc('get_order_stats'),
    ])
    if (ordersRes.data) setOrders(ordersRes.data)
    if (statsRes.data)  setStats(statsRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) loadData()
  }, [authed, loadData])

  useEffect(() => {
    if (!authed) return
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadData()
        showToast('Ada perubahan order baru!')
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [authed, loadData])

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId)
    const { error } = await supabase.rpc('update_order_status', {
      p_order_id: orderId,
      p_status: newStatus,
    })
    if (error) {
      showToast('Gagal update status: ' + error.message)
    } else {
      showToast('Status diupdate: ' + (STATUS_CFG[newStatus]?.label || newStatus))
      await loadData()
    }
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'semua' || o.status === filterStatus
    const q = search.toLowerCase()
    const matchSearch = !q
      || o.nama.toLowerCase().includes(q)
      || o.email.toLowerCase().includes(q)
      || o.id.toLowerCase().includes(q)
      || (o.wa || '').includes(q)
    return matchStatus && matchSearch
  })

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-[#0f1a13] text-[#e8f0e8]">

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a2e1d] border border-[#4ecdc4] text-[#e8f0e8] px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium">
          {toast}
        </div>
      )}

      {detail && (
        <DetailModal
          order={detail}
          onClose={() => setDetail(null)}
          onStatusChange={(id, status) => { handleStatusChange(id, status); setDetail(null) }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#1a3028] px-4 py-4 sticky top-0 bg-[#0f1a13]/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#e8f0e8]">Katresnan Admin</p>
            <p className="text-[#3a5a48] text-xs">Dashboard Pesanan</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="w-8 h-8 rounded-lg bg-[#1a2e1d] border border-[#2a4a38] flex items-center justify-center text-[#5a9e80] hover:border-[#4ecdc4] transition-colors"
            >
              R
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('katresnan_admin'); setAuthed(false) }}
              className="text-xs px-3 py-1.5 bg-[#1a2e1d] border border-[#2a4a38] text-[#5a9e80] rounded-lg hover:border-red-800 hover:text-red-400 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard icon="~"  label="Total Order"    value={stats.total}                                    color="bg-[#1a3028]" />
            <StatCard icon="!"  label="Perlu Aksi"     value={stats.pending + stats.menunggu_konfirmasi}      color="bg-amber-900/30" />
            <StatCard icon=">"  label="Diproses"       value={stats.diproses}                                 color="bg-purple-900/30" />
            <StatCard icon="ok" label="Selesai"        value={stats.selesai}                                  color="bg-green-900/30" />
            <StatCard icon="Rp" label="Revenue Bulan"  value={formatRp(stats.revenue_bulan_ini)}
              sub={'Total: ' + formatRp(stats.revenue_total)} color="bg-[#03554e]/30" />
          </div>
        )}

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, email, WA, atau Order ID..."
              className="w-full bg-[#1a2e1d] border border-[#2a4a38] focus:border-[#4ecdc4] rounded-xl px-4 py-2.5 text-sm text-[#e8f0e8] outline-none transition-colors placeholder:text-[#3a5a48]"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['semua', 'pending', 'menunggu_konfirmasi', 'diproses', 'selesai', 'dibatalkan'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === s
                    ? 'bg-[#03554e] text-white border border-[#03554e]'
                    : 'bg-[#1a2e1d] border border-[#2a4a38] text-[#5a9e80] hover:border-[#4ecdc4]'
                }`}
              >
                {s === 'semua' ? 'Semua' : (STATUS_CFG[s]?.label || s)}
                {s !== 'semua' && stats && (
                  <span className="ml-1.5 opacity-60">
                    ({s === 'pending' ? stats.pending
                      : s === 'menunggu_konfirmasi' ? stats.menunggu_konfirmasi
                      : s === 'diproses' ? stats.diproses
                      : s === 'selesai' ? stats.selesai
                      : stats.dibatalkan})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#1a2e1d] border border-[#2a4a38] rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-[#2a4a38] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#2a4a38] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#5a9e80] font-medium">Tidak ada order ditemukan</p>
            <p className="text-[#3a5a48] text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[#3a5a48] text-xs">{filtered.length} order ditampilkan</p>
            {filtered.map(order => (
              <div key={order.id} className={updating === order.id ? 'opacity-50 pointer-events-none' : ''}>
                <OrderRow
                  order={order}
                  onStatusChange={handleStatusChange}
                  onDetail={setDetail}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}