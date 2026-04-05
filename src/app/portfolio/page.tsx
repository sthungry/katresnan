import type { Metadata } from 'next'
import PortfolioContent from './PortfolioContent'

export const metadata: Metadata = {
  title: 'Koleksi Template Undangan Digital Premium | Katresnan',
  description: 'Jelajahi 14+ template undangan digital pernikahan premium. Tersedia gaya elegant, floral, minimalis, dark, vintage, modern, dan cultural. Preview langsung sebelum memesan.',
  alternates: { canonical: 'https://katresnan.id/portfolio' },
  openGraph: {
    title: 'Template Undangan Digital Premium — Katresnan',
    description: 'Jelajahi 14+ template undangan digital pernikahan premium. Preview langsung sebelum memesan.',
    url: 'https://katresnan.id/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioContent />
}
