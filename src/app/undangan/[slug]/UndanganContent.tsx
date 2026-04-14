'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingData } from './types'
import TemplateFloraPremium from './templates/floral-premium'
import TemplateJava14Elegant from './templates/java14-elegant'
<<<<<<< HEAD
// import TemplateNoirMinimal from './templates/noir-minimal'

function UndanganInner({ slug }: { slug: string }) {
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [loading, setLoading] = useState(true)
=======

function UndanganInner({ slug }: { slug: string }) {
  const [wedding,  setWedding]  = useState<WeddingData | null>(null)
  const [loading,  setLoading]  = useState(true)
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('wedding_data')
      .select('*')
      .eq('link_unik', slug)
      .single()
      .then(({ data: wd, error }) => {
        if (error || !wd) setNotFound(true)
        else setWedding(wd as WeddingData)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf8f4' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌸</div>
        <p style={{ color: '#c4798a', fontStyle: 'italic' }}>Memuat undangan...</p>
=======
    <div className="min-h-screen flex items-center justify-center" style={{ background:'#fdf8f4' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌸</div>
        <p style={{ color:'#c4798a', fontStyle:'italic' }}>Memuat undangan...</p>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
      </div>
    </div>
  )

  if (notFound || !wedding) return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#fdf8f4' }}>
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">💌</p>
        <h1 className="text-xl font-bold mb-2" style={{ color: '#3d2c2c' }}>Undangan Tidak Ditemukan</h1>
        <p className="text-sm mb-6" style={{ color: '#8a6e5a' }}>Link ini tidak valid atau belum aktif.</p>
        <a href="/" style={{ color: '#c4798a' }} className="underline text-sm">Kembali ke beranda</a>
=======
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background:'#fdf8f4' }}>
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">💌</p>
        <h1 className="text-xl font-bold mb-2" style={{ color:'#3d2c2c' }}>Undangan Tidak Ditemukan</h1>
        <p className="text-sm mb-6" style={{ color:'#8a6e5a' }}>Link ini tidak valid atau belum aktif.</p>
        <a href="/" style={{ color:'#c4798a' }} className="underline text-sm">Kembali ke beranda</a>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
      </div>
    </div>
  )

  const tplId = wedding.template_id || ''

<<<<<<< HEAD
  if (tplId === 'java14-elegant') return <TemplateJava14Elegant wedding={wedding} />

  // Default: floral-premium
  return <TemplateFloraPremium wedding={wedding} />
=======
  if (tplId === 'java14-elegant') return <TemplateJava14Elegant wedding={wedding}/>

  // Default: floral-premium
  return <TemplateFloraPremium wedding={wedding}/>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
}

export default function UndanganContent({ slug }: { slug: string }) {
  return (
    <Suspense fallback={
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf8f4' }}>
        <div className="text-5xl animate-bounce">🌸</div>
      </div>
    }>
      <UndanganInner slug={slug} />
=======
      <div className="min-h-screen flex items-center justify-center" style={{ background:'#fdf8f4' }}>
        <div className="text-5xl animate-bounce">🌸</div>
      </div>
    }>
      <UndanganInner slug={slug}/>
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    </Suspense>
  )
}