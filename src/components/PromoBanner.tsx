'use client'
import { useEffect, useState } from 'react'

function getTimeLeft() {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0)
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export default function PromoBanner() {
  // Start with zeros — only update on client to avoid hydration mismatch
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    setT(getTimeLeft())
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative z-50 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white text-center py-2.5 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs md:text-sm">
        <span className="font-semibold">🎉 PROMO AKHIR BULAN — Diskon 20% semua paket!</span>
        <div className="flex items-center gap-1.5">
          <span className="text-white/70">Berakhir dalam:</span>
          {/* suppressHydrationWarning prevents mismatch warning on the countdown digits */}
          {(['d','h','m','s'] as const).map((key, i) => (
            <span key={key} className="flex items-center gap-0.5">
              <span
                suppressHydrationWarning
                className="bg-white/20 rounded px-1.5 py-0.5 font-mono font-bold tabular-nums"
              >
                {mounted ? pad(t[key]) : '00'}
              </span>
              <span className="text-white/60 text-[10px]">{['Hr','Jm','Mt','Dt'][i]}</span>
            </span>
          ))}
        </div>
        <a href="#harga" className="bg-primary-100 text-primary-800 font-bold text-xs px-3 py-1 rounded-full hover:bg-white transition-colors whitespace-nowrap">
          Klaim Sekarang →
        </a>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
