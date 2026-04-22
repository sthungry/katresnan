// ============================================================
// KATRESNAN — Theme Registry
// Tambah theme baru cukup dengan tambah object di sini
// ============================================================
import type { Theme } from './types'

export const THEMES: Record<string, Theme> = {

  // ── 1. Floral Romantic Pink (default) ─────────────────────────────────────
  'floral-pink': {
    id: 'floral-pink',
    name: 'Floral Romantic',
    colors: {
      primary:     '#c4798a',
      secondary:   '#6b8f72',
      bg:          '#fffdf8',
      bgAlt:       '#fff4f6',
      bgDark:      '#3d2c2c',
      text:        '#3d2c2c',
      textMuted:   '#8a6e5a',
      textLight:   '#ffffff',
      border:      '#f9b8c4',
      highlight:   '#f9b8c4',
    },
    fonts: {
      display:    'Playfair Display',
      body:       'Lato',
      script:     'Great Vibes',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
    },
    ornaments: {
      petal:   ['🌸', '🌷', '🍃', '🌺', '🌸'],
      divider: '🌸',
      section: '🌺',
      cover:   'floral',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 2. Elegant Gold ────────────────────────────────────────────────────────
  'elegant-gold': {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    colors: {
      primary:     '#b8860b',
      secondary:   '#8b7355',
      bg:          '#fdfbf5',
      bgAlt:       '#f9f5e7',
      bgDark:      '#1a1408',
      text:        '#1a1408',
      textMuted:   '#7a6545',
      textLight:   '#f5e6c8',
      border:      '#d4af37',
      highlight:   '#fef3c7',
    },
    fonts: {
      display:    'Cormorant Garamond',
      body:       'Montserrat',
      script:     'Pinyon Script',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap',
    },
    ornaments: {
      petal:   ['✨', '🌟', '💫', '⭐', '✨'],
      divider: '✦',
      section: '👑',
      cover:   'geometric',
    },
    darkSections: ['countdown', 'amplop', 'closing'],
  },

  // ── 3. Modern Minimalist ───────────────────────────────────────────────────
  'modern-minimal': {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    colors: {
      primary:     '#2d3748',
      secondary:   '#718096',
      bg:          '#ffffff',
      bgAlt:       '#f7fafc',
      bgDark:      '#1a202c',
      text:        '#1a202c',
      textMuted:   '#718096',
      textLight:   '#ffffff',
      border:      '#e2e8f0',
      highlight:   '#edf2f7',
    },
    fonts: {
      display:    'DM Serif Display',
      body:       'DM Sans',
      script:     'Sacramento',
      displayUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Sacramento&display=swap',
    },
    ornaments: {
      petal:   ['○', '●', '◌', '◦', '·'],
      divider: '—',
      section: '◆',
      cover:   'minimal',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 4. Rustic Sage ─────────────────────────────────────────────────────────
  'rustic-sage': {
    id: 'rustic-sage',
    name: 'Rustic Sage',
    colors: {
      primary:     '#5f7a61',
      secondary:   '#8b7355',
      bg:          '#faf9f5',
      bgAlt:       '#f0f4ef',
      bgDark:      '#2d3b2e',
      text:        '#2d3b2e',
      textMuted:   '#6b7c6b',
      textLight:   '#e8f0e8',
      border:      '#b5c9b6',
      highlight:   '#dceadc',
    },
    fonts: {
      display:    'Libre Baskerville',
      body:       'Nunito',
      script:     'Dancing Script',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap',
    },
    ornaments: {
      petal:   ['🍃', '🌿', '🌾', '🍀', '🌱'],
      divider: '🌿',
      section: '🌾',
      cover:   'floral',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 5. Islamic Navy ────────────────────────────────────────────────────────
  'islamic-navy': {
    id: 'islamic-navy',
    name: 'Islamic Navy',
    colors: {
      primary:     '#1e3a5f',
      secondary:   '#c9a84c',
      bg:          '#f8f9ff',
      bgAlt:       '#eef1f8',
      bgDark:      '#0f1f35',
      text:        '#0f1f35',
      textMuted:   '#4a6080',
      textLight:   '#ffffff',
      border:      '#c9a84c',
      highlight:   '#fef9e7',
    },
    fonts: {
      display:    'Amiri',
      body:       'Cairo',
      script:     'Scheherazade New',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@700&display=swap',
    },
    ornaments: {
      petal:   ['☪️', '✨', '🌙', '⭐', '✨'],
      divider: '☪',
      section: '🕌',
      cover:   'geometric',
    },
    darkSections: ['countdown', 'amplop', 'closing'],
  },

  // ── 6. Dusty Rose ─────────────────────────────────────────────────────────
  'dusty-rose': {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    colors: {
      primary:     '#b5838d',
      secondary:   '#e5989b',
      bg:          '#fff0f3',
      bgAlt:       '#ffdde1',
      bgDark:      '#6d2b3d',
      text:        '#4a1528',
      textMuted:   '#9c6070',
      textLight:   '#fff0f3',
      border:      '#ffb3c1',
      highlight:   '#ffdde1',
    },
    fonts: {
      display:    'Italiana',
      body:       'Josefin Sans',
      script:     'Alex Brush',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Italiana&family=Josefin+Sans:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap',
    },
    ornaments: {
      petal:   ['🌹', '🌸', '🪷', '💮', '🌷'],
      divider: '🌹',
      section: '🪷',
      cover:   'floral',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 7. Midnight Blue ──────────────────────────────────────────────────────
  'midnight-blue': {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colors: {
      primary:     '#4a90d9',
      secondary:   '#a8c8f0',
      bg:          '#0d1b2a',
      bgAlt:       '#1b2d40',
      bgDark:      '#071018',
      text:        '#e8f0f8',
      textMuted:   '#8aaac8',
      textLight:   '#ffffff',
      border:      '#2d4a6a',
      highlight:   '#1b3050',
    },
    fonts: {
      display:    'Cinzel',
      body:       'Raleway',
      script:     'Parisienne',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Raleway:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Parisienne&display=swap',
    },
    ornaments: {
      petal:   ['⭐', '✨', '💫', '🌟', '⭐'],
      divider: '✦',
      section: '💙',
      cover:   'minimal',
    },
    darkSections: [],
  },

  // ── 8. Tropical Green ─────────────────────────────────────────────────────
  'tropical-green': {
    id: 'tropical-green',
    name: 'Tropical Green',
    colors: {
      primary:     '#2d6a4f',
      secondary:   '#52b788',
      bg:          '#f0fdf4',
      bgAlt:       '#d8f3dc',
      bgDark:      '#1b4332',
      text:        '#1b4332',
      textMuted:   '#40916c',
      textLight:   '#d8f3dc',
      border:      '#95d5b2',
      highlight:   '#b7e4c7',
    },
    fonts: {
      display:    'Fraunces',
      body:       'Plus Jakarta Sans',
      script:     'Satisfy',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
    },
    ornaments: {
      petal:   ['🌴', '🌿', '🍃', '🌺', '🌸'],
      divider: '🌿',
      section: '🌺',
      cover:   'floral',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 9. Vintage Cream ──────────────────────────────────────────────────────
  'vintage-cream': {
    id: 'vintage-cream',
    name: 'Vintage Cream',
    colors: {
      primary:     '#8b5e3c',
      secondary:   '#c9956c',
      bg:          '#fdf8f0',
      bgAlt:       '#f5ebe0',
      bgDark:      '#4a2c1a',
      text:        '#3d2010',
      textMuted:   '#8b6355',
      textLight:   '#fdf8f0',
      border:      '#ddb892',
      highlight:   '#f5ebe0',
    },
    fonts: {
      display:    'Gilda Display',
      body:       'EB Garamond',
      script:     'Tangerine',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap',
    },
    ornaments: {
      petal:   ['🕊️', '🌾', '🍂', '🌻', '🕊️'],
      divider: '❧',
      section: '🌻',
      cover:   'minimal',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 10. Cherry Blossom ────────────────────────────────────────────────────
  'cherry-blossom': {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    colors: {
      primary:     '#de3163',
      secondary:   '#ff85a1',
      bg:          '#fff5f7',
      bgAlt:       '#ffe0e9',
      bgDark:      '#7b1534',
      text:        '#3d0618',
      textMuted:   '#994460',
      textLight:   '#fff5f7',
      border:      '#ffadc5',
      highlight:   '#ffe0e9',
    },
    fonts: {
      display:    'Bodoni Moda',
      body:       'Poppins',
      script:     'Ephesis',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Ephesis&display=swap',
    },
    ornaments: {
      petal:   ['🌸', '🌸', '🌺', '🌷', '🌸'],
      divider: '🌸',
      section: '🌺',
      cover:   'floral',
    },
    darkSections: ['countdown', 'amplop'],
  },

  // ── 11. Gilded Noir (From Stitch) ─────────────────────────────────────────
  'gilded-noir': {
    id: 'gilded-noir',
    name: 'Gilded Noir',
    colors: {
      primary:     '#f2ca50',
      secondary:   '#d4af37',
      bg:          '#131313',
      bgAlt:       '#1b1b1b',
      bgDark:      '#0e0e0e',
      text:        '#e2e2e2',
      textMuted:   '#d0c5af',
      textLight:   '#e2e2e2',
      border:      '#4d4635',
      highlight:   '#2a2a2a',
    },
    fonts: {
      display:    'Noto Serif',
      body:       'Work Sans',
      script:     'Pinyon Script',
      displayUrl: 'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@300;400;600&display=swap',
      scriptUrl:  'https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap',
    },
    ornaments: {
      petal:   ['✨', '🌟', '💫', '⭐', '✨'],
      divider: '✦',
      section: '👑',
      cover:   'geometric',
    },
    darkSections: ['countdown', 'amplop', 'closing'],
  },
}

// ─── Helper: get theme by id, fallback to floral-pink ────────────────────────
export function getTheme(themeId: string): Theme {
  return THEMES[themeId] ?? THEMES['floral-pink']
}

// ─── All theme IDs for admin/portfolio use ────────────────────────────────────
export const THEME_IDS = Object.keys(THEMES)
