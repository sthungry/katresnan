'use client'
import { useEffect, useRef } from 'react'

const steps = [
  { icon: '🎀', title: 'Pilih Paket & Tema', desc: 'Pilih paket yang sesuai dan tentukan tema undangan favorit Anda dari koleksi template cantik kami.' },
  { icon: '📝', title: 'Isi Formulir Pesanan', desc: 'Lengkapi data mempelai, tanggal acara, lokasi, dan detail lainnya melalui formulir yang mudah diisi.' },
  { icon: '💳', title: 'Lakukan Pembayaran', desc: 'Bayar via transfer bank, QRIS, GoPay, OVO, Dana, atau metode lain yang tersedia.' },
  { icon: '🚀', title: 'Terima & Bagikan!', desc: 'Undangan siap dalam 1x24 jam! Langsung bagikan ke seluruh tamu via WhatsApp atau medsos.' },
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
        </div>
      </div>
    </section>
  )
}
