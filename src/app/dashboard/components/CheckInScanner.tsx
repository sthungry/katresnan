'use client'
import { useState, useRef, useCallback } from 'react'
import jsQR from 'jsqr'
import { supabase } from '@/lib/supabase'
import type { Guest, CheckIn } from '../page'

interface Props {
  guests: Guest[]; checkins: CheckIn[]; orderId: string
  showToast: (msg: string) => void; onRefresh: () => void
}

export default function CheckInScanner({ guests, checkins, orderId, showToast, onRefresh }: Props) {
  const [manualSearch, setManualSearch] = useState('')
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment'|'user'>('environment')
  const [flashOn, setFlashOn] = useState(false)
  const [scanMessage, setScanMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const totalCheckedIn = checkins.length
  const checkRate = guests.length > 0 ? Math.round((totalCheckedIn / guests.length) * 100) : 0
  const todayCheckins = checkins.filter(c => new Date(c.checked_in_at).toDateString() === new Date().toDateString()).length

  async function checkInGuest(guestId: string, method: 'manual' | 'qr' = 'manual') {
    const already = checkins.find(ci => ci.guest_id === guestId)
    if (already) { showToast('Tamu sudah check-in sebelumnya'); return }
    const { error } = await supabase.from('checkins').insert({ guest_id: guestId, order_id: orderId, checked_in_by: method })
    if (error) showToast('Gagal check-in tamu')
    else { showToast('Check-in berhasil!'); onRefresh() }
  }

  const startScan = useCallback(async (mode: 'environment'|'user' = facingMode) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('Akses kamera tidak didukung di browser ini (butuh HTTPS)')
        return
      }

      setScanning(true)
      setFacingMode(mode)
      setFlashOn(false)

      // Ensure React has time to render the video element if it wasn't rendered
      setTimeout(async () => {
        try {
          if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
          }
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: mode } } })
          if (videoRef.current) { 
            videoRef.current.srcObject = stream
            videoRef.current.setAttribute('playsinline', 'true')
            await videoRef.current.play() 
          }
          requestAnimationFrame(scanFrame)
        } catch (err: any) {
          showToast('Tidak bisa akses kamera: ' + (err.message || 'Izin ditolak'))
          setScanning(false)
        }
      }, 50)
    } catch { showToast('Tidak bisa akses kamera') }
  }, [facingMode])

  function switchCamera() {
    const newMode = facingMode === 'environment' ? 'user' : 'environment'
    startScan(newMode)
    setScanMessage('Kamera berhasil diganti')
    setTimeout(() => setScanMessage(''), 3000)
  }

  async function toggleFlash() {
    if (!videoRef.current?.srcObject) return
    const track = (videoRef.current.srcObject as MediaStream).getVideoTracks()[0]
    if (!track) return
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !flashOn }] })
      setFlashOn(!flashOn)
    } catch (e) {
      showToast('Flash tidak didukung di perangkat ini')
    }
  }

  function scanFrame() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx || video.readyState < 2) { requestAnimationFrame(scanFrame); return }
    canvas.width = video.videoWidth; canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    if (jsQR) {
      const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" })
      if (code) { handleQRResult(code.data); return }
    }
    requestAnimationFrame(scanFrame)
  }

  async function handleQRResult(data: string) {
    stopScan()
    const guest = guests.find(g => g.qr_code === data || g.id === data)
    if (!guest) { showToast('QR code tidak dikenali'); return }
    checkInGuest(guest.id, 'qr')
  }

  function stopScan() {
    setScanning(false)
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
  }

  const filteredForManual = guests.filter(g => g.nama.toLowerCase().includes(manualSearch.toLowerCase()))

  return (
    <div>
      {/* Header */}
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Check-in QR</h2>

      {/* Check-in limit */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ion-icon name="sparkles-outline" style={{ fontSize: 14 }}></ion-icon>
            Check-in
          </span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>{totalCheckedIn}/{guests.length}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill progress-green" style={{ width: `${checkRate}%` }}></div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div><div className="stat-label">Total Check-in</div><div className="stat-value">{totalCheckedIn}</div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>dari {guests.length} tamu</span></div>
          <div className="stat-icon"><ion-icon name="checkmark-done-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Check-in Rate</div><div className="stat-value">{checkRate}%</div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>tingkat kehadiran</span></div>
          <div className="stat-icon"><ion-icon name="trending-up-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Hari Ini</div><div className="stat-value">{todayCheckins}</div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>check-in hari ini</span></div>
          <div className="stat-icon"><ion-icon name="calendar-outline"></ion-icon></div>
        </div>
        <div className="stat-card">
          <div><div className="stat-label">Avg Time</div><div className="stat-value">0s</div><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>rata-rata waktu</span></div>
          <div className="stat-icon"><ion-icon name="time-outline"></ion-icon></div>
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span style={{ fontWeight: 700, fontSize: 14 }}>Recent Check-Ins</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm">
              <ion-icon name="bar-chart-outline"></ion-icon> Analytics
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
              <ion-icon name="refresh-outline"></ion-icon> Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          {checkins.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Belum Ada Check-in</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
                Belum ada tamu yang melakukan check-in. Scan QR code untuk memulai check-in tamu.
              </p>
            </div>
          ) : (
            checkins.slice(0, 10).map((ci, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" style={{ background: '#10B981' }}></div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{(ci as any).guests?.nama || '...'}</p>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ci.checked_in_by}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(ci.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Scan QR FAB */}
      <div style={{ position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)', zIndex: 60, display: 'flex', gap: 12, width: 'max-content' }}>
        <button className="btn btn-success" onClick={scanning ? stopScan : startScan}
          style={{ padding: '14px 28px', borderRadius: 999, fontSize: 15, gap: 8, boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}>
          <ion-icon name="qr-code-outline" style={{ fontSize: 20 }}></ion-icon>
          {scanning ? 'Stop Scan' : 'Scan QR'}
          <ion-icon name="scan-outline" style={{ fontSize: 18 }}></ion-icon>
        </button>
        <button className="btn btn-primary" onClick={() => setShowManualSearch(true)}
          style={{ padding: '14px 28px', borderRadius: 999, fontSize: 15, gap: 8, boxShadow: '0 8px 30px rgba(37,99,235,0.4)', background: '#2563EB', color: '#fff' }}>
          <ion-icon name="search-outline" style={{ fontSize: 20 }}></ion-icon>
          Manual
        </button>
      </div>

      {/* Hidden video/canvas for QR scanning */}
      {scanning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}>
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} autoPlay playsInline muted />
          
          <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%', pointerEvents: 'none' }}>
            {/* Top Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'auto' }}>
              <button className="btn" onClick={stopScan} style={{ width: 40, height: 40, padding: 0, borderRadius: 12, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <ion-icon name="close-outline" style={{ fontSize: 24 }}></ion-icon>
              </button>

              {scanMessage && (
                <div style={{ background: '#fff', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <ion-icon name="checkmark-circle" style={{ color: '#10B981', fontSize: 18 }}></ion-icon>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{scanMessage}</span>
                  <button onClick={() => setScanMessage('')} style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', padding: 0, marginLeft: 8, cursor: 'pointer' }}>
                    <ion-icon name="close-outline" style={{ color: '#9CA3AF' }}></ion-icon>
                  </button>
                </div>
              )}

              {!scanMessage && <div style={{ flex: 1 }}></div>}

              <button className="btn" onClick={() => { stopScan(); setShowManualSearch(true); }} style={{ height: 40, borderRadius: 12, background: '#fff', color: '#000', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <ion-icon name="create-outline"></ion-icon> Check In Manual
              </button>
            </div>

            {/* Scanning Line Indicator */}
            <div style={{ position: 'absolute', top: 72, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.2)' }}>
              <div style={{ width: '40%', height: '100%', background: '#10B981', borderRadius: 4, animation: 'scanline 2s infinite ease-in-out alternate' }}></div>
            </div>

            <style>{`
              @keyframes scanline {
                0% { transform: translateX(0); }
                100% { transform: translateX(150%); }
              }
              @keyframes scanpulse {
                0% { box-shadow: 0 0 0 4000px rgba(0,0,0,0.4), 0 0 10px rgba(16,185,129,0.2) inset; }
                50% { box-shadow: 0 0 0 4000px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.5) inset; }
                100% { box-shadow: 0 0 0 4000px rgba(0,0,0,0.4), 0 0 10px rgba(16,185,129,0.2) inset; }
              }
              @keyframes scanglide {
                0% { top: 10%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 90%; opacity: 0; }
              }
            `}</style>

            {/* Reticle */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 260, height: 260 }}>
              <div style={{ position: 'absolute', inset: 0, border: '4px solid #10B981', borderRadius: 24, animation: 'scanpulse 2s infinite ease-in-out' }}></div>
              <div style={{ position: 'absolute', left: '10%', right: '10%', height: 2, background: '#10B981', boxShadow: '0 0 8px #10B981, 0 4px 12px rgba(16,185,129,0.5)', animation: 'scanglide 2s infinite ease-in-out alternate' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 24, height: 24, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 2, height: '100%', background: '#10B981' }}></div>
                <div style={{ width: '100%', height: 2, background: '#10B981', position: 'absolute' }}></div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, pointerEvents: 'auto' }}>
              <button className="btn" onClick={toggleFlash} style={{ width: 56, height: 56, padding: 0, borderRadius: 16, background: flashOn ? '#10B981' : '#fff', color: flashOn ? '#fff' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <ion-icon name={flashOn ? "flash" : "flash-outline"} style={{ fontSize: 24 }}></ion-icon>
              </button>
              <button className="btn" onClick={switchCamera} style={{ width: 56, height: 56, padding: 0, borderRadius: 16, background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                <ion-icon name="camera-reverse-outline" style={{ fontSize: 24 }}></ion-icon>
              </button>
            </div>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Manual Search Drawer */}
      {showManualSearch && (
        <div className="drawer-backdrop" onClick={e => e.target === e.currentTarget && setShowManualSearch(false)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Manual Search</h3>
              <button className="btn-icon" onClick={() => setShowManualSearch(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            
            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Cari Tamu</label>
                <input className="input" value={manualSearch} onChange={e => setManualSearch(e.target.value)} placeholder="Nama atau nomor telepon..." />
              </div>
              
              <div style={{ marginTop: 16 }}>
                {!manualSearch ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280', fontSize: 14 }}>
                    Ketik untuk mencari tamu...
                  </div>
                ) : filteredForManual.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6B7280', fontSize: 14 }}>
                    Tidak ada tamu yang cocok
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredForManual.map(g => {
                      const isCheckedIn = checkins.some(c => c.guest_id === g.id)
                      return (
                        <div key={g.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E5E7EB' }}>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{g.nama}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{g.telepon || 'Tanpa no. telepon'}</p>
                          </div>
                          {isCheckedIn ? (
                            <span className="chip" style={{ background: '#D1FAE5', color: '#059669', fontSize: 12, display: 'inline-block' }}>Check-in</span>
                          ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => checkInGuest(g.id)} style={{ padding: '6px 12px', fontSize: 12 }}>
                              Check In
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
