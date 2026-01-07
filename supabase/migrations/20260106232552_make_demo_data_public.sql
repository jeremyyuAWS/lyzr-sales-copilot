/*
  # Make Demo Data Publicly Readable
  
  1. Changes
    - Drop existing restrictive RLS policies
    - Add public read policies for all tables
    - Keep write operations disabled for demo safety
  
  2. Security
    - All data is readable by anyone (demo mode)
    - No write access without authentication
*/

-- Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own deals" ON deals;
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;

-- Profiles: public read
DROP POLICY IF EXISTS "Public can view all profiles" ON profiles;
CREATE POLICY "Public can view all profiles"
  ON profiles FOR SELECT
  USING (true);

-- Deals: public read
DROP POLICY IF EXISTS "Public can view all deals" ON deals;
CREATE POLICY "Public can view all deals"
  ON deals FOR SELECT
  USING (true);

-- Deal Context: public read
DROP POLICY IF EXISTS "Public can view all deal context" ON deal_context;
CREATE POLICY "Public can view all deal context"
  ON deal_context FOR SELECT
  USING (true);

-- Assets: public read
DROP POLICY IF EXISTS "Public can view all assets" ON assets;
CREATE POLICY "Public can view all assets"
  ON assets FOR SELECT
  USING (true);

-- Recommendations: public read
DROP POLICY IF EXISTS "Public can view all recommendations" ON recommendations;
CREATE POLICY "Public can view all recommendations"
  ON recommendations FOR SELECT
  USING (true);

-- Conversations: public read
DROP POLICY IF EXISTS "Public can view all conversations" ON conversations;
CREATE POLICY "Public can view all conversations"
  ON conversations FOR SELECT
  USING (true);

-- Messages: public read
DROP POLICY IF EXISTS "Public can view all messages" ON messages;
CREATE POLICY "Public can view all messages"
  ON messages FOR SELECT
  USING (true);

-- Linked Assets: public read
DROP POLICY IF EXISTS "Public can view all linked assets" ON linked_assets;
CREATE POLICY "Public can view all linked assets"
  ON linked_assets FOR SELECT
  USING (true);

-- Deal Activities: public read
DROP POLICY IF EXISTS "Public can view all deal activities" ON deal_activities;
CREATE POLICY "Public can view all deal activities"
  ON deal_activities FOR SELECT
  USING (true);
