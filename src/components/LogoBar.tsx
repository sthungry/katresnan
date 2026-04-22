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
    <section className="py-10 bg-white dark:bg-[#0f172a] border-y border-[#e2e8f0]/60 dark:border-[#1e293b] overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-[#94a3b8] dark:text-[#64748b] mb-6 font-semibold">
        Dipercaya oleh mitra & klien terkemuka
      </p>
      <div className="relative">
        {/* Gradient edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-[#0f172a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-[#0f172a] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap w-max">
          {[...clients, ...clients].map((c, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-full px-5 py-2.5 flex-shrink-0">
              <span className="text-xl">{c.emoji}</span>
              <span className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9] whitespace-nowrap">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
