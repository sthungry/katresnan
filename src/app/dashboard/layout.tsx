import type { Metadata } from 'next'
import Script from 'next/script'
import './dashboard.css'

export const metadata: Metadata = {
  title: 'Wedding Planner Dashboard | Katresnan',
  description: 'Pantau semua undangan pernikahan dalam satu tempat. Dashboard untuk mengelola tamu, check-in, ucapan, wishlist, dan wedding planner.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Lottie */}
      <Script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.3/dist/dotlottie-wc.js" type="module" strategy="afterInteractive" />
      {/* QR Scanner */}
      <Script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js" strategy="afterInteractive" />
      {/* Chart.js */}
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js" strategy="afterInteractive" />
      {/* jsPDF */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js" strategy="afterInteractive" />
      {/* Image Compression */}
      <Script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js" strategy="afterInteractive" />

      {children}
    </>
  )
}
