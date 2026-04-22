'use client'
import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingData } from './types'
import TemplateFloraPremium from './templates/floral-premium'
import TemplateJava14Elegant from './templates/java14-elegant'
import TemplateGildedClassic from './templates/gilded-classic'
import TemplateGildedStory from './templates/gilded-story'
import TemplateNoirMinimal from './templates/noir-minimal'
import TemplateArabesqueClassic from './templates/arabesque-classic'
import TemplateBotanicalSage from './templates/botanical-sage'

function UndanganInner({ slug }: { slug: string }) {
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [loading, setLoading] = useState(true)
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf8f4' }}>
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🌸</div>
        <p style={{ color: '#c4798a', fontStyle: 'italic' }}>Memuat undangan...</p>
      </div>
    </div>
  )

  if (notFound || !wedding) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#fdf8f4' }}>
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">💌</p>
        <h1 className="text-xl font-bold mb-2" style={{ color: '#3d2c2c' }}>Undangan Tidak Ditemukan</h1>
        <p className="text-sm mb-6" style={{ color: '#8a6e5a' }}>Link ini tidak valid atau belum aktif.</p>
        <a href="/" style={{ color: '#c4798a' }} className="underline text-sm">Kembali ke beranda</a>
      </div>
    </div>
  )

  const tplId = wedding.template_id || ''

  if (tplId === 'java14-elegant') return <TemplateJava14Elegant wedding={wedding} />
  if (tplId === 'gilded-classic' || tplId === 'glided-classic') return <TemplateGildedClassic wedding={wedding} />
  if (tplId === 'gilded-story' || tplId === 'glided-story' || tplId === 'glided-sroty') return <TemplateGildedStory wedding={wedding} />
  if (tplId === 'noir-minimal') return <TemplateNoirMinimal wedding={wedding} />
  // ── Tanpa Foto Templates ──────────────────────────────────────────────────────
  if (tplId === 'arabesque-classic') return <TemplateArabesqueClassic wedding={wedding} />
  if (tplId === 'botanical-sage')    return <TemplateBotanicalSage    wedding={wedding} />

  // Default: floral-premium
  return <TemplateFloraPremium wedding={wedding} />
}

export default function UndanganContent({ slug }: { slug: string }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdf8f4' }}>
        <div className="text-5xl animate-bounce">🌸</div>
      </div>
    }>
      <UndanganInner slug={slug} />
    </Suspense>
  )
}