'use client'
import { useState } from 'react'
import type { Ucapan } from '../page'

interface Props { ucapan: Ucapan[] }

export default function UcapanMessages({ ucapan }: Props) {
  const [search, setSearch] = useState('')

  const filtered = ucapan.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.ucapan.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Ucapan Tamu</h2>
        <div className="topbar-search" style={{ maxWidth: 200 }}>
          <ion-icon name="search-outline"></ion-icon>
          <input placeholder="Cari ucapan..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>💌</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Ucapan Masuk</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Ucapan dan doa dari tamu undangan akan muncul di sini. Bagikan link undangan Anda untuk mulai menerima ucapan yang penuh makna.
            </p>
          </div>
          <div style={{ padding: '0 1.25rem 1.25rem' }}>
            <div className="tips-card">
              <ion-icon name="bulb-outline"></ion-icon>
              <p><strong>Tips:</strong> Semakin banyak tamu yang mengakses undangan digital Anda, semakin banyak ucapan indah yang akan terkumpul di sini.</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(u => {
            const statusMap: Record<string, { label: string; cls: string }> = {
              hadir: { label: 'Hadir', cls: 'chip-hadir' },
              tidak: { label: 'Tidak Hadir', cls: 'chip-tidak' },
              ragu: { label: 'Ragu-ragu', cls: 'chip-ragu' },
            }
            const s = statusMap[u.hadir] || { label: u.hadir, cls: 'chip-belum' }
            return (
              <div className="ucapan-card" key={u.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)' }}>
                      {u.nama.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{u.nama}</span>
                  </div>
                  <span className={`chip ${s.cls}`}>{s.label}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{u.ucapan}</p>
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
