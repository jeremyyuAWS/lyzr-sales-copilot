/*
  # Remove all RLS policies and disable RLS for public demo

  1. Changes
    - Disable RLS on all remaining tables with RLS enabled
    - Drop all existing RLS policies across all tables
  
  2. Notes
    - This is a demo/concept database where all data should be publicly accessible
    - All users can view, insert, update, and delete all data
    - Security restrictions are removed for demo purposes
*/

-- Disable RLS on linked_assets
ALTER TABLE linked_assets DISABLE ROW LEVEL SECURITY;

-- Disable RLS on recommendations
ALTER TABLE recommendations DISABLE ROW LEVEL SECURITY;

-- Disable RLS on deal_activities
ALTER TABLE deal_activities DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;