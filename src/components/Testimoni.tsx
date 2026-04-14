'use client'
import { useEffect, useRef } from 'react'

const testimonials = [
  { name: 'Reza & Nadya', role: 'Pernikahan · Januari 2025', rating: 5, text: 'Undangan digitalnya cantik banget! Banyak tamu yang nanya bikin di mana. Prosesnya cepat, dalam sehari langsung jadi. Sangat puas!' },
  { name: 'Ibu Sari Dewi', role: 'Resepsi · Februari 2025', rating: 5, text: 'Awalnya ragu mau buat undangan digital, tapi hasilnya melebihi ekspektasi. Elegan, mudah dibuka, dan semua tamu suka tampilannya.' },
  { name: 'Fajar & Intan', role: 'Pernikahan · Maret 2025', rating: 5, text: 'Fitur RSVP-nya membantu banget buat hitung jumlah tamu yang hadir. Tidak perlu repot nanya satu-satu lagi. Recommended banget!' },
  { name: 'Keluarga Hendra', role: 'Pernikahan · Desember 2024', rating: 5, text: 'Harganya sangat terjangkau untuk kualitas sebagus ini. Tim-nya responsif dan sabar meladeni revisi saya yang minta ubah berkali-kali.' },
  { name: 'Dinda & Aryo', role: 'Pernikahan · April 2025', rating: 5, text: 'Galeri fotonya kece abis! Semua momen prewed kami tampil dengan indah. Musiknya juga bikin baper pas dibuka. Terima kasih Katresnan!' },
  { name: 'Putri Rahayu', role: 'Pernikahan · Maret 2025', rating: 5, text: 'Undangannya aesthetic banget sesuai konsep wedding kami. Banyak yang nanya itu bikin di mana sampai saya rekomendasiin ke semua teman.' },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-gold-500 fill-gold-500" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 text-gold-200 dark:text-sage-700" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
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
    <section id="testimoni" className="py-24 px-6 bg-gradient-to-b from-ivory-100 to-white dark:from-[#0d1210] dark:to-[#111917] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-4">
            Testimoni
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sage-800 dark:text-ivory-200 mb-4">
            3.500+ Pasangan Sudah<br />
            <span className="gradient-text">Merasakan Keindahannya</span>
          </h2>
          <p className="text-sage-500 dark:text-sage-400 text-lg max-w-xl mx-auto">
            Kepercayaan mereka adalah kebanggaan kami.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t, i) => (
            <div key={t.name}
              className="animate-on-scroll card-hover bg-white dark:bg-sage-900/50 border border-sage-100 dark:border-sage-800 rounded-2xl p-6 break-inside-avoid transition-colors"
              style={{ transitionDelay: `${i * 0.07}s` }}>
              <div className="flex items-start justify-between mb-3">
                <Stars count={t.rating} />
                <QuoteIcon />
              </div>
              <p className="text-sage-600 dark:text-sage-400 text-sm leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-200 to-gold-100 dark:from-sage-700 dark:to-sage-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-sage-600 dark:text-sage-300 text-sm font-serif font-bold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sage-800 dark:text-ivory-200 text-sm font-semibold">{t.name}</p>
                  <p className="text-sage-400 dark:text-sage-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
