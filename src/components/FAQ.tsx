'use client'
import { useEffect, useRef, useState } from 'react'

const faqs = [
  { q: 'Berapa lama proses pembuatan undangan?', a: 'Undangan biasanya selesai dalam 1x24 jam setelah pembayaran dan data lengkap diterima. Untuk paket Platinum dengan desain kustom, maksimal 2x24 jam.' },
  { q: 'Apakah saya bisa melihat contoh undangan sebelum pesan?', a: 'Tentu! Kami menyediakan demo langsung yang bisa Anda buka di browser atau HP. Hubungi kami via WhatsApp untuk mendapatkan link demo sesuai tema yang Anda minati.' },
  { q: 'Berapa kali saya bisa minta revisi?', a: 'Tergantung paket: Silver 1x revisi, Gold 2x revisi, Platinum revisi tidak terbatas. Revisi mencakup perubahan teks, foto, dan detail kecil lainnya.' },
  { q: 'Apakah undangan bisa dibuka di semua HP?', a: 'Ya! Undangan kami dirancang responsif dan tampil optimal di semua perangkat — smartphone, tablet, maupun laptop, baik Android maupun iOS.' },
  { q: 'Bagaimana cara membagikan undangan ke tamu?', a: 'Anda akan mendapatkan satu link unik yang bisa langsung dibagikan via WhatsApp, Instagram Stories, email, atau media sosial lainnya.' },
  { q: 'Apakah ada biaya tambahan setelah pesan?', a: 'Tidak ada biaya tersembunyi. Harga yang tertera sudah final termasuk semua fitur di paket yang dipilih.' },
  { q: 'Bisakah undangan untuk acara selain pernikahan?', a: 'Bisa! Kami melayani berbagai jenis acara seperti ulang tahun, pertunangan, syukuran, khitanan, wisuda, dan lainnya.' },
  { q: 'Apa metode pembayaran yang tersedia?', a: 'Transfer bank (BCA, BNI, BRI, Mandiri), QRIS, GoPay, OVO, dan Dana. Pembayaran DP 50% bisa dilakukan untuk segera memulai proses.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      open
        ? 'border-[#f9b8c4] dark:border-[#4ecdc4]/40 bg-white dark:bg-[#1a2e1d]'
        : 'border-[#ffdce2] dark:border-[#2a4a38] bg-[#fffde8]/50 dark:bg-[#111d17]/50'
    }`}>
      <button className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#ffdce2]/20 dark:hover:bg-[#1a3028]/30 transition-colors"
        onClick={() => setOpen(!open)}>
        <span className="text-[#1a2e1d] dark:text-[#e8f0e8] font-medium text-sm">{q}</span>
        <svg className={`w-5 h-5 text-[#e8879a] dark:text-[#4ecdc4] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 text-[#6b8f72] dark:text-[#7aaa90] text-sm leading-relaxed border-t border-[#ffdce2] dark:border-[#2a4a38] pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
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
    <section id="faq" className="py-24 px-6 bg-white dark:bg-[#111d17] transition-colors" ref={sectionRef}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">🌷 FAQ</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            Ada yang Ingin<br /><span className="gradient-text">Anda Tanyakan?</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg">
            Belum menemukan jawaban? Chat langsung dengan kami di WhatsApp 😊
          </p>
        </div>
        <div className="space-y-3 animate-on-scroll">
          {faqs.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </div>
    </section>
  )
}
