'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingData, Ucapan } from '../types'

// ── Helpers ──────────────────────────────────────────────────────────
function fmt(iso: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', opts ?? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtShort(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtTime(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB'
}
function parentLabel(n?: string, s?: string) {
  if (!n) return ''
  return (s === 'alm' ? 'Alm. ' : s === 'almh' ? 'Almh. ' : '') + n
}
function gcalUrl(w: WeddingData) {
  const tgl = w.resepsi_tanggal || w.akad_tanggal || ''; if (!tgl) return '#'
  const st = new Date(tgl), en = new Date(st.getTime() + 3 * 3600000)
  const f = (d: Date) => d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan}`)}&dates=${f(st)}/${f(en)}&location=${encodeURIComponent(w.resepsi_lokasi || '')}`
}
function useCountdown(target?: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: false })
  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0, done: true }); return }
      setT({ d: Math.floor(diff / 86400000), h: Math.floor(diff % 86400000 / 3600000), m: Math.floor(diff % 3600000 / 60000), s: Math.floor(diff % 60000 / 1000), done: false })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return t
}

// ── Arabesque Palette ─────────────────────────────────────────────────
const C = {
  bg:          '#07170c',
  bgAlt:       '#0f1f14',
  bgCard:      '#132317',
  bgCardHigh:  '#1e2e21',
  accent:      '#e5c276',        // gold light
  accentMid:   '#c4a35a',        // gold mid
  accentDim:   'rgba(229,194,118,0.5)',
  accentSubtle:'rgba(229,194,118,0.25)',
  text:        '#d4e8d5',
  muted:       'rgba(212,232,213,0.65)',
  subtle:      'rgba(212,232,213,0.35)',
  border:      'rgba(196,163,90,0.3)',
  borderLight: 'rgba(196,163,90,0.15)',
}

// ── Kata-kata preset ─────────────────────────────────────────────────
const KATA_QURAN = {
  label: 'QS. Ar-Rum: 21',
  text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tentram di sampingnya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."',
  sub: 'Semoga Allah memberkahi pernikahan kami, dan menjadikannya penuh cinta, kasih sayang, dan keberkahan.'
}
const KATA_BIBLE = {
  label: '1 Korintus 13:4-7',
  text: '"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong."',
  sub: 'Kiranya Tuhan memberkati pernikahan kami dengan kasih setia-Nya yang kekal.'
}

// ── SVG Ornaments ─────────────────────────────────────────────────────
const ArabesqueCorner = ({ size = 60, flip = false }: { size?: number; flip?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none"
    style={{ transform: flip ? 'rotate(180deg)' : 'none' }}>
    <path d="M4 4 Q4 30 30 30 Q4 30 4 56" stroke={C.accentMid} strokeWidth="0.8" fill="none" opacity="0.7"/>
    <path d="M4 4 Q30 4 30 30 Q30 4 56 4" stroke={C.accentMid} strokeWidth="0.8" fill="none" opacity="0.7"/>
    <circle cx="4" cy="4" r="2.5" fill={C.accentMid} opacity="0.6"/>
    <circle cx="30" cy="30" r="1.5" fill={C.accentMid} opacity="0.4"/>
    {/* Petal ornaments */}
    <path d="M12 4 Q16 8 12 12 Q8 8 12 4Z" fill={C.accentMid} opacity="0.35"/>
    <path d="M4 12 Q8 16 4 20 Q0 16 4 12Z" fill={C.accentMid} opacity="0.35"/>
    <path d="M20 4 Q24 10 18 14 Q16 8 20 4Z" fill={C.accentMid} opacity="0.25"/>
    {/* Fine diamond */}
    <path d="M8 8 L11 5 L14 8 L11 11Z" stroke={C.accentMid} strokeWidth="0.5" fill="none" opacity="0.5"/>
  </svg>
)

const ArabDivider = ({ width = 200 }: { width?: number }) => (
  <svg width={width} height="24" viewBox={`0 0 ${width} 24`} fill="none" preserveAspectRatio="xMidYMid meet">
    <line x1="0" y1="12" x2={width * 0.35} y2="12" stroke={C.accentMid} strokeWidth="0.7" opacity="0.5"/>
    <line x1={width * 0.65} y1="12" x2={width} y2="12" stroke={C.accentMid} strokeWidth="0.7" opacity="0.5"/>
    {/* Center ornament */}
    <path d={`M${width/2-12} 12 L${width/2-6} 6 L${width/2} 12 L${width/2-6} 18Z`} stroke={C.accentMid} strokeWidth="0.8" fill="none" opacity="0.7"/>
    <path d={`M${width/2} 12 L${width/2+6} 6 L${width/2+12} 12 L${width/2+6} 18Z`} stroke={C.accentMid} strokeWidth="0.8" fill="none" opacity="0.7"/>
    <circle cx={width/2} cy="12" r="1.8" fill={C.accentMid} opacity="0.8"/>
    <circle cx={width/2 - 18} cy="12" r="1" fill={C.accentMid} opacity="0.5"/>
    <circle cx={width/2 + 18} cy="12" r="1" fill={C.accentMid} opacity="0.5"/>
  </svg>
)

const ArabFrame = ({ initial, size = 130 }: { initial: string; size?: number }) => (
  <div style={{ position: 'relative', width: size, height: size * 1.1, margin: '0 auto 12px' }}>
    {/* Outer decorative border */}
    <svg width={size} height={size * 1.1} viewBox={`0 0 ${size} ${size * 1.1}`}
      style={{ position: 'absolute', inset: 0 }} fill="none">
      {/* Outer rect */}
      <rect x="2" y="2" width={size-4} height={size*1.1-4} stroke={C.accentMid} strokeWidth="0.8" opacity="0.5"/>
      {/* Inner rect */}
      <rect x="7" y="7" width={size-14} height={size*1.1-14} stroke={C.accentMid} strokeWidth="0.5" opacity="0.3"/>
      {/* Corner diamonds */}
      {[
        [size/2, 5], [size/2, size*1.1-5],
        [5, size*1.1/2], [size-5, size*1.1/2],
      ].map(([cx, cy], i) => (
        <path key={i} d={`M${cx-4} ${cy} L${cx} ${cy-4} L${cx+4} ${cy} L${cx} ${cy+4}Z`}
          fill={C.accentMid} opacity="0.5"/>
      ))}
      {/* Corner roses */}
      {[[8,8],[size-8,8],[8,size*1.1-8],[size-8,size*1.1-8]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" stroke={C.accentMid} strokeWidth="0.8" fill="none" opacity="0.5"/>
      ))}
    </svg>
    {/* Monogram initial */}
    <div style={{
      position: 'absolute', inset: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at center, rgba(196,163,90,0.08) 0%, transparent 70%)`,
    }}>
      <span style={{
        fontFamily: "'Noto Serif', serif",
        fontStyle: 'italic',
        fontWeight: 700,
        fontSize: size * 0.52,
        color: C.accentMid,
        lineHeight: 1,
        textShadow: `0 0 30px rgba(196,163,90,0.4)`,
      }}>{initial}</span>
    </div>
  </div>
)

// ── Cover ────────────────────────────────────────────────────────────
function Cover({ w, onOpen }: { w: WeddingData; onOpen: () => void }) {
  return (
    <section style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: C.bg, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background texture overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 0%, rgba(196,163,90,0.06) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(196,163,90,0.04) 0%, transparent 50%)`, pointerEvents: 'none' }} />

      {/* Top corners */}
      <div style={{ padding: '16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <ArabesqueCorner size={70} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, rgba(196,163,90,0.4), rgba(196,163,90,0.1))`, marginTop: 35 }} />
        <ArabesqueCorner size={70} flip />
      </div>

      {/* Center content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 32px', position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.5rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 20 }}>
          The Wedding of
        </p>

        {/* Names */}
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.8rem,12vw,4rem)', color: C.accent, lineHeight: 0.9, margin: 0, textShadow: `0 0 40px rgba(229,194,118,0.25)` }}>
          {w.pria_nama_panggilan || 'Nama Pria'}
        </h1>

        <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(1.8rem,7vw,2.5rem)', color: C.accentDim, lineHeight: 1.2, margin: '6px 0' }}>
          &amp;
        </p>

        <h1 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.8rem,12vw,4rem)', color: C.accent, lineHeight: 0.9, margin: 0, textShadow: `0 0 40px rgba(229,194,118,0.25)` }}>
          {w.wanita_nama_panggilan || 'Nama Wanita'}
        </h1>

        {/* Divider */}
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
          <ArabDivider width={220} />
        </div>

        {/* Date */}
        {w.resepsi_tanggal && (
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted, marginBottom: 28 }}>
            {fmtShort(w.resepsi_tanggal)}
          </p>
        )}

        {/* CTA Button */}
        <button onClick={onOpen}
          className="transition-all active:scale-95 hover:scale-105"
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            padding: '13px 40px',
            background: 'transparent',
            border: `1px solid ${C.accentMid}`,
            color: C.accent,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}>
          Buka Undangan
        </button>
      </div>

      {/* Bottom corners */}
      <div style={{ padding: '0 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <ArabesqueCorner size={70} flip />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, rgba(196,163,90,0.4), rgba(196,163,90,0.1))`, marginBottom: 35 }} />
        <ArabesqueCorner size={70} />
      </div>
    </section>
  )
}

// ── Section: Quote ───────────────────────────────────────────────────
function SectionQuote({ w }: { w: WeddingData }) {
  const pilihan = w.kata_kata_pilihan || 'quran'
  const isCustom = pilihan === 'custom'
  const preset = pilihan === 'quran' ? KATA_QURAN : KATA_BIBLE
  return (
    <section style={{ background: C.bgAlt, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(196,163,90,0.04) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', padding: '60px 32px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <ArabDivider width={160} />
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.5rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, margin: '16px 0 20px' }}>
          {isCustom ? 'Kata-kata' : preset.label}
        </p>
        <blockquote style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', color: C.text, lineHeight: 1.95, margin: '0 0 16px', borderLeft: `2px solid ${C.accentMid}`, paddingLeft: 20, textAlign: 'left' }}>
          {isCustom ? (w.kata_kata_custom || '...') : preset.text}
        </blockquote>
        {!isCustom && <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.8 }}>{preset.sub}</p>}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
          <ArabDivider width={160} />
        </div>
      </div>
    </section>
  )
}

// ── Section: Mempelai (NO PHOTO) ─────────────────────────────────────
function SectionMempelai({ w }: { w: WeddingData }) {
  const Card = ({ type }: { type: 'pria' | 'wanita' }) => {
    const p = type === 'pria'
    const initial = p ? (w.pria_nama_panggilan?.[0] || 'G') : (w.wanita_nama_panggilan?.[0] || 'B')
    const nama = p ? (w.pria_nama_lengkap || w.pria_nama_panggilan) : (w.wanita_nama_lengkap || w.wanita_nama_panggilan)
    const gelar = p ? w.pria_gelar : w.wanita_gelar
    const ayah = parentLabel(p ? w.pria_nama_ayah : w.wanita_nama_ayah, p ? w.pria_status_ayah : w.wanita_status_ayah)
    const ibu = parentLabel(p ? w.pria_nama_ibu : w.wanita_nama_ibu, p ? w.pria_status_ibu : w.wanita_status_ibu)
    return (
      <div style={{ flex: 1, textAlign: 'center', paddingTop: 8 }}>
        {/* Label */}
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 12 }}>
          {p ? 'The Groom' : 'The Bride'}
        </p>
        {/* Arabesque monogram frame */}
        <ArabFrame initial={initial} size={110} />
        {/* Name */}
        <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(0.9rem,3vw,1.05rem)', color: C.accent, marginBottom: 4, lineHeight: 1.25 }}>
          {nama}{gelar ? `, ${gelar}` : ''}
        </h3>
        {(ayah || ibu) && (
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.7rem', color: C.muted, lineHeight: 1.7, marginTop: 6 }}>
            {p ? 'Putra' : 'Putri'} dari<br />
            <span style={{ color: C.text, fontWeight: 500 }}>{ayah}</span>
            {ibu && <><br /><span style={{ color: C.accentDim }}>&amp;</span> <span style={{ color: C.text, fontWeight: 500 }}>{ibu}</span></>}
          </p>
        )}
      </div>
    )
  }
  return (
    <section id="mempelai" style={{ background: C.bg, padding: '60px 20px' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>
          Mempelai
        </p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>
          Yang Akan Dipersatukan
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}><ArabDivider width={180} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0 12px', alignItems: 'start' }}>
          <Card type="pria" />
          {/* Ampersand center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 }}>
            <div style={{ width: 1, height: 30, background: `linear-gradient(to bottom, transparent, ${C.accentMid})` }} />
            <span style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: '1.9rem', color: C.accent, lineHeight: 1, padding: '6px 0' }}>&amp;</span>
            <div style={{ width: 1, height: 30, background: `linear-gradient(to top, transparent, ${C.accentMid})` }} />
          </div>
          <Card type="wanita" />
        </div>
      </div>
    </section>
  )
}

// ── Section: Acara ───────────────────────────────────────────────────
function SectionAcara({ w }: { w: WeddingData }) {
  const target = w.resepsi_tanggal || w.akad_tanggal || ''
  const { d, h, m, s, done } = useCountdown(target)

  const EvCard = ({ type }: { type: 'akad' | 'resepsi' }) => {
    const isA = type === 'akad'
    const tgl = isA ? w.akad_tanggal : w.resepsi_tanggal; if (!tgl) return null
    const lok = isA ? w.akad_lokasi : w.resepsi_lokasi
    const adr = isA ? w.akad_alamat : w.resepsi_alamat
    const mp  = isA ? w.akad_maps_url : w.resepsi_maps_url
    return (
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: '20px 18px', position: 'relative', overflow: 'hidden' }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${C.accentMid}, transparent)` }} />
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accentDim }}>{isA ? '01' : '02'}</span>
          <h3 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', color: C.accent, margin: '4px 0 0' }}>
            {isA ? 'Akad Nikah' : 'Resepsi Pernikahan'}
          </h3>
        </div>
        <div style={{ fontSize: '0.75rem', fontFamily: "'Work Sans', sans-serif", color: C.muted, lineHeight: 1.9, textAlign: 'center' }}>
          <p style={{ margin: '0 0 2px' }}>{fmt(tgl)}</p>
          <p style={{ margin: '0 0 2px', color: C.text }}>{fmtTime(tgl)}</p>
          {lok && <p style={{ margin: '0 0 2px', color: C.text, fontWeight: 500 }}>{lok}</p>}
          {adr && <p style={{ margin: 0, fontSize: '0.7rem' }}>{adr}</p>}
        </div>
        {mp && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <a href={mp} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '8px 18px', border: `1px solid ${C.accentMid}`, color: C.accent, textDecoration: 'none', display: 'inline-block' }}>
              Lihat Lokasi
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <section id="acara" style={{ background: C.bgAlt, padding: '60px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>Save the Date</p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>
          Hari Bahagia Kami
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><ArabDivider width={180} /></div>
        {target && <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.72rem', color: C.muted, marginBottom: 24 }}>{fmt(target)}</p>}

        {/* Countdown */}
        {!done ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
            {(['d', 'h', 'm', 's'] as const).map(k => {
              const val = k === 'd' ? d : k === 'h' ? h : k === 'm' ? m : s
              const lbl = k === 'd' ? 'Hari' : k === 'h' ? 'Jam' : k === 'm' ? 'Menit' : 'Detik'
              return (
                <div key={k} style={{ background: C.bgCard, border: `1px solid ${C.border}`, width: 65, paddingTop: 12, paddingBottom: 12, textAlign: 'center' }}>
                  <span style={{ fontFamily: "'Noto Serif', serif", fontSize: '1.8rem', fontWeight: 700, color: C.accent, display: 'block', lineHeight: 1 }}>{String(val).padStart(2, '0')}</span>
                  <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.subtle, marginTop: 4, display: 'block' }}>{lbl}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: '1.2rem', color: C.accent, margin: '20px 0 28px' }}>🌸 Hari Bahagia Telah Tiba!</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 20 }}>
          <EvCard type="akad" /><EvCard type="resepsi" />
        </div>
        {target && (
          <a href={gcalUrl(w)} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 22px', border: `1px solid ${C.accentMid}`, color: C.accent, textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
            + Tambah ke Kalender
          </a>
        )}
      </div>
    </section>
  )
}

// ── Section: Cerita Cinta ─────────────────────────────────────────────
function SectionCerita({ w }: { w: WeddingData }) {
  if (!w.fitur_cerita_cinta) return null
  const stories = [
    { yr: w.tanggal_jadian ? new Date(w.tanggal_jadian).getFullYear() : '', title: 'Awal Pertemuan', desc: w.cerita_pertemuan || 'Sebuah pertemuan yang tak disengaja menjadi awal dari segalanya.' },
    { yr: w.tanggal_lamaran ? new Date(w.tanggal_lamaran).getFullYear() : '', title: 'Lamaran', desc: w.engagement_story || 'Dengan segenap ketulusan, ia memintaku menemaninya seumur hidup.' },
    { yr: w.resepsi_tanggal ? new Date(w.resepsi_tanggal).getFullYear() : '', title: 'Menuju Pelaminan', desc: 'Akhirnya, saatnya kami meresmikan cinta dalam ikatan suci yang diberkahi.' },
  ]
  return (
    <section id="cerita" style={{ background: C.bg, padding: '60px 24px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>Kisah Cinta</p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>Perjalanan Kita</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}><ArabDivider width={180} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {stories.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left' }}>
              {/* Timeline dot */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accentMid, marginTop: 4 }} />
                {i < stories.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 40, background: `linear-gradient(to bottom, ${C.accentMid}, transparent)`, marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1 }}>
                {s.yr && <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.accentDim }}>{String(s.yr)}</span>}
                <h4 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 600, fontSize: '1rem', color: C.accent, margin: '4px 0 6px' }}>{s.title}</h4>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.76rem', color: C.muted, lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section: Galeri (only if photos exist) ───────────────────────────
function SectionGaleri({ w }: { w: WeddingData }) {
  const fotos = w.foto_urls || []
  const [lb, setLb] = useState<number | null>(null)
  if (!fotos.length) return null
  return (
    <section id="galeri" style={{ background: C.bgAlt, padding: '60px 0' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ padding: '0 20px', textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>Galeri</p>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>Momen Berharga</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}><ArabDivider width={180} /></div>
        </div>
        <div style={{ padding: '0 12px', columns: 2, gap: 8 }}>
          {fotos.map((url, i) => (
            <div key={url} style={{ breakInside: 'avoid', marginBottom: 8, cursor: 'pointer', overflow: 'hidden', border: `1px solid ${C.borderLight}` }}
              onClick={() => setLb(i)}>
              <img src={url} alt="" loading="lazy" style={{ width: '100%', display: 'block', aspectRatio: i % 3 === 0 ? '3/4' : '1/1', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
            </div>
          ))}
        </div>
      </div>
      {lb !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLb(null)}>
          <button style={{ position: 'absolute', top: 16, right: 20, color: '#fff', fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setLb(null)}>×</button>
          <button style={{ position: 'absolute', left: 8, color: '#fff', fontSize: '3rem', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLb(l => l! > 0 ? l! - 1 : fotos.length - 1) }}>&#8249;</button>
          <img src={fotos[lb]} alt="" style={{ maxHeight: '82dvh', maxWidth: '94vw', objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          <button style={{ position: 'absolute', right: 8, color: '#fff', fontSize: '3rem', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLb(l => l! < fotos.length - 1 ? l! + 1 : 0) }}>&#8250;</button>
        </div>
      )}
    </section>
  )
}

// ── Section: RSVP ────────────────────────────────────────────────────
function SectionRSVP({ w }: { w: WeddingData }) {
  const [form, setForm] = useState({ nama: '', ucapan: '', hadir: 'hadir' })
  const [busy, setBusy] = useState(false); const [ok, setOk] = useState(false)
  const [list, setList] = useState<Ucapan[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('ucapan').select('*').eq('order_id', w.order_id).order('created_at', { ascending: false }).limit(30).then(({ data }) => { if (data) setList(data as Ucapan[]); setLoading(false) })
  }, [w.order_id])
  async function send() {
    if (!form.nama.trim() || !form.ucapan.trim()) return
    setBusy(true)
    const { data } = await supabase.from('ucapan').insert({ order_id: w.order_id, ...form }).select().single()
    if (data) setList(p => [data as Ucapan, ...p])
    setOk(true); setBusy(false); setForm({ nama: '', ucapan: '', hadir: 'hadir' })
    setTimeout(() => setOk(false), 3000)
  }
  const iS: React.CSSProperties = { width: '100%', padding: '12px 14px', border: `1px solid ${C.border}`, fontFamily: "'Work Sans', sans-serif", fontSize: '0.82rem', color: C.text, background: C.bgCard, outline: 'none', boxSizing: 'border-box', borderRadius: 0 }
  return (
    <section id="rsvp" style={{ background: C.bg, padding: '60px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>Konfirmasi Kehadiran</p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>RSVP &amp; Buku Tamu</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><ArabDivider width={180} /></div>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.8, maxWidth: 360, margin: '0 auto 24px' }}>Kehormatan kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.</p>
        {!ok ? (
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Nama</label>
              <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap Anda" style={iS} /></div>
            <div>
              <label style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Kehadiran</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['hadir', 'Hadir'], ['tidak', 'Tidak'], ['ragu', 'Mungkin']].map(([v, l]) => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, hadir: v }))}
                    style={{ flex: 1, fontFamily: "'Work Sans', sans-serif", fontSize: '0.68rem', padding: '10px 4px', border: `1px solid ${form.hadir === v ? C.accentMid : C.border}`, background: form.hadir === v ? C.bgCardHigh : C.bgCard, color: form.hadir === v ? C.accent : C.muted, cursor: 'pointer' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div><label style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Ucapan &amp; Doa</label>
              <textarea value={form.ucapan} onChange={e => setForm(f => ({ ...f, ucapan: e.target.value }))} placeholder="Tulis ucapan terbaikmu..." rows={3} style={{ ...iS, resize: 'none' }} /></div>
            <button onClick={send} disabled={busy || !form.nama || !form.ucapan}
              style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '14px', background: `linear-gradient(135deg,${C.accentMid},${C.accent})`, color: C.bg, border: 'none', cursor: 'pointer', opacity: (busy || !form.nama || !form.ucapan) ? 0.5 : 1 }}>
              {busy ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '32px', background: C.bgCard, border: `1px solid ${C.border}` }}>
            <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: '1rem', color: C.accent }}>Terima kasih atas ucapan dan doamu ✨</p>
          </div>
        )}
        {/* Ucapan list */}
        <div style={{ marginTop: 28 }}>
          <p style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontSize: '0.85rem', color: C.accentDim, marginBottom: 12 }}>— Ucapan &amp; Doa —</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', textAlign: 'left' }}>
            {loading ? <p style={{ textAlign: 'center', fontSize: '0.8rem', color: C.subtle }}>Memuat...</p>
              : list.length === 0 ? <p style={{ textAlign: 'center', fontSize: '0.8rem', color: C.subtle }}>Jadilah yang pertama memberi ucapan ✨</p>
                : list.map(u => (
                  <div key={u.id} style={{ background: C.bgCard, borderLeft: `2px solid ${C.accentMid}`, padding: '12px 14px' }}>
                    <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, marginBottom: 4 }}>{u.nama}</p>
                    <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.74rem', color: C.muted, lineHeight: 1.65 }}>{u.ucapan}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Amplop Digital ───────────────────────────────────────────
function SectionAmplop({ w }: { w: WeddingData }) {
  const [copied, setCopied] = useState<string | null>(null)
  if (!w.fitur_amplop_digital || !w.rekening_list?.length) return null
  const grouped = { pria: w.rekening_list.filter(r => r.kategori === 'pria'), wanita: w.rekening_list.filter(r => r.kategori === 'wanita'), bersama: w.rekening_list.filter(r => r.kategori === 'bersama') }
  function copy(text: string, key: string) { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2500) }
  return (
    <section id="amplop" style={{ background: C.bgAlt, padding: '60px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.48rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 8 }}>Wedding Gift</p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.4rem,5vw,1.9rem)', color: C.accent, marginBottom: 4 }}>Hadiah Digital</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><ArabDivider width={180} /></div>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.8, maxWidth: 380, margin: '0 auto 24px' }}>Kehadiran dan doa Anda adalah hadiah terindah. Jika berkenan, silakan gunakan informasi berikut.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
          {(['pria', 'wanita', 'bersama'] as const).map(cat => {
            const lst = grouped[cat]; if (!lst.length) return null
            const lbl = cat === 'pria' ? w.pria_nama_panggilan : cat === 'wanita' ? w.wanita_nama_panggilan : 'Bersama'
            return (
              <div key={cat}>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.accentDim, fontWeight: 700, marginBottom: 8 }}>{lbl}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lst.map(r => (
                    <div key={r.id} style={{ background: C.bgCard, border: `1px solid ${C.borderLight}`, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.62rem', fontWeight: 700, color: C.accentDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.bank}</p>
                          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: '1.2rem', color: C.accent, letterSpacing: '0.05em', margin: '2px 0' }}>{r.nomor}</p>
                          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.68rem', color: C.subtle }}>a.n. {r.nama}</p>
                        </div>
                        <button onClick={() => copy(r.nomor, r.id)}
                          style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.58rem', fontWeight: 700, padding: '8px 14px', cursor: 'pointer', flexShrink: 0, background: copied === r.id ? '#22c55e' : 'transparent', border: `1px solid ${copied === r.id ? '#22c55e' : C.accentMid}`, color: copied === r.id ? '#fff' : C.accent }}>
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
          <div style={{ marginTop: 16, background: C.bgCard, border: `1px solid ${C.borderLight}`, padding: '14px 16px', textAlign: 'left' }}>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.52rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 6 }}>📦 Alamat Kado</p>
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.75 }}>{w.alamat_kado}</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Section: Footer ──────────────────────────────────────────────────
function SectionFooter({ w }: { w: WeddingData }) {
  return (
    <section id="footer" style={{ background: C.bg, padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, rgba(196,163,90,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        {/* Top ornament */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><ArabDivider width={200} /></div>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.9, maxWidth: 360, margin: '0 auto 20px' }}>
          Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari bahagia kami. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.
        </p>
        <h2 style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.8rem,8vw,2.6rem)', color: C.accent, lineHeight: 1.1, margin: '0 0 8px', textShadow: `0 0 30px rgba(229,194,118,0.2)` }}>
          {w.pria_nama_panggilan} &amp; {w.wanita_nama_panggilan}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><ArabDivider width={200} /></div>
        {w.resepsi_tanggal && <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.25em', color: C.subtle, marginTop: 8 }}>{fmtShort(w.resepsi_tanggal)}</p>}
        {w.hashtag_instagram && <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.65rem', color: C.subtle, marginTop: 8 }}>{w.hashtag_instagram}</p>}
      </div>
      {/* Copyright */}
      <div style={{ background: `rgba(196,163,90,0.06)`, padding: '12px 16px', textAlign: 'center', borderTop: `1px solid ${C.borderLight}`, marginTop: 32 }}>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: '0.56rem', color: C.subtle, letterSpacing: '0.12em' }}>
          Made with <span style={{ color: C.accentMid }}>♥</span> by <span style={{ fontWeight: 700, color: C.accentDim }}>Katresnan</span> · katresnan.id
        </p>
      </div>
    </section>
  )
}

// ── ROOT Component ─────────────────────────────────────────────────────
export default function TemplateArabesqueClassic({ wedding: wd }: { wedding: WeddingData }) {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function open() {
    setOpened(true)
    const audio = audioRef.current
    if (audio) {
      audio.load()
      const tryPlay = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {
          setTimeout(() => audio.play().then(() => setPlaying(true)).catch(() => {}), 500)
        })
      }
      if (audio.readyState >= 2) tryPlay()
      else audio.addEventListener('canplay', tryPlay, { once: true })
    }
  }

  function toggleMusic() {
    const audio = audioRef.current; if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.load(); audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Work+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        html{font-size:16px;scroll-behavior:smooth;}
        body{margin:0;padding:0;background:${C.bg};overflow-x:hidden;}
        input:focus,textarea:focus{border-color:${C.accentMid}!important;box-shadow:0 0 0 2px rgba(196,163,90,0.2)!important;outline:none!important;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(196,163,90,0.25);border-radius:2px;}
        @keyframes acFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
        .ac-section{animation:acFadeUp 0.5s ease both;}
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        {wd.musik_pilihan?.startsWith('http') && <source src={wd.musik_pilihan} />}
      </audio>

      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh' }}>
        {!opened
          ? <Cover w={wd} onOpen={open} />
          : <main>
            <div className="ac-section"><SectionQuote w={wd} /></div>
            <div className="ac-section"><SectionMempelai w={wd} /></div>
            <div className="ac-section"><SectionAcara w={wd} /></div>
            {wd.fitur_cerita_cinta && <div className="ac-section"><SectionCerita w={wd} /></div>}
            <div className="ac-section"><SectionGaleri w={wd} /></div>
            {wd.fitur_rsvp && <div className="ac-section"><SectionRSVP w={wd} /></div>}
            <div className="ac-section"><SectionAmplop w={wd} /></div>
            <div className="ac-section"><SectionFooter w={wd} /></div>
          </main>
        }
      </div>

      {/* Music button */}
      {opened && (
        <button onClick={toggleMusic}
          style={{ position: 'fixed', bottom: 24, left: 20, zIndex: 50, width: 40, height: 40, borderRadius: '50%', background: `rgba(7,23,12,0.8)`, border: `1px solid rgba(196,163,90,0.4)`, color: C.accent, cursor: 'pointer', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
          {playing ? '⏸' : '▶'}
        </button>
      )}
    </>
  )
}
