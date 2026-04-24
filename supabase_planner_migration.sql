-- Add Wedding Planner JSONB columns to wedding_settings table
-- Each column stores an array of items for the corresponding planner category

ALTER TABLE public.wedding_settings
ADD COLUMN IF NOT EXISTS planner_checklist jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_engagement jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_prewedding jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_administrasi jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_vendor jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_seserahan jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_budget jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS planner_agenda jsonb DEFAULT '[]'::jsonb;
