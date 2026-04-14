// ============================================================
// KATRESNAN — Template Registry
// Template = Layout + Theme combo
// Tambah template baru = tambah 1 baris di sini
// ============================================================
import type { Template } from './types'

export const TEMPLATES: Record<string, Template> = {

  // ── FLORAL ROMANTIC ────────────────────────────────────────────────────────
  'floral-classic': {
    id: 'floral-classic', name: 'Floral Classic',
    layoutId: 'classic', themeId: 'floral-pink',
    previewUrl: '/templates/previews/floral-classic.jpg',
    category: 'floral', isPremium: false,
    tags: ['pink','floral','romantic','classic'],
  },
  'floral-story': {
    id: 'floral-story', name: 'Floral Story',
    layoutId: 'story-first', themeId: 'floral-pink',
    previewUrl: '/templates/previews/floral-story.jpg',
    category: 'floral', isPremium: false,
    tags: ['pink','floral','story','romantic'],
  },
  'floral-gallery': {
    id: 'floral-gallery', name: 'Floral Gallery',
    layoutId: 'gallery-focus', themeId: 'floral-pink',
    previewUrl: '/templates/previews/floral-gallery.jpg',
    category: 'floral', isPremium: true,
    tags: ['pink','floral','gallery','premium'],
  },

  // ── CHERRY BLOSSOM ────────────────────────────────────────────────────────
  'cherry-classic': {
    id: 'cherry-classic', name: 'Cherry Blossom Classic',
    layoutId: 'classic', themeId: 'cherry-blossom',
    previewUrl: '/templates/previews/cherry-classic.jpg',
    category: 'floral', isPremium: false,
    tags: ['pink','cherry','romantic'],
  },
  'cherry-gallery': {
    id: 'cherry-gallery', name: 'Cherry Blossom Gallery',
    layoutId: 'gallery-focus', themeId: 'cherry-blossom',
    previewUrl: '/templates/previews/cherry-gallery.jpg',
    category: 'floral', isPremium: true,
    tags: ['pink','cherry','gallery','premium'],
  },

  // ── DUSTY ROSE ────────────────────────────────────────────────────────────
  'dusty-classic': {
    id: 'dusty-classic', name: 'Dusty Rose Classic',
    layoutId: 'classic', themeId: 'dusty-rose',
    previewUrl: '/templates/previews/dusty-classic.jpg',
    category: 'floral', isPremium: false,
    tags: ['rose','dusty','romantic'],
  },
  'dusty-magazine': {
    id: 'dusty-magazine', name: 'Dusty Rose Magazine',
    layoutId: 'magazine', themeId: 'dusty-rose',
    previewUrl: '/templates/previews/dusty-magazine.jpg',
    category: 'modern', isPremium: true,
    tags: ['rose','magazine','modern','premium'],
  },

  // ── ELEGANT GOLD ──────────────────────────────────────────────────────────
  'gold-classic': {
    id: 'gold-classic', name: 'Elegant Gold Classic',
    layoutId: 'classic', themeId: 'elegant-gold',
    previewUrl: '/templates/previews/gold-classic.jpg',
    category: 'elegant', isPremium: true,
    tags: ['gold','elegant','luxury','premium'],
  },
  'gold-story': {
    id: 'gold-story', name: 'Elegant Gold Story',
    layoutId: 'story-first', themeId: 'elegant-gold',
    previewUrl: '/templates/previews/gold-story.jpg',
    category: 'elegant', isPremium: true,
    tags: ['gold','elegant','story','premium'],
  },
  'gold-gallery': {
    id: 'gold-gallery', name: 'Elegant Gold Gallery',
    layoutId: 'gallery-focus', themeId: 'elegant-gold',
    previewUrl: '/templates/previews/gold-gallery.jpg',
    category: 'elegant', isPremium: true,
    tags: ['gold','elegant','gallery','luxury'],
  },

  // ── RUSTIC SAGE ───────────────────────────────────────────────────────────
  'sage-classic': {
    id: 'sage-classic', name: 'Rustic Sage Classic',
    layoutId: 'classic', themeId: 'rustic-sage',
    previewUrl: '/templates/previews/sage-classic.jpg',
    category: 'rustic', isPremium: false,
    tags: ['green','sage','rustic','nature'],
  },
  'sage-story': {
    id: 'sage-story', name: 'Rustic Sage Story',
    layoutId: 'story-first', themeId: 'rustic-sage',
    previewUrl: '/templates/previews/sage-story.jpg',
    category: 'rustic', isPremium: false,
    tags: ['green','sage','story','nature'],
  },
  'sage-magazine': {
    id: 'sage-magazine', name: 'Rustic Sage Magazine',
    layoutId: 'magazine', themeId: 'rustic-sage',
    previewUrl: '/templates/previews/sage-magazine.jpg',
    category: 'modern', isPremium: true,
    tags: ['green','sage','magazine','modern'],
  },

  // ── TROPICAL GREEN ────────────────────────────────────────────────────────
  'tropical-classic': {
    id: 'tropical-classic', name: 'Tropical Classic',
    layoutId: 'classic', themeId: 'tropical-green',
    previewUrl: '/templates/previews/tropical-classic.jpg',
    category: 'rustic', isPremium: false,
    tags: ['green','tropical','nature','fresh'],
  },
  'tropical-gallery': {
    id: 'tropical-gallery', name: 'Tropical Gallery',
    layoutId: 'gallery-focus', themeId: 'tropical-green',
    previewUrl: '/templates/previews/tropical-gallery.jpg',
    category: 'rustic', isPremium: true,
    tags: ['green','tropical','gallery','premium'],
  },

  // ── MODERN MINIMAL ────────────────────────────────────────────────────────
  'minimal-classic': {
    id: 'minimal-classic', name: 'Modern Minimal Classic',
    layoutId: 'classic', themeId: 'modern-minimal',
    previewUrl: '/templates/previews/minimal-classic.jpg',
    category: 'modern', isPremium: false,
    tags: ['minimal','modern','clean'],
  },
  'minimal-magazine': {
    id: 'minimal-magazine', name: 'Modern Minimal Magazine',
    layoutId: 'magazine', themeId: 'modern-minimal',
    previewUrl: '/templates/previews/minimal-magazine.jpg',
    category: 'modern', isPremium: true,
    tags: ['minimal','magazine','modern','clean'],
  },
  'minimal-story': {
    id: 'minimal-story', name: 'Modern Minimal Story',
    layoutId: 'story-first', themeId: 'modern-minimal',
    previewUrl: '/templates/previews/minimal-story.jpg',
    category: 'modern', isPremium: false,
    tags: ['minimal','story','modern'],
  },

  // ── MIDNIGHT BLUE ─────────────────────────────────────────────────────────
  'midnight-classic': {
    id: 'midnight-classic', name: 'Midnight Classic',
    layoutId: 'classic', themeId: 'midnight-blue',
    previewUrl: '/templates/previews/midnight-classic.jpg',
    category: 'modern', isPremium: true,
    tags: ['blue','dark','midnight','premium'],
  },
  'midnight-gallery': {
    id: 'midnight-gallery', name: 'Midnight Gallery',
    layoutId: 'gallery-focus', themeId: 'midnight-blue',
    previewUrl: '/templates/previews/midnight-gallery.jpg',
    category: 'modern', isPremium: true,
    tags: ['blue','dark','gallery','luxury'],
  },

  // ── ISLAMIC NAVY ──────────────────────────────────────────────────────────
  'islamic-navy': {
    id: 'islamic-navy', name: 'Islamic Navy Classic',
    layoutId: 'islamic', themeId: 'islamic-navy',
    previewUrl: '/templates/previews/islamic-navy.jpg',
    category: 'islamic', isPremium: false,
    tags: ['islamic','navy','religious'],
  },
  'islamic-gold': {
    id: 'islamic-gold', name: 'Islamic Gold',
    layoutId: 'islamic', themeId: 'elegant-gold',
    previewUrl: '/templates/previews/islamic-gold.jpg',
    category: 'islamic', isPremium: true,
    tags: ['islamic','gold','religious','premium'],
  },
  'islamic-sage': {
    id: 'islamic-sage', name: 'Islamic Sage',
    layoutId: 'islamic', themeId: 'rustic-sage',
    previewUrl: '/templates/previews/islamic-sage.jpg',
    category: 'islamic', isPremium: false,
    tags: ['islamic','green','religious'],
  },

  // ── VINTAGE CREAM ─────────────────────────────────────────────────────────
  'vintage-classic': {
    id: 'vintage-classic', name: 'Vintage Cream Classic',
    layoutId: 'classic', themeId: 'vintage-cream',
    previewUrl: '/templates/previews/vintage-classic.jpg',
    category: 'elegant', isPremium: false,
    tags: ['vintage','cream','classic'],
  },
  'vintage-story': {
    id: 'vintage-story', name: 'Vintage Cream Story',
    layoutId: 'story-first', themeId: 'vintage-cream',
    previewUrl: '/templates/previews/vintage-story.jpg',
    category: 'elegant', isPremium: true,
    tags: ['vintage','cream','story','premium'],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getTemplate(templateId: string): Template {
  return TEMPLATES[templateId] ?? TEMPLATES['floral-classic']
}

export const TEMPLATE_LIST = Object.values(TEMPLATES)

// Group by category
export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATE_LIST.filter(t => t.category === category)
}

// Total count
export const TEMPLATE_COUNT = TEMPLATE_LIST.length
