'use client'
import { useState } from 'react'
import { supabaseAuth, getPlanLabel } from '@/lib/supabaseAuth'
import type { UserPlan } from '@/lib/supabaseAuth'

interface Props {
  user: any;
  profile: any;
  plan: UserPlan;
  onRefreshProfile: () => void;
  onSignOut: () => void;
  showToast: (msg: string) => void;
}

type Tab = 'profil' | 'keamanan' | 'langganan' | 'keluar'

export default function AccountSettings({ user, profile, plan, onRefreshProfile, onSignOut, showToast }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('profil')
  
  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  
  // Forms
  const [profileForm, setProfileForm] = useState({ username: profile?.username || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const initial = profile?.username ? profile.username.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || '?')

  const handleSaveProfile = async () => {
    // Only email is actually editable based on screenshot design 
    // Username is disabled
    setLoading(true)
    try {
      if (profileForm.email !== user.email) {
        const { error } = await supabaseAuth.auth.updateUser({ email: profileForm.email })
        if (error) throw error
        showToast('Email berhasil diperbarui. Silakan cek email Anda untuk konfirmasi.')
      }
      setShowEditProfile(false)
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPass !== passwordForm.confirm) {
      showToast('Konfirmasi password tidak cocok')
      return
    }
    if (passwordForm.newPass.length < 8) {
      showToast('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabaseAuth.auth.updateUser({ password: passwordForm.newPass })
      if (error) throw error
      showToast('Password berhasil diubah')
      setShowChangePassword(false)
      setPasswordForm({ current: '', newPass: '', confirm: '' })
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="account-settings-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Pengaturan Akun</h2>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar Nav for Settings */}
        <div className="card" style={{ width: 240, padding: 12, flexShrink: 0, border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            {[
              { id: 'profil', icon: 'person-outline', label: 'Profil Saya' },
              { id: 'keamanan', icon: 'shield-checkmark-outline', label: 'Keamanan' },
              { id: 'langganan', icon: 'card-outline', label: 'Langganan' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: activeTab === item.id ? 600 : 400,
                  color: activeTab === item.id ? '#ffffff' : '#64748b',
                  backgroundColor: activeTab === item.id ? '#0f172a' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  marginBottom: 8,
                }}
              >
                <ion-icon name={item.icon} style={{ fontSize: 20 }}></ion-icon>
                {item.label}
              </button>
            ))}

            <div style={{ height: 1, backgroundColor: '#e2e8f0', margin: '16px 0' }} />
            
            <button
              onClick={onSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 400,
                color: '#EF4444',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <ion-icon name="log-out-outline" style={{ fontSize: 20 }}></ion-icon>
              Keluar
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="card" style={{ flex: 1, padding: 32 }}>
          {activeTab === 'profil' && (
            <div className="animate-fade-in">
              {/* Header Profil */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                    {initial}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>{profile?.username || 'User'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>User</p>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowEditProfile(true)}>
                  <ion-icon name="create-outline"></ion-icon> Edit Profil
                </button>
              </div>

              {/* Info Personal */}
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Informasi Personal</h4>
              
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Username</p>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{profile?.username || '-'}</p>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Email</p>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{user?.email || '-'}</p>
              </div>
            </div>
          )}

          {activeTab === 'keamanan' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Keamanan Akun</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Password Akun</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Ganti password secara berkala untuk keamanan maksimal</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowChangePassword(true)}>
                  Ubah Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'langganan' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Langganan</h3>
              
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ion-icon name="leaf" style={{ color: '#64748B', fontSize: 20 }}></ion-icon>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Paket Saat Ini</p>
                      <h4 style={{ fontSize: 16, fontWeight: 700 }}>Paket {getPlanLabel(plan)}</h4>
                    </div>
                  </div>
                  <button className="btn" style={{ background: '#0F172A', color: 'white' }}>
                    Upgrade Paket
                  </button>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Fitur dasar untuk mengelola tamu undangan</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> Maksimal 50 Tamu
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> 50 Check-in QR Code
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> Kirim Undangan WhatsApp
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> 1 Template WhatsApp
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> 1 Item Wishlist Kado
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> Wedding Planner
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> Ucapan Tamu Digital
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <ion-icon name="checkmark-circle" style={{ color: '#0F172A' }}></ion-icon> Amplop Digital
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Edit Profile */}
      {showEditProfile && (
        <>
          <div className="drawer-backdrop" onClick={() => !loading && setShowEditProfile(false)} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Edit Informasi Profil</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Perbarui username dan email Anda</p>
              </div>
              <button className="btn-icon" onClick={() => !loading && setShowEditProfile(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>

            <div className="drawer-body">
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <ion-icon name="information-circle" style={{ color: '#3B82F6', fontSize: 20, flexShrink: 0 }}></ion-icon>
                  <div>
                    <h5 style={{ fontSize: 13, fontWeight: 600, color: '#1E3A8A', marginBottom: 4 }}>Tips Keamanan</h5>
                    <p style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.5 }}>Username akan digunakan untuk login. Email berguna untuk pemulihan akun jika lupa password.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="label">Username</label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <ion-icon name="lock-closed-outline" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                  <input className="input" value={profileForm.username} disabled style={{ paddingLeft: 44, background: '#F8FAFC' }} />
                </div>
                <p style={{ fontSize: 11, color: '#D97706', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ion-icon name="information-circle"></ion-icon> Username tidak dapat diubah karena terkait dengan link undangan Anda
                </p>
              </div>

              <div>
                <label className="label">Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opsional)</span></label>
                <div className="input-with-icon" style={{ position: 'relative' }}>
                  <ion-icon name="mail-outline" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                  <input className="input" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} style={{ paddingLeft: 44 }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ion-icon name="checkmark-circle" style={{ color: '#64748B' }}></ion-icon> Digunakan untuk reset password dan notifikasi penting
                </p>
              </div>
            </div>

            <div className="drawer-footer" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowEditProfile(false)} disabled={loading}>Batal</button>
              <button className="btn" style={{ flex: 1, justifyContent: 'center', background: '#0F172A', color: 'white' }} onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Change Password */}
      {showChangePassword && (
        <>
          <div className="drawer-backdrop" onClick={() => !loading && setShowChangePassword(false)} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Ubah Password</h3>
              <button className="btn-icon" onClick={() => !loading && setShowChangePassword(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>

            <div className="drawer-body">
              <div style={{ marginBottom: 20 }}>
                <label className="label">Password Saat Ini</label>
                <div style={{ position: 'relative' }}>
                  <ion-icon name="lock-closed-outline" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                  <input className="input" type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="Masukkan password saat ini" style={{ paddingLeft: 44 }} />
                  <ion-icon name="eye-off-outline" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="label">Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <ion-icon name="key-outline" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                  <input className="input" type="password" value={passwordForm.newPass} onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })} placeholder="Masukkan password baru" style={{ paddingLeft: 44 }} />
                  <ion-icon name="eye-off-outline" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label className="label">Konfirmasi Password Baru</label>
                <div style={{ position: 'relative' }}>
                  <ion-icon name="checkmark-circle-outline" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                  <input className="input" type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} placeholder="Konfirmasi password baru" style={{ paddingLeft: 44 }} />
                  <ion-icon name="eye-off-outline" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}></ion-icon>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Syarat Password:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ion-icon name="checkmark-circle" style={{ color: passwordForm.newPass.length >= 8 ? '#10B981' : '#CBD5E1' }}></ion-icon> Minimal 8 karakter
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ion-icon name="checkmark-circle" style={{ color: /[A-Z]/.test(passwordForm.newPass) ? '#10B981' : '#CBD5E1' }}></ion-icon> Mengandung huruf besar
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ion-icon name="checkmark-circle" style={{ color: /[a-z]/.test(passwordForm.newPass) ? '#10B981' : '#CBD5E1' }}></ion-icon> Mengandung huruf kecil
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ion-icon name="checkmark-circle" style={{ color: /[0-9!@#$%^&*]/.test(passwordForm.newPass) ? '#10B981' : '#CBD5E1' }}></ion-icon> Mengandung angka atau simbol
                  </p>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <button className="btn" style={{ width: '100%', justifyContent: 'center', background: '#0F172A', color: 'white', padding: '0.875rem' }} onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Password'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
