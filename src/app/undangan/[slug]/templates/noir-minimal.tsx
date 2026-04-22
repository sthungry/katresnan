'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingData, Ucapan } from '../types'

// ── Helpers ──────────────────────────────────────────────────────────
function fmt(iso: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', opts ?? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function fmtShort(iso: string) { if (!iso) return ''; return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
function fmtTime(iso: string) { if (!iso) return ''; return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB' }
function parentLabel(n?: string, s?: string) { if (!n) return ''; return (s === 'alm' ? 'Alm. ' : s === 'almh' ? 'Almh. ' : '') + n }
function useCountdown(target?: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, done: false })
  useEffect(() => {
    if (!target) return
    const tick = () => { const diff = new Date(target).getTime() - Date.now(); if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0, done: true }); return }; setT({ d: Math.floor(diff / 86400000), h: Math.floor(diff % 86400000 / 3600000), m: Math.floor(diff % 3600000 / 60000), s: Math.floor(diff % 60000 / 1000), done: false }) }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return t
}
function gcalUrl(w: WeddingData) {
  const tgl = w.resepsi_tanggal || w.akad_tanggal || ''; if (!tgl) return '#'
  const st = new Date(tgl), en = new Date(st.getTime() + 3 * 3600000)
  const f = (d: Date) => d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan}`)}&dates=${f(st)}/${f(en)}&location=${encodeURIComponent(w.resepsi_lokasi || '')}`
}

// ── Dark Moody Palette — All White ───────────────────────────────────
const C = {
  bg: '#0a0a0f',
  bgAlt: '#111118',
  card: 'rgba(255,255,255,0.06)',
  accent: '#ffffff',
  accentSoft: 'rgba(255,255,255,0.85)',
  accentDim: 'rgba(255,255,255,0.4)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
  subtle: 'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.15)',
  borderLight: 'rgba(255,255,255,0.08)',
}

// ── Kata-kata preset ─────────────────────────────────────────────────
const KATA_QURAN = { label: 'Ar-Rum: 21', title: <>Firman <em>Allah SWT</em></>, text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tentram di sampingnya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."', source: 'QS. Ar-Rum: 21', sub: 'Semoga Allah memberkahi pernikahan kami, dan menjadikannya penuh cinta, kasih sayang, dan kebahagiaan.' }
const KATA_BIBLE = { label: '1 Korintus 13:4-7', title: <>Firman <em>Tuhan</em></>, text: '"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong."', source: '1 Korintus 13:4-7', sub: 'Kiranya Tuhan memberkati pernikahan kami dengan kasih setia-Nya yang kekal.' }

// ── Utility Components ───────────────────────────────────────────────

const Ics = {
  Cal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Clk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Chk: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Q: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Ring: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7v2z"></path><path d="M3 12a9 9 0 0 0 9 9v-2a7 7 0 0 1-7-7H3z"></path><path d="M12 3a9 9 0 0 0-9 9h2a7 7 0 0 1 7-7V3z"></path><path d="M21 12a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7h2z"></path><circle cx="12" cy="3" r="2"></circle></svg>,
  Box: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Env: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
}

function LineDivider({ width = 60 }: { width?: number }) {
  return <div style={{ width, height: 1, background: `linear-gradient(to right,transparent,rgba(255,255,255,0.3),transparent)`, margin: '16px auto' }} />
}

function SectionHeader({ label, title }: { label: string; title: React.ReactNode }) {
  return (
    <div className='text-center mb-8'>
      <span style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 8 }}>{label}</span>
      <h2 style={{ fontFamily: "'Noto Serif',serif", fontSize: 'clamp(1.5rem,5vw,2rem)', fontWeight: 600, color: C.text, lineHeight: 1.2, margin: '0 0 4px' }}>{title}</h2>
      <LineDivider />
    </div>
  )
}

function BgLayer({ bg }: { bg?: { type: string; url: string; overlay: number } }) {
  if (!bg || bg.type === 'default' || !bg.url) return null
  const ov = bg.overlay ?? 0.6
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {bg.type === 'foto' && <img src={bg.url} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      {bg.type === 'video' && <video src={bg.url} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      {bg.type === 'youtube' && (() => { const id = bg.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]; return id ? <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&playsinline=1`} allow='autoplay' title='bg' style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(1.6)', width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} /> : null })()}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,10,15,${ov})` }} />
    </div>
  )
}

function resolveBg(section?: { type: string; url: string; overlay: number }) {
  if (section && section.type !== 'default' && section.url) return section
  return undefined
}

// ── Fixed Video Background (both mobile + desktop) ──────────────────
function VideoBgFixed({ w }: { w: WeddingData }) {
  // Ambil dari bg_sections.semua (contoh: {type:'video', url:'...mp4', overlay:0.4})
  const bgSemua = (w.bg_sections as any)?.semua as { type: string; url: string; overlay: number } | undefined
  if (!bgSemua || !bgSemua.url) return null

  const { type, url, overlay = 0.4 } = bgSemua
  const getYtId = (u: string) => u?.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''
  const ytId = type === 'youtube' ? getYtId(url) : ''

  return (
    <div className='jf-video-bg'>
      {type === 'youtube' && ytId && (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&disablekb=1&playsinline=1&modestbranding=1&showinfo=0`}
          allow='autoplay'
          title='video-bg'
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(1.8)', width: '100vw', height: '100vh', minWidth: '178vh', minHeight: '56.25vw', border: 'none', pointerEvents: 'none' }}
        />
      )}
      {type === 'video' && (
        <video src={url} autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
      )}
      {type === 'foto' && (
        <img src={url} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(10,10,15,${overlay})`, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Hero Slideshow Section (above Quote) ─────────────────────────
function SectionHeroSlideshow({ w }: { w: WeddingData }) {
  const fotos = (w.foto_urls || []).filter(Boolean)
  const [cur, setCur] = useState(0)
  const [fade, setFade] = useState(true)
  useEffect(() => {
    if (fotos.length < 2) return
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => { setCur(c => (c + 1) % fotos.length); setFade(true) }, 400)
    }, 5000)
    return () => clearInterval(id)
  }, [fotos.length])
  if (!fotos.length) return null
  return (
    <section style={{ background: 'transparent' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {/* Title */}
        <div className='text-center px-6 pt-16 pb-6'>
          <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.55rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 10 }}>The Wedding of</p>
          <h2 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1.6rem,5vw,2.2rem)', color: C.text, lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {w.pria_nama_panggilan} &amp; {w.wanita_nama_panggilan}
          </h2>
          <div style={{ width: 50, height: 1, background: 'linear-gradient(to right,transparent,rgba(255,255,255,0.3),transparent)', margin: '14px auto 0' }} />
        </div>
        {/* Photo Slideshow */}
        <div className='relative overflow-hidden rounded-sm' style={{ aspectRatio: '3/4', maxHeight: '60vh', margin: '0 16px 24px' }}>
          {fotos.map((url, i) => (
            <img key={url} src={url} alt=''
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                opacity: i === cur ? (fade ? 1 : 0) : 0,
                transition: 'opacity 0.5s ease',
                display: 'block',
              }} />
          ))}
          {/* Gradient overlay bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top,rgba(10,10,15,0.5),transparent)', pointerEvents: 'none' }} />
          {/* Dots */}
          {fotos.length > 1 && (
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
              {fotos.map((_, i) => (
                <button key={i} onClick={() => { setFade(false); setTimeout(() => { setCur(i); setFade(true) }, 300) }}
                  style={{ width: i === cur ? 18 : 6, height: 6, borderRadius: 3, background: i === cur ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
              ))}
            </div>
          )}
          {/* Counter */}
          {fotos.length > 1 && (
            <div className='absolute top-3 right-3 z-10'>
              <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: 16, backdropFilter: 'blur(4px)' }}>
                {String(cur + 1).padStart(2, '0')} / {String(fotos.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── Cover ────────────────────────────────────────────────────────────
function Cover({ w, onOpen }: { w: WeddingData; onOpen: () => void }) {
  return (
    <section className='relative overflow-hidden' style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
      <div className='absolute inset-0' style={{ background: `linear-gradient(180deg,rgba(10,10,15,0.15) 0%,rgba(10,10,15,0.05) 30%,rgba(10,10,15,0.4) 70%,rgba(10,10,15,0.75) 100%)` }} />
      <div className='relative z-10 text-center px-8'>
        <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.6rem', letterSpacing: '0.6em', textTransform: 'uppercase', color: C.muted, marginBottom: 20 }}>The Wedding of</p>
        <h1 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.6rem,11vw,4.2rem)', color: C.text, lineHeight: 1, marginBottom: 0, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          {w.pria_nama_panggilan || 'Nama'}
        </h1>
        <p style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: 'clamp(1.3rem,4.5vw,2rem)', color: C.muted, lineHeight: 1, margin: '8px 0' }}>&amp;</p>
        <h1 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.6rem,11vw,4.2rem)', color: C.text, lineHeight: 1, marginBottom: 16, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          {w.wanita_nama_panggilan || 'Nama'}
        </h1>
        <div style={{ width: 50, height: 1, background: `linear-gradient(to right,transparent,rgba(255,255,255,0.4),transparent)`, margin: '12px auto 16px' }} />
        {w.resepsi_tanggal && <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.subtle, marginBottom: 32 }}>{fmtShort(w.resepsi_tanggal)}</p>}
        <button onClick={onOpen} className='transition-all active:scale-95 hover:scale-105'
          style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', padding: '12px 36px', background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.3)`, color: '#fff', cursor: 'pointer', borderRadius: 0, backdropFilter: 'blur(4px)', transition: 'all 0.3s ease' }}>
          Buka Undangan
        </button>
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
    <section className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <div className='relative z-10 px-6 py-20 text-center' style={{ maxWidth: 560, margin: '0 auto' }}>
        {isCustom ? (
          <>
            <SectionHeader label='Kata-kata' title={<em>Untuk Kamu</em>} />
            <blockquote style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: 'clamp(0.95rem,2.5vw,1.15rem)', color: C.text, lineHeight: 2, maxWidth: 480, margin: '0 auto 20px', borderLeft: `2px solid ${C.accent}`, paddingLeft: 20, textAlign: 'left' }}>
              &#34;{w.kata_kata_custom || 'Kata-kata indah untuk undangan ini...'}&#34;
            </blockquote>
          </>
        ) : (
          <>
            <SectionHeader label={preset.label} title={preset.title} />
            <blockquote style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: 'clamp(0.95rem,2.5vw,1.15rem)', color: C.text, lineHeight: 2, maxWidth: 480, margin: '0 auto 16px', borderLeft: `2px solid ${C.accent}`, paddingLeft: 20, textAlign: 'left' }}>
              {preset.text}
            </blockquote>
            <cite style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.accentDim, fontStyle: 'normal', display: 'block', marginBottom: 20 }}>
              {preset.source}
            </cite>
            <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.82rem', color: C.muted, lineHeight: 1.9, maxWidth: 420, margin: '0 auto' }}>
              {preset.sub}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

// ── Section: Mempelai ────────────────────────────────────────────────
function SectionMempelai({ w }: { w: WeddingData }) {
  const Card = ({ type }: { type: 'pria' | 'wanita' }) => {
    const p = type === 'pria'
    const foto = p ? (w.pria_foto_url || w.foto_urls?.[1]) : (w.wanita_foto_url || w.foto_urls?.[2])
    const nama = p ? (w.pria_nama_lengkap || w.pria_nama_panggilan) : (w.wanita_nama_lengkap || w.wanita_nama_panggilan)
    const gelar = p ? w.pria_gelar : w.wanita_gelar
    const ayah = parentLabel(p ? w.pria_nama_ayah : w.wanita_nama_ayah, p ? w.pria_status_ayah : w.wanita_status_ayah)
    const ibu = parentLabel(p ? w.pria_nama_ibu : w.wanita_nama_ibu, p ? w.pria_status_ibu : w.wanita_status_ibu)
    return (
      <div className='text-center'>
        <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 12 }}>{p ? 'The Groom' : 'The Bride'}</p>
        <div className='relative mx-auto mb-5' style={{ width: 130, height: 160 }}>
          <div style={{ position: 'absolute', inset: '-4px', border: `1px solid ${C.border}`, borderRadius: '4px' }} />
          <div className='w-full h-full rounded-sm overflow-hidden' style={{ border: `1px solid ${C.accent}`, boxShadow: `0 8px 32px rgba(0,0,0,0.4)` }}>
            {foto ? <img src={foto} alt={nama || ''} className='w-full h-full object-cover' style={{ objectPosition: 'center top' }} />
              : <div className='w-full h-full flex items-center justify-center text-4xl' style={{ background: C.card }}><Ics.User /></div>}
          </div>
        </div>
        <h3 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1.25rem', color: C.accent, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
          {nama}{gelar ? ` ${gelar}` : ''}
        </h3>
        {(ayah || ibu) && <p className='text-xs leading-loose mt-1' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted }}>
          {p ? 'Putra' : 'Putri'} dari<br />
          <span style={{ color: C.accentSoft, fontWeight: 600 }}>{ayah}</span>
          {ibu && <><br />&amp; <span style={{ color: C.accentSoft, fontWeight: 600 }}>{ibu}</span></>}
        </p>}
      </div>
    )
  }
  return (
    <section id='mempelai' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <BgLayer bg={resolveBg(w.bg_sections?.mempelai)} />
      <div className='relative z-10 px-5 py-20 text-center' style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionHeader label='Mempelai' title={<>Yang Akan <em>Dipersatukan</em></>} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '28px 16px', alignItems: 'start' }}>
          <Card type='pria' />
          <div className='flex flex-col items-center' style={{ paddingTop: 32 }}>
            <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom,transparent,${C.accent})` }} />
            <span style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1.7rem', color: C.accent, padding: '4px 0' }}>&amp;</span>
            <div style={{ width: 1, height: 32, background: `linear-gradient(to top,transparent,${C.accent})` }} />
          </div>
          <Card type='wanita' />
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
    const mp = isA ? w.akad_maps_url : w.resepsi_maps_url
    return (
      <div className='rounded-sm overflow-hidden' style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div style={{ height: 2, background: `linear-gradient(to right,transparent,${C.accent},transparent)` }} />
        <div className='p-5 text-center'>
          <span style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 4 }}>{isA ? '01' : '02'}</span>
          <h3 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 600, fontSize: '1.1rem', color: C.accent, marginBottom: 10 }}>{isA ? 'Akad Nikah' : 'Resepsi Pernikahan'}</h3>
          <LineDivider width={40} />
          <div className='space-y-2 text-left mt-4'>
            <div className='flex gap-2 items-start text-xs' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted }}><span className="mt-0.5"><Ics.Cal /></span><span className='leading-relaxed'>{fmt(tgl)}</span></div>
            <div className='flex gap-2 items-start text-xs' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted }}><span className="mt-0.5"><Ics.Clk /></span><span>{fmtTime(tgl)}</span></div>
            {lok && <div className='flex gap-2 items-start text-xs' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted }}><span className="flex-shrink-0 mt-0.5"><Ics.Pin /></span><span className='leading-relaxed'>{lok}{adr ? ` · ${adr}` : ''}</span></div>}
          </div>
          {mp && <a href={mp} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 mt-4 transition-all active:scale-95' style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', padding: '9px 20px', borderRadius: 2, background: 'transparent', border: `1px solid ${C.accent}`, color: C.accent, textDecoration: 'none' }}><span className="flex items-center"><Ics.Pin /> <span className="ml-1">Lihat Lokasi</span></span></a>}
        </div>
      </div>
    )
  }
  return (
    <section id='acara' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <BgLayer bg={resolveBg(w.bg_sections?.acara)} />
      <div className='relative z-10 px-5 py-20 text-center' style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionHeader label='Save the Date' title={<>Hari <em>Bahagia</em> Kami</>} />
        {target && <p className='text-sm mb-6' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted, marginTop: -16 }}>{fmt(target)}</p>}
        {!done ? (
          <div className='flex justify-center gap-3 mb-10'>
            {(['d', 'h', 'm', 's'] as const).map(k => {
              const val = k === 'd' ? d : k === 'h' ? h : k === 'm' ? m : s
              const lbl = k === 'd' ? 'Hari' : k === 'h' ? 'Jam' : k === 'm' ? 'Menit' : 'Detik'
              return (
                <div key={k} className='flex flex-col items-center' style={{ background: C.card, border: `1px solid ${C.border}`, width: 68, paddingTop: 14, paddingBottom: 14 }}>
                  <span style={{ fontFamily: "'Noto Serif',serif", fontSize: '1.9rem', fontWeight: 700, color: C.accent, lineHeight: 1 }}>{String(val).padStart(2, '0')}</span>
                  <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.subtle, marginTop: 5 }}>{lbl}</span>
                </div>
              )
            })}
          </div>
        ) : <p style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1.3rem', color: C.accent, margin: '24px 0' }}><span className="flex items-center justify-center gap-2"><Ics.Star /> Hari Bahagia Telah Tiba!</span></p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginBottom: 20 }}>
          <EvCard type='akad' /><EvCard type='resepsi' />
        </div>
        {target && <a href={gcalUrl(w)} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 transition-all active:scale-95 mt-2' style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', padding: '10px 22px', borderRadius: 2, border: `1.5px solid ${C.accent}`, color: C.accent, background: 'transparent', textDecoration: 'none' }}><span className="flex items-center"><Ics.Cal /> <span className="ml-1">Tambah ke Kalender</span></span></a>}
      </div>
    </section>
  )
}

// ── Section: RSVP ────────────────────────────────────────────────────
function SectionRSVP({ w }: { w: WeddingData }) {
  const [form, setForm] = useState({ nama: '', ucapan: '', hadir: 'hadir' })
  const [busy, setBusy] = useState(false); const [ok, setOk] = useState(false)
  const [list, setList] = useState<Ucapan[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { supabase.from('ucapan').select('*').eq('order_id', w.order_id).order('created_at', { ascending: false }).limit(30).then(({ data }) => { if (data) setList(data as Ucapan[]); setLoading(false) }) }, [w.order_id])
  async function send() {
    if (!form.nama.trim() || !form.ucapan.trim()) return
    setBusy(true)
    const { data } = await supabase.from('ucapan').insert({ order_id: w.order_id, ...form }).select().single()
    if (data) setList(p => [data as Ucapan, ...p])
    setOk(true); setBusy(false); setForm({ nama: '', ucapan: '', hadir: 'hadir' })
    setTimeout(() => setOk(false), 3000)
  }
  const iS: React.CSSProperties = { width: '100%', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 2, fontFamily: "'Work Sans',sans-serif", fontSize: '0.82rem', color: C.text, background: C.card, outline: 'none', boxSizing: 'border-box' }
  return (
    <section id='rsvp' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <div className='relative z-10 px-5 py-20 text-center' style={{ maxWidth: 520, margin: '0 auto' }}>
        <SectionHeader label='Konfirmasi Kehadiran' title={<>RSVP &amp; <em>Buku Tamu</em></>} />
        <p className='text-sm leading-loose mb-6 mx-auto' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted, maxWidth: 360, marginTop: -16 }}>Kehormatan kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.</p>
        {!ok ? (
          <div className='text-left space-y-4'>
            <div><label style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Nama</label><input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder='Nama lengkap Anda' style={iS} /></div>
            <div><label style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Kehadiran</label>
              <div className='flex gap-2'>{[['hadir', <span className="flex items-center justify-center gap-1"><Ics.Chk /> Hadir</span>], ['tidak', <span className="flex items-center justify-center gap-1"><Ics.X /> Tidak</span>], ['ragu', <span className="flex items-center justify-center gap-1"><Ics.Q /> Mungkin</span>]].map(([v, l]) => (
                <button key={String(v)} onClick={() => setForm(f => ({ ...f, hadir: v as any }))} className='flex-1 transition-all active:scale-95'
                  style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.7rem', padding: '10px 4px', borderRadius: 2, border: `1px solid ${form.hadir === v ? C.accent : C.border}`, background: form.hadir === v ? `rgba(255,255,255,0.12)` : C.card, color: form.hadir === v ? C.accent : C.muted, cursor: 'pointer', fontWeight: form.hadir === v ? 700 : 400 }}>{l}</button>
              ))}</div></div>
            <div><label style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 7 }}>Ucapan &amp; Doa</label><textarea value={form.ucapan} onChange={e => setForm(f => ({ ...f, ucapan: e.target.value }))} placeholder='Tulis ucapan terbaikmu...' rows={3} style={{ ...iS, resize: 'none' }} /></div>
            <button onClick={send} disabled={busy || !form.nama || !form.ucapan} className='w-full transition-all active:scale-95 disabled:opacity-50'
              style={{ fontFamily: "'Work Sans',sans-serif", fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '14px', borderRadius: 2, background: `linear-gradient(135deg,${C.accent},${C.accentSoft})`, color: C.bg, border: 'none', cursor: 'pointer', boxShadow: `0 6px 20px rgba(255,255,255,0.25)` }}>
              {busy ? 'Mengirim...' : <span className="flex items-center justify-center gap-1.5">Kirim Ucapan <Ics.Env /></span>}
            </button>
          </div>
        ) : <div className='py-8 rounded-sm' style={{ background: `rgba(255,255,255,0.08)`, border: `1px solid ${C.border}` }}><p style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '1rem', color: C.accent }}>Terima kasih atas ucapan dan doamu! ✨</p></div>}
        <div className='mt-8'>
          <p style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: '0.85rem', color: C.accentDim, marginBottom: 12 }}>— Ucapan &amp; Doa —</p>
          <div className='space-y-3 text-left' style={{ maxHeight: 300, overflowY: 'auto' }}>
            {loading ? <p className='text-center text-sm py-4' style={{ color: C.subtle }}>Memuat...</p>
              : list.length === 0 ? <p className='text-center text-sm py-4' style={{ color: C.subtle }}>Jadilah yang pertama memberi ucapan ✨</p>
                : list.map(u => (<div key={u.id} className='rounded-sm px-4 py-3' style={{ background: C.card, borderLeft: `2px solid ${C.accent}`, border: `1px solid ${C.borderLight}` }}>
                  <div className='flex justify-between mb-1'><p style={{ fontFamily: "'Work Sans',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.accentSoft }}>{u.nama}</p><span>{u.hadir === 'hadir' ? (<Ics.Chk />) : u.hadir === 'tidak' ? (<Ics.X />) : (<Ics.Q />)}</span></div>
                  <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.76rem', color: C.muted, lineHeight: 1.65 }}>{u.ucapan}</p>
                </div>))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section: Gallery ─────────────────────────────────────────────────
function SectionGallery({ w }: { w: WeddingData }) {
  const fotos = w.foto_urls || []; const [lb, setLb] = useState<number | null>(null)
  if (!fotos.length) return null
  return (
    <section id='galeri' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <BgLayer bg={resolveBg(w.bg_sections?.galeri)} />
      <div className='relative z-10 py-20' style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className='px-5 text-center mb-6'><SectionHeader label='Galeri Foto' title={<>Momen <em>Berharga</em></>} /></div>
        <div className='px-3 columns-2 gap-2'>
          {fotos.map((url, i) => (<div key={url} className='break-inside-avoid mb-2 cursor-pointer group' onClick={() => setLb(i)}>
            <div className='overflow-hidden rounded-sm relative'>
              <img src={url} alt='' loading='lazy' className='w-full object-cover transition-transform duration-500 group-active:scale-105' style={{ aspectRatio: i % 4 === 0 ? '3/4' : i % 4 === 1 ? '1/1' : i % 4 === 2 ? '4/5' : '1/1', display: 'block' }} />
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center' style={{ background: `rgba(255,255,255,0.15)` }}>
                <span style={{ fontSize: '1.3rem' }}>🔍</span></div></div></div>))}
        </div>
      </div>
      {lb !== null && (<div className='fixed inset-0 z-50 flex items-center justify-center' style={{ background: 'rgba(0,0,0,0.95)' }} onClick={() => setLb(null)}>
        <button className='absolute top-4 right-5 text-white text-3xl p-2 z-10' onClick={() => setLb(null)}>×</button>
        <button className='absolute left-2 text-white text-5xl p-4 z-10' onClick={e => { e.stopPropagation(); setLb(l => l! > 0 ? l! - 1 : fotos.length - 1) }}>&#8249;</button>
        <img src={fotos[lb]} alt='' className='max-h-[82dvh] max-w-[94vw] rounded-sm object-contain' onClick={e => e.stopPropagation()} />
        <button className='absolute right-2 text-white text-5xl p-4 z-10' onClick={e => { e.stopPropagation(); setLb(l => l! < fotos.length - 1 ? l! + 1 : 0) }}>&#8250;</button>
        <p className='absolute bottom-5 text-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>{lb + 1} / {fotos.length}</p>
      </div>)}
    </section>
  )
}

// ── Section: Love Story ──────────────────────────────────────────────
function SectionLoveStory({ w }: { w: WeddingData }) {
  if (!w.fitur_cerita_cinta) return null
  const stories = [
    { yr: w.tanggal_jadian ? new Date(w.tanggal_jadian).getFullYear() : '', title: 'Awal Pertemuan', desc: w.cerita_pertemuan || 'Sebuah pertemuan yang tak disengaja menjadi awal dari segalanya.', fi: 1 },
    { yr: w.tanggal_lamaran ? new Date(w.tanggal_lamaran).getFullYear() : '', title: 'Lamaran', desc: w.engagement_story || 'Dengan segenap ketulusan, ia memintaku menemaninya seumur hidup.', fi: 2 },
    { yr: w.resepsi_tanggal ? new Date(w.resepsi_tanggal).getFullYear() : '', title: 'Menuju Pelaminan', desc: 'Akhirnya, saatnya kami meresmikan cinta dalam ikatan suci yang diridhai Allah SWT.', fi: 0 },
  ]
  return (
    <section id='cerita' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <div className='relative z-10 px-5 py-20' style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionHeader label='Kisah Cinta' title={<>Perjalanan <em>Kita</em></>} />
        <div className='space-y-9'>
          {stories.map((s, i) => {
            const foto = w.foto_urls?.[s.fi]; return (
              <div key={i} className='flex items-center gap-5' style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}>
                <div className='flex-1 text-left'>
                  {s.yr && <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.accentDim, display: 'block', marginBottom: 3 }}>{String(s.yr)}</span>}
                  <h4 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', color: C.accent, marginBottom: 5 }}>{s.title}</h4>
                  <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.75rem', color: C.muted, lineHeight: 1.8 }}>{s.desc}</p>
                </div>
                <div style={{ width: 10, height: 10, flexShrink: 0, borderRadius: '50%', background: C.accent, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.border}` }} />
                {foto && <div className='flex-shrink-0 overflow-hidden rounded-sm' style={{ width: 65, height: 65, border: `1px solid ${C.border}` }}><img src={foto} alt='' className='w-full h-full object-cover' style={{ objectPosition: 'center top' }} /></div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Section: Gift ────────────────────────────────────────────────────
function SectionGift({ w }: { w: WeddingData }) {
  const [copied, setCopied] = useState<string | null>(null)
  if (!w.fitur_amplop_digital || !w.rekening_list?.length) return null
  const grouped = { pria: w.rekening_list.filter(r => r.kategori === 'pria'), wanita: w.rekening_list.filter(r => r.kategori === 'wanita'), bersama: w.rekening_list.filter(r => r.kategori === 'bersama') }
  function copy(text: string, key: string) { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2500) }
  return (
    <section id='amplop' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <div className='relative z-10 px-5 py-20 text-center' style={{ maxWidth: 540, margin: '0 auto' }}>
        <SectionHeader label='Wedding Gift' title={<>Hadiah <em>Digital</em></>} />
        <p className='text-sm leading-loose mb-6 mx-auto' style={{ fontFamily: "'Work Sans',sans-serif", color: C.muted, maxWidth: 380, marginTop: -16 }}>Kehadiran dan doa Anda adalah hadiah terindah. Namun jika berkenan memberikan tanda kasih, silakan gunakan informasi berikut.</p>
        <div className='space-y-5 text-left'>
          {(['pria', 'wanita', 'bersama'] as const).map(cat => {
            const lst = grouped[cat]; if (!lst.length) return null
            const lbl = cat === 'pria' ? (<><Ics.User /> <span style={{marginLeft:4}}>{w.pria_nama_panggilan}</span></>) : cat === 'wanita' ? (<><Ics.User /> <span style={{marginLeft:4}}>{w.wanita_nama_panggilan}</span></>) : (<><Ics.Ring /> <span style={{marginLeft:4}}>Bersama</span></>)
            return (<div key={cat}>
              <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.accentDim, fontWeight: 700, marginBottom: 8 }}>{lbl}</p>
              <div className='space-y-3'>{lst.map(r => (<div key={r.id} className='rounded-sm p-4' style={{ background: C.card, border: `1px solid ${C.borderLight}` }}>
                <div className='flex items-center justify-between gap-3'>
                  <div className='min-w-0'>
                    <p style={{ fontFamily: "'Work Sans',sans-serif", fontWeight: 700, fontSize: '0.68rem', color: C.accentDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.bank}</p>
                    <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '1.3rem', color: C.accent, letterSpacing: '0.04em', marginTop: 2, marginBottom: 2 }}>{r.nomor}</p>
                    <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.68rem', color: C.subtle }}>a.n. {r.nama}</p>
                  </div>
                  <button onClick={() => copy(r.nomor, r.id)} className='flex-shrink-0 transition-all active:scale-90'
                    style={{
                      fontFamily: "'Work Sans',sans-serif", fontSize: '0.6rem', fontWeight: 700, padding: '8px 14px', borderRadius: 2, cursor: 'pointer', minWidth: 68,
                      background: copied === r.id ? '#22c55e' : 'transparent', border: `1px solid ${copied === r.id ? '#22c55e' : C.accent}`, color: copied === r.id ? '#fff' : C.accent
                    }}>
                    {copied === r.id ? '✓ Disalin' : 'Salin'}
                  </button>
                </div>
              </div>))}</div>
            </div>)
          })}
        </div>
        {w.alamat_kado && (<div className='mt-4 rounded-sm p-4 text-left' style={{ background: C.card, border: `1px solid ${C.borderLight}` }}>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.accentDim, marginBottom: 6 }}><span className="flex items-center gap-1.5"><Ics.Box /> Alamat Kado Fisik</span></p>
          <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.8rem', color: C.muted, lineHeight: 1.75 }}>{w.alamat_kado}</p>
        </div>)}
      </div>
    </section>
  )
}

// ── Section: Footer ──────────────────────────────────────────────────
function SectionFooter({ w }: { w: WeddingData }) {
  const shareText = encodeURIComponent(`Hai! Kamu diundang ke pernikahan ${w.pria_nama_panggilan} & ${w.wanita_nama_panggilan} 💍\n${typeof window !== 'undefined' ? window.location.href : ''}`)
  return (
    <section id='footer' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <BgLayer bg={resolveBg(w.bg_sections?.footer)} />
      <div className='relative z-10 text-center px-6 py-20' style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.78rem', color: C.muted, lineHeight: 1.9, maxWidth: 360, margin: '0 auto 10px' }}>
          Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari bahagia kami. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.
        </p>
        <LineDivider width={80} />
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2rem,8vw,3.2rem)', color: C.accent, lineHeight: 1.1, margin: '20px 0 8px' }}>
          {w.pria_nama_panggilan} &amp; {w.wanita_nama_panggilan}
        </h2>
        <LineDivider width={50} />
        {w.resepsi_tanggal && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.68rem', letterSpacing: '0.25em', color: C.subtle, marginTop: 8 }}>{fmtShort(w.resepsi_tanggal)}</p>}
        {w.hashtag_instagram && <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.68rem', color: C.subtle, marginTop: 10 }}>{w.hashtag_instagram}</p>}
      </div>
      {/* Copyright */}
      <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px 16px', textAlign: 'center', borderTop: `1px solid ${C.borderLight}` }}>
        <p style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.58rem', color: C.subtle, letterSpacing: '0.12em' }}>
          Made with <span style={{ color: C.accent }}>♥</span> by <span style={{ fontWeight: 700, color: C.accentDim }}>Katresnan</span> · katresnan.id
        </p>
      </div>
    </section>
  )
}

// ── Section: Video Link ───────────────────────────────────────────
function SectionVideo({ w }: { w: WeddingData }) {
  const ytUrl = w.video_youtube_url
  if (!ytUrl) return null
  const ytId = ytUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1]
  if (!ytId) return null
  return (
    <section id='video' className='relative overflow-hidden' style={{ background: 'transparent' }}>
      <div className='relative z-10 py-20' style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className='px-5 text-center mb-6'><SectionHeader label='Video' title={<>Cerita <em>Cinta</em> Kami</>} /></div>
        <div className='mx-4 relative overflow-hidden rounded-sm' style={{ aspectRatio: '16/9' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title='Wedding Video'
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
          />
        </div>
        <p className='text-center mt-4 px-5' style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.75rem', color: C.muted, lineHeight: 1.7 }}>
          Tonton kisah perjalanan cinta kami di hari yang spesial ini
        </p>
      </div>
    </section>
  )
}

// ── Desktop Slideshow ─────────────────────────────────────────────────
function DesktopSlideshow({ w }: { w: WeddingData }) {
  const fotos = (w.foto_urls || []).filter(Boolean)
  const [cur, setCur] = useState(0)
  const [fade, setFade] = useState(true)
  useEffect(() => {
    if (fotos.length < 2) return
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => { setCur(c => (c + 1) % fotos.length); setFade(true) }, 350)
    }, 4500)
    return () => clearInterval(id)
  }, [fotos.length])
  function goTo(i: number) { setFade(false); setTimeout(() => { setCur(i); setFade(true) }, 300) }
  function prev() { goTo((cur - 1 + fotos.length) % fotos.length) }
  function next() { goTo((cur + 1) % fotos.length) }
  if (!fotos.length) return (
    <div className='w-full h-full flex items-center justify-center' style={{ background: `linear-gradient(135deg,${C.bg},#1a1a2e)` }}>
      <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '2rem', color: C.accentDim, fontStyle: 'italic', opacity: 0.3 }}>Gallery</p>
    </div>
  )
  return (
    <div className='relative w-full h-full overflow-hidden' style={{ background: C.bg }}>
      <img key={cur} src={fotos[cur]} alt='' className='absolute inset-0 w-full h-full object-cover'
        style={{ objectPosition: 'center top', opacity: fade ? 0.85 : 0, transition: 'opacity 0.4s ease' }} />
      <div className='absolute inset-0' style={{ background: `linear-gradient(180deg,rgba(10,10,15,0.2) 0%,rgba(10,10,15,0.0) 35%,rgba(10,10,15,0.7) 100%)` }} />
      <div className='absolute bottom-0 left-0 right-0 px-12 pb-12 z-10'>
        <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.58rem', letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Undangan Pernikahan</p>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.4rem,3.8vw,3.8rem)', color: '#fff', lineHeight: 0.95, textShadow: '0 2px 24px rgba(0,0,0,0.55)', margin: '0 0 4px' }}>
          {w.pria_nama_panggilan || 'Nama Pria'}
        </h2>
        <p style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontSize: 'clamp(1.4rem,2.2vw,2rem)', color: C.accent, lineHeight: 1, margin: '4px 0' }}>&amp;</p>
        <h2 style={{ fontFamily: "'Noto Serif',serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(2.4rem,3.8vw,3.8rem)', color: '#fff', lineHeight: 0.95, textShadow: '0 2px 24px rgba(0,0,0,0.55)', margin: '4px 0 12px' }}>
          {w.wanita_nama_panggilan || 'Nama Wanita'}
        </h2>
        <div style={{ width: 40, height: 1, background: `linear-gradient(to right,transparent,${C.accent},transparent)`, marginBottom: 10 }} />
        {w.resepsi_tanggal && <p style={{ fontFamily: "'Noto Serif',serif", fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{fmtShort(w.resepsi_tanggal)}</p>}
      </div>
      {fotos.length > 1 && (
        <>
          <button onClick={prev} className='absolute left-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all hover:scale-110 active:scale-90'
            style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: `1px solid rgba(255,255,255,0.3)`, color: '#fff', fontSize: '1.4rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>&#8249;</button>
          <button onClick={next} className='absolute right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center transition-all hover:scale-110 active:scale-90'
            style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.3)', border: `1px solid rgba(255,255,255,0.3)`, color: '#fff', fontSize: '1.4rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>&#8250;</button>
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center'>
            {fotos.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{ width: i === cur ? 24 : 7, height: 7, borderRadius: 4, background: i === cur ? C.accent : 'rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
          <div className='absolute top-7 right-8 z-20'>
            <span style={{ fontFamily: "'Work Sans',sans-serif", fontSize: '0.58rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)' }}>{String(cur + 1).padStart(2, '0')} / {String(fotos.length).padStart(2, '0')}</span>
          </div>
        </>
      )}
    </div>
  )
}

// ── Global Video Background ──────────────────────────────────────────
function GlobalVideoBg({ bg }: { bg?: { type: string; url: string; overlay: number } }) {
  if (!bg || bg.type === 'default' || !bg.url) return null
  const ov = bg.overlay ?? 0.4
  const ytId = bg.type === 'youtube'
    ? (bg.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || '')
    : ''
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {bg.type === 'youtube' && ytId && (
        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&disablekb=1&playsinline=1`}
          allow='autoplay' title='bg-global'
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(1.6)', width: '100%', height: '100%', minWidth: '177.78%', minHeight: '56.25vw', border: 'none', pointerEvents: 'none' }} />
      )}
      {bg.type === 'video' && (<video src={bg.url} autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />)}
      {bg.type === 'foto' && (<img src={bg.url} alt='' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />)}
      <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${ov})`, pointerEvents: 'none' }} />
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────
export default function TemplateJogjaFloral({ wedding: wd }: { wedding: WeddingData }) {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function open() {
    setOpened(true)
    // Music: load dulu baru play (fix untuk mobile)
    const audio = audioRef.current
    if (audio) {
      audio.load()
      const tryPlay = () => {
        audio.play().then(() => setPlaying(true)).catch(() => {
          // Retry setelah 500ms jika gagal (mobile restriction)
          setTimeout(() => audio.play().then(() => setPlaying(true)).catch(() => { }), 500)
        })
      }
      // Tunggu audio siap
      if (audio.readyState >= 2) tryPlay()
      else audio.addEventListener('canplay', tryPlay, { once: true })
    }
    const sc = document.getElementById('jf-scroll')
    if (sc) sc.scrollTop = 0
  }

  function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else {
      audio.load()
      audio.play().then(() => setPlaying(true)).catch(() => { })
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Work+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        html{font-size:16px;scroll-behavior:smooth;}

        /* ══ Video background — fixed, full viewport ══ */
        .jf-video-bg{
          position:fixed;top:0;left:0;width:100vw;height:100vh;
          z-index:0;overflow:hidden;pointer-events:none;
        }

        /* ══ MOBILE ══ */
        body{margin:0;padding:0;background:${C.bg};overflow-x:hidden;}
        .jf-left{display:none;}
        .jf-right{width:100%;min-height:100dvh;background:transparent;position:relative;z-index:1;}
        .jf-root{width:100%;overflow-x:hidden;background:transparent;}

        /* ══ DESKTOP ≥768px ══ */
        @media(min-width:768px){
          html,body{height:100%;overflow:hidden;background:${C.bg};}
          .jf-video-bg{z-index:0;} /* tetap tampil di desktop */
          .jf-left{
            display:block;position:fixed;top:0;left:0;width:66.667vw;height:100vh;z-index:2;
          }
          .jf-right{
            position:fixed;top:0;left:66.667vw;width:33.333vw;height:100vh;
            overflow-y:auto;overflow-x:hidden;z-index:3;
            background:rgba(10,10,15,0.65);
            backdrop-filter:blur(2px);
            box-shadow:-4px 0 24px rgba(0,0,0,0.5);
            scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.15) transparent;
          }
          .jf-right::-webkit-scrollbar{width:3px;}
          .jf-right::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
          .jf-root{min-height:100vh;background:transparent!important;}
        }

        @keyframes jfFadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
        .jf-section{animation:jfFadeUp 0.5s ease both;}
        input:focus,textarea:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px rgba(255,255,255,0.12)!important;outline:none!important;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
      `}</style>

      <audio ref={audioRef} loop preload='auto'>
        {wd.musik_pilihan?.startsWith('http') && <source src={wd.musik_pilihan} />}
      </audio>

      {/* Fixed video/foto background (dari bg_sections.semua) */}
      <VideoBgFixed w={wd} />

      {/* Kiri: Slideshow — desktop only */}
      <div className='jf-left'>
        <DesktopSlideshow w={wd} />
      </div>

      {/* Kanan: Undangan */}
      <div className='jf-right' id='jf-scroll'>
        <div className='jf-root'>
          {!opened
            ? <Cover w={wd} onOpen={open} />
            : <main>
              <div className='jf-section'><SectionHeroSlideshow w={wd} /></div>
              <div className='jf-section'><SectionQuote w={wd} /></div>
              <div className='jf-section'><SectionMempelai w={wd} /></div>
              <div className='jf-section'><SectionAcara w={wd} /></div>
              <div className='jf-section'><SectionRSVP w={wd} /></div>
              <div className='jf-section'><SectionGallery w={wd} /></div>
              <div className='jf-section'><SectionVideo w={wd} /></div>
              <div className='jf-section'><SectionLoveStory w={wd} /></div>
              <div className='jf-section'><SectionGift w={wd} /></div>
              <div className='jf-section'><SectionFooter w={wd} /></div>
            </main>
          }
        </div>
      </div>

      {/* Musik btn */}
      {opened && (
        <button id='jf-music' onClick={toggleMusic}
          className='fixed bottom-6 left-5 z-50 flex items-center justify-center rounded-full transition-all active:scale-90'
          style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.2)`, color: '#fff', cursor: 'pointer', backdropFilter: 'blur(12px)', boxShadow: `0 3px 14px rgba(0,0,0,0.3)`, fontSize: '0.75rem' }}>
          {playing ? '⏸' : '▶'}
        </button>
      )}
    </>
  )
}
