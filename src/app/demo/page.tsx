import type { Metadata } from 'next'
import DemoContent from './DemoContent'

export const metadata: Metadata = {
  title: 'Pilih Template Undangan Digital | Katresnan',
  description: 'Pilih template undangan digital pernikahan favoritmu. Preview langsung sebelum memesan.',
  alternates: { canonical: 'https://katresnan.id/demo' },
  robots: { index: false, follow: false },
}

export default function DemoPage() {
  return <DemoContent />
}
