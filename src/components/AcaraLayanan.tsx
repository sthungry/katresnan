'use client'
import { useEffect, useRef } from 'react'

const events = [
  { icon: '💍', title: 'Pernikahan', desc: 'Undangan sakral & elegan untuk hari paling istimewa seumur hidup' },
  { icon: '💎', title: 'Pertunangan', desc: 'Rayakan momen ikrar cinta pertama dengan undangan yang berkesan' },
  { icon: '🎂', title: 'Ulang Tahun', desc: 'Dari sweet seventeen hingga golden birthday yang tak terlupakan' },
  { icon: '🎓', title: 'Wisuda', desc: 'Rayakan pencapaian akademis dengan undangan yang membanggakan' },
  { icon: '✂️', title: 'Khitanan', desc: 'Undangan khitanan yang meriah dan mudah disebarkan ke keluarga' },
  { icon: '🏡', title: 'Syukuran', desc: 'Rumah baru, usaha baru — rayakan bersama orang-orang tercinta' },
  { icon: '🎊', title: 'Reuni', desc: 'Kumpulkan kembali teman lama dengan undangan yang menyentuh' },
  { icon: '🌟', title: 'Acara Lainnya', desc: 'Aqiqah, halal bihalal, seminar, dan acara spesial lainnya' },
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
