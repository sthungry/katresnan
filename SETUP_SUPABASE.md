# Setup Supabase untuk Katresnan

## Langkah 1 — Dapatkan API Keys
1. Buka https://app.supabase.com
2. Pilih project kamu
3. Pergi ke **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Langkah 2 — Buat file .env.local
Di folder `landing-page/`, buat file `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Langkah 3 — Pastikan tabel orders sudah ada
Jalankan SQL ini di Supabase SQL Editor:
```sql
create extension if not exists "pgcrypto";
create table public.orders (
    id uuid primary key default gen_random_uuid(),
    nama text not null,
    email text not null,
    wa text,
    paket text,
    template_text_1 text,
    template_text_2 text,
    metode_bayar text,
    harga integer not null,
    kode_unik integer default 0,
    total integer not null,
    status text default 'pending',
    catatan text,
    created_at timestamptz default now()
);
create index idx_orders_email on public.orders(email);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);
```

## Langkah 4 — Set Row Level Security (RLS)
Di Supabase Dashboard → Table Editor → orders → RLS:
```sql
-- Izinkan insert dari siapa saja (customer checkout)
create policy "Allow insert orders" on public.orders
  for insert with check (true);

-- Izinkan update status (untuk konfirmasi pembayaran)
create policy "Allow update status" on public.orders
  for update using (true);

-- Hanya admin yang bisa SELECT (nanti dikonfigurasi lewat service_role key)
create policy "Deny public select" on public.orders
  for select using (false);
```

## Langkah 5 — Install dependencies dan jalankan
```bash
cd landing-page
npm install
npm run dev
```

## Alur data pesanan:
1. Customer isi form → klik "Lanjut" → INSERT ke orders (status: `pending`)
2. Cookie 30 menit tersimpan di browser customer
3. Customer refresh → cookie dibaca → step payment dipulihkan
4. Timer habis (30 min) → status diupdate jadi `dibatalkan` → form direset
5. Customer klik "Saya Sudah Bayar" → status jadi `menunggu_konfirmasi`
6. Admin cek dashboard Supabase → verifikasi manual → update status ke `diproses` / `selesai`
