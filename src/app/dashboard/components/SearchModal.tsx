'use client'
import { useState, useEffect, useRef } from 'react'

type TabId = 'dashboard' | 'theme' | 'guests' | 'checkin' | 'ucapan' | 'template_wa' | 'planner' | 'nabung' | 'wishlist' | 'rekening' | 'alamat'

interface SearchItem {
  id: TabId
  label: string
  description: string
  icon: string
}

const allPages: SearchItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview statistik dan metrik utama', icon: 'home-outline' },
  { id: 'guests', label: 'Daftar Tamu', description: 'Kelola data dan status kehadiran tamu', icon: 'people-outline' },
  { id: 'ucapan', label: 'Ucapan Tamu', description: 'Lihat ucapan dan doa dari tamu', icon: 'chatbubble-outline' },
  { id: 'wishlist', label: 'Daftar Kado', description: 'Kelola wishlist hadiah pernikahan', icon: 'gift-outline' },
  { id: 'rekening', label: 'Rekening Bank', description: 'Atur rekening untuk penerimaan dana', icon: 'card-outline' },
  { id: 'template_wa', label: 'Template WA', description: 'Sesuaikan template pesan WhatsApp', icon: 'chatbox-ellipses-outline' },
  { id: 'alamat', label: 'Alamat Kirim', description: 'Atur alamat pengiriman kado fisik', icon: 'location-outline' },
  { id: 'checkin', label: 'Check-in QR', description: 'Scan QR Code kehadiran tamu', icon: 'qr-code-outline' },
  { id: 'theme', label: 'Atur Tema', description: 'Sesuaikan tampilan dan desain undangan', icon: 'color-palette-outline' },
  { id: 'planner', label: 'Wedding Planner', description: 'Kelola jadwal dan tugas pernikahan', icon: 'calendar-outline' },
  { id: 'nabung', label: 'Nabung Bareng', description: 'Pantau progress dana patungan nikah', icon: 'wallet-outline' },
]

interface Props {
  open: boolean
  onClose: () => void
  onNavigate: (tab: TabId) => void
}

export default function SearchModal({ open, onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? allPages.filter(p => p.label.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
    : allPages

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setFocusedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filtered[focusedIndex]) {
        e.preventDefault()
        handleSelect(filtered[focusedIndex].id)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, filtered, focusedIndex, onClose])

  // Reset focused index when query changes
  useEffect(() => { setFocusedIndex(0) }, [query])

  function handleSelect(tab: TabId) {
    onNavigate(tab)
    onClose()
  }

  if (!open) return null

  return (
    <div className="search-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="search-modal-container">
        {/* Search Input */}
        <div className="search-modal-input-wrap">
          <ion-icon name="search-outline" style={{ fontSize: 20, color: 'var(--text-muted)', flexShrink: 0 }}></ion-icon>
          <input
            ref={inputRef}
            className="search-modal-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for menu, features, or navigate..."
          />
          <button className="search-modal-close" onClick={onClose}>
            <ion-icon name="close-outline" style={{ fontSize: 20 }}></ion-icon>
          </button>
        </div>

        {/* Results */}
        <div className="search-modal-results">
          <div className="search-modal-section-label">
            {query.trim() ? 'HASIL PENCARIAN' : 'QUICK ACCESS'}
          </div>

          {filtered.length === 0 ? (
            <div className="search-modal-empty">
              <ion-icon name="search-outline" style={{ fontSize: 32, color: 'var(--text-muted)', display: 'block', margin: '0 auto 8px' }}></ion-icon>
              <p>Tidak ada hasil untuk &quot;{query}&quot;</p>
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                className={`search-modal-item ${i === focusedIndex ? 'focused' : ''}`}
                onClick={() => handleSelect(item.id)}
                onMouseEnter={() => setFocusedIndex(i)}
              >
                <ion-icon name={item.icon}></ion-icon>
                <div className="search-modal-item-text">
                  <span>{item.label}</span>
                  <span className="search-modal-item-desc">{item.description}</span>
                </div>
                <ion-icon name="chevron-forward-outline" style={{ marginLeft: 'auto', fontSize: 16, color: 'var(--stroke)', background: 'transparent', padding: 0 }}></ion-icon>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
