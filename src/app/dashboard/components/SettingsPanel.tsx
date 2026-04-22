'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingSettings } from '../page'

interface Props {
  settings: WeddingSettings | null; orderId: string
  showToast: (msg: string) => void; onRefresh: () => void
  initialSection?: 'wa' | 'bank' | 'alamat'
}

export default function SettingsPanel({ settings, orderId, showToast, onRefresh, initialSection = 'wa' }: Props) {
  const section = initialSection

  // ─── WA Templates ─── 
  interface WATemplate {
    id: string;
    nama: string;
    kategori: string;
    isi: string;
  }
  const [waTemplates, setWaTemplates] = useState<WATemplate[]>(() => {
    if (settings?.wa_templates && Array.isArray(settings.wa_templates) && settings.wa_templates.length > 0) {
      return settings.wa_templates;
    }
    const initial: WATemplate[] = []
    if (settings?.wa_template_undangan) {
      initial.push({ id: '1', nama: 'Template Undangan', kategori: 'Semua Kategori', isi: settings.wa_template_undangan })
    }
    if (settings?.wa_template_reminder) {
      initial.push({ id: '2', nama: 'Template Reminder', kategori: 'Semua Kategori', isi: settings.wa_template_reminder })
    }
    return initial;
  })
  const [showAddWATemplate, setShowAddWATemplate] = useState(false)
  const [newWATemplate, setNewWATemplate] = useState<WATemplate>({ id: '', nama: '', kategori: '', isi: '' })
  const [previewTemplate, setPreviewTemplate] = useState<WATemplate | null>(null)

  // ─── Bank Accounts ───
  const [rekeningList, setRekeningList] = useState<any[]>(settings?.rekening_list || [])
  const [showBankForm, setShowBankForm] = useState(false)
  const [bankForm, setBankForm] = useState({ bank: '', nomor: '', atas_nama: '', qris_url: '' })
  const [editBankIndex, setEditBankIndex] = useState<number | null>(null)
  const [uploadingQRIS, setUploadingQRIS] = useState(false)

  async function handleUploadQRIS(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingQRIS(true)
    const ext = file.name.split('.').pop()
    const fileName = `qris-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('wedding-photos').upload(fileName, file)
    if (error) {
      showToast('Gagal upload QRIS')
    } else {
      const { data: { publicUrl } } = supabase.storage.from('wedding-photos').getPublicUrl(data.path)
      setBankForm({ ...bankForm, qris_url: publicUrl })
    }
    setUploadingQRIS(false)
  }

  // ─── Alamat ───
  let savedAlamat = { nama_penerima: '', telepon: '', alamat_lengkap: '' }
  try {
    if (settings?.alamat_pengiriman && settings.alamat_pengiriman.startsWith('{')) {
      savedAlamat = JSON.parse(settings.alamat_pengiriman)
    } else {
      savedAlamat.alamat_lengkap = settings?.alamat_pengiriman || ''
    }
  } catch (e) {}

  const [alamatForm, setAlamatForm] = useState(savedAlamat)
  const [isEditingAlamat, setIsEditingAlamat] = useState(!savedAlamat.alamat_lengkap)

  async function saveTemplatesToDB(updatedTemplates: WATemplate[]) {
    setWaTemplates(updatedTemplates);
    
    // Auto-sync legacy fields for backward compatibility
    const tplUndangan = updatedTemplates.find(t => t.id === '1')?.isi || '';
    const tplReminder = updatedTemplates.find(t => t.id === '2')?.isi || '';

    const { error } = await supabase.from('wedding_settings').update({
      wa_templates: updatedTemplates,
      wa_template_undangan: tplUndangan,
      wa_template_reminder: tplReminder
    }).eq('order_id', orderId)
    
    if (error) {
      showToast('Gagal menyimpan template ke database')
    } else {
      onRefresh()
    }
  }

  async function saveBank() {
    let updated = [...rekeningList]
    if (editBankIndex !== null) {
      updated[editBankIndex] = bankForm
    } else {
      updated = [...rekeningList, bankForm]
    }
    const { error } = await supabase.from('wedding_settings').update({
      rekening_list: updated
    }).eq('order_id', orderId)
    if (error) showToast('Gagal menyimpan rekening')
    else {
      showToast('Rekening disimpan')
      setRekeningList(updated)
      setShowBankForm(false)
      setBankForm({ bank: '', nomor: '', atas_nama: '', qris_url: '' })
      setEditBankIndex(null)
      onRefresh()
    }
  }

  async function deleteBank(idx: number) {
    const updated = rekeningList.filter((_, i) => i !== idx)
    const { error } = await supabase.from('wedding_settings').update({ rekening_list: updated }).eq('order_id', orderId)
    if (error) showToast('Gagal hapus rekening')
    else { setRekeningList(updated); showToast('Rekening dihapus'); onRefresh() }
  }

  async function saveAlamat() {
    if (!alamatForm.nama_penerima || !alamatForm.telepon || !alamatForm.alamat_lengkap) {
      showToast('Mohon lengkapi semua data pengiriman')
      return
    }
    const { error } = await supabase.from('wedding_settings').update({
      alamat_pengiriman: JSON.stringify(alamatForm),
    }).eq('order_id', orderId)
    if (error) showToast('Gagal menyimpan alamat')
    else { 
      showToast('Alamat disimpan')
      setIsEditingAlamat(false)
      onRefresh() 
    }
  }

  // ═══ WA TEMPLATE SECTION ═══
  if (section === 'wa') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Template WA</h2>
        <button className="btn btn-primary" onClick={() => {
          setNewWATemplate({ id: '', nama: '', kategori: '', isi: '' })
          setShowAddWATemplate(true)
        }}>
          <ion-icon name="add-outline"></ion-icon> Tambah Template
        </button>
      </div>
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ion-icon name="chatbox-ellipses-outline" style={{ fontSize: 14 }}></ion-icon>
            Template WA
          </span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{waTemplates.length}/1</span>
        </div>
        <div className="progress-track" style={{ height: 4, marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${Math.min(waTemplates.length * 100, 100)}%`, background: 'var(--danger)' }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#92400E', background: '#FEF3C7', padding: '6px 10px', borderRadius: 4 }}>
          <ion-icon name="bulb-outline" style={{ fontSize: 14 }}></ion-icon>
          <span>Slot template hampir penuh. <a href="#" style={{ fontWeight: 700, textDecoration: 'underline', color: '#92400E' }}>Tambah slot</a> untuk variasi pesan lebih banyak.</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {waTemplates.map(tpl => (
          <div key={tpl.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--stroke)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{tpl.nama}</h3>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn-icon" style={{ width: 32, height: 32, background: '#F3F4F6' }} onClick={() => {
                  setNewWATemplate(tpl)
                  setShowAddWATemplate(true)
                }}><ion-icon name="create-outline"></ion-icon></button>
                <button className="btn-icon" style={{ width: 32, height: 32, background: '#F3F4F6' }} onClick={() => saveTemplatesToDB(waTemplates.filter(t => t.id !== tpl.id))}><ion-icon name="trash-outline"></ion-icon></button>
              </div>
            </div>
            
            <span className="chip" style={{ background: '#EFF6FF', color: '#2563EB', marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ion-icon name="people-outline"></ion-icon> {tpl.kategori}
            </span>
            
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Aa {tpl.isi.length} karakter</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ion-icon name="time-outline"></ion-icon> ~1 menit baca</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ion-icon name="chatbubble-outline"></ion-icon> {tpl.isi.split(/\s+/).filter(Boolean).length} kata</span>
            </div>
            
            <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tpl.isi}
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => {
                saveTemplatesToDB([...waTemplates, { ...tpl, id: Date.now().toString(), nama: tpl.nama + ' (Copy)' }])
                showToast('Template diduplikat')
              }}>
                <ion-icon name="copy-outline"></ion-icon> Duplikat
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'var(--dark)' }} onClick={() => setPreviewTemplate(tpl)}>
                <ion-icon name="eye-outline"></ion-icon> Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddWATemplate && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowAddWATemplate(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                {newWATemplate.id ? 'Edit Template WhatsApp' : 'Tambah Template WhatsApp'}
              </h3>
              <button className="btn-icon" onClick={() => setShowAddWATemplate(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="label">Nama Template</label>
                  <input 
                    className="input" 
                    placeholder="Contoh: Undangan Keluarga" 
                    value={newWATemplate.nama} 
                    onChange={e => setNewWATemplate({...newWATemplate, nama: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="label">Kategori Target</label>
                  <select 
                    className="input" 
                    value={newWATemplate.kategori} 
                    onChange={e => setNewWATemplate({...newWATemplate, kategori: e.target.value})}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Semua Kategori">Semua Kategori</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Teman">Teman</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Tetangga">Tetangga</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="label">Isi Pesan Template</label>
                <textarea 
                  className="input textarea" 
                  rows={8} 
                  placeholder="Tulis pesan template di sini..." 
                  value={newWATemplate.isi} 
                  onChange={e => setNewWATemplate({...newWATemplate, isi: e.target.value})} 
                />
              </div>
              
              <div style={{ padding: '16px', background: '#F0F9FF', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0369A1', marginBottom: 8 }}>Variabel Template:</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <code style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>[nama_tamu]</code>
                  <code style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>[nama_mempelai]</code>
                  <code style={{ background: '#F3E8FF', color: '#6B21A8', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>[link_undangan]</code>
                </div>
                <p style={{ fontSize: 12, color: '#0284C7', lineHeight: 1.5 }}>
                  Variabel ini akan diganti otomatis dengan data tamu saat mengirim pesan.
                </p>
              </div>
            </div>
            
            <div className="drawer-footer" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowAddWATemplate(false)} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>Batal</button>
              <button className="btn btn-primary" onClick={() => {
                if (newWATemplate.id) {
                  saveTemplatesToDB(waTemplates.map(t => t.id === newWATemplate.id ? newWATemplate : t))
                  showToast('Template berhasil diperbarui')
                } else {
                  const newTpl = { ...newWATemplate, id: Date.now().toString() }
                  saveTemplatesToDB([...waTemplates, newTpl])
                  showToast('Template berhasil dibuat')
                }
                setShowAddWATemplate(false)
                setNewWATemplate({ id: '', nama: '', kategori: '', isi: '' })
              }} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>
                {newWATemplate.id ? 'Simpan Perubahan' : 'Buat Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setPreviewTemplate(null)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Preview Template</h3>
              <button className="btn-icon" onClick={() => setPreviewTemplate(null)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div className="drawer-body">
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{previewTemplate.nama}</h4>
              <span className="chip" style={{ background: '#EFF6FF', color: '#2563EB', marginBottom: 20, display: 'inline-block' }}>{previewTemplate.kategori}</span>
              
              <div style={{ background: '#F9FAFB', padding: '20px', borderRadius: 'var(--radius-lg)', fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, whiteSpace: 'pre-wrap', lineHeight: 1.6, border: '1px solid var(--stroke)' }}>
                {previewTemplate.isi}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Template ini akan menggunakan data tamu yang sebenarnya saat dikirim.
              </p>
            </div>
            <div className="drawer-footer" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => {
                setNewWATemplate(previewTemplate)
                setShowAddWATemplate(true)
                setPreviewTemplate(null)
              }} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>Edit Template</button>
              <button className="btn btn-primary" onClick={() => setPreviewTemplate(null)} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem', background: 'var(--dark)' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ═══ BANK ACCOUNT SECTION ═══
  if (section === 'bank') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Rekening Bank</h2>
        <button className="btn btn-primary" onClick={() => { setEditBankIndex(null); setBankForm({ bank: '', nomor: '', atas_nama: '', qris_url: '' }); setShowBankForm(true) }}>
          <ion-icon name="add-outline"></ion-icon> Tambah Rekening
        </button>
      </div>

      {rekeningList.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏦</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Rekening Bank</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Tambahkan rekening bank untuk menerima kontribusi dari tamu undangan Anda.
            </p>
            <button className="btn btn-primary" onClick={() => { setEditBankIndex(null); setBankForm({ bank: '', nomor: '', atas_nama: '', qris_url: '' }); setShowBankForm(true) }}>
              Tambah Rekening Pertama
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {rekeningList.map((rek, i) => (
            <div className="card" key={i} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '2rem 1rem 1rem', textAlign: 'center', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {rek.qris_url ? (
                  <img src={rek.qris_url} alt="QRIS" style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto', background: '#fff', padding: 8, borderRadius: 12, border: '1px solid #E5E7EB' }} />
                ) : (
                  <div style={{ width: 120, height: 120, margin: '0 auto', background: '#fff', border: '2px dashed #E5E7EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ion-icon name="qr-code-outline" style={{ fontSize: 40, color: '#9CA3AF' }}></ion-icon>
                  </div>
                )}
                <p style={{ fontWeight: 700, fontSize: 16, marginTop: 12 }}>{rek.atas_nama}</p>
              </div>
              
              <div style={{ padding: '1.25rem' }}>
                <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ion-icon name="card-outline" style={{ color: '#6B7280', fontSize: 18 }}></ion-icon>
                  <span style={{ fontFamily: 'monospace', fontSize: 14 }}>{rek.nomor}</span>
                </div>
                <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ion-icon name="business-outline" style={{ color: '#6B7280', fontSize: 18 }}></ion-icon>
                  <span style={{ fontSize: 14 }}>{rek.bank}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn" onClick={() => deleteBank(i)} style={{ flex: 1, justifyContent: 'center', background: '#F3F4F6', color: '#4B5563', borderRadius: 8, fontWeight: 600 }}>
                    <ion-icon name="trash-outline"></ion-icon> Hapus
                  </button>
                  <button className="btn btn-primary" onClick={() => { setEditBankIndex(i); setBankForm(rek); setShowBankForm(true) }} style={{ flex: 1, justifyContent: 'center', borderRadius: 8, background: 'var(--dark)', fontWeight: 600 }}>
                    <ion-icon name="create-outline"></ion-icon> Edit
                  </button>
                </div>
              </div>
              
              <div style={{ background: '#F9FAFB', padding: '12px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6B7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ion-icon name="qr-code-outline" style={{ fontSize: 14 }}></ion-icon> QRIS</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>Aktif</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBankForm && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowBankForm(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{editBankIndex !== null ? 'Edit' : 'Tambah'} Rekening Bank</h3>
              <button className="btn-icon" onClick={() => setShowBankForm(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Gambar QRIS <span style={{ color: '#6B7280', fontWeight: 400 }}>(Opsional)</span></label>
                <label style={{ cursor: 'pointer', display: 'block' }}>
                  <input type="file" accept="image/*" onChange={handleUploadQRIS} style={{ display: 'none' }} />
                  <div style={{ border: '2px dashed #E5E7EB', borderRadius: '16px', padding: bankForm.qris_url ? '1rem' : '2rem 1rem', textAlign: 'center', background: '#F9FAFB', overflow: 'hidden', position: 'relative' }}>
                    {uploadingQRIS ? (
                      <div style={{ padding: '2rem' }}><p>Mengunggah...</p></div>
                    ) : bankForm.qris_url ? (
                      <img src={bankForm.qris_url} alt="QRIS Preview" style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto', display: 'block', background: '#fff', padding: 8, borderRadius: 12, border: '1px solid #E5E7EB' }} />
                    ) : (
                      <>
                        <ion-icon name="qr-code-outline" style={{ fontSize: 32, color: '#9CA3AF', marginBottom: 12 }}></ion-icon>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                          <div className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13, background: '#fff' }}>
                            <ion-icon name="camera-outline"></ion-icon> Upload QRIS
                          </div>
                        </div>
                        <p style={{ fontSize: 11, color: '#6B7280' }}>JPG, PNG, atau GIF (Otomatis Dikompres)<br/>Jika tidak ada QRIS, biarkan kosong</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Nama Bank</label>
                <select className="input" value={bankForm.bank} onChange={e => setBankForm({ ...bankForm, bank: e.target.value })}>
                  <option value="">Pilih Bank</option>
                  <option>BCA</option><option>BRI</option><option>BNI</option><option>Mandiri</option>
                  <option>CIMB Niaga</option><option>BSI</option><option>Dana</option><option>OVO</option><option>GoPay</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              
              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Nomor Rekening</label>
                <input className="input" value={bankForm.nomor} onChange={e => setBankForm({ ...bankForm, nomor: e.target.value })} placeholder="Contoh: 1234567890" />
              </div>
              
              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Nama Pemilik Rekening</label>
                <input className="input" value={bankForm.atas_nama} onChange={e => setBankForm({ ...bankForm, atas_nama: e.target.value })} placeholder="Sesuai dengan nama di rekening" />
              </div>
            </div>

            <div className="drawer-footer" style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowBankForm(false)} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem' }}>Batal</button>
              <button className="btn btn-primary" onClick={saveBank} style={{ flex: 1, justifyContent: 'center', padding: '0.875rem', background: 'var(--dark)' }}>
                {editBankIndex !== null ? 'Simpan' : 'Tambah Rekening'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ═══ ALAMAT SECTION ═══
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Alamat Kirim</h2>
      
      {!isEditingAlamat ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #BFDBFE', background: '#EFF6FF' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: '#3B82F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ion-icon name="location" style={{ color: '#fff', fontSize: 20 }}></ion-icon>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E3A8A' }}>Alamat Tersimpan</h3>
                <p style={{ fontSize: 12, color: '#60A5FA' }}>Alamat aktif untuk pengiriman</p>
              </div>
            </div>
            <button className="btn" onClick={() => setIsEditingAlamat(true)} style={{ color: '#3B82F6', fontWeight: 600, padding: '4px 8px' }}>
              <ion-icon name="create-outline"></ion-icon> Edit
            </button>
          </div>
          
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <ion-icon name="person-outline" style={{ color: '#60A5FA', fontSize: 18, marginTop: 2 }}></ion-icon>
              <div>
                <p style={{ fontSize: 12, color: '#60A5FA', marginBottom: 2 }}>Nama Penerima</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1E3A8A' }}>{alamatForm.nama_penerima}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <ion-icon name="call-outline" style={{ color: '#60A5FA', fontSize: 18, marginTop: 2 }}></ion-icon>
              <div>
                <p style={{ fontSize: 12, color: '#60A5FA', marginBottom: 2 }}>Nomor Telepon</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1E3A8A' }}>{alamatForm.telepon}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <ion-icon name="home-outline" style={{ color: '#60A5FA', fontSize: 18, marginTop: 2 }}></ion-icon>
              <div>
                <p style={{ fontSize: 12, color: '#60A5FA', marginBottom: 2 }}>Alamat Lengkap</p>
                <p style={{ fontSize: 14, color: '#1E3A8A', lineHeight: 1.5 }}>{alamatForm.alamat_lengkap}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Informasi Pengiriman</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Isi data dengan lengkap dan benar</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ion-icon name="person-outline" style={{ fontSize: 14 }}></ion-icon>
                Nama Penerima <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input className="input" value={alamatForm.nama_penerima} onChange={e => setAlamatForm({ ...alamatForm, nama_penerima: e.target.value })} placeholder="Contoh: Budi & Citra" />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Nama yang akan menerima hadiah</span>
            </div>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ion-icon name="call-outline" style={{ fontSize: 14 }}></ion-icon>
                Nomor Telepon Penerima <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-page)', border: '1px solid var(--stroke)', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>+62</div>
                <input className="input" value={alamatForm.telepon} onChange={e => setAlamatForm({ ...alamatForm, telepon: e.target.value })} placeholder="8123456789" />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Contoh: 8123456789 (tanpa 0 di depan)</span>
            </div>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ion-icon name="home-outline" style={{ fontSize: 14 }}></ion-icon>
                Alamat Lengkap <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea className="input textarea" rows={3} value={alamatForm.alamat_lengkap} onChange={e => setAlamatForm({ ...alamatForm, alamat_lengkap: e.target.value })}
                placeholder="Jl. Kenangan Indah No. 42, Kel. Suka Maju, Kec. Bahagia, Jakarta Selatan, DKI Jakarta 12345" />
              <div className="tips-card" style={{ marginTop: 12 }}>
                <ion-icon name="alert-circle-outline"></ion-icon>
                <p>Pastikan alamat lengkap dengan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos untuk memudahkan pengiriman</p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--stroke)', paddingTop: 16, marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {savedAlamat.alamat_lengkap && (
              <button className="btn btn-secondary" onClick={() => { setAlamatForm(savedAlamat); setIsEditingAlamat(false); }}>
                Batal
              </button>
            )}
            <button className="btn btn-primary" onClick={saveAlamat}>
              <ion-icon name="checkmark-circle-outline"></ion-icon> Simpan Alamat
            </button>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div style={{ marginTop: 16, padding: '1rem 1.25rem', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <ion-icon name="shield-checkmark" style={{ fontSize: 18, color: '#2563EB', flexShrink: 0 }}></ion-icon>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 2 }}>Keamanan Data</p>
          <p style={{ fontSize: 12, color: '#3B82F6', lineHeight: 1.5 }}>
            Alamat Anda hanya akan digunakan untuk pengiriman hadiah dari tamu dan tidak akan dibagikan kepada pihak ketiga
          </p>
        </div>
      </div>
    </div>
  )
}
