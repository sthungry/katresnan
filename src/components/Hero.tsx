'use client'
import { useEffect, useRef, useState } from 'react'

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
    </svg>
  )
}

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
              </div>
            ))}
          </div>

          <button className="bg-sage-800 dark:bg-gold-500 text-white dark:text-sage-950 text-[8px] px-5 py-1.5 rounded-full font-semibold tracking-wide">
            Konfirmasi Kehadiran
          </button>

          <div className="flex gap-1.5">
            {['♪','◎','▣','♡'].map((e) => (
              <span key={e} className="w-6 h-6 bg-sage-100 dark:bg-sage-800 rounded-full flex items-center justify-center text-[9px] text-sage-500 dark:text-sage-400">{e}</span>
            ))}
          </div>
        </div>
      </div>

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
      </div>
    </div>
  )
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const current = WORDS[wordIdx]
    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 90)
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 2500)
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIdx((i) => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [displayed, deleting, wordIdx])

  return (
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

        {/* Left: Text */}
        <div className="text-center lg:text-left">

          {/* Badge */}
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
              Dipercaya 3.500+ pasangan di Indonesia
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.15] tracking-tight mb-3"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.12s ease forwards' }}>
            <span className="text-sage-800 dark:text-ivory-200">Undangan Pernikahan</span>
          </h1>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.15] tracking-tight mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.22s ease forwards' }}>
            <span className="gradient-text">Digital yang </span>
            <span className="gradient-text-gold border-r-[2px] border-gold-500 pr-0.5"
              style={{ animation: 'blinkCaret 0.8s step-end infinite' }}>
              {displayed}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif text-xl md:text-2xl text-gold-600 dark:text-gold-400 italic mb-5"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.32s ease forwards' }}>
            &ldquo;Rayakan momen sakral dengan sentuhan yang tak terlupakan&rdquo;
          </p>

          <p className="text-sage-500 dark:text-sage-400 text-base md:text-lg leading-relaxed max-w-lg mb-8 mx-auto lg:mx-0"
            style={{ opacity: 0, animation: 'fadeUp 0.7s 0.42s ease forwards' }}>
            Desain premium, fitur lengkap, harga ramah di kantong. Undangan cantik siap kirim 
            dalam <strong className="text-sage-800 dark:text-sage-200">1×24 jam</strong> — tanpa ribet, tanpa keahlian teknis.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
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
              </span>
            ))}
          </div>
        </div>

        {/* Right: Phone */}
        <div className="flex justify-center lg:justify-end mt-4 lg:mt-0"
          style={{ opacity: 0, animation: 'fadeUp 0.8s 0.3s ease forwards' }}>
          <PhoneMockup />
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-6 pb-6"
          style={{ opacity: 0, animation: 'fadeUp 0.7s 0.8s ease forwards' }}>
          <div className="glass rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-sage-200/40 dark:divide-sage-700/40 shadow-lg">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-5 px-4 gap-1">
                <span className="font-serif font-bold text-xl sm:text-2xl text-sage-800 dark:text-sage-200">{s.num}</span>
                <span className="text-[10px] sm:text-xs text-sage-400 dark:text-sage-500 text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}