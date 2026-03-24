-- ============================================================
-- Supabase Schema for Unit Converter App (Bengali)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  mobile TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Conversion history table
CREATE TABLE IF NOT EXISTS public.conversion_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  from_unit TEXT NOT NULL,
  from_unit_name TEXT NOT NULL,
  to_unit TEXT NOT NULL,
  to_unit_name TEXT NOT NULL,
  input_value DOUBLE PRECISION NOT NULL,
  output_value DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_history_user_id ON public.conversion_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON public.conversion_history(created_at DESC);

-- RLS for conversion_history
ALTER TABLE public.conversion_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own history"
  ON public.conversion_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own history"
  ON public.conversion_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history"
  ON public.conversion_history FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- Done! Make sure to enable Email auth in Supabase dashboard
-- (Auth > Providers > Email) since we use email-based sign-in
-- with BDApps mobile numbers as fake email identifiers.
-- ============================================================
