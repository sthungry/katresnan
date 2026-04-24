'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseAuth, canAccessFeature, getMinPlanForFeature, getPlanLabel, getPlanEmoji, type FeatureId, type UserPlan } from '@/lib/supabaseAuth'
import { useAuth } from '@/components/AuthProvider'
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
import ThemeSetup from './components/ThemeSetup'
import AccountSettings from './components/AccountSettings'
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
  planner_checklist?: any[]; planner_engagement?: any[]; planner_prewedding?: any[]
  planner_administrasi?: any[]; planner_vendor?: any[]; planner_seserahan?: any[]
  planner_budget?: any[]; planner_agenda?: any[]
}
export interface WeddingData {
  order_id: string; link_unik: string
  pria_nama_panggilan: string; wanita_nama_panggilan: string
}

type TabId = 'dashboard' | 'theme' | 'guests' | 'checkin' | 'ucapan' | 'template_wa' | 'planner' | 'nabung' | 'wishlist' | 'rekening' | 'alamat' | 'settings'

interface NavItem { id: TabId; label: string; icon: string; badge?: number }

// ─── Locked Feature Card ────────────────────────────────────────────────────
function LockedFeature({ feature, userPlan }: { feature: FeatureId; userPlan: UserPlan }) {
  const minPlan = getMinPlanForFeature(feature)
  const label = getPlanLabel(minPlan)
  const emoji = getPlanEmoji(minPlan)

  return (
    <div className="card">
      <div className="empty-state">
        <div style={{ fontSize: 64, marginBottom: 16, filter: 'grayscale(0.5)' }}>🔒</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Fitur {label}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
          Fitur ini tersedia untuk paket <strong>{emoji} {label}</strong> ke atas.
          {userPlan === 'free'
            ? ' Pilih paket di tab "Atur Tema" untuk membuka semua fitur.'
            : ' Upgrade paket kamu untuk mengakses fitur ini.'}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            // Scroll to theme tab (or navigate)
            const evt = new CustomEvent('switchTab', { detail: 'theme' })
            window.dispatchEvent(evt)
          }}
        >
          {userPlan === 'free' ? '🎨 Pilih Paket Sekarang' : '⬆️ Upgrade Paket'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function UserDashboard() {
  const router = useRouter()
  const { user, profile, loading: authLoading, plan, signOut: handleSignOut, refreshProfile } = useAuth()

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

  // Listen for tab switch events (from LockedFeature)
  useEffect(() => {
    function handleSwitchTab(e: any) { setActiveTab(e.detail) }
    window.addEventListener('switchTab', handleSwitchTab)
    return () => window.removeEventListener('switchTab', handleSwitchTab)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  // The orderId to use for data queries — from profile or legacy
  const orderId = profile?.order_id || null

  const loadData = useCallback(async (uid: string) => {
    setLoading(true)

    // Try to load by user_id first, fall back to order_id
    const [wdRes, gRes, uRes, ciRes, wlRes, sRes] = await Promise.all([
      supabaseAuth.from('wedding_data').select('order_id, link_unik, pria_nama_panggilan, wanita_nama_panggilan').eq('user_id', uid).single(),
      supabaseAuth.from('guests').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabaseAuth.from('ucapan').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabaseAuth.from('checkins').select('*, guests(nama)').eq('user_id', uid).order('checked_in_at', { ascending: false }),
      supabaseAuth.from('wishlists').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabaseAuth.from('wedding_settings').select('*').eq('user_id', uid).single(),
    ])

    if (wdRes.data) setWedding(wdRes.data as WeddingData)
    if (gRes.data) setGuests(gRes.data as Guest[])
    if (uRes.data) setUcapanList(uRes.data as Ucapan[])
    if (ciRes.data) setCheckins(ciRes.data as CheckIn[])
    if (wlRes.data) setWishlists(wlRes.data as WishlistItem[])
    if (sRes.data) setSettings(sRes.data as WeddingSettings)
    else {
      // Auto-create wedding settings for new users
      const { data: ns } = await supabaseAuth.from('wedding_settings')
        .insert({ order_id: crypto.randomUUID(), user_id: uid })
        .select().single()
      if (ns) setSettings(ns as WeddingSettings)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) loadData(user.id)
  }, [user, loadData])

  function handleLogout() {
    handleSignOut()
    router.push('/auth/login')
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setSearchOpen(true),
    onEscape: () => { setSearchOpen(false); setSidebarOpen(false) }
  })

  // Still loading auth
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="dashboard-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 2s ease-in-out infinite' }}>✦</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const userName = profile?.nama || wedding?.pria_nama_panggilan || user?.email?.split('@')[0] || '...'
  const initial = userName.charAt(0).toUpperCase()
  const greeting = getGreeting()
  const planLabel = `${getPlanEmoji(plan)} ${getPlanLabel(plan)}`

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

  // Check if a nav item is locked
  function isLocked(tabId: TabId): boolean {
    return !canAccessFeature(plan, tabId as FeatureId)
  }

  function NavBtn({ item }: { item: NavItem }) {
    const locked = isLocked(item.id)
    return (
      <button className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
        onClick={() => { setActiveTab(item.id); setSidebarOpen(false) }}
        style={locked ? { opacity: 0.5 } : undefined}
      >
        <ion-icon name={item.icon}></ion-icon>
        <span>{item.label}</span>
        {locked && <span style={{ marginLeft: 'auto', fontSize: 10 }}>🔒</span>}
        {!locked && item.badge !== undefined && item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
      </button>
    )
  }

  // Render tab content with feature gating
  function renderTab() {
    // Free tabs — always accessible
    if (activeTab === 'dashboard') {
      return <DashboardOverview guests={guests} ucapan={ucapanList} checkins={checkins} wishlists={wishlists} wedding={wedding} />
    }
    if (activeTab === 'theme') {
      const oid = orderId || settings?.order_id || ''
      return <ThemeSetup profile={profile!} orderId={oid} onProfileUpdate={refreshProfile} />
    }
    if (activeTab === 'settings') {
      return <AccountSettings user={user} profile={profile} plan={plan} onRefreshProfile={refreshProfile} onSignOut={handleSignOut} showToast={showToast} />
    }

    // Gated tabs
    const featureId = activeTab as FeatureId
    if (!canAccessFeature(plan, featureId)) {
      return <LockedFeature feature={featureId} userPlan={plan} />
    }

    // The orderId for components that need it
    const oid = orderId || settings?.order_id || ''

    switch (activeTab) {
      case 'guests':
        return <GuestManagement guests={guests} orderId={oid} wedding={wedding} showToast={showToast} onRefresh={() => loadData(user!.id)} />
      case 'checkin':
        return <CheckInScanner guests={guests} checkins={checkins} orderId={oid} showToast={showToast} onRefresh={() => loadData(user!.id)} />
      case 'ucapan':
        return <UcapanMessages ucapan={ucapanList} />
      case 'template_wa':
        return <SettingsPanel settings={settings} orderId={oid} showToast={showToast} onRefresh={() => loadData(user!.id)} initialSection="wa" />
      case 'planner':
        return <WeddingPlannerTab orderId={oid} showToast={showToast} settings={settings} onRefresh={() => loadData(user!.id)} />
      case 'nabung':
        return <NabungBareng orderId={oid} showToast={showToast} settings={settings} onRefresh={() => loadData(user!.id)} />
      case 'wishlist':
        return <WishlistManager wishlists={wishlists} orderId={oid} showToast={showToast} onRefresh={() => loadData(user!.id)} />
      case 'rekening':
        return <SettingsPanel settings={settings} orderId={oid} showToast={showToast} onRefresh={() => loadData(user!.id)} initialSection="bank" />
      case 'alamat':
        return <SettingsPanel settings={settings} orderId={oid} showToast={showToast} onRefresh={() => loadData(user!.id)} initialSection="alamat" />
      default:
        return null
    }
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

        <div className="sidebar-user" onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }} style={{ cursor: 'pointer' }}>
          <div className="sidebar-user-avatar">{initial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <span className="sidebar-user-plan">{planLabel}</span>
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
            <button className="topbar-btn" title="Notifikasi" onClick={() => user && loadData(user.id)}>
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
          ) : renderTab()}
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
