'use client'
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  orderId: string
  showToast: (msg: string) => void
  settings?: any
  onRefresh?: () => void
}

interface FundSource { id: number; name: string; amount: number }
interface Deposit { id: number; amount: number; source: string; date: string; note: string }

export default function NabungBareng({ orderId, showToast, settings, onRefresh }: Props) {
  const [target, setTarget] = useState(settings?.nabung_target || 0)
  const [fundSources, setFundSources] = useState<FundSource[]>(settings?.nabung_sources || [])
  const [deposits, setDeposits] = useState<Deposit[]>(settings?.nabung_deposits || [])
  const [depositAmount, setDepositAmount] = useState(0)
  const [depositSource, setDepositSource] = useState('cash')
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [showAddSource, setShowAddSource] = useState(false)
  const [newSourceName, setNewSourceName] = useState('')
  const [newTarget, setNewTarget] = useState(0)

  const saved = useMemo(() => deposits.reduce((sum, d) => sum + d.amount, 0), [deposits])
  const computedFundSources = useMemo(() => {
    return fundSources.map(source => {
      const sourceTotal = deposits.filter(d => d.source === source.name).reduce((sum, d) => sum + d.amount, 0)
      return { ...source, amount: sourceTotal }
    })
  }, [fundSources, deposits])

  const progress = target > 0 ? Math.min(100, (saved / target) * 100) : 0
  const remaining = Math.max(0, target - saved)

  async function saveToDB(newTarget: number, newSources: FundSource[], newDeposits: Deposit[]) {
    const { error } = await supabase.from('wedding_settings').update({
      nabung_target: newTarget,
      nabung_sources: newSources,
      nabung_deposits: newDeposits
    }).eq('order_id', orderId)
    
    if (error) {
      showToast('Gagal menyimpan ke database')
    } else if (onRefresh) {
      onRefresh()
    }
  }

  function formatRp(n: number) { return 'Rp ' + n.toLocaleString('id-ID') }

  function quickAmount(amount: number) {
    setDepositAmount(amount)
  }

  async function handleDeposit() {
    if (depositAmount <= 0) { showToast('Masukkan nominal setoran'); return }
    const newDeposit: Deposit = {
      id: Date.now(), amount: depositAmount,
      source: depositSource, date: new Date().toISOString(),
      note: ''
    }
    const updatedDeposits = [newDeposit, ...deposits]
    setDeposits(updatedDeposits)
    setDepositAmount(0)
    
    await saveToDB(target, fundSources, updatedDeposits)
    showToast(`Setoran ${formatRp(depositAmount)} berhasil dicatat!`)
  }

  async function addFundSource() {
    if (!newSourceName.trim()) return
    const updatedSources = [...fundSources, { id: Date.now(), name: newSourceName, amount: 0 }]
    setFundSources(updatedSources)
    setNewSourceName('')
    setShowAddSource(false)
    
    await saveToDB(target, updatedSources, deposits)
    showToast('Sumber dana berhasil ditambahkan')
  }

  async function saveTarget() {
    setTarget(newTarget)
    setShowTargetModal(false)
    
    await saveToDB(newTarget, fundSources, deposits)
    showToast('Target tabungan diperbarui')
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="savings-hero">
        <div className="nabung-hero-top">
          <div>
            <div className="savings-hero-label">TABUNGAN BERSAMA</div>
            <div className="savings-hero-amount">{formatRp(saved)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.5 }}>dari target</div>
            <div className="nabung-hero-target-value">{formatRp(target)}</div>
            <button className="btn btn-sm" onClick={() => { setNewTarget(target); setShowTargetModal(true) }}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginTop: 4, fontSize: 12 }}>
              Atur Target
            </button>
          </div>
        </div>
        <div className="savings-progress-track">
          <div className="savings-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="savings-milestones">
          <span>🎯 25%</span>
          <span>🎯 50%</span>
          <span>🎯 75%</span>
          <span>🎯 100%</span>
        </div>
      </div>

      {/* Motivational text */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 20, background: 'var(--bg-page)', border: '1px solid var(--stroke)' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {target === 0 ? 'Yuk mulai tentukan target tabungan kalian berdua.' : `${progress.toFixed(1)}% dari target sudah tercapai! Terus semangat 💪`}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="nabung-summary-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ion-icon name="trending-up-outline" style={{ fontSize: 20, color: '#059669' }}></ion-icon>
            </div>
            <div>
              <div className="stat-label">Sudah Terkumpul</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{progress.toFixed(1)}%</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatRp(saved)} terkumpul</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ion-icon name="flag-outline" style={{ fontSize: 20, color: '#DC2626' }}></ion-icon>
            </div>
            <div>
              <div className="stat-label">Sisa yang Dibutuhkan</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{formatRp(remaining)}</div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{target === 0 ? 'Tentukan target dulu ya' : 'Tetap semangat!'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Two columns on desktop */}
      <div className="nabung-detail-grid" style={{ alignItems: 'start' }}>
        
        {/* Left Column: Sumber Dana + Setor Tabungan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Fund Sources */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ion-icon name="wallet-outline" style={{ fontSize: 16 }}></ion-icon>
                Sumber Dana Utama
              </span>
              <button className="btn-ghost btn-sm" onClick={() => setShowAddSource(true)} style={{ fontSize: 13, color: 'var(--accent)' }}>
                + Tambah
              </button>
            </div>
            <div className="card-body">
              {fundSources.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                  Belum ada sumber dana.<br />Pencet (+ Tambah) untuk membuat baru.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {computedFundSources.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{formatRp(s.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deposit Form */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ion-icon name="add-circle" style={{ fontSize: 18, color: '#059669' }}></ion-icon>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: 15 }}>Setor Tabungan</h4>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Catat setiap kali kalian menabung</p>
              </div>
            </div>

            {/* Quick Amount */}
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>PILIH CEPAT</p>
            <div className="quick-amount-group">
              {[100000, 250000, 500000, 1000000].map(amt => (
                <button key={amt} className={`quick-amount-btn ${depositAmount === amt ? 'selected' : ''}`}
                  onClick={() => quickAmount(amt)}>
                  {amt >= 1000000 ? `${amt / 1000000} Juta` : `${amt / 1000}rb`}
                </button>
              ))}
            </div>

            {/* Manual Input */}
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>ATAU KETIK NOMINAL *</p>
            <input className="input" type="number" value={depositAmount || ''} onChange={e => setDepositAmount(parseInt(e.target.value) || 0)}
              placeholder="Rp 0" style={{ marginBottom: 16 }} />

            {/* Source Selector */}
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>PILIH SUMBER DANA (OPSIONAL)</p>
            <select className="input" value={depositSource} onChange={e => setDepositSource(e.target.value)}
              style={{ marginBottom: 16 }}>
              <option value="cash">Kas Tunai / Belum Dialokasikan</option>
              {fundSources.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>

            <button className="btn btn-success" onClick={handleDeposit}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', gap: 8 }}>
              <ion-icon name="time-outline" style={{ fontSize: 18 }}></ion-icon>
              Setor Sekarang
            </button>
          </div>
        </div>

        {/* Right Column: Riwayat Setoran */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Deposit History */}
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ion-icon name="receipt-outline" style={{ fontSize: 16 }}></ion-icon>
                Riwayat Setoran
              </span>
            </div>
            <div className="card-body">
              {deposits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <ion-icon name="receipt-outline" style={{ fontSize: 32, color: 'var(--text-muted)', display: 'block', margin: '0 auto 8px' }}></ion-icon>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Belum ada riwayat setoran</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {deposits.slice(0, 5).map(d => (
                    <div key={d.id} className="activity-item">
                      <div className="activity-dot" style={{ background: '#10B981' }}></div>
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{formatRp(d.amount)}</p>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.source}</span>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {new Date(d.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Tips */}
      <div className="tips-card">
        <ion-icon name="bulb-outline"></ion-icon>
        <div>
          <p><strong>Tips Nabung Bareng</strong></p>
          <p>Sepakati jumlah tetap setiap bulan dan catat di sini. Konsistensi lebih penting daripada jumlah besar. Kalian bisa mulai dari nominal kecil dan tingkatkan secara bertahap.</p>
        </div>
      </div>

      {/* Target Modal */}
      {showTargetModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowTargetModal(false)}>
          <div className="modal-content" style={{ maxWidth: 400, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Atur Target Tabungan</h3>
            <label className="label">Target Nominal</label>
            <input className="input" type="number" value={newTarget || ''} onChange={e => setNewTarget(parseInt(e.target.value) || 0)} placeholder="Contoh: 50000000" />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowTargetModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveTarget}>Simpan Target</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAddSource(false)}>
          <div className="modal-content" style={{ maxWidth: 400, padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Tambah Sumber Dana</h3>
            <label className="label">Nama Sumber Dana</label>
            <input className="input" value={newSourceName} onChange={e => setNewSourceName(e.target.value)} placeholder="Contoh: Tabungan BCA" />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddSource(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={addFundSource}>Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
