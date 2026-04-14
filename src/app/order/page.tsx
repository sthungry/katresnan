import type { Metadata } from 'next'
import OrderContent from './OrderContent'

export const metadata: Metadata = {
  title: 'Cek Status Pesanan | Katresnan',
  description: 'Pantau status pesanan undangan digital kamu secara real-time menggunakan Order ID.',
  alternates: { canonical: 'https://katresnan.id/order' },
  robots: { index: false, follow: false },
}

export default function OrderPage() {
  return <OrderContent />
}
