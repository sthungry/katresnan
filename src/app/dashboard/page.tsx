'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardOverview from './components/DashboardOverview'
import GuestManagement from './components/GuestManagement'
import CheckInScanner from './components/CheckInScanner'
import UcapanMessages from './components/UcapanMessages'
import WishlistManager from './components/WishlistManager'
import SettingsPanel from './components/SettingsPanel'
import WeddingPlannerTab from './components/WeddingPlannerTab'
import NabungBareng from './components/NabungBareng'
import MobileBottomNav from './components/MobileBottomNav'
import SearchModal from './components/SearchModal'
import { ConfirmDialog, ScrollToTop, getGreeting, useKeyboardShortcuts } from './components/DashboardEnhancements'

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Guest {
  id: string; nama: string; telepon: string; email: string
  jumlah_tamu: number; status_undangan: string; status_kehadiran: string
  kategori: string; catatan: string; qr_code: string; link_undangan: string
  order_id: string; created_at: string; updated_at: string
}
export interface CheckIn {
  id: string; guest_id: string; order_id: string
  checked_in_at: string; checked_in_by: string; catatan: string
  guests?: Guest
}
export interface Ucapan {
  id: string; nama: string; ucapan: string
  hadir: 'hadir' | 'tidak' | 'ragu'; created_at: string; order_id: string
}
export interface WishlistItem {
  id: string; order_id: string; nama_barang: string; deskripsi: string
  gambar_url: string; target_dana: number; terkumpul: number
  link_produk: string; prioritas: number; status: string
  created_at: string; updated_at: string
}
export interface WeddingSettings {
  id: string; order_id: string
  wa_templates: any[]; wa_template_undangan: string; wa_template_reminder: string
  rekening_list: any[]; alamat_pengiriman: string
  kota: string; kode_pos: string
  nabung_target: number; nabung_sources: any[]; nabung_deposits: any[]
}
export interface WeddingData {
  order_id: string; link_unik: string
  pria_nama_panggilan: string; wanita_nama_panggilan: string
}

type TabId = 'dashboard' | 'theme' | 'guests' | 'checkin' | 'ucapan' | 'template_wa' | 'planner' | 'nabung' | 'wishlist' | 'rekening' | 'alamat'

interface NavItem { id: TabId; label: string; icon: string; badge?: number }

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (orderId: string) => void }) {
  const [orderId, setOrderId] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!orderId.trim()) return
    setLoading(true); setErr('')
    const { data, error } = await supabase
      .from('wedding_data')
      .select('order_id, pria_nama_panggilan, wanita_nama_panggilan')
      .eq('order_id', orderId.trim()).single()
    if (error || !data) { setErr('Order ID tidak ditemukan.'); setLoading(false); return }
    sessionStorage.setItem('katresnan_user_order', orderId.trim())
    onLogin(orderId.trim())
  }

  return (
    <div className="dashboard-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--dark)', letterSpacing: '-0.03em' }}>
            <span style={{ color: 'var(--accent)' }}>✦</span> Katresnan<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Wedding Planner Dashboard</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <label className="label">Order ID</label>
          <input className="input" value={orderId} onChange={e => { setOrderId(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Masukkan Order ID" />
          {err && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 8 }}>{err}</p>}
          <button className="btn btn-primary" onClick={handleLogin} disabled={!orderId.trim() || loading}
            style={{ width: '100%', marginTop: 16, justifyContent: 'center', padding: '0.875rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [ucapanList, setUcapanList] = useState<Ucapan[]>([])
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [wishlists, setWishlists] = useState<WishlistItem[]>([])
  const [settings, setSettings] = useState<WeddingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [giftMenuOpen, setGiftMenuOpen] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }, [])

  useEffect(() => {
    const saved = sessionStorage.getItem('katresnan_user_order')
    if (saved) setOrderId(saved); else setLoading(false)
  }, [])

  const loadData = useCallback(async (oid: string) => {
    setLoading(true)
    const [wdRes, gRes, uRes, ciRes, wlRes, sRes] = await Promise.all([
      supabase.from('wedding_data').select('order_id, link_unik, pria_nama_panggilan, wanita_nama_panggilan').eq('order_id', oid).single(),
      supabase.from('guests').select('*').eq('order_id', oid).order('created_at', { ascending: false }),
      supabase.from('ucapan').select('*').eq('order_id', oid).order('created_at', { ascending: false }),
      supabase.from('checkins').select('*, guests(nama)').eq('order_id', oid).order('checked_in_at', { ascending: false }),
      supabase.from('wishlists').select('*').eq('order_id', oid).order('created_at', { ascending: false }),
      supabase.from('wedding_settings').select('*').eq('order_id', oid).single(),
    ])
    if (wdRes.data) setWedding(wdRes.data as WeddingData)
    if (gRes.data) setGuests(gRes.data as Guest[])
    if (uRes.data) setUcapanList(uRes.data as Ucapan[])
    if (ciRes.data) setCheckins(ciRes.data as CheckIn[])
    if (wlRes.data) setWishlists(wlRes.data as WishlistItem[])
    if (sRes.data) setSettings(sRes.data as WeddingSettings)
    else {
      const { data: ns } = await supabase.from('wedding_settings').insert({ order_id: oid }).select().single()
      if (ns) setSettings(ns as WeddingSettings)
    }
    setLoading(false)
  }, [])

  useEffect(() => { if (orderId) loadData(orderId) }, [orderId, loadData])

  function handleLogout() { sessionStorage.removeItem('katresnan_user_order'); setOrderId(null); setLoading(false) }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setSearchOpen(true),
    onEscape: () => { setSearchOpen(false); setSidebarOpen(false) }
  })

  if (!orderId && !loading) return <LoginScreen onLogin={oid => setOrderId(oid)} />

  const userName = wedding ? `${wedding.pria_nama_panggilan}` : '...'
  const initial = userName.charAt(0).toUpperCase()
  const greeting = getGreeting()

  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home-outline' },
    { id: 'theme', label: 'Atur Tema', icon: 'color-palette-outline' },
    { id: 'guests', label: 'Daftar Tamu', icon: 'people-outline', badge: guests.length },
    { id: 'checkin', label: 'Check-in QR', icon: 'qr-code-outline' },
    { id: 'ucapan', label: 'Ucapan Tamu', icon: 'chatbubble-outline', badge: ucapanList.length },
    { id: 'template_wa', label: 'Template WA', icon: 'chatbox-ellipses-outline' },
    { id: 'planner', label: 'Wedding Planner', icon: 'calendar-outline' },
    { id: 'nabung', label: 'Nabung Bareng', icon: 'wallet-outline' },
  ]

  const giftNav: NavItem[] = [
    { id: 'wishlist', label: 'Daftar Kado', icon: 'list-outline' },
    { id: 'rekening', label: 'Rekening Bank', icon: 'card-outline' },
    { id: 'alamat', label: 'Alamat Kirim', icon: 'location-outline' },
  ]

  const tabLabels: Record<TabId, string> = {
    dashboard: 'Overview Dashboard', theme: 'Atur Tema', guests: 'Daftar Tamu',
    checkin: 'Check-in QR', ucapan: 'Ucapan Tamu', template_wa: 'Template WA',
    planner: 'Wedding Planner', nabung: 'Nabung Bareng',
    wishlist: 'Daftar Kado', rekening: 'Rekening Bank', alamat: 'Alamat Kirim',
  }

  function NavBtn({ item }: { item: NavItem }) {
    return (
      <button className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
        onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}>
        <ion-icon name={item.icon}></ion-icon>
        <span>{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
      </button>
    )
  }

  return (
    <div className="dashboard-root">
      {toast && <div className="toast"><ion-icon name="checkmark-circle" style={{ fontSize: 18 }}></ion-icon>{toast}</div>}
      <ConfirmDialog />
      <ScrollToTop />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-dot">✦</span>
          <h1>Katresnan<span style={{ color: 'var(--accent)' }}>.</span></h1>
        </div>

        <div className="sidebar-user" onClick={() => {}}>
          <div className="sidebar-user-avatar">{initial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <span className="sidebar-user-plan">Premium</span>
          </div>
          <ion-icon name="chevron-forward-outline" style={{ fontSize: 14, color: 'var(--text-muted)' }}></ion-icon>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {mainNav.map(n => <NavBtn key={n.id} item={n} />)}

          {/* Atur Hadiah - collapsible */}
          <button className={`sidebar-nav-item`} onClick={() => setGiftMenuOpen(!giftMenuOpen)}
            style={{ marginTop: 4 }}>
            <ion-icon name="gift-outline"></ion-icon>
            <span>Atur Hadiah</span>
            <ion-icon name={giftMenuOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
              style={{ marginLeft: 'auto', fontSize: 14 }}></ion-icon>
          </button>
          {giftMenuOpen && (
            <div className="sidebar-submenu">
              {giftNav.map(n => <NavBtn key={n.id} item={n} />)}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            {/* Mobile search icon */}
            <button className="topbar-btn mobile-only-btn" onClick={() => setSearchOpen(true)} title="Search">
              <ion-icon name="search-outline" style={{ fontSize: 18 }}></ion-icon>
            </button>
            {/* Desktop search bar */}
            <div className="topbar-search desktop-search" onClick={() => setSearchOpen(true)} style={{ cursor: 'pointer' }}>
              <ion-icon name="search-outline"></ion-icon>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>Search for menu, features...</span>
              <kbd>⌘</kbd><kbd>K</kbd>
            </div>
          </div>
          <div className="topbar-greeting">
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{greeting},</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{userName}</span>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn" title="Tutorial">
              <ion-icon name="help-circle-outline" style={{ fontSize: 18 }}></ion-icon>
            </button>
            <button className="topbar-btn" title="Notifikasi" onClick={() => orderId && loadData(orderId)}>
              <ion-icon name="notifications-outline" style={{ fontSize: 18 }}></ion-icon>
              <span className="notif-dot"></span>
            </button>
          </div>
        </div>

        {/* Search Modal */}
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={(tab) => { setActiveTab(tab); setSidebarOpen(false) }} />

        <div className="dashboard-content">
          {loading ? (
            <div className="stats-grid">
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 96 }} />)}
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardOverview guests={guests} ucapan={ucapanList} checkins={checkins} wishlists={wishlists} wedding={wedding} />}
              {activeTab === 'guests' && <GuestManagement guests={guests} orderId={orderId!} wedding={wedding} showToast={showToast} onRefresh={() => loadData(orderId!)} />}
              {activeTab === 'checkin' && <CheckInScanner guests={guests} checkins={checkins} orderId={orderId!} showToast={showToast} onRefresh={() => loadData(orderId!)} />}
              {activeTab === 'ucapan' && <UcapanMessages ucapan={ucapanList} />}
              {activeTab === 'template_wa' && <SettingsPanel settings={settings} orderId={orderId!} showToast={showToast} onRefresh={() => loadData(orderId!)} initialSection="wa" />}
              {activeTab === 'planner' && <WeddingPlannerTab />}
              {activeTab === 'nabung' && <NabungBareng orderId={orderId!} showToast={showToast} settings={settings} onRefresh={() => loadData(orderId!)} />}
              {activeTab === 'wishlist' && <WishlistManager wishlists={wishlists} orderId={orderId!} showToast={showToast} onRefresh={() => loadData(orderId!)} />}
              {activeTab === 'rekening' && <SettingsPanel settings={settings} orderId={orderId!} showToast={showToast} onRefresh={() => loadData(orderId!)} initialSection="bank" />}
              {activeTab === 'alamat' && <SettingsPanel settings={settings} orderId={orderId!} showToast={showToast} onRefresh={() => loadData(orderId!)} initialSection="alamat" />}
              {activeTab === 'theme' && (
                <div className="card"><div className="empty-state">
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🎨</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Tema Undangan</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 320, margin: '0 auto 20px' }}>
                    Pilih tema undangan untuk memulai membuat website undangan pernikahan Anda dengan desain yang indah.
                  </p>
                  <button className="btn btn-primary">Pilih Tema Sekarang</button>
                </div></div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />


    </div>
  )
}

// TypeScript declarations for custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}
