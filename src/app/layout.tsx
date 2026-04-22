import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const BASE_URL = 'https://katresnan.id'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)',  color: '#020617' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  'Katresnan — Undangan Digital Pernikahan Elegan & Terjangkau',
    template: '%s | Katresnan',
  },
  description: 'Buat undangan digital pernikahan yang elegan, modern, dan berkesan. Template premium mulai Rp 59.000. Fitur RSVP, countdown, galeri foto, musik, dan peta lokasi. Proses cepat 1 hari kerja.',
  keywords: [
    'undangan digital pernikahan',
    'undangan digital murah',
    'undangan nikah online',
    'undangan pernikahan digital',
    'undangan digital elegan',
    'template undangan digital',
    'website undangan pernikahan',
    'undangan digital RSVP',
    'jasa undangan digital',
    'undangan digital indonesia',
    'katresnan undangan digital',
  ],
  authors: [{ name: 'Katresnan', url: BASE_URL }],
  creator: 'Katresnan',
  publisher: 'Katresnan',
  category: 'wedding',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: BASE_URL,
    siteName: 'Katresnan',
    title: 'Katresnan — Undangan Digital Pernikahan Elegan & Terjangkau',
    description: 'Template undangan digital pernikahan premium mulai Rp 59.000. RSVP online, countdown timer, galeri foto, musik romantis. Proses 1 hari kerja.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Katresnan — Undangan Digital Pernikahan',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Katresnan — Undangan Digital Pernikahan',
    description: 'Template undangan digital premium mulai Rp 59.000. RSVP, countdown, galeri foto & musik.',
    images: ['/og-image.jpg'],
    creator: '@katresnan',
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg',    type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'GANTI_DENGAN_GOOGLE_SEARCH_CONSOLE_CODE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Katresnan",
            "description": "Jasa pembuatan undangan digital pernikahan elegan dan terjangkau",
            "url": "https://katresnan.id",
            "telephone": "+6285150000715",
            "priceRange": "Rp 59.000 - Rp 199.000",
            "currenciesAccepted": "IDR",
            "paymentAccepted": "Bank Transfer, QRIS",
            "areaServed": "Indonesia",
            "serviceType": "Undangan Digital Pernikahan",
            "sameAs": ["https://wa.me/6285150000715"],
          })}}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
