'use client'
import { useState, useEffect, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import KatresnanLogo from '@/components/KatresnanLogo'
import {
  insertOrder, cancelExpiredOrder, confirmOrderPayment,
  fetchPackages, fetchTemplatesByPackage,
} from '@/lib/supabase'
import type { Package, Template } from '@/lib/supabase'
import {
  savePendingOrder, getPendingOrder, clearPendingOrder,
  getRemainingMs, type PendingOrderCookie,
} from '@/lib/orderCookie'

function BankLogo({ bank, size = 40 }: { bank: string; size?: number }) {
  const cfg: Record<string, { bg: string; label: string }> = {
    bca: { bg: '#003d82', label: 'BCA' },
    bri: { bg: '#00529B', label: 'BRI' },
    bni: { bg: '#FF6600', label: 'BNI' },
  }
  const c = cfg[bank] || { bg: '#888', label: bank.toUpperCase() }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="9" fill={c.bg}/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="#fff" fontSize="12" fontWeight="900" fontFamily="Arial,sans-serif">{c.label}</text>
    </svg>
  )
}

const BANKS = [
  { id: 'bca', name: 'Bank BCA', noRek: '1234567890',    atasNama: 'Katresnan Digital', color: '#003d82' },
  { id: 'bri', name: 'Bank BRI', noRek: '0987654321098', atasNama: 'Katresnan Digital', color: '#00529B' },
  { id: 'bni', name: 'Bank BNI', noRek: '1122334455',    atasNama: 'Katresnan Digital', color: '#FF6600' },
]

type PayMethod = 'bca' | 'bri' | 'bni' | 'qris'
type Step = 'form' | 'payment' | 'success'

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}
function genUniqueCode() { return Math.floor(100 + Math.random() * 900) }
function pad(n: number) { return String(n).padStart(2, '0') }

const QRIS_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f8f9fa' rx='16'/><rect x='16' y='16' width='56' height='56' fill='none' stroke='%23222' stroke-width='4' rx='4'/><rect x='26' y='26' width='36' height='36' fill='%23222' rx='2'/><rect x='128' y='16' width='56' height='56' fill='none' stroke='%23222' stroke-width='4' rx='4'/><rect x='138' y='26' width='36' height='36' fill='%23222' rx='2'/><rect x='16' y='128' width='56' height='56' fill='none' stroke='%23222' stroke-width='4' rx='4'/><rect x='26' y='138' width='36' height='36' fill='%23222' rx='2'/><rect x='88' y='88' width='12' height='12' fill='%23222'/><rect x='108' y='88' width='12' height='12' fill='%23222'/><rect x='128' y='88' width='12' height='12' fill='%23222'/><rect x='88' y='108' width='12' height='12' fill='%23222'/><rect x='128' y='108' width='12' height='12' fill='%23222'/><rect x='88' y='128' width='12' height='12' fill='%23222'/><rect x='108' y='128' width='12' height='12' fill='%23222'/><rect x='128' y='128' width='12' height='12' fill='%23222'/><text x='100' y='192' text-anchor='middle' font-size='8' fill='%23999' font-family='sans-serif'>QRIS - Katresnan</text></svg>`

// ─── Checkout ────────────────────────────────────────────────────────────────
function CheckoutInner() {
  const params         = useSearchParams()
  const paketId        = params.get('paket') || 'silver'
  const templateIds    = (params.get('templates') || '').split(',').filter(Boolean)

  // Data dari Supabase
  const [pkg,        setPkg]        = useState<Package | null>(null)
  const [tplData,    setTplData]    = useState<Template[]>([])
  const [dataReady,  setDataReady]  = useState(false)

  // UI state
  const [step,       setStep]       = useState<Step>('form')
  const [payMethod,  setPayMethod]  = useState<PayMethod>('bca')
  const [form,       setForm]       = useState({ nama: '', email: '', wa: '', catatan: '' })
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [copied,     setCopied]     = useState<string | null>(null)
  const [orderId,    setOrderId]    = useState<string | null>(null)
  const [dbLoading,  setDbLoading]  = useState(false)
  const [dbError,    setDbError]    = useState<string | null>(null)
  const [timerMs,    setTimerMs]    = useState(30 * 60 * 1000)
  const [restored,   setRestored]   = useState(false)

  const uniqueCode    = useMemo(() => genUniqueCode(), [])
  const price         = pkg?.price ?? 0
  const totalWithCode = price + uniqueCode

  // ── Load data dari Supabase ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [pkgs, tmpls] = await Promise.all([
        fetchPackages(),
        fetchTemplatesByPackage(paketId),
      ])
      const found = pkgs.find(p => p.id === paketId)
      if (found) setPkg(found)
      setTplData(tmpls)
      setDataReady(true)
    }
    load()
  }, [paketId])

  // ── Restore session dari cookie ──────────────────────────────────────────
  useEffect(() => {
    const cookie = getPendingOrder()
    if (!cookie) return
    setStep(cookie.step)
    setPayMethod(cookie.payMethod as PayMethod)
    setOrderId(cookie.orderId)
    setForm({ nama: cookie.nama, email: cookie.email, wa: cookie.wa, catatan: cookie.catatan })
    setTimerMs(getRemainingMs(cookie))
    setRestored(true)
  }, [])

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'payment') return
    const id = setInterval(() => {
      setTimerMs(prev => {
        const next = prev - 1000
        if (next <= 0) {
          clearInterval(id)
          if (orderId) cancelExpiredOrder(orderId)
          clearPendingOrder()
          setStep('form')
          setOrderId(null)
          setDbError('Waktu pembayaran habis. Silakan pesan ulang.')
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step, orderId])

  // ── Sync cookie setiap 5 detik ───────────────────────────────────────────
  useEffect(() => {
    if (step !== 'payment' || !orderId) return
    const sync = () => savePendingOrder({
      orderId: orderId!, paket: paketId, templates: templateIds,
      payMethod, harga: price, kode_unik: uniqueCode, total: totalWithCode,
      nama: form.nama, email: form.email, wa: form.wa, catatan: form.catatan,
      expiresAt: Date.now() + timerMs, step: 'payment',
    })
    sync()
    const id = setInterval(sync, 5000)
    return () => clearInterval(id)
  }, [step, orderId, timerMs])

  // ── Submit form → insert order ───────────────────────────────────────────
  function validate() {
    const e: Record<string, string> = {}
    if (!form.nama.trim()) e.nama = 'Nama lengkap wajib diisi'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
    if (!/^[0-9]{9,13}$/.test(form.wa)) e.wa = 'Masukkan angka saja, tanpa +62 atau 0 di depan'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setDbLoading(true)
    setDbError(null)

    const { data, error } = await insertOrder({
      nama: form.nama, email: form.email, wa: form.wa,
      package_id: paketId,
      template_1_id: templateIds[0] || null,
      template_2_id: templateIds[1] || null,
      template_text_1: templateIds[0] || '',
      template_text_2: templateIds[1] || '',
      metode_bayar: payMethod,
      harga: price, kode_unik: uniqueCode, total: totalWithCode,
      status: 'pending', catatan: form.catatan,
    })

    if (error || !data?.id) {
      setDbError('Gagal menyimpan pesanan: ' + (error || 'data tidak kembali dari server'))
      setDbLoading(false)
      return
    }

    setOrderId(data.id)
    savePendingOrder({
      orderId: data.id, paket: paketId, templates: templateIds,
      payMethod, harga: price, kode_unik: uniqueCode, total: totalWithCode,
      nama: form.nama, email: form.email, wa: form.wa, catatan: form.catatan,
      expiresAt: Date.now() + 30 * 60 * 1000, step: 'payment',
    })
    setTimerMs(30 * 60 * 1000)
    setDbLoading(false)
    setStep('payment')
    window.scrollTo(0, 0)
  }

  // ── Konfirmasi bayar → update status ────────────────────────────────────
  async function handleConfirmPayment() {
    if (!orderId) return
    setDbLoading(true)
    const { error } = await confirmOrderPayment(orderId)
    if (error) { setDbError('Gagal konfirmasi. Coba lagi.'); setDbLoading(false); return }
    clearPendingOrder()
    setDbLoading(false)
    setStep('success')
    window.scrollTo(0, 0)
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const selectedBank  = BANKS.find(b => b.id === payMethod)
  const timerDanger   = timerMs < 2 * 60 * 1000
  const minutes       = Math.floor(timerMs / 60000)
  const seconds       = Math.floor((timerMs % 60000) / 1000)

  // Template tags dari data Supabase (bukan hardcode)
  const templateTags = templateIds.map(id => {
    const t = tplData.find(x => x.id === id)
    return { id, name: t?.name || id, emoji: t?.category?.emoji || '🎨' }
  })

  // Loading state saat data belum siap
  if (!dataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🌸</div>
          <p className="text-[#6b8f72] dark:text-[#7aaa90]">Memuat data pesanan...</p>
        </div>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-[#1a2e1d] dark:text-[#e8f0e8] font-bold mb-2">Paket tidak ditemukan</p>
          <Link href="/#harga" className="text-[#03554e] dark:text-[#4ecdc4] underline text-sm">Kembali ke pilihan paket</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffde8] dark:bg-[#0f1a13]">

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-[#fffde8]/95 dark:bg-[#0f1a13]/95 backdrop-blur border-b border-[#ffdce2] dark:border-[#1a3028] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/demo" className="flex items-center gap-1.5 text-[#03554e] dark:text-[#4ecdc4] hover:opacity-80 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali
          </Link>
          <div className="flex items-center gap-2">
            <KatresnanLogo variant="auto" height={26} />
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['Data','Bayar','Selesai'] as const).map((label, i) => {
              const keys: Step[] = ['form','payment','success']
              const isActive = step === keys[i]
              const isDone   = (step === 'payment' && i === 0) || step === 'success'
              return (
                <div key={label} className="flex items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone    ? 'bg-[#d4ede9] text-[#03554e] dark:bg-[#2a4a38] dark:text-[#4ecdc4]'
                    : isActive ? 'bg-[#03554e] text-white dark:bg-[#4ecdc4] dark:text-[#0f1a13]'
                    : 'bg-[#e8e8e8] text-[#8a9e8c] dark:bg-[#2a3028]'
                  }`}>{isDone ? '✓' : i+1}</div>
                  <span className="hidden sm:inline text-[11px] text-[#6b8f72]">{label}</span>
                  {i < 2 && <div className={`w-4 h-px mx-0.5 ${isDone ? 'bg-[#03554e] dark:bg-[#4ecdc4]' : 'bg-[#e8e8e8] dark:bg-[#2a4a38]'}`}/>}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Restored banner */}
        {restored && step === 'payment' && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Sesi pembayaran dipulihkan</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Pesananmu masih aktif. Selesaikan pembayaran sebelum waktu habis.</p>
            </div>
          </div>
        )}

        {/* DB error */}
        {dbError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-red-700 dark:text-red-300">{dbError}</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="max-w-lg mx-auto text-center py-12 flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-5xl" style={{ animation: 'float 3s ease-in-out infinite' }}>🎉</div>
            <div>
              <h2 className="font-display text-3xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-2">Pesanan Dikonfirmasi!</h2>
              <p className="text-[#6b8f72] dark:text-[#7aaa90] leading-relaxed">
                Terima kasih <strong className="text-[#1a2e1d] dark:text-[#e8f0e8]">{form.nama}</strong>!
                Tim kami akan memverifikasi dan menghubungi dalam <strong>1-3 jam</strong>.
              </p>
            </div>

            {/* ORDER ID — ditampilkan besar dan mencolok */}
            <div className="w-full bg-gradient-to-br from-[#03554e] to-[#057a71] rounded-3xl p-6 text-center shadow-xl">
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">🔖 Simpan Order ID Kamu</p>
              <p className="font-mono font-black text-4xl text-white tracking-[0.3em] mb-3">
                #{orderId?.slice(0,8).toUpperCase()}
              </p>
              <p className="text-white/70 text-xs mb-4 leading-relaxed">
                Gunakan kode ini untuk cek status pesanan kapan saja.<br/>
                <strong className="text-white">Screenshot halaman ini</strong> agar tidak lupa!
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderId?.slice(0,8).toUpperCase() || '')
                  setCopied('orderid')
                  setTimeout(() => setCopied(null), 2000)
                }}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${copied === 'orderid' ? 'bg-green-400 text-white' : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'}`}
              >
                {copied === 'orderid' ? '✓ Tersalin!' : '📋 Salin Order ID'}
              </button>
            </div>

            <div className="w-full bg-white dark:bg-[#1a2e1d] rounded-2xl border border-[#ffdce2] dark:border-[#2a4a38] overflow-hidden">
              <div className="bg-[#03554e] dark:bg-[#1a3028] px-5 py-3">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Ringkasan Pesanan</p>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#8a9e8c]">Paket</span><span className="font-bold text-[#1a2e1d] dark:text-[#e8f0e8]">{pkg.emoji} Paket {pkg.name}</span></div>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-[#8a9e8c] flex-shrink-0">Template</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {templateTags.map(t => (
                      <span key={t.id} className="text-xs bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] rounded-full px-2 py-0.5 font-medium text-[#03554e] dark:text-[#4ecdc4]">{t.emoji} {t.name}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between"><span className="text-[#8a9e8c]">Metode Bayar</span><span className="font-medium text-[#1a2e1d] dark:text-[#e8f0e8]">{payMethod.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-[#8a9e8c]">Kode Unik</span><span className="font-bold text-orange-500">+{formatRp(uniqueCode)}</span></div>
                <div className="pt-2 border-t border-[#ffdce2] dark:border-[#2a4a38] flex justify-between items-center">
                  <span className="font-bold text-[#1a2e1d] dark:text-[#e8f0e8]">Total Dibayar</span>
                  <span className="font-display font-bold text-xl text-[#03554e] dark:text-[#4ecdc4]">{formatRp(totalWithCode)}</span>
                </div>
              </div>
            </div>
            {/* CTA Isi Data — prioritas utama */}
            <Link href={`/isi-data?order=${orderId}`}
              className="w-full block text-center bg-[#e8879a] hover:bg-[#d4607a] text-white font-bold px-6 py-4 rounded-2xl text-sm transition-colors shadow-lg">
              ✏️ Isi Data Pengantin Sekarang →
            </Link>
            <p className="text-xs text-center text-[#8a9e8c]">Isi data pengantin agar undangan bisa segera dikerjakan</p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link href={`/order?id=${orderId?.slice(0,8).toUpperCase()}`}
                className="flex-1 border-2 border-[#03554e] dark:border-[#4ecdc4] text-[#03554e] dark:text-[#4ecdc4] font-semibold px-6 py-3 rounded-full text-sm text-center hover:bg-[#d4ede9]/30 transition-colors">
                📦 Cek Status Order
              </Link>
              <a href={`https://wa.me/6285150000715?text=${encodeURIComponent('Halo Katresnan! Saya sudah transfer.\nOrder ID: #' + (orderId?.slice(0,8).toUpperCase() || '') + '\nNama: ' + form.nama + '\nPaket: ' + pkg.name + '\nTotal: ' + formatRp(totalWithCode))}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-full text-sm text-center transition-colors flex items-center justify-center gap-2">
                💬 Kirim Bukti Transfer
              </a>
            </div>
          </div>
        )}

        {step !== 'success' && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── LEFT ── */}
            <div className="space-y-6">

              {/* FORM */}
              {step === 'form' && (
                <>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1">Detail Pemesan</h2>
                    <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm">Isi dengan benar agar proses pengerjaan lancar.</p>
                  </div>
                  <div className="bg-white dark:bg-[#1a2e1d] rounded-2xl border border-[#ffdce2] dark:border-[#2a4a38] p-6 space-y-4">
                    {/* Nama */}
                    {[
                      { key: 'nama',  label: 'Nama Lengkap', type: 'text',  placeholder: 'contoh: Budi Santoso' },
                      { key: 'email', label: 'Email Aktif',  type: 'email', placeholder: 'budi@email.com' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1.5 block uppercase tracking-wide">
                          {f.label} <span className="text-[#e8879a]">*</span>
                        </label>
                        <input type={f.type} value={(form as any)[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          className={`w-full bg-[#fffde8] dark:bg-[#111d17] border rounded-xl px-4 py-3 text-sm text-[#1a2e1d] dark:text-[#e8f0e8] outline-none transition-colors placeholder:text-[#c0c0c0] ${
                            errors[f.key] ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-[#ffdce2] dark:border-[#2a4a38] focus:border-[#03554e] dark:focus:border-[#4ecdc4]'
                          }`}/>
                        {errors[f.key] && <p className="text-xs text-red-500 mt-1">⚠️ {errors[f.key]}</p>}
                      </div>
                    ))}
                    {/* WA */}
                    <div>
                      <label className="text-xs font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1.5 block uppercase tracking-wide">
                        Nomor WhatsApp <span className="text-[#e8879a]">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] rounded-xl px-3 flex items-center text-sm text-[#6b8f72]">🇮🇩 +62</div>
                        <input type="tel" value={form.wa}
                          onChange={e => setForm({ ...form, wa: e.target.value.replace(/\D/g,'') })}
                          placeholder="812xxxxxxxx"
                          className={`flex-1 bg-[#fffde8] dark:bg-[#111d17] border rounded-xl px-4 py-3 text-sm text-[#1a2e1d] dark:text-[#e8f0e8] outline-none transition-colors placeholder:text-[#c0c0c0] ${
                            errors.wa ? 'border-red-400' : 'border-[#ffdce2] dark:border-[#2a4a38] focus:border-[#03554e] dark:focus:border-[#4ecdc4]'
                          }`}/>
                      </div>
                      {errors.wa && <p className="text-xs text-red-500 mt-1">⚠️ {errors.wa}</p>}
                    </div>
                    {/* Catatan */}
                    <div>
                      <label className="text-xs font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1.5 block uppercase tracking-wide">
                        Catatan <span className="text-[#8a9e8c] font-normal normal-case">(opsional)</span>
                      </label>
                      <textarea value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })}
                        rows={3} placeholder="nama mempelai, permintaan khusus, dll."
                        className="w-full bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] focus:border-[#03554e] rounded-xl px-4 py-3 text-sm text-[#1a2e1d] dark:text-[#e8f0e8] outline-none resize-none transition-colors placeholder:text-[#c0c0c0]"/>
                    </div>
                  </div>

                  {/* Metode Pembayaran */}
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#1a2e1d] dark:text-[#e8f0e8] mb-3">Metode Pembayaran</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                      {BANKS.map(bank => (
                        <button key={bank.id} onClick={() => setPayMethod(bank.id as PayMethod)}
                          className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left ${
                            payMethod === bank.id
                              ? 'border-[#03554e] dark:border-[#4ecdc4] bg-[#d4ede9]/30 dark:bg-[#1a3028]'
                              : 'border-[#ffdce2] dark:border-[#2a4a38] bg-white dark:bg-[#1a2e1d] hover:border-[#f9b8c4]'
                          }`}>
                          <BankLogo bank={bank.id} size={38}/>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#1a2e1d] dark:text-[#e8f0e8]">{bank.name}</p>
                            <p className="text-xs text-[#8a9e8c] truncate">{bank.noRek}</p>
                          </div>
                          {payMethod === bank.id && <span className="text-[#03554e] dark:text-[#4ecdc4] font-bold">✓</span>}
                        </button>
                      ))}
                      <button onClick={() => setPayMethod('qris')}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left ${
                          payMethod === 'qris'
                            ? 'border-[#03554e] dark:border-[#4ecdc4] bg-[#d4ede9]/30 dark:bg-[#1a3028]'
                            : 'border-[#ffdce2] dark:border-[#2a4a38] bg-white dark:bg-[#1a2e1d] hover:border-[#f9b8c4]'
                        }`}>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#03554e] to-[#e8879a] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">QR</div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-[#1a2e1d] dark:text-[#e8f0e8]">QRIS</p>
                          <p className="text-xs text-[#8a9e8c]">GoPay, OVO, Dana, dll</p>
                        </div>
                        {payMethod === 'qris' && <span className="text-[#03554e] dark:text-[#4ecdc4] font-bold">✓</span>}
                      </button>
                    </div>
                  </div>

                  <button onClick={handleSubmit} disabled={dbLoading}
                    className="w-full bg-[#03554e] hover:bg-[#023d38] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
                    {dbLoading
                      ? <><span className="animate-spin text-xl">⏳</span> Menyimpan pesanan...</>
                      : <>Lanjut ke Pembayaran <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg></>
                    }
                  </button>
                </>
              )}

              {/* PAYMENT */}
              {step === 'payment' && (
                <>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-1">
                      {payMethod === 'qris' ? '📱 Bayar via QRIS' : 'Transfer ' + selectedBank?.name}
                    </h2>
                    <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm">Selesaikan sebelum waktu habis.</p>
                  </div>

                  {/* Timer */}
                  <div className={`flex items-center justify-between px-5 py-3 rounded-xl border ${timerDanger ? 'bg-red-50 dark:bg-red-900/20 border-red-300' : 'bg-[#fff8e1] dark:bg-[#2a2500]/40 border-yellow-200 dark:border-yellow-900/40'}`}>
                    <div>
                      <p className={`text-sm font-semibold ${timerDanger ? 'text-red-600 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>⏱️ Batas waktu pembayaran</p>
                      <p className="text-xs text-[#8a9e8c] mt-0.5">Otomatis dibatalkan jika waktu habis</p>
                    </div>
                    <span className={`font-mono font-bold text-3xl tabular-nums ${timerDanger ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-yellow-700 dark:text-yellow-400'}`}>
                      {pad(minutes)}:{pad(seconds)}
                    </span>
                  </div>

                  {/* Kode unik */}
                  <div className="bg-orange-50 dark:bg-orange-900/15 border border-orange-200 dark:border-orange-800/40 rounded-xl px-5 py-3 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">🔑</span>
                    <div>
                      <p className="text-sm font-bold text-orange-700 dark:text-orange-400">Kode Unik Transfer</p>
                      <p className="text-xs text-orange-600 dark:text-orange-500 mt-0.5">
                        Sudah ditambahkan kode unik <strong>+{formatRp(uniqueCode)}</strong>. Transfer nominal <strong>tepat</strong> agar terverifikasi otomatis.
                      </p>
                    </div>
                  </div>

                  {/* Bank */}
                  {payMethod !== 'qris' && selectedBank && (
                    <div className="bg-white dark:bg-[#1a2e1d] rounded-2xl border border-[#ffdce2] dark:border-[#2a4a38] overflow-hidden">
                      <div className="px-5 py-4 flex items-center gap-3" style={{ background: selectedBank.color }}>
                        <BankLogo bank={selectedBank.id} size={44}/>
                        <div>
                          <p className="text-white font-bold text-lg">{selectedBank.name}</p>
                          <p className="text-white/70 text-xs">a.n. {selectedBank.atasNama}</p>
                        </div>
                      </div>
                      <div className="p-6 space-y-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a9e8c] mb-2">Nomor Rekening</p>
                          <div className="flex items-center gap-3 bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] rounded-xl px-4 py-3">
                            <span className="font-mono font-bold text-base sm:text-xl tracking-widest text-[#1a2e1d] dark:text-[#e8f0e8] flex-1 break-all">{selectedBank.noRek}</span>
                            <button onClick={() => copy(selectedBank.noRek, 'norek')}
                              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex-shrink-0 ${copied === 'norek' ? 'bg-green-500 text-white' : 'bg-[#ffdce2] dark:bg-[#2a4a38] text-[#03554e] dark:text-[#4ecdc4] hover:bg-[#f9b8c4]'}`}>
                              {copied === 'norek' ? '✓ Disalin' : 'Salin'}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a9e8c] mb-2">Jumlah Transfer (Wajib Tepat)</p>
                          <div className="flex items-center gap-3 bg-[#fffde8] dark:bg-[#111d17] border-2 border-[#03554e]/30 dark:border-[#4ecdc4]/20 rounded-xl px-4 py-3">
                            <div className="flex-1">
                              <p className="font-mono font-bold text-xl sm:text-2xl text-[#03554e] dark:text-[#4ecdc4]">{formatRp(totalWithCode)}</p>
                              <p className="text-[10px] text-[#8a9e8c] mt-0.5">Harga {formatRp(price)} + kode unik {formatRp(uniqueCode)}</p>
                            </div>
                            <button onClick={() => copy(String(totalWithCode), 'amount')}
                              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex-shrink-0 ${copied === 'amount' ? 'bg-green-500 text-white' : 'bg-[#ffdce2] dark:bg-[#2a4a38] text-[#03554e] dark:text-[#4ecdc4] hover:bg-[#f9b8c4]'}`}>
                              {copied === 'amount' ? '✓ Disalin' : 'Salin'}
                            </button>
                          </div>
                          <p className="text-xs text-orange-500 mt-1.5">⚠️ Transfer jumlah tepat agar pesanan terverifikasi.</p>
                        </div>
                        <div className="space-y-2">
                          {['Buka aplikasi mobile banking atau ATM','Pilih Transfer ke rekening ' + selectedBank.name,'Masukkan nomor rekening di atas','Transfer tepat ' + formatRp(totalWithCode),'Konfirmasi dan simpan bukti transfer','Klik tombol konfirmasi di bawah'].map((s,i) => (
                            <div key={i} className={`flex items-start gap-3 text-xs ${i===3 ? 'font-bold text-[#03554e] dark:text-[#4ecdc4]' : 'text-[#6b8f72] dark:text-[#7aaa90]'}`}>
                              <span className="w-5 h-5 bg-[#d4ede9] dark:bg-[#2a4a38] text-[#03554e] dark:text-[#4ecdc4] rounded-full flex items-center justify-center font-bold flex-shrink-0 text-[10px] mt-0.5">{i+1}</span>
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QRIS */}
                  {payMethod === 'qris' && (
                    <div className="bg-white dark:bg-[#1a2e1d] rounded-2xl border border-[#ffdce2] dark:border-[#2a4a38] p-6 flex flex-col items-center gap-4">
                      <p className="text-sm text-[#6b8f72] text-center">Scan QR Code dengan aplikasi e-wallet</p>
                      <div className="p-3 bg-white rounded-2xl shadow border border-gray-100">
                        <img src={QRIS_SVG} alt="QRIS" className="w-48 h-48"/>
                      </div>
                      <div className="bg-[#fffde8] dark:bg-[#111d17] rounded-xl px-6 py-3 text-center w-full">
                        <p className="text-xs text-[#8a9e8c] mb-1">Total yang harus dibayar</p>
                        <p className="font-display font-bold text-2xl text-[#03554e] dark:text-[#4ecdc4]">{formatRp(totalWithCode)}</p>
                        <p className="text-[10px] text-orange-500 mt-0.5">{formatRp(price)} + kode unik {formatRp(uniqueCode)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['GoPay','OVO','Dana','ShopeePay','LinkAja'].map(app => (
                          <span key={app} className="text-xs bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] rounded-full px-3 py-1 text-[#6b8f72]">{app}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={handleConfirmPayment} disabled={dbLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
                    {dbLoading ? <><span className="animate-spin">⏳</span> Mengkonfirmasi...</> : '✅ Saya Sudah Bayar — Konfirmasi Sekarang'}
                  </button>
                  <p className="text-xs text-center text-[#8a9e8c]">
                    Ada masalah?{' '}
                    <a href="https://wa.me/6285150000715" target="_blank" rel="noopener noreferrer" className="text-[#03554e] dark:text-[#4ecdc4] underline font-medium">Chat WhatsApp kami</a>
                  </p>
                </>
              )}
            </div>

            {/* ── RIGHT: Summary — data dari Supabase ── */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white dark:bg-[#1a2e1d] rounded-2xl border border-[#ffdce2] dark:border-[#2a4a38] overflow-hidden">
                <div className="bg-gradient-to-r from-[#03554e] to-[#057a71] dark:from-[#1a3028] dark:to-[#0f2e26] p-5">
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Ringkasan Pesanan</p>
                  <p className="text-white font-display font-bold text-xl">{pkg.emoji} Paket {pkg.name}</p>
                  <p className="text-white/60 text-xs mt-0.5">🕐 Aktif {pkg.masa_aktif}</p>
                  {orderId && <p className="text-white/40 text-[10px] mt-1 font-mono">#{orderId.slice(0,8).toUpperCase()}</p>}
                </div>
                <div className="p-5 space-y-4">
                  {templateTags.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a9e8c] mb-2">Template Dipilih</p>
                      <div className="flex flex-wrap gap-1.5">
                        {templateTags.map(t => (
                          <span key={t.id} className="inline-flex items-center gap-1 text-xs bg-[#fffde8] dark:bg-[#111d17] border border-[#ffdce2] dark:border-[#2a4a38] text-[#03554e] dark:text-[#4ecdc4] font-medium rounded-full px-3 py-1">
                            {t.emoji} {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Fitur dari Supabase */}
                  <div className="bg-[#fffde8] dark:bg-[#111d17] rounded-xl p-3 space-y-1.5">
                    {pkg.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[#6b8f72] dark:text-[#7aaa90]">
                        <span className="text-[#03554e] dark:text-[#4ecdc4] font-bold flex-shrink-0">✓</span>{f}
                      </div>
                    ))}
                  </div>
                  {/* Harga dari Supabase */}
                  <div className="space-y-2 pt-1 border-t border-[#ffdce2] dark:border-[#2a4a38]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8a9e8c]">Harga normal</span>
                      <span className="line-through text-[#8a9e8c]">{formatRp(pkg.original_price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">🎉 Diskon {pkg.discount}%</span>
                      <span className="text-green-600 font-medium">- {formatRp(pkg.original_price - price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8a9e8c]">Biaya admin</span>
                      <span className="text-green-600 font-medium">GRATIS</span>
                    </div>
                    {step === 'payment' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-500 font-medium">🔑 Kode unik</span>
                        <span className="text-orange-500 font-medium">+ {formatRp(uniqueCode)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-[#ffdce2] dark:border-[#2a4a38]">
                      <span className="font-bold text-[#1a2e1d] dark:text-[#e8f0e8]">Total Bayar</span>
                      <div className="text-right">
                        <p className="font-display font-bold text-xl text-[#03554e] dark:text-[#4ecdc4]">
                          {formatRp(step === 'payment' ? totalWithCode : price)}
                        </p>
                        {step === 'payment' && <p className="text-[10px] text-orange-500">termasuk kode unik</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['🔒 Aman','⚡ Cepat','🛡️ Terpercaya'].map(b => (
                  <div key={b} className="bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-xl py-2 text-center text-xs text-[#6b8f72] dark:text-[#7aaa90]">{b}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CheckoutContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fffde8] dark:bg-[#0f1a13]">
        <div className="text-center">
          <div className="text-4xl mb-3" style={{ animation: 'float 2s ease-in-out infinite' }}>🌸</div>
          <p className="text-[#6b8f72]">Memuat...</p>
        </div>
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  )
}