'use client'
import { useEffect, useCallback, useState, useRef } from 'react'

// ─── Animated Counter Hook ─────────────────────────────────────────────────
export function useAnimatedCounter(target: number, duration = 800) {
  const [count, setCount] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    const start = prevTarget.current
    const diff = target - start
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
    prevTarget.current = target
  }, [target, duration])

  return count
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────
interface ConfirmOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

let resolveConfirm: ((v: boolean) => void) | null = null

export function ConfirmDialog() {
  const [open, setOpen] = useState(false)
  const [opts, setOpts] = useState<ConfirmOptions>({})

  useEffect(() => {
    function handler(e: CustomEvent<ConfirmOptions & { resolve: (v: boolean) => void }>) {
      setOpts(e.detail)
      resolveConfirm = e.detail.resolve
      setOpen(true)
    }
    window.addEventListener('dashboard-confirm' as any, handler)
    return () => window.removeEventListener('dashboard-confirm' as any, handler)
  }, [])

  function close(result: boolean) {
    setOpen(false)
    resolveConfirm?.(result)
    resolveConfirm = null
  }

  const iconMap = {
    danger: { bg: '#FEE2E2', color: '#EF4444', icon: 'alert-circle' },
    warning: { bg: '#FEF3C7', color: '#F59E0B', icon: 'warning' },
    info: { bg: '#DBEAFE', color: '#3B82F6', icon: 'information-circle' },
  }
  const t = opts.type || 'danger'
  const ic = iconMap[t]

  if (!open) return null

  return (
    <div className="confirm-backdrop" onClick={() => close(false)}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon" style={{ background: ic.bg }}>
          <ion-icon name={ic.icon} style={{ fontSize: 32, color: ic.color }}></ion-icon>
        </div>
        <h3 className="confirm-title">{opts.title || 'Konfirmasi'}</h3>
        <p className="confirm-message">{opts.message || 'Apakah Anda yakin?'}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-primary" style={{ background: ic.color }} onClick={() => close(true)}>
            {opts.confirmText || 'Ya, Lanjutkan'}
          </button>
          <button className="confirm-btn-secondary" onClick={() => close(false)}>
            {opts.cancelText || 'Batal'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function showConfirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise(resolve => {
    const event = new CustomEvent('dashboard-confirm', {
      detail: { ...options, resolve }
    })
    window.dispatchEvent(event)
  })
}

// ─── Keyboard Shortcuts ────────────────────────────────────────────────────
export function useKeyboardShortcuts(callbacks: {
  onSearch?: () => void
  onEscape?: () => void
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // ⌘K or Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        callbacks.onSearch?.()
      }
      if (e.key === 'Escape') {
        callbacks.onEscape?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [callbacks])
}

// ─── Scroll-to-Top Button ──────────────────────────────────────────────────
export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const main = document.querySelector('.dashboard-main')
    if (!main) return
    function onScroll() { setShow(main!.scrollTop > 400) }
    main.addEventListener('scroll', onScroll)
    return () => main.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      className="scroll-to-top"
      onClick={() => document.querySelector('.dashboard-main')?.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Kembali ke atas"
    >
      <ion-icon name="chevron-up-outline"></ion-icon>
    </button>
  )
}

// ─── Page Greeting ─────────────────────────────────────────────────────────
export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

// ─── Format Currency ───────────────────────────────────────────────────────
export function formatRupiah(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}
