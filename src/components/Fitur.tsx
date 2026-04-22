'use client'
import { useEffect, useRef } from 'react'

const features = [
  {
    title: 'Desain Premium & Eksklusif',
    desc: 'Puluhan template elegan oleh desainer profesional — romantis, rustic, modern, hingga mewah.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: 'Musik Latar Romantis',
    desc: 'Alunan musik pilihan yang memperindah suasana saat tamu membuka undangan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    title: 'Peta Lokasi Interaktif',
    desc: 'Integrasi Google Maps langsung di undangan. Tamu navigasi dengan satu klik.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'RSVP & Ucapan Online',
    desc: 'Tamu konfirmasi kehadiran & kirim ucapan doa langsung di undangan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    title: 'Hitung Mundur Hari H',
    desc: 'Countdown timer cantik yang menambah kesan sakral menjelang hari istimewa.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
      </svg>
    ),
  },
  {
    title: 'Galeri Foto & Video',
    desc: 'Tampilkan momen prewedding dalam galeri yang indah dan responsif.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21,15 16,10 5,21" />
      </svg>
    ),
  },
  {
    title: 'Amplop Digital',
    desc: 'Fitur gift/amplop digital terintegrasi untuk tamu yang ingin memberikan hadiah.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Laporan Kehadiran',
    desc: 'Dashboard pantau konfirmasi tamu real-time. Praktis untuk persiapan acara.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    title: 'Link Mudah Dibagikan',
    desc: 'Satu link cantik yang bisa dibagikan via WhatsApp, Instagram, atau medsos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
]

export default function Fitur() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const o = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && x.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.animate-on-scroll').forEach((el) => o.observe(el))
    return () => o.disconnect()
  }, [])

  return (
    <section id="fitur" className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Divider */}
        <div className="section-divider mb-24" />

        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 mb-4">
            Fitur Unggulan
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-800 dark:text-surface-200 mb-4">
            Semua yang Membuat<br />
            <span className="gradient-text">Undangan Anda Istimewa</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Bukan sekadar undangan biasa — melainkan pengalaman digital yang membekas di hati setiap tamu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className="animate-on-scroll card-hover group bg-surface-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 transition-colors"
              style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-primary-100/50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="font-serif font-semibold text-slate-800 dark:text-surface-200 text-base mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
