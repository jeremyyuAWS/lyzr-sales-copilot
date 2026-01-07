/*
  # Remove All RLS from Assets Table - Make Content Public for Demo
  
  1. Changes
    - Drop all existing RLS policies on assets table
    - Disable RLS on assets table completely
    - This makes all content visible to everyone (demo mode)
  
  2. Security
    - NO SECURITY - This is a concept demo
    - All users can view, create, update, and delete all content
    - Suitable for demo/development only, NOT production
*/

-- Drop all existing policies on assets table
DROP POLICY IF EXISTS "Anyone can view published assets" ON assets;
DROP POLICY IF EXISTS "Admins can view all assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can insert assets" ON assets;
DROP POLICY IF EXISTS "Users can update own assets, admins can update all" ON assets;
DROP POLICY IF EXISTS "Admins can delete assets" ON assets;

-- Disable RLS completely
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;