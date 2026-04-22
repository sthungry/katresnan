import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AcaraLayanan from '@/components/AcaraLayanan'
import Fitur from '@/components/Fitur'
import CaraPesan from '@/components/CaraPesan'
import Harga from '@/components/Harga'
import Testimoni from '@/components/Testimoni'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export default function Home() {
  return (
    <main className="min-h-screen bg-surface-100 dark:bg-slate-950 transition-colors duration-500">
      <Navbar />
      <Hero />
      <AcaraLayanan />
      <Fitur />
      <CaraPesan />
      <Harga />
      <Testimoni />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}
