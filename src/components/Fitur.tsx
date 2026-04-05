'use client'
import { useEffect, useRef } from 'react'

const features = [
  { icon: '🎨', title: 'Desain Premium & Eksklusif', desc: 'Puluhan template elegan oleh desainer profesional — romantis, rustic, modern, hingga mewah.' },
  { icon: '🎵', title: 'Musik Latar Romantis', desc: 'Alunan musik pilihan yang memperindah suasana saat tamu membuka undangan Anda.' },
  { icon: '📍', title: 'Peta Lokasi Interaktif', desc: 'Integrasi Google Maps langsung di undangan. Tamu navigasi dengan satu klik.' },
  { icon: '💌', title: 'RSVP & Ucapan Online', desc: 'Tamu konfirmasi kehadiran & kirim ucapan doa langsung di undangan. Semua tercatat rapi.' },
  { icon: '⏳', title: 'Hitung Mundur Hari H', desc: 'Countdown timer cantik yang menambah kesan sakral menjelang hari istimewa Anda.' },
  { icon: '🖼️', title: 'Galeri Foto & Video', desc: 'Tampilkan momen prewedding dalam galeri yang indah dan responsif di semua perangkat.' },
  { icon: '💳', title: 'Amplop Digital', desc: 'Fitur gift/amplop digital terintegrasi untuk tamu yang ingin memberikan hadiah secara online.' },
  { icon: '📊', title: 'Laporan Kehadiran', desc: 'Dashboard pantau konfirmasi tamu real-time. Praktis untuk persiapan katering.' },
  { icon: '🔗', title: 'Link Mudah Dibagikan', desc: 'Satu link cantik yang bisa dibagikan via WhatsApp, Instagram, atau medsos lainnya.' },
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
    <section id="fitur" className="py-24 px-6 section-white bg-white dark:bg-[#111d17] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">✨ Fitur Unggulan</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            Semua yang Membuat<br />
            <span className="gradient-text">Undangan Anda Istimewa</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg max-w-xl mx-auto">
            Bukan sekadar undangan biasa — melainkan pengalaman digital yang membekas di hati setiap tamu.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className="animate-on-scroll card-hover bg-[#fffde8] dark:bg-[#1a2e1d] border border-[#f5c6cf]/60 dark:border-[#2a4a38] rounded-2xl p-6 group transition-colors"
              style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffdce2] to-[#fff5c0] dark:from-[#1a3028] dark:to-[#2a4a38] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-[#1a2e1d] dark:text-[#e8f0e8] text-base mb-2">{f.title}</h3>
              <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
