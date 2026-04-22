'use client'
import { useState, useMemo } from 'react'

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

export default function WeddingPlannerTab() {
  const [activeTab, setActiveTab] = useState<PlannerTab>('calendar')
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checklistItems, setChecklistItems] = useState<{ id: number; text: string; done: boolean; category: string }[]>([
    { id: 1, text: 'Booking venue resepsi', done: false, category: 'Venue' },
    { id: 2, text: 'Pesan undangan digital', done: true, category: 'Undangan' },
    { id: 3, text: 'Fitting baju pengantin', done: false, category: 'Busana' },
    { id: 4, text: 'Meeting dengan wedding planner', done: false, category: 'Planning' },
    { id: 5, text: 'Pilih dekorasi pelaminan', done: false, category: 'Dekorasi' },
  ])

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
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()
    const days = []

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, current: false, isToday: false })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d, current: true,
        isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
      })
    }
    // Next month padding
    while (days.length < 42) {
      days.push({ day: days.length - firstDay - daysInMonth + 1, current: false, isToday: false })
    }
    return days
  }, [currentMonth])

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const dayHeaders = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB']

  function prevMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }
  function nextMonth() {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }
  function goToday() {
    setCurrentMonth(new Date())
  }

  function toggleChecklist(id: number) {
    setChecklistItems(items => items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ion-icon name="heart" style={{ fontSize: 24, color: '#EF4444' }}></ion-icon>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>Wedding Planner</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Rencanakan hari spesial Anda dengan mudah</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><ion-icon name="settings-outline"></ion-icon> Pengaturan</button>
          <button className="btn btn-primary"><ion-icon name="download-outline"></ion-icon> Export PDF</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
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
            <div className="stat-value" style={{ marginTop: 8 }}>—</div>
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
          <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {dayHeaders.map(d => <div className="calendar-day-header" key={d}>{d}</div>)}
            {calendarDays.map((day, i) => (
              <div key={i} className={`calendar-day ${!day.current ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}>
                <span className="calendar-day-number">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Checklist Pernikahan</h3>
            <button className="btn btn-primary btn-sm">
              <ion-icon name="add-outline"></ion-icon> Tambah Tugas
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {checklistItems.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem',
                background: 'var(--bg-page)', borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onClick={() => toggleChecklist(item.id)}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4, border: `2px solid ${item.done ? '#10B981' : '#D1D5DB'}`,
                  background: item.done ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.2s'
                }}>
                  {item.done && <ion-icon name="checkmark" style={{ fontSize: 12, color: '#fff' }}></ion-icon>}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.5 : 1 }}>
                    {item.text}
                  </span>
                </div>
                <span className="chip" style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', fontSize: 11 }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other tabs - placeholder */}
      {!['calendar', 'checklist'].includes(activeTab) && (
        <div className="card">
          <div className="empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {activeTab === 'engagement' ? '💍' : activeTab === 'prewedding' ? '📸' : activeTab === 'seserahan' ? '🎁' : activeTab === 'administrasi' ? '📄' : activeTab === 'budget' ? '💰' : '👥'}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6 }}>
              Fitur ini akan segera hadir. Anda akan bisa mengelola {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} pernikahan Anda di sini.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
