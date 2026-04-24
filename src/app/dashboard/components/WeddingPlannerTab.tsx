'use client'
import { useState, useMemo, useEffect, useCallback, Fragment } from 'react'
import { supabase } from '@/lib/supabase'

type PlannerTab = 'calendar' | 'checklist' | 'engagement' | 'prewedding' | 'seserahan' | 'administrasi' | 'budget' | 'vendor'

const tabs: { id: PlannerTab; label: string; icon: string }[] = [
  { id: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
  { id: 'checklist', label: 'Checklist', icon: 'checkbox-outline' },
  { id: 'engagement', label: 'Engagement', icon: 'heart-outline' },
  { id: 'prewedding', label: 'Pre-Wedding', icon: 'camera-outline' },
  { id: 'seserahan', label: 'Seserahan', icon: 'gift-outline' },
  { id: 'administrasi', label: 'Administrasi', icon: 'document-text-outline' },
  { id: 'budget', label: 'Budget', icon: 'wallet-outline' },
  { id: 'vendor', label: 'Vendor', icon: 'people-outline' },
]


export default function WeddingPlannerTab({ orderId, showToast, settings, onRefresh }: any) {

  useEffect(() => {
    if (settings) {
      if (settings.planner_checklist && settings.planner_checklist.length > 0) setChecklistItems(settings.planner_checklist);
      if (settings.planner_engagement && settings.planner_engagement.length > 0) setEngagementItems(settings.planner_engagement);
      if (settings.planner_prewedding && settings.planner_prewedding.length > 0) setPreweddingItems(settings.planner_prewedding);
      if (settings.planner_administrasi && settings.planner_administrasi.length > 0) setAdministrasiItems(settings.planner_administrasi);
      if (settings.planner_vendor && settings.planner_vendor.length > 0) setVendorItems(settings.planner_vendor);
      if (settings.planner_seserahan && settings.planner_seserahan.length > 0) setSeserahanItems(settings.planner_seserahan);
      if (settings.planner_budget && settings.planner_budget.length > 0) setBudgetItems(settings.planner_budget);
    }
  }, [settings]);

  const [activeTab, setActiveTab] = useState<PlannerTab>('calendar')
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAgendaModal, setShowAgendaModal] = useState(false)
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<Date | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [weddingDateInput, setWeddingDateInput] = useState('')
  const [coupleName, setCoupleName] = useState('')
  const [venue, setVenue] = useState('')
  const [checklistItems, setChecklistItems] = useState<{ id: number; text: string; done: boolean; category: string }[]>([
    { id: 1, text: 'Daftar pernikahan ke KUA', done: false, category: 'KUA' },
    { id: 2, text: 'Rias pengantin', done: false, category: 'MUA' },
    { id: 3, text: 'Nail art', done: false, category: 'MUA' },
    { id: 4, text: 'Henna wedding', done: false, category: 'MUA' },
    { id: 5, text: 'Rias orang tua dan besan', done: false, category: 'MUA' },
    { id: 6, text: 'Baju pengantin akad', done: false, category: 'MUA' },
    { id: 7, text: 'Baju pengantin resepsi', done: false, category: 'MUA' },
    { id: 8, text: 'Baju orang tua dan besan', done: false, category: 'MUA' },
    { id: 9, text: 'Baju pendamping (pagar ayu)', done: false, category: 'MUA' },
    { id: 10, text: 'Mahar', done: false, category: 'Mahar dan Seserahan' },
    { id: 11, text: 'Cincin Nikah', done: false, category: 'Mahar dan Seserahan' },
    { id: 12, text: 'Kotak cincin', done: false, category: 'Mahar dan Seserahan' },
    { id: 13, text: 'Seserahan', done: false, category: 'Mahar dan Seserahan' },
    { id: 14, text: 'Kotak seserahan', done: false, category: 'Mahar dan Seserahan' },
    { id: 15, text: 'Dekorasi', done: false, category: 'Venue/lokasi' },
    { id: 16, text: 'Tenda', done: false, category: 'Venue/lokasi' },
    { id: 17, text: 'Prewed', done: false, category: 'Dokumentasi' },
    { id: 18, text: 'Photografer', done: false, category: 'Dokumentasi' },
    { id: 19, text: 'Videografer', done: false, category: 'Dokumentasi' },
    { id: 20, text: 'Wedding Content Creator', done: false, category: 'Dokumentasi' },
    { id: 21, text: 'MC', done: false, category: 'Pengisi Acara' },
    { id: 22, text: 'Tilawah', done: false, category: 'Pengisi Acara' },
    { id: 23, text: 'Sambutan', done: false, category: 'Pengisi Acara' },
    { id: 24, text: 'Hiburan', done: false, category: 'Pengisi Acara' },
    { id: 25, text: 'Catering', done: false, category: 'Makanan' },
    { id: 26, text: 'Snack', done: false, category: 'Makanan' },
    { id: 27, text: 'Daftar tamu undangan', done: false, category: 'Undangan & Souvenir' },
    { id: 28, text: 'Undangan digital', done: false, category: 'Undangan & Souvenir' },
    { id: 29, text: 'Undangan cetak', done: false, category: 'Undangan & Souvenir' },
    { id: 30, text: 'Buku tamu', done: false, category: 'Undangan & Souvenir' },
    { id: 31, text: 'Souvenir', done: false, category: 'Undangan & Souvenir' },
    { id: 32, text: 'WO', done: false, category: 'Lain-lain' },
    { id: 33, text: 'Rundown acara', done: false, category: 'Lain-lain' },
    { id: 34, text: 'Susunan panitia', done: false, category: 'Lain-lain' },
    { id: 35, text: 'Briefing vendor', done: false, category: 'Lain-lain' },
    { id: 36, text: 'Briefing keluarga', done: false, category: 'Lain-lain' },
    { id: 37, text: 'Izin cuti menikah', done: false, category: 'Lain-lain' },
    { id: 38, text: 'Bridesmaid', done: false, category: 'Lain-lain' },
  ])

  const [engagementItems, setEngagementItems] = useState([
    { id: 1, category: 'VANUE', detail: 'Dekor', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 2, category: 'VANUE', detail: 'Tenda', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 3, category: 'DOKUMENTASI', detail: 'Photografer', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 4, category: 'DOKUMENTASI', detail: 'Videografer / WCC', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 5, category: 'MAKE UP', detail: 'Make up', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 6, category: 'MAKE UP', detail: 'Soflens', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 7, category: 'MAKE UP', detail: 'Nail art', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 8, category: 'PAKAIAN', detail: 'Kain', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 9, category: 'PAKAIAN', detail: 'Batik pria', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 10, category: 'PAKAIAN', detail: 'Dress wanita', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 11, category: 'KONSUMSI', detail: 'Snack', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 12, category: 'KONSUMSI', detail: 'Catering', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 13, category: 'SESERAHAN & HANTARAN', detail: 'Seserahan', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 14, category: 'SESERAHAN & HANTARAN', detail: 'Hantaran (makanan)', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 15, category: 'LAIN-LAIN', detail: 'MC', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 16, category: 'LAIN-LAIN', detail: 'Bucket', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
    { id: 17, category: 'LAIN-LAIN', detail: 'Transport', status: '-', vendor: '-', cpp: 0, cpw: 0, keterangan: '-' },
  ])

  const [preweddingItems, setPreweddingItems] = useState([
    { id: 1, item: 'Make up', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 2, item: 'Hairdo', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 3, item: 'Nail art', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 4, item: 'Baju pria', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 5, item: 'Baju wanita', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 6, item: 'Aksesoris', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 7, item: 'Photografer', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 8, item: 'Videografer', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 9, item: 'Transport', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
    { id: 10, item: 'Lokasi', vendor: '-', budget: 0, actual: 0, status: '-', keterangan: '-' },
  ])

  const [administrasiItems, setAdministrasiItems] = useState([
    { id: 1, dokumen: 'Pendaftaran KUA', pria: true, wanita: true, price: 0, keterangan: '-' },
    { id: 2, dokumen: 'FC KTP calon pengantin', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 3, dokumen: 'FC KTP ke dua orangtua', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 4, dokumen: 'FC KK (Kartu Keluarga)', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 5, dokumen: 'FC buku nikah orangtua', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 6, dokumen: 'FC akta kelahiran', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 7, dokumen: 'FC Ijazah terakhir', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 8, dokumen: 'FC KTP saksi pihak', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 9, dokumen: 'Materai 10.000', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 10, dokumen: 'Pas foto ukuran 2x3, 3x4 dan 4x6 background biru', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 11, dokumen: 'Surat pengantar dari RT/RW', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 12, dokumen: 'Surat keterangan sehat', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 13, dokumen: 'Surat N1, N2, N3, N4 dari kelurahan', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 14, dokumen: 'Surat N5 (surat izin orangtua) jika pengantin belum berusia 21 tahun', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 15, dokumen: 'Surat N6 (surat kematian) jika calon pengantin cerai mati', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 16, dokumen: 'Akta cerai jika calon pengantin cerai hidup', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 17, dokumen: 'Surat izin dari atasan jika pengantin TNI/POLRI', pria: false, wanita: false, price: 0, keterangan: '-' },
    { id: 18, dokumen: 'Lain-lain', pria: false, wanita: false, price: 0, keterangan: '-' },
  ])

  const [vendorItems, setVendorItems] = useState([
    { id: 1, vendor: '', jenis: 'Venue', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 2, vendor: '', jenis: 'Makanan', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 3, vendor: '', jenis: 'MUA', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 4, vendor: '', jenis: 'Transportasi', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 5, vendor: '', jenis: 'Ceremony', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 6, vendor: '', jenis: 'Dokumentasi', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
    { id: 7, vendor: '', jenis: 'Lain-lain', kontak: '', alamat: '', sosmed: '', pic: '', keterangan: '' },
  ])

  const [seserahanItems, setSeserahanItems] = useState([
    // Pihak Wanita
    { id: 1, pihak: 'wanita', category: 'PAKAIAN', detail: 'Dress', status: 'ORDER', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 2, pihak: 'wanita', category: 'PAKAIAN', detail: 'Dress', status: 'DONE', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 3, pihak: 'wanita', category: 'PAKAIAN', detail: 'Jilbab', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 4, pihak: 'wanita', category: 'PAKAIAN', detail: 'Jilbab', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 5, pihak: 'wanita', category: 'PERLENGKAPAN IBADAH', detail: "Al-Qur'an", status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 6, pihak: 'wanita', category: 'PERLENGKAPAN IBADAH', detail: 'Mukena', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 7, pihak: 'wanita', category: 'PERLENGKAPAN IBADAH', detail: 'Sajadah', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 8, pihak: 'wanita', category: 'PERLENGKAPAN IBADAH', detail: 'Tasbih', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 9, pihak: 'wanita', category: 'MAKEUP', detail: 'Primer', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 10, pihak: 'wanita', category: 'MAKEUP', detail: 'Foundation', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 11, pihak: 'wanita', category: 'MAKEUP', detail: 'Loose Powder', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    
    // Pihak Pria
    { id: 12, pihak: 'pria', category: 'PAKAIAN', detail: 'Kemeja', status: 'ORDER', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 13, pihak: 'pria', category: 'PAKAIAN', detail: 'Batik', status: 'DONE', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 14, pihak: 'pria', category: 'PAKAIAN', detail: 'Celana', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 15, pihak: 'pria', category: 'PAKAIAN', detail: 'Kaos', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 16, pihak: 'pria', category: 'PERLENGKAPAN IBADAH', detail: 'Sarung', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 17, pihak: 'pria', category: 'PERLENGKAPAN IBADAH', detail: 'Koko', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 18, pihak: 'pria', category: 'PERLENGKAPAN IBADAH', detail: 'Sajadah', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
    { id: 19, pihak: 'pria', category: 'PERLENGKAPAN IBADAH', detail: 'Peci', status: '-', brand: '-', budget: 0, realisasi: 0, keterangan: '-' },
  ])

  const [seserahanTab, setSeserahanTab] = useState<'wanita' | 'pria'>('wanita')

  const [budgetItems, setBudgetItems] = useState([
    { id: 1, category: '1. MUA', nama: 'Rias pengantin set baju', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 2, category: '1. MUA', nama: 'Nail art', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 3, category: '1. MUA', nama: 'Henna', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 4, category: '2. MAHAR', nama: 'Perhiasan', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 5, category: '2. MAHAR', nama: 'Logam mulia', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 6, category: '2. MAHAR', nama: 'Cincin nikah', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 7, category: '2. MAHAR', nama: 'Kotak cincin', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 8, category: '2. MAHAR', nama: 'Kotak seserahan', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 9, category: '3. DOKUMENTASI', nama: 'Preweeding', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 10, category: '3. DOKUMENTASI', nama: 'Photografer', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 11, category: '3. DOKUMENTASI', nama: 'Videografer', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 12, category: '3. DOKUMENTASI', nama: 'Wedding Content Creator', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 13, category: '4. TEMPAT', nama: 'Vanue', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 14, category: '4. TEMPAT', nama: 'Dekor', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 15, category: '4. TEMPAT', nama: 'Tenda', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 16, category: '5. PENGISI ACARA', nama: 'MC', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 17, category: '5. PENGISI ACARA', nama: 'Tilawah', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 18, category: '5. PENGISI ACARA', nama: 'Sambutan', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 19, category: '5. PENGISI ACARA', nama: 'Hiburan', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 20, category: '6. MAKANAN', nama: 'Catering', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 21, category: '6. MAKANAN', nama: 'Snack', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 22, category: '7. UNDANGAN & SOUVENIR', nama: 'Daftar tamu undangan', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 23, category: '7. UNDANGAN & SOUVENIR', nama: 'Undangan online', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 24, category: '7. UNDANGAN & SOUVENIR', nama: 'Undangan cetak', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 25, category: '7. UNDANGAN & SOUVENIR', nama: 'Buku tamu', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
    { id: 26, category: '7. UNDANGAN & SOUVENIR', nama: 'Souvenir', status: 'BELUM', budget: 0, realisasi: 0, dpLunas: 0, sisaPembayaran: 0, paymentDate: '', keterangan: '' },
  ])

  const [showAddDataModal, setShowAddDataModal] = useState(false)
  const [addDataMode, setAddDataMode] = useState<'checklist' | 'engagement' | 'prewedding' | 'seserahan' | 'administrasi' | 'vendor' | 'budget'>('checklist')
  const [editItemId, setEditItemId] = useState<number | null>(null)
  // Target wedding date: 252 days from now (example)
  const weddingDate = new Date()
  weddingDate.setDate(weddingDate.getDate() + 252)
  const daysLeft = 252
  const hoursLeft = 19
  const minutesLeft = 5
  const totalTasks = checklistItems.length
  const doneTasks = checklistItems.filter(i => i.done).length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  // Calendar generation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const today = new Date()
    const days = []

    if (calendarView === 'week') {
      const currentDayOfWeek = currentMonth.getDay()
      const startOfWeek = new Date(currentMonth)
      startOfWeek.setDate(currentMonth.getDate() - currentDayOfWeek)
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        days.push({
          day: d.getDate(),
          current: d.getMonth() === month,
          isToday: d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(),
          fullDate: new Date(d)
        })
      }
      return days
    }

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month, 0 - i)
      days.push({ day: d.getDate(), current: false, isToday: false, fullDate: d })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d)
      days.push({
        day: d, current: true,
        isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        fullDate: dateObj
      })
    }
    // Next month padding
    while (days.length < 42) {
      const nextDayOffset: number = days.length - firstDay - daysInMonth + 1
      const d = new Date(year, month + 1, nextDayOffset)
      days.push({ day: d.getDate(), current: false, isToday: false, fullDate: d })
    }
    return days
  }, [currentMonth, calendarView])

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const dayHeaders = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']

  function prevMonth() {
    if (calendarView === 'week') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() - 7))
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, currentMonth.getDate()))
    }
  }
  function nextMonth() {
    if (calendarView === 'week') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), currentMonth.getDate() + 7))
    } else {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, currentMonth.getDate()))
    }
  }
  function goToday() {
    setCurrentMonth(new Date())
  }

  async function saveToDb(field: string, data: any) {
    if (!orderId) return
    const { error } = await supabase.from('wedding_settings').update({ [field]: data }).eq('order_id', orderId)
    if (error) {
      console.error(error)
      showToast?.('Gagal menyimpan ke database')
    } else {
      showToast?.('Data berhasil disimpan')
    }
  }

  function toggleChecklist(id: number) {
    const newItems = checklistItems.map(i => i.id === id ? { ...i, done: !i.done } : i)
    setChecklistItems(newItems)
    saveToDb('planner_checklist', newItems)
  }

  function handleDelete(mode: string, id: number) {
    if (!confirm('Apakah anda yakin ingin menghapus data ini?')) return
    if (mode === 'checklist') {
      const n = checklistItems.filter(i => i.id !== id); setChecklistItems(n); saveToDb('planner_checklist', n)
    } else if (mode === 'engagement') {
      const n = engagementItems.filter(i => i.id !== id); setEngagementItems(n); saveToDb('planner_engagement', n)
    } else if (mode === 'prewedding') {
      const n = preweddingItems.filter(i => i.id !== id); setPreweddingItems(n); saveToDb('planner_prewedding', n)
    } else if (mode === 'seserahan') {
      const n = seserahanItems.filter(i => i.id !== id); setSeserahanItems(n); saveToDb('planner_seserahan', n)
    } else if (mode === 'administrasi') {
      const n = administrasiItems.filter(i => i.id !== id); setAdministrasiItems(n); saveToDb('planner_administrasi', n)
    } else if (mode === 'vendor') {
      const n = vendorItems.filter(i => i.id !== id); setVendorItems(n); saveToDb('planner_vendor', n)
    } else if (mode === 'budget') {
      const n = budgetItems.filter(i => i.id !== id); setBudgetItems(n); saveToDb('planner_budget', n)
    }
  }

  function handleSaveData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const obj: any = { id: editItemId || Date.now() }
    formData.forEach((value, key) => { obj[key] = typeof value === 'string' ? value : value })

    if (addDataMode === 'checklist') {
      if (editItemId) { obj.done = checklistItems.find(i => i.id === editItemId)?.done || false }
      else { obj.done = false }
      const newItems = editItemId ? checklistItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...checklistItems, obj]
      setChecklistItems(newItems); saveToDb('planner_checklist', newItems)
    } else if (addDataMode === 'engagement') {
      obj.cpp = Number(obj.cpp || 0); obj.cpw = Number(obj.cpw || 0)
      const newItems = editItemId ? engagementItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...engagementItems, obj]
      setEngagementItems(newItems); saveToDb('planner_engagement', newItems)
    } else if (addDataMode === 'prewedding') {
      obj.budget = Number(obj.budget || 0); obj.actual = Number(obj.actual || 0)
      const newItems = editItemId ? preweddingItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...preweddingItems, obj]
      setPreweddingItems(newItems); saveToDb('planner_prewedding', newItems)
    } else if (addDataMode === 'seserahan') {
      obj.budget = Number(obj.budget || 0); obj.realisasi = Number(obj.realisasi || 0)
      if (!obj.pihak) obj.pihak = 'wanita'
      const newItems = editItemId ? seserahanItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...seserahanItems, obj]
      setSeserahanItems(newItems); saveToDb('planner_seserahan', newItems)
    } else if (addDataMode === 'administrasi') {
      obj.price = Number(obj.price || 0)
      obj.pria = formData.get('pria') === 'on'
      obj.wanita = formData.get('wanita') === 'on'
      const newItems = editItemId ? administrasiItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...administrasiItems, obj]
      setAdministrasiItems(newItems); saveToDb('planner_administrasi', newItems)
    } else if (addDataMode === 'vendor') {
      const newItems = editItemId ? vendorItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...vendorItems, obj]
      setVendorItems(newItems); saveToDb('planner_vendor', newItems)
    } else if (addDataMode === 'budget') {
      obj.budget = Number(obj.budget || 0); obj.realisasi = Number(obj.realisasi || 0)
      obj.dpLunas = Number(obj.dpLunas || 0); obj.sisaPembayaran = Number(obj.sisaPembayaran || 0)
      const newItems = editItemId ? budgetItems.map(i => i.id === editItemId ? { ...i, ...obj } : i) : [...budgetItems, obj]
      setBudgetItems(newItems); saveToDb('planner_budget', newItems)
    }
    setShowAddDataModal(false)
    setEditItemId(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="card responsive-flex" style={{ padding: '1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ion-icon name="heart" style={{ fontSize: 24, color: '#EF4444' }}></ion-icon>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Wedding Planner</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Rencanakan hari spesial Anda dengan mudah</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => setShowSettings(true)}><ion-icon name="settings-outline"></ion-icon> Pengaturan</button>
          <button className="btn btn-primary"><ion-icon name="download-outline"></ion-icon> Export PDF</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <div className="stat-card">
          <div>
            <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ion-icon name="time-outline" style={{ fontSize: 14 }}></ion-icon> Countdown
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{daysLeft}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>HARI</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{hoursLeft}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>JAM</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{minutesLeft}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>MENIT</div>
              </div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ width: '100%' }}>
            <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ion-icon name="checkmark-circle-outline" style={{ fontSize: 14 }}></ion-icon> Progress
            </div>
            <div className="stat-value" style={{ marginTop: 8 }}>{progress}%</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doneTasks} dari {totalTasks} selesai</span>
            <div className="progress-track" style={{ marginTop: 8 }}>
              <div className="progress-fill progress-blue" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ion-icon name="wallet-outline" style={{ fontSize: 14 }}></ion-icon> Budget
            </div>
            <div className="stat-value" style={{ marginTop: 8 }}>â€”</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Atur budget</span>
            <div className="progress-track" style={{ marginTop: 8 }}>
              <div className="progress-fill" style={{ width: '0%', background: '#9CA3AF' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar" style={{ gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}>
            <ion-icon name={t.icon}></ion-icon> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'calendar' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          {/* Calendar Header */}
          <div className="calendar-header responsive-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn-icon" onClick={prevMonth} style={{ border: '1px solid var(--stroke)' }}>
                <ion-icon name="chevron-back-outline"></ion-icon>
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button className="btn-icon" onClick={nextMonth} style={{ border: '1px solid var(--stroke)' }}>
                <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={goToday}>Hari Ini</button>
            </div>
            <div style={{ display: 'flex', gap: 0, background: 'var(--bg-page)', borderRadius: 'var(--radius)', padding: 4 }}>
              <button className={`tab-item ${calendarView === 'month' ? 'active' : ''}`}
                onClick={() => setCalendarView('month')} style={{ borderRadius: 'var(--radius)', padding: '6px 12px' }}>
                <ion-icon name="grid-outline"></ion-icon> Bulan
              </button>
              <button className={`tab-item ${calendarView === 'week' ? 'active' : ''}`}
                onClick={() => setCalendarView('week')} style={{ borderRadius: 'var(--radius)', padding: '6px 12px' }}>
                <ion-icon name="list-outline"></ion-icon> Minggu
              </button>
            </div>
          </div>

          {/* Calendar Rendering */}
          {calendarView === 'month' ? (
            <div className="calendar-grid">
              {dayHeaders.map(d => <div className="calendar-day-header" key={d}>{d}</div>)}
              {calendarDays.map((day, i) => (
                <div key={i} className={`calendar-day ${!day.current ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                  onClick={() => { setSelectedAgendaDate(day.fullDate); setShowAgendaModal(true); }}>
                  <span className="calendar-day-number">{day.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="calendar-week-list">
              {calendarDays.map((day, i) => {
                const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][day.fullDate.getDay()]
                const shortDay = dayName.substring(0, 3).toUpperCase()
                return (
                  <div key={i} className="calendar-week-item" onClick={() => { setSelectedAgendaDate(day.fullDate); setShowAgendaModal(true); }}>
                    <div className="calendar-week-item-top">
                      <div className={`calendar-week-date-badge ${day.isToday ? 'today' : ''}`}>
                        <span className="calendar-week-date-badge-day">{shortDay}</span>
                        <span className="calendar-week-date-badge-num">{day.day}</span>
                      </div>
                      <div className="calendar-week-item-content">
                        <span className="calendar-week-item-title">{dayName}</span>
                        <span className="calendar-week-item-subtitle">0 TASK</span>
                      </div>
                    </div>
                    <div className="calendar-week-item-agenda">TIDAK ADA AGENDA</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Checklist Wedding Plan</h3>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('checklist'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {['KUA', 'MUA', 'Mahar dan Seserahan', 'Venue/lokasi', 'Dokumentasi', 'Pengisi Acara', 'Makanan', 'Undangan & Souvenir', 'Lain-lain'].map(cat => {
              const items = checklistItems.filter(i => i.category === cat)
              if (items.length === 0) return null
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 16, background: '#2563EB', borderRadius: 2 }}></div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', margin: 0 }}>{cat}</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(item => (
                      <div key={item.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '1rem',
                        background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, border: `1px solid ${item.done ? '#2563EB' : '#CBD5E1'}`,
                          background: item.done ? '#2563EB' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all 0.2s'
                        }}>
                          {item.done && <ion-icon name="checkmark" style={{ fontSize: 12, color: '#fff' }}></ion-icon>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: item.done ? '#94A3B8' : '#334155', textDecoration: item.done ? 'line-through' : 'none' }}>
                            {item.text}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={(e) => { e.stopPropagation(); setAddDataMode('checklist'); setEditItemId(item.id); setShowAddDataModal(true); }}>
                            <ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon>
                          </button>
                          <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={(e) => { e.stopPropagation(); handleDelete('checklist', item.id); }}>
                            <ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Engagement Plan */}
      {activeTab === 'engagement' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Engagement Plan</h3>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('engagement'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40 }}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>DETAIL</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>VENDOR/KONTAK</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>CPP</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>CPW</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>TOTAL</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {['VANUE', 'DOKUMENTASI', 'MAKE UP', 'PAKAIAN', 'KONSUMSI', 'SESERAHAN & HANTARAN', 'LAIN-LAIN'].map((cat) => {
                  const items = engagementItems.filter(i => i.category === cat)
                  if (items.length === 0) return null
                  const subTotalCpp = items.reduce((sum, item) => sum + item.cpp, 0)
                  const subTotalCpw = items.reduce((sum, item) => sum + item.cpw, 0)
                  const subTotal = subTotalCpp + subTotalCpw

                  return (
                    <Fragment key={cat}>
                      {/* Category Header Row */}
                      <tr style={{ background: '#F8FAFC' }}>
                        <td colSpan={8} style={{ padding: '12px 16px', fontWeight: 700, color: '#1E3A8A', fontSize: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ion-icon name="cube-outline" style={{ fontSize: 16, color: '#3B82F6' }}></ion-icon> {cat}
                          </div>
                        </td>
                      </tr>
                      {/* Item Rows */}
                      {items.map((item, idx) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.detail}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.status}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.vendor}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.cpp === 0 ? '-' : `Rp ${item.cpp.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.cpw === 0 ? '-' : `Rp ${item.cpw.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{(item.cpp + item.cpw) === 0 ? '-' : `Rp ${(item.cpp + item.cpw).toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.keterangan}</span>
                              <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                                <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('engagement'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                                <button className="btn-icon" onClick={() => handleDelete('engagement', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Subtotal Row */}
                      <tr style={{ borderBottom: '1px dashed #CBD5E1' }}>
                        <td colSpan={4} style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#94A3B8', fontSize: 10, letterSpacing: 0.5 }}>
                          SUBTOTAL {cat}
                        </td>
                        <td style={{ padding: '16px', color: '#64748B', fontWeight: 600 }}>{subTotalCpp === 0 ? '-' : `Rp ${subTotalCpp.toLocaleString('id-ID')}`}</td>
                        <td style={{ padding: '16px', color: '#64748B', fontWeight: 600 }}>{subTotalCpw === 0 ? '-' : `Rp ${subTotalCpw.toLocaleString('id-ID')}`}</td>
                        <td style={{ padding: '16px', color: '#64748B', fontWeight: 600 }}>{subTotal === 0 ? '-' : `Rp ${subTotal.toLocaleString('id-ID')}`}</td>
                        <td></td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                {(() => {
                  const totalCpp = engagementItems.reduce((s, i) => s + i.cpp, 0)
                  const totalCpw = engagementItems.reduce((s, i) => s + i.cpw, 0)
                  const total = totalCpp + totalCpw
                  return (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px 16px', textAlign: 'center', fontWeight: 800, color: '#1E293B', fontSize: 14 }}>
                        TOTAL KESELURUHAN
                      </td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>Rp {totalCpp.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>Rp {totalCpw.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#2563EB' }}>Rp {total.toLocaleString('id-ID')}</td>
                      <td></td>
                    </tr>
                  )
                })()}
              </tfoot>
            </table>
          </div>
          <style>{`
            .table-row-hover:hover { background: #F8FAFC; }
            .table-row-hover:hover .row-actions { opacity: 1 !important; }
          `}</style>
        </div>
      )}

      {/* Pre-Wedding Plan */}
      {activeTab === 'prewedding' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Foto Pre-Wedding</h3>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('prewedding'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40 }}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>ITEM</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>VENDOR/KONTAK</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>BUDGET</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>ACTUAL</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {preweddingItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.item}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{item.vendor}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{item.budget === 0 ? '-' : `Rp ${item.budget.toLocaleString('id-ID')}`}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{item.actual === 0 ? '-' : `Rp ${item.actual.toLocaleString('id-ID')}`}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{item.status}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.keterangan}</span>
                        <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('prewedding'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                          <button className="btn-icon" onClick={() => handleDelete('prewedding', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(() => {
                  const totalBudget = preweddingItems.reduce((s, i) => s + i.budget, 0)
                  const totalActual = preweddingItems.reduce((s, i) => s + i.actual, 0)
                  return (
                    <tr>
                      <td colSpan={3} style={{ padding: '24px 16px', textAlign: 'center', fontWeight: 800, color: '#94A3B8', fontSize: 12 }}>
                        TOTAL KESELURUHAN
                      </td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>{totalBudget === 0 ? 'Rp 0' : `Rp ${totalBudget.toLocaleString('id-ID')}`}</td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>{totalActual === 0 ? 'Rp 0' : `Rp ${totalActual.toLocaleString('id-ID')}`}</td>
                      <td colSpan={2}></td>
                    </tr>
                  )
                })()}
              </tfoot>
            </table>
          </div>

          <div className="responsive-flex" style={{ background: '#EFF6FF', borderRadius: 12, padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <ion-icon name="bulb-outline" style={{ fontSize: 20 }}></ion-icon>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1E3A8A', margin: 0 }}>Tips Persiapan Foto Pre-Wedding</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 52 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3B82F6', fontSize: 13, fontWeight: 500 }}>
                  <ion-icon name="checkmark-circle"></ion-icon> Tentukan konsep tema prewedding (outdoor / indoor)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3B82F6', fontSize: 13, fontWeight: 500 }}>
                  <ion-icon name="checkmark-circle"></ion-icon> Pilih spot dan waktu yang tepat (pagi / siang / malam)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3B82F6', fontSize: 13, fontWeight: 500 }}>
                  <ion-icon name="checkmark-circle"></ion-icon> Sesuaikan outfit dengan warna konsep & lokasi tujuan
                </div>
              </div>
            </div>
            
            <div style={{ background: '#fff', borderRadius: 8, padding: 16, width: 380, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h5 style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>KEBUTUHAN PRIBADI WAJIB</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="chip" style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0' }}>ðŸ‘• Baju ganti</span>
                <span className="chip" style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }}>âš¡ Kipas portable</span>
                <span className="chip" style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}>ðŸ’„ Make up pribadi</span>
                <span className="chip" style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>ðŸ§Ž Alat ibadah</span>
                <span className="chip" style={{ background: '#FAF5FF', color: '#6B21A8', border: '1px solid #E9D5FF' }}>ðŸ« Snack & minuman</span>
              </div>
            </div>
          </div>
          
          <style>{`
            .table-row-hover:hover { background: #F8FAFC; }
            .table-row-hover:hover .row-actions { opacity: 1 !important; }
          `}</style>
        </div>
      )}

      {/* Seserahan */}
      {activeTab === 'seserahan' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 12, padding: 4 }}>
              <button
                className={`btn ${seserahanTab === 'wanita' ? 'active' : ''}`}
                style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: seserahanTab === 'wanita' ? '#fff' : 'transparent', color: seserahanTab === 'wanita' ? '#E11D48' : '#64748B', boxShadow: seserahanTab === 'wanita' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                onClick={() => setSeserahanTab('wanita')}
              >
                Pihak Wanita
              </button>
              <button
                className={`btn ${seserahanTab === 'pria' ? 'active' : ''}`}
                style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: seserahanTab === 'pria' ? '#fff' : 'transparent', color: seserahanTab === 'pria' ? '#3B82F6' : '#64748B', boxShadow: seserahanTab === 'pria' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                onClick={() => setSeserahanTab('pria')}
              >
                Pihak Pria
              </button>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('seserahan'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40 }}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>DETAIL</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>BRAND</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>BUDGET</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>REALISASI</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {['PAKAIAN', 'PERLENGKAPAN IBADAH', 'MAKEUP', 'BODYCARE & HAIRCARE', 'PAKAIAN DALAM', 'AKSESORIS', 'TOILETERIES', 'PERHIASAN', 'HIAS BOX'].map((cat) => {
                  const items = seserahanItems.filter(i => i.pihak === seserahanTab && i.category === cat)
                  if (items.length === 0) return null
                  const subTotalBudget = items.reduce((sum, item) => sum + item.budget, 0)
                  const subTotalRealisasi = items.reduce((sum, item) => sum + item.realisasi, 0)

                  return (
                    <Fragment key={cat}>
                      {/* Category Header Row */}
                      <tr style={{ background: '#F8FAFC' }}>
                        <td colSpan={7} style={{ padding: '12px 16px', fontWeight: 700, color: '#1E3A8A', fontSize: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ion-icon name="cube-outline" style={{ fontSize: 16, color: '#3B82F6' }}></ion-icon> {cat}
                          </div>
                        </td>
                      </tr>
                      {/* Item Rows */}
                      {items.map((item, idx) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.detail}</td>
                          <td style={{ padding: '16px' }}>
                            {item.status !== '-' && (
                              <span className="chip" style={{ background: item.status === 'DONE' ? '#F0FDF4' : '#FEF3C7', color: item.status === 'DONE' ? '#166534' : '#D97706', fontSize: 10, fontWeight: 700, padding: '4px 8px' }}>{item.status}</span>
                            )}
                            {item.status === '-' && '-'}
                          </td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.brand}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.budget === 0 ? '-' : `Rp ${item.budget.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.realisasi === 0 ? '-' : `Rp ${item.realisasi.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.keterangan}</span>
                              <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                                <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('seserahan'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                                <button className="btn-icon" onClick={() => handleDelete('seserahan', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Subtotal Row */}
                      <tr style={{ borderBottom: '1px dashed #CBD5E1' }}>
                        <td colSpan={4} style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#94A3B8', fontSize: 10, letterSpacing: 0.5 }}>
                          SUBTOTAL {cat}
                        </td>
                        <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{subTotalBudget === 0 ? 'Rp 0' : `Rp ${subTotalBudget.toLocaleString('id-ID')}`}</td>
                        <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{subTotalRealisasi === 0 ? 'Rp 0' : `Rp ${subTotalRealisasi.toLocaleString('id-ID')}`}</td>
                        <td></td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                {(() => {
                  const currentItems = seserahanItems.filter(i => i.pihak === seserahanTab)
                  const totalBudget = currentItems.reduce((s, i) => s + i.budget, 0)
                  const totalRealisasi = currentItems.reduce((s, i) => s + i.realisasi, 0)
                  return (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px 16px', textAlign: 'center', fontWeight: 800, color: '#1E293B', fontSize: 14 }}>
                        TOTAL KESELURUHAN
                      </td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>{totalBudget === 0 ? 'Rp 0' : `Rp ${totalBudget.toLocaleString('id-ID')}`}</td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#E11D48' }}>{totalRealisasi === 0 ? 'Rp 0' : `Rp ${totalRealisasi.toLocaleString('id-ID')}`}</td>
                      <td></td>
                    </tr>
                  )
                })()}
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Administrasi Pernikahan */}
      {activeTab === 'administrasi' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Administrasi Pernikahan</h3>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('administrasi'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'center', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40, textAlign: 'left' }} rowSpan={2}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'left' }} rowSpan={2}>DOKUMEN</th>
                  <th colSpan={2} style={{ padding: '8px 16px', fontWeight: 700, borderBottom: '1px solid #E2E8F0' }}>CHECKLIST</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'left' }} rowSpan={2}>PRICE</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'left' }} rowSpan={2}>KETERANGAN</th>
                </tr>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'center', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '8px 16px', fontWeight: 700, color: '#3B82F6', width: 100 }}>PENGANTIN PRIA</th>
                  <th style={{ padding: '8px 16px', fontWeight: 700, color: '#E11D48', width: 100 }}>PENGANTIN WANITA</th>
                </tr>
              </thead>
              <tbody>
                {administrasiItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.dokumen}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: item.pria ? '#0F172A' : '#fff', border: `1px solid ${item.pria ? '#0F172A' : '#CBD5E1'}`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.pria && <ion-icon name="checkmark" style={{ color: '#fff', fontSize: 14 }}></ion-icon>}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: item.wanita ? '#0F172A' : '#fff', border: `1px solid ${item.wanita ? '#0F172A' : '#CBD5E1'}`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.wanita && <ion-icon name="checkmark" style={{ color: '#fff', fontSize: 14 }}></ion-icon>}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{item.price === 0 ? '-' : `Rp ${item.price.toLocaleString('id-ID')}`}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.keterangan}</span>
                        <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                          <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('administrasi'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                          <button className="btn-icon" onClick={() => handleDelete('administrasi', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(() => {
                  const totalPrice = administrasiItems.reduce((s, i) => s + i.price, 0)
                  return (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px 16px', textAlign: 'right', fontWeight: 800, color: '#1E293B', fontSize: 12 }}>
                        TOTAL KESELURUHAN
                      </td>
                      <td style={{ padding: '24px 16px', fontWeight: 800, color: '#1E293B' }}>{totalPrice === 0 ? 'Rp 0' : `Rp ${totalPrice.toLocaleString('id-ID')}`}</td>
                      <td></td>
                    </tr>
                  )
                })()}
              </tfoot>
            </table>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
            <h4 style={{ textAlign: 'center', fontSize: 14, fontWeight: 800, letterSpacing: 1, marginBottom: 24 }}>ALUR PENDAFTARAN PERNIKAHAN</h4>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Laki-laki */}
              <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #E2E8F0' }}>
                <h5 style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#3B82F6', marginBottom: 16, paddingBottom: 12, borderBottom: '1px dashed #CBD5E1' }}>ALUR PENDAFTARAN NIKAH LAKI-LAKI</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>1</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke RT/RW buat minta surat pengantar nikah.<br/><span style={{ color: '#94A3B8' }}>*membawa KTP dan KK</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>2</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke Kelurahan untuk mendapatkan surat N1 - N4.<br/><span style={{ color: '#94A3B8' }}>*membawa surat pengantar nikah dari RT/RW dan dokumen lainnya di atas</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>3</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke KUA (apabila beda domisili).<br/><span style={{ color: '#94A3B8' }}>*calon mempelai pria datang ke KUA untuk mendapatkan surat numpang nikah yang selanjutnya dikumpulkan berkasnya ke calon mempelai wanita</span></p>
                  </div>
                </div>
              </div>
              
              {/* Perempuan */}
              <div style={{ background: '#fff', borderRadius: 8, padding: 20, border: '1px solid #E2E8F0' }}>
                <h5 style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#E11D48', marginBottom: 16, paddingBottom: 12, borderBottom: '1px dashed #CBD5E1' }}>ALUR PENDAFTARAN NIKAH PEREMPUAN</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>1</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke RT/RW buat minta surat pengantar nikah.<br/><span style={{ color: '#94A3B8' }}>*membawa KTP dan KK</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>2</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke Kelurahan untuk mendapatkan surat N1 - N4.<br/><span style={{ color: '#94A3B8' }}>*membawa surat pengantar nikah dari RT/RW dan dokumen lainnya di atas, termasuk berkas calon pengantin pria untuk mendapatkan surat N1-N4</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFE4E6', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 13 }}>3</div>
                    <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>Datang ke KUA.<br/><span style={{ color: '#94A3B8' }}>*membawa semua berkas untuk daftar pernikahan ke KUA</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Contact List */}
      {activeTab === 'vendor' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="responsive-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Vendor Contact List</h3>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8 }}
              onClick={() => { setAddDataMode('vendor'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40 }}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>VENDOR</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>JENIS VENDOR</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KONTAK</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>ALAMAT</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>SOSMED / LINK</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>PIC</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {vendorItems.map((item, idx) => {
                  let badgeBg = '#F1F5F9'
                  let badgeColor = '#475569'
                  if (item.jenis === 'Venue') { badgeBg = '#DBEAFE'; badgeColor = '#2563EB' }
                  else if (item.jenis === 'Makanan') { badgeBg = '#F1F5F9'; badgeColor = '#0F172A' }
                  else if (item.jenis === 'MUA') { badgeBg = '#FEF3C7'; badgeColor = '#D97706' }
                  else if (item.jenis === 'Transportasi') { badgeBg = '#CCFBF1'; badgeColor = '#0D9488' }
                  else if (item.jenis === 'Ceremony') { badgeBg = '#FFE4E6'; badgeColor = '#E11D48' }
                  else if (item.jenis === 'Dokumentasi') { badgeBg = '#F3E8FF'; badgeColor = '#9333EA' }
                  else if (item.jenis === 'Lain-lain') { badgeBg = '#F3F4F6'; badgeColor = '#4B5563' }

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                      <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.vendor}</td>
                      <td style={{ padding: '16px' }}>
                        <span className="chip" style={{ background: badgeBg, color: badgeColor, fontWeight: 700, fontSize: 11, padding: '4px 10px' }}>{item.jenis}</span>
                      </td>
                      <td style={{ padding: '16px', color: '#64748B' }}>{item.kontak}</td>
                      <td style={{ padding: '16px', color: '#64748B' }}>{item.alamat}</td>
                      <td style={{ padding: '16px', color: '#64748B' }}>{item.sosmed}</td>
                      <td style={{ padding: '16px', color: '#64748B' }}>{item.pic}</td>
                      <td style={{ padding: '16px', color: '#64748B' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{item.keterangan}</span>
                          <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                            <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('vendor'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                            <button className="btn-icon" onClick={() => handleDelete('vendor', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Budget */}
      {activeTab === 'budget' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#0F172A', marginBottom: 4 }}>Budgeting Wedding</h3>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                Total Budget: <span style={{ fontWeight: 600 }}>{budgetItems.reduce((s,i) => s + i.budget, 0) === 0 ? '-' : `Rp ${budgetItems.reduce((s,i) => s + i.budget, 0).toLocaleString('id-ID')}`}</span> | 
                Realisasi: <span style={{ fontWeight: 600, color: '#3B82F6' }}>{budgetItems.reduce((s,i) => s + i.realisasi, 0) === 0 ? '-' : `Rp ${budgetItems.reduce((s,i) => s + i.realisasi, 0).toLocaleString('id-ID')}`}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ background: '#0F172A', color: '#fff', borderRadius: 8, padding: '8px 16px' }}
              onClick={() => { setAddDataMode('budget'); setEditItemId(null); setShowAddDataModal(true); }}>
              <ion-icon name="add-outline"></ion-icon> Tambah Data
            </button>
          </div>
          
          <div style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 1000 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#94A3B8', textAlign: 'left', textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, width: 40 }}>NO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>NAMA</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>BUDGET</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>REALISASI</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>DP / LUNAS</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>SISA PEMBAYARAN</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>PAYMENT DATE</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {['1. MUA', '2. MAHAR', '3. DOKUMENTASI', '4. TEMPAT', '5. PENGISI ACARA', '6. MAKANAN', '7. UNDANGAN & SOUVENIR'].map((cat) => {
                  const items = budgetItems.filter(i => i.category === cat)
                  if (items.length === 0) return null
                  const subTotalBudget = items.reduce((sum, item) => sum + item.budget, 0)
                  const subTotalRealisasi = items.reduce((sum, item) => sum + item.realisasi, 0)

                  return (
                    <Fragment key={cat}>
                      {/* Category Header Row */}
                      <tr style={{ background: '#F8FAFC' }}>
                        <td colSpan={9} style={{ padding: '12px 16px', fontWeight: 700, color: '#1E3A8A', fontSize: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ion-icon name="pricetag-outline" style={{ fontSize: 16, color: '#3B82F6' }}></ion-icon> {cat}
                          </div>
                        </td>
                      </tr>
                      {/* Item Rows */}
                      {items.map((item, idx) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                          <td style={{ padding: '16px', color: '#64748B' }}>{idx + 1}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#1E293B' }}>{item.nama}</td>
                          <td style={{ padding: '16px' }}>
                            <span className="chip" style={{ background: item.status === 'LUNAS' ? '#F0FDF4' : '#F1F5F9', color: item.status === 'LUNAS' ? '#166534' : '#64748B', fontSize: 10, fontWeight: 700, padding: '4px 10px' }}>{item.status}</span>
                          </td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.budget === 0 ? '-' : `Rp ${item.budget.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.realisasi === 0 ? '-' : `Rp ${item.realisasi.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.dpLunas === 0 ? '-' : `Rp ${item.dpLunas.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.sisaPembayaran === 0 ? '-' : `Rp ${item.sisaPembayaran.toLocaleString('id-ID')}`}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>{item.paymentDate || '-'}</td>
                          <td style={{ padding: '16px', color: '#64748B' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.keterangan}</span>
                              <div style={{ display: 'flex', gap: 8, opacity: 1 }} className="row-actions">
                                <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setAddDataMode('budget'); setEditItemId(item.id); setShowAddDataModal(true); }}><ion-icon name="create-outline" style={{ fontSize: 14, color: '#3B82F6' }}></ion-icon></button>
                                <button className="btn-icon" onClick={() => handleDelete('budget', item.id)} style={{ width: 24, height: 24 }}><ion-icon name="trash-outline" style={{ fontSize: 14, color: '#EF4444' }}></ion-icon></button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Subtotal Row */}
                      <tr style={{ borderBottom: '1px dashed #CBD5E1' }}>
                        <td colSpan={3} style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#94A3B8', fontSize: 10, letterSpacing: 0.5 }}>
                          SUBTOTAL {cat.replace(/^[0-9.]+\s/, '')}
                        </td>
                        <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{subTotalBudget === 0 ? 'Rp 0' : `Rp ${subTotalBudget.toLocaleString('id-ID')}`}</td>
                        <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{subTotalRealisasi === 0 ? 'Rp 0' : `Rp ${subTotalRealisasi.toLocaleString('id-ID')}`}</td>
                        <td colSpan={4}></td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Other tabs - placeholder */}
      {!['calendar', 'checklist', 'engagement', 'prewedding', 'seserahan', 'administrasi', 'vendor', 'budget'].includes(activeTab) && (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {activeTab === 'budget' ? 'ðŸ’°' : 'ðŸ‘¥'}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
              Fitur ini akan segera hadir. Anda akan bisa mengelola {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} pernikahan Anda di sini.
            </p>
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {showSettings && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowSettings(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Pengaturan Wedding Planner</h3>
              <button className="btn-icon" onClick={() => setShowSettings(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <ion-icon name="information-circle" style={{ color: '#2563EB', fontSize: 20, flexShrink: 0 }}></ion-icon>
                  <div>
                    <p style={{ fontSize: 13, color: '#1E3A8A', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 700 }}>Data otomatis tersinkronisasi</span> dari form "Atur Tema"
                    </p>
                    <button className="btn btn-sm" style={{ background: '#3B82F6', color: '#fff', border: 'none', marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 12px', borderRadius: 6, fontWeight: 600 }}>
                      <ion-icon name="sync-outline"></ion-icon> Sync Ulang dari Atur Tema
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Tanggal Pernikahan <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="date" className="input" value={weddingDateInput} onChange={e => setWeddingDateInput(e.target.value)} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Tanggal ini akan digunakan untuk countdown dan timeline</p>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Nama Pengantin <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Opsional)</span></label>
                <input type="text" className="input" placeholder="Budi & Ani" value={coupleName} onChange={e => setCoupleName(e.target.value)} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Akan ditampilkan di export PDF</p>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Venue <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Opsional)</span></label>
                <input type="text" className="input" placeholder="Bali Cliff Wedding" value={venue} onChange={e => setVenue(e.target.value)} />
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Lokasi pernikahan</p>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                <button className="btn" style={{ background: '#0F172A', color: '#fff', width: '100%', padding: '14px', borderRadius: 8, fontWeight: 600, fontSize: 14 }} onClick={() => setShowSettings(false)}>
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Data Drawer */}
      {(() => {
        const getEditData = () => {
          if (!editItemId) return null
          if (addDataMode === 'checklist') return checklistItems.find(i => i.id === editItemId)
          if (addDataMode === 'engagement') return engagementItems.find(i => i.id === editItemId)
          if (addDataMode === 'prewedding') return preweddingItems.find(i => i.id === editItemId)
          if (addDataMode === 'seserahan') return seserahanItems.find(i => i.id === editItemId)
          if (addDataMode === 'administrasi') return administrasiItems.find(i => i.id === editItemId)
          if (addDataMode === 'vendor') return vendorItems.find(i => i.id === editItemId)
          if (addDataMode === 'budget') return budgetItems.find(i => i.id === editItemId)
          return null
        }
        const editData = getEditData() as any

        return showAddDataModal && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowAddDataModal(false)}>
          <form className="drawer-panel" onSubmit={handleSaveData} onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                {editItemId ? 'Edit Data' : 'Tambah Data'} {addDataMode === 'checklist' ? 'Checklist' : addDataMode === 'engagement' ? 'Engagement' : addDataMode === 'seserahan' ? 'Seserahan' : addDataMode === 'prewedding' ? 'Pre-Wedding' : addDataMode === 'administrasi' ? 'Administrasi' : addDataMode === 'vendor' ? 'Vendor' : addDataMode === 'budget' ? 'Budget' : ''}
              </h3>
              <button className="btn-icon" onClick={() => setShowAddDataModal(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" key={editItemId || 'new'} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              
              {addDataMode === 'checklist' && (
                <>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Kategori <span style={{ color: '#EF4444' }}>*</span></label>
                    <select className="input" name="category" defaultValue={editData?.category} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>KUA</option>
                      <option>MUA</option>
                      <option>Mahar dan Seserahan</option>
                      <option>Venue/lokasi</option>
                      <option>Dokumentasi</option>
                      <option>Pengisi Acara</option>
                      <option>Makanan</option>
                      <option>Undangan & Souvenir</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 20 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Tugas <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="input" name="text" defaultValue={editData?.text} placeholder="Masukkan nama tugas..." />
                  </div>
                </>
              )}

              {addDataMode === 'engagement' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Kategori</label>
                    <select className="input" name="category" defaultValue={editData?.category} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>VANUE</option>
                      <option>DOKUMENTASI</option>
                      <option>MAKE UP</option>
                      <option>PAKAIAN</option>
                      <option>KONSUMSI</option>
                      <option>SESERAHAN & HANTARAN</option>
                      <option>LAIN-LAIN</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Detail</label>
                    <input type="text" className="input" name="detail" defaultValue={editData?.detail} placeholder="Nama item" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Vendor / Kontak</label>
                    <input type="text" className="input" name="vendor" defaultValue={editData?.vendor} placeholder="Nama vendor" />
                  </div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Biaya CPP</label>
                      <input type="number" className="input" name="biayaCpp" defaultValue={editData?.biayaCpp} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Biaya CPW</label>
                      <input type="number" className="input" placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Status</label>
                    <select className="input" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>-</option>
                      <option>Lunas</option>
                      <option>DP</option>
                      <option>Belum Bayar</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={3} placeholder="Tambahkan catatan jika ada"></textarea>
                  </div>
                </>
              )}

              {addDataMode === 'seserahan' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Pihak <span style={{ color: '#EF4444' }}>*</span></label>
                    <select className="input" defaultValue={editData?.pihak === 'wanita' ? 'Pihak Wanita' : editData?.pihak === 'pria' ? 'Pihak Pria' : 'Pihak Wanita'} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>Pihak Wanita</option>
                      <option>Pihak Pria</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Kategori <span style={{ color: '#EF4444' }}>*</span></label>
                    <select className="input" name="category" defaultValue={editData?.category} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>PAKAIAN</option>
                      <option>PERLENGKAPAN IBADAH</option>
                      <option>MAKEUP</option>
                      <option>BODYCARE & HAIRCARE</option>
                      <option>PAKAIAN DALAM</option>
                      <option>AKSESORIS</option>
                      <option>TOILETERIES</option>
                      <option>PERHIASAN</option>
                      <option>HIAS BOX</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Detail Item</label>
                    <input type="text" className="input" name="detail" defaultValue={editData?.detail} placeholder="Nama barang" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Brand</label>
                    <input type="text" className="input" name="brand" defaultValue={editData?.brand} placeholder="Merek barang" />
                  </div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Budget</label>
                      <input type="number" className="input" name="budget" defaultValue={editData?.budget} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Realisasi</label>
                      <input type="number" className="input" name="realisasi" defaultValue={editData?.realisasi} placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Status</label>
                    <select className="input" name="status" defaultValue={editData?.status} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>-</option>
                      <option>DONE</option>
                      <option>ORDER</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={2} name="keterangan" defaultValue={editData?.keterangan} placeholder="Tambahkan catatan jika ada"></textarea>
                  </div>
                </>
              )}

              {addDataMode === 'prewedding' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Item <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="input" name="item" defaultValue={editData?.item} placeholder="Nama item" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Vendor / Kontak</label>
                    <input type="text" className="input" name="vendor" defaultValue={editData?.vendor} placeholder="Nama vendor" />
                  </div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Budget</label>
                      <input type="number" className="input" name="budget" defaultValue={editData?.budget} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Actual</label>
                      <input type="number" className="input" name="actual" defaultValue={editData?.actual} placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Status</label>
                    <select className="input" name="status" defaultValue={editData?.status} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>-</option>
                      <option>Lunas</option>
                      <option>DP</option>
                      <option>Belum Bayar</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={3} name="keterangan" defaultValue={editData?.keterangan} placeholder="Tambahkan catatan jika ada"></textarea>
                  </div>
                </>
              )}

              {addDataMode === 'administrasi' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Dokumen <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="input" name="dokumen" defaultValue={editData?.dokumen} placeholder="Nama dokumen" />
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 16, padding: '12px 16px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={editData?.pria} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                      Pengantin Pria
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={editData?.wanita} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                      Pengantin Wanita
                    </label>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Price (Biaya)</label>
                    <input type="number" className="input" name="price" defaultValue={editData?.price} placeholder="0" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={3} name="keterangan" defaultValue={editData?.keterangan} placeholder="Tambahkan catatan jika ada"></textarea>
                  </div>
                </>
              )}

              {addDataMode === 'vendor' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Nama Vendor <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="input" name="nama" defaultValue={editData?.nama} placeholder="Nama vendor" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Jenis Vendor</label>
                    <select className="input" name="jenis" defaultValue={editData?.jenis} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>Venue</option>
                      <option>Makanan</option>
                      <option>MUA</option>
                      <option>Transportasi</option>
                      <option>Ceremony</option>
                      <option>Dokumentasi</option>
                      <option>Lain-lain</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Kontak</label>
                    <input type="text" className="input" name="kontak" defaultValue={editData?.kontak} placeholder="No. HP / WhatsApp" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Alamat</label>
                    <textarea className="input" rows={2} name="alamat" defaultValue={editData?.alamat} placeholder="Alamat lengkap vendor"></textarea>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Sosmed / Link</label>
                    <input type="text" className="input" name="sosmed" defaultValue={editData?.sosmed} placeholder="@instagram atau URL website" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>PIC</label>
                    <input type="text" className="input" name="pic" defaultValue={editData?.pic} placeholder="Nama PIC" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={2} name="keterangan" defaultValue={editData?.keterangan} placeholder="Catatan tambahan"></textarea>
                  </div>
                </>
              )}

              {addDataMode === 'budget' && (
                <>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Kategori <span style={{ color: '#EF4444' }}>*</span></label>
                    <select className="input" name="category" defaultValue={editData?.category} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>1. MUA</option>
                      <option>2. MAHAR</option>
                      <option>3. DOKUMENTASI</option>
                      <option>4. TEMPAT</option>
                      <option>5. PENGISI ACARA</option>
                      <option>6. MAKANAN</option>
                      <option>7. UNDANGAN & SOUVENIR</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Nama Item <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="text" className="input" name="nama" defaultValue={editData?.nama} placeholder="Nama pengeluaran" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Status</label>
                    <select className="input" name="status" defaultValue={editData?.status} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff' }}>
                      <option>BELUM</option>
                      <option>LUNAS</option>
                    </select>
                  </div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Budget</label>
                      <input type="number" className="input" name="budget" defaultValue={editData?.budget} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Realisasi</label>
                      <input type="number" className="input" name="realisasi" defaultValue={editData?.realisasi} placeholder="0" />
                    </div>
                  </div>
                  <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>DP / Lunas</label>
                      <input type="number" className="input" name="dpLunas" defaultValue={editData?.dpLunas} placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Sisa Pembayaran</label>
                      <input type="number" className="input" name="sisaPembayaran" defaultValue={editData?.sisaPembayaran} placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Payment Date</label>
                    <input type="date" className="input" name="paymentDate" defaultValue={editData?.paymentDate} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block', fontSize: 13 }}>Keterangan</label>
                    <textarea className="input" rows={2} name="keterangan" defaultValue={editData?.keterangan} placeholder="Catatan tambahan"></textarea>
                  </div>
                </>
              )}
              
              <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                <button type="submit" className="btn" style={{ background: '#0F172A', color: '#fff', width: '100%', padding: '14px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                  Simpan Data
                </button>
              </div>
            </div>
          </form>
        </div>
        )
      })()}

      {/* Agenda Modal */}
      {showAgendaModal && selectedAgendaDate && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowAgendaModal(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="drawer-header">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][selectedAgendaDate.getDay()]}, {selectedAgendaDate.getDate()} {monthNames[selectedAgendaDate.getMonth()]} {selectedAgendaDate.getFullYear()}
                </h3>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  0 AGENDA TERSEDIA
                </p>
              </div>
              <button className="btn-icon" onClick={() => setShowAgendaModal(false)} style={{ background: '#F1F5F9', border: 'none', width: 32, height: 32 }}>
                <ion-icon name="close-outline" style={{ fontSize: 20, color: '#64748B' }}></ion-icon>
              </button>
            </div>
            <div className="drawer-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
              <ion-icon name="calendar-outline" style={{ fontSize: 48, color: '#CBD5E1' }}></ion-icon>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TIDAK ADA AGENDA HARI INI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

