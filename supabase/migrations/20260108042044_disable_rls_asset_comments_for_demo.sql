/*
  # Disable RLS on asset_comments for demo

  This migration disables Row Level Security on the asset_comments table
  to match the other demo tables (assets, deals, etc.) which have RLS disabled.
  
  This allows the demo to work without authentication requirements.
*/

-- Disable RLS on asset_comments table
ALTER TABLE asset_comments DISABLE ROW LEVEL SECURITY;
