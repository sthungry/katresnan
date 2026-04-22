import Link from 'next/link'
import KatresnanLogo from './KatresnanLogo'

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Layanan: [
    { label: 'Undangan Pernikahan', href: '/demo?paket=gold' },
    { label: 'Template Premium', href: '/portfolio' },
    { label: 'Desain Kustom', href: 'https://wa.me/6285150000715' },
  ],
  Informasi: [
    { label: 'Tentang Kami', href: '#' },
    { label: 'Portfolio',    href: '/portfolio' },
    { label: 'Blog',         href: '#' },
  ],
  Bantuan: [
    { label: 'FAQ',                 href: '/#faq' },
    { label: 'Cara Pesan',          href: '/#cara-pesan' },
    { label: 'Hubungi Kami',        href: 'https://wa.me/6285150000715' },
    { label: 'Kebijakan Privasi',   href: '/kebijakan-privasi' },
    { label: 'Syarat & Ketentuan',  href: '/syarat-ketentuan' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="kontak" className="bg-slate-800 dark:bg-slate-950">
      {/* CTA Banner */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="relative bg-white/5 backdrop-blur rounded-3xl p-10 md:p-14 text-center overflow-hidden border border-white/10">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary-500/5 blur-[100px]" />
          
          <div className="relative z-10">
            {/* Ring icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-primary-400">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
              Jadikan Hari Istimewa Anda<br />
              <span className="text-primary-300">Tak Terlupakan Selamanya</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
              Ribuan pasangan telah mempercayakan momen paling berharga kepada kami. Sekarang giliran Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#harga" className="bg-gradient-to-r from-primary-500 to-primary-400 text-white hover:shadow-lg hover:shadow-primary-500/25 font-semibold px-8 py-3.5 rounded-full transition-all text-sm">
                Pesan Sekarang
              </Link>
              <a href="https://wa.me/6285150000715" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-8 py-3.5 rounded-full transition-all text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <KatresnanLogo variant="light" height={28} />
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-5">
            Platform undangan digital terpercaya untuk momen pernikahan Anda.
          </p>
          <div className="flex gap-3">
            {[
              { label: 'IG', href: '#' },
              { label: 'TK', href: '#' },
              { label: 'WA', href: 'https://wa.me/6285150000715' },
            ].map((s) => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-all text-xs font-medium">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-white/80 font-semibold text-sm mb-4 tracking-wide">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}
                      className="text-white/40 hover:text-white/70 text-sm transition-colors duration-200">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-white/30 text-xs">© {year} Katresnan. Hak cipta dilindungi.</p>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/kebijakan-privasi" className="text-white/30 hover:text-white/60 transition-colors">
            Kebijakan Privasi
          </Link>
          <span className="text-white/15">·</span>
          <Link href="/syarat-ketentuan" className="text-white/30 hover:text-white/60 transition-colors">
            Syarat & Ketentuan
          </Link>
          <span className="text-white/15">·</span>
          <span className="text-white/30">Dibuat dengan dedikasi di Indonesia</span>
        </div>
      </div>
    </footer>
  )
}