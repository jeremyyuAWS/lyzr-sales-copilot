/*
  # Sales Enablement Portal Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - AE, Admin, Sales Engineer, Sales Leadership
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `deals`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `amount` (numeric)
      - `stage` (text) - Discovery, Demo, Proposal, Negotiation, Closed Won
      - `close_date` (date)
      - `assigned_ae_id` (uuid, references profiles)
      - `industry` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `deal_context`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `description` (text)
      - `primary_use_case` (text)
      - `cloud_provider` (text) - AWS, Azure, GCP, Multi-Cloud
      - `primary_persona` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assets`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - Demo, Case Study, Deck, Proof
      - `description` (text)
      - `url` (text)
      - `industry_tags` (text array)
      - `persona_tags` (text array)
      - `stage_tags` (text array)
      - `cloud_tags` (text array)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `deal_id` (uuid, references deals, nullable)
      - `title` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `role` (text) - user or assistant
      - `content` (text)
      - `created_at` (timestamp)
    
    - `linked_assets`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `asset_id` (uuid, references assets)
      - `linked_by` (uuid, references profiles)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `asset_id` (uuid, references assets)
      - `reason` (text)
      - `confidence_score` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'AE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  stage text NOT NULL DEFAULT 'Discovery',
  close_date date,
  assigned_ae_id uuid REFERENCES profiles(id),
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all deals"
  ON deals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "AEs can update assigned deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (assigned_ae_id = auth.uid())
  WITH CHECK (assigned_ae_id = auth.uid());

CREATE POLICY "Admins can insert deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

-- Create deal_context table
CREATE TABLE IF NOT EXISTS deal_context (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE UNIQUE,
  description text DEFAULT '',
  primary_use_case text DEFAULT '',
  cloud_provider text,
  primary_persona text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deal_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deal context"
  ON deal_context FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_context.deal_id
    )
  );

CREATE POLICY "AEs can update deal context for assigned deals"
  ON deal_context FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_context.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_context.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  );

CREATE POLICY "AEs can insert deal context for assigned deals"
  ON deal_context FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_context.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  );

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  description text DEFAULT '',
  url text,
  industry_tags text[] DEFAULT '{}',
  persona_tags text[] DEFAULT '{}',
  stage_tags text[] DEFAULT '{}',
  cloud_tags text[] DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all assets"
  ON assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

CREATE POLICY "Admins can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Create linked_assets table
CREATE TABLE IF NOT EXISTS linked_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  linked_by uuid REFERENCES profiles(id),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, asset_id)
);

ALTER TABLE linked_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view linked assets for all deals"
  ON linked_assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "AEs can link assets to assigned deals"
  ON linked_assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = linked_assets.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  );

CREATE POLICY "AEs can remove linked assets from assigned deals"
  ON linked_assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = linked_assets.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  );

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  reason text NOT NULL,
  confidence_score numeric DEFAULT 0.5,
  created_at timestamptz DEFAULT now(),
  UNIQUE(deal_id, asset_id)
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recommendations for all deals"
  ON recommendations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert recommendations"
  ON recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_assigned_ae ON deals(assigned_ae_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deal_context_deal_id ON deal_context(deal_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_linked_assets_deal_id ON linked_assets(deal_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_deal_id ON recommendations(deal_id);