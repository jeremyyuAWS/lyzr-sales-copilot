/*
  # Remove Remaining RLS for Demo Mode
  
  1. Changes
    - Drop all RLS policies on remaining tables
    - Disable RLS on all tables
    - Make all data public and accessible to everyone
  
  2. Security
    - NO SECURITY - This is a concept demo
    - All users can access all data
    - Suitable for demo/development only, NOT production
*/

-- Drop all policies and disable RLS on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on deals
DROP POLICY IF EXISTS "Anyone can view deals" ON deals;
DROP POLICY IF EXISTS "Authenticated users can view deals" ON deals;
ALTER TABLE deals DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on deal_context
DROP POLICY IF EXISTS "Anyone can view deal context" ON deal_context;
DROP POLICY IF EXISTS "Authenticated users can view deal context" ON deal_context;
ALTER TABLE deal_context DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on conversations
DROP POLICY IF EXISTS "Anyone can view conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated users can view conversations" ON conversations;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on messages
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON messages;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on asset_versions
DROP POLICY IF EXISTS "Anyone can view asset versions" ON asset_versions;
DROP POLICY IF EXISTS "Authenticated users can view asset versions" ON asset_versions;
ALTER TABLE asset_versions DISABLE ROW LEVEL SECURITY;

-- Drop all policies and disable RLS on deal_comments
DROP POLICY IF EXISTS "Anyone can view comments" ON deal_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON deal_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON deal_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON deal_comments;
ALTER TABLE deal_comments DISABLE ROW LEVEL SECURITY;