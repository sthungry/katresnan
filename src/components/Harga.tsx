"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { fetchPackages, type Package } from "@/lib/supabase"

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

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
      </div>
    </div>
  )
}

export default function Harga() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchPackages().then(data => { setPackages(data); setLoading(false) })
    // Preload template data di background agar /demo lebih cepat
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
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? [...Array(3)].map((_, i) => <PackageSkeleton key={i}/>)
            : packages.map((plan, i) => {
                const isHighlight = plan.id === "gold"
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
                        sekali bayar · Aktif {plan.masa_aktif} · max {plan.max_themes} tema
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f: string) => (
                        <li key={f} className={"flex items-center gap-2.5 text-sm " + (isHighlight ? "text-[#d4ede9]" : "text-[#6b8f72] dark:text-[#7aaa90]")}>
                          <span className={"w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-xs " + (isHighlight ? "bg-white/20 text-white" : "bg-[#ffdce2] dark:bg-[#2a4a38] text-[#e8879a] dark:text-[#4ecdc4]")}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-2">
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-3.5 rounded-full font-bold text-sm transition-all block " + (isHighlight ? "bg-white text-[#03554e] hover:bg-[#ffdce2]" : "bg-[#03554e] dark:bg-[#1a5c52] text-white hover:bg-[#023d38]")}>
                        🎨 Pilih Tema {plan.name}
                      </Link>
                      <Link href={`/demo?paket=${plan.id}`}
                        className={"text-center py-2.5 rounded-full text-xs font-medium transition-all block border " + (isHighlight ? "border-white/30 text-white/80 hover:bg-white/10" : "border-[#ffdce2] dark:border-[#2a4a38] text-[#6b8f72] dark:text-[#7aaa90]")}>
                        👁 Lihat Demo Template
                      </Link>
                    </div>
                  </div>
                )
              })
          }
        </div>

        <div className="text-center mt-10 animate-on-scroll">
          <p className="text-[#8a9e8c] dark:text-[#5a9e80] text-sm">
            🤝 Butuh desain kustom?{" "}
            <a href="https://wa.me/6285150000715" className="text-[#03554e] dark:text-[#4ecdc4] font-medium underline underline-offset-2">
              Hubungi kami via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}