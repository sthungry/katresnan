// ============================================================
// KATRESNAN — Layout Registry
// Setiap layout = struktur & urutan section yang berbeda
// ============================================================
import type { Layout } from './types'
<<<<<<< HEAD
import type { SectionId } from '../types'
=======
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835

export const LAYOUTS: Record<string, Layout> = {

  // ── Layout 1: Classic Scroll ───────────────────────────────────────────────
  // Urutan klasik seperti kebanyakan undangan digital
  'classic': {
    id: 'classic',
    name: 'Classic Scroll',
    description: 'Layout klasik dengan urutan standar, cocok untuk semua tema',
<<<<<<< HEAD
    sections: ['cover','pembuka','mempelai','countdown','acara','galeri','rsvp','amplop','closing'] as SectionId[],
=======
    sections: ['cover','pembuka','mempelai','countdown','acara','galeri','rsvp','amplop','closing'],
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    config: {
      coverStyle:    'fullscreen',
      mempelaiStyle: 'stacked',
      galeriFeed:    'masonry',
      acara:         'cards',
    },
  },

  // ── Layout 2: Story First ──────────────────────────────────────────────────
  // Cerita cinta muncul lebih awal, cocok untuk pasangan yang suka bercerita
  'story-first': {
    id: 'story-first',
    name: 'Story First',
    description: 'Cerita cinta dan perjalanan ditampilkan di awal sebelum detail acara',
<<<<<<< HEAD
    sections: ['cover','pembuka','mempelai','cerita','countdown','acara','galeri','rsvp','amplop','closing'] as SectionId[],
=======
    sections: ['cover','pembuka','mempelai','cerita','countdown','acara','galeri','rsvp','amplop','closing'],
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    config: {
      coverStyle:    'fullscreen',
      mempelaiStyle: 'side-by-side',
      galeriFeed:    'masonry',
      acara:         'timeline',
    },
  },

  // ── Layout 3: Modern Magazine ─────────────────────────────────────────────
  // Clean & minimalis, galeri slideshow, acara tampilan minimal
  'magazine': {
    id: 'magazine',
    name: 'Modern Magazine',
    description: 'Tampilan bersih ala majalah modern, galeri slideshow, acara minimalis',
<<<<<<< HEAD
    sections: ['cover','mempelai','galeri','acara','countdown','rsvp','amplop','closing'] as SectionId[],
=======
    sections: ['cover','mempelai','galeri','acara','countdown','rsvp','amplop','closing'],
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    config: {
      coverStyle:    'split',
      mempelaiStyle: 'side-by-side',
      galeriFeed:    'slideshow',
      acara:         'minimal',
    },
  },

  // ── Layout 4: Islamic Traditional ────────────────────────────────────────
  // Pembuka ayat quran lebih menonjol, acara tampilan timeline
  'islamic': {
    id: 'islamic',
    name: 'Islamic Traditional',
    description: 'Nuansa islami kuat, pembuka ayat Quran, timeline acara',
<<<<<<< HEAD
    sections: ['cover','pembuka','mempelai','countdown','acara','galeri','rsvp','amplop','closing'] as SectionId[],
=======
    sections: ['cover','pembuka','mempelai','countdown','acara','galeri','rsvp','amplop','closing'],
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    config: {
      coverStyle:    'centered',
      mempelaiStyle: 'card',
      galeriFeed:    'grid',
      acara:         'timeline',
    },
  },

  // ── Layout 5: Gallery Focus ────────────────────────────────────────────────
  // Foto prewedding tampil lebih besar & awal, cocok untuk paket Platinum
  'gallery-focus': {
    id: 'gallery-focus',
    name: 'Gallery Focus',
    description: 'Galeri foto besar & menonjol, cocok untuk paket dengan banyak foto',
<<<<<<< HEAD
    sections: ['cover','galeri','mempelai','cerita','countdown','acara','rsvp','amplop','closing'] as SectionId[],
=======
    sections: ['cover','galeri','mempelai','cerita','countdown','acara','rsvp','amplop','closing'],
>>>>>>> e40ea50899cb8afda9add57f89ef9938382b1835
    config: {
      coverStyle:    'fullscreen',
      mempelaiStyle: 'card',
      galeriFeed:    'masonry',
      acara:         'cards',
    },
  },
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getLayout(layoutId: string): Layout {
  return LAYOUTS[layoutId] ?? LAYOUTS['classic']
}

export const LAYOUT_IDS = Object.keys(LAYOUTS)
