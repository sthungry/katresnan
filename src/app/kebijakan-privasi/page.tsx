import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — Katresnan',
  description: 'Kebijakan privasi Katresnan menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
}

const sections = [
  {
    num: '1',
    title: 'Pengumpulan Informasi',
    content: `Kami mengumpulkan informasi pribadi yang Anda berikan secara sukarela saat menggunakan layanan kami, seperti nama, alamat email, nomor telepon, dan informasi pembayaran. Kami juga mengumpulkan data non-pribadi, seperti alamat IP, jenis perangkat, dan data penggunaan melalui cookies dan teknologi pelacakan lainnya.`,
  },
  {
    num: '2',
    title: 'Penggunaan Informasi',
    content: null,
    list: [
      'Memproses dan mengelola pesanan Anda.',
      'Memberikan dukungan pelanggan dan menjawab pertanyaan Anda.',
      'Mengirimkan informasi promosi dan pembaruan terkait layanan kami.',
      'Meningkatkan situs web dan layanan kami berdasarkan feedback dan analisis penggunaan.',
    ],
  },
  {
    num: '3',
    title: 'Perlindungan Informasi',
    content: `Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Meskipun demikian, kami tidak dapat menjamin keamanan informasi yang dikirimkan secara online dan pengguna bertanggung jawab untuk menjaga kerahasiaan informasi pribadi mereka.`,
  },
  {
    num: '4',
    title: 'Pengungkapan Informasi',
    content: `Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali jika diperlukan untuk:`,
    list: [
      'Mematuhi hukum, peraturan, atau proses hukum yang berlaku.',
      'Menegakkan kebijakan situs kami atau melindungi hak, properti, atau keselamatan katresnan.id dan pengguna kami.',
    ],
  },
  {
    num: '5',
    title: 'Cookies dan Teknologi Pelacakan',
    content: `Kami menggunakan cookies dan teknologi pelacakan lainnya untuk meningkatkan pengalaman pengguna di situs kami, menganalisis penggunaan situs, dan menargetkan iklan. Anda dapat mengatur browser Anda untuk menolak cookies, tetapi ini dapat mempengaruhi fungsionalitas situs web kami.`,
  },
  {
    num: '6',
    title: 'Hak Pengguna',
    content: `Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda yang kami simpan. Anda juga dapat memilih untuk tidak menerima komunikasi promosi dari kami dengan mengikuti petunjuk berhenti berlangganan yang terdapat dalam email kami atau menghubungi kami secara langsung.`,
  },
  {
    num: '7',
    title: 'Perubahan Kebijakan Privasi',
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini, dan kami mendorong Anda untuk meninjau kebijakan ini secara berkala.`,
  },
]

export default function KebijakanPrivasi() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
      {/* Header */}
      <div className="bg-[#3B82F6] dark:bg-[#020617]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">🔒</div>
            <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Katresnan</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Kebijakan Privasi</h1>
          <p className="text-white/60 text-sm">Terakhir diperbarui: Januari 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-6 mb-8">
          <p className="text-[#0f172a] dark:text-[#f1f5f9] leading-relaxed">
            <strong>Katresnan</strong> berkomitmen untuk melindungi privasi pengguna kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda ketika Anda menggunakan situs web kami.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.num} className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e2e8f0] to-[#fff5c0] dark:from-[#1e293b] dark:to-[#1e293b] flex items-center justify-center font-bold text-sm text-primary-800 dark:text-[#60a5fa] flex-shrink-0 mt-0.5">
                  {s.num}
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-bold text-lg text-[#0f172a] dark:text-[#f1f5f9] mb-3">{s.title}</h2>
                  {s.content && (
                    <p className="text-[#64748b] dark:text-[#94a3b8] text-sm leading-relaxed mb-3">{s.content}</p>
                  )}
                  {s.list && (
                    <ul className="space-y-2">
                      {s.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#64748b] dark:text-[#94a3b8]">
                          <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-[#1e293b] text-[#3B82F6] dark:text-[#60a5fa] flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Contact section */}
          <div className="bg-[#3B82F6] dark:bg-[#1e293b] rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">8</div>
              <div>
                <h2 className="font-display font-bold text-lg mb-3">Kontak Kami</h2>
                <p className="text-white/70 text-sm mb-4">
                  Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi kami melalui:
                </p>
                <div className="space-y-2.5">
                  <a href="mailto:admin@katresnan.id"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold">admin@katresnan.id</p>
                    </div>
                  </a>
                  <a href="https://wa.me/6285150000715"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors">
                    <span className="text-xl">💬</span>
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">WhatsApp</p>
                      <p className="text-sm font-semibold">0851 5000 0715</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 p-5 bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl text-center">
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
            Dengan menggunakan situs web kami, Anda menyetujui Kebijakan Privasi ini.<br/>
            Terima kasih telah mempercayakan <strong className="text-primary-800 dark:text-[#60a5fa]">katresnan.id</strong> untuk kebutuhan undangan digital Anda.
          </p>
        </div>

        {/* Nav to other legal page */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1 border border-[#e2e8f0] dark:border-[#1e293b] text-primary-800 dark:text-[#60a5fa] font-semibold px-6 py-3 rounded-full text-sm text-center hover:bg-primary-100/30 transition-colors">
            ← Kembali ke Beranda
          </Link>
          <Link href="/syarat-ketentuan" className="flex-1 bg-[#3B82F6] dark:bg-[#1a5c52] text-white font-semibold px-6 py-3 rounded-full text-sm text-center hover:bg-[#2563eb] transition-colors">
            Lihat Syarat & Ketentuan →
          </Link>
        </div>
      </div>
    </div>
  )
}
