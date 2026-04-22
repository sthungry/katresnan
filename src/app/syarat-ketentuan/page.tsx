import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — Katresnan',
  description: 'Syarat dan ketentuan penggunaan layanan undangan digital Katresnan.',
}

const sections = [
  {
    num: '1',
    title: 'Penerimaan Syarat',
    icon: '📋',
    content: `Dengan mengakses dan menggunakan website kami, Anda menyetujui Syarat dan Ketentuan ini, serta Kebijakan Privasi kami. Jika Anda tidak menyetujui syarat-syarat ini, harap jangan gunakan situs kami.`,
  },
  {
    num: '2',
    title: 'Perubahan Syarat',
    icon: '🔄',
    content: `Kami berhak untuk mengubah Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Perubahan akan efektif segera setelah diposting di situs web. Anda bertanggung jawab untuk meninjau Syarat dan Ketentuan secara berkala.`,
  },
  {
    num: '3',
    title: 'Penggunaan Layanan',
    icon: '⚙️',
    content: `Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan Syarat dan Ketentuan ini. Anda dilarang untuk:`,
    list: [
      'Menggunakan layanan kami untuk kegiatan yang melanggar hukum atau merugikan pihak lain.',
      'Mengganggu atau merusak situs web atau server kami.',
      'Mengirimkan virus atau kode berbahaya lainnya.',
      'Mengumpulkan informasi pribadi dari pengguna lain tanpa izin.',
    ],
    listType: 'forbidden' as const,
  },
  {
    num: '4',
    title: 'Akun Pengguna',
    icon: '👤',
    content: `Untuk mengakses beberapa fitur di website kami, Anda mungkin perlu membuat akun pengguna. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda. Harap segera beri tahu kami jika ada penggunaan yang tidak sah dari akun Anda.`,
  },
  {
    num: '5',
    title: 'Konten dan Hak Cipta',
    icon: '©️',
    content: `Semua konten yang terdapat di situs web ini, termasuk teks, grafis, logo, gambar, dan perangkat lunak, adalah milik katresnan.id atau pemberi lisensinya dan dilindungi oleh undang-undang hak cipta. Anda tidak diperkenankan untuk menyalin, memodifikasi, mendistribusikan, atau menggunakan konten tersebut tanpa izin tertulis dari kami.`,
  },
  {
    num: '6',
    title: 'Pesanan dan Pembayaran',
    icon: '💳',
    content: `Dengan melakukan pemesanan di katresnan.id, Anda menyetujui untuk memberikan informasi yang akurat dan lengkap. Semua pembayaran harus dilakukan melalui metode pembayaran yang disediakan di situs kami. Kami berhak untuk menolak atau membatalkan pesanan yang tidak sesuai dengan kebijakan kami.`,
  },
  {
    num: '7',
    title: 'Penggunaan Aset Gambar',
    icon: '🖼️',
    content: `Dengan melakukan pemesanan di katresnan.id, Anda setuju bahwa kami dapat menggunakan aset gambar dari undangan digital Anda untuk keperluan media promosi. Jika Anda tidak ingin gambar Anda digunakan, silakan hubungi kami melalui WhatsApp atau email yang tersedia.`,
  },
  {
    num: '8',
    title: 'Pembatalan dan Pengembalian Dana',
    icon: '↩️',
    content: `Kebijakan pembatalan dan pengembalian dana kami diatur dalam ketentuan yang tercantum di situs web. Harap tinjau kebijakan tersebut sebelum melakukan pembelian.`,
  },
  {
    num: '9',
    title: 'Tanggung Jawab dan Ganti Rugi',
    icon: '⚖️',
    content: `katresnan.id tidak bertanggung jawab atas kerugian atau kerusakan yang timbul dari penggunaan layanan kami. Anda setuju untuk membebaskan dan mengganti rugi katresnan.id dari setiap klaim atau tuntutan yang timbul dari pelanggaran Syarat dan Ketentuan ini oleh Anda.`,
  },
  {
    num: '10',
    title: 'Hukum yang Berlaku',
    icon: '🏛️',
    content: `Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Indonesia. Setiap perselisihan yang timbul dari atau terkait dengan Syarat dan Ketentuan ini akan diselesaikan di pengadilan yang berwenang di Indonesia.`,
  },
]

export default function SyaratKetentuan() {
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
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl">📜</div>
            <span className="text-white/60 text-sm font-medium uppercase tracking-widest">Katresnan</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Syarat &amp; Ketentuan</h1>
          <p className="text-white/60 text-sm">Terakhir diperbarui: Januari 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-6 mb-8">
          <p className="text-[#0f172a] dark:text-[#f1f5f9] leading-relaxed">
            Selamat datang di website <strong>Katresnan</strong>. Dengan mengakses dan menggunakan situs web ini, Anda menyetujui untuk mematuhi dan terikat oleh Syarat dan Ketentuan berikut. Harap baca dengan cermat sebelum menggunakan layanan kami.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((s) => (
            <div key={s.num} className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                {/* Number + icon */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e2e8f0] to-[#fff5c0] dark:from-[#1e293b] dark:to-[#1e293b] flex items-center justify-center text-base">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#94a3b8] dark:text-[#64748b]">0{s.num.length === 1 ? s.num : s.num}</span>
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
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                            s.listType === 'forbidden'
                              ? 'bg-[#fce4ec] dark:bg-[#3a1a20] text-[#3B82F6]'
                              : 'bg-primary-100 dark:bg-[#1e293b] text-[#3B82F6] dark:text-[#60a5fa]'
                          }`}>
                            {s.listType === 'forbidden' ? '✕' : '✓'}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="bg-[#3B82F6] dark:bg-[#1e293b] rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-base flex-shrink-0">📞</div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-lg mb-1">11. Kontak Kami</h2>
                <p className="text-white/70 text-sm mb-4">
                  Jika Anda memiliki pertanyaan atau kekhawatiran tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui:
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
            Dengan menggunakan situs web kami, Anda menyetujui Syarat dan Ketentuan ini.<br/>
            Terima kasih telah mempercayakan <strong className="text-primary-800 dark:text-[#60a5fa]">katresnan.id</strong> untuk kebutuhan undangan digital Anda.
          </p>
        </div>

        {/* Nav */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1 border border-[#e2e8f0] dark:border-[#1e293b] text-primary-800 dark:text-[#60a5fa] font-semibold px-6 py-3 rounded-full text-sm text-center hover:bg-primary-100/30 transition-colors">
            ← Kembali ke Beranda
          </Link>
          <Link href="/kebijakan-privasi" className="flex-1 bg-[#3B82F6] dark:bg-[#1a5c52] text-white font-semibold px-6 py-3 rounded-full text-sm text-center hover:bg-[#2563eb] transition-colors">
            Lihat Kebijakan Privasi →
          </Link>
        </div>
      </div>
    </div>
  )
}
