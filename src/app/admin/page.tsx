'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
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
interface TemplateRow {
  id: string; name: string; category_id: string; style_label: string
  description: string; thumbnail_url: string; demo_url: string
  has_photo: boolean; is_popular: boolean; is_active: boolean; sort_order: number
}
interface CategoryRow {
  id: string; name: string; description: string; emoji: string
  is_active: boolean; sort_order: number
}
interface PackageRow {
  id: string; name: string; emoji: string
  price: number; original_price: number; discount: number
  max_themes: number; masa_aktif: string; features: string[]
  is_active: boolean; sort_order: number
}

// ─── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  orders: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  process: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>,
  revenue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  wa: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  template: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>,
  pricing: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  chevDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="6 9 12 15 18 9" /></svg>,
  chevUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="18 15 12 9 6 15" /></svg>,
  chevLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="15 18 9 12 15 6" /></svg>,
  chevRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6" /></svg>,
  sort: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
}

// ─── Config ──────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'katresnan2024'

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Menunggu Bayar', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', dot: 'bg-amber-400' },
  menunggu_konfirmasi: { label: 'Verifikasi', color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', dot: 'bg-blue-400' },
  diproses: { label: 'Diproses', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-400' },
  selesai: { label: 'Selesai', color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', dot: 'bg-green-400' },
  dibatalkan: { label: 'Dibatalkan', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', dot: 'bg-red-400' },
}

const PKG_CFG: Record<string, { label: string; color: string }> = {
  silver: { label: 'Silver', color: 'text-sage-400' },
  gold: { label: 'Gold', color: 'text-gold-500' },
  platinum: { label: 'Platinum', color: 'text-rose-400' },
}

const STATUS_FLOW: Record<string, string[]> = {
  pending: ['menunggu_konfirmasi', 'dibatalkan'],
  menunggu_konfirmasi: ['diproses', 'dibatalkan'],
  diproses: ['selesai', 'dibatalkan'],
  selesai: [],
  dibatalkan: [],
}

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

function formatDateFull(s: string) {
  if (!s) return '--'
  return new Date(s).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [load, setLoad] = useState(false)

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
    <div className="min-h-screen bg-sage-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-800 flex items-center justify-center text-gold-500">
            {icons.lock}
          </div>
          <h1 className="font-serif font-bold text-2xl text-ivory-200 mb-1">Katresnan Admin</h1>
          <p className="text-sage-400 text-sm">Dashboard manajemen pesanan</p>
        </div>
        <div className="bg-sage-900 border border-sage-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-sage-400 uppercase tracking-wider block mb-2">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setErr('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Masukkan password admin"
              className="w-full bg-sage-950 border border-sage-700 focus:border-gold-500 rounded-xl px-4 py-3 text-ivory-200 outline-none text-sm transition-colors placeholder:text-sage-600"
            />
            {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
          </div>
          <button
            onClick={handleLogin}
            disabled={!pass || load}
            className="w-full bg-sage-800 hover:bg-sage-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {load ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" className="opacity-25" /><path d="M4 12a8 8 0 018-8" className="opacity-75" /></svg>
                Masuk...
              </span>
            ) : 'Masuk'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: JSX.Element; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="bg-sage-900 border border-sage-800 rounded-2xl p-4 flex items-center gap-4 hover:border-sage-700 transition-colors">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color || 'bg-sage-800'}`}>
        <span className="text-sage-300">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sage-400 text-xs font-medium">{label}</p>
        <p className="font-bold text-xl text-ivory-200 truncate">{value}</p>
        {sub && <p className="text-sage-500 text-xs">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ order, onClose, onStatusChange, templateList }: {
  order: Order
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  templateList: TemplateRow[]
}) {
  const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending
  const short = order.id.slice(0, 8).toUpperCase()
  const nextStatuses = STATUS_FLOW[order.status] || []

  const [tab, setTab] = useState<'info' | 'undangan' | 'edit'>('info')
  const [wedding, setWedding] = useState<WeddingInfo | null>(null)
  const [loadingW, setLoadingW] = useState(true)
  const [selTpl, setSelTpl] = useState('floral-premium')
  const [savingTpl, setSavingTpl] = useState(false)
  const [genLink, setGenLink] = useState(false)
  const [genToken, setGenToken] = useState(false)
  const [copied, setCopied] = useState(false)
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
    if (!error && data) setWedding(w => w
      ? { ...w, edit_token: data }
      : { link_unik: null, template_id: null, pria_nama_panggilan: null, wanita_nama_panggilan: null, status_pengisian: null, edit_token: data }
    )
    setGenToken(false)
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://katresnan.id'
  const undanganUrl = wedding?.link_unik ? `${origin}/undangan/${wedding.link_unik}` : null
  const editUrl = wedding?.edit_token ? `${origin}/isi-data?order=${order.id}&token=${wedding.edit_token}` : null
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
    const msg = `Halo Kak ${order.nama}!\n\nBerikut link untuk mengisi data pernikahan:\n\nLink Edit Data:\n${editUrl}\n\nLink ini khusus untuk Kak ${order.nama}, harap jangan disebarkan ya.\n\n_Katresnan - Undangan Digital_`
    window.open(`https://wa.me/62${order.wa}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // Group templates by category
  const groupedTpl = templateList.reduce((acc, t) => {
    const cat = t.category_id || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {} as Record<string, TemplateRow[]>)

  const sectionClass = "bg-sage-950 rounded-xl p-4"
  const sectionLabel = "text-sage-400 text-xs uppercase tracking-widest mb-3 font-bold"

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-sage-900 border border-sage-800 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-sage-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-sage-300 text-xs font-bold uppercase tracking-wider">Detail Order</p>
            <p className="text-white font-mono font-bold text-lg">#{short}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            {icons.close}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sage-800 flex-shrink-0">
          {(['info', 'undangan', 'edit'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === t
                ? 'text-gold-400 border-b-2 border-gold-400'
                : 'text-sage-400 hover:text-ivory-200'
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
                ['Nama', order.nama],
                ['Email', order.email],
                ['WhatsApp', '+62 ' + order.wa],
                ['Paket', order.package_id],
                ['Template 1', order.template_text_1 || '--'],
                ['Template 2', order.template_text_2 || '--'],
                ['Metode', (order.metode_bayar || '').toUpperCase()],
                ['Harga Paket', formatRp(order.harga)],
                ['Kode Unik', '+' + formatRp(order.kode_unik)],
                ['Total', formatRp(order.total)],
                ['Catatan', order.catatan || '--'],
                ['Waktu Pesan', order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '--'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-sage-400 flex-shrink-0">{label}</span>
                  <span className="text-ivory-200 text-right">{value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-sage-800">
                <span className="text-sage-400">Status</span>
                <span className={`font-bold ${cfg.color}`}>{cfg.label}</span>
              </div>
            </div>
          )}

          {/* Tab Undangan */}
          {tab === 'undangan' && (
            <div className="p-5 space-y-4 text-sm">
              {loadingW ? (
                <div className="text-center py-6 text-sage-400">
                  <svg className="w-5 h-5 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" className="opacity-25" /><path d="M4 12a8 8 0 018-8" className="opacity-75" /></svg>
                  Memuat data...
                </div>
              ) : (
                <>
                  {/* Status data */}
                  <div className={sectionClass}>
                    <p className={sectionLabel}>Status Data</p>
                    {wedding?.pria_nama_panggilan ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sage-400">Nama</span>
                          <span className="text-ivory-200 font-semibold text-right">
                            {wedding.pria_nama_panggilan} &amp; {wedding.wanita_nama_panggilan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sage-400">Kelengkapan</span>
                          <span className={`font-bold ${wedding.status_pengisian === 'lengkap' ? 'text-green-400' : 'text-amber-400'}`}>
                            {wedding.status_pengisian === 'lengkap' ? 'Lengkap' : 'Sebagian'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-amber-400 text-xs mb-2">Customer belum mengisi data</p>
                        <a href={`/isi-data?order=${order.id}&admin=1`} target="_blank" rel="noopener noreferrer"
                          className="text-gold-400 text-xs underline underline-offset-2 hover:text-gold-300 transition-colors">
                          Isi data sekarang
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Pilih template */}
                  <div className={sectionClass}>
                    <p className={sectionLabel}>Template</p>
                    <select
                      value={selTpl}
                      onChange={e => setSelTpl(e.target.value)}
                      className="w-full bg-sage-900 border border-sage-700 text-ivory-200 rounded-xl px-3 py-2.5 text-sm outline-none mb-3 focus:border-gold-500 transition-colors"
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
                        className="flex-1 bg-sage-800 hover:bg-sage-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                      >
                        {savingTpl ? 'Menyimpan...' : 'Simpan Template'}
                      </button>
                      {wedding?.link_unik && (
                        <a
                          href={`/undangan/${wedding.link_unik}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2.5 bg-sage-900 border border-sage-700 hover:border-gold-500 text-gold-400 rounded-xl text-sm transition-colors"
                        >
                          {icons.eye} Preview
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Link undangan */}
                  <div className={sectionClass}>
                    <p className={sectionLabel}>Link Undangan</p>
                    {undanganUrl ? (
                      <div className="space-y-3">
                        <div className="bg-sage-900 border border-sage-700 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                          <p className="text-gold-400 text-xs font-mono truncate">{undanganUrl}</p>
                          <button
                            onClick={copyLink}
                            className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-sage-800 text-sage-300 hover:bg-sage-700'
                              }`}
                          >
                            {icons.copy} {copied ? 'Tersalin' : 'Salin'}
                          </button>
                        </div>
                        <button
                          onClick={sendWA}
                          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                        >
                          {icons.wa} Kirim ke Customer via WhatsApp
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sage-400 text-xs">Link belum dibuat.</p>
                        <button
                          onClick={generateLink}
                          disabled={genLink}
                          className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-sage-950 font-bold py-3 rounded-xl text-sm transition-colors"
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
              <div className={`${sectionClass} space-y-3`}>
                <p className={sectionLabel}>Token Keamanan Customer</p>
                {wedding?.edit_token ? (
                  <div className="space-y-2">
                    <div className="bg-sage-900 border border-sage-700 rounded-xl px-3 py-2 flex items-center gap-2">
                      <p className="text-gold-400 text-xs font-mono truncate flex-1">
                        {wedding.edit_token.slice(0, 8)}...{wedding.edit_token.slice(-4)}
                      </p>
                      <span className="text-green-400 text-xs font-bold flex-shrink-0">Aktif</span>
                    </div>
                    <button
                      onClick={generateEditToken}
                      disabled={genToken}
                      className="w-full py-2 rounded-xl border border-sage-700 text-sage-400 text-xs font-medium hover:border-amber-600 hover:text-amber-400 transition-colors disabled:opacity-50"
                    >
                      {genToken ? 'Regenerating...' : 'Regenerate Token (link lama tidak berlaku)'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={generateEditToken}
                    disabled={genToken}
                    className="w-full bg-sage-800 hover:bg-sage-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {genToken ? 'Membuat token...' : 'Generate Token'}
                  </button>
                )}
              </div>

              {/* Link edit customer */}
              {editUrl && (
                <div className={`${sectionClass} space-y-3`}>
                  <p className={sectionLabel}>Link Edit untuk Customer</p>
                  <div className="bg-sage-900 border border-sage-700 rounded-xl px-3 py-2.5">
                    <p className="text-gold-400 text-[10px] font-mono break-all leading-relaxed">{editUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyEditLink}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${copiedEdit
                        ? 'bg-green-600 text-white'
                        : 'bg-sage-800 text-sage-300 hover:bg-sage-700'
                        }`}
                    >
                      {icons.copy} {copiedEdit ? 'Tersalin!' : 'Salin Link'}
                    </button>
                    <button
                      onClick={sendEditLinkWA}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors"
                    >
                      {icons.wa} Kirim WA
                    </button>
                  </div>
                  <p className="text-sage-500 text-[10px] leading-relaxed">
                    Link ini hanya untuk customer. Token bisa di-regenerate jika disalahgunakan.
                  </p>
                </div>
              )}

              {/* Edit langsung admin */}
              <div className={`${sectionClass} space-y-3`}>
                <p className={sectionLabel}>Edit Langsung (Admin)</p>
                <p className="text-sage-400 text-xs">Admin tidak perlu token.</p>
                <a
                  href={adminEditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-sage-800 hover:bg-sage-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {icons.eye} Buka Form Edit (Admin)
                </a>
              </div>

              {/* Ringkasan data */}
              {wedding?.pria_nama_panggilan && (
                <div className={`${sectionClass} space-y-2`}>
                  <p className={`${sectionLabel} mb-3`}>Data Tersimpan</p>
                  {([
                    ['Pengantin', `${wedding.pria_nama_panggilan} & ${wedding.wanita_nama_panggilan}`],
                    ['Status', wedding.status_pengisian === 'lengkap' ? 'Lengkap' : 'Sebagian'],
                    ['Template', wedding.template_id || '--'],
                    ['Link', wedding.link_unik || '--'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <span className="text-sage-400 flex-shrink-0">{k}</span>
                      <span className="text-ivory-200 text-right text-xs truncate max-w-[180px]">{v}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer actions */}
        {nextStatuses.length > 0 && (
          <div className="px-5 py-4 border-t border-sage-800 flex gap-2 flex-wrap flex-shrink-0">
            {nextStatuses.map(ns => (
              <button
                key={ns}
                onClick={() => { onStatusChange(order.id, ns); onClose() }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${ns === 'dibatalkan'
                  ? 'bg-red-900/30 border border-red-800 text-red-400 hover:bg-red-900/50'
                  : 'bg-sage-800 hover:bg-sage-700 text-white'
                  }`}
              >
                {ns === 'menunggu_konfirmasi' ? 'Konfirmasi Bayar' :
                  ns === 'diproses' ? 'Tandai Diproses' :
                    ns === 'selesai' ? 'Tandai Selesai' :
                      ns === 'dibatalkan' ? 'Batalkan' : ns}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ─── TEMPLATE MANAGEMENT TAB ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function TemplateManagement({ showToast }: { showToast: (msg: string) => void }) {
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [filterCat, setFilterCat] = useState('semua')

  // Form state
  const emptyForm = {
    name: '', category_id: '', style_label: '', description: '',
    thumbnail_url: '', demo_url: '', has_photo: false,
    is_popular: false, is_active: true, sort_order: 0
  }
  const [form, setForm] = useState(emptyForm)

  const loadTemplates = useCallback(async () => {
    setLoading(true)
    const [tplRes, catRes] = await Promise.all([
      supabase.from('templates').select('*').order('sort_order'),
      supabase.from('template_categories').select('*').order('sort_order'),
    ])
    if (tplRes.data) setTemplates(tplRes.data)
    if (catRes.data) setCategories(catRes.data)
    setLoading(false)
  }, [])

  useEffect(() => { loadTemplates() }, [loadTemplates])

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(t: TemplateRow) {
    setEditId(t.id)
    setForm({
      name: t.name, category_id: t.category_id, style_label: t.style_label,
      description: t.description, thumbnail_url: t.thumbnail_url, demo_url: t.demo_url,
      has_photo: t.has_photo, is_popular: t.is_popular, is_active: t.is_active,
      sort_order: t.sort_order,
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { showToast('Nama template wajib diisi!'); return }
    setSaving(true)
    if (editId) {
      const { error } = await supabase.from('templates').update(form).eq('id', editId)
      if (error) showToast('Gagal update: ' + error.message)
      else showToast('Template berhasil diupdate!')
    } else {
      const id = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
      const { error } = await supabase.from('templates').insert([{ id, ...form }])
      if (error) showToast('Gagal tambah: ' + error.message)
      else showToast('Template berhasil ditambah!')
    }
    setSaving(false)
    setShowForm(false)
    loadTemplates()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('templates').delete().eq('id', id)
    if (error) showToast('Gagal hapus: ' + error.message)
    else showToast('Template berhasil dihapus!')
    setDelConfirm(null)
    loadTemplates()
  }

  const filtered = templates.filter(t => {
    const matchCat = filterCat === 'semua' || t.category_id === filterCat
    const q = searchQ.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const getCatName = (catId: string) => categories.find(c => c.id === catId)?.name || catId

  const inputClass = "w-full bg-sage-950 border border-sage-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-ivory-200 outline-none text-sm transition-colors placeholder:text-sage-600"
  const labelClass = "text-xs font-bold text-sage-400 uppercase tracking-wider block mb-1.5"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-ivory-200">Manajemen Template</h2>
          <p className="text-sage-400 text-sm">{templates.length} template terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-sage-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {icons.plus} Tambah Template
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-500">{icons.search}</span>
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Cari template..."
            className="w-full bg-sage-900 border border-sage-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ivory-200 outline-none transition-colors placeholder:text-sage-600"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-sage-900 border border-sage-700 text-ivory-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        >
          <option value="semua">Semua Kategori</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
          ))}
        </select>
      </div>

      {/* Template List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-sage-900 border border-sage-800 rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-sage-800 rounded w-1/3 mb-2" />
              <div className="h-3 bg-sage-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sage-400 font-medium">Tidak ada template ditemukan</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(t => (
            <div
              key={t.id}
              className="bg-sage-900 border border-sage-800 rounded-2xl p-4 hover:border-sage-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-sage-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {t.thumbnail_url ? (
                    <img src={t.thumbnail_url} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sage-600">{icons.template}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-ivory-200">{t.name}</span>
                    {t.is_popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400">
                        Popular
                      </span>
                    )}
                    {!t.is_active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-sage-400">
                    <span>{getCatName(t.category_id)}</span>
                    <span>·</span>
                    <span>{t.style_label || '--'}</span>
                    <span>·</span>
                    <span>{t.has_photo ? 'Foto' : 'No Foto'}</span>
                    <span>·</span>
                    <span className="font-mono text-sage-500">#{t.sort_order}</span>
                  </div>
                  {t.description && (
                    <p className="text-sage-500 text-xs mt-1 line-clamp-1">{t.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {t.demo_url && (
                    <a
                      href={t.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors"
                      title="Preview"
                    >
                      {icons.eye}
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(t)}
                    className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                    title="Edit"
                  >
                    {icons.edit}
                  </button>
                  <button
                    onClick={() => setDelConfirm(t.id)}
                    className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-red-500 hover:text-red-400 transition-colors"
                    title="Hapus"
                  >
                    {icons.trash}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg bg-sage-900 border border-sage-800 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-sage-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h3 className="font-serif font-bold text-lg text-white">
                {editId ? 'Edit Template' : 'Tambah Template Baru'}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                {icons.close}
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              <div>
                <label className={labelClass}>Nama Template *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Floral Premium" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Kategori</label>
                  <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className={inputClass}>
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Style Label</label>
                  <input value={form.style_label} onChange={e => setForm({ ...form, style_label: e.target.value })} placeholder="Classic" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Deskripsi singkat template..." className={inputClass + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Thumbnail URL</label>
                  <input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Demo URL</label>
                  <input value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} placeholder="https://..." className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-ivory-200 cursor-pointer">
                  <input type="checkbox" checked={form.has_photo} onChange={e => setForm({ ...form, has_photo: e.target.checked })}
                    className="w-4 h-4 rounded border-sage-600 bg-sage-950 text-gold-500 focus:ring-gold-500" />
                  Dengan Foto
                </label>
                <label className="flex items-center gap-2 text-sm text-ivory-200 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded border-sage-600 bg-sage-950 text-gold-500 focus:ring-gold-500" />
                  Popular
                </label>
                <label className="flex items-center gap-2 text-sm text-ivory-200 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-sage-600 bg-sage-950 text-gold-500 focus:ring-gold-500" />
                  Aktif
                </label>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-sage-800 flex gap-3 flex-shrink-0">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-sage-700 text-sage-400 font-semibold text-sm hover:bg-sage-950 transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-sage-950 font-bold text-sm transition-colors">
                {saving ? 'Menyimpan...' : editId ? 'Update Template' : 'Tambah Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {delConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDelConfirm(null)}>
          <div className="w-full max-w-sm bg-sage-900 border border-sage-800 rounded-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                {icons.trash}
              </div>
              <h3 className="font-bold text-ivory-200 text-lg">Hapus Template?</h3>
              <p className="text-sage-400 text-sm mt-1">Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDelConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-sage-700 text-sage-400 font-semibold text-sm hover:bg-sage-950 transition-colors">
                Batal
              </button>
              <button onClick={() => handleDelete(delConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ─── PRICING MANAGEMENT TAB ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function PricingManagement({ showToast }: { showToast: (msg: string) => void }) {
  const [packages, setPackages] = useState<PackageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editPkg, setEditPkg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state for inline editing
  const [editForm, setEditForm] = useState<Record<string, {
    price: number; original_price: number; discount: number
    max_themes: number; masa_aktif: string; features: string[]
    is_active: boolean
  }>>({})

  const loadPackages = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('packages').select('*').order('sort_order')
    if (data) {
      const pkgs = data.map((p: any) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')
      }))
      setPackages(pkgs)
      // Init edit form
      const eForm: typeof editForm = {}
      for (const p of pkgs) {
        eForm[p.id] = {
          price: p.price, original_price: p.original_price, discount: p.discount,
          max_themes: p.max_themes, masa_aktif: p.masa_aktif,
          features: p.features, is_active: p.is_active,
        }
      }
      setEditForm(eForm)
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadPackages() }, [loadPackages])

  // Auto-calculate discount when price changes
  function updatePrice(pkgId: string, field: 'price' | 'original_price', value: number) {
    setEditForm(prev => {
      const pkg = { ...prev[pkgId], [field]: value }
      // Auto-calculate discount
      if (pkg.original_price > 0 && pkg.price > 0) {
        pkg.discount = Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
      }
      return { ...prev, [pkgId]: pkg }
    })
  }

  // Auto-calculate price when discount changes
  function updateDiscount(pkgId: string, discount: number) {
    setEditForm(prev => {
      const pkg = { ...prev[pkgId], discount }
      if (pkg.original_price > 0) {
        pkg.price = Math.round(pkg.original_price * (1 - discount / 100))
      }
      return { ...prev, [pkgId]: pkg }
    })
  }

  function updateFeature(pkgId: string, idx: number, value: string) {
    setEditForm(prev => {
      const pkg = { ...prev[pkgId] }
      const features = [...pkg.features]
      features[idx] = value
      return { ...prev, [pkgId]: { ...pkg, features } }
    })
  }

  function addFeature(pkgId: string) {
    setEditForm(prev => {
      const pkg = { ...prev[pkgId] }
      return { ...prev, [pkgId]: { ...pkg, features: [...pkg.features, ''] } }
    })
  }

  function removeFeature(pkgId: string, idx: number) {
    setEditForm(prev => {
      const pkg = { ...prev[pkgId] }
      const features = pkg.features.filter((_: string, i: number) => i !== idx)
      return { ...prev, [pkgId]: { ...pkg, features } }
    })
  }

  async function savePkg(pkgId: string) {
    setSaving(true)
    const form = editForm[pkgId]
    const { error } = await supabase.from('packages').update({
      price: form.price,
      original_price: form.original_price,
      discount: form.discount,
      max_themes: form.max_themes,
      masa_aktif: form.masa_aktif,
      features: form.features.filter((f: string) => f.trim()),
      is_active: form.is_active,
    }).eq('id', pkgId)
    if (error) showToast('Gagal update: ' + error.message)
    else showToast(`Paket ${pkgId} berhasil diupdate!`)
    setSaving(false)
    setEditPkg(null)
    loadPackages()
  }

  const inputClass = "w-full bg-sage-950 border border-sage-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-ivory-200 outline-none text-sm transition-colors placeholder:text-sage-600"
  const labelClass = "text-xs font-bold text-sage-400 uppercase tracking-wider block mb-1.5"

  const pkgColors: Record<string, string> = {
    silver: 'border-sage-600',
    gold: 'border-gold-500/40',
    platinum: 'border-rose-500/40',
  }
  const pkgBadgeColors: Record<string, string> = {
    silver: 'bg-sage-800 text-sage-300',
    gold: 'bg-gold-500/20 text-gold-400',
    platinum: 'bg-rose-500/20 text-rose-400',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif font-bold text-xl text-ivory-200">Harga Paket Undangan</h2>
        <p className="text-sage-400 text-sm">Edit harga, diskon otomatis dihitung dari harga asli vs harga jual</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-sage-900 border border-sage-800 rounded-2xl p-6 animate-pulse">
              <div className="h-5 bg-sage-800 rounded w-1/4 mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-sage-800 rounded" />
                <div className="h-10 bg-sage-800 rounded" />
                <div className="h-10 bg-sage-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map(pkg => {
            const isEditing = editPkg === pkg.id
            const form = editForm[pkg.id]
            if (!form) return null

            return (
              <div
                key={pkg.id}
                className={`bg-sage-900 border ${pkgColors[pkg.id] || 'border-sage-800'} rounded-2xl overflow-hidden transition-all ${isEditing ? 'ring-1 ring-gold-500/20' : ''}`}
              >
                {/* Package Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-sage-800">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${pkgBadgeColors[pkg.id] || 'bg-sage-800 text-sage-300'}`}>
                      {pkg.emoji} {pkg.name}
                    </span>
                    {!form.is_active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => { setEditPkg(null); loadPackages() }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-sage-700 text-sage-400 hover:bg-sage-950 transition-colors"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => savePkg(pkg.id)}
                          disabled={saving}
                          className="text-xs px-4 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-sage-950 font-bold transition-colors"
                        >
                          {saving ? 'Saving...' : 'Simpan'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditPkg(pkg.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-sage-700 text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors"
                      >
                        {icons.edit} Edit Harga
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Display / Edit */}
                <div className="px-6 py-5">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Price row */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={labelClass}>Harga Asli</label>
                          <input
                            type="number"
                            value={form.original_price}
                            onChange={e => updatePrice(pkg.id, 'original_price', parseInt(e.target.value) || 0)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Harga Jual</label>
                          <input
                            type="number"
                            value={form.price}
                            onChange={e => updatePrice(pkg.id, 'price', parseInt(e.target.value) || 0)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Diskon (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={form.discount}
                              onChange={e => updateDiscount(pkg.id, parseInt(e.target.value) || 0)}
                              className={inputClass}
                              min={0}
                              max={100}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-500 text-sm">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Discount preview */}
                      <div className="bg-sage-950 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-sage-400 text-xs">Preview harga:</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sage-500 text-sm line-through">{formatRp(form.original_price)}</span>
                          <span className="text-gold-400 font-bold text-lg">{formatRp(form.price)}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400">
                            HEMAT {form.discount}%
                          </span>
                        </div>
                      </div>

                      {/* Other fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Max Themes</label>
                          <input type="number" value={form.max_themes} onChange={e => setEditForm(prev => ({
                            ...prev, [pkg.id]: { ...prev[pkg.id], max_themes: parseInt(e.target.value) || 0 }
                          }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Masa Aktif</label>
                          <input value={form.masa_aktif} onChange={e => setEditForm(prev => ({
                            ...prev, [pkg.id]: { ...prev[pkg.id], masa_aktif: e.target.value }
                          }))} placeholder="Selamanya" className={inputClass} />
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <label className={labelClass}>Fitur</label>
                        <div className="space-y-2">
                          {form.features.map((f: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                value={f}
                                onChange={e => updateFeature(pkg.id, idx, e.target.value)}
                                placeholder="Fitur..."
                                className={inputClass}
                              />
                              <button
                                onClick={() => removeFeature(pkg.id, idx)}
                                className="w-10 h-10 flex-shrink-0 rounded-xl border border-sage-700 text-red-400 hover:border-red-500 flex items-center justify-center transition-colors"
                              >
                                {icons.close}
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addFeature(pkg.id)}
                            className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors"
                          >
                            {icons.plus} Tambah Fitur
                          </button>
                        </div>
                      </div>

                      {/* Active toggle */}
                      <label className="flex items-center gap-2 text-sm text-ivory-200 cursor-pointer">
                        <input type="checkbox" checked={form.is_active} onChange={e => setEditForm(prev => ({
                          ...prev, [pkg.id]: { ...prev[pkg.id], is_active: e.target.checked }
                        }))} className="w-4 h-4 rounded border-sage-600 bg-sage-950 text-gold-500 focus:ring-gold-500" />
                        Paket Aktif
                      </label>
                    </div>
                  ) : (
                    /* Display mode */
                    <div className="space-y-4">
                      <div className="flex items-end gap-4">
                        <div>
                          <p className="text-sage-500 text-xs mb-1">Harga Jual</p>
                          <p className="font-serif font-bold text-3xl text-ivory-200">{formatRp(pkg.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sage-500 text-sm line-through">{formatRp(pkg.original_price)}</span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400">
                            HEMAT {pkg.discount}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-sage-400">
                        <span>Max {pkg.max_themes} tema</span>
                        <span>·</span>
                        <span>Aktif {pkg.masa_aktif}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pkg.features.map((f: string, i: number) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-sage-950 text-sage-300 border border-sage-800">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ─── DATA TABLES — ORDER LIST ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
type SortField = 'nama' | 'created_at' | 'total' | 'status' | 'package_id'
type SortDir = 'asc' | 'desc'

function OrderDataTable({ orders, stats, loading, onStatusChange, onDetail, updating }: {
  orders: Order[]
  stats: Stats | null
  loading: boolean
  onStatusChange: (id: string, status: string) => void
  onDetail: (order: Order) => void
  updating: string | null
}) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilter] = useState<string>('semua')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Filter
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = filterStatus === 'semua' || o.status === filterStatus
      const q = search.toLowerCase()
      const matchSearch = !q
        || o.nama.toLowerCase().includes(q)
        || o.email.toLowerCase().includes(q)
        || o.id.toLowerCase().includes(q)
        || (o.wa || '').includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, filterStatus, search])

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'nama': cmp = a.nama.localeCompare(b.nama); break
        case 'created_at': cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break
        case 'total': cmp = a.total - b.total; break
        case 'status': cmp = a.status.localeCompare(b.status); break
        case 'package_id': cmp = a.package_id.localeCompare(b.package_id); break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortField, sortDir])

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage) || 1
  const paginated = sorted.slice((page - 1) * perPage, page * perPage)

  // Reset page on filter/search change
  useEffect(() => { setPage(1) }, [search, filterStatus])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-sage-700 ml-1">{icons.sort}</span>
    return <span className="text-gold-400 ml-1">{sortDir === 'asc' ? icons.chevUp : icons.chevDown}</span>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={icons.orders} label="Total Order" value={stats.total} color="bg-sage-800" />
          <StatCard icon={icons.alert} label="Perlu Aksi" value={stats.pending + stats.menunggu_konfirmasi} color="bg-amber-900/30" />
          <StatCard icon={icons.process} label="Diproses" value={stats.diproses} color="bg-purple-900/30" />
          <StatCard icon={icons.check} label="Selesai" value={stats.selesai} color="bg-green-900/30" />
          <StatCard icon={icons.revenue} label="Revenue Bulan" value={formatRp(stats.revenue_bulan_ini)}
            sub={'Total: ' + formatRp(stats.revenue_total)} color="bg-sage-800" />
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-500">{icons.search}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, email, WA, atau Order ID..."
            className="w-full bg-sage-900 border border-sage-700 focus:border-gold-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ivory-200 outline-none transition-colors placeholder:text-sage-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['semua', 'pending', 'menunggu_konfirmasi', 'diproses', 'selesai', 'dibatalkan'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filterStatus === s
                ? 'bg-sage-800 text-gold-400 border border-sage-700'
                : 'bg-sage-900 border border-sage-800 text-sage-400 hover:border-sage-700'
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

      {/* Data Table */}
      <div className="bg-sage-900 border border-sage-800 rounded-2xl overflow-hidden">
        {/* Table header - per page selector + info */}
        <div className="px-4 py-3 border-b border-sage-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-sage-400">
            <span>Tampilkan</span>
            <select
              value={perPage}
              onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
              className="bg-sage-950 border border-sage-700 text-ivory-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-gold-500"
            >
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>data</span>
          </div>
          <p className="text-xs text-sage-500">
            {sorted.length > 0
              ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, sorted.length)} dari ${sorted.length} order`
              : '0 order'}
          </p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-sage-800 rounded animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-10 h-10 mx-auto mb-3 text-sage-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <p className="text-sage-400 font-medium">Tidak ada order ditemukan</p>
            <p className="text-sage-500 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage-800">
                    {([
                      ['Order ID', null],
                      ['Nama', 'nama'],
                      ['Paket', 'package_id'],
                      ['Total', 'total'],
                      ['Status', 'status'],
                      ['Tanggal', 'created_at'],
                      ['Aksi', null],
                    ] as [string, SortField | null][]).map(([label, field]) => (
                      <th
                        key={label}
                        onClick={() => field && toggleSort(field)}
                        className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-sage-400 ${field ? 'cursor-pointer hover:text-gold-400 select-none transition-colors' : ''}`}
                      >
                        <span className="flex items-center">
                          {label}
                          {field && <SortIcon field={field} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-800/50">
                  {paginated.map(order => {
                    const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending
                    const pkg = PKG_CFG[order.package_id] || { label: order.package_id, color: 'text-sage-400' }
                    const short = order.id.slice(0, 8).toUpperCase()
                    const nextStatuses = STATUS_FLOW[order.status] || []

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-sage-800/30 transition-colors ${updating === order.id ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-xs text-gold-400">#{short}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-ivory-200">{order.nama}</p>
                            <p className="text-sage-500 text-xs">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${pkg.color}`}>{pkg.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gold-400">{formatRp(order.total)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sage-400 text-xs">{formatDateFull(order.created_at)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onDetail(order)}
                              className="w-7 h-7 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors"
                              title="Detail"
                            >
                              {icons.eye}
                            </button>
                            <a
                              href={`https://wa.me/62${order.wa}?text=${encodeURIComponent('Halo ' + order.nama + '! Pesanan undangan digital kamu (Order #' + short + ') sedang kami proses ya')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-[#25D366] hover:border-[#25D366] transition-colors"
                              title="WhatsApp"
                            >
                              {icons.wa}
                            </a>
                            {nextStatuses.length > 0 && (
                              <select
                                onChange={e => { if (e.target.value) onStatusChange(order.id, e.target.value); e.target.value = '' }}
                                defaultValue=""
                                className="bg-sage-950 border border-sage-700 text-ivory-200 rounded-lg px-2 py-1 text-xs outline-none hover:border-gold-500 transition-colors cursor-pointer"
                              >
                                <option value="" disabled>Ubah...</option>
                                {nextStatuses.map(ns => (
                                  <option key={ns} value={ns}>
                                    {ns === 'menunggu_konfirmasi' ? 'Konfirmasi' :
                                      ns === 'diproses' ? 'Proses' :
                                        ns === 'selesai' ? 'Selesai' :
                                          ns === 'dibatalkan' ? 'Batalkan' : ns}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-sage-800/50">
              {paginated.map(order => {
                const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending
                const pkg = PKG_CFG[order.package_id] || { label: order.package_id, color: 'text-sage-400' }
                const short = order.id.slice(0, 8).toUpperCase()
                const nextStatuses = STATUS_FLOW[order.status] || []

                return (
                  <div
                    key={order.id}
                    className={`p-4 hover:bg-sage-800/20 transition-colors ${updating === order.id ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-gold-400">#{short}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                              <span className={`text-xs font-semibold ${pkg.color}`}>{pkg.label}</span>
                            </div>
                            <p className="font-semibold text-ivory-200 mt-1">{order.nama}</p>
                            <p className="text-sage-400 text-xs">
                              {order.email} · {order.wa ? '+62 ' + order.wa : '--'}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gold-400">{formatRp(order.total)}</p>
                            <p className="text-sage-500 text-xs">{formatDate(order.created_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <button
                            onClick={() => onDetail(order)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-sage-950 border border-sage-700 text-sage-300 rounded-lg hover:border-gold-500 hover:text-gold-400 transition-colors"
                          >
                            {icons.eye} Detail
                          </button>
                          <a
                            href={`https://wa.me/62${order.wa}?text=${encodeURIComponent('Halo ' + order.nama + '! Pesanan undangan digital kamu (Order #' + short + ') sedang kami proses ya')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-sage-950 border border-sage-700 text-[#25D366] rounded-lg hover:border-[#25D366] transition-colors"
                          >
                            {icons.wa} WA
                          </a>
                          {nextStatuses.map(ns => (
                            <button
                              key={ns}
                              onClick={() => onStatusChange(order.id, ns)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors border ${ns === 'dibatalkan'
                                ? 'border-red-800 text-red-400 hover:bg-red-900/20'
                                : 'border-sage-600 text-sage-200 bg-sage-800 hover:bg-sage-700'
                                }`}
                            >
                              {ns === 'menunggu_konfirmasi' ? 'Konfirmasi' :
                                ns === 'diproses' ? 'Proses' :
                                  ns === 'selesai' ? 'Selesai' :
                                    ns === 'dibatalkan' ? 'Batalkan' : ns}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-sage-800 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-sage-500">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title="First"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                </button>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  {icons.chevLeft}
                </button>
                {/* Page number buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number
                  if (totalPages <= 5) p = i + 1
                  else if (page <= 3) p = i + 1
                  else if (page >= totalPages - 2) p = totalPages - 4 + i
                  else p = page - 2 + i
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${page === p
                        ? 'bg-gold-500 text-sage-950'
                        : 'bg-sage-950 border border-sage-700 text-sage-400 hover:border-gold-500 hover:text-gold-400'
                        }`}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  {icons.chevRight}
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg bg-sage-950 border border-sage-700 flex items-center justify-center text-sage-400 hover:border-gold-500 hover:text-gold-400 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  title="Last"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
type AdminTab = 'orders' | 'templates' | 'pricing'

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Order | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<AdminTab>('orders')
  const [templateList, setTemplateList] = useState<TemplateRow[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('katresnan_admin') === '1') setAuthed(true)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    const [ordersRes, statsRes, tplRes] = await Promise.all([
      supabase.rpc('get_all_orders_admin', { p_status: null, p_limit: 200, p_offset: 0 }),
      supabase.rpc('get_order_stats'),
      supabase.from('templates').select('*').eq('is_active', true).order('sort_order'),
    ])
    if (ordersRes.data) setOrders(ordersRes.data)
    if (statsRes.data) setStats(statsRes.data)
    if (tplRes.data) setTemplateList(tplRes.data)
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
  }, [authed, loadData, showToast])

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

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const tabs: { id: AdminTab; label: string; icon: JSX.Element }[] = [
    { id: 'orders', label: 'Data Order', icon: icons.orders },
    { id: 'templates', label: 'Template', icon: icons.template },
    { id: 'pricing', label: 'Harga Paket', icon: icons.pricing },
  ]

  return (
    <div className="min-h-screen bg-sage-950 text-ivory-200">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-sage-900 border border-gold-500/60 text-ivory-200 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2" style={{ animation: 'fadeUp 0.3s ease' }}>
          <svg className="w-4 h-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>
          {toast}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <DetailModal
          order={detail}
          onClose={() => setDetail(null)}
          onStatusChange={(id, status) => { handleStatusChange(id, status); setDetail(null) }}
          templateList={templateList}
        />
      )}

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-sage-900 border-r border-sage-800 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-sage-800">
          <h1 className="font-serif font-bold text-lg text-ivory-200">Katresnan</h1>
          <p className="text-sage-500 text-xs">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === t.id
                ? 'bg-sage-800 text-gold-400 shadow-lg shadow-sage-950/50'
                : 'text-sage-400 hover:bg-sage-800/50 hover:text-ivory-200'
                }`}
            >
              {t.icon}
              {t.label}
              {t.id === 'orders' && stats && (stats.pending + stats.menunggu_konfirmasi) > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {stats.pending + stats.menunggu_konfirmasi}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sage-800 space-y-1">
          <button
            onClick={loadData}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-sage-400 hover:bg-sage-800/50 hover:text-ivory-200 transition-all"
          >
            {icons.refresh} Refresh Data
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('katresnan_admin'); setAuthed(false) }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-sage-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
          >
            {icons.logout} Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top bar */}
        <div className="border-b border-sage-800 px-4 lg:px-8 py-4 sticky top-0 bg-sage-950/95 backdrop-blur z-30 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-sage-900 border border-sage-700 flex items-center justify-center text-sage-400"
          >
            {icons.menu}
          </button>
          <div>
            <h2 className="font-serif font-bold text-lg text-ivory-200">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <p className="text-sage-500 text-xs">
              {activeTab === 'orders' ? 'Kelola semua pesanan undangan' :
                activeTab === 'templates' ? 'Tambah, edit, dan hapus template undangan' :
                  'Atur harga dan diskon paket undangan'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {activeTab === 'orders' && (
            <OrderDataTable
              orders={orders}
              stats={stats}
              loading={loading}
              onStatusChange={handleStatusChange}
              onDetail={setDetail}
              updating={updating}
            />
          )}
          {activeTab === 'templates' && (
            <TemplateManagement showToast={showToast} />
          )}
          {activeTab === 'pricing' && (
            <PricingManagement showToast={showToast} />
          )}
        </div>
      </main>
    </div>
  )
}