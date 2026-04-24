-- ============================================================
-- KATRESNAN AUTH MIGRATION — Profiles & Feature Gating
-- Run this in Supabase SQL Editor
-- Prerequisite: Supabase Auth must be enabled (default)
-- ============================================================

-- ─── 1. PROFILES TABLE ────────────────────────────────────────────────────────
-- Extends auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    wa VARCHAR(20),
    plan VARCHAR(20) DEFAULT 'free',          -- free | silver | gold | platinum
    package_id VARCHAR(50),                    -- null sampai pilih paket
    template_id VARCHAR(50),                   -- null sampai pilih template
    order_id UUID,                             -- null sampai checkout, link ke orders table
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);

-- ─── 2. AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────────────────────
-- Trigger function: create profile row when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, nama, email, wa)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'wa', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. AUTO-CREATE WEDDING_SETTINGS ON PROFILE CREATE ────────────────────────
-- So each new user gets default wedding settings
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.wedding_settings (order_id, user_id)
    VALUES (gen_random_uuid(), NEW.id)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_profile();

-- ─── 4. ADD user_id COLUMN TO EXISTING TABLES ─────────────────────────────────
-- Add user_id to tables that currently only have order_id

-- wedding_data
DO $$ BEGIN
    ALTER TABLE public.wedding_data ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- wedding_settings
DO $$ BEGIN
    ALTER TABLE public.wedding_settings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- guests
DO $$ BEGIN
    ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- checkins
DO $$ BEGIN
    ALTER TABLE public.checkins ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- wishlists
DO $$ BEGIN
    ALTER TABLE public.wishlists ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- ucapan
DO $$ BEGIN
    ALTER TABLE public.ucapan ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Create indexes for user_id columns
CREATE INDEX IF NOT EXISTS idx_wedding_settings_user_id ON public.wedding_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_user_id ON public.guests(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

-- ─── 5. RLS POLICIES FOR PROFILES ─────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_select_own') THEN
        CREATE POLICY "profiles_select_own" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- Users can update their own profile
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_update_own') THEN
        CREATE POLICY "profiles_update_own" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;
END $$;

-- Service role can insert (from trigger)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_trigger') THEN
        CREATE POLICY "profiles_insert_trigger" ON public.profiles
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- ─── 6. FEATURE GATING CONFIG ──────────────────────────────────────────────────
-- This is just for reference — enforced in the frontend
-- 
-- FREE:     Dashboard Overview, Atur Tema (draft only)
-- SILVER:   + Daftar Tamu, Check-in QR, Ucapan, Template WA, Wishlist, Rekening, Alamat
-- GOLD:     + Wedding Planner, Nabung Bareng
-- PLATINUM: + Semua fitur Gold, priority support
--
-- Plan hierarchy: free < silver < gold < platinum

-- ─── 7. UPDATE TIMESTAMP TRIGGER FOR PROFILES ────────────────────────────────
DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ─── 8. HELPER: Get user plan by user_id ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_plan(p_user_id UUID)
RETURNS VARCHAR AS $$
    SELECT COALESCE(plan, 'free') FROM public.profiles WHERE id = p_user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
