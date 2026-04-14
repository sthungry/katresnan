// ============================================================
// KATRESNAN TEMPLATE ENGINE — Core Types
// ============================================================

// ─── Wedding Data (dari Supabase wedding_data) ────────────────────────────────
export interface WeddingData {
  order_id: string
  link_unik: string

  // Mempelai Pria
  pria_nama_lengkap: string
  pria_nama_panggilan: string
  pria_gelar: string
  pria_nama_ayah: string
  pria_status_ayah: string   // hidup | alm
  pria_nama_ibu: string
  pria_status_ibu: string    // hidup | almh

  // Mempelai Wanita
  wanita_nama_lengkap: string
  wanita_nama_panggilan: string
  wanita_gelar: string
  wanita_nama_ayah: string
  wanita_status_ayah: string
  wanita_nama_ibu: string
  wanita_status_ibu: string

  // Acara
  akad_tanggal: string
  akad_lokasi: string
  akad_alamat: string
  akad_maps_url: string
  resepsi_tanggal: string
  resepsi_lokasi: string
  resepsi_alamat: string
  resepsi_maps_url: string

  // Media
<<<<<<< HEAD
  pria_foto_url?: string
  wanita_foto_url?: string
=======
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
  foto_urls: string[]
  video_youtube_url: string
  musik_pilihan: string
  hashtag_instagram: string

  // Amplop
  rekening_list: RekeningItem[]
  rundown_list?: { id: string; jam: string; acara: string }[]
  alamat_kado: string

  // Cerita
  cerita_pertemuan: string
  tanggal_jadian: string
  tanggal_lamaran: string
  engagement_story: string

  // Fitur toggles
  fitur_amplop_digital: boolean
  fitur_cerita_cinta: boolean
  fitur_rsvp: boolean
  fitur_share: boolean

  // Template config (disimpan di DB)
  template_id: string    // e.g. "floral-pink", "elegant-gold"
  catatan_tambahan: string

  // Kata-kata pembuka
  kata_kata_pilihan: 'quran' | 'bible' | 'custom'
  kata_kata_custom: string

  // Background custom per section
  bg_sections?: {
    cover?:    { type: 'default'|'foto'|'youtube'|'video'; url: string; overlay: number }
    mempelai?: { type: 'default'|'foto'|'youtube'|'video'; url: string; overlay: number }
    acara?:    { type: 'default'|'foto'|'youtube'|'video'; url: string; overlay: number }
    galeri?:   { type: 'default'|'foto'|'youtube'|'video'; url: string; overlay: number }
    footer?:   { type: 'default'|'foto'|'youtube'|'video'; url: string; overlay: number }
  }
}

export interface RekeningItem {
  id: string
  bank: string
  nomor: string
  nama: string
  kategori: 'pria' | 'wanita' | 'bersama'
}

export interface Ucapan {
  id: string
  nama: string
  ucapan: string
  hadir: 'hadir' | 'tidak' | 'ragu'
  created_at: string
}

// ─── Theme — visual identity of a template ───────────────────────────────────
export interface Theme {
  id: string
  name: string

  // Colors
  colors: {
    primary: string       // main accent, e.g. "#c4798a"
    secondary: string     // second accent, e.g. "#6b8f72"
    bg: string            // page background
    bgAlt: string         // alternate section bg
    bgDark: string        // dark section bg (amplop, countdown)
    text: string          // main text
    textMuted: string     // muted text
    textLight: string     // text on dark bg
    border: string        // border / divider color
    highlight: string     // highlight / badge bg
  }

  // Typography
  fonts: {
    display: string       // heading / name font (Google Fonts name)
    body: string          // body text font
    script: string        // calligraphy / romantic script font
    displayUrl: string    // Google Fonts URL for display
    scriptUrl: string     // Google Fonts URL for script
  }

  // Ornaments — emoji or SVG class names
  ornaments: {
    petal: string[]       // falling petal emojis e.g. ['🌸','🌷','🍃']
    divider: string       // divider emoji e.g. '🌸'
    section: string       // section header emoji e.g. '🌺'
    cover: string         // cover overlay style: 'floral' | 'geometric' | 'minimal'
  }

  // Section BGs — which sections use dark vs light
  darkSections: ('countdown' | 'amplop' | 'closing')[]
}

// ─── Layout — structural variant of a template ───────────────────────────────
export interface Layout {
  id: string
  name: string
  description: string

  // Which sections to show and their order
  sections: SectionId[]

  // Layout-specific config
  config: {
    coverStyle: 'fullscreen' | 'split' | 'centered'      // cover photo style
    mempelaiStyle: 'stacked' | 'side-by-side' | 'card'  // how mempelai shown
    galeriFeed: 'masonry' | 'grid' | 'slideshow'         // gallery layout
    acara: 'cards' | 'timeline' | 'minimal'              // event detail style
  }
}

export type SectionId =
  | 'cover'
  | 'pembuka'
  | 'mempelai'
  | 'cerita'
  | 'countdown'
  | 'acara'
  | 'galeri'
  | 'rsvp'
  | 'amplop'
  | 'closing'

// ─── Template — a Layout + Theme combo ───────────────────────────────────────
export interface Template {
  id: string              // e.g. "floral-romantic-pink"
  name: string            // e.g. "Floral Romantic Pink"
  layoutId: string        // references Layout.id
  themeId: string         // references Theme.id
  previewUrl: string      // thumbnail for admin/portfolio
  category: string        // "floral" | "elegant" | "modern" | "rustic" | "islamic"
  isPremium: boolean      // paket gold/platinum only
  tags: string[]
}

// ─── Props passed to every section component ─────────────────────────────────
export interface SectionProps {
  wedding: WeddingData
  theme: Theme
  layout: Layout
}