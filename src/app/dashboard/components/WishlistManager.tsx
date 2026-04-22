'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { WishlistItem } from '../page'

interface Props {
  wishlists: WishlistItem[]; orderId: string
  showToast: (msg: string) => void; onRefresh: () => void
}

export default function WishlistManager({ wishlists, orderId, showToast, onRefresh }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<WishlistItem | null>(null)
  const [form, setForm] = useState({ nama_barang: '', deskripsi: '', target_dana: 0, link_produk: '', prioritas: 1, status: 'aktif', gambar_url: '' })
  const [uploading, setUploading] = useState(false)
  const [activeKontribusi, setActiveKontribusi] = useState<WishlistItem | null>(null)

  const totalWishlist = wishlists.length
  const totalFunded = wishlists.reduce((acc, w) => acc + w.terkumpul, 0)
  const totalContributors = new Set(wishlists.map(w => w.id)).size
  const achieved = wishlists.filter(w => w.terkumpul >= w.target_dana).length

  const filters = [
    { id: 'all', label: 'Semua', count: wishlists.length },
    { id: 'aktif', label: 'Aktif', count: wishlists.filter(w => w.terkumpul < w.target_dana).length },
    { id: 'tercapai', label: 'Tercapai', count: achieved },
    { id: 'dijeda', label: 'Dijeda', count: wishlists.filter(w => w.status === 'dijeda').length },
  ]

  const filteredWishlists = wishlists.filter(w => {
    const matchSearch = w.nama_barang.toLowerCase().includes(search.toLowerCase())
    if (filter === 'aktif') return matchSearch && w.terkumpul < w.target_dana
    if (filter === 'tercapai') return matchSearch && w.terkumpul >= w.target_dana
    if (filter === 'dijeda') return matchSearch && w.status === 'dijeda'
    return matchSearch
  })

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `wishlist-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('wedding-photos').upload(fileName, file)
    if (error) {
      showToast('Gagal upload gambar')
    } else {
      const { data: { publicUrl } } = supabase.storage.from('wedding-photos').getPublicUrl(data.path)
      setForm({ ...form, gambar_url: publicUrl })
    }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.nama_barang.trim()) { showToast('Nama kado wajib diisi'); return }
    if (editItem) {
      const { error } = await supabase.from('wishlists').update(form).eq('id', editItem.id)
      if (error) showToast('Gagal update'); else { showToast('Wishlist diperbarui'); setShowForm(false); setEditItem(null); onRefresh() }
    } else {
      const { error } = await supabase.from('wishlists').insert({ ...form, order_id: orderId })
      if (error) showToast('Gagal menambah'); else { showToast('Wishlist ditambahkan'); setShowForm(false); onRefresh() }
    }
    setForm({ nama_barang: '', deskripsi: '', target_dana: 0, link_produk: '', prioritas: 1, status: 'aktif', gambar_url: '' })
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus wishlist ini?')) return
    const { error } = await supabase.from('wishlists').delete().eq('id', id)
    if (error) showToast('Gagal hapus'); else { showToast('Wishlist dihapus'); onRefresh() }
  }

  function formatRp(n: number) { return 'Rp ' + n.toLocaleString('id-ID') }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Daftar Kado</h2>
        <button className="btn btn-primary" onClick={() => { setEditItem(null); setForm({ nama_barang: '', deskripsi: '', target_dana: 0, link_produk: '', prioritas: 1, status: 'aktif', gambar_url: '' }); setShowForm(true) }}>
          <ion-icon name="add-outline"></ion-icon> Tambah Kado
        </button>
      </div>

      {/* Limit */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ion-icon name="gift-outline" style={{ fontSize: 14 }}></ion-icon>
            Daftar Kado
          </span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{totalWishlist}/1</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill progress-blue" style={{ width: `${Math.min(100, (totalWishlist / 1) * 100)}%` }}></div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div><div className="stat-label">Total Wishlist</div><div className="stat-value">{totalWishlist}</div></div>
          <div className="stat-icon"><ion-icon name="gift-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Dana Terkumpul</div><div className="stat-value">{formatRp(totalFunded)}</div></div>
          <div className="stat-icon"><ion-icon name="wallet-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Total Kontributor</div><div className="stat-value">{totalContributors}</div></div>
          <div className="stat-icon"><ion-icon name="people-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Tercapai</div><div className="stat-value">{achieved}</div></div>
          <div className="stat-icon"><ion-icon name="checkmark-circle-outline"></ion-icon></div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div className="topbar-search" style={{ maxWidth: 240 }}>
          <ion-icon name="search-outline"></ion-icon>
          <input placeholder="Cari kado..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          {filters.map(f => (
            <button key={f.id} className={`filter-btn ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label} <span className="count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredWishlists.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎁</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Wishlist Kado</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Buat wishlist kado pertama Anda dan biarkan tamu berkontribusi untuk mewujudkan impian pernikahan Anda.
            </p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Buat Wishlist Pertama
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredWishlists.map(w => {
            const pct = w.target_dana > 0 ? Math.min(100, Math.round((w.terkumpul / w.target_dana) * 100 * 10) / 10) : 0
            const bgImage = w.gambar_url ? `url(${w.gambar_url})` : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
            return (
              <div className="card" key={w.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: 180, background: bgImage, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!w.gambar_url && <ion-icon name="image-outline" style={{ fontSize: 48, color: '#9CA3AF' }}></ion-icon>}
                  {w.status === 'aktif' && <span style={{ position: 'absolute', top: 12, right: 12, background: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Aktif</span>}
                  {w.status === 'dijeda' && <span style={{ position: 'absolute', top: 12, right: 12, background: '#FEF2F2', color: '#DC2626', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Dijeda</span>}
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontWeight: 700, fontSize: 16 }}>{w.nama_barang}</h4>
                    {w.deskripsi && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{w.deskripsi}</p>}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                    <span style={{ fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div className="progress-track" style={{ marginBottom: 12 }}>
                    <div className="progress-fill progress-blue" style={{ width: `${pct}%` }}></div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Terkumpul: <span style={{ color: '#10B981', fontWeight: 600 }}>{formatRp(w.terkumpul)}</span></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Target: <span style={{ fontWeight: 600 }}>{formatRp(w.target_dana)}</span></span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 16 }}>
                    <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><ion-icon name="people-outline"></ion-icon> 0 kontributor</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Sisa: {formatRp(Math.max(0, w.target_dana - w.terkumpul))}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => handleDelete(w.id)} style={{ background: '#EF4444', color: '#fff', padding: '0 12px', borderRadius: 8 }}>
                      <ion-icon name="trash-outline"></ion-icon>
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveKontribusi(w)} style={{ flex: 1, justifyContent: 'center', borderRadius: 8, fontWeight: 600 }}>
                      <ion-icon name="list-outline"></ion-icon> Kontribusi
                    </button>
                    <button className="btn btn-primary" onClick={() => { setEditItem(w); setForm({ nama_barang: w.nama_barang, deskripsi: w.deskripsi, target_dana: w.target_dana, link_produk: w.link_produk, prioritas: w.prioritas, status: w.status, gambar_url: w.gambar_url || '' }); setShowForm(true) }} style={{ flex: 1, justifyContent: 'center', borderRadius: 8, background: 'var(--dark)', fontWeight: 600 }}>
                      <ion-icon name="create-outline"></ion-icon> Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Drawer */}
      {showForm && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editItem ? 'Edit' : 'Tambah'} Wishlist Kado</h3>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Image Upload Placeholder */}
              <label style={{ cursor: 'pointer', display: 'block' }}>
                <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                <div style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: form.gambar_url ? '0' : '2rem 1rem', textAlign: 'center', background: '#F9FAFB', overflow: 'hidden', position: 'relative' }}>
                  {uploading ? (
                    <div style={{ padding: '2rem' }}><p>Mengunggah...</p></div>
                  ) : form.gambar_url ? (
                    <img src={form.gambar_url} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <>
                      <ion-icon name="image-outline" style={{ fontSize: 32, color: '#9CA3AF', marginBottom: 12 }}></ion-icon>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                        <div className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13, background: '#fff' }}>
                          <ion-icon name="camera-outline"></ion-icon> Upload Foto
                        </div>
                      </div>
                      <p style={{ fontSize: 11, color: '#6B7280' }}>JPG, PNG, atau GIF (Otomatis Dikompres)</p>
                    </>
                  )}
                </div>
              </label>

              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Nama Kado</label>
                <input className="input" value={form.nama_barang} onChange={e => setForm({ ...form, nama_barang: e.target.value })} placeholder="Contoh: Rice Cooker Digital" />
              </div>
              
              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Harga Target</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: 16, color: '#6B7280', fontWeight: 500 }}>Rp</span>
                  <input className="input" type="number" value={form.target_dana || ''} onChange={e => setForm({ ...form, target_dana: parseInt(e.target.value) || 0 })} placeholder="2.500.000" style={{ paddingLeft: 42 }} />
                </div>
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>Format: 2.500.000 (gunakan titik sebagai pemisah ribuan)</p>
              </div>

              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Deskripsi</label>
                <textarea className="input textarea" value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} placeholder="Jelaskan mengapa kado ini penting untuk Anda..." style={{ minHeight: 100 }} />
              </div>

              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Link Produk (Opsional)</label>
                <input className="input" value={form.link_produk} onChange={e => setForm({ ...form, link_produk: e.target.value })} placeholder="https://tokopedia.com/..." />
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>Link ke toko online untuk referensi tamu</p>
              </div>

              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Status</label>
                <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="aktif">Aktif - Tamu bisa berkontribusi</option>
                  <option value="dijeda">Dijeda - Sementara tidak menerima kontribusi</option>
                </select>
              </div>
            </div>

            <div className="drawer-footer" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem', background: 'var(--dark)' }}>
                {editItem ? 'Simpan' : 'Buat Wishlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Kontribusi */}
      {activeKontribusi && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setActiveKontribusi(null)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Kontribusi: {activeKontribusi.nama_barang}</h3>
              <button className="btn-icon" onClick={() => setActiveKontribusi(null)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#FEF9C3', border: '1px solid #FEF08A', padding: '12px', borderRadius: 8, display: 'flex', gap: 8 }}>
                <ion-icon name="information-circle-outline" style={{ color: '#CA8A04', fontSize: 18, flexShrink: 0, marginTop: 2 }}></ion-icon>
                <div>
                  <p style={{ fontWeight: 600, color: '#854D0E', fontSize: 13, marginBottom: 4 }}>Cek apakah uang masuk ke rekening kamu sebelum setujui kontribusi</p>
                  <p style={{ color: '#A16207', fontSize: 12, lineHeight: 1.4 }}>Pastikan nominal yang diterima sesuai dengan jumlah kontribusi sebelum menyetujui.</p>
                </div>
              </div>

              <div className="card" style={{ padding: '16px', background: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                  <span style={{ fontWeight: 700 }}>{activeKontribusi.target_dana > 0 ? Math.min(100, Math.round((activeKontribusi.terkumpul / activeKontribusi.target_dana) * 100 * 10) / 10) : 0}%</span>
                </div>
                <div className="progress-track" style={{ marginBottom: 12 }}>
                  <div className="progress-fill progress-blue" style={{ width: `${activeKontribusi.target_dana > 0 ? Math.min(100, Math.round((activeKontribusi.terkumpul / activeKontribusi.target_dana) * 100)) : 0}%` }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Terkumpul: <span style={{ color: '#10B981', fontWeight: 600 }}>{formatRp(activeKontribusi.terkumpul)}</span></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Target: <span style={{ fontWeight: 600 }}>{formatRp(activeKontribusi.target_dana)}</span></span>
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Menunggu Persetujuan</h4>
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <ion-icon name="hourglass-outline" style={{ fontSize: 24, color: '#6B7280', marginBottom: 8 }}></ion-icon>
                  <p style={{ color: '#6B7280', fontSize: 13 }}>Belum ada kontribusi yang menunggu persetujuan</p>
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Kontribusi Disetujui</h4>
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <ion-icon name="checkmark-circle-outline" style={{ fontSize: 24, color: '#6B7280', marginBottom: 8 }}></ion-icon>
                  <p style={{ color: '#6B7280', fontSize: 13 }}>Belum ada kontribusi yang disetujui</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
