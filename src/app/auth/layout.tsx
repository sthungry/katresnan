import type { Metadata } from 'next'
import './auth.css'

export const metadata: Metadata = {
  title: 'Masuk | Katresnan',
  description: 'Masuk atau daftar akun Katresnan untuk mengelola undangan digital pernikahan Anda.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      {children}
    </>
  )
}
