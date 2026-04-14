"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { fetchPackages, type Package } from "@/lib/supabase"

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

<<<<<<< HEAD
function CheckIcon({ highlight }: { highlight?: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-gold-300' : 'text-gold-500 dark:text-gold-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PackageSkeleton() {
  return (
    <div className="rounded-2xl p-8 bg-white dark:bg-sage-900/50 border border-sage-100 dark:border-sage-800 animate-pulse">
      <div className="w-10 h-10 bg-sage-100 dark:bg-sage-800 rounded-full mb-4"/>
      <div className="h-6 bg-sage-100 dark:bg-sage-800 rounded w-1/2 mb-2"/>
      <div className="h-4 bg-sage-100 dark:bg-sage-800 rounded w-3/4 mb-6"/>
      <div className="h-10 bg-sage-100 dark:bg-sage-800 rounded w-2/3 mb-2"/>
      <div className="space-y-2 mt-6">
        {[...Array(5)].map((_,i) => <div key={i} className="h-3 bg-sage-100 dark:bg-sage-800 rounded" style={{width: `${100 - i * 15}%`}}/>)}
=======
// Skeleton loader untuk card paket
function PackageSkeleton() {
  return (
    <div className="rounded-3xl p-8 bg-white dark:bg-[#1a2e1d] border-2 border-[#ffdce2] dark:border-[#2a4a38] animate-pulse">
      <div className="w-10 h-10 bg-[#ffdce2] dark:bg-[#2a4a38] rounded-full mb-4"/>
      <div className="h-6 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-1/2 mb-2"/>
      <div className="h-4 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-3/4 mb-6"/>
      <div className="h-10 bg-[#ffdce2] dark:bg-[#2a4a38] rounded w-2/3 mb-2"/>
      <div className="space-y-2 mt-6">
        {[...Array(5)].map((_,i) => <div key={i} className="h-3 bg-[#ffdce2] dark:bg-[#2a4a38] rounded" style={{width: `${100 - i * 15}%`}}/>)}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
      </div>
    </div>
  )
}

<<<<<<< HEAD
// Package icons
const packageIcons: Record<string, JSX.Element> = {
  silver: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" />
    </svg>
  ),
  gold: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  platinum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
}

=======
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
export default function Harga() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchPackages().then(data => { setPackages(data); setLoading(false) })
<<<<<<< HEAD
    // Preload template data
=======
    // Preload template data di background agar /demo lebih cepat
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    import('@/lib/supabase').then(m => {
      ;['silver','gold','platinum'].forEach(id => m.fetchTemplatesByPackage(id).catch(()=>{}))
      m.fetchCategories().catch(()=>{})
    })
  }, [])

  useEffect(() => {
    const o = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && x.target.classList.add("visible")),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll(".animate-on-scroll").forEach((el) => o.observe(el))
    return () => o.disconnect()
  }, [packages])

  return (
<<<<<<< HEAD
    <section id="harga" className="py-24 px-6 bg-white dark:bg-[#111917] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Divider */}
        <div className="section-divider mb-24" />

        <div className="text-center mb-14 animate-on-scroll">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400 mb-4">
            Harga Paket
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sage-800 dark:text-ivory-200 mb-4">
            Investasi Kecil untuk<br/>
            <span className="gradient-text">Kenangan Seumur Hidup</span>
          </h2>
          <p className="text-sage-500 dark:text-sage-400 text-lg max-w-xl mx-auto">
            Harga transparan tanpa biaya tersembunyi.{" "}
            <span className="text-gold-600 dark:text-gold-400 font-semibold">Diskon spesial aktif sekarang!</span>
=======
    <section id="harga" className="py-24 px-6 bg-white dark:bg-[#111d17] transition-colors" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#e8879a] dark:text-[#ffb3c1] mb-3 block">💰 Harga Paket</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a2e1d] dark:text-[#e8f0e8] mb-4">
            Investasi Kecil untuk<br/>
            <span className="gradient-text">Kenangan Seumur Hidup</span>
          </h2>
          <p className="text-[#6b8f72] dark:text-[#7aaa90] text-lg max-w-xl mx-auto">
            Harga transparan tanpa biaya tersembunyi.{" "}
            <span className="text-green-600 font-semibold">Diskon spesial aktif sekarang!</span>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => <PackageSkeleton key={i}/>)
            : packages.map((plan, i) => {
                const isHighlight = plan.id === "gold"
<<<<<<< HEAD
                return (
                  <div key={plan.id}
                    className={"animate-on-scroll card-hover rounded-2xl p-8 flex flex-col relative overflow-hidden " + (
                      isHighlight
                        ? "bg-sage-800 dark:bg-sage-900 shadow-2xl shadow-sage-800/20 dark:shadow-black/30 ring-1 ring-gold-500/20 scale-[1.02]"
                        : "bg-white dark:bg-sage-900/50 border border-sage-100 dark:border-sage-800"
                    )}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    {/* Top accent line */}
                    <div className={"absolute top-0 left-0 right-0 h-px " + (
                      isHighlight 
                        ? "bg-gradient-to-r from-transparent via-gold-400 to-transparent" 
                        : "bg-gradient-to-r from-transparent via-sage-200 dark:via-sage-700 to-transparent"
                    )}/>

                    {/* Popular badge */}
                    {isHighlight && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-400 text-white text-xs font-semibold px-5 py-1 rounded-b-full tracking-wide">
                        Paling Diminati
                      </span>
                    )}

                    {/* Icon & Name */}
                    <div className="mb-5 mt-3">
                      <div className={`mb-3 ${isHighlight ? "text-gold-300" : "text-sage-400 dark:text-sage-500"}`}>
                        {packageIcons[plan.id] || packageIcons.silver}
                      </div>
                      <h3 className={"font-serif font-bold text-2xl mb-1 " + (isHighlight ? "text-white" : "text-sage-800 dark:text-ivory-200")}>
                        Paket {plan.name}
                      </h3>
                      <p className={"text-sm " + (isHighlight ? "text-sage-300" : "text-sage-500 dark:text-sage-400")}>
                        {plan.id === "silver" ? "Template tanpa foto prewedding" : plan.id === "gold" ? "Dengan foto prewedding, 1 tema premium" : "Pilih 2 tema, semua fitur premium"}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + (
                          isHighlight ? "bg-gold-500/20 text-gold-300" : "bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400"
                        )}>
                          HEMAT {plan.discount}%
                        </span>
                        <span className={"text-sm line-through " + (isHighlight ? "text-sage-400" : "text-sage-400")}>
                          {formatRp(plan.original_price)}
                        </span>
                      </div>
                      <p className={"font-serif text-4xl font-bold " + (isHighlight ? "text-white" : "text-sage-800 dark:text-sage-200")}>
                        {formatRp(plan.price)}
                      </p>
                      <p className={"text-xs mt-2 " + (isHighlight ? "text-sage-400" : "text-sage-400 dark:text-sage-500")}>
=======
                const promoSaving = plan.original_price - plan.price
                return (
                  <div key={plan.id}
                    className={"animate-on-scroll card-hover rounded-3xl p-8 flex flex-col relative overflow-hidden " + (
                      isHighlight
                        ? "bg-[#03554e] shadow-2xl shadow-[#03554e]/30 scale-[1.02]"
                        : "bg-white dark:bg-[#1a2e1d] border-2 border-[#ffdce2] dark:border-[#2a4a38]"
                    )}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    <div className={"absolute top-0 left-0 right-0 h-1 bg-gradient-to-r " + (isHighlight ? "from-[#ffdce2] via-[#f9b8c4] to-[#ffdce2]" : "from-[#ffdce2] to-[#fff5c0] dark:from-[#2a4a38] dark:to-[#1a3028]")}/>
                    {isHighlight && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#e8879a] text-white text-xs font-semibold px-4 py-1 rounded-b-full whitespace-nowrap">
                        💝 Paling Diminati
                      </span>
                    )}

                    <div className="mb-5 mt-3">
                      <div className="text-4xl mb-2">{plan.emoji}</div>
                      <h3 className={"font-display font-bold text-2xl mb-1 " + (isHighlight ? "text-white" : "text-[#1a2e1d] dark:text-[#e8f0e8]")}>
                        Paket {plan.name}
                      </h3>
                      <p className={"text-sm " + (isHighlight ? "text-[#a8d5d1]" : "text-[#6b8f72] dark:text-[#7aaa90]")}>
                        {plan.id === "silver" ? "Template undangan tanpa foto prewedding" : plan.id === "gold" ? "Dengan foto prewedding, 1 tema premium" : "Pilih 2 tema, semua fitur premium"}
                      </p>
                    </div>

                    {/* Harga */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={"text-xs font-bold px-2.5 py-1 rounded-full " + (isHighlight ? "bg-white/20 text-white" : "bg-green-100 dark:bg-green-900/30 text-green-600")}>
                          HEMAT {plan.discount}%
                        </span>
                        <span className={"text-sm line-through " + (isHighlight ? "text-[#a8d5d1]" : "text-[#8a9e8c]")}>
                          {formatRp(plan.original_price)}
                        </span>
                      </div>
                      <p className={"font-display text-4xl font-bold " + (isHighlight ? "text-white" : "text-[#03554e] dark:text-[#4ecdc4]")}>
                        {formatRp(plan.price)}
                      </p>
                      <p className={"text-xs mt-1.5 " + (isHighlight ? "text-[#a8d5d1]" : "text-[#8a9e8c]")}>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                        sekali bayar · Aktif {plan.masa_aktif} · max {plan.max_themes} tema
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f: string) => (
<<<<<<< HEAD
                        <li key={f} className={"flex items-start gap-2.5 text-sm " + (isHighlight ? "text-sage-200" : "text-sage-600 dark:text-sage-400")}>
                          <CheckIcon highlight={isHighlight} />
                          <span>{f}</span>
=======
                        <li key={f} className={"flex items-center gap-2.5 text-sm " + (isHighlight ? "text-[#d4ede9]" : "text-[#6b8f72] dark:text-[#7aaa90]")}>
                          <span className={"w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs " + (isHighlight ? "bg-white/20 text-white" : "bg-[#ffdce2] dark:bg-[#2a4a38] text-[#e8879a] dark:text-[#4ecdc4]")}>✓</span>
                          {f}
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                        </li>
                      ))}
                    </ul>

<<<<<<< HEAD
                    {/* CTAs */}
                    <div className="flex flex-col gap-2.5">
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-3.5 rounded-full font-semibold text-sm transition-all block " + (
                          isHighlight 
                            ? "bg-gradient-to-r from-gold-500 to-gold-400 text-white hover:shadow-lg hover:shadow-gold-500/25" 
                            : "bg-sage-800 dark:bg-sage-700 text-white hover:bg-sage-700 dark:hover:bg-sage-600"
                        )}>
                        Pilih Tema {plan.name}
                      </Link>
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-2.5 rounded-full text-xs font-medium transition-all block border " + (
                          isHighlight 
                            ? "border-white/20 text-white/70 hover:bg-white/5" 
                            : "border-sage-200 dark:border-sage-700 text-sage-500 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-800"
                        )}>
                        Lihat Demo Template
=======
                    <div className="flex flex-col gap-2">
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-3.5 rounded-full font-bold text-sm transition-all block " + (isHighlight ? "bg-white text-[#03554e] hover:bg-[#ffdce2]" : "bg-[#03554e] dark:bg-[#1a5c52] text-white hover:bg-[#023d38]")}>
                        🎨 Pilih Tema {plan.name}
                      </Link>
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-2.5 rounded-full text-xs font-medium transition-all block border " + (isHighlight ? "border-white/30 text-white/80 hover:bg-white/10" : "border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90]")}>
                        👁 Lihat Demo Template
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
                      </Link>
                    </div>
                  </div>
                )
              })
          }
        </div>

<<<<<<< HEAD
        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-sage-400 dark:text-sage-500 text-sm">
            Butuh desain kustom?{" "}
            <a href="https://wa.me/6285150000715" className="text-sage-700 dark:text-sage-300 font-medium underline underline-offset-4 decoration-gold-300 dark:decoration-gold-600 hover:text-sage-900 dark:hover:text-white transition-colors">
=======
        <div className="text-center mt-10 animate-on-scroll">
          <p className="text-[#8a9e8c] dark:text-[#5a9e80] text-sm">
            🤝 Butuh desain kustom?{" "}
            <a href="https://wa.me/6285150000715" className="text-[#03554e] dark:text-[#4ecdc4] font-medium underline underline-offset-2">
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
              Hubungi kami via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}