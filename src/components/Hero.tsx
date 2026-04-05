'use client'
import { useEffect, useRef, useState } from 'react'

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
    </svg>
  )
}

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
              </div>
            ))}
          </div>

          <button className="bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13] text-[8px] px-4 py-1.5 rounded-full font-semibold mt-1">
            Konfirmasi Hadir ✓
          </button>

          <div className="flex gap-1 text-sm">
            {['🎵','📍','📸','💌'].map((e) => (
              <span key={e} className="w-6 h-6 bg-[#ffdce2]/60 dark:bg-[#1a3028] rounded-full flex items-center justify-center text-[10px]">{e}</span>
            ))}
          </div>
        </div>
      </div>

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
      </div>
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Typewriter effect
  useEffect(() => {
    const current = WORDS[wordIdx]
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [displayed, deleting, wordIdx])

  return (
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

        {/* Left: Text */}
        <div className="text-center lg:text-left">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0s ease forwards' }}>
            <span className="flex gap-0.5">
              {[...Array(5)].map((_,i) => <span key={i} className="text-[#f9b8c4] text-sm">★</span>)}
            </span>
            <span className="text-xs text-[#6b8f72] dark:text-[#7aaa90] font-medium">
              Dipercaya 3.500+ pasangan di Indonesia
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-2"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.15s ease forwards' }}>
            <span className="text-[#1a2e1d] dark:text-[#e8f0e8]">Undangan Digital</span>
          </h1>

          {/* Typewriter line */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-4"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.25s ease forwards' }}>
            <span className="gradient-text">untuk </span>
            <span className="gradient-text border-r-[3px] border-[#e8879a] pr-0.5"
              style={{ animation: 'blinkCaret 0.8s step-end infinite' }}>
              {displayed}
            </span>
          </h1>

          {/* Script subtitle */}
          <p className="font-script text-2xl md:text-3xl text-[#e8879a] dark:text-[#ffb3c1] italic mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.35s ease forwards' }}>
            "Rayakan momen spesial dengan sentuhan yang tak terlupakan"
          </p>

          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-base md:text-lg leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.45s ease forwards' }}>
            Desain premium, fitur lengkap, harga ramah di kantong. Undangan cantik siap kirim
            dalam <strong className="text-[#03554e] dark:text-[#4ecdc4]">1x24 jam</strong> — tanpa ribet, tanpa keahlian teknis.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
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
              </span>
            ))}
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="flex justify-center lg:justify-end mt-4 lg:mt-0"
          style={{ opacity: 0, animation: 'fadeUp 0.8s 0.3s ease forwards' }}>
          <PhoneMockup />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-6 pb-6"
          style={{ opacity: 0, animation: 'fadeUp 0.7s 0.8s ease forwards' }}>
          <div className="glass border border-[#ffdce2]/60 dark:border-[#2a4a38] rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-[#ffdce2]/60 dark:divide-[#2a4a38] shadow-xl">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 px-3 gap-0.5">
                <span className="text-xl mb-0.5">{s.icon}</span>
                <span className="font-display font-bold text-lg sm:text-xl text-[#03554e] dark:text-[#4ecdc4]">{s.num}</span>
                <span className="text-[9px] sm:text-[10px] text-[#8a9e8c] dark:text-[#5a9e80] text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}