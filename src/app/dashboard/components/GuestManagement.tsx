'use client'
import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import type { Guest, WeddingData } from '../page'
import { showConfirm } from './DashboardEnhancements'

interface Props {
  guests: Guest[]; orderId: string; wedding: WeddingData | null
  showToast: (msg: string) => void; onRefresh: () => void
}

export default function GuestManagement({ guests, orderId, wedding, showToast, onRefresh }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editGuest, setEditGuest] = useState<Guest | null>(null)
  const [form, setForm] = useState({ nama: '', telepon: '', email: '', jumlah_tamu: 1, kategori: 'Umum' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target?.result
        const wb = XLSX.read(buffer, { type: 'array' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json<any>(ws)

        const guestsToInsert = data.map((row: any) => {
          // Normalize: grab the first key that matches (handles header variations)
          const nama  = String(row['Nama'] || '').trim()
          const telp  = String(row['No. WA / Link Grup'] || row['No WA'] || row['No. WA'] || '').trim()
          const email = String(row['Email'] || row['email'] || '').trim()
          const tipe  = String(row['Tipe'] || '').trim()
          const pax   = parseInt(row['Jumlah Pax']) || 1
          const kat   = String(row['Kategori'] || 'Umum').trim() || 'Umum'

          return {
            order_id: orderId,
            nama,
            telepon: telp,
            email,
            jumlah_tamu: pax,
            kategori: kat,
            catatan: tipe ? `Tipe: ${tipe}` : '',
          }
        }).filter((g: any) => g.nama !== '')

        if (guestsToInsert.length === 0) {
          showToast('Tidak ada data tamu valid di Excel')
          return
        }

        const { error } = await supabase.from('guests').insert(guestsToInsert)
        if (error) {
          showToast('Gagal import tamu dari Excel')
          console.error(error)
        } else {
          showToast(`${guestsToInsert.length} Tamu berhasil diimport`)
          onRefresh()
        }
      } catch (err) {
        console.error(err)
        showToast('Gagal membaca file Excel')
      }
    }
    reader.readAsArrayBuffer(file)
    
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const statusFilters = [
    { id: 'all', label: 'Semua', count: guests.length },
    { id: 'hadir_offline', label: 'Hadir Offline', count: guests.filter(g => g.status_kehadiran === 'hadir').length },
    { id: 'hadir_online', label: 'Hadir Online', count: guests.filter(g => g.status_kehadiran === 'online').length },
    { id: 'tidak_hadir', label: 'Tidak Hadir', count: guests.filter(g => g.status_kehadiran === 'tidak_hadir').length },
    { id: 'belum', label: 'Belum Konfirmasi', count: guests.filter(g => !g.status_kehadiran || g.status_kehadiran === 'belum').length },
  ]

  const filteredGuests = guests.filter(g => {
    const matchSearch = g.nama.toLowerCase().includes(search.toLowerCase())
    if (filter === 'all') return matchSearch
    if (filter === 'belum') return matchSearch && (!g.status_kehadiran || g.status_kehadiran === 'belum')
    if (filter === 'hadir_offline') return matchSearch && g.status_kehadiran === 'hadir'
    if (filter === 'hadir_online') return matchSearch && g.status_kehadiran === 'online'
    if (filter === 'tidak_hadir') return matchSearch && g.status_kehadiran === 'tidak_hadir'
    return matchSearch
  })

  async function handleSave() {
    if (!form.nama.trim()) { showToast('Nama tamu wajib diisi'); return }
    if (editGuest) {
      const { error } = await supabase.from('guests').update({
        nama: form.nama, telepon: form.telepon, email: form.email,
        jumlah_tamu: form.jumlah_tamu, kategori: form.kategori,
      }).eq('id', editGuest.id)
      if (error) showToast('Gagal update tamu')
      else { showToast('Data tamu diperbarui'); setShowForm(false); setEditGuest(null); onRefresh() }
    } else {
      const { error } = await supabase.from('guests').insert({
        nama: form.nama, telepon: form.telepon, email: form.email,
        jumlah_tamu: form.jumlah_tamu, kategori: form.kategori, order_id: orderId,
      })
      if (error) showToast('Gagal menambah tamu')
      else { showToast('Tamu berhasil ditambahkan'); setShowForm(false); onRefresh() }
    }
    setForm({ nama: '', telepon: '', email: '', jumlah_tamu: 1, kategori: 'Umum' })
  }

  async function handleDelete(id: string) {
    const confirmed = await showConfirm({
      title: 'Hapus Tamu?',
      message: 'Data tamu yang dihapus tidak bisa dikembalikan. Apakah Anda yakin ingin melanjutkan?',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger'
    })
    if (!confirmed) return
    const { error } = await supabase.from('guests').delete().eq('id', id)
    if (error) showToast('Gagal hapus tamu')
    else { showToast('Tamu dihapus'); onRefresh() }
  }

  function sendWA(guest: Guest) {
    let phone = guest.telepon.replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '62' + phone.substring(1)
    else if (!phone.startsWith('62')) phone = '62' + phone
    const link = guest.link_undangan || `https://katresnan.com/${wedding?.link_unik}?to=${encodeURIComponent(guest.nama)}`
    const msg = `Assalamualaikum ${guest.nama},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan: ${link}\n\nTerima kasih 🙏`
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank')
  }

  function openEdit(g: Guest) {
    setEditGuest(g)
    setForm({ nama: g.nama, telepon: g.telepon, email: g.email, jumlah_tamu: g.jumlah_tamu, kategori: g.kategori })
    setShowForm(true)
  }

  function getStatusChip(status: string) {
    const map: Record<string, { label: string; cls: string }> = {
      hadir: { label: 'Hadir', cls: 'chip-hadir' },
      online: { label: 'Online', cls: 'chip-terkirim' },
      tidak_hadir: { label: 'Tidak Hadir', cls: 'chip-tidak' },
      ragu: { label: 'Ragu', cls: 'chip-ragu' },
    }
    const s = map[status] || { label: 'Belum', cls: 'chip-belum' }
    return <span className={`chip ${s.cls}`}>{s.label}</span>
  }

  const [drawerTab, setDrawerTab] = useState<'manual' | 'excel'>('manual')
  const [tipeTamu, setTipeTamu] = useState<'personal' | 'grup'>('personal')

  function closeDrawer() { setShowForm(false); setEditGuest(null); setDrawerTab('manual'); setTipeTamu('personal') }
  function openAdd() { setEditGuest(null); setForm({ nama: '', telepon: '', email: '', jumlah_tamu: 1, kategori: 'Umum' }); setTipeTamu('personal'); setDrawerTab('manual'); setShowForm(true) }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Daftar Tamu</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={openAdd}>
            <ion-icon name="add-outline"></ion-icon> Tambah Tamu
          </button>
          <button className="btn btn-danger">
            <ion-icon name="send-outline"></ion-icon> Kirim Undangan
          </button>
        </div>
      </div>
      <input type="file" accept=".xlsx, .xls" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportExcel} />

      {/* Guest Limit */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ion-icon name="sparkles-outline" style={{ fontSize: 14 }}></ion-icon>
            Kuota Tamu
          </span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{guests.length}/50</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill progress-blue" style={{ width: `${Math.min(100, (guests.length / 50) * 100)}%` }}></div>
        </div>
      </div>

      {/* Search */}
      <div className="topbar-search" style={{ maxWidth: '100%', marginBottom: 16 }}>
        <ion-icon name="search-outline"></ion-icon>
        <input placeholder="Cari nama tamu..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div className="filter-group">
          {statusFilters.map(sf => (
            <button key={sf.id} className={`filter-btn ${filter === sf.id ? 'active' : ''}`}
              onClick={() => setFilter(sf.id)}>
              {sf.label} <span className="count">{sf.count}</span>
            </button>
          ))}
        </div>
        <select className="input" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem' }}>
          <option>Semua Kategori</option>
          <option>Keluarga</option><option>Teman</option><option>Rekan Kerja</option><option>Umum</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama &amp; Link</th>
                <th>Status</th>
                <th>Kategori</th>
                <th>Jumlah Tamu</th>
                <th>WA Terkirim</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Tamu Terdaftar</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto 20px' }}>
                        Daftar tamu Anda masih kosong. Mulai tambahkan tamu undangan untuk melihat data di sini.
                      </p>
                      <button className="btn btn-primary" onClick={openAdd}>
                        Tambah Tamu Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGuests.map(g => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{g.nama}</div>
                      {g.link_undangan && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{g.link_undangan.slice(0, 40)}...</div>}
                    </td>
                    <td>{getStatusChip(g.status_kehadiran)}</td>
                    <td><span style={{ fontSize: 13 }}>{g.kategori || 'Umum'}</span></td>
                    <td><span style={{ fontSize: 14, fontWeight: 600 }}>{g.jumlah_tamu}</span></td>
                    <td>{g.status_undangan === 'terkirim' ? <span className="chip chip-terkirim">Terkirim</span> : <span className="chip chip-belum">Belum</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" onClick={() => sendWA(g)} title="Kirim WA">
                          <ion-icon name="logo-whatsapp" style={{ color: '#25D366' }}></ion-icon>
                        </button>
                        <button className="btn-icon" onClick={() => openEdit(g)} title="Edit">
                          <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button className="btn-icon" onClick={() => handleDelete(g.id)} title="Hapus">
                          <ion-icon name="trash-outline" style={{ color: 'var(--danger)' }}></ion-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Drawer Panel ─── */}
      {showForm && (
        <>
          <div className="drawer-backdrop" onClick={closeDrawer} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <h3>{editGuest ? 'Edit' : 'Tambah'} Tamu</h3>
              <button className="btn-icon" onClick={closeDrawer}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>

            <div className="drawer-body">
              {/* Tab Switcher */}
              {!editGuest && (
                <div className="drawer-tabs">
                  <button className={`drawer-tab ${drawerTab === 'manual' ? 'active' : ''}`} onClick={() => setDrawerTab('manual')}>Input Manual</button>
                  <button className={`drawer-tab ${drawerTab === 'excel' ? 'active' : ''}`} onClick={() => setDrawerTab('excel')}>Impor Excel</button>
                </div>
              )}

              {/* ── TAB: Manual ── */}
              {drawerTab === 'manual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Tipe Tamu */}
                  <div>
                    <label className="label">Tipe Tamu <span className="label-required">*</span></label>
                    <div className="radio-card-group">
                      <div className={`radio-card ${tipeTamu === 'personal' ? 'selected' : ''}`} onClick={() => { setTipeTamu('personal'); setForm({ ...form, jumlah_tamu: 1 }) }}>
                        <div className="radio-dot"><div className="radio-dot-inner" /></div>
                        <ion-icon name="person-outline"></ion-icon>
                        <span>Personal (1 Pax)</span>
                      </div>
                      <div className={`radio-card ${tipeTamu === 'grup' ? 'selected' : ''}`} onClick={() => setTipeTamu('grup')}>
                        <div className="radio-dot"><div className="radio-dot-inner" /></div>
                        <ion-icon name="people-outline"></ion-icon>
                        <span>Grup / Keluarga</span>
                      </div>
                    </div>
                  </div>

                  {/* Nama */}
                  <div>
                    <label className="label">Nama Tamu <span className="label-required">*</span></label>
                    <input className="input" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Budi Santoso" />
                    <p className="helper-text">Nama lengkap tamu yang akan diundang</p>
                  </div>

                  {/* Batas Pax (only for grup) */}
                  {tipeTamu === 'grup' && (
                    <div>
                      <label className="label">Batas Maksimal Pax <span className="label-required">*</span></label>
                      <input className="input" type="number" min={1} value={form.jumlah_tamu} onChange={e => setForm({ ...form, jumlah_tamu: parseInt(e.target.value) || 1 })} />
                      <p className="helper-text">Berapa maksimal kuota orang yang diperbolehkan untuk grup ini?</p>
                    </div>
                  )}

                  {/* No WA / Link Grup WA */}
                  {tipeTamu === 'personal' ? (
                    <div>
                      <label className="label">No WA <span className="label-required">*</span></label>
                      <input className="input" value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} placeholder="081234567890" />
                      <p className="helper-text">Nomor WhatsApp tamu untuk pengiriman undangan</p>
                    </div>
                  ) : (
                    <div>
                      <label className="label">Link Grup WhatsApp <span className="label-required">*</span></label>
                      <input className="input" value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} placeholder="https://chat.whatsapp.com/xxx" />
                      <p className="helper-text">Masukkan link invite grup untuk proses pengiriman WA secara instan.</p>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="label">Email</label>
                    <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" />
                    <p className="helper-text">Opsional, untuk pengiriman undangan via email</p>
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="label">Kategori <span className="label-required">*</span></label>
                    <select className="input" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}>
                      <option>Keluarga</option><option>Teman</option><option>Rekan Kerja</option><option>Tetangga</option><option>Umum</option>
                    </select>
                    <p className="helper-text">Kelompokkan tamu untuk memudahkan filter dan pengiriman undangan</p>
                  </div>
                </div>
              )}

              {/* ── TAB: Import Excel ── */}
              {drawerTab === 'excel' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <ion-icon name="cloud-upload-outline"></ion-icon>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Klik untuk upload file Excel</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Format: .xlsx atau .xls</p>
                  </div>

                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius)', padding: '0.875rem 1rem' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ion-icon name="information-circle-outline"></ion-icon> Panduan Import
                    </p>
                    <ol style={{ fontSize: 12, color: '#166534', paddingLeft: 16, margin: 0, lineHeight: 1.8 }}>
                      <li>Download template Excel terlebih dahulu</li>
                      <li>Isi data tamu sesuai kolom yang tersedia</li>
                      <li>Upload file yang sudah diisi</li>
                    </ol>
                  </div>

                  <a href="/templates/guest/Template_Tamu.xlsx" download className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                    <ion-icon name="download-outline"></ion-icon> Download Template Excel
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            {drawerTab === 'manual' && (
              <div className="drawer-footer">
                <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}>
                  {editGuest ? 'Simpan Perubahan' : 'Simpan'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
