'use client'
import { useEffect, useRef } from 'react'

const testimonials = [
  { name: 'Reza & Nadya', role: 'Pernikahan • Januari 2025', avatar: '👫', rating: 5, text: 'Undangan digitalnya cantik banget! Banyak tamu yang nanya bikin di mana. Prosesnya cepat, dalam sehari langsung jadi. Sangat puas!' },
  { name: 'Ibu Sari Dewi', role: 'Ulang Tahun ke-50 • Februari 2025', avatar: '🎂', rating: 5, text: 'Awalnya ragu mau buat undangan digital, tapi hasilnya melebihi ekspektasi. Elegan, mudah dibuka, dan semua tamu suka tampilannya.' },
  { name: 'Fajar & Intan', role: 'Pernikahan • Maret 2025', avatar: '💑', rating: 5, text: 'Fitur RSVP-nya membantu banget buat hitung jumlah tamu yang hadir. Tidak perlu repot nanya satu-satu lagi. Recommended banget!' },
  { name: 'Keluarga Bapak Hendra', role: 'Syukuran Rumah Baru • Desember 2024', avatar: '🏡', rating: 5, text: 'Harganya sangat terjangkau untuk kualitas sebagus ini. Tim-nya responsif dan sabar meladeni revisi saya yang minta ubah berkali-kali.' },
  { name: 'Dinda & Aryo', role: 'Pertunangan • April 2025', avatar: '💍', rating: 5, text: 'Galeri fotonya kece abis! Semua momen prewed kami tampil dengan indah. Musiknya juga bikin baper pas dibuka. Terima kasih Katresnan!' },
  { name: 'Putri Rahayu', role: 'Ulang Tahun ke-25 • Maret 2025', avatar: '🎉', rating: 5, text: 'Undangannya aesthetic banget sesuai konsep birthday party saya. Banyak yang nanya itu bikin di mana sampai saya rekomendasiin ke semua teman.' },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#f9b8c4] fill-[#f9b8c4]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimoni() {
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
    <section id="testimoni" className="py-24 px-6 bg-gradient-to-b from-[#fff4f6] to-[#fffde8] dark:from-[#131f18] dark:to-[#0f1a13] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">💬 Kata Mereka</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            3.500+ Pasangan Sudah<br />
            <span className="gradient-text">Merasakan Keindahannya</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg max-w-xl mx-auto">
            Kepercayaan mereka adalah kebanggaan kami.
          </p>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <div key={t.name}
              className="animate-on-scroll card-hover bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-2xl p-6 break-inside-avoid transition-colors"
              style={{ transitionDelay: `${i * 0.08}s` }}>
              <Stars count={t.rating} />
              <p className="text-[#6b8f72] dark:text-[#7aaa90] text-sm leading-relaxed mt-3 mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffdce2] to-[#fff5c0] dark:from-[#1a3028] dark:to-[#2a4a38] flex items-center justify-center text-xl flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[#1a2e1d] dark:text-[#e8f0e8] text-sm font-semibold">{t.name}</p>
                  <p className="text-[#8a9e8c] dark:text-[#5a9e80] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
