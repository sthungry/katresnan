'use client'
import { useEffect, useRef } from 'react'

const steps = [
<<<<<<< HEAD
  {
    title: 'Pilih Paket & Tema',
    desc: 'Pilih paket yang sesuai dan tentukan tema undangan favorit Anda dari koleksi template premium kami.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: 'Isi Formulir Pesanan',
    desc: 'Lengkapi data mempelai, tanggal acara, lokasi, dan detail lainnya melalui formulir yang mudah.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Lakukan Pembayaran',
    desc: 'Bayar via transfer bank, QRIS, GoPay, OVO, Dana, atau metode lain yang tersedia.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    title: 'Terima & Bagikan!',
    desc: 'Undangan siap dalam 1×24 jam! Langsung bagikan ke seluruh tamu via WhatsApp atau medsos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" />
      </svg>
    ),
  },
=======
  { icon: '🎀', title: 'Pilih Paket & Tema', desc: 'Pilih paket yang sesuai dan tentukan tema undangan favorit Anda dari koleksi template cantik kami.' },
  { icon: '📝', title: 'Isi Formulir Pesanan', desc: 'Lengkapi data mempelai, tanggal acara, lokasi, dan detail lainnya melalui formulir yang mudah diisi.' },
  { icon: '💳', title: 'Lakukan Pembayaran', desc: 'Bayar via transfer bank, QRIS, GoPay, OVO, Dana, atau metode lain yang tersedia.' },
  { icon: '🚀', title: 'Terima & Bagikan!', desc: 'Undangan siap dalam 1x24 jam! Langsung bagikan ke seluruh tamu via WhatsApp atau medsos.' },
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
]

export default function CaraPesan() {
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
<<<<<<< HEAD
    <section id="cara-pesan" className="py-24 px-6 bg-gradient-to-b from-ivory-100 to-white dark:from-[#0f1512] dark:to-[#111917] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-4">
            Cara Pesan
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sage-800 dark:text-ivory-200 mb-4">
            Mudah, Cepat, dan<br />
            <span className="gradient-text">Langsung Jadi</span>
          </h2>
          <p className="text-sage-500 dark:text-sage-400 text-lg max-w-lg mx-auto">
            Hanya butuh 4 langkah dan undangan cantik Anda siap dikirim ke seluruh tamu.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px">
            <div className="w-full h-px bg-gradient-to-r from-gold-300 via-sage-300 to-gold-300 dark:from-sage-700 dark:via-sage-600 dark:to-sage-700 opacity-50" />
          </div>

          {steps.map((step, i) => (
            <div key={step.title} className="animate-on-scroll flex flex-col items-center text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="relative z-10 w-24 h-24 rounded-2xl bg-white dark:bg-sage-900 border border-sage-100 dark:border-sage-700 flex items-center justify-center mb-5 shadow-sm group hover:shadow-md transition-all">
                <span className="text-sage-600 dark:text-sage-300 group-hover:scale-110 transition-transform">{step.icon}</span>
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-serif font-semibold text-sage-800 dark:text-ivory-200 text-base mb-2">{step.title}</h3>
              <p className="text-sage-500 dark:text-sage-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14 animate-on-scroll">
          <a href="#harga" className="inline-flex items-center gap-2 btn-primary text-sm">
            Pesan Undangan Sekarang
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="text-sage-400 dark:text-sage-500 text-xs mt-4 flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Proses cepat
            </span>
            <span className="text-sage-300 dark:text-sage-600">·</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Revisi gratis
            </span>
            <span className="text-sage-300 dark:text-sage-600">·</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Support WhatsApp
            </span>
          </p>
=======
    <section id="cara-pesan" className="py-24 px-6 bg-gradient-to-b from-[#fffde8] to-[#fff4f6] dark:from-[#0f1a13] dark:to-[#111d17] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">💐 Cara Pesan</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            Mudah, Cepat, dan<br />
            <span className="gradient-text">Langsung Jadi</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg max-w-lg mx-auto">
            Hanya butuh 4 langkah dan undangan cantik Anda siap dikirim ke seluruh tamu.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#ffdce2] via-[#f9b8c4] to-[#ffdce2] dark:from-[#2a4a38] dark:via-[#4ecdc4]/30 dark:to-[#2a4a38]" />
          {steps.map((step, i) => (
            <div key={step.title} className="animate-on-scroll flex flex-col items-center text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-white dark:bg-[#1a2e1d] border-2 border-[#ffdce2] dark:border-[#2a4a38] flex items-center justify-center mb-5 shadow-sm">
                <span className="text-3xl">{step.icon}</span>
                <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#03554e] dark:bg-[#4ecdc4] text-white dark:text-[#0f1a13] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-semibold text-[#1a2e1d] dark:text-[#e8f0e8] text-base mb-2">{step.title}</h3>
              <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14 animate-on-scroll">
          <a href="#harga" className="inline-flex items-center gap-2 bg-[#03554e] dark:bg-[#1a5c52] hover:bg-[#023d38] text-white font-semibold px-8 py-3.5 rounded-full transition-all shadow-lg text-sm">
            Pesan Undangan Sekarang 💌
          </a>
          <p className="text-[#8a9e8c] dark:text-[#5a9e80] text-xs mt-3">⚡ Proses cepat • ✅ Revisi gratis • 💬 Support WhatsApp</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
        </div>
      </div>
    </section>
  )
}
