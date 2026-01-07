/*
  # HubSpot Integration & Enhanced Deal Context

  ## 1. Changes to Deals Table
    - Add `hubspot_id` (text) - Simulated HubSpot deal ID (format: HS-XXXXX)
    - Add `hubspot_url` (text) - Direct link back to HubSpot deal page
    - Add `last_synced_at` (timestamptz) - When data was last pulled from HubSpot
  
  ## 2. Changes to Deal Context Table
    - Add `technical_requirements` (text) - Detailed technical needs and specifications
    - Add `pain_points` (text array) - Customer challenges and problems to solve
    - Add `decision_makers` (jsonb) - Key stakeholders with name, title, role information
    - Add `competitor_landscape` (text) - Competitive intelligence and positioning notes
  
  ## 3. New Table: Deal Activities
    - Track engagement history (emails, demos, meetings, calls, proposals)
    - Fields:
      - `id` (uuid, primary key)
      - `deal_id` (uuid, references deals)
      - `activity_type` (text) - Email Sent, Demo Shown, Meeting Held, Call Completed, Proposal Sent, Asset Shared
      - `activity_title` (text) - Brief description of activity
      - `activity_notes` (text) - Detailed notes about the activity
      - `performed_by` (uuid, references profiles) - AE who performed the activity
      - `created_at` (timestamptz)
  
  ## 4. Security
    - Maintain RLS on all tables
    - Add appropriate policies for deal_activities table
  
  ## 5. Indexes
    - Add indexes for HubSpot ID lookups and activity queries
*/

-- Add HubSpot integration fields to deals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'hubspot_id'
  ) THEN
    ALTER TABLE deals ADD COLUMN hubspot_id text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'hubspot_url'
  ) THEN
    ALTER TABLE deals ADD COLUMN hubspot_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'last_synced_at'
  ) THEN
    ALTER TABLE deals ADD COLUMN last_synced_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add enhanced context fields to deal_context table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deal_context' AND column_name = 'technical_requirements'
  ) THEN
    ALTER TABLE deal_context ADD COLUMN technical_requirements text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deal_context' AND column_name = 'pain_points'
  ) THEN
    ALTER TABLE deal_context ADD COLUMN pain_points text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deal_context' AND column_name = 'decision_makers'
  ) THEN
    ALTER TABLE deal_context ADD COLUMN decision_makers jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deal_context' AND column_name = 'competitor_landscape'
  ) THEN
    ALTER TABLE deal_context ADD COLUMN competitor_landscape text DEFAULT '';
  END IF;
END $$;

-- Create deal_activities table
CREATE TABLE IF NOT EXISTS deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_title text NOT NULL,
  activity_notes text DEFAULT '',
  performed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deal_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities for all deals"
  ON deal_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "AEs can add activities to assigned deals"
  ON deal_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_activities.deal_id
      AND deals.assigned_ae_id = auth.uid()
    )
  );

CREATE POLICY "AEs can update own activities"
  ON deal_activities FOR UPDATE
  TO authenticated
  USING (performed_by = auth.uid())
  WITH CHECK (performed_by = auth.uid());

CREATE POLICY "AEs can delete own activities"
  ON deal_activities FOR DELETE
  TO authenticated
  USING (performed_by = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_hubspot_id ON deals(hubspot_id);
CREATE INDEX IF NOT EXISTS idx_deals_last_synced ON deals(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_deal_activities_deal_id ON deal_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_activities_created_at ON deal_activities(created_at DESC);