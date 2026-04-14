import type { Metadata } from 'next'
import UndanganContent from './UndanganContent'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Undangan Pernikahan | Katresnan`,
    description: 'Anda diundang untuk hadir di pernikahan kami.',
    openGraph: { type: 'website', images: ['/og-image.jpg'] },
  }
}

export default function UndanganPage({ params }: { params: { slug: string } }) {
  return <UndanganContent slug={params.slug} />
}
