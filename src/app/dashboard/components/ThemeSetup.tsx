'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabaseAuth, updateProfile } from '@/lib/supabaseAuth'
import type { UserProfile, UserPlan } from '@/lib/supabaseAuth'
import { IsiDataInner } from '@/app/isi-data/IsiDataContent'
import { fetchAllPageData, filterTemplatesByPackage, type Package, type Template } from '@/lib/supabase'

interface ThemeSetupProps {
  profile: UserProfile
  orderId: string // Unique wedding ID for this user (from wedding_settings)
  onProfileUpdate: () => void // Refresh profile in parent
}

export default function ThemeSetup({ profile, orderId, onProfileUpdate }: ThemeSetupProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [packages, setPackages] = useState<Package[]>([])
  const [allTemplates, setAllTemplates] = useState<any[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  
  const [selectedPkg, setSelectedPkg] = useState<string | null>(profile.package_id)
  const [selectedTpl, setSelectedTpl] = useState<string | null>(profile.template_id)
  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [weddingDataStatus, setWeddingDataStatus] = useState<'empty' | 'partial' | 'complete'>('empty')

  // 1. Fetch Packages & Templates using cached fetchAllPageData
  useEffect(() => {
    async function fetchAll() {
      try {
        const { packages: pkgs, templates: tpls } = await fetchAllPageData()
        setPackages(pkgs)
        setAllTemplates(tpls)
        
        // If a package is already selected, filter templates
        if (selectedPkg) {
          const filtered = filterTemplatesByPackage(tpls, selectedPkg)
          setFilteredTemplates(filtered)
        }
      } catch (err) {
        console.error('Failed to load packages/templates:', err)
      }
      setLoadingData(false)
    }
    fetchAll()
  }, []) // Only load once on mount

  // Update filtered templates when package changes
  useEffect(() => {
    if (selectedPkg && allTemplates.length > 0) {
      const filtered = filterTemplatesByPackage(allTemplates, selectedPkg)
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates([])
    }
  }, [selectedPkg, allTemplates])

  // Check wedding data status
  useEffect(() => {
    if (!orderId) return
    async function checkStatus() {
      const { data } = await supabaseAuth
        .from('wedding_data')
        .select('pria_nama_panggilan, wanita_nama_panggilan, akad_tanggal')
        .eq('order_id', orderId)
        .maybeSingle()
      
      if (!data) {
        setWeddingDataStatus('empty')
      } else if (data.pria_nama_panggilan && data.wanita_nama_panggilan && data.akad_tanggal) {
        setWeddingDataStatus('complete')
      } else if (data.pria_nama_panggilan || data.wanita_nama_panggilan) {
        setWeddingDataStatus('partial')
      } else {
        setWeddingDataStatus('empty')
      }
    }
    checkStatus()
  }, [orderId, step])

  // Set initial step based on profile
  useEffect(() => {
    if (!profile.package_id) setStep(1)
    else if (!profile.template_id) setStep(2)
    else setStep(3)
  }, [profile.package_id, profile.template_id])

  async function handleSelectPackage(pkgId: string) {
    setSelectedPkg(pkgId)
  }

  async function handleSavePackage() {
    if (!selectedPkg) return
    setSaving(true)
    await updateProfile(profile.id, { package_id: selectedPkg })
    onProfileUpdate()
    setSaving(false)
    setStep(2)
  }

  async function handleSelectTemplate(tplId: string) {
    setSelectedTpl(tplId)
  }

  async function handleSaveTemplate() {
    if (!selectedTpl) return
    setSaving(true)
    await updateProfile(profile.id, { template_id: selectedTpl })
    onProfileUpdate()
    setSaving(false)
    setStep(3)
  }

  function handleGoToCheckout() {
    router.push(`/checkout?paket=${selectedPkg}&templates=${selectedTpl}`)
  }

  if (loadingData) return (
    <div className="p-8 text-center">
      <div style={{ fontSize: 40, marginBottom: 12, animation: 'float 2s ease-in-out infinite' }}>🎨</div>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Memuat data tema...</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* ─── Stepper ─── */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          {[
            { num: 1 as const, label: 'Pilih Paket', icon: '📦' },
            { num: 2 as const, label: 'Pilih Template', icon: '🎨' },
            { num: 3 as const, label: 'Isi Data', icon: '📝' },
            { num: 4 as const, label: 'Checkout', icon: '💳' }
          ].map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div 
                onClick={() => {
                  // Allow navigating back to completed steps
                  if (s.num < step || (s.num === 3 && profile.template_id)) {
                    setStep(s.num)
                  }
                }}
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1,
                  cursor: s.num <= step ? 'pointer' : 'default', 
                  opacity: s.num <= step ? 1 : 0.4,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, marginBottom: 6,
                  transition: 'all 0.3s',
                  background: step === s.num ? 'var(--dark)' : step > s.num ? 'var(--success)' : 'var(--bg-hover)',
                  color: step >= s.num ? '#fff' : 'var(--text-muted)',
                  boxShadow: step === s.num ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                }}>
                  {step > s.num ? '✓' : s.icon}
                </div>
                <span style={{ 
                  fontSize: 11, fontWeight: 600, textAlign: 'center',
                  color: step === s.num ? 'var(--text-primary)' : 'var(--text-muted)'
                }}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div style={{ 
                  flex: '0 0 auto', width: 32, height: 2, 
                  background: step > s.num ? 'var(--success)' : 'var(--stroke)',
                  borderRadius: 1, transition: 'background 0.3s'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Step 1: Pilih Paket ─── */}
      {step === 1 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--stroke)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Pilih Paket Undangan</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Pilih paket yang sesuai dengan kebutuhan pernikahan kamu.
            </p>
          </div>
          
          <div style={{ padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
              {packages.map(pkg => (
                <div key={pkg.id} 
                  onClick={() => handleSelectPackage(pkg.id)}
                  style={{
                    border: `2px solid ${selectedPkg === pkg.id ? 'var(--dark)' : 'var(--stroke)'}`,
                    borderRadius: 'var(--radius-lg)', padding: 20, cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedPkg === pkg.id ? '#F8FAFC' : '#fff',
                    transform: selectedPkg === pkg.id ? 'translateY(-2px)' : 'none',
                    boxShadow: selectedPkg === pkg.id ? '0 8px 25px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, fontSize: 16 }}>{pkg.emoji} {pkg.name}</span>
                    {selectedPkg === pkg.id && (
                      <div style={{ 
                        width: 24, height: 24, borderRadius: '50%', 
                        background: 'var(--dark)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700
                      }}>✓</div>
                    )}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
                    {pkg.price === 0 ? (
                      <span style={{ color: 'var(--success)' }}>Gratis</span>
                    ) : (
                      <>Rp {pkg.price.toLocaleString('id-ID')}</>
                    )}
                    {pkg.original_price > pkg.price && (
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 8 }}>
                        Rp {pkg.original_price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pkg.features.slice(0, 4).map((f: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                    {pkg.features.length > 4 && (
                      <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                        + {pkg.features.length - 4} fitur lainnya
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSavePackage} disabled={!selectedPkg || saving} className="btn btn-primary" style={{ paddingInline: 32 }}>
                {saving ? '⏳ Menyimpan...' : 'Lanjut Pilih Template →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 2: Pilih Template ─── */}
      {step === 2 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--stroke)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Pilih Template Undangan</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pilih desain undangan yang kamu suka.</p>
            </div>
            <button onClick={() => setStep(1)} className="btn btn-secondary btn-sm">← Ganti Paket</button>
          </div>

          <div style={{ padding: 20 }}>
            {filteredTemplates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
                <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Belum Ada Template</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Template untuk paket ini sedang disiapkan.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
                {filteredTemplates.map(tpl => (
                  <div key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    style={{
                      border: `2px solid ${selectedTpl === tpl.id ? 'var(--dark)' : 'var(--stroke)'}`,
                      borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: selectedTpl === tpl.id ? 'translateY(-4px)' : 'none',
                      boxShadow: selectedTpl === tpl.id ? '0 12px 30px rgba(0,0,0,0.12)' : 'var(--shadow-card)'
                    }}
                  >
                    <div style={{ aspectRatio: '3/4', background: 'var(--bg-hover)', position: 'relative', overflow: 'hidden' }}>
                      {tpl.thumbnail_url ? (
                        <img src={tpl.thumbnail_url} alt={tpl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                          No Preview
                        </div>
                      )}
                      {selectedTpl === tpl.id && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'var(--dark)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}>✓</div>
                      )}
                      {tpl.is_popular && (
                        <div style={{
                          position: 'absolute', top: 8, left: 8,
                          padding: '3px 8px', borderRadius: 999,
                          background: '#FEF3C7', color: '#92400E',
                          fontSize: 10, fontWeight: 700
                        }}>⭐ Popular</div>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{tpl.name}</p>
                      {tpl.style_label && (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{tpl.style_label}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveTemplate} disabled={!selectedTpl || saving} className="btn btn-primary" style={{ paddingInline: 32 }}>
                {saving ? '⏳ Menyimpan...' : 'Lanjut Isi Data →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 3: Isi Data Wedding ─── */}
      {step === 3 && (
        <div>
          {/* Action bar */}
          <div className="card" style={{ padding: '12px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary btn-sm">← Ganti Template</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: weddingDataStatus === 'complete' ? 'var(--success)' 
                    : weddingDataStatus === 'partial' ? 'var(--warning)' : 'var(--text-muted)',
                  transition: 'background 0.3s'
                }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {weddingDataStatus === 'complete' ? 'Data lengkap' 
                    : weddingDataStatus === 'partial' ? 'Data belum lengkap' 
                    : 'Belum diisi'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setStep(4)} 
              className="btn btn-success btn-sm"
              style={{ boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
            >
              Selesai Isi Data →
            </button>
          </div>

          {/* Embedded Wedding Data Form */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ 
              maxHeight: '70vh', overflowY: 'auto',
              scrollbarWidth: 'thin',
            }}>
              <IsiDataInner embeddedOrderId={orderId} />
            </div>
          </div>
          
          {/* Info tip */}
          <div style={{ 
            marginTop: 16, padding: '14px 18px', 
            background: '#F0F9FF', border: '1px solid #BAE6FD', 
            borderRadius: 'var(--radius-lg)',
            display: 'flex', gap: 12, alignItems: 'flex-start',
            fontSize: 13, color: '#0369A1'
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Data kamu otomatis tersimpan sebagai draft.</p>
              <p style={{ lineHeight: 1.5 }}>
                Setelah selesai mengisi data pengantin, acara, dan foto, klik tombol <strong>Selesai Isi Data</strong> di atas untuk lanjut ke Checkout.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Step 4: Checkout ─── */}
      {step === 4 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: '#D1FAE5', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, margin: '0 auto 24px',
            animation: 'float 3s ease-in-out infinite'
          }}>🎉</div>
          
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Semua Sudah Siap!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Tema dan data pernikahan kamu sudah tersimpan sebagai draft. 
            Lakukan pembayaran untuk mengaktifkan undangan digital kamu dan membuka semua fitur dashboard.
          </p>
          
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, maxWidth: 480, margin: '0 auto 32px' }}>
            <div style={{ padding: 12, background: 'var(--bg-hover)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <span style={{ fontSize: 20 }}>📦</span>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Paket</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>
                {packages.find(p => p.id === selectedPkg)?.name || '-'}
              </p>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-hover)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <span style={{ fontSize: 20 }}>🎨</span>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Template</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>
                {filteredTemplates.find(t => t.id === selectedTpl)?.name || allTemplates.find((t: any) => t.id === selectedTpl)?.name || '-'}
              </p>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-hover)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <span style={{ fontSize: 20 }}>📝</span>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Data</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: weddingDataStatus === 'complete' ? 'var(--success)' : 'var(--warning)' }}>
                {weddingDataStatus === 'complete' ? '✓ Lengkap' : weddingDataStatus === 'partial' ? '⚠ Sebagian' : '– Kosong'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setStep(3)} className="btn btn-secondary" style={{ paddingInline: 24 }}>
              ← Cek Data Lagi
            </button>
            <button onClick={handleGoToCheckout} className="btn btn-primary" style={{ 
              paddingInline: 32,
              boxShadow: '0 8px 25px rgba(2,6,23,0.2)',
              background: 'var(--dark)'
            }}>
              💳 Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
