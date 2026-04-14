'use client'
import { useState, useEffect } from 'react'

const WA_NUMBER = '6285150000715'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup chat card */}
      {open && (
        <div className="bg-white dark:bg-sage-900 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 w-72 border border-sage-100 dark:border-sage-800 overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-sage-800 dark:bg-sage-950 px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <WhatsAppIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Katresnan</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-white/60 text-xs">Online sekarang</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Chat bubble */}
          <div className="p-4 bg-ivory-100 dark:bg-sage-950">
            <div className="bg-white dark:bg-sage-900 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm text-sm text-sage-700 dark:text-sage-300 leading-relaxed border border-sage-100 dark:border-sage-800">
              Halo! Selamat datang di <strong>Katresnan</strong>.<br /><br />
              Kami siap bantu Anda membuat undangan pernikahan digital yang cantik & berkesan. Ada yang ingin ditanyakan?
            </div>
            <p className="text-[10px] text-sage-400 mt-1.5 text-right">Balas dalam hitungan menit</p>
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-4 pt-1 bg-ivory-100 dark:bg-sage-950 flex flex-col gap-2">
            {[
              'Info paket & harga',
              'Minta contoh undangan',
              'Cara pesan undangan',
            ].map((msg) => (
              <a key={msg} href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-700 rounded-full px-3.5 py-2 hover:bg-sage-50 dark:hover:bg-sage-800 transition-colors text-center font-medium">
                {msg}
              </a>
            ))}
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="mt-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors">
              <WhatsAppIcon className="w-4 h-4" />
              Chat di WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Notification bubble */}
      {!open && showBubble && (
        <div className="bg-white dark:bg-sage-900 rounded-2xl rounded-br-none shadow-lg px-4 py-2.5 text-sm text-sage-700 dark:text-sage-300 border border-sage-100 dark:border-sage-800 max-w-[200px] animate-fade-up cursor-pointer"
          onClick={() => { setOpen(true); setShowBubble(false) }}>
          Ada yang bisa kami bantu?
        </div>
      )}

      {/* Main button */}
      <button onClick={() => { setOpen(!open); setShowBubble(false) }}
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
        {!open ? (
          <WhatsAppIcon className="w-7 h-7 text-white" />
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        )}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        )}
      </button>
    </div>
  )
}
