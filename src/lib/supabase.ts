import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },        // tidak perlu session untuk public data
  global: {
    headers: { 'x-client-info': 'katresnan' }
  }
})

// ─── Types ──────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'menunggu_konfirmasi' | 'diproses' | 'selesai' | 'dibatalkan'

export interface Package {
  id: string; name: string; emoji: string
  price: number; original_price: number; discount: number
  max_themes: number; masa_aktif: string; features: string[]
  is_active: boolean; sort_order: number
}
export interface TemplateCategory {
  id: string; name: string; description: string; emoji: string; sort_order: number
}
export interface Template {
  id: string; name: string; category_id: string; style_label: string
  description: string; thumbnail_url: string; demo_url: string
  has_photo: boolean; is_popular: boolean; is_active: boolean; sort_order: number
  category?: TemplateCategory
}
export interface Order {
  id?: string; nama: string; email: string; wa: string
  package_id: string; template_1_id?: string | null; template_2_id?: string | null
  template_text_1: string; template_text_2?: string; metode_bayar: string
  harga: number; kode_unik: number; total: number; status: OrderStatus
  catatan?: string; expires_at?: string; created_at?: string
}

// ─── In-memory cache (hilang saat refresh, tapi cukup untuk SPA navigation) ──
// TTL 5 menit — data paket & template jarang berubah
const CACHE_TTL = 5 * 60 * 1000
const cache: Record<string, { data: any; ts: number }> = {}

function getCache<T>(key: string): T | null {
  const hit = cache[key]
  if (!hit) return null
  if (Date.now() - hit.ts > CACHE_TTL) { delete cache[key]; return null }
  return hit.data as T
}
function setCache(key: string, data: any) {
  cache[key] = { data, ts: Date.now() }
}

// ─── Fetch semua data sekaligus dalam 1 round-trip ───────────────────────────
// Dipanggil sekali di halaman demo, hasilnya di-cache
export interface AllPageData {
  packages: Package[]
  templates: Template[]
  categories: TemplateCategory[]
}

export async function fetchAllPageData(): Promise<AllPageData> {
  const cacheKey = 'all_page_data'
  const cached = getCache<AllPageData>(cacheKey)
  if (cached) return cached

  // Jalankan 3 query paralel sekaligus — lebih cepat dari sequential
  const [pkgRes, tplRes, catRes] = await Promise.all([
    supabase.from('packages').select('*').eq('is_active', true).order('sort_order'),
    supabase
      .from('package_templates')
      .select(`package_id, templates(
        id,name,category_id,style_label,description,thumbnail_url,demo_url,
        has_photo,is_popular,is_active,sort_order,
        template_categories(id,name,emoji,description,sort_order)
      )`),
    supabase.from('template_categories').select('*').eq('is_active', true).order('sort_order'),
  ])

  const packages: Package[] = (pkgRes.data || []).map((p: any) => ({
    ...p,
    features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')
  }))

  // Map templates dengan relasi package_id
  const templatesByPackage: Record<string, Template[]> = {}
  for (const row of (tplRes.data || []) as any[]) {
    const t = row.templates
    if (!t || !t.is_active) continue
    const tpl: Template = { ...t, category: t.template_categories }
    if (!templatesByPackage[row.package_id]) templatesByPackage[row.package_id] = []
    templatesByPackage[row.package_id].push(tpl)
  }
  // Flatten semua template unik
  const allTemplates = Object.values(templatesByPackage).flat()
  const uniqueTemplates = [...new Map(allTemplates.map(t => [t.id, t])).values()]
    .sort((a, b) => a.sort_order - b.sort_order)

  // Attach package_ids ke setiap template (untuk filter)
  const templatePackageMap: Record<string, string[]> = {}
  for (const row of (tplRes.data || []) as any[]) {
    if (!row.templates?.id) continue
    if (!templatePackageMap[row.templates.id]) templatePackageMap[row.templates.id] = []
    templatePackageMap[row.templates.id].push(row.package_id)
  }
  const templatesWithPackages = uniqueTemplates.map(t => ({
    ...t,
    package_ids: templatePackageMap[t.id] || []
  }))

  const categories: TemplateCategory[] = catRes.data || []

  const result = { packages, templates: templatesWithPackages as any, categories }
  setCache(cacheKey, result)
  return result
}

// ─── Helper — filter template by package dari cached data ───────────────────
export function filterTemplatesByPackage(templates: any[], packageId: string): Template[] {
  return templates
    .filter(t => t.package_ids?.includes(packageId))
    .sort((a: Template, b: Template) => a.sort_order - b.sort_order)
}

// ─── Fetch packages saja (untuk Harga.tsx) — dengan cache ───────────────────
export async function fetchPackages(): Promise<Package[]> {
  const cacheKey = 'packages'
  const cached = getCache<Package[]>(cacheKey)
  if (cached) return cached

  const { data, error } = await supabase
    .from('packages').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('fetchPackages:', error.message); return [] }
  const result = (data || []).map((p: any) => ({
    ...p,
    features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')
  }))
  setCache(cacheKey, result)
  return result
}

// ─── Fetch templates by package — dengan cache ──────────────────────────────
export async function fetchTemplatesByPackage(packageId: string): Promise<Template[]> {
  const cacheKey = 'tpl_' + packageId
  const cached = getCache<Template[]>(cacheKey)
  if (cached) return cached

  const { data, error } = await supabase
    .from('package_templates')
    .select(`templates(
      id,name,category_id,style_label,description,thumbnail_url,demo_url,
      has_photo,is_popular,is_active,sort_order,
      template_categories(id,name,emoji,description,sort_order)
    )`)
    .eq('package_id', packageId)
  if (error) { console.error('fetchTemplatesByPackage:', error.message); return [] }
  const result = (data || [])
    .map((r: any) => r.templates).filter((t: any) => t && t.is_active)
    .map((t: any) => ({ ...t, category: t.template_categories }))
    .sort((a: Template, b: Template) => a.sort_order - b.sort_order)
  setCache(cacheKey, result)
  return result
}

// ─── Fetch categories — dengan cache ────────────────────────────────────────
export async function fetchCategories(): Promise<TemplateCategory[]> {
  const cacheKey = 'categories'
  const cached = getCache<TemplateCategory[]>(cacheKey)
  if (cached) return cached

  const { data, error } = await supabase
    .from('template_categories').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('fetchCategories:', error.message); return [] }
  setCache(cacheKey, data || [])
  return data || []
}

// ─── Orders ─────────────────────────────────────────────────────────────────
export async function insertOrder(
  order: Omit<Order, 'id' | 'created_at'>
): Promise<{ data: Order | null; error: string | null }> {
  const { data, error } = await supabase.from('orders').insert([order]).select().single()
  if (error) {
    const msg = `[${error.code}] ${error.message}${error.details ? ' | ' + error.details : ''}${error.hint ? ' | hint: ' + error.hint : ''}`
    console.error('insertOrder ERROR:', msg)
    console.error('Data yang dikirim:', JSON.stringify(order, null, 2))
    return { data: null, error: msg }
  }
  return { data, error: null }
}

export async function confirmOrderPayment(orderId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('orders').update({ status: 'menunggu_konfirmasi' }).eq('id', orderId)
  return { error: error?.message || null }
}

export async function cancelExpiredOrder(orderId: string) {
  const { error } = await supabase
    .from('orders').update({ status: 'dibatalkan' }).eq('id', orderId).eq('status', 'pending')
  return { error: error?.message || null }
}

// ─── Preload — panggil di layout.tsx agar data sudah siap sebelum user navigasi
// Ini opsional tapi bisa mempercepat perceived load
export function preloadPageData() {
  fetchPackages().catch(() => {})
  fetchCategories().catch(() => {})
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  if (error) { console.error('getOrderById:', error.message); return null }
  return data
}