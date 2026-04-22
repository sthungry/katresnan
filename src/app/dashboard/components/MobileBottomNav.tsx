'use client'
import { useState, useEffect, useRef } from 'react'

type TabId = 'dashboard' | 'theme' | 'guests' | 'checkin' | 'ucapan' | 'template_wa' | 'planner' | 'nabung' | 'wishlist' | 'rekening' | 'alamat'

interface MobileBottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

interface PopupMenuItem {
  id: TabId
  label: string
  description: string
  iconBg: string
  icon: JSX.Element
}

const kadoItems: PopupMenuItem[] = [
  {
    id: 'wishlist', label: 'Daftar Kado', description: 'Kelola wishlist hadiah',
    iconBg: '#10B981',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l4.58-4.58c.94-.94.94-2.48 0-3.42L9 5z"/><circle cx="6" cy="9" r="1" fill="#fff"/></svg>
  },
  {
    id: 'rekening', label: 'Rekening Bank', description: 'Atur rekening penerima',
    iconBg: '#7C3AED',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
  },
  {
    id: 'alamat', label: 'Alamat Kirim', description: 'Atur alamat pengiriman',
    iconBg: '#F59E0B',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  },
]

const lainnyaItems: PopupMenuItem[] = [
  {
    id: 'nabung', label: 'Nabung Bareng', description: 'Patungan dana pernikahan',
    iconBg: '#020617',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>
  },
  {
    id: 'theme', label: 'Atur Tema', description: 'Kelola tema undangan',
    iconBg: '#F59E0B',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.52-4.48-9.5-10-9.5z"/></svg>
  },
  {
    id: 'template_wa', label: 'Template WA', description: 'Kelola template pesan',
    iconBg: '#10B981',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  },
  {
    id: 'ucapan', label: 'Ucapan Tamu', description: 'Lihat ucapan & doa',
    iconBg: '#EC4899',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
  },
  {
    id: 'planner', label: 'Wedding Planner', description: 'Kelola persiapan pernikahan',
    iconBg: '#3B82F6',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  },
]

export default function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const [activePopup, setActivePopup] = useState<'kado' | 'lainnya' | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setActivePopup(null)
      }
    }
    if (activePopup) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [activePopup])

  // Close popup on tab change
  useEffect(() => {
    setActivePopup(null)
  }, [activeTab])

  const isKadoActive = ['wishlist', 'rekening', 'alamat'].includes(activeTab)
  const isLainnyaActive = ['nabung', 'theme', 'template_wa', 'ucapan', 'planner'].includes(activeTab)

  function handleNavClick(tab: TabId) {
    onTabChange(tab)
    setActivePopup(null)
  }

  function togglePopup(popup: 'kado' | 'lainnya') {
    setActivePopup(prev => prev === popup ? null : popup)
  }

  return (
    <>
      {/* Popup Backdrop */}
      {activePopup && (
        <div className="mobile-nav-backdrop" onClick={() => setActivePopup(null)} />
      )}

      {/* Popup Menus */}
      {activePopup && (
        <div className="mobile-nav-popup-container" ref={popupRef}>
          <div className="mobile-nav-popup">
            <div className="mobile-nav-popup-title">
              {activePopup === 'kado' ? 'Menu Kado' : 'Menu Lainnya'}
            </div>
            <div className="mobile-nav-popup-list">
              {(activePopup === 'kado' ? kadoItems : lainnyaItems).map(item => (
                <button
                  key={item.id}
                  className={`mobile-nav-popup-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="mobile-nav-popup-item-icon" style={{ background: item.iconBg }}>
                    {item.icon}
                  </div>
                  <div className="mobile-nav-popup-item-text">
                    <span className="mobile-nav-popup-item-label">{item.label}</span>
                    <span className="mobile-nav-popup-item-desc">{item.description}</span>
                  </div>
                  <svg className="mobile-nav-popup-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {/* Home */}
          <button
            className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="mobile-nav-label">Home</span>
          </button>

          {/* QR Check-in */}
          <button
            className={`mobile-nav-btn ${activeTab === 'checkin' ? 'active' : ''}`}
            onClick={() => handleNavClick('checkin')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="8" height="8" rx="1"/>
              <rect x="14" y="2" width="8" height="8" rx="1"/>
              <rect x="2" y="14" width="8" height="8" rx="1"/>
              <rect x="14" y="14" width="4" height="4"/>
              <line x1="22" y1="14" x2="22" y2="14.01"/>
              <line x1="22" y1="18" x2="22" y2="22"/>
              <line x1="18" y1="22" x2="18" y2="22.01"/>
            </svg>
            <span className="mobile-nav-label">QR</span>
          </button>

          {/* Guests */}
          <button
            className={`mobile-nav-btn ${activeTab === 'guests' ? 'active' : ''}`}
            onClick={() => handleNavClick('guests')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="mobile-nav-label">Tamu</span>
          </button>

          {/* Kado */}
          <button
            className={`mobile-nav-btn ${isKadoActive || activePopup === 'kado' ? 'active' : ''}`}
            onClick={() => togglePopup('kado')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"/>
              <rect x="2" y="7" width="20" height="5"/>
              <line x1="12" y1="22" x2="12" y2="7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
            <span className="mobile-nav-label">Kado</span>
          </button>

          {/* Lainnya */}
          <button
            className={`mobile-nav-btn ${isLainnyaActive || activePopup === 'lainnya' ? 'active' : ''}`}
            onClick={() => togglePopup('lainnya')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
            <span className="mobile-nav-label">Lainnya</span>
          </button>
        </div>
      </nav>
    </>
  )
}
