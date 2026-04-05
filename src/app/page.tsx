import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import LogoBar from '@/components/LogoBar'
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
    <main className="min-h-screen bg-[#fffde8] dark:bg-[#0f1a13] transition-colors">
      <Navbar />
      <Hero />
      <LogoBar />
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
