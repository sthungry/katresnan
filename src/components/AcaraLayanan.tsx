'use client'
import { useEffect, useRef } from 'react'

<<<<<<< HEAD
const weddingStyles = [
  {
    title: 'Romantis Klasik',
    desc: 'Nuansa timeless dengan ornamen floral, warna soft, dan tipografi serif yang anggun',
    gradient: 'from-rose-100 to-rose-50 dark:from-rose-900/20 dark:to-sage-900/30',
    iconColor: 'text-rose-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Modern Minimalis',
    desc: 'Layout clean dengan whitespace yang lega, tipografi sans-serif, dan palet warna netral',
    gradient: 'from-sage-100 to-sage-50 dark:from-sage-800/20 dark:to-sage-900/30',
    iconColor: 'text-sage-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Rustic Bohemian',
    desc: 'Sentuhan hangat alam dengan warna earthy, elemen kayu, dan nuansa pedesaan yang charming',
    gradient: 'from-gold-100 to-gold-50 dark:from-gold-900/20 dark:to-sage-900/30',
    iconColor: 'text-gold-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Luxury Mewah',
    desc: 'Desain premium dengan aksen emas, marble texture, dan detail yang mencerminkan kemegahan',
    gradient: 'from-gold-100 to-ivory-100 dark:from-gold-900/20 dark:to-sage-900/30',
    iconColor: 'text-gold-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'Islami Elegan',
    desc: 'Undangan bernuansa Islami dengan ornamen geometric, bismillah, dan doa pernikahan',
    gradient: 'from-sage-100 to-ivory-100 dark:from-sage-800/20 dark:to-sage-900/30',
    iconColor: 'text-sage-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 3l1.5 4.5H18l-3.7 2.7L15.8 15 12 12.2 8.2 15l1.5-4.8L6 7.5h4.5z" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    title: 'Adat & Tradisional',
    desc: 'Undangan khas nusantara — Jawa, Sunda, Minang, Bali, dan budaya daerah lainnya',
    gradient: 'from-rose-100 to-gold-50 dark:from-rose-900/20 dark:to-sage-900/30',
    iconColor: 'text-rose-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M10 10h4" />
      </svg>
    ),
  },
=======
const events = [
  { icon: '💍', title: 'Pernikahan', desc: 'Undangan sakral & elegan untuk hari paling istimewa seumur hidup' },
  { icon: '💎', title: 'Pertunangan', desc: 'Rayakan momen ikrar cinta pertama dengan undangan yang berkesan' },
  { icon: '🎂', title: 'Ulang Tahun', desc: 'Dari sweet seventeen hingga golden birthday yang tak terlupakan' },
  { icon: '🎓', title: 'Wisuda', desc: 'Rayakan pencapaian akademis dengan undangan yang membanggakan' },
  { icon: '✂️', title: 'Khitanan', desc: 'Undangan khitanan yang meriah dan mudah disebarkan ke keluarga' },
  { icon: '🏡', title: 'Syukuran', desc: 'Rumah baru, usaha baru — rayakan bersama orang-orang tercinta' },
  { icon: '🎊', title: 'Reuni', desc: 'Kumpulkan kembali teman lama dengan undangan yang menyentuh' },
  { icon: '🌟', title: 'Acara Lainnya', desc: 'Aqiqah, halal bihalal, seminar, dan acara spesial lainnya' },
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
]

export default function AcaraLayanan() {
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
    <section className="py-24 px-6 bg-ivory-100 dark:bg-[#0f1512] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-4">
            Gaya Undangan
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sage-800 dark:text-ivory-200 mb-4">
            Temukan Gaya yang<br />
            <span className="gradient-text">Mencerminkan Anda</span>
          </h2>
          <p className="text-sage-500 dark:text-sage-400 text-lg max-w-xl mx-auto">
            Berbagai tema undangan pernikahan yang dirancang khusus untuk momen paling istimewa Anda.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {weddingStyles.map((style, i) => (
            <div key={style.title}
              className="animate-on-scroll card-hover group bg-white dark:bg-sage-900/50 border border-sage-100 dark:border-sage-800 rounded-2xl p-6 cursor-pointer"
              style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-4 ${style.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                {style.icon}
              </div>
              <h3 className="font-serif font-semibold text-sage-800 dark:text-ivory-200 text-lg mb-2">{style.title}</h3>
              <p className="text-sage-500 dark:text-sage-400 text-sm leading-relaxed">{style.desc}</p>
=======
    <section className="py-24 px-6 bg-gradient-to-b from-[#fffde8] to-white dark:from-[#0f1a13] dark:to-[#111d17] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">🎊 Layanan Kami</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            Untuk Setiap<br /><span className="gradient-text">Momen Spesial Anda</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg max-w-xl mx-auto">
            Kami melayani berbagai jenis acara dengan desain yang disesuaikan untuk setiap kebutuhan.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {events.map((e, i) => (
            <div key={e.title}
              className="animate-on-scroll card-hover group bg-white dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-2xl p-5 text-center cursor-pointer"
              style={{ transitionDelay: `${i * 0.06}s` }}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#ffdce2] to-[#fff5c0] dark:from-[#1a3028] dark:to-[#2a4a38] flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                {e.icon}
              </div>
              <h3 className="font-display font-bold text-[#1a2e1d] dark:text-[#e8f0e8] text-base mb-1">{e.title}</h3>
              <p className="text-[#8a9e8c] dark:text-[#5a9e80] text-xs leading-relaxed">{e.desc}</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
