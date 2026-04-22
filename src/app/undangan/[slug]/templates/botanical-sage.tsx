'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
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

// ── Design Tokens — Botanical Sage ───────────────────────────────────
const C = {
  // Backgrounds
  sage:        '#7a9e7e',   // primary sage green
  sageDark:    '#5a7e5e',   // darker sage
  sageDeep:    '#2d5a32',   // deep forest section bg
  sageMid:     '#4a7050',   // mid forest green
  cream:       '#faf6ef',   // main light bg
  creamAlt:    '#f2ebe0',   // alternate light bg
  parchment:   '#ede3d0',   // parchment card

  // Accents
  gold:        '#c9a84c',   // warm gold
  goldLight:   '#e5c97a',   // gold highlight
  goldDim:     'rgba(201,168,76,0.5)',
  goldSubtle:  'rgba(201,168,76,0.2)',

  // Typography
  inkDark:     '#1a2e1c',   // very dark green for headings
  inkMid:      '#2d4a30',   // dark green text
  inkLight:    '#4a6b4d',   // lighter green text
  inkMuted:    '#6b8c6e',   // muted green
  creamText:   '#faf6ef',
  creamMuted:  'rgba(250,246,239,0.75)',
  creamSubtle: 'rgba(250,246,239,0.45)',

  // Borders
  border:      'rgba(201,168,76,0.35)',
  borderLight: 'rgba(201,168,76,0.18)',
  borderSage:  'rgba(90,126,94,0.3)',
}

// ── Kata preset ───────────────────────────────────────────────────────
const KATA_QURAN = {
  label: 'QS. Ar-Rum: 21',
  text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tentram di sampingnya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."',
  sub: 'Semoga Allah memberkahi pernikahan kami, dan menjadikannya penuh cinta, kasih sayang, dan kebahagiaan abadi.'
}
const KATA_BIBLE = {
  label: '1 Korintus 13:4-7',
  text: '"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong."',
  sub: 'Kiranya Tuhan memberkati pernikahan kami dengan kasih setia-Nya yang kekal.'
}

// ── SVG Botanical Ornaments ───────────────────────────────────────────────────
// Semua ornamen pure SVG — tidak butuh file gambar eksternal.

// 1. MEDALLION — compass-rose + scrollwork + 8-petal flower
const Medallion = ({ size = 80, dark = false }: { size?: number; dark?: boolean }) => {
  const gc = dark ? C.goldLight : C.gold
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Rings */}
      <circle cx="50" cy="50" r="47" stroke={gc} strokeWidth="0.5" opacity="0.35"/>
      <circle cx="50" cy="50" r="43" stroke={gc} strokeWidth="1"   opacity="0.5"/>
      <circle cx="50" cy="50" r="36" stroke={gc} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4"/>
      <circle cx="50" cy="50" r="28" stroke={gc} strokeWidth="1.2" opacity="0.6"/>
      {/* 4 cardinal rays */}
      <path d="M50 7  L53 43 L50 50 L47 43Z" fill={gc} opacity="0.55"/>
      <path d="M93 50 L57 53 L50 50 L57 47Z" fill={gc} opacity="0.55"/>
      <path d="M50 93 L47 57 L50 50 L53 57Z" fill={gc} opacity="0.55"/>
      <path d="M7  50 L43 47 L50 50 L43 53Z" fill={gc} opacity="0.55"/>
      {/* 4 diagonal shorter rays */}
      <path d="M79.2 20.8 L55 46 L50 50 L54 45Z" fill={gc} opacity="0.35"/>
      <path d="M79.2 79.2 L54 54 L50 50 L55 54Z" fill={gc} opacity="0.35"/>
      <path d="M20.8 79.2 L46 54 L50 50 L46 55Z" fill={gc} opacity="0.35"/>
      <path d="M20.8 20.8 L46 46 L50 50 L45 46Z" fill={gc} opacity="0.35"/>
      {/* Scrollwork at cardinal ends */}
      <path d="M50 14 Q44 20 47 26 Q50 20 53 26 Q56 20 50 14Z" fill={gc} opacity="0.4"/>
      <path d="M86 50 Q80 44 74 47 Q80 50 74 53 Q80 56 86 50Z" fill={gc} opacity="0.4"/>
      <path d="M50 86 Q56 80 53 74 Q50 80 47 74 Q44 80 50 86Z" fill={gc} opacity="0.4"/>
      <path d="M14 50 Q20 56 26 53 Q20 50 26 47 Q20 44 14 50Z" fill={gc} opacity="0.4"/>
      {/* Leaf sprigs at diagonals */}
      <path d="M68 17 Q72 24 66 28 Q62 22 68 17Z" fill={gc} opacity="0.3"/>
      <path d="M83 32 Q76 36 74 30 Q80 26 83 32Z" fill={gc} opacity="0.3"/>
      <path d="M83 68 Q76 64 74 70 Q80 74 83 68Z" fill={gc} opacity="0.3"/>
      <path d="M68 83 Q72 76 66 72 Q62 78 68 83Z" fill={gc} opacity="0.3"/>
      <path d="M32 17 Q28 24 34 28 Q38 22 32 17Z" fill={gc} opacity="0.3"/>
      <path d="M17 32 Q24 36 26 30 Q20 26 17 32Z" fill={gc} opacity="0.3"/>
      <path d="M17 68 Q24 64 26 70 Q20 74 17 68Z" fill={gc} opacity="0.3"/>
      <path d="M32 83 Q28 76 34 72 Q38 78 32 83Z" fill={gc} opacity="0.3"/>
      {/* Center 8-petal flower */}
      <path d="M50 38 Q54 44 50 50 Q46 44 50 38Z" fill={gc} opacity="0.6"/>
      <path d="M62 50 Q56 54 50 50 Q56 46 62 50Z" fill={gc} opacity="0.6"/>
      <path d="M50 62 Q46 56 50 50 Q54 56 50 62Z" fill={gc} opacity="0.6"/>
      <path d="M38 50 Q44 46 50 50 Q44 54 38 50Z" fill={gc} opacity="0.6"/>
      <path d="M58 42 Q57 49 50 50 Q51 43 58 42Z" fill={gc} opacity="0.4"/>
      <path d="M58 58 Q51 57 50 50 Q57 51 58 58Z" fill={gc} opacity="0.4"/>
      <path d="M42 58 Q43 51 50 50 Q49 57 42 58Z" fill={gc} opacity="0.4"/>
      <path d="M42 42 Q49 43 50 50 Q43 49 42 42Z" fill={gc} opacity="0.4"/>
      {/* Pistil */}
      <circle cx="50" cy="50" r="5"   fill={gc}    opacity="0.8"/>
      <circle cx="50" cy="50" r="2.5" fill="white" opacity="0.6"/>
    </svg>
  )
}

// 2. LILY CLUSTER — realistic lily blooms + leaves + peacock feather
const LilyCluster = ({ side = 'left', height = 300 }: { side?: 'left' | 'right'; height?: number }) => (
  <svg width={height * 0.6} height={height} viewBox="0 0 180 300" fill="none"
    style={{ transform: side === 'right' ? 'scaleX(-1)' : 'none' }}>

    {/* Stems */}
    <path d="M90 298 C88 270 82 240 75 210 C68 180 62 155 70 125 C76 100 85 80 88 55"
      stroke={C.sageDark} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M90 298 C93 265 98 238 104 208 C110 178 112 155 105 130 C100 110 94 90 92 60"
      stroke={C.sageDark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>

    {/* Top lily bloom — 5 petals */}
    <path d="M88 55 C70 30 45 18 30 35 C20 48 35 60 55 58 C68 56 80 54 88 55Z"
      fill={C.creamText} opacity="0.82" stroke={C.goldDim} strokeWidth="0.8"/>
    <path d="M88 55 C78 20 85 -2 100 5 C115 14 110 40 98 52 C93 57 90 56 88 55Z"
      fill={C.creamText} opacity="0.78" stroke={C.goldDim} strokeWidth="0.8"/>
    <path d="M88 55 C60 48 38 58 30 78 C24 94 40 100 62 90 C76 82 84 68 88 55Z"
      fill={C.creamText} opacity="0.92" stroke={C.goldDim} strokeWidth="0.8"/>
    <path d="M88 55 C100 42 120 38 132 52 C142 64 132 76 116 78 C102 80 92 66 88 55Z"
      fill={C.creamText} opacity="0.88" stroke={C.goldDim} strokeWidth="0.8"/>
    <path d="M88 55 C78 62 72 82 78 100 C84 117 100 118 110 105 C118 92 112 72 88 55Z"
      fill={C.creamText} opacity="0.90" stroke={C.goldDim} strokeWidth="0.8"/>
    {/* Petal veins */}
    <path d="M88 55 C72 68 55 80 44 88"  stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5"/>
    <path d="M88 55 C100 58 118 66 128 72" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5"/>
    <path d="M88 55 C82 72 80 90 84 104"  stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.5"/>
    {/* Stamens */}
    <path d="M88 55 L80 40" stroke={C.goldLight} strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
    <path d="M88 55 L88 38" stroke={C.goldLight} strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
    <path d="M88 55 L96 40" stroke={C.goldLight} strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
    <circle cx="80" cy="38" r="2.5" fill={C.gold} opacity="0.9"/>
    <circle cx="88" cy="36" r="2.5" fill={C.gold} opacity="0.9"/>
    <circle cx="96" cy="38" r="2.5" fill={C.gold} opacity="0.9"/>
    <circle cx="88" cy="58" r="5"   fill={C.goldLight} opacity="0.3"/>

    {/* Mid bud — 3 petals */}
    <path d="M75 138 C62 115 44 108 34 120 C26 130 36 148 56 148 C66 148 72 144 75 138Z"
      fill={C.creamText} opacity="0.80" stroke={C.goldDim} strokeWidth="0.7"/>
    <path d="M75 138 C82 112 95 108 102 120 C108 132 100 148 82 148 C78 148 76 144 75 138Z"
      fill={C.creamText} opacity="0.76" stroke={C.goldDim} strokeWidth="0.7"/>
    <path d="M75 138 C68 148 66 162 72 172 C78 182 90 180 94 168 C98 156 90 144 75 138Z"
      fill={C.creamText} opacity="0.85" stroke={C.goldDim} strokeWidth="0.7"/>
    <path d="M75 138 L72 124" stroke={C.goldLight} strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
    <path d="M75 138 L78 124" stroke={C.goldLight} strokeWidth="0.8" strokeLinecap="round" opacity="0.7"/>
    <circle cx="72" cy="122" r="2" fill={C.gold} opacity="0.85"/>
    <circle cx="78" cy="122" r="2" fill={C.gold} opacity="0.85"/>

    {/* Small closed bud */}
    <path d="M82 218 C74 206 68 198 70 210 C71 218 76 224 82 224 C88 224 93 218 94 210 C96 198 90 206 82 218Z"
      fill={C.creamText} opacity="0.75" stroke={C.goldDim} strokeWidth="0.6"/>
    <path d="M82 218 L80 205 M82 218 L82 204 M82 218 L84 205"
      stroke={C.sageDark} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>

    {/* Leaves with midrib */}
    <path d="M78 170 C55 158 30 162 22 178 C18 188 30 196 52 186 C65 180 74 175 78 170Z" fill={C.sage} opacity="0.70"/>
    <path d="M78 170 C60 172 40 180 30 186" stroke={C.sageDark} strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M96 195 C118 182 145 186 152 202 C156 212 144 220 122 210 C108 204 100 200 96 195Z" fill={C.sageDark} opacity="0.60"/>
    <path d="M96 195 C115 197 135 206 144 210" stroke={C.sageDark} strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M80 245 C58 232 35 237 28 252 C23 264 38 272 60 262 C72 256 78 250 80 245Z" fill={C.sage} opacity="0.65"/>
    <path d="M80 245 C62 248 44 258 35 263" stroke={C.sageDark} strokeWidth="0.8" fill="none" opacity="0.5"/>

    {/* Peacock feather — shaft */}
    <path d="M140 298 C138 265 135 235 132 205 C129 175 126 148 128 118 C130 95 134 78 136 55"
      stroke={C.sageMid} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55"/>
    {/* Feather barbs left */}
    {[0,1,2,3,4,5,6,7].map(i => {
      const y = 80 + i * 24, x = 136 - i * 0.5
      return <path key={`fl${i}`} d={`M${x} ${y} C${x-12} ${y-4} ${x-22} ${y+6} ${x-28} ${y+16}`}
        stroke={C.sageMid} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity={0.4 + i * 0.04}/>
    })}
    {/* Feather barbs right */}
    {[0,1,2,3,4,5,6,7].map(i => {
      const y = 88 + i * 24, x = 136 - i * 0.5
      return <path key={`fr${i}`} d={`M${x} ${y} C${x+10} ${y-6} ${x+18} ${y+4} ${x+22} ${y+14}`}
        stroke={C.sage} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity={0.35 + i * 0.03}/>
    })}
    {/* Peacock eye */}
    <ellipse cx="136" cy="62" rx="12" ry="18" fill={C.sageDark} opacity="0.35" stroke={C.sageMid} strokeWidth="0.6"/>
    <ellipse cx="136" cy="62" rx="7"  ry="11" fill={C.gold}     opacity="0.25" stroke={C.gold}    strokeWidth="0.8"/>
    <ellipse cx="136" cy="62" rx="4"  ry="6"  fill={C.sageDark} opacity="0.55"/>
    <circle  cx="136" cy="60" r="2"           fill={C.goldLight} opacity="0.6"/>
    <path d="M128 55 Q136 48 144 55" stroke={C.sage}    strokeWidth="0.6" fill="none" opacity="0.5"/>
    <path d="M128 69 Q136 76 144 69" stroke={C.sageMid} strokeWidth="0.6" fill="none" opacity="0.5"/>
  </svg>
)

// 3. BOTANICAL DIVIDER — vine scroll + leaf sprigs + 6-petal center flower
const BotDivider = ({ width = 240, light = false }: { width?: number; light?: boolean }) => {
  const gc  = light ? C.creamText  : C.gold
  const gop = light ? 0.5 : 0.65
  const lc  = light ? C.creamMuted : C.sageDark
  return (
    <svg width={width} height="36" viewBox={`0 0 ${width} 36`} fill="none" preserveAspectRatio="xMidYMid meet">
      {/* Left vine scroll */}
      <path d={`M0 18 Q${width*.08} 12 ${width*.15} 18 Q${width*.22} 24 ${width*.28} 18 Q${width*.33} 13 ${width*.38} 18`}
        stroke={gc} strokeWidth="0.8" fill="none" opacity={gop*.8}/>
      {/* Right vine scroll */}
      <path d={`M${width} 18 Q${width*.92} 12 ${width*.85} 18 Q${width*.78} 24 ${width*.72} 18 Q${width*.67} 13 ${width*.62} 18`}
        stroke={gc} strokeWidth="0.8" fill="none" opacity={gop*.8}/>
      {/* Left leaf sprigs */}
      <path d={`M${width*.12} 18 Q${width*.10} 10 ${width*.06} 10 Q${width*.10} 16 ${width*.12} 18Z`} fill={lc} opacity="0.5"/>
      <path d={`M${width*.22} 18 Q${width*.20} 26 ${width*.16} 27 Q${width*.20} 20 ${width*.22} 18Z`} fill={lc} opacity="0.45"/>
      <path d={`M${width*.32} 18 Q${width*.30} 10 ${width*.27} 9  Q${width*.30} 16 ${width*.32} 18Z`} fill={lc} opacity="0.4"/>
      {/* Right leaf sprigs */}
      <path d={`M${width*.88} 18 Q${width*.90} 10 ${width*.94} 10 Q${width*.90} 16 ${width*.88} 18Z`} fill={lc} opacity="0.5"/>
      <path d={`M${width*.78} 18 Q${width*.80} 26 ${width*.84} 27 Q${width*.80} 20 ${width*.78} 18Z`} fill={lc} opacity="0.45"/>
      <path d={`M${width*.68} 18 Q${width*.70} 10 ${width*.73} 9  Q${width*.70} 16 ${width*.68} 18Z`} fill={lc} opacity="0.4"/>
      {/* Center 6-petal flower */}
      <path d={`M${width/2} 10 Q${width/2+4} 14 ${width/2} 18 Q${width/2-4} 14 ${width/2} 10Z`}    fill={gc} opacity={gop}/>
      <path d={`M${width/2} 26 Q${width/2+4} 22 ${width/2} 18 Q${width/2-4} 22 ${width/2} 26Z`}    fill={gc} opacity={gop}/>
      <path d={`M${width/2-7} 12 Q${width/2-2} 15 ${width/2} 18 Q${width/2-5} 16 ${width/2-7} 12Z`} fill={gc} opacity={gop*.8}/>
      <path d={`M${width/2+7} 12 Q${width/2+2} 15 ${width/2} 18 Q${width/2+5} 16 ${width/2+7} 12Z`} fill={gc} opacity={gop*.8}/>
      <path d={`M${width/2-7} 24 Q${width/2-2} 21 ${width/2} 18 Q${width/2-5} 20 ${width/2-7} 24Z`} fill={gc} opacity={gop*.8}/>
      <path d={`M${width/2+7} 24 Q${width/2+2} 21 ${width/2} 18 Q${width/2+5} 20 ${width/2+7} 24Z`} fill={gc} opacity={gop*.8}/>
      <circle cx={width/2} cy="18" r="3.5" fill={gc}    opacity={gop*1.1}/>
      <circle cx={width/2} cy="18" r="1.5" fill="white" opacity="0.6"/>
      {/* Flanking dots */}
      <circle cx={width/2-18} cy="18" r="1.8" fill={gc} opacity={gop*.6}/>
      <circle cx={width/2+18} cy="18" r="1.8" fill={gc} opacity={gop*.6}/>
      <circle cx={width/2-26} cy="18" r="1.1" fill={gc} opacity={gop*.4}/>
      <circle cx={width/2+26} cy="18" r="1.1" fill={gc} opacity={gop*.4}/>
    </svg>
  )
}

// 4. PETAL SCATTER — SVG petals dengan urat daun jatuh berputar
const PetalScatter = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {[
      { left: '8%',  delay: '0s',   dur: 12, size: 15, rot: 20  },
      { left: '22%', delay: '2.1s', dur: 10, size: 11, rot: -30 },
      { left: '38%', delay: '0.6s', dur: 14, size: 17, rot: 45  },
      { left: '55%', delay: '3.2s', dur: 11, size: 13, rot: -15 },
      { left: '70%', delay: '1.0s', dur: 13, size: 16, rot: 60  },
      { left: '85%', delay: '4.5s', dur: 9,  size: 12, rot: -45 },
      { left: '15%', delay: '5.5s', dur: 15, size: 10, rot: 10  },
      { left: '62%', delay: '1.8s', dur: 11, size: 14, rot: -20 },
    ].map((p, i) => (
      <svg key={i} width={p.size} height={p.size * 1.6}
        viewBox="0 0 20 32" fill="none"
        style={{
          position: 'absolute', top: -50, left: p.left,
          opacity: 0.7,
          animation: `petalFall ${p.dur}s ease-in ${p.delay} infinite`,
          transform: `rotate(${p.rot}deg)`,
        }}>
        {/* Realistic petal shape */}
        <path d="M10 30 C3 22 0 13 3 6 Q10 0 17 6 C20 13 17 22 10 30Z" fill="white" opacity="0.88"/>
        {/* Centre vein */}
        <path d="M10 30 C10 20 10 10 10 4" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.45"/>
        {/* Side veins */}
        <path d="M10 22 C7 17 5 15 5 12"  stroke={C.gold} strokeWidth="0.35" fill="none" opacity="0.3"/>
        <path d="M10 22 C13 17 15 15 15 12" stroke={C.gold} strokeWidth="0.35" fill="none" opacity="0.3"/>
        <path d="M10 14 C7 11 6 9 6 7"    stroke={C.gold} strokeWidth="0.3"  fill="none" opacity="0.2"/>
        <path d="M10 14 C13 11 14 9 14 7"  stroke={C.gold} strokeWidth="0.3"  fill="none" opacity="0.2"/>
      </svg>
    ))}
  </div>
)

// ── SCREEN 5: Hero Section ─────────────────────────────────────────────
// Sage green bg, lily borders, large couple names bold serif, gold button
function Cover({ w, onOpen }: { w: WeddingData; onOpen: () => void }) {
  return (
    <section style={{ minHeight: '100dvh', background: C.sage, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Parchment texture overlay */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%, rgba(250,246,239,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Botanical borders — left & right lily clusters */}
      <div style={{ position: 'absolute', left: -10, bottom: 0, zIndex: 1, opacity: 0.85 }}>
        <LilyCluster side="left" height={280} />
      </div>
      <div style={{ position: 'absolute', right: -10, bottom: 0, zIndex: 1, opacity: 0.85 }}>
        <LilyCluster side="right" height={280} />
      </div>

      {/* Falling petals */}
      <PetalScatter />

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '32px 60px' }}>
        {/* "The Wedding of" label */}
        <p style={{
          fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
          fontStyle: 'italic', fontSize: '1rem',
          color: C.creamText, opacity: 0.85,
          letterSpacing: '0.08em', marginBottom: 8,
        }}>
          The Wedding of
        </p>

        {/* Gold divider line */}
        <div style={{ width: 80, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, margin: '0 auto 20px' }} />

        {/* Groom name */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Noto Serif', serif",
          fontWeight: 700, fontSize: 'clamp(2.8rem,12vw,4.2rem)',
          color: C.creamText, lineHeight: 0.9,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}>
          {w.pria_nama_panggilan || 'NAMA PRIA'}
        </h1>

        {/* Ampersand */}
        <p style={{
          fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
          fontStyle: 'italic', fontSize: 'clamp(2rem,8vw,3rem)',
          color: C.goldLight, lineHeight: 1.2, margin: '4px 0',
        }}>
          &amp;
        </p>

        {/* Bride name */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Noto Serif', serif",
          fontWeight: 700, fontSize: 'clamp(2.8rem,12vw,4.2rem)',
          color: C.creamText, lineHeight: 0.9,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}>
          {w.wanita_nama_panggilan || 'NAMA WANITA'}
        </h1>

        {/* Gold divider */}
        <div style={{ width: 80, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, margin: '20px auto 16px' }} />

        {/* Date */}
        {w.resepsi_tanggal && (
          <p style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontStyle: 'italic', fontSize: '0.95rem', color: C.creamMuted, letterSpacing: '0.05em', marginBottom: 28 }}>
            {fmt(w.resepsi_tanggal, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        {/* Buka Undangan button — gold border, transparent */}
        <button onClick={onOpen}
          className="transition-all active:scale-95 hover:scale-105"
          style={{


            fontFamily: "'Cormorant Garamond', sans-serif",
            fontSize: '0.85rem', letterSpacing: '0.2em',
            padding: '12px 36px',
            background: 'rgba(201,168,76,0.12)',
            border: `1.5px solid ${C.gold}`,
            color: C.goldLight,
            cursor: 'pointer', borderRadius: 0,
            backdropFilter: 'blur(4px)',
          }}>
          Buka Undangan
        </button>
      </div>
    </section>
  )
}

// ── SCREEN 4: Intro Quote ─────────────────────────────────────────────
// Cream/parchment bg, central medallion medallion ornament, falling petals
function SectionQuote({ w }: { w: WeddingData }) {
  const pilihan = w.kata_kata_pilihan || 'quran'
  const isCustom = pilihan === 'custom'
  const preset = pilihan === 'quran' ? KATA_QURAN : KATA_BIBLE
  return (
    <section style={{ background: C.cream, position: 'relative', overflow: 'hidden' }}>
      {/* Soft petal scatter */}
      <PetalScatter />
      <div style={{ position: 'relative', zIndex: 1, padding: '64px 32px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        {/* Medallion ornament */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Medallion size={72} />
        </div>

        {/* Label */}
        <p style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontStyle: 'italic', fontSize: '0.78rem', letterSpacing: '0.12em', color: C.inkMuted, marginBottom: 18 }}>
          {isCustom ? 'Kata-kata' : preset.label}
        </p>

        {/* Quote text */}
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
          fontStyle: 'italic', fontSize: 'clamp(1rem,3vw,1.2rem)',
          color: C.inkDark, lineHeight: 2, margin: '0 0 16px',
          borderLeft: `3px solid ${C.goldDim}`, paddingLeft: 20, textAlign: 'left',
        }}>
          {isCustom ? (w.kata_kata_custom || '...') : preset.text}
        </blockquote>

        {!isCustom && (
          <p style={{ fontFamily: "'Cormorant Garamond', sans-serif", fontSize: '0.85rem', color: C.inkLight, lineHeight: 1.85, maxWidth: 400, margin: '0 auto' }}>
            {preset.sub}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <BotDivider width={200} />
        </div>
      </div>
    </section>
  )
}

// ── SCREEN 3: Bride & Groom Profile (NO PHOTO) ───────────────────────
// Deep forest green bg, gold accents, side-by-side text cards
function SectionMempelai({ w }: { w: WeddingData }) {
  const formatInitial = (name?: string) => (name?.[0] || '?').toUpperCase()

  const Card = ({ type }: { type: 'pria' | 'wanita' }) => {
    const p = type === 'pria'
    const initial    = formatInitial(p ? w.pria_nama_panggilan : w.wanita_nama_panggilan)
    const nama       = p ? (w.pria_nama_lengkap || w.pria_nama_panggilan) : (w.wanita_nama_lengkap || w.wanita_nama_panggilan)
    const gelar      = p ? w.pria_gelar : w.wanita_gelar
    const ayah       = parentLabel(p ? w.pria_nama_ayah : w.wanita_nama_ayah, p ? w.pria_status_ayah : w.wanita_status_ayah)
    const ibu        = parentLabel(p ? w.pria_nama_ibu : w.wanita_nama_ibu, p ? w.pria_status_ibu : w.wanita_status_ibu)
    return (
      <div style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
        {/* Label */}
        <p style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontStyle: 'italic', fontSize: '0.75rem', letterSpacing: '0.15em', color: C.goldLight, marginBottom: 14 }}>
          {p ? 'The Groom' : 'The Bride'}
        </p>

        {/* Botanical monogram frame — no photo */}
        <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 14px' }}>
          {/* Octagonal ornate frame */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ position: 'absolute', inset: 0 }}>
            {/* Outer octagon */}
            <path d="M50 4 L78 16 L96 40 L96 60 L78 84 L50 96 L22 84 L4 60 L4 40 L22 16Z"
              stroke={C.gold} strokeWidth="1" fill="rgba(201,168,76,0.06)" opacity="0.7"/>
            {/* Inner circle */}
            <circle cx="50" cy="50" r="35" stroke={C.gold} strokeWidth="0.6" fill="none" opacity="0.4"/>
            {/* Corner diamonds */}
            {[[-2,50],[102,50],[50,-2],[50,102]].map(([cx,cy],i) => null)}
          </svg>
          {/* Initial letter */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
              fontStyle: 'italic', fontWeight: 700, fontSize: '3rem',
              color: C.goldLight, lineHeight: 1,
              textShadow: `0 0 20px rgba(201,168,76,0.4)`,
            }}>{initial}</span>
          </div>
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
          fontWeight: 700, fontSize: 'clamp(1rem,3.5vw,1.2rem)',
          color: C.creamText, textTransform: 'uppercase',
          letterSpacing: '0.08em', lineHeight: 1.2, marginBottom: 4,
        }}>
          {nama}{gelar ? `, ${gelar}` : ''}
        </h3>

        {(ayah || ibu) && (
          <div style={{ fontFamily: "'Cormorant Garamond', sans-serif", fontSize: '0.78rem', color: C.creamMuted, lineHeight: 1.8, marginTop: 8 }}>
            <p style={{ margin: 0 }}>{p ? 'Putra' : 'Putri'} dari</p>
            <p style={{ margin: 0, color: C.creamText, fontWeight: 500 }}>{ayah}</p>
            {ibu && <p style={{ margin: 0, color: C.goldLight, fontSize: '0.7rem' }}>&amp; {ibu}</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <section id="mempelai" style={{ background: C.sageDeep, position: 'relative', overflow: 'hidden' }}>
      {/* Subtle botanical bg */}
      <div style={{ position: 'absolute', left: -20, bottom: 0, opacity: 0.15 }}>
        <LilyCluster side="left" height={200} />
      </div>
      <div style={{ position: 'absolute', right: -20, top: 0, opacity: 0.12 }}>
        <LilyCluster side="right" height={180} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.goldDim, marginBottom: 8 }}>Mempelai</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.creamText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Yang Akan Menikah
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <BotDivider width={200} light />
        </div>

        {/* Groom & Bride side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0 16px', alignItems: 'center' }}>
          <Card type="pria" />
          {/* & separator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.gold})` }} />
            <span style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontStyle: 'italic', fontSize: '2.4rem', color: C.goldLight, lineHeight: 1, padding: '8px 0' }}>&amp;</span>
            <div style={{ width: 1, height: 40, background: `linear-gradient(to top, transparent, ${C.gold})` }} />
          </div>
          <Card type="wanita" />
        </div>
      </div>
    </section>
  )
}

// ── SCREEN 2: Event Details & Countdown ──────────────────────────────
// Sage bg, gold-bordered pill cards for each event, countdown boxes
function SectionAcara({ w }: { w: WeddingData }) {
  const target = w.resepsi_tanggal || w.akad_tanggal || ''
  const { d, h, m, s, done } = useCountdown(target)

  const EventPill = ({ type }: { type: 'akad' | 'resepsi' }) => {
    const isA  = type === 'akad'
    const tgl  = isA ? w.akad_tanggal : w.resepsi_tanggal; if (!tgl) return null
    const lok  = isA ? w.akad_lokasi  : w.resepsi_lokasi
    const adr  = isA ? w.akad_alamat  : w.resepsi_alamat
    const mp   = isA ? w.akad_maps_url : w.resepsi_maps_url
    return (
      <div style={{
        background: C.creamAlt,
        border: `1.5px solid ${C.gold}`,
        borderRadius: 100,
        padding: '24px 20px',
        flex: 1,
        textAlign: 'center',
        minWidth: 0,
      }}>
        {/* Number badge */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: C.gold, color: C.cream,
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          {isA ? '1' : '2'}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: '1rem', color: C.inkDark, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          {isA ? 'Akad Nikah' : 'Resepsi'}
        </h3>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.82rem', color: C.inkMid, lineHeight: 1.85 }}>
          <p style={{ margin: 0, fontWeight: 600, color: C.inkDark }}>{fmt(tgl, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p style={{ margin: '2px 0', color: C.inkLight }}>{fmtTime(tgl)}</p>
          {lok && <p style={{ margin: 0, fontWeight: 600, color: C.inkMid, marginTop: 6 }}>{lok}</p>}
          {adr && <p style={{ margin: 0, fontSize: '0.75rem', color: C.inkMuted }}>{adr}</p>}
        </div>
        {mp && (
          <a href={mp} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 14, fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.75rem', letterSpacing: '0.1em',
              color: C.inkDark, textDecoration: 'none',
              border: `1px solid ${C.gold}`, padding: '7px 16px',
              borderRadius: 100,
            }}>
            📍 Lihat Lokasi
          </a>
        )}
      </div>
    )
  }

  return (
    <section id="acara" style={{ background: C.sage, position: 'relative', overflow: 'hidden' }}>
      {/* Very subtle petal scatter */}
      <PetalScatter />
      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.creamMuted, marginBottom: 8 }}>Save the Date</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.creamText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Detail Acara
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><BotDivider width={200} light /></div>
        {target && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: C.creamMuted, marginBottom: 24 }}>{fmt(target)}</p>}

        {/* Countdown — gold bordered boxes */}
        {!done ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            {(['d','h','m','s'] as const).map(k => {
              const val = k==='d'?d : k==='h'?h : k==='m'?m : s
              const lbl = k==='d'?'Hari' : k==='h'?'Jam' : k==='m'?'Menit' : 'Detik'
              return (
                <div key={k} style={{
                  background: C.creamAlt,
                  border: `1.5px solid ${C.gold}`,
                  borderRadius: 8,
                  width: 64, paddingTop: 14, paddingBottom: 14,
                  textAlign: 'center',
                }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: '1.9rem', color: C.inkDark, display: 'block', lineHeight: 1 }}>{String(val).padStart(2,'0')}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', sans-serif", fontSize: '0.5rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.inkMuted, marginTop: 4, display: 'block' }}>{lbl}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.2rem', color: C.goldLight, margin: '0 0 28px' }}>🌸 Hari Bahagia Telah Tiba!</p>
        )}

        {/* Event pills side by side */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
          <EventPill type="akad"/>
          <EventPill type="resepsi"/>
        </div>

        {/* Add to calendar */}
        {target && (
          <a href={gcalUrl(w)} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', letterSpacing: '0.12em',
              padding: '10px 24px', border: `1.5px solid ${C.cream}`,
              color: C.creamText, textDecoration: 'none', borderRadius: 100,
              background: 'rgba(250,246,239,0.1)',
            }}>
            📅 Tambah ke Kalender
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
    { yr: w.resepsi_tanggal ? new Date(w.resepsi_tanggal).getFullYear() : '', title: 'Menuju Pelaminan', desc: 'Akhirnya, saatnya kami meresmikan cinta dalam ikatan suci yang penuh berkah.' },
  ]
  return (
    <section id="cerita" style={{ background: C.creamAlt, padding: '60px 24px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Medallion size={52} /></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.inkMuted, marginBottom: 8 }}>Kisah Cinta</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.inkDark, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Perjalanan Kami
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}><BotDivider width={200} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {stories.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textAlign: 'left' }}>
              {/* Timeline */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.gold, border: `2px solid ${C.cream}`, boxShadow: `0 0 0 2px ${C.goldDim}`, marginTop: 4, flexShrink: 0 }} />
                {i < stories.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 36, background: `linear-gradient(to bottom, ${C.gold}, ${C.goldSubtle})`, marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                {s.yr && <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', letterSpacing: '0.2em', color: C.inkMuted }}>{String(s.yr)}</span>}
                <h4 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontStyle: 'italic', fontWeight: 700, fontSize: '1.05rem', color: C.inkDark, margin: '4px 0 6px' }}>{s.title}</h4>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.88rem', color: C.inkLight, lineHeight: 1.85, margin: 0 }}>{s.desc}</p>
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
    <section id="galeri" style={{ background: C.cream, padding: '60px 0' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ padding: '0 20px', textAlign: 'center', marginBottom: 24 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle:'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.inkMuted, marginBottom: 8 }}>Galeri</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.inkDark, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Momen Berharga</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}><BotDivider width={200} /></div>
        </div>
        <div style={{ padding: '0 12px', columns: 2, gap: 8 }}>
          {fotos.map((url, i) => (
            <div key={url} style={{ breakInside: 'avoid', marginBottom: 8, cursor: 'pointer', overflow: 'hidden', border: `1px solid ${C.borderLight}`, borderRadius: 4 }}
              onClick={() => setLb(i)}>
              <img src={url} alt="" loading="lazy" style={{ width: '100%', display: 'block', aspectRatio: i % 3 === 0 ? '3/4' : '1/1', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
            </div>
          ))}
        </div>
      </div>
      {lb !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLb(null)}>
          <button style={{ position: 'absolute', top: 16, right: 20, color: '#fff', fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          <button style={{ position: 'absolute', left: 8, color: '#fff', fontSize: '3rem', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLb(l => l! > 0 ? l!-1 : fotos.length-1) }}>&#8249;</button>
          <img src={fotos[lb]} alt="" style={{ maxHeight: '82dvh', maxWidth: '94vw', objectFit: 'contain', borderRadius: 4 }} onClick={e => e.stopPropagation()} />
          <button style={{ position: 'absolute', right: 8, color: '#fff', fontSize: '3rem', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLb(l => l! < fotos.length-1 ? l!+1 : 0) }}>&#8250;</button>
        </div>
      )}
    </section>
  )
}

// ── SCREEN 1: RSVP & Guest Wishes ────────────────────────────────────
// Parchment bg, peacock illustration at bottom, translucent form cards
function SectionRSVP({ w }: { w: WeddingData }) {
  const [form, setForm] = useState({ nama: '', ucapan: '', hadir: 'hadir' })
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState(false)
  const [list, setList] = useState<Ucapan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('ucapan').select('*').eq('order_id', w.order_id)
      .order('created_at', { ascending: false }).limit(30)
      .then(({ data }) => { if (data) setList(data as Ucapan[]); setLoading(false) })
  }, [w.order_id])

  async function send() {
    if (!form.nama.trim() || !form.ucapan.trim()) return
    setBusy(true)
    const { data } = await supabase.from('ucapan').insert({ order_id: w.order_id, ...form }).select().single()
    if (data) setList(p => [data as Ucapan, ...p])
    setOk(true); setBusy(false); setForm({ nama: '', ucapan: '', hadir: 'hadir' })
    setTimeout(() => setOk(false), 3000)
  }

  const iS: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    border: `1px solid ${C.border}`, borderRadius: 8,
    fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem',
    color: C.inkDark, background: 'rgba(255,255,255,0.7)',
    outline: 'none', boxSizing: 'border-box',
  }

  return (
    <section id="rsvp" style={{ background: C.parchment, position: 'relative', overflow: 'hidden' }}>
      {/* Peacock/botanical decoration at bottom */}
      <div style={{ position: 'absolute', left: -10, bottom: -20, opacity: 0.3 }}>
        <LilyCluster side="left" height={220} />
      </div>
      <div style={{ position: 'absolute', right: -10, bottom: -20, opacity: 0.3 }}>
        <LilyCluster side="right" height={220} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '60px 20px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Medallion size={56} /></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.inkMuted, marginBottom: 8 }}>Konfirmasi Kehadiran</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.inkDark, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          RSVP &amp; Buku Tamu
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><BotDivider width={200} /></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.9rem', color: C.inkLight, lineHeight: 1.8, maxWidth: 360, margin: '0 auto 28px' }}>
          Kehormatan kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.
        </p>

        {/* Form card — parchment glassmorphism */}
        {!ok ? (
          <div style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 20px', textAlign: 'left', marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.inkMuted, display: 'block', marginBottom: 6 }}>Nama</label>
                <input value={form.nama} onChange={e => setForm(f => ({...f, nama: e.target.value}))} placeholder="Nama lengkap Anda" style={iS} />
              </div>
              <div>
                <label style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.inkMuted, display: 'block', marginBottom: 6 }}>Kehadiran</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['hadir','Hadir'],['tidak','Tidak Hadir'],['ragu','Mungkin']].map(([v,l]) => (
                    <button key={v} onClick={() => setForm(f => ({...f, hadir: v}))}
                      style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: '0.78rem', padding: '10px 4px', border: `1.5px solid ${form.hadir===v ? C.gold : C.borderSage}`, background: form.hadir===v ? C.gold : 'rgba(255,255,255,0.5)', color: form.hadir===v ? C.cream : C.inkMid, cursor: 'pointer', borderRadius: 8 }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.inkMuted, display: 'block', marginBottom: 6 }}>Ucapan &amp; Doa</label>
                <textarea value={form.ucapan} onChange={e => setForm(f => ({...f, ucapan: e.target.value}))} placeholder="Tulis ucapan terbaikmu..." rows={3} style={{ ...iS, resize: 'none' }} />
              </div>
              <button onClick={send} disabled={busy || !form.nama || !form.ucapan}
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '14px', background: C.sageDeep, color: C.cream, border: 'none', cursor: 'pointer', borderRadius: 100, opacity: (busy || !form.nama || !form.ucapan) ? 0.5 : 1 }}>
                {busy ? 'Mengirim...' : 'Kirim Ucapan'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.65)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '32px 20px', marginBottom: 20 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.05rem', color: C.inkDark }}>Terima kasih atas ucapan dan doamu 🌸</p>
          </div>
        )}

        {/* Guest wishes list */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: C.inkMuted, marginBottom: 14 }}>— Ucapan &amp; Doa —</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', textAlign: 'left' }}>
            {loading ? <p style={{ textAlign: 'center', fontSize: '0.85rem', color: C.inkMuted }}>Memuat...</p>
              : list.length === 0 ? <p style={{ textAlign: 'center', fontSize: '0.85rem', color: C.inkMuted }}>Jadilah yang pertama memberi ucapan 🌸</p>
                : list.map(u => (
                  <div key={u.id} style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)', border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: '12px 16px' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '0.85rem', color: C.inkDark, marginBottom: 4 }}>{u.nama}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.82rem', color: C.inkLight, lineHeight: 1.75, margin: 0 }}>{u.ucapan}</p>
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
  const grouped = {
    pria: w.rekening_list.filter(r => r.kategori === 'pria'),
    wanita: w.rekening_list.filter(r => r.kategori === 'wanita'),
    bersama: w.rekening_list.filter(r => r.kategori === 'bersama'),
  }
  function copy(text: string, key: string) { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2500) }
  return (
    <section id="amplop" style={{ background: C.sageDeep, padding: '60px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Medallion size={56} dark /></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.8rem', letterSpacing: '0.12em', color: C.goldDim, marginBottom: 8 }}>Wedding Gift</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontWeight: 700, fontSize: 'clamp(1.5rem,5vw,2rem)', color: C.creamText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Amplop Digital
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><BotDivider width={200} /></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.88rem', color: C.creamMuted, lineHeight: 1.8, maxWidth: 380, margin: '0 auto 24px' }}>
          Kehadiran dan doa Anda adalah hadiah terindah bagi kami.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {(['pria','wanita','bersama'] as const).map(cat => {
            const lst = grouped[cat]; if (!lst.length) return null
            const lbl = cat==='pria' ? w.pria_nama_panggilan : cat==='wanita' ? w.wanita_nama_panggilan : 'Bersama'
            return (
              <div key={cat}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle:'italic', fontSize: '0.8rem', letterSpacing: '0.15em', color: C.goldLight, marginBottom: 8 }}>{lbl}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lst.map(r => (
                    <div key={r.id} style={{ background: 'rgba(250,246,239,0.1)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', fontWeight: 700, color: C.goldLight, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{r.bank}</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif', serif", fontSize: '1.25rem', color: C.creamText, letterSpacing: '0.06em', margin: '2px 0' }}>{r.nomor}</p>
                          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', color: C.creamMuted }}>a.n. {r.nama}</p>
                        </div>
                        <button onClick={() => copy(r.nomor, r.id)}
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.72rem', fontWeight: 700, padding: '8px 14px', cursor: 'pointer', flexShrink: 0, background: copied===r.id ? '#22c55e' : 'transparent', border: `1px solid ${copied===r.id ? '#22c55e' : C.gold}`, color: copied===r.id ? '#fff' : C.goldLight, borderRadius: 8 }}>
                          {copied===r.id ? '✓ Disalin' : 'Salin'}
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
          <div style={{ marginTop: 16, background: 'rgba(250,246,239,0.08)', border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: '14px 16px', textAlign: 'left' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle:'italic', fontSize: '0.72rem', color: C.goldDim, marginBottom: 6 }}>📦 Alamat Kado</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: C.creamMuted, lineHeight: 1.8, margin: 0 }}>{w.alamat_kado}</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ── Section: Tiket / QR Code ──────────────────────────────────────────
function SectionTiket({ w, guestId }: { w: WeddingData, guestId: string }) {
  if (!guestId) return null
  return (
    <section id="tiket" style={{ background: C.cream, position: 'relative', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 400, margin: '0 auto', background: C.creamAlt, border: `2px solid ${C.goldDim}`, padding: '40px 24px', borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1rem', letterSpacing: '0.12em', color: C.inkDark, marginBottom: 16 }}>
          Tiket Kehadiran
        </p>
        <div style={{ background: '#fff', padding: 20, display: 'inline-block', borderRadius: 12, marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <QRCodeSVG value={guestId} size={180} fgColor={C.inkDark} bgColor="#fff" />
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem', color: C.inkLight, lineHeight: 1.6 }}>
          Mohon tunjukkan QR Code ini kepada penerima tamu / scanner di lokasi acara untuk mempermudah proses check-in.
        </p>
      </div>
    </section>
  )
}

// ── Section: Footer Closing ───────────────────────────────────────────
function SectionFooter({ w }: { w: WeddingData }) {
  return (
    <section id="footer" style={{ background: C.sage, position: 'relative', overflow: 'hidden' }}>
      {/* Large botanical border — like the hero screen but inverted */}
      <div style={{ position: 'absolute', left: -10, bottom: 0, opacity: 0.6 }}>
        <LilyCluster side="left" height={240} />
      </div>
      <div style={{ position: 'absolute', right: -10, bottom: 0, opacity: 0.6 }}>
        <LilyCluster side="right" height={240} />
      </div>
      <PetalScatter />

      <div style={{ position: 'relative', zIndex: 1, padding: '64px 48px 80px', maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Medallion size={60} /></div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.85rem', color: C.creamMuted, lineHeight: 1.85, maxWidth: 360, margin: '0 auto 20px' }}>
          Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari istimewa kami.
        </p>

        <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, margin: '0 auto 16px' }} />

        <h2 style={{
          fontFamily: "'Cormorant Garamond', 'Noto Serif', serif",
          fontWeight: 700, fontSize: 'clamp(1.8rem,8vw,2.8rem)',
          color: C.creamText, textTransform: 'uppercase',
          letterSpacing: '0.1em', lineHeight: 1, margin: '0 0 8px',
          textShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          {w.pria_nama_panggilan} &amp; {w.wanita_nama_panggilan}
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BotDivider width={220} /></div>

        {w.resepsi_tanggal && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '0.88rem', color: C.creamMuted, marginBottom: 8 }}>
            {fmtShort(w.resepsi_tanggal)}
          </p>
        )}
        {w.hashtag_instagram && <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.8rem', color: C.creamSubtle }}>{w.hashtag_instagram}</p>}
      </div>

      {/* Copyright */}
      <div style={{ background: C.sageDeep, padding: '12px 16px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.62rem', color: C.creamSubtle, letterSpacing: '0.12em', margin: 0 }}>
          Made with 🌸 by <span style={{ fontWeight: 700, color: C.goldDim }}>Katresnan</span> · katresnan.id
        </p>
      </div>
    </section>
  )
}

// ── ROOT Component ─────────────────────────────────────────────────────
export default function TemplateBotanicalSage({ wedding: wd }: { wedding: WeddingData }) {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const searchParams = useSearchParams()
  const guestId = searchParams.get('to') || ''

  function open() {
    setOpened(true)
    const audio = audioRef.current
    if (audio) {
      audio.load()
      const tryPlay = () => audio.play().then(() => setPlaying(true)).catch(() => {
        setTimeout(() => audio.play().then(() => setPlaying(true)).catch(() => {}), 500)
      })
      if (audio.readyState >= 2) tryPlay()
      else audio.addEventListener('canplay', tryPlay, { once: true })
    }
  }

  function toggleMusic() {
    const a = audioRef.current; if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.load(); a.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased;}
        html{font-size:16px;scroll-behavior:smooth;}
        body{margin:0;padding:0;background:${C.sage};overflow-x:hidden;}
        input:focus,textarea:focus{
          border-color:${C.gold}!important;
          box-shadow:0 0 0 3px rgba(201,168,76,0.2)!important;
          outline:none!important;
        }
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.3);border-radius:2px;}
        @keyframes petalFall{
          0%{transform:translateY(-30px) rotate(0deg) translateX(0);opacity:0.7;}
          50%{transform:translateY(45vh) rotate(180deg) translateX(15px);opacity:0.5;}
          100%{transform:translateY(100vh) rotate(360deg) translateX(-10px);opacity:0;}
        }
        @keyframes bsFadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
        .bs-section{animation:bsFadeUp 0.55s ease both;}
      `}</style>

      <audio ref={audioRef} loop preload="auto">
        {wd.musik_pilihan?.startsWith('http') && <source src={wd.musik_pilihan} />}
      </audio>

      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh' }}>
        {!opened
          ? <Cover w={wd} onOpen={open} />
          : <main>
            <div className="bs-section"><SectionQuote w={wd} /></div>
            <div className="bs-section"><SectionMempelai w={wd} /></div>
            <div className="bs-section"><SectionAcara w={wd} /></div>
            {wd.fitur_cerita_cinta && <div className="bs-section"><SectionCerita w={wd} /></div>}
            <div className="bs-section"><SectionGaleri w={wd} /></div>
            {wd.fitur_rsvp && <div className="bs-section"><SectionRSVP w={wd} /></div>}
            <div className="bs-section"><SectionAmplop w={wd} /></div>
            {guestId && <div className="bs-section"><SectionTiket w={wd} guestId={guestId} /></div>}
            <div className="bs-section"><SectionFooter w={wd} /></div>
          </main>
        }
      </div>

      {/* Music floating button */}
      {opened && (
        <button onClick={toggleMusic} style={{
          position: 'fixed', bottom: 24, left: 20, zIndex: 50,
          width: 42, height: 42, borderRadius: '50%',
          background: `rgba(45,90,50,0.85)`,
          border: `1.5px solid ${C.gold}`,
          color: C.goldLight, cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}>
          {playing ? '⏸' : '▶'}
        </button>
      )}
    </>
  )
}
