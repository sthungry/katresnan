// ─── Cookie helpers for pending order persistence ──────────────────────────
// Stores order state in a cookie for 30 minutes
// If user refreshes before confirming, state is restored
// After 30 minutes, cookie expires and order is auto-cancelled in DB

const COOKIE_NAME = 'katresnan_pending_order'
const COOKIE_MINUTES = 30

export interface PendingOrderCookie {
  orderId: string
  paket: string
  templates: string[]
  payMethod: string
  harga: number
  kode_unik: number
  total: number
  nama: string
  email: string
  wa: string
  catatan: string
  expiresAt: number // timestamp ms
  step: 'payment' | 'success'
}

export function savePendingOrder(data: PendingOrderCookie) {
  const expires = new Date(Date.now() + COOKIE_MINUTES * 60 * 1000)
  const value = encodeURIComponent(JSON.stringify(data))
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export function getPendingOrder(): PendingOrderCookie | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return null
  try {
    const value = decodeURIComponent(match.split('=').slice(1).join('='))
    const parsed: PendingOrderCookie = JSON.parse(value)
    // Check if expired in JS too (belt + suspenders)
    if (Date.now() > parsed.expiresAt) {
      clearPendingOrder()
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearPendingOrder() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function getRemainingMs(cookie: PendingOrderCookie): number {
  return Math.max(0, cookie.expiresAt - Date.now())
}
