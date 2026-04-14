# Landing Page — Next.js + Tailwind CSS

Landing page bisnis dark mode yang lengkap dengan:
- ✅ Navbar (sticky + mobile responsive)
- ✅ Hero section dengan animasi
- ✅ Fitur / Layanan
- ✅ Cara Pesan (4 langkah)
- ✅ Harga (toggle bulanan/tahunan)
- ✅ Testimoni
- ✅ FAQ (accordion)
- ✅ Footer + CTA Banner

## Cara Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 3. Build untuk production
```bash
npm run build
npm run start
```

## Cara Kustomisasi

### Ganti nama produk
Cari semua tulisan `NamaProduct` dan ganti dengan nama produk Anda di file:
- `src/app/layout.tsx` — metadata title & description
- `src/components/Navbar.tsx` — logo dan nama
- `src/components/Footer.tsx` — branding footer

### Ganti konten
- **Hero** → `src/components/Hero.tsx`
- **Fitur** → `src/components/Fitur.tsx` (edit array `features`)
- **Cara Pesan** → `src/components/CaraPesan.tsx` (edit array `steps`)
- **Harga** → `src/components/Harga.tsx` (edit array `plans` dan harga)
- **Testimoni** → `src/components/Testimoni.tsx` (edit array `testimonials`)
- **FAQ** → `src/components/FAQ.tsx` (edit array `faqs`)
- **Footer** → `src/components/Footer.tsx` (ganti nomor WhatsApp di link `wa.me`)

### Ganti warna aksen
Di `tailwind.config.js`, ubah nilai `accent: '#6C63FF'` dengan warna pilihan Anda.

### Ganti nomor WhatsApp
Di `src/components/Footer.tsx`, cari `wa.me/6281234567890` dan ganti dengan nomor Anda.

## Stack
- [Next.js 14](https://nextjs.org/) — App Router
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Satoshi + Clash Display](https://www.fontshare.com/) — Typography (Google Fonts alternatif)
