'use client'
import { useEffect, useRef } from 'react'

const clients = [
  { name: 'The Ritz Wedding', emoji: '🏨' },
  { name: 'Bunga Indah Florist', emoji: '💐' },
  { name: 'Amanah Catering', emoji: '🍽️' },
  { name: 'Studio Memori Photo', emoji: '📸' },
  { name: 'Surya Wedding Organizer', emoji: '👗' },
  { name: 'Grand Ballroom', emoji: '✨' },
  { name: 'Kencana Decoration', emoji: '🎀' },
  { name: 'Harmoni Musik', emoji: '🎵' },
]

export default function LogoBar() {
  return (
    <section className="py-10 bg-white dark:bg-[#111d17] border-y border-[#ffdce2]/60 dark:border-[#1a3028] overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-[#8a9e8c] dark:text-[#5a9e80] mb-6 font-semibold">
        Dipercaya oleh mitra & klien terkemuka
      </p>
      <div className="relative">
        {/* Gradient edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[#111d17] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#111d17] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap w-max">
          {[...clients, ...clients].map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-[#fffde8] dark:bg-[#1a2e1d] border border-[#ffdce2] dark:border-[#2a4a38] rounded-full px-5 py-2.5 flex-shrink-0">
              <span className="text-xl">{c.emoji}</span>
              <span className="text-sm font-medium text-[#1a2e1d] dark:text-[#e8f0e8] whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
