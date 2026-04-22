'use client'
import type { Guest, Ucapan, CheckIn, WishlistItem, WeddingData } from '../page'

interface Props {
  guests: Guest[]; ucapan: Ucapan[]; checkins: CheckIn[]
  wishlists: WishlistItem[]; wedding: WeddingData | null
}

export default function DashboardOverview({ guests, ucapan, checkins, wishlists, wedding }: Props) {
  const hadir = guests.filter(g => g.status_kehadiran === 'hadir').length
  const tidakHadir = guests.filter(g => g.status_kehadiran === 'tidak_hadir').length
  const belum = guests.filter(g => !g.status_kehadiran || g.status_kehadiran === 'belum').length
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Overview Dashboard</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Statistik dan aktivitas undangan Anda
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          <ion-icon name="calendar-outline" style={{ fontSize: 16 }}></ion-icon>
          {today}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <StatCard label="Total Tamu" value={guests.length} icon="people-outline" />
        <StatCard label="Hadir" value={hadir} icon="checkmark-circle-outline" />
        <StatCard label="Tidak Hadir" value={tidakHadir} icon="close-circle-outline" />
        <StatCard label="Belum Konfirmasi" value={belum} icon="help-circle-outline" />
      </div>

      {/* Theme Banner */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ion-icon name="globe-outline" style={{ fontSize: 20, color: 'var(--text-muted)' }}></ion-icon>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Tema belum dipilih</span>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
              Pilih tema undangan dan lengkapi data untuk mengaktifkan website undangan Anda.
            </p>
          </div>
        </div>
        <button className="btn btn-primary btn-sm">Atur Tema</button>
      </div>

      {/* Three column grid */}
      <div className="overview-grid" style={{ marginBottom: 20 }}>
        {/* Activity Feed */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="pulse-outline" style={{ fontSize: 16 }}></ion-icon>
              Activity Feed
            </span>
            <button className="btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent)' }}>
              Lihat Semua →
            </button>
          </div>
          <div className="card-body">
            {guests.length === 0 ? (
              <EmptyMini icon="pulse-outline" title="Belum Ada Aktivitas" desc="Aktivitas tamu akan muncul di sini." />
            ) : (
              guests.slice(0, 5).map((g, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-dot" style={{ background: '#10B981' }}></div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{g.nama}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(g.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Konfirmasi */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="pie-chart-outline" style={{ fontSize: 16 }}></ion-icon>
              Status Konfirmasi
            </span>
          </div>
          <div className="card-body">
            {guests.length === 0 ? (
              <EmptyMini icon="time-outline" title="Belum Ada Data" desc="Data konfirmasi tamu akan muncul setelah tamu mengkonfirmasi kehadiran mereka." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <StatusRow label="Hadir" value={hadir} total={guests.length} color="#10B981" />
                <StatusRow label="Tidak Hadir" value={tidakHadir} total={guests.length} color="#EF4444" />
                <StatusRow label="Belum Konfirmasi" value={belum} total={guests.length} color="#9CA3AF" />
              </div>
            )}
          </div>
        </div>

        {/* Check-in Terbaru */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="time-outline" style={{ fontSize: 16 }}></ion-icon>
              Check-in Terbaru
            </span>
            <button className="btn-ghost btn-sm" style={{ fontSize: 12, color: 'var(--accent)' }}>
              Lihat Semua →
            </button>
          </div>
          <div className="card-body">
            {checkins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <EmptyMini icon="time-outline" title="Belum Ada Aktivitas" desc="Aktivitas check-in tamu akan muncul di sini. Mulai scan QR code untuk check-in tamu." />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                  Buka QR Scanner
                </button>
              </div>
            ) : (
              checkins.slice(0, 5).map((ci, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-dot" style={{ background: '#3B82F6' }}></div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{(ci as any).guests?.nama || '...'}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(ci.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="overview-grid">
        {/* Kategori Tamu */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="list-outline" style={{ fontSize: 16 }}></ion-icon>
              Kategori Tamu
            </span>
          </div>
          <div className="card-body">
            {guests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <EmptyMini icon="people-outline" title="Belum Ada Kategori" desc="Kategori tamu akan muncul setelah Anda menambahkan tamu dengan kategori tertentu." />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Tambah Tamu</button>
              </div>
            ) : (
              Object.entries(guests.reduce((acc, g) => { acc[g.kategori || 'Umum'] = (acc[g.kategori || 'Umum'] || 0) + 1; return acc }, {} as Record<string, number>))
                .map(([cat, count], i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-dot" style={{ background: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5] }}></div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{cat}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{count}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Wishlist Populer */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="gift-outline" style={{ fontSize: 16 }}></ion-icon>
              Wishlist Populer
            </span>
          </div>
          <div className="card-body">
            {wishlists.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <EmptyMini icon="gift-outline" title="Belum Ada Wishlist Tersokong" desc="Wishlist populer akan muncul di sini setelah tamu mulai memberikan kontribusi pada kado." />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Kelola Kado</button>
              </div>
            ) : (
              wishlists.slice(0, 3).map((w, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-dot" style={{ background: '#F59E0B' }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{w.nama_barang}</p>
                    <div className="progress-track" style={{ marginTop: 4 }}>
                      <div className="progress-fill progress-green" style={{ width: `${Math.min(100, (w.terkumpul / w.target_dana) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ucapan Terbaru */}
        <div className="card">
          <div className="card-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 14 }}>
              <ion-icon name="chatbubble-outline" style={{ fontSize: 16 }}></ion-icon>
              Ucapan Terbaru
            </span>
          </div>
          <div className="card-body">
            {ucapan.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <EmptyMini icon="chatbubble-outline" title="Belum Ada Ucapan" desc="Ucapan dari tamu akan muncul di sini setelah mereka mengirim ucapan melalui website undangan." />
                <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Lihat Semua Ucapan</button>
              </div>
            ) : (
              ucapan.slice(0, 3).map((u, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-dot" style={{ background: '#8B5CF6' }}></div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{u.nama}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{u.ucapan.slice(0, 60)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon"><ion-icon name={icon}></ion-icon></div>
    </div>
  )
}

function StatusRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }}></div>
      </div>
    </div>
  )
}

function EmptyMini({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <ion-icon name={icon} style={{ fontSize: 24, color: 'var(--text-muted)' }}></ion-icon>
      </div>
      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}
