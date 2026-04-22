-- ============================================================
-- KATRESNAN USER DASHBOARD — Database Migration
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================

-- ─── 1. GUESTS TABLE ────────────────────────────────────────────────────────
-- Stores guest list for each wedding/order
CREATE TABLE IF NOT EXISTS public.guests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    nama text NOT NULL,
    telepon text,
    email text,
    jumlah_tamu integer DEFAULT 1,
    status_undangan text DEFAULT 'belum_dikirim', -- belum_dikirim | terkirim | dibaca
    status_kehadiran text DEFAULT 'belum_konfirmasi', -- belum_konfirmasi | hadir | tidak_hadir | ragu
    kategori text DEFAULT 'umum', -- keluarga_pria | keluarga_wanita | teman | rekan_kerja | umum
    catatan text,
    qr_code text, -- unique QR code for check-in
    link_undangan text, -- personal invitation link
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guests_order_id ON public.guests(order_id);
CREATE INDEX IF NOT EXISTS idx_guests_status_kehadiran ON public.guests(status_kehadiran);
CREATE INDEX IF NOT EXISTS idx_guests_qr_code ON public.guests(qr_code);

-- ─── 2. CHECKINS TABLE ──────────────────────────────────────────────────────
-- Records check-in events at the wedding day
CREATE TABLE IF NOT EXISTS public.checkins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id uuid NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    order_id uuid NOT NULL,
    checked_in_at timestamptz DEFAULT now(),
    checked_in_by text DEFAULT 'qr_scan', -- qr_scan | manual
    catatan text
);

CREATE INDEX IF NOT EXISTS idx_checkins_guest_id ON public.checkins(guest_id);
CREATE INDEX IF NOT EXISTS idx_checkins_order_id ON public.checkins(order_id);

-- ─── 3. WISHLISTS TABLE ─────────────────────────────────────────────────────
-- Gift wishlist items
CREATE TABLE IF NOT EXISTS public.wishlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    nama_barang text NOT NULL,
    deskripsi text,
    gambar_url text,
    target_dana integer DEFAULT 0,
    terkumpul integer DEFAULT 0,
    link_produk text,
    prioritas integer DEFAULT 0, -- 0=normal, 1=tinggi, 2=sangat tinggi
    status text DEFAULT 'aktif', -- aktif | terpenuhi | dihapus
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_order_id ON public.wishlists(order_id);

-- ─── 4. WISHLIST CONTRIBUTIONS ──────────────────────────────────────────────
-- Track contributions to wishlist items
CREATE TABLE IF NOT EXISTS public.wishlist_contributions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id uuid NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
    order_id uuid NOT NULL,
    nama_donatur text NOT NULL,
    jumlah integer NOT NULL,
    pesan text,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlist_contributions_wishlist_id ON public.wishlist_contributions(wishlist_id);

-- ─── 5. WEDDING SETTINGS TABLE ──────────────────────────────────────────────
-- Per-wedding settings (WA template, bank info, address)
CREATE TABLE IF NOT EXISTS public.wedding_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL UNIQUE,
    wa_templates jsonb DEFAULT '[]'::jsonb,
    wa_template_undangan text DEFAULT 'Assalamualaikum {nama_tamu},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBerikut link undangan digital:\n{link_undangan}\n\nMohon konfirmasi kehadiran melalui link di atas.\n\nTerima kasih 🙏\n{nama_pengantin}',
    wa_template_reminder text DEFAULT 'Halo {nama_tamu},\n\nIni adalah pengingat untuk acara pernikahan kami yang akan segera diselenggarakan.\n\nLink undangan:\n{link_undangan}\n\nDitunggu kehadirannya ya! 🙏\n{nama_pengantin}',
    rekening_list jsonb DEFAULT '[]'::jsonb,
    alamat_pengiriman text,
    kota text,
    kode_pos text,
    nabung_target integer DEFAULT 0,
    nabung_sources jsonb DEFAULT '[]'::jsonb,
    nabung_deposits jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wedding_settings_order_id ON public.wedding_settings(order_id);

-- ─── RLS POLICIES ────────────────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (since we use anon key with app-level auth)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'guests' AND policyname = 'guests_all_access') THEN
        CREATE POLICY "guests_all_access" ON public.guests FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'checkins' AND policyname = 'checkins_all_access') THEN
        CREATE POLICY "checkins_all_access" ON public.checkins FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlists' AND policyname = 'wishlists_all_access') THEN
        CREATE POLICY "wishlists_all_access" ON public.wishlists FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wishlist_contributions' AND policyname = 'wishlist_contributions_all_access') THEN
        CREATE POLICY "wishlist_contributions_all_access" ON public.wishlist_contributions FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wedding_settings' AND policyname = 'wedding_settings_all_access') THEN
        CREATE POLICY "wedding_settings_all_access" ON public.wedding_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Also ensure ucapan table has proper policies (it already exists)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ucapan' AND policyname = 'ucapan_all_access') THEN
        ALTER TABLE public.ucapan ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "ucapan_all_access" ON public.ucapan FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ─── FUNCTIONS ───────────────────────────────────────────────────────────────
-- Generate unique QR code for guest
CREATE OR REPLACE FUNCTION generate_guest_qr()
RETURNS trigger AS $$
BEGIN
    NEW.qr_code := encode(gen_random_bytes(12), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate QR code on guest insert
DROP TRIGGER IF EXISTS trg_guest_qr ON public.guests;
CREATE TRIGGER trg_guest_qr
    BEFORE INSERT ON public.guests
    FOR EACH ROW
    WHEN (NEW.qr_code IS NULL)
    EXECUTE FUNCTION generate_guest_qr();

-- Auto-generate personal invitation link
CREATE OR REPLACE FUNCTION generate_guest_link()
RETURNS trigger AS $$
BEGIN
    NEW.link_undangan := encode(gen_random_bytes(8), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guest_link ON public.guests;
CREATE TRIGGER trg_guest_link
    BEFORE INSERT ON public.guests
    FOR EACH ROW
    WHEN (NEW.link_undangan IS NULL)
    EXECUTE FUNCTION generate_guest_link();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guests_updated ON public.guests;
CREATE TRIGGER trg_guests_updated
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_wishlists_updated ON public.wishlists;
CREATE TRIGGER trg_wishlists_updated
    BEFORE UPDATE ON public.wishlists
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_settings_updated ON public.wedding_settings;
CREATE TRIGGER trg_settings_updated
    BEFORE UPDATE ON public.wedding_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
