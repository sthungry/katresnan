"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { fetchPackages, type Package } from "@/lib/supabase"

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

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
      </div>
    </div>
  )
}

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

export default function Harga() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchPackages().then(data => { setPackages(data); setLoading(false) })
    // Preload template data
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
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => <PackageSkeleton key={i}/>)
            : packages.map((plan, i) => {
                const isHighlight = plan.id === "gold"
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
                        sekali bayar · Aktif {plan.masa_aktif} · max {plan.max_themes} tema
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f: string) => (
                        <li key={f} className={"flex items-start gap-2.5 text-sm " + (isHighlight ? "text-sage-200" : "text-sage-600 dark:text-sage-400")}>
                          <CheckIcon highlight={isHighlight} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

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
                      </Link>
                    </div>
                  </div>
                )
              })
          }
        </div>

        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-sage-400 dark:text-sage-500 text-sm">
            Butuh desain kustom?{" "}
            <a href="https://wa.me/6285150000715" className="text-sage-700 dark:text-sage-300 font-medium underline underline-offset-4 decoration-gold-300 dark:decoration-gold-600 hover:text-sage-900 dark:hover:text-white transition-colors">
              Hubungi kami via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}