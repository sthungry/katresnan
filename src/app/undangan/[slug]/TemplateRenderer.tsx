'use client'
// ============================================================
// KATRESNAN — Template Engine Renderer
// Baca theme + layout → render section yang sesuai
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingData, Theme, Layout, SectionProps, Ucapan } from './types'
import { getTheme } from './themes/registry'
import { getLayout } from './layouts/registry'
import { getTemplate } from './templates/registry'

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function fmt(iso: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', opts ?? {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}
export function fmtJam(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB'
}
export function parentLabel(nama: string, status: string) {
  if (!nama) return ''
  const prefix = status === 'alm' ? 'Alm. ' : status === 'almh' ? 'Almh. ' : ''
  return prefix + nama
}
export function gcalUrl(w: WeddingData) {
  const start = w.resepsi_tanggal ? new Date(w.resepsi_tanggal) : new Date()
  const end   = new Date(start.getTime() + 3 * 60 * 60 * 1000)
  const f     = (d: Date) => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')
  const title = encodeURIComponent(`Pernikahan ${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan}`)
  const loc   = encodeURIComponent(`${w.resepsi_lokasi} | ${w.resepsi_alamat}`)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${f(start)}/${f(end)}&location=${loc}`
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
export function useCountdown(target: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: false })
  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setT({ d:0, h:0, m:0, s:0, done: true }); return }
      setT({ d: Math.floor(diff/86400000), h: Math.floor(diff%86400000/3600000), m: Math.floor(diff%3600000/60000), s: Math.floor(diff%60000/1000), done: false })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return t
}

// ─── Theme-aware components ───────────────────────────────────────────────────
export function Divider({ theme }: { theme: Theme }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.colors.border}, transparent)` }}/>
      <span style={{ color: theme.colors.primary }}>{theme.ornaments.divider}</span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.colors.border}, transparent)` }}/>
    </div>
  )
}

export function SectionTitle({ label, title, theme }: { label: string; title: string; theme: Theme }) {
  return (
    <div className="text-center mb-8">
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.colors.primary }}>{label}</p>
      <h2 className="text-2xl font-bold" style={{ color: theme.colors.text, fontFamily: `'${theme.fonts.display}', serif` }}>
        {title}
      </h2>
      <Divider theme={theme}/>
    </div>
  )
}

// ─── Section: Cover ───────────────────────────────────────────────────────────
export function SectionCover({ wedding: w, theme, layout, onOpen, playing, onToggleMusic }: SectionProps & {
  onOpen: () => void; playing: boolean; onToggleMusic: () => void
}) {
  const coverPhoto = w.foto_urls?.[0] || ''
  const isSplit    = layout.config.coverStyle === 'split'

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: coverPhoto ? undefined : `linear-gradient(135deg, ${theme.colors.bgAlt}, ${theme.colors.bg})` }}>
      {coverPhoto && (
        <div className="absolute inset-0">
          <img src={coverPhoto} alt="cover" className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)' }}/>
        </div>
      )}

      {/* Falling petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {theme.ornaments.petal.map((p, i) => (
          <span key={i} className="absolute text-2xl select-none"
            style={{ left: `${10 + i * 18}%`, top: '-30px', opacity: 0.7, animation: `petalFall ${10 + i * 2}s linear ${i * 1.5}s infinite` }}>
            {p}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center px-6 py-16 max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: coverPhoto ? 'rgba(255,255,255,0.8)' : theme.colors.textMuted }}>
          The Wedding of
        </p>

        <h1 className="text-5xl sm:text-6xl font-bold mb-1 drop-shadow-lg"
          style={{ fontFamily: `'${theme.fonts.script}', cursive`, color: coverPhoto ? '#ffffff' : theme.colors.primary }}>
          {w.pria_nama_panggilan || 'Nama Pria'}
        </h1>
        <p className="text-2xl my-1" style={{ color: coverPhoto ? 'rgba(255,255,255,0.7)' : theme.colors.border }}>&amp;</p>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 drop-shadow-lg"
          style={{ fontFamily: `'${theme.fonts.script}', cursive`, color: coverPhoto ? '#ffffff' : theme.colors.primary }}>
          {w.wanita_nama_panggilan || 'Nama Wanita'}
        </h1>

        {w.resepsi_tanggal && (
          <p className="text-sm tracking-widest uppercase mb-8"
            style={{ color: coverPhoto ? 'rgba(255,255,255,0.75)' : theme.colors.textMuted }}>
            {fmt(w.resepsi_tanggal, { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        <button onClick={onOpen}
          className="font-semibold px-10 py-3 rounded-full transition-all text-sm tracking-widest uppercase shadow-lg hover:scale-105 active:scale-95 border"
          style={{
            background: coverPhoto ? 'rgba(255,255,255,0.15)' : theme.colors.primary,
            borderColor: coverPhoto ? 'rgba(255,255,255,0.5)' : theme.colors.primary,
            color: coverPhoto ? '#ffffff' : '#ffffff',
            backdropFilter: 'blur(8px)',
          }}>
          Open Invitation 💌
        </button>
      </div>

      {/* Music toggle */}
      <button onClick={onToggleMusic}
        className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-lg border transition-all"
        style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.4)', color: '#fff', backdropFilter: 'blur(8px)' }}>
        {playing ? '🎵' : '🔇'}
      </button>
    </div>
  )
}

// ─── Section: Pembuka ─────────────────────────────────────────────────────────
export function SectionPembuka({ wedding: w, theme }: SectionProps) {
  return (
    <section className="py-16 px-6 text-center" style={{ background: theme.colors.bg }}>
      <p className="text-sm italic mb-4 leading-relaxed max-w-sm mx-auto"
        style={{ color: theme.colors.textMuted, fontFamily: `'${theme.fonts.display}', serif` }}>
        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri,
        supaya kamu cenderung dan merasa tenteram kepadanya."
      </p>
      <p className="text-xs mb-6" style={{ color: theme.colors.border }}>— QS. Ar-Rum: 21</p>
      <Divider theme={theme}/>
      <p className="text-sm leading-relaxed max-w-md mx-auto mt-6" style={{ color: theme.colors.textMuted }}>
        Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan putra-putri kami.
      </p>
    </section>
  )
}

// ─── Section: Mempelai ───────────────────────────────────────────────────────
export function SectionMempelai({ wedding: w, theme, layout }: SectionProps) {
  const side = layout.config.mempelaiStyle === 'side-by-side'

  const MempelaiCard = ({ type }: { type: 'pria' | 'wanita' }) => {
    const isPria = type === 'pria'
    const foto   = isPria ? w.foto_urls?.[1] : w.foto_urls?.[2]
    const nama   = isPria ? (w.pria_nama_lengkap || w.pria_nama_panggilan) : (w.wanita_nama_lengkap || w.wanita_nama_panggilan)
    const gelar  = isPria ? w.pria_gelar : w.wanita_gelar
    const ayah   = isPria ? parentLabel(w.pria_nama_ayah, w.pria_status_ayah) : parentLabel(w.wanita_nama_ayah, w.wanita_status_ayah)
    const ibu    = isPria ? parentLabel(w.pria_nama_ibu, w.pria_status_ibu) : parentLabel(w.wanita_nama_ibu, w.wanita_status_ibu)
    const emoji  = isPria ? '🤵' : '👰'
    const label  = isPria ? 'The Groom' : 'The Bride'

    return (
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: theme.colors.primary }}>{label}</p>
        <div className="w-36 h-36 rounded-full mx-auto mb-4 overflow-hidden shadow-lg"
          style={{ border: `4px solid ${theme.colors.border}` }}>
          {foto ? <img src={foto} alt={nama} className="w-full h-full object-cover"/> :
            <div className="w-full h-full flex items-center justify-center text-5xl"
              style={{ background: theme.colors.highlight }}>{emoji}</div>}
        </div>
        <h3 className="text-xl font-bold mb-1"
          style={{ color: theme.colors.text, fontFamily: `'${theme.fonts.display}', serif` }}>
          {gelar ? `${gelar} ` : ''}{nama}
        </h3>
        {(ayah || ibu) && (
          <p className="text-xs leading-relaxed" style={{ color: theme.colors.textMuted }}>
            {isPria ? 'Putra' : 'Putri'} dari {ayah}{ibu ? ` & ${ibu}` : ''}
          </p>
        )}
      </div>
    )
  }

  return (
    <section className="py-16 px-6" style={{ background: theme.colors.bgAlt }}>
      <SectionTitle label="Groom & Bride" title="Yang Akan Menikah" theme={theme}/>
      <div className={`max-w-lg mx-auto ${side ? 'flex gap-8 items-start justify-center' : 'space-y-10'}`}>
        <MempelaiCard type="pria"/>
        <div className={`text-center ${side ? 'flex items-center' : ''}`}>
          <span className="text-4xl font-bold" style={{ color: theme.colors.border, fontFamily: `'${theme.fonts.script}', cursive` }}>&</span>
        </div>
        <MempelaiCard type="wanita"/>
      </div>
    </section>
  )
}

// ─── Section: Cerita ─────────────────────────────────────────────────────────
export function SectionCerita({ wedding: w, theme }: SectionProps) {
  if (!w.fitur_cerita_cinta || !w.cerita_pertemuan) return null
  return (
    <section className="py-16 px-6" style={{ background: theme.colors.bg }}>
      <div className="max-w-lg mx-auto">
        <SectionTitle label="Our Love Story" title="Cerita Kami" theme={theme}/>
        <div className="rounded-3xl p-6 text-sm leading-relaxed mb-6" style={{ background: theme.colors.bgAlt, color: theme.colors.textMuted, border: `1px solid ${theme.colors.border}30` }}>
          {w.cerita_pertemuan}
        </div>
        {(w.tanggal_jadian || w.tanggal_lamaran) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {w.tanggal_jadian && (
              <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: theme.colors.highlight, border: `1px solid ${theme.colors.border}40` }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.primary }}>💕 Jadian</p>
                <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                  {fmt(w.tanggal_jadian, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
            {w.tanggal_lamaran && (
              <div className="flex-1 rounded-2xl p-4 text-center" style={{ background: theme.colors.highlight, border: `1px solid ${theme.colors.border}40` }}>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: theme.colors.primary }}>💍 Lamaran</p>
                <p className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                  {fmt(w.tanggal_lamaran, { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Section: Countdown ───────────────────────────────────────────────────────
export function SectionCountdown({ wedding: w, theme }: SectionProps) {
  const target = w.resepsi_tanggal || w.akad_tanggal
  const { d, h, m, s, done } = useCountdown(target)
  const isDark = theme.darkSections?.includes('countdown')

  const bg    = isDark ? theme.colors.bgDark : theme.colors.bgAlt
  const color = isDark ? theme.colors.textLight : theme.colors.text
  const muted = isDark ? 'rgba(255,255,255,0.6)' : theme.colors.textMuted

  return (
    <section className="py-16 px-6 text-center" style={{ background: bg }}>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.colors.primary }}>Save the Date</p>
      <h2 className="text-2xl font-bold mb-2" style={{ color, fontFamily: `'${theme.fonts.display}', serif` }}>
        {w.pria_nama_panggilan} & {w.wanita_nama_panggilan}
      </h2>
      {w.resepsi_tanggal && <p className="text-sm mb-8" style={{ color: muted }}>{fmt(w.resepsi_tanggal)}</p>}

      {done ? (
        <p className="text-xl font-semibold" style={{ color }}>🎉 Hari Bahagia Telah Tiba!</p>
      ) : (
        <div className="flex justify-center gap-3 mb-8">
          {[['d',d,'Hari'],['h',h,'Jam'],['m',m,'Menit'],['s',s,'Detik']].map(([k,val,lbl]) => (
            <div key={String(k)} className="rounded-2xl w-16 sm:w-20 py-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="font-bold text-2xl sm:text-3xl font-mono tabular-nums" style={{ color }}>
                {String(val).padStart(2,'0')}
              </p>
              <p className="text-[10px] uppercase tracking-wide mt-1" style={{ color: muted }}>{String(lbl)}</p>
            </div>
          ))}
        </div>
      )}
      <a href={gcalUrl(w)} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-lg"
        style={{ background: theme.colors.primary, color: '#ffffff' }}>
        📅 Add to Calendar
      </a>
    </section>
  )
}

// ─── Section: Acara ───────────────────────────────────────────────────────────
export function SectionAcara({ wedding: w, theme, layout }: SectionProps) {
  const isTimeline = layout.config.acara === 'timeline'

  const AcaraItem = ({ type }: { type: 'akad' | 'resepsi' }) => {
    const isAkad   = type === 'akad'
    const tanggal  = isAkad ? w.akad_tanggal : w.resepsi_tanggal
    const lokasi   = isAkad ? w.akad_lokasi : w.resepsi_lokasi
    const alamat   = isAkad ? w.akad_alamat : w.resepsi_alamat
    const maps     = isAkad ? w.akad_maps_url : w.resepsi_maps_url
    if (!tanggal) return null

    return (
      <div className="rounded-3xl p-6 shadow-sm text-center" style={{ background: theme.colors.bg, border: `1px solid ${theme.colors.border}40` }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mx-auto mb-3"
          style={{ background: theme.colors.highlight }}>
          {isAkad ? '🕌' : '🎊'}
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.text, fontFamily: `'${theme.fonts.display}', serif` }}>
          {isAkad ? 'Akad Nikah' : 'Resepsi Pernikahan'}
        </h3>
        <p className="text-sm font-semibold mb-1" style={{ color: theme.colors.primary }}>{fmt(tanggal)}</p>
        <p className="text-sm mb-1" style={{ color: theme.colors.textMuted }}>{fmtJam(tanggal)}</p>
        <p className="font-semibold text-sm" style={{ color: theme.colors.text }}>{lokasi}</p>
        {alamat && <p className="text-xs mt-1 leading-relaxed" style={{ color: theme.colors.textMuted }}>{alamat}</p>}
        {maps && (
          <a href={maps} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: theme.colors.highlight, color: theme.colors.primary }}>
            📍 Lihat Maps
          </a>
        )}
      </div>
    )
  }

  return (
    <section className="py-16 px-6" style={{ background: theme.colors.bgAlt }}>
      <div className="max-w-lg mx-auto">
        <SectionTitle label="It's the Day!" title="Detail Acara" theme={theme}/>
        <div className="space-y-4">
          <AcaraItem type="akad"/>
          <AcaraItem type="resepsi"/>
        </div>
      </div>
    </section>
  )
}

// ─── Section: Galeri ─────────────────────────────────────────────────────────
export function SectionGaleri({ wedding: w, theme, layout }: SectionProps) {
  const fotos = w.foto_urls || []
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  if (!fotos.length) return null

  const isSlideshow = layout.config.galeriFeed === 'slideshow'
  const isGrid      = layout.config.galeriFeed === 'grid'

  useEffect(() => {
    if (!isSlideshow) return
    const id = setInterval(() => setSlide(s => (s + 1) % fotos.length), 3500)
    return () => clearInterval(id)
  }, [isSlideshow, fotos.length])

  return (
    <section className="py-16 px-4" style={{ background: theme.colors.bg }}>
      <SectionTitle label="Gallery" title={`${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan}`} theme={theme}/>

      {isSlideshow ? (
        <div className="max-w-sm mx-auto relative overflow-hidden rounded-3xl shadow-xl" style={{ aspectRatio: '3/4' }}>
          {fotos.map((url, i) => (
            <img key={url} src={url} alt="" onClick={() => setLightbox(i)}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 cursor-pointer"
              style={{ opacity: i === slide ? 1 : 0 }}/>
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {fotos.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === slide ? theme.colors.primary : 'rgba(255,255,255,0.5)' }}/>
            ))}
          </div>
        </div>
      ) : isGrid ? (
        <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
          {fotos.map((url, i) => (
            <div key={url} className="aspect-square overflow-hidden rounded-2xl cursor-pointer group" onClick={() => setLightbox(i)}>
              <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            </div>
          ))}
        </div>
      ) : (
        // Masonry
        <div className="max-w-lg mx-auto columns-2 sm:columns-3 gap-2 space-y-2">
          {fotos.map((url, i) => (
            <div key={url} className="break-inside-avoid cursor-pointer group" onClick={() => setLightbox(i)}>
              <div className="overflow-hidden rounded-2xl">
                <img src={url} alt="" className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1/1' : '4/3' }}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>×</button>
          <button className="absolute left-4 text-white text-4xl px-4"
            onClick={e => { e.stopPropagation(); setLightbox(l => l! > 0 ? l! - 1 : fotos.length - 1) }}>‹</button>
          <img src={fotos[lightbox]} alt="" className="max-h-[85vh] max-w-full rounded-2xl object-contain" onClick={e => e.stopPropagation()}/>
          <button className="absolute right-4 text-white text-4xl px-4"
            onClick={e => { e.stopPropagation(); setLightbox(l => l! < fotos.length - 1 ? l! + 1 : 0) }}>›</button>
        </div>
      )}
    </section>
  )
}

// ─── Section: RSVP & Ucapan ───────────────────────────────────────────────────
export function SectionRSVP({ wedding: w, theme }: SectionProps) {
  const [form,    setForm]    = useState({ nama: '', ucapan: '', hadir: 'hadir' })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [list,    setList]    = useState<Ucapan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('ucapan').select('*').eq('order_id', w.order_id)
      .order('created_at', { ascending: false }).limit(30)
      .then(({ data }) => { if (data) setList(data as Ucapan[]); setLoading(false) })
  }, [w.order_id])

  async function submit() {
    if (!form.nama.trim() || !form.ucapan.trim()) return
    setSending(true)
    const { data } = await supabase.from('ucapan').insert({ order_id: w.order_id, ...form }).select().single()
    if (data) setList(prev => [data as Ucapan, ...prev])
    setSent(true); setSending(false); setForm({ nama: '', ucapan: '', hadir: 'hadir' })
    setTimeout(() => setSent(false), 3000)
  }

  const inputStyle = {
    background: theme.colors.bgAlt,
    border: `1px solid ${theme.colors.border}80`,
    color: theme.colors.text,
    outline: 'none',
  }

  return (
    <section className="py-16 px-6" style={{ background: theme.colors.bg }}>
      <div className="max-w-lg mx-auto">
        <SectionTitle label="RSVP & Ucapan" title="Buku Tamu" theme={theme}/>
        <div className="rounded-3xl p-6 mb-6 shadow-sm" style={{ background: theme.colors.bgAlt, border: `1px solid ${theme.colors.border}40` }}>
          <div className="space-y-3">
            <input value={form.nama} onChange={e => setForm(f => ({...f, nama: e.target.value}))}
              placeholder="Nama kamu *" className="w-full rounded-2xl px-4 py-3 text-sm"
              style={{ ...inputStyle, borderRadius: '12px' }}/>
            <textarea value={form.ucapan} onChange={e => setForm(f => ({...f, ucapan: e.target.value}))}
              placeholder="Tulis ucapan & doa... *" rows={3}
              className="w-full rounded-2xl px-4 py-3 text-sm resize-none"
              style={{ ...inputStyle, borderRadius: '12px' }}/>
            <div className="flex gap-2">
              {[['hadir','✅ Hadir'],['tidak','❌ Tidak Hadir'],['ragu','🤔 Mungkin']].map(([v,l]) => (
                <button key={v} onClick={() => setForm(f => ({...f, hadir: v}))}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: form.hadir === v ? theme.colors.primary : theme.colors.bg, color: form.hadir === v ? '#fff' : theme.colors.textMuted, border: `1px solid ${theme.colors.border}60` }}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={submit} disabled={sending || !form.nama || !form.ucapan}
              className="w-full font-semibold py-3 rounded-2xl text-sm transition-colors disabled:opacity-50"
              style={{ background: theme.colors.primary, color: '#ffffff' }}>
              {sent ? '✓ Terkirim!' : sending ? 'Mengirim...' : 'Kirim Ucapan 💌'}
            </button>
          </div>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loading ? <p className="text-center text-sm py-4" style={{ color: theme.colors.textMuted }}>Memuat ucapan...</p>
          : list.length === 0 ? <p className="text-center text-sm py-4" style={{ color: theme.colors.textMuted }}>Jadilah yang pertama memberi ucapan 💕</p>
          : list.map(u => (
            <div key={u.id} className="rounded-2xl px-4 py-3" style={{ background: theme.colors.bgAlt, border: `1px solid ${theme.colors.border}30` }}>
              <div className="flex justify-between mb-1">
                <p className="font-semibold text-sm" style={{ color: theme.colors.text }}>{u.nama}</p>
                <span>{u.hadir === 'hadir' ? '✅' : u.hadir === 'tidak' ? '❌' : '🤔'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>{u.ucapan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Amplop ─────────────────────────────────────────────────────────
export function SectionAmplop({ wedding: w, theme }: SectionProps) {
  const [copied, setCopied] = useState<string | null>(null)
  if (!w.fitur_amplop_digital || !w.rekening_list?.length) return null

  const isDark = theme.darkSections?.includes('amplop')
  const bg     = isDark ? theme.colors.bgDark : theme.colors.bgAlt
  const color  = isDark ? theme.colors.textLight : theme.colors.text
  const muted  = isDark ? 'rgba(255,255,255,0.6)' : theme.colors.textMuted

  const grouped = {
    pria:    w.rekening_list.filter(r => r.kategori === 'pria'),
    wanita:  w.rekening_list.filter(r => r.kategori === 'wanita'),
    bersama: w.rekening_list.filter(r => r.kategori === 'bersama'),
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="py-16 px-6 text-center" style={{ background: bg }}>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.colors.primary }}>Wedding Gift</p>
      <h2 className="text-2xl font-bold mb-3" style={{ color, fontFamily: `'${theme.fonts.display}', serif` }}>Amplop Digital</h2>
      <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: muted }}>
        Kehadiran dan doa restu kalian sudah lebih dari cukup. Namun jika ingin memberi hadiah, kami sediakan amplop digital.
      </p>
      <div className="max-w-lg mx-auto space-y-6 text-left">
        {(['pria','wanita','bersama'] as const).map(cat => {
          const list = grouped[cat]; if (!list.length) return null
          const label = cat === 'pria' ? `🤵 ${w.pria_nama_panggilan}` : cat === 'wanita' ? `👰 ${w.wanita_nama_panggilan}` : '💍 Bersama'
          return (
            <div key={cat}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.colors.primary }}>{label}</p>
              <div className="space-y-3">
                {list.map(r => (
                  <div key={r.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid rgba(255,255,255,0.2)` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm" style={{ color: theme.colors.primary }}>{r.bank}</p>
                        <p className="font-mono text-lg font-bold tracking-widest mt-0.5" style={{ color }}>{r.nomor}</p>
                        <p className="text-xs mt-0.5" style={{ color: muted }}>a.n. {r.nama}</p>
                      </div>
                      <button onClick={() => copy(r.nomor, r.id)}
                        className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{ background: copied === r.id ? '#22c55e' : 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                        {copied === r.id ? '✓ Disalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      {w.alamat_kado && (
        <div className="mt-6 rounded-2xl p-4 max-w-lg mx-auto text-left" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.colors.primary }}>📦 Alamat Kado</p>
          <p className="text-sm" style={{ color: muted }}>{w.alamat_kado}</p>
        </div>
      )}
    </section>
  )
}

// ─── Section: Closing ─────────────────────────────────────────────────────────
export function SectionClosing({ wedding: w, theme }: SectionProps) {
  const shareText = encodeURIComponent(`Hai! Kamu diundang ke pernikahan ${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan} 💍\n${typeof window !== 'undefined' ? window.location.href : ''}`)
  return (
    <section className="py-16 px-6 text-center relative overflow-hidden" style={{ background: theme.colors.bgAlt }}>
      <div className="relative z-10 max-w-md mx-auto">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: theme.colors.primary }}>Thank You</p>
        <h2 className="text-2xl font-bold mb-3" style={{ color: theme.colors.text, fontFamily: `'${theme.fonts.display}', serif` }}>Terima Kasih</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: theme.colors.textMuted }}>
          Terima kasih atas doa dan kehadiran Bapak/Ibu/Saudara/i. Kehadiran kalian adalah kebahagiaan terbesar kami.
        </p>
        <h3 className="text-3xl font-bold mb-6"
          style={{ color: theme.colors.primary, fontFamily: `'${theme.fonts.script}', cursive` }}>
          {w.pria_nama_panggilan} & {w.wanita_nama_panggilan}
        </h3>
        <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-sm transition-colors shadow-lg mb-4"
          style={{ background: '#25D366', color: '#ffffff' }}>
          💬 Bagikan via WhatsApp
        </a>
        {w.hashtag_instagram && <p className="text-sm" style={{ color: theme.colors.primary }}>{w.hashtag_instagram}</p>}
        <p className="text-xs mt-8" style={{ color: theme.colors.border }}>
          Made with 🌸 by <span className="font-semibold">Katresnan</span>
        </p>
      </div>
    </section>
  )
}

// ─── Main Renderer ────────────────────────────────────────────────────────────
export default function TemplateRenderer({ wedding, templateId }: { wedding: WeddingData; templateId: string }) {
  const [opened,  setOpened]  = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const tpl    = getTemplate(templateId)
  const theme  = getTheme(tpl.themeId)
  const layout = getLayout(tpl.layoutId)

  const props: SectionProps = { wedding, theme, layout }

  function handleOpen() {
    setOpened(true)
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {})
    window.scrollTo(0, 0)
  }

  function toggleMusic() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  const SECTION_MAP: Record<string, React.ReactNode> = {
    pembuka:  <SectionPembuka   key="pembuka"  {...props}/>,
    mempelai: <SectionMempelai  key="mempelai" {...props}/>,
    cerita:   <SectionCerita    key="cerita"   {...props}/>,
    countdown:<SectionCountdown key="countdown"{...props}/>,
    acara:    <SectionAcara     key="acara"    {...props}/>,
    galeri:   <SectionGaleri    key="galeri"   {...props}/>,
    rsvp:     <SectionRSVP      key="rsvp"     {...props}/>,
    amplop:   <SectionAmplop    key="amplop"   {...props}/>,
    closing:  <SectionClosing   key="closing"  {...props}/>,
  }

  return (
    <>
      <style>{`
        @import url('${theme.fonts.displayUrl}');
        @import url('${theme.fonts.scriptUrl}');
        @keyframes petalFall {
          0%   { transform: translateY(-30px) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        * { box-sizing: border-box; }
        body { background: ${theme.colors.bg}; margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.colors.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.colors.border}; border-radius: 3px; }
      `}</style>

      <audio ref={audioRef} loop preload="none">
        {wedding.musik_pilihan?.startsWith('http') && <source src={wedding.musik_pilihan}/>}
      </audio>

      {/* Music indicator */}
      {opened && (
        <div className="fixed top-4 right-4 z-50">
          <button onClick={toggleMusic}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-lg border transition-all"
            style={{ background: playing ? theme.colors.primary : 'rgba(255,255,255,0.9)', borderColor: theme.colors.border, color: playing ? '#fff' : theme.colors.primary }}>
            {playing ? '🎵' : '🔇'}
          </button>
        </div>
      )}

      {!opened ? (
        <SectionCover {...props} onOpen={handleOpen} playing={playing} onToggleMusic={toggleMusic}/>
      ) : (
        <main>
          {layout.sections.filter(s => s !== 'cover').map(sId => SECTION_MAP[sId])}
        </main>
      )}
    </>
  )
}
