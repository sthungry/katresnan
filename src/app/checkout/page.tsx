import type { Metadata } from 'next'
import CheckoutContent from './CheckoutContent'

export const metadata: Metadata = {
  title: 'Checkout — Pesan Undangan Digital | Katresnan',
  description: 'Selesaikan pemesanan undangan digital pernikahan kamu.',
  alternates: { canonical: 'https://katresnan.id/checkout' },
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
