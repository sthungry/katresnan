import type { Metadata } from 'next'
import IsiDataContent from './IsiDataContent'

export const metadata: Metadata = {
  title: 'Isi Data Pengantin | Katresnan',
  description: 'Lengkapi data pengantin untuk undangan digital kamu.',
  robots: { index: false, follow: false },
}

export default function IsiDataPage() {
  return <IsiDataContent />
}
