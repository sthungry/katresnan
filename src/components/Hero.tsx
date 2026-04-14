'use client'
import { useEffect, useRef, useState } from 'react'

<<<<<<< HEAD
const WORDS = ['Elegan', 'Romantis', 'Modern', 'Mewah', 'Berkesan']

const STATS = [
  { num: '3.500+', label: 'Pasangan Bahagia' },
  { num: '50+',    label: 'Template Premium' },
  { num: '1x24',   label: 'Jam Selesai' },
  { num: '4.9/5',  label: 'Rating Pelanggan' },
]

// Decorative ring SVG
function DecorativeRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
=======
const PETALS = [
  { emoji: '🌸', delay: '0s',   dur: '9s',  left: '8%',  size: '1.4rem' },
  { emoji: '🌷', delay: '1.5s', dur: '11s', left: '18%', size: '1rem'   },
  { emoji: '🌸', delay: '3s',   dur: '8s',  left: '30%', size: '1.6rem' },
  { emoji: '🍃', delay: '0.8s', dur: '13s', left: '45%', size: '1.1rem' },
  { emoji: '🌸', delay: '4s',   dur: '10s', left: '57%', size: '1.3rem' },
  { emoji: '🌷', delay: '2.2s', dur: '9s',  left: '68%', size: '1rem'   },
  { emoji: '🌸', delay: '5s',   dur: '11s', left: '78%', size: '1.5rem' },
  { emoji: '🍃', delay: '1s',   dur: '14s', left: '88%', size: '1.2rem' },
  { emoji: '🌸', delay: '6s',   dur: '9s',  left: '95%', size: '1rem'   },
  { emoji: '🌷', delay: '3.5s', dur: '10s', left: '23%', size: '1.4rem' },
  { emoji: '🌸', delay: '7s',   dur: '12s', left: '63%', size: '1.1rem' },
  { emoji: '🍃', delay: '2s',   dur: '10s', left: '38%', size: '1.3rem' },
]

const WORDS = ['Pernikahan', 'Pertunangan', 'Ulang Tahun', 'Wisuda', 'Khitanan', 'Syukuran']

const STATS = [
  { num: '3.500+', label: 'Pasangan Bahagia', icon: '💍' },
  { num: '50+',    label: 'Template Cantik',  icon: '🎨' },
  { num: '1x24',   label: 'Jam Selesai',      icon: '⚡' },
  { num: '4.9★',   label: 'Rating Pelanggan', icon: '⭐' },
]

// SVG ornament: simple floral frame drawn via stroke
function FloralSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        className="svg-draw"
        d="M100 10 C60 10, 10 60, 10 100 C10 140, 60 190, 100 190 C140 190, 190 140, 190 100 C190 60, 140 10, 100 10Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      <path
        className="svg-draw"
        d="M100 30 C70 50, 50 70, 50 100 C50 130, 70 150, 100 170 C130 150, 150 130, 150 100 C150 70, 130 50, 100 30Z"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4"
        style={{ animationDelay: '0.5s' }}
      />
      <circle cx="100" cy="100" r="8" stroke="currentColor" strokeWidth="1.5" className="svg-draw" style={{ animationDelay: '1.5s' }} />
      {/* Corner flourishes */}
      {[[20,20],[180,20],[20,180],[180,180]].map(([cx,cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          <path className="svg-draw" d="M0 -12 Q6 0 12 0 Q6 0 0 12 Q-6 0 -12 0 Q-6 0 0 -12Z"
            stroke="currentColor" strokeWidth="1" fill="none" style={{ animationDelay: `${i * 0.3 + 1}s` }} />
        </g>
      ))}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    </svg>
  )
}

<<<<<<< HEAD
// Leaf SVG ornament
function LeafOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className}>
      <path d="M60 10 C40 30, 20 50, 30 80 C35 95, 50 100, 60 100 C70 100, 85 95, 90 80 C100 50, 80 30, 60 10Z" 
        stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
      <path d="M60 25 C48 40, 35 55, 40 75 C43 85, 52 88, 60 88 C68 88, 77 85, 80 75 C85 55, 72 40, 60 25Z" 
        stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.15" strokeDasharray="3 5" />
      <line x1="60" y1="30" x2="60" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    </svg>
  )
}

// Phone mockup with wedding preview
function PhoneMockup() {
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-200/40 via-sage-200/30 to-rose-200/40 dark:from-gold-500/5 dark:via-sage-500/5 dark:to-rose-400/5 blur-3xl scale-125 rounded-full animate-pulse-soft" />

      {/* Phone frame */}
      <div className="relative w-48 h-[380px] sm:w-56 sm:h-[440px] bg-white dark:bg-sage-900 rounded-[2.5rem] shadow-2xl shadow-sage-800/15 dark:shadow-black/30 border border-sage-100 dark:border-sage-700 overflow-hidden"
        style={{ animation: 'float 6s ease-in-out infinite' }}>

        {/* Notch */}
        <div className="bg-sage-800 dark:bg-sage-950 h-10 flex items-center justify-center relative">
          <div className="w-20 h-5 bg-black/40 rounded-full" />
        </div>

        {/* Invitation preview */}
        <div className="bg-gradient-to-b from-ivory-100 to-ivory-200 dark:from-sage-900 dark:to-sage-950 h-full flex flex-col items-center justify-center px-5 py-6 gap-3">
          {/* Ornament */}
          <svg viewBox="0 0 60 30" className="w-12 text-gold-500 opacity-60">
            <path d="M30 0 C20 5, 5 15, 0 30 M30 0 C40 5, 55 15, 60 30" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="30" cy="2" r="2" fill="currentColor" opacity="0.5" />
          </svg>

          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.25em] text-sage-400 font-medium">The Wedding Of</p>
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-2" />
            <p className="font-serif text-xl text-sage-800 dark:text-sage-200 italic leading-tight">Reza</p>
            <p className="text-[9px] text-gold-500 font-medium tracking-widest">&</p>
            <p className="font-serif text-xl text-sage-800 dark:text-sage-200 italic leading-tight">Nadya</p>
          </div>

          <div className="w-full bg-white/60 dark:bg-white/5 rounded-xl p-2.5 text-center border border-sage-100/50 dark:border-sage-700/50">
            <p className="text-[7px] text-sage-500 uppercase tracking-[0.2em] font-medium">Sabtu, 14 Juni 2025</p>
            <p className="text-[7px] text-sage-400 mt-0.5">Grand Ballroom · Jakarta</p>
          </div>

          {/* Countdown */}
          <div className="flex gap-2">
            {[['12','Hari'],['08','Jam'],['45','Mnt']].map(([n,l]) => (
              <div key={l} className="bg-sage-800/5 dark:bg-sage-300/5 rounded-lg px-2.5 py-1.5 text-center">
                <p className="text-[11px] font-bold text-sage-800 dark:text-sage-200 leading-none">{n}</p>
                <p className="text-[6px] text-sage-400 mt-0.5">{l}</p>
=======
// Mock phone mockup showing invitation preview
function PhoneMockup() {
  return (
    <div className="relative">
      {/* Glow behind phone */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffdce2]/60 via-[#fff5c0]/40 to-[#d4ede9]/60 dark:from-[#4ecdc4]/10 dark:via-[#7fdeaa]/10 dark:to-[#ffb3c1]/10 blur-3xl scale-125 rounded-full animate-pulse-soft" />

      {/* Phone frame */}
      <div className="relative w-44 h-80 sm:w-52 sm:h-96 bg-white dark:bg-[#1a2e1d] rounded-[2.5rem] shadow-2xl shadow-[#03554e]/20 dark:shadow-[#4ecdc4]/10 border-4 border-[#e8f0e8] dark:border-[#2a4a38] overflow-hidden"
        style={{ animation: 'float 6s ease-in-out infinite' }}>

        {/* Status bar */}
        <div className="bg-[#03554e] dark:bg-[#1a3028] h-10 flex items-center justify-center">
          <div className="w-16 h-4 bg-black/40 rounded-full" />
        </div>

        {/* Invitation preview content */}
        <div className="bg-gradient-to-b from-[#fff4f6] to-[#fffde8] dark:from-[#1a2820] dark:to-[#111d17] h-full flex flex-col items-center justify-center px-4 py-6 gap-3">
          {/* Floral ornament small */}
          <div className="text-3xl" style={{ animation: 'float2 5s ease-in-out infinite' }}>🌸</div>

          <div className="text-center">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#8a9e8c] dark:text-[#5a9e80] font-semibold">Undangan Pernikahan</p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#f9b8c4] to-transparent mx-auto my-2" />
            <p className="font-script text-lg text-[#03554e] dark:text-[#4ecdc4] italic leading-tight">Reza</p>
            <p className="text-[8px] text-[#8a9e8c] dark:text-[#5a9e80]">&amp;</p>
            <p className="font-script text-lg text-[#e8879a] italic leading-tight">Nadya</p>
          </div>

          <div className="w-full bg-white/60 dark:bg-white/5 rounded-xl p-2 text-center">
            <p className="text-[7px] text-[#8a9e8c] dark:text-[#5a9e80] uppercase tracking-widest">Sabtu, 14 Juni 2025</p>
            <p className="text-[7px] text-[#6b8f72] dark:text-[#4ecdc4] mt-0.5">Grand Ballroom • Jakarta</p>
          </div>

          {/* Countdown mini */}
          <div className="flex gap-1.5">
            {[['12','Hari'],['08','Jam'],['45','Mnt']].map(([n,l]) => (
              <div key={l} className="bg-[#03554e]/10 dark:bg-[#4ecdc4]/10 rounded-lg px-2 py-1 text-center">
                <p className="text-[10px] font-bold text-[#03554e] dark:text-[#4ecdc4] leading-none">{n}</p>
                <p className="text-[6px] text-[#8a9e8c]">{l}</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              </div>
            ))}
          </div>

<<<<<<< HEAD
          <button className="bg-sage-800 dark:bg-gold-500 text-white dark:text-sage-950 text-[8px] px-5 py-1.5 rounded-full font-semibold tracking-wide">
            Konfirmasi Kehadiran
          </button>

          <div className="flex gap-1.5">
            {['♪','◎','▣','♡'].map((e) => (
              <span key={e} className="w-6 h-6 bg-sage-100 dark:bg-sage-800 rounded-full flex items-center justify-center text-[9px] text-sage-500 dark:text-sage-400">{e}</span>
=======
          <button className="bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13] text-[8px] px-4 py-1.5 rounded-full font-semibold mt-1">
            Konfirmasi Hadir ✓
          </button>

          <div className="flex gap-1 text-sm">
            {['🎵','📍','📸','💌'].map((e) => (
              <span key={e} className="w-6 h-6 bg-[#ffdce2]/60 dark:bg-[#1a3028] rounded-full flex items-center justify-center text-[10px]">{e}</span>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            ))}
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Floating labels */}
      <div className="hidden sm:flex absolute -right-4 top-14 glass rounded-xl px-3 py-2 shadow-md items-center gap-2"
        style={{ animation: 'float 5s ease-in-out 0.5s infinite' }}>
        <svg className="w-3.5 h-3.5 text-sage-600 dark:text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        <span className="text-xs font-medium text-sage-700 dark:text-sage-300">RSVP Online</span>
      </div>
      <div className="hidden sm:flex absolute -left-6 top-32 glass rounded-xl px-3 py-2 shadow-md items-center gap-2"
        style={{ animation: 'float 7s ease-in-out 1s infinite' }}>
        <svg className="w-3.5 h-3.5 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
        <span className="text-xs font-medium text-sage-700 dark:text-sage-300">Musik</span>
      </div>
      <div className="hidden sm:flex absolute -right-8 bottom-28 glass rounded-xl px-3 py-2 shadow-md items-center gap-2"
        style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
        <svg className="w-3.5 h-3.5 text-sage-600 dark:text-sage-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span className="text-xs font-medium text-sage-700 dark:text-sage-300">Maps</span>
      </div>
      <div className="hidden sm:flex absolute -left-4 bottom-16 glass rounded-xl px-3 py-2 shadow-md items-center gap-2"
        style={{ animation: 'float 8s ease-in-out 0.3s infinite' }}>
        <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        <span className="text-xs font-medium text-sage-700 dark:text-sage-300">Amplop Digital</span>
=======
      {/* Floating badges around phone */}
      <div className="hidden sm:block absolute -right-6 top-12 glass rounded-xl px-3 py-2 shadow-lg text-xs font-medium text-[#03554e] dark:text-[#4ecdc4] whitespace-nowrap"
        style={{ animation: 'float2 5s ease-in-out 0.5s infinite' }}>
        💌 RSVP Online
      </div>
      <div className="hidden sm:block absolute -left-8 top-28 glass rounded-xl px-3 py-2 shadow-lg text-xs font-medium text-[#e8879a] whitespace-nowrap"
        style={{ animation: 'float3 7s ease-in-out 1s infinite' }}>
        🎵 Musik Romantis
      </div>
      <div className="hidden sm:block absolute -right-10 bottom-24 glass rounded-xl px-3 py-2 shadow-lg text-xs font-medium text-[#03554e] dark:text-[#7fdeaa] whitespace-nowrap"
        style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
        📍 Maps Interaktif
      </div>
      <div className="hidden sm:block absolute -left-6 bottom-10 glass rounded-xl px-3 py-2 shadow-lg text-xs font-medium text-[#e8879a] whitespace-nowrap"
        style={{ animation: 'float2 8s ease-in-out 0.3s infinite' }}>
        💳 Amplop Digital
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
      </div>
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

<<<<<<< HEAD
  useEffect(() => {
    const current = WORDS[wordIdx]
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 90)
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2500)
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
=======
  // Typewriter effect
  useEffect(() => {
    const current = WORDS[wordIdx]
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [displayed, deleting, wordIdx])

  return (
<<<<<<< HEAD
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]">

      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200 dark:from-[#0f1512] dark:via-[#111917] dark:to-[#0d1210] transition-colors duration-700" />

      {/* Dot pattern */}
      <div className="absolute inset-0 pattern-dot" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gold-200/20 dark:bg-gold-500/3 blur-[100px] rounded-full animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-sage-200/30 dark:bg-sage-500/3 blur-[100px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-100/20 dark:bg-rose-400/2 blur-[120px] rounded-full" />

      {/* Decorative ornaments */}
      <DecorativeRing className="absolute top-24 right-12 w-40 h-40 text-gold-500 dark:text-gold-400 opacity-20" />
      <DecorativeRing className="absolute bottom-24 left-12 w-32 h-32 text-sage-400 dark:text-sage-500 opacity-15" />
      <LeafOrnament className="absolute top-32 left-8 w-24 h-24 text-sage-500 dark:text-sage-400" />
      <LeafOrnament className="absolute bottom-32 right-8 w-20 h-20 text-gold-500 dark:text-gold-400 scale-x-[-1]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-0">
=======
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffde8] via-[#fff4f6] to-[#fce4ec] dark:from-[#0f1a13] dark:via-[#111d17] dark:to-[#0d1a18] transition-colors duration-500" />

      {/* Dot pattern */}
      <div className="absolute inset-0 pattern-bg opacity-40 dark:opacity-20" />

      {/* Morphing blobs */}
      <div className="absolute top-16 left-10 w-80 h-80 bg-[#ffdce2]/50 dark:bg-[#4ecdc4]/5 blur-3xl"
        style={{ animation: 'morph 10s ease-in-out infinite, float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#d4ede9]/50 dark:bg-[#ffb3c1]/5 blur-3xl"
        style={{ animation: 'morph 12s ease-in-out 2s infinite, float2 9s ease-in-out infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#fff5c0]/30 dark:bg-[#7fdeaa]/3 blur-[90px] rounded-full" />

      {/* Falling petals */}
      {PETALS.map((p, i) => (
        <span key={i} className="petal select-none"
          style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay, fontSize: p.size, top: '-60px' }}>
          {p.emoji}
        </span>
      ))}

      {/* SVG floral corners */}
      <FloralSVG className="absolute top-16 left-4 w-32 h-32 text-[#f9b8c4]/40 dark:text-[#4ecdc4]/15" />
      <FloralSVG className="absolute top-16 right-4 w-32 h-32 text-[#f9b8c4]/40 dark:text-[#4ecdc4]/15 scale-x-[-1]" />
      <FloralSVG className="absolute bottom-10 left-4 w-24 h-24 text-[#d4ede9]/50 dark:text-[#7fdeaa]/15 scale-y-[-1]" />
      <FloralSVG className="absolute bottom-10 right-4 w-24 h-24 text-[#d4ede9]/50 dark:text-[#7fdeaa]/15 scale-[-1]" />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-12">
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835

        {/* Left: Text */}
        <div className="text-center lg:text-left">

          {/* Badge */}
<<<<<<< HEAD
          <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 mb-8"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0s ease forwards' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_,i) => (
                <svg key={i} className="w-3.5 h-3.5 text-gold-500 fill-gold-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-sage-600 dark:text-sage-400 font-medium">
=======
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0s ease forwards' }}>
            <span className="flex gap-0.5">
              {[...Array(5)].map((_,i) => <span key={i} className="text-[#f9b8c4] text-sm">★</span>)}
            </span>
            <span className="text-xs text-[#6b8f72] dark:text-[#7aaa90] font-medium">
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              Dipercaya 3.500+ pasangan di Indonesia
            </span>
          </div>

          {/* Headline */}
<<<<<<< HEAD
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.15] tracking-tight mb-3"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.12s ease forwards' }}>
            <span className="text-sage-800 dark:text-ivory-200">Undangan Pernikahan</span>
          </h1>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.15] tracking-tight mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.22s ease forwards' }}>
            <span className="gradient-text">Digital yang </span>
            <span className="gradient-text-gold border-r-[2px] border-gold-500 pr-0.5"
=======
          <h1 className="font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-2"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.15s ease forwards' }}>
            <span className="text-[#1a2e1d] dark:text-[#e8f0e8]">Undangan Digital</span>
          </h1>

          {/* Typewriter line */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-4"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.25s ease forwards' }}>
            <span className="gradient-text">untuk </span>
            <span className="gradient-text border-r-[3px] border-[#e8879a] pr-0.5"
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              style={{ animation: 'blinkCaret 0.8s step-end infinite' }}>
              {displayed}
            </span>
          </h1>

<<<<<<< HEAD
          {/* Subtitle */}
          <p className="font-serif text-xl md:text-2xl text-gold-600 dark:text-gold-400 italic mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.32s ease forwards' }}>
            &ldquo;Rayakan momen sakral dengan sentuhan yang tak terlupakan&rdquo;
          </p>

          <p className="text-sage-500 dark:text-sage-400 text-base md:text-lg leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.42s ease forwards' }}>
            Desain premium, fitur lengkap, harga ramah di kantong. Undangan cantik siap kirim 
            dalam <strong className="text-sage-800 dark:text-sage-200">1×24 jam</strong> — tanpa ribet, tanpa keahlian teknis.
=======
          {/* Script subtitle */}
          <p className="font-script text-2xl md:text-3xl text-[#e8879a] dark:text-[#ffb3c1] italic mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.35s ease forwards' }}>
            "Rayakan momen spesial dengan sentuhan yang tak terlupakan"
          </p>

          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-base md:text-lg leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.45s ease forwards' }}>
            Desain premium, fitur lengkap, harga ramah di kantong. Undangan cantik siap kirim
            dalam <strong className="text-[#03554e] dark:text-[#4ecdc4]">1x24 jam</strong> — tanpa ribet, tanpa keahlian teknis.
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
<<<<<<< HEAD
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.52s ease forwards' }}>
            <a href="#harga" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm">
              Lihat Paket Harga
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/demo" className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              Lihat Contoh
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.62s ease forwards' }}>
            {[
              { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, text: 'Selesai 1×24 jam' },
              { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>, text: 'Revisi gratis' },
              { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, text: 'Support WA' },
              { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, text: 'Bayar sekali' },
            ].map((b) => (
              <span key={b.text}
                className="flex items-center gap-2 text-xs text-sage-500 dark:text-sage-400 bg-white/50 dark:bg-sage-900/50 rounded-full px-3.5 py-2 border border-sage-100 dark:border-sage-800">
                <span className="text-sage-600 dark:text-sage-300">{b.icon}</span>
                {b.text}
=======
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.55s ease forwards' }}>
            <a href="#harga"
              className="group w-full sm:w-auto bg-[#03554e] hover:bg-[#023d38] dark:bg-[#1a5c52] dark:hover:bg-[#03554e] text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#03554e]/25 dark:shadow-[#4ecdc4]/10 flex items-center justify-center gap-2 transition-all">
              🌸 Lihat Paket Harga
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="/demo"
              className="w-full sm:w-auto glass border border-[#ffdce2] dark:border-[#2a4a38] text-[#03554e] dark:text-[#4ecdc4] font-semibold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#ffdce2]/40 dark:hover:bg-[#1a3028] transition-all">
              🎴 Lihat Contoh
            </a>
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.65s ease forwards' }}>
            {[
              { icon: '⚡', text: 'Selesai 1x24 jam' },
              { icon: '🔄', text: 'Revisi gratis' },
              { icon: '💬', text: 'Support WA' },
              { icon: '💳', text: 'Bayar sekali' },
            ].map((b) => (
              <span key={b.text}
                className="flex items-center gap-1.5 text-xs text-[#6b8f72] dark:text-[#7aaa90] glass rounded-full px-3 py-1.5 border border-[#ffdce2]/60 dark:border-[#1a3028]">
                {b.icon} {b.text}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              </span>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Right: Phone */}
=======
        {/* Right: Phone mockup */}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        <div className="flex justify-center lg:justify-end mt-4 lg:mt-0"
          style={{ opacity: 0, animation: 'fadeUp 0.8s 0.3s ease forwards' }}>
          <PhoneMockup />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-6 pb-6"
          style={{ opacity: 0, animation: 'fadeUp 0.7s 0.8s ease forwards' }}>
<<<<<<< HEAD
          <div className="glass rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-sage-200/40 dark:divide-sage-700/40 shadow-lg">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-5 px-4 gap-1">
                <span className="font-serif font-bold text-xl sm:text-2xl text-sage-800 dark:text-sage-200">{s.num}</span>
                <span className="text-[10px] sm:text-xs text-sage-400 dark:text-sage-500 text-center leading-tight">{s.label}</span>
=======
          <div className="glass border border-[#ffdce2]/60 dark:border-[#2a4a38] rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-[#ffdce2]/60 dark:divide-[#2a4a38] shadow-xl">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 px-3 gap-0.5">
                <span className="text-xl mb-0.5">{s.icon}</span>
                <span className="font-display font-bold text-lg sm:text-xl text-[#03554e] dark:text-[#4ecdc4]">{s.num}</span>
                <span className="text-[9px] sm:text-[10px] text-[#8a9e8c] dark:text-[#5a9e80] text-center leading-tight">{s.label}</span>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              </div>
            ))}
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======

>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    </section>
  )
}