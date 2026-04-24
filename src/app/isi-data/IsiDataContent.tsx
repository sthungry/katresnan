'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { supabaseAuth } from '@/lib/supabaseAuth'
import KatresnanLogo from '@/components/KatresnanLogo'
import type { SupabaseClient } from '@supabase/supabase-js'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 'mempelai_pria' | 'mempelai_wanita' | 'acara' | 'media' | 'fitur' | 'selesai'

interface RekeningItem {
  id: string
  bank: string
  nomor: string
  nama: string
  kategori: string  // pria / wanita / bersama
}

interface RundownItem {
  id: string
  jam: string    // "09:00"
  acara: string  // "Akad Nikah"
}


interface BgSection {
  type: 'default' | 'foto' | 'youtube' | 'video'
  url: string
  overlay: number  // 0.0 - 0.8, default 0.4
}
interface BgSections {
  cover?:    BgSection
  mempelai?: BgSection
  acara?:    BgSection
  galeri?:   BgSection
  footer?:   BgSection
}

interface WeddingForm {
  pria_nama_lengkap: string; pria_nama_panggilan: string; pria_gelar: string
  pria_nama_ayah: string; pria_status_ayah: string
  pria_nama_ibu: string; pria_status_ibu: string
  pria_foto_url: string
  wanita_nama_lengkap: string; wanita_nama_panggilan: string; wanita_gelar: string
  wanita_nama_ayah: string; wanita_status_ayah: string
  wanita_nama_ibu: string; wanita_status_ibu: string
  wanita_foto_url: string
  akad_tanggal: string; akad_lokasi: string; akad_alamat: string; akad_maps_url: string
  resepsi_tanggal: string; resepsi_lokasi: string; resepsi_alamat: string; resepsi_maps_url: string
  video_youtube_url: string; musik_pilihan: string; hashtag_instagram: string
  foto_urls: string[]
  rekening_list: RekeningItem[]
  alamat_kado: string
  cerita_pertemuan: string; tanggal_jadian: string; tanggal_lamaran: string; engagement_story: string
  fitur_amplop_digital: boolean; fitur_cerita_cinta: boolean
  catatan_tambahan: string
  rundown_list: RundownItem[]
  kata_kata_pilihan: 'quran' | 'bible' | 'custom'
  kata_kata_custom: string
  bg_sections: BgSections
}

const EMPTY: WeddingForm = {
  pria_nama_lengkap: '', pria_nama_panggilan: '', pria_gelar: '',
  pria_nama_ayah: '', pria_status_ayah: 'hidup', pria_nama_ibu: '', pria_status_ibu: 'hidup',
  pria_foto_url: '',
  wanita_nama_lengkap: '', wanita_nama_panggilan: '', wanita_gelar: '',
  wanita_nama_ayah: '', wanita_status_ayah: 'hidup', wanita_nama_ibu: '', wanita_status_ibu: 'hidup',
  wanita_foto_url: '',
  akad_tanggal: '', akad_lokasi: '', akad_alamat: '', akad_maps_url: '',
  resepsi_tanggal: '', resepsi_lokasi: '', resepsi_alamat: '', resepsi_maps_url: '',
  video_youtube_url: '', musik_pilihan: '', hashtag_instagram: '',
  foto_urls: [],
  rekening_list: [],
  alamat_kado: '',
  cerita_pertemuan: '', tanggal_jadian: '', tanggal_lamaran: '', engagement_story: '',
  fitur_amplop_digital: false, fitur_cerita_cinta: false,
  catatan_tambahan: '',
  rundown_list: [],
  kata_kata_pilihan: 'quran',
  kata_kata_custom: '',
  bg_sections: {},
}

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'mempelai_pria',   label: 'Mempelai Pria',   icon: 'person' },
  { id: 'mempelai_wanita', label: 'Mempelai Wanita', icon: 'person-outline' },
  { id: 'acara',           label: 'Detail Acara',     icon: 'calendar-outline' },
  { id: 'media',           label: 'Foto & Media',     icon: 'images-outline' },
  { id: 'fitur',           label: 'Fitur Tambahan',   icon: 'star-outline' },
  { id: 'selesai',         label: 'Selesai',          icon: 'checkmark-circle-outline' },
]

const BANK_OPTIONS = [
  'BCA','BRI','BNI','Mandiri','BSI','CIMB Niaga','Danamon',
  'Permata','BNC','Jenius','GoPay','OVO','Dana','ShopeePay','QRIS'
]

const KATEGORI_OPTIONS = [
  { value: 'pria',    label: '🤵 Mempelai Pria'  },
  { value: 'wanita',  label: '👰 Mempelai Wanita' },
  { value: 'bersama', label: '💍 Rekening Bersama' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, required, hint, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; hint?: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-[#3B82F6]">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] focus:border-[#3B82F6] dark:focus:border-[#60a5fa] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] outline-none transition-colors placeholder:text-[#94a3b8]"
      />
      {hint && <p className="text-[11px] text-[#94a3b8] mt-1">{hint}</p>}
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, hint, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] outline-none transition-colors placeholder:text-[#94a3b8] resize-none"
      />
      {hint && <p className="text-[11px] text-[#94a3b8] mt-1">{hint}</p>}
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide mb-1.5">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] outline-none transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function Toggle({ label, value, onChange, hint }: {
  label: string; value: boolean; onChange: (v: boolean) => void; hint?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl">
      <div>
        <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{label}</p>
        {hint && <p className="text-xs text-[#94a3b8] mt-0.5">{hint}</p>}
      </div>
      <button type="button" onClick={() => onChange(!value)}
        className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-[#3B82F6]' : 'bg-[#cbd5e1] dark:bg-[#1e293b]'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`}/>
      </button>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden">
      <div className="bg-gradient-to-r from-primary-800 to-[#2563eb] px-5 py-3 flex items-center gap-2">
        <ion-icon name={icon} style={{ color: 'white', fontSize: 16 }}></ion-icon>
        <p className="text-white font-bold text-sm">{title}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex(s => s.id === current)
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {STEPS.filter(s => s.id !== 'selesai').map((step, i) => {
        const done = i < currentIdx; const active = step.id === current
        return (
          <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              active ? 'bg-[#3B82F6] text-white' : done ? 'bg-[#dbeafe] dark:bg-[#1e293b] text-primary-800 dark:text-[#60a5fa]' : 'bg-[#f1f5f9] dark:bg-[#0f172a] text-[#94a3b8]'
            }`}>
              <span>{done ? <ion-icon name="checkmark-outline"></ion-icon> : <ion-icon name={step.icon}></ion-icon>}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 2 && <div className={`w-4 h-px flex-shrink-0 ${done ? 'bg-[#3B82F6]' : 'bg-[#e2e8f0] dark:bg-[#1e293b]'}`}/>}
          </div>
        )
      })}
    </div>
  )
}

// ─── Rekening Manager ─────────────────────────────────────────────────────────
function RekeningManager({ list, onChange }: { list: RekeningItem[]; onChange: (list: RekeningItem[]) => void }) {
  function add() {
    if (list.length >= 6) return
    onChange([...list, { id: Date.now().toString(), bank: 'BCA', nomor: '', nama: '', kategori: 'pria' }])
  }
  function remove(id: string) { onChange(list.filter(r => r.id !== id)) }
  function update(id: string, key: keyof RekeningItem, val: string) {
    onChange(list.map(r => r.id === id ? { ...r, [key]: val } : r))
  }

  return (
    <div className="space-y-3">
      {list.length === 0 && (
        <div className="text-center py-6 text-[#94a3b8] text-sm border-2 border-dashed border-[#e2e8f0] dark:border-[#1e293b] rounded-xl">
          Belum ada rekening. Klik tombol di bawah untuk menambahkan.
        </div>
      )}
      {list.map((r, i) => (
        <div key={r.id} className="bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-800 dark:text-[#60a5fa] uppercase tracking-wide">
              Rekening {i + 1}
            </span>
            <button onClick={() => remove(r.id)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              ✕ Hapus
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Kategori */}
            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1">Kategori</label>
              <select value={r.kategori} onChange={e => update(r.id, 'kategori', e.target.value)}
                className="w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-xs text-[#0f172a] dark:text-[#f1f5f9] outline-none">
                {KATEGORI_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Bank */}
            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1">Bank / E-wallet</label>
              <select value={r.bank} onChange={e => update(r.id, 'bank', e.target.value)}
                className="w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-xs text-[#0f172a] dark:text-[#f1f5f9] outline-none">
                {BANK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1">Nomor Rekening / No. HP</label>
            <input value={r.nomor} onChange={e => update(r.id, 'nomor', e.target.value)}
              placeholder="contoh: 1234567890"
              className="w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-wide mb-1">Nama Pemilik</label>
            <input value={r.nama} onChange={e => update(r.id, 'nama', e.target.value)}
              placeholder="Nama sesuai rekening"
              className="w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-lg px-3 py-2 text-sm text-[#0f172a] dark:text-[#f1f5f9] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
        </div>
      ))}
      {list.length < 6 && (
        <button onClick={add}
          className="w-full py-3 border-2 border-dashed border-[#3B82F6]/30 dark:border-[#60a5fa]/30 text-primary-800 dark:text-[#60a5fa] font-semibold text-sm rounded-xl hover:border-[#3B82F6] dark:hover:border-[#60a5fa] hover:bg-[#dbeafe]/20 transition-all flex items-center justify-center gap-2">
          + Tambah Rekening
          <span className="text-xs text-[#94a3b8] font-normal">({list.length}/6)</span>
        </button>
      )}
    </div>
  )
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────
function PhotoUpload({ orderId, urls, onChange, client }: {
  orderId: string; urls: string[]; onChange: (urls: string[]) => void; client?: SupabaseClient
}) {
  const db = client || supabase
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState<Record<string, number>>({})
  const [dragOver,  setDragOver]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const MAX = 20

  async function uploadFiles(files: FileList | null) {
    if (!files || urls.length >= MAX) return
    const remaining = MAX - urls.length
    const toUpload = Array.from(files).slice(0, remaining)
    if (toUpload.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of toUpload) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) { alert(`${file.name} terlalu besar (max 10MB)`); continue }

      const ext  = file.name.split('.').pop()
      const path = `${orderId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      setProgress(p => ({ ...p, [file.name]: 0 }))

      const { data, error } = await db.storage
        .from('wedding-photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (!error && data) {
        const { data: { publicUrl } } = db.storage.from('wedding-photos').getPublicUrl(data.path)
        newUrls.push(publicUrl)
      }
      setProgress(p => ({ ...p, [file.name]: 100 }))
    }

    onChange([...urls, ...newUrls])
    setUploading(false)
    setProgress({})
  }

  function removePhoto(url: string) {
    onChange(urls.filter(u => u !== url))
    // Hapus dari storage juga
    const path = url.split('/wedding-photos/')[1]
    if (path) db.storage.from('wedding-photos').remove([path])
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#3B82F6] bg-[#dbeafe]/30 dark:bg-[#1e293b]'
            : urls.length >= MAX
              ? 'border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#0f172a] cursor-not-allowed opacity-60'
              : 'border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#3B82F6] hover:bg-[#dbeafe]/10'
        }`}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => uploadFiles(e.target.files)} disabled={uploading || urls.length >= MAX}/>
        <div className="text-4xl mb-3 text-[#94a3b8]">{uploading ? <ion-icon name="sync-outline" class="animate-spin"></ion-icon> : <ion-icon name="cloud-upload-outline"></ion-icon>}</div>
        {uploading ? (
          <p className="text-sm font-semibold text-primary-800 dark:text-[#60a5fa]">Mengupload foto...</p>
        ) : urls.length >= MAX ? (
          <p className="text-sm text-[#94a3b8]">Sudah mencapai maksimal {MAX} foto</p>
        ) : (
          <>
            <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9] mb-1">
              Klik atau drag & drop foto di sini
            </p>
            <p className="text-xs text-[#94a3b8]">
              JPG, PNG, WEBP · Max 10MB per foto · {urls.length}/{MAX} foto
            </p>
          </>
        )}
      </div>

      {/* Upload progress */}
      {Object.entries(progress).map(([name, pct]) => (
        <div key={name} className="bg-[#f8fafc] dark:bg-[#0f172a] rounded-xl px-4 py-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#64748b] truncate max-w-[200px]">{name}</span>
            <span className="text-primary-800 dark:text-[#60a5fa] font-bold">{pct}%</span>
          </div>
          <div className="h-1.5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-full overflow-hidden">
            <div className="h-full bg-[#3B82F6] dark:bg-[#60a5fa] rounded-full transition-all" style={{ width: `${pct}%` }}/>
          </div>
        </div>
      ))}

      {/* Photo grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {urls.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-[#f1f5f9] dark:bg-[#0f172a]">
              <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => removePhoto(url)}
                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                  ✕
                </button>
              </div>
              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {i+1}
              </div>
            </div>
          ))}
          {urls.length < MAX && !uploading && (
            <div onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#3B82F6] flex items-center justify-center cursor-pointer transition-colors">
              <span className="text-2xl text-[#94a3b8] hover:text-primary-800">+</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Portrait Upload (foto mempelai, 1 foto, tampil lingkaran) ───────────────
function PortraitUpload({ orderId, url, onChange, label, client }: {
  orderId: string; url: string; onChange: (url: string) => void; label: string; client?: SupabaseClient
}) {
  const db = client || supabase
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) { alert('Ukuran file max 10MB'); return }
    setUploading(true)

    // Hapus foto lama dari storage kalau ada
    if (url) {
      const oldPath = url.split('/wedding-photos/')[1]
      if (oldPath) db.storage.from('wedding-photos').remove([oldPath])
    }

    const ext  = file.name.split('.').pop()
    const slug = label === 'pria' ? 'groom' : 'bride'
    const path = `${orderId}/portrait-${slug}-${Date.now()}.${ext}`

    const { data, error } = await db.storage
      .from('wedding-photos')
      .upload(path, file, { cacheControl: '3600', upsert: true })

    if (!error && data) {
      const { data: { publicUrl } } = db.storage.from('wedding-photos').getPublicUrl(data.path)
      onChange(publicUrl)
    } else if (error) {
      alert('Gagal upload: ' + error.message)
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Lingkaran preview */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-2 border-dashed transition-all"
        style={{ borderColor: url ? '#3B82F6' : '#e2e8f0' }}
      >
        {url ? (
          <>
            <img src={url} alt={label} className="w-full h-full object-cover object-top"/>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Ganti Foto</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-[#f8fafc] dark:bg-[#0f172a]">
            {uploading
              ? <ion-icon name="sync-outline" class="animate-spin" style={{ fontSize: 24, color: '#94a3b8' }}></ion-icon>
              : <>
                  <ion-icon name={label === 'pria' ? 'person' : 'person-outline'} style={{ fontSize: 30, color: '#94a3b8' }}></ion-icon>
                  <span className="text-[10px] text-[#94a3b8] text-center px-2">Klik untuk upload</span>
                </>
            }
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <span className="text-primary-800 text-xs font-semibold animate-pulse">Mengupload...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])}
      />

      <div className="text-center">
        <p className="text-xs font-semibold text-[#0f172a] dark:text-[#f1f5f9]">
          Foto {label === 'pria' ? 'Mempelai Pria' : 'Mempelai Wanita'}
        </p>
        <p className="text-[10px] text-[#94a3b8] mt-0.5">JPG/PNG · Max 10MB · Wajah jelas</p>
      </div>

      {url && (
        <button
          onClick={() => { onChange(''); const p = url.split('/wedding-photos/')[1]; if (p) db.storage.from('wedding-photos').remove([p]) }}
          className="text-[10px] text-red-400 hover:text-red-600 underline transition-colors"
        >
          Hapus foto
        </button>
      )}
    </div>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────
function StepMempelaiPria({ form, set, orderId, client }: { form: WeddingForm; set: (k: keyof WeddingForm, v: any) => void; orderId: string; client?: SupabaseClient }) {
  return (
    <SectionCard title="Data Mempelai Pria" icon="person">
      {/* Foto portrait */}
      <div className="flex justify-center pb-2">
        <PortraitUpload
          orderId={orderId}
          url={form.pria_foto_url}
          onChange={v => set('pria_foto_url', v)}
          label="pria"
          client={client}
        />
      </div>
      <Input label="Nama Lengkap" value={form.pria_nama_lengkap} onChange={v => set('pria_nama_lengkap', v)} placeholder="Muhammad Rizky Pratama, S.T." required/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Panggilan" value={form.pria_nama_panggilan} onChange={v => set('pria_nama_panggilan', v)} placeholder="Rizky" required/>
        <Input label="Gelar" value={form.pria_gelar} onChange={v => set('pria_gelar', v)} placeholder="S.T., M.Kom. (opsional)"/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Ayah" value={form.pria_nama_ayah} onChange={v => set('pria_nama_ayah', v)} placeholder="Bapak Ahmad Santoso" required/>
        <Select label="Status Ayah" value={form.pria_status_ayah} onChange={v => set('pria_status_ayah', v)}
          options={[{ value: 'hidup', label: 'Masih hidup' }, { value: 'alm', label: 'Alm.' }]}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Ibu" value={form.pria_nama_ibu} onChange={v => set('pria_nama_ibu', v)} placeholder="Ibu Siti Rahayu" required/>
        <Select label="Status Ibu" value={form.pria_status_ibu} onChange={v => set('pria_status_ibu', v)}
          options={[{ value: 'hidup', label: 'Masih hidup' }, { value: 'almh', label: 'Almh.' }]}/>
      </div>
    </SectionCard>
  )
}

function StepMempelaiWanita({ form, set, orderId, client }: { form: WeddingForm; set: (k: keyof WeddingForm, v: any) => void; orderId: string; client?: SupabaseClient }) {
  return (
    <SectionCard title="Data Mempelai Wanita" icon="person-outline">
      {/* Foto portrait */}
      <div className="flex justify-center pb-2">
        <PortraitUpload
          orderId={orderId}
          url={form.wanita_foto_url}
          onChange={v => set('wanita_foto_url', v)}
          label="wanita"
          client={client}
        />
      </div>
      <Input label="Nama Lengkap" value={form.wanita_nama_lengkap} onChange={v => set('wanita_nama_lengkap', v)} placeholder="Nadya Kusuma Dewi, S.Pd." required/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Panggilan" value={form.wanita_nama_panggilan} onChange={v => set('wanita_nama_panggilan', v)} placeholder="Nadya" required/>
        <Input label="Gelar" value={form.wanita_gelar} onChange={v => set('wanita_gelar', v)} placeholder="S.Pd. (opsional)"/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Ayah" value={form.wanita_nama_ayah} onChange={v => set('wanita_nama_ayah', v)} placeholder="Bapak Hendra Kusuma" required/>
        <Select label="Status Ayah" value={form.wanita_status_ayah} onChange={v => set('wanita_status_ayah', v)}
          options={[{ value: 'hidup', label: 'Masih hidup' }, { value: 'alm', label: 'Alm.' }]}/>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Ibu" value={form.wanita_nama_ibu} onChange={v => set('wanita_nama_ibu', v)} placeholder="Ibu Dewi Lestari" required/>
        <Select label="Status Ibu" value={form.wanita_status_ibu} onChange={v => set('wanita_status_ibu', v)}
          options={[{ value: 'hidup', label: 'Masih hidup' }, { value: 'almh', label: 'Almh.' }]}/>
      </div>
    </SectionCard>
  )
}


// ─── Rundown Manager ──────────────────────────────────────────────────────────
const RUNDOWN_DEFAULT: Omit<RundownItem, 'id'>[] = [
  { jam: '08:00', acara: 'Tamu Undangan Tiba' },
  { jam: '09:00', acara: 'Akad Nikah' },
  { jam: '11:00', acara: 'Pembukaan Resepsi' },
  { jam: '11:30', acara: 'Grand Entrance Pengantin' },
  { jam: '12:00', acara: 'Makan Bersama' },
  { jam: '13:00', acara: 'Foto Bersama Tamu' },
  { jam: '14:00', acara: 'Penutupan' },
]

function RundownManager({ list, onChange }: {
  list: RundownItem[]
  onChange: (v: RundownItem[]) => void
}) {
  function add() {
    onChange([...list, { id: Math.random().toString(36).slice(2), jam: '', acara: '' }])
  }
  function loadDefault() {
    onChange(RUNDOWN_DEFAULT.map(r => ({ ...r, id: Math.random().toString(36).slice(2) })))
  }
  function update(id: string, field: keyof RundownItem, val: string) {
    onChange(list.map(r => r.id === id ? { ...r, [field]: val } : r))
  }
  function remove(id: string) {
    onChange(list.filter(r => r.id !== id))
  }
  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...list]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; onChange(next)
  }
  function moveDown(idx: number) {
    if (idx === list.length - 1) return
    const next = [...list]; [next[idx], next[idx+1]] = [next[idx+1], next[idx]]; onChange(next)
  }

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <div className="text-center py-6 rounded-2xl border border-dashed border-[#1e293b]">
          <p className="text-[#64748b] text-sm mb-3">Belum ada rundown acara</p>
          <button type="button" onClick={loadDefault}
            className="text-xs px-4 py-2 rounded-xl bg-[#3B82F6]/40 text-[#60a5fa] border border-[#1e293b] hover:bg-[#3B82F6]/60 transition-colors flex items-center justify-center gap-2 mx-auto">
            <ion-icon name="clipboard-outline"></ion-icon> Gunakan Template Default
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((r, idx) => (
            <div key={r.id} className="flex gap-2 items-center">
              {/* Urutan */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button type="button" onClick={() => moveUp(idx)}
                  className="w-5 h-4 flex items-center justify-center text-[#64748b] hover:text-[#60a5fa] disabled:opacity-20 text-[10px] transition-colors"
                  disabled={idx === 0}><ion-icon name="chevron-up-outline"></ion-icon></button>
                <button type="button" onClick={() => moveDown(idx)}
                  className="w-5 h-4 flex items-center justify-center text-[#64748b] hover:text-[#60a5fa] disabled:opacity-20 text-[10px] transition-colors"
                  disabled={idx === list.length - 1}><ion-icon name="chevron-down-outline"></ion-icon></button>
              </div>
              {/* Jam */}
              <input
                type="time"
                value={r.jam}
                onChange={e => update(r.id, 'jam', e.target.value)}
                className="w-24 flex-shrink-0 bg-[#0f172a] border border-[#1e293b] text-[#f1f5f9] rounded-xl px-2 py-2 text-sm outline-none"
              />
              {/* Nama acara */}
              <input
                value={r.acara}
                onChange={e => update(r.id, 'acara', e.target.value)}
                placeholder="Nama acara..."
                className="flex-1 bg-[#0f172a] border border-[#1e293b] text-[#f1f5f9] rounded-xl px-3 py-2 text-sm outline-none placeholder-[#334155]"
              />
              {/* Hapus */}
              <button type="button" onClick={() => remove(r.id)}
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 hover:bg-red-900/40 flex items-center justify-center text-sm transition-colors">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button type="button" onClick={add}
          className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-dashed border-[#1e293b] text-[#64748b] hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors">
          + Tambah Acara
        </button>
        {list.length > 0 && (
          <button type="button" onClick={loadDefault}
            className="px-3 py-2.5 rounded-xl text-xs text-[#64748b] border border-[#1e293b] hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors">
            Reset Default
          </button>
        )}
      </div>
      <p className="text-xs text-[#334155]">Urutkan dengan ▲▼ — akan ditampilkan sesuai urutan ini di undangan</p>
    </div>
  )
}

function StepAcara({ form, set }: { form: WeddingForm; set: (k: keyof WeddingForm, v: any) => void }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Akad Nikah" icon="business-outline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tanggal & Waktu" value={form.akad_tanggal} onChange={v => set('akad_tanggal', v)} type="datetime-local" required/>
          <Input label="Nama Tempat" value={form.akad_lokasi} onChange={v => set('akad_lokasi', v)} placeholder="Masjid Al-Ikhlas" required/>
        </div>
        <Input label="Alamat Lengkap" value={form.akad_alamat} onChange={v => set('akad_alamat', v)} placeholder="Jl. Merdeka No. 1, Jakarta Selatan"/>
        <Input label="Link Google Maps" value={form.akad_maps_url} onChange={v => set('akad_maps_url', v)} placeholder="https://maps.google.com/..." hint="Klik share di Google Maps lalu copy link-nya"/>
      </SectionCard>
      <SectionCard title="Resepsi Pernikahan" icon="wine-outline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tanggal & Waktu" value={form.resepsi_tanggal} onChange={v => set('resepsi_tanggal', v)} type="datetime-local" required/>
          <Input label="Nama Tempat" value={form.resepsi_lokasi} onChange={v => set('resepsi_lokasi', v)} placeholder="Grand Ballroom Hotel Mulia" required/>
        </div>
        <Input label="Alamat Lengkap" value={form.resepsi_alamat} onChange={v => set('resepsi_alamat', v)} placeholder="Jl. Asia Afrika No. 8, Jakarta Pusat"/>
        <Input label="Link Google Maps" value={form.resepsi_maps_url} onChange={v => set('resepsi_maps_url', v)} placeholder="https://maps.google.com/..."/>
      </SectionCard>

      <SectionCard title="Rundown Acara" icon="list-outline">
        <p className="text-xs text-[#94a3b8] -mt-2">Susunan acara yang akan ditampilkan di undangan.</p>
        <RundownManager
          list={form.rundown_list}
          onChange={v => set('rundown_list', v)}
        />
      </SectionCard>
    </div>
  )
}


// ─── BgSectionManager ─────────────────────────────────────────────────────────
const BG_SECTIONS_CONFIG = [
  { key: 'cover',    label: '🖼️ Cover',    hint: 'Halaman pembuka undangan' },
  { key: 'mempelai', label: '💑 Mempelai', hint: 'Section foto & nama mempelai' },
  { key: 'acara',    label: '📅 Acara',    hint: 'Section detail akad & resepsi' },
  { key: 'galeri',   label: '🖼️ Galeri',   hint: 'Section foto prewedding' },
  { key: 'footer',   label: '🌿 Footer',   hint: 'Bagian penutup undangan' },
] as const

function extractYouTubeId(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)
  return m ? m[1] : ''
}

function BgSingleSection({
  sectionKey, label, hint, value, onChange, orderId, client
}: {
  sectionKey: string
  label: string
  hint: string
  value: BgSection | undefined
  onChange: (v: BgSection | undefined) => void
  orderId: string
  client?: SupabaseClient
}) {
  const db = client || supabase
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const type = value?.type || 'default'
  const url  = value?.url  || ''
  const overlay = value?.overlay ?? 0.4

  function setType(t: BgSection['type']) {
    if (t === 'default') { onChange(undefined); return }
    onChange({ type: t, url: '', overlay: 0.4 })
  }
  function setUrl(u: string)     { onChange({ type, url: u, overlay }) }
  function setOverlay(o: number) { onChange({ type, url, overlay: o }) }

  async function uploadFoto(files: FileList | null) {
    if (!files || !files[0]) return
    const file = files[0]
    if (!file.type.startsWith('image/')) { alert('Hanya file gambar'); return }
    if (file.size > 15 * 1024 * 1024)   { alert('Maksimal 15MB'); return }
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${orderId}/bg-${sectionKey}-${Date.now()}.${ext}`
    const { data, error } = await db.storage
      .from('wedding-photos')
      .upload(path, file, { cacheControl: '3600', upsert: true })
    if (!error && data) {
      const { data: { publicUrl } } = db.storage.from('wedding-photos').getPublicUrl(data.path)
      onChange({ type: 'foto', url: publicUrl, overlay })
    } else {
      alert('Upload gagal: ' + error?.message)
    }
    setUploading(false)
  }

  const ytId = type === 'youtube' ? extractYouTubeId(url) : ''

  return (
    <div className="rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] dark:bg-[#0f172a]">
        <div>
          <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">{label}</p>
          <p className="text-xs text-[#94a3b8]">{hint}</p>
        </div>
        {type !== 'default' && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-primary-800 dark:text-[#60a5fa] uppercase tracking-wider">
            Custom
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Type selector */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { value: 'default', icon: 'color-palette-outline', label: 'Default'  },
            { value: 'foto',    icon: 'image-outline', label: 'Foto'     },
            { value: 'youtube', icon: 'logo-youtube', label: 'YouTube'  },
            { value: 'video',   icon: 'videocam-outline', label: 'Video URL'},
          ].map(opt => (
            <button key={opt.value}
              onClick={() => setType(opt.value as BgSection['type'])}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl border text-center transition-all ${
                type === opt.value
                  ? 'border-[#3B82F6] bg-[#3B82F6]/8 dark:bg-[#3B82F6]/15'
                  : 'border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#3B82F6]/50'
              }`}>
              <ion-icon name={opt.icon} style={{ fontSize: 16, marginBottom: 2 }}></ion-icon>
              <span className={`text-[10px] font-medium leading-none ${type === opt.value ? 'text-primary-800 dark:text-[#60a5fa]' : 'text-[#94a3b8]'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        {/* Foto upload */}
        {type === 'foto' && (
          <div className="space-y-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => uploadFoto(e.target.files)}/>
            {url ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                <img src={url} alt="" className="w-full h-full object-cover" style={{opacity: 1 - overlay}}/>
                <div className="absolute inset-0 bg-black" style={{opacity: overlay}}/>
                <button onClick={() => { onChange({ type: 'foto', url: '', overlay }); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                  ✕
                </button>
                <button onClick={() => inputRef.current?.click()}
                  className="absolute bottom-2 right-2 text-xs bg-white/90 text-[#0f172a] px-2 py-1 rounded-lg font-medium">
                  Ganti
                </button>
              </div>
            ) : (
              <button onClick={() => inputRef.current?.click()} disabled={uploading}
                className="w-full border-2 border-dashed border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#3B82F6] rounded-xl py-6 text-center transition-colors">
                <p className="text-2xl mb-1 text-[#94a3b8]">{uploading ? <ion-icon name="sync-outline" class="animate-spin"></ion-icon> : <ion-icon name="cloud-upload-outline"></ion-icon>}</p>
                <p className="text-sm text-[#64748b]">{uploading ? 'Mengupload...' : 'Upload foto background'}</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">JPG, PNG · Max 15MB</p>
              </button>
            )}
          </div>
        )}

        {/* YouTube URL */}
        {type === 'youtube' && (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-[#4a6a4e] dark:text-[#8aaa90] mb-1">Link YouTube</label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-[#f1f5f9] outline-none focus:border-[#3B82F6]"
              />
            </div>
            {ytId && (
              <div className="rounded-xl overflow-hidden aspect-video bg-black relative">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=0&mute=1&controls=1&rel=0`}
                  className="w-full h-full"
                  allowFullScreen
                  title="Preview YouTube"
                />
              </div>
            )}
            {!ytId && url && (
              <p className="text-xs text-red-500">❌ Link YouTube tidak valid</p>
            )}
          </div>
        )}

        {/* Video URL langsung */}
        {type === 'video' && (
          <div>
            <label className="block text-xs font-medium text-[#4a6a4e] dark:text-[#8aaa90] mb-1">URL Video (mp4)</label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#e2e8f0] dark:border-[#1e293b] bg-white dark:bg-[#0f172a] text-[#0f172a] dark:text-[#f1f5f9] outline-none focus:border-[#3B82F6]"
            />
            {url && (
              <video src={url} className="w-full rounded-xl mt-2 aspect-video object-cover" muted controls/>
            )}
          </div>
        )}

        {/* Overlay slider — tampil jika ada media */}
        {type !== 'default' && (url || type === 'foto') && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#4a6a4e] dark:text-[#8aaa90]">
                Gelap overlay
              </label>
              <span className="text-xs font-bold text-primary-800 dark:text-[#60a5fa]">
                {Math.round(overlay * 100)}%
              </span>
            </div>
            <input
              type="range" min="0" max="80" step="5"
              value={Math.round(overlay * 100)}
              onChange={e => setOverlay(Number(e.target.value) / 100)}
              className="w-full accent-[#3B82F6]"
            />
            <div className="flex justify-between text-[10px] text-[#94a3b8] mt-0.5">
              <span>Terang</span><span>Gelap</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BgSectionManager({
  value, onChange, orderId, client
}: {
  value: BgSections
  onChange: (v: BgSections) => void
  orderId: string
  client?: SupabaseClient
}) {
  const [expanded, setExpanded] = useState(false)
  const customCount = Object.values(value).filter(Boolean).length

  return (
    <div className="space-y-3">
      {/* Toggle expand */}
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
          customCount > 0
            ? 'border-[#3B82F6] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10'
            : 'border-[#e2e8f0] dark:border-[#1e293b] bg-[#f8fafc] dark:bg-[#0f172a]'
        }`}>
        <div className="flex items-center gap-3">
          <ion-icon name="color-palette-outline" style={{ fontSize: 20, color: '#94a3b8' }}></ion-icon>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f1f5f9]">
              Custom Background
              {customCount > 0 && (
                <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#3B82F6] text-white">
                  {customCount} aktif
                </span>
              )}
            </p>
            <p className="text-xs text-[#94a3b8]">Atur background tiap section</p>
          </div>
        </div>
        <ion-icon name="chevron-down-outline" style={{ color: '#94a3b8', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}></ion-icon>
      </button>

      {expanded && (
        <div className="space-y-3">
          {BG_SECTIONS_CONFIG.map(cfg => (
            <BgSingleSection
              key={cfg.key}
              sectionKey={cfg.key}
              label={cfg.label}
              hint={cfg.hint}
              value={value[cfg.key as keyof BgSections]}
              onChange={v => onChange({
                ...value,
                [cfg.key]: v
              })}
              orderId={orderId}
              client={client}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StepMedia({ form, set, orderId, client }: { form: WeddingForm; set: (k: keyof WeddingForm, v: any) => void; orderId: string; client?: SupabaseClient }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Foto Prewedding" icon="camera-outline">
        <p className="text-xs text-[#94a3b8] -mt-2">Upload langsung di sini, maksimal 20 foto.</p>
        <PhotoUpload
          orderId={orderId}
          urls={form.foto_urls}
          onChange={v => set('foto_urls', v)}
          client={client}
        />
      </SectionCard>
      <SectionCard title="Video & Musik" icon="musical-notes-outline">
        <Input label="Link Video YouTube" value={form.video_youtube_url} onChange={v => set('video_youtube_url', v)}
          placeholder="https://youtube.com/watch?v=..." hint="Video prewedding / save the date (opsional)"/>
        <Input label="Musik Latar" value={form.musik_pilihan} onChange={v => set('musik_pilihan', v)}
          placeholder="nama lagu atau link YouTube" hint="Musik yang diputar saat tamu membuka undangan"/>
        <Input label="Hashtag Instagram" value={form.hashtag_instagram} onChange={v => set('hashtag_instagram', v)}
          placeholder="#RezaDanNadya2025"/>
      </SectionCard>
      <SectionCard title="Background Custom" icon="color-palette-outline">
        <p className="text-xs text-[#94a3b8] -mt-2">
          Atur background tiap section — foto, video YouTube, atau mp4 URL.
        </p>
        <BgSectionManager
          value={form.bg_sections}
          onChange={v => set('bg_sections', v)}
          orderId={orderId}
          client={client}
        />
      </SectionCard>
    </div>
  )
}

function StepFitur({ form, set }: { form: WeddingForm; set: (k: keyof WeddingForm, v: any) => void }) {
  return (
    <div className="space-y-4">

      <SectionCard title="Kata-kata Pembuka" icon="book-outline">
        <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mb-3">
          Ayat / kata-kata yang ditampilkan di halaman pembuka undangan
        </p>

        {/* Pilihan preset */}
        <div className="space-y-2 mb-3">
          {[
            {
              value: 'quran',
              label: '☪️ QS. Ar-Rum : 21',
              preview: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya..." — QS. Ar-Rum : 21'
            },
            {
              value: 'bible',
              label: '✝️ Matius 19:6',
              preview: '"Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia." — Matius 19:6'
            },
            {
              value: 'custom',
              label: '✍️ Tulis Sendiri',
              preview: null
            },
          ].map(opt => (
            <label key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                form.kata_kata_pilihan === opt.value
                  ? 'border-[#3B82F6] bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10'
                  : 'border-[#e2e8f0] dark:border-[#1e293b] hover:border-[#3B82F6]/40'
              }`}
            >
              <input
                type="radio"
                name="kata_kata_pilihan"
                value={opt.value}
                checked={form.kata_kata_pilihan === opt.value}
                onChange={() => set('kata_kata_pilihan', opt.value)}
                className="mt-0.5 accent-[#3B82F6]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] dark:text-[#f1f5f9]">{opt.label}</p>
                {opt.preview && form.kata_kata_pilihan === opt.value && (
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 leading-relaxed italic">
                    {opt.preview}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Input custom */}
        {form.kata_kata_pilihan === 'custom' && (
          <Textarea
            label="Kata-kata Pilihan"
            value={form.kata_kata_custom}
            onChange={v => set('kata_kata_custom', v)}
            placeholder="Tuliskan ayat, puisi, atau kata-kata yang bermakna untuk kalian berdua..."
            rows={4}
            hint="Bisa berupa ayat kitab suci, puisi, atau quote favorit"
          />
        )}
      </SectionCard>

      <SectionCard title="Amplop Digital" icon="wallet-outline">
        <Toggle label="Aktifkan Amplop Digital" value={form.fitur_amplop_digital} onChange={v => set('fitur_amplop_digital', v)}
          hint="Tampilkan rekening untuk tamu yang ingin memberi hadiah uang"/>
        {form.fitur_amplop_digital && (
          <div className="space-y-3">
            <RekeningManager
              list={form.rekening_list}
              onChange={v => set('rekening_list', v)}
            />
            <Input label="Alamat Kirim Kado (opsional)" value={form.alamat_kado} onChange={v => set('alamat_kado', v)}
              placeholder="Jl. Merdeka No. 1, Jakarta..." hint="Untuk tamu yang ingin kirim kado fisik"/>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Cerita Cinta" icon="heart-outline">
        <Toggle label="Tampilkan Cerita Cinta" value={form.fitur_cerita_cinta} onChange={v => set('fitur_cerita_cinta', v)}
          hint="Timeline pertemuan, jadian, dan lamaran kalian"/>
        {form.fitur_cerita_cinta && (
          <div className="space-y-3">
            <Textarea label="Cerita Pertemuan" value={form.cerita_pertemuan} onChange={v => set('cerita_pertemuan', v)}
              placeholder="Kami pertama kali bertemu di..." rows={3}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Tanggal Jadian" value={form.tanggal_jadian} onChange={v => set('tanggal_jadian', v)} type="date"/>
              <Input label="Tanggal Lamaran" value={form.tanggal_lamaran} onChange={v => set('tanggal_lamaran', v)} type="date"/>
            </div>
            <Textarea label="Cerita Lamaran" value={form.engagement_story} onChange={v => set('engagement_story', v)}
              placeholder="Momen lamaran yang tak terlupakan..." rows={3}/>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Catatan Tambahan" icon="pencil-outline">
        <Textarea label="Ada permintaan khusus?" value={form.catatan_tambahan} onChange={v => set('catatan_tambahan', v)}
          placeholder="Warna tema, font pilihan, urutan foto, atau hal lain..." rows={4}
          hint="Opsional — tulis jika ada detail tambahan untuk tim kami"/>
      </SectionCard>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function IsiDataInner({ embeddedOrderId }: { embeddedOrderId?: string }) {
  const params   = useSearchParams()
  const urlOrderId = params.get('order')
  const orderId  = embeddedOrderId || urlOrderId || ''
  const token    = params.get('token') || ''   // edit token untuk autentikasi customer
  const isEmbedded = !!embeddedOrderId
  const isAdmin  = params.get('admin') === '1' || isEmbedded // admin bypass (dari dashboard)

  // Use auth client when embedded in dashboard for proper RLS
  const db = isEmbedded ? supabaseAuth : supabase

  const [step,         setStep]         = useState<Step>('mempelai_pria')
  const [form,         setForm]         = useState<WeddingForm>(EMPTY)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [saved,        setSaved]        = useState(false)
  const [tokenValid,   setTokenValid]   = useState<boolean | null>(null) // null = checking
  const [tokenChecked, setTokenChecked] = useState(false)
  const [dataLoaded,   setDataLoaded]   = useState(false)

  // Load existing wedding data on mount
  useEffect(() => {
    if (!orderId || dataLoaded) return
    async function loadExisting() {
      try {
        const { data, error: loadErr } = await db
          .from('wedding_data')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle()
        
        if (!loadErr && data) {
          // Map DB columns back to form fields
          const loaded: Partial<WeddingForm> = {}
          const fieldMap: Record<string, keyof WeddingForm> = {
            pria_nama_lengkap: 'pria_nama_lengkap', pria_nama_panggilan: 'pria_nama_panggilan',
            pria_gelar: 'pria_gelar', pria_nama_ayah: 'pria_nama_ayah',
            pria_status_ayah: 'pria_status_ayah', pria_nama_ibu: 'pria_nama_ibu',
            pria_status_ibu: 'pria_status_ibu', pria_foto_url: 'pria_foto_url',
            wanita_nama_lengkap: 'wanita_nama_lengkap', wanita_nama_panggilan: 'wanita_nama_panggilan',
            wanita_gelar: 'wanita_gelar', wanita_nama_ayah: 'wanita_nama_ayah',
            wanita_status_ayah: 'wanita_status_ayah', wanita_nama_ibu: 'wanita_nama_ibu',
            wanita_status_ibu: 'wanita_status_ibu', wanita_foto_url: 'wanita_foto_url',
            akad_tanggal: 'akad_tanggal', akad_lokasi: 'akad_lokasi',
            akad_alamat: 'akad_alamat', akad_maps_url: 'akad_maps_url',
            resepsi_tanggal: 'resepsi_tanggal', resepsi_lokasi: 'resepsi_lokasi',
            resepsi_alamat: 'resepsi_alamat', resepsi_maps_url: 'resepsi_maps_url',
            video_youtube_url: 'video_youtube_url', musik_pilihan: 'musik_pilihan',
            hashtag_instagram: 'hashtag_instagram', foto_urls: 'foto_urls',
            rekening_list: 'rekening_list', alamat_kado: 'alamat_kado',
            cerita_pertemuan: 'cerita_pertemuan', tanggal_jadian: 'tanggal_jadian',
            tanggal_lamaran: 'tanggal_lamaran', engagement_story: 'engagement_story',
            fitur_amplop_digital: 'fitur_amplop_digital', fitur_cerita_cinta: 'fitur_cerita_cinta',
            catatan_tambahan: 'catatan_tambahan', rundown_list: 'rundown_list',
            kata_kata_pilihan: 'kata_kata_pilihan', kata_kata_custom: 'kata_kata_custom',
            bg_sections: 'bg_sections',
          }
          for (const [dbKey, formKey] of Object.entries(fieldMap)) {
            if (data[dbKey] !== undefined && data[dbKey] !== null) {
              (loaded as any)[formKey] = data[dbKey]
            }
          }
          setForm(f => ({ ...f, ...loaded }))
          console.log('[IsiDataInner] Loaded existing wedding data')
        } else {
          console.log('[IsiDataInner] No existing wedding data found, starting fresh')
        }
      } catch (e) {
        console.error('[IsiDataInner] Error loading existing data:', e)
      }
      setDataLoaded(true)
    }
    loadExisting()
  }, [orderId, dataLoaded, db])

  // Validasi token saat mount
  useEffect(() => {
    if (!orderId) { setTokenValid(false); setTokenChecked(true); return }
    // Admin bypass — tidak perlu token
    if (isAdmin) { setTokenValid(true); setTokenChecked(true); return }
    if (!token)  { setTokenValid(false); setTokenChecked(true); return }

    db.rpc('validate_edit_token', { p_order_id: orderId, p_token: token })
      .then(({ data, error }) => {
        setTokenValid(!error && data === true)
        setTokenChecked(true)
      })
  }, [orderId, token, isAdmin, db])

  const stepIdx = STEPS.findIndex(s => s.id === step)

  function set(key: keyof WeddingForm, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function saveProgress(nextStep?: Step) {
    if (!orderId) return
    setSaving(true); setError(null)
    try {
      console.log('[saveProgress] Sending data to upsert_wedding_data:', { orderId, form })
      const { data, error: err } = await db.rpc('upsert_wedding_data', {
        p_order_id: orderId,
        p_data: form,
      })
      console.log('[saveProgress] RPC response:', { data, error: err })
      if (err) {
        console.error('[saveProgress] RPC error details:', JSON.stringify(err, null, 2))
        throw err
      }
      if (nextStep) setStep(nextStep)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch (e: any) {
      console.error('[saveProgress] Failed to save:', e)
      const errorMsg = e?.message || e?.details || JSON.stringify(e)
      setError('Gagal menyimpan: ' + errorMsg)
    }
    setSaving(false)
  }

  // Auto-save when embedded (debounced, every 30 seconds of inactivity)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!isEmbedded || !orderId || !dataLoaded) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await db.rpc('upsert_wedding_data', { p_order_id: orderId, p_data: form })
        console.log('[autoSave] Draft saved')
      } catch (e) {
        console.error('[autoSave] Failed:', e)
      }
    }, 30000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [form, isEmbedded, orderId, dataLoaded, db])

  // ── Belum selesai cek token ──
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <div className="text-center">
          <ion-icon name="sync-outline" class="animate-spin" style={{ fontSize: 36, color: '#3B82F6', marginBottom: 12, display: 'block', margin: '0 auto' }}></ion-icon>
          <p className="text-sm text-[#64748b]">Memverifikasi akses...</p>
        </div>
      </div>
    )
  }

  // ── Token tidak valid / tidak ada ──
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4 text-[#64748b]"><ion-icon name="lock-closed-outline"></ion-icon></p>
          <p className="text-lg font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">Akses Ditolak</p>
          <p className="text-sm text-[#64748b] mb-6 leading-relaxed">
            Link ini tidak valid atau sudah kadaluarsa.<br/>
            Gunakan link yang dikirim via WhatsApp dari tim Katresnan.
          </p>
          <a href="https://wa.me/6285150000715" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-bold px-6 py-3 rounded-2xl">
            💬 Hubungi Admin
          </a>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4 text-amber-500"><ion-icon name="warning-outline"></ion-icon></p>
          <p className="text-lg font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">Order ID tidak ditemukan</p>
          <p className="text-sm text-[#64748b] mb-6">Akses halaman ini melalui link setelah checkout.</p>
          <a href="/" className="text-primary-800 dark:text-[#60a5fa] underline text-sm">Kembali ke beranda</a>
        </div>
      </div>
    )
  }

  if (step === 'selesai') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] px-4">
        <div className="max-w-md w-full text-center py-12 space-y-6">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-5xl mx-auto"
            style={{ animation: 'float 3s ease-in-out infinite' }}><ion-icon name="checkmark-circle-outline" style={{ color: '#22c55e' }}></ion-icon></div>
          <div>
            <h2 className="font-display text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-2">Data Tersimpan!</h2>
            <p className="text-[#64748b] dark:text-[#94a3b8] leading-relaxed">
              Tim kami akan segera mengerjakan undangan digital kamu.<br/>
              Kami akan menghubungi via WhatsApp untuk preview & revisi.
            </p>
          </div>
          <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-5 text-left space-y-2 text-sm">
            <p className="font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-3">📋 Langkah selanjutnya:</p>
            {['⏳ Tunggu preview undangan dalam 1x24 jam','✏️ Cek & minta revisi jika ada','📲 Bagikan link undangan ke tamu'].map((t,i) => (
              <div key={i} className="flex items-start gap-2 text-[#64748b] dark:text-[#94a3b8]">
                <span>{t.split(' ')[0]}</span><span>{t.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
          <a href={`https://wa.me/6285150000715?text=${encodeURIComponent('Halo Katresnan! Saya sudah mengisi data pengantin untuk Order #' + orderId.slice(0,8).toUpperCase() + '. Siap lanjut!')}`}
            target="_blank" rel="noopener noreferrer"
            className="block w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-2xl transition-colors text-sm">
            💬 Konfirmasi ke WhatsApp Admin
          </a>
          <a href={`/order?id=${orderId.slice(0,8).toUpperCase()}`}
            className="block text-sm text-primary-800 dark:text-[#60a5fa] underline">
            Pantau status order →
          </a>
        </div>
      </div>
    )
  }

  const ORDER: Step[] = ['mempelai_pria','mempelai_wanita','acara','media','fitur','selesai']

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
      <div className="sticky top-0 z-40 bg-[#f8fafc]/97 dark:bg-[#020617]/97 backdrop-blur border-b border-[#e2e8f0] dark:border-[#1e293b] px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <KatresnanLogo variant="auto" height={24} />
            <div>
              <p className="font-bold text-sm text-[#0f172a] dark:text-[#f1f5f9]">Isi Data Pengantin</p>
              <p className="text-xs text-[#94a3b8]">Order #{orderId.slice(0,8).toUpperCase()}</p>
            </div>
            {saved && <span className="ml-auto text-xs text-green-600 dark:text-green-400 font-medium animate-pulse">✓ Tersimpan</span>}
          </div>
          <StepIndicator current={step}/>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#0f172a] dark:text-[#f1f5f9]">
            <ion-icon name={STEPS[stepIdx].icon} style={{ marginRight: 8, transform: 'translateY(2px)' }}></ion-icon> {STEPS[stepIdx].label}
          </h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">Langkah {stepIdx + 1} dari {STEPS.length - 1}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        {step === 'mempelai_pria'   && <StepMempelaiPria   form={form} set={set} orderId={orderId} client={db}/>}
        {step === 'mempelai_wanita' && <StepMempelaiWanita form={form} set={set} orderId={orderId} client={db}/>}
        {step === 'acara'           && <StepAcara          form={form} set={set}/>}
        {step === 'media'           && <StepMedia          form={form} set={set} orderId={orderId} client={db}/>}
        {step === 'fitur'           && <StepFitur          form={form} set={set}/>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/97 dark:bg-[#0f172a]/97 backdrop-blur border-t border-[#e2e8f0] dark:border-[#1e293b] px-4 py-4 z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          {stepIdx > 0 && (
            <button onClick={() => setStep(ORDER[stepIdx - 1] as Step)}
              className="flex-1 sm:flex-none px-6 py-3 border-2 border-[#e2e8f0] dark:border-[#1e293b] text-[#64748b] dark:text-[#94a3b8] font-semibold rounded-xl text-sm hover:border-[#3B82F6] transition-colors">
              ← Kembali
            </button>
          )}
          <button onClick={() => saveProgress(ORDER[stepIdx + 1] as Step)} disabled={saving}
            className="flex-1 bg-[#3B82F6] hover:bg-[#2563eb] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg">
            {saving
              ? <><ion-icon name="sync-outline" class="animate-spin"></ion-icon> Menyimpan...</>
              : step === 'fitur' ? <><ion-icon name="paper-plane-outline"></ion-icon> Selesai & Kirim Data</> : 'Lanjut →'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IsiDataContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
        <div className="text-center">
          <div className="text-5xl mb-4 text-[#3B82F6]"><ion-icon name="sync-outline" class="animate-spin"></ion-icon></div>
          <p className="text-[#64748b] dark:text-[#94a3b8]">Memuat form...</p>
        </div>
      </div>
    }>
      <IsiDataInner/>
    </Suspense>
  )
}