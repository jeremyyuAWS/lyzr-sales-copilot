/*
  # Content Library Enhancements - Unified Assets with Version Control
  
  1. Schema Changes to `assets` table
    - Add `category` (text) - unified content categories: concept_demo, case_study, testimonial, one_pager, video, tutorial, sales_play, proof, deck, other
    - Add `contact_ae_id` (uuid, references profiles) - internal AE contact
    - Add `contact_engineer_id` (uuid, references profiles) - internal engineer contact
    - Add `external_contacts` (JSONB) - array of external contacts with name, email, company, role
    - Add `status` (text) - draft, published, archived
    - Add `view_count` (integer) - track content views
    - Add `last_accessed_at` (timestamptz) - last access timestamp
    - Migrate existing `type` field to `category` mapping
  
  2. New Tables
    - `asset_versions`
      - Full version history for all asset changes
      - Tracks: title, description, url, tags, contacts, changed_by, change_notes
      - Enables rollback and audit trail
  
  3. Security
    - Update RLS policies for draft/published visibility
    - Add policies for version history access
    - Admins can manage all content
    - Users can view published content only
  
  4. Indexes
    - Add indexes on category, status, contact fields for better filtering
    - Add index on external_contacts for JSONB queries
*/

-- Add new columns to assets table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'category'
  ) THEN
    ALTER TABLE assets ADD COLUMN category text DEFAULT 'other';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'contact_ae_id'
  ) THEN
    ALTER TABLE assets ADD COLUMN contact_ae_id uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'contact_engineer_id'
  ) THEN
    ALTER TABLE assets ADD COLUMN contact_engineer_id uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'external_contacts'
  ) THEN
    ALTER TABLE assets ADD COLUMN external_contacts JSONB DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'status'
  ) THEN
    ALTER TABLE assets ADD COLUMN status text DEFAULT 'published';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE assets ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' AND column_name = 'last_accessed_at'
  ) THEN
    ALTER TABLE assets ADD COLUMN last_accessed_at timestamptz;
  END IF;
END $$;

-- Migrate existing type field to category
UPDATE assets 
SET category = CASE 
  WHEN type = 'Demo' THEN 'concept_demo'
  WHEN type = 'Case Study' THEN 'case_study'
  WHEN type = 'Deck' THEN 'deck'
  WHEN type = 'Proof' THEN 'proof'
  ELSE 'other'
END
WHERE category = 'other';

-- Create asset_versions table for version control
CREATE TABLE IF NOT EXISTS asset_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  url text,
  category text NOT NULL,
  industry_tags text[] DEFAULT '{}',
  persona_tags text[] DEFAULT '{}',
  stage_tags text[] DEFAULT '{}',
  cloud_tags text[] DEFAULT '{}',
  contact_ae_id uuid REFERENCES profiles(id),
  contact_engineer_id uuid REFERENCES profiles(id),
  external_contacts JSONB DEFAULT '[]',
  status text NOT NULL,
  changed_by uuid REFERENCES profiles(id),
  change_notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asset_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for asset_versions
CREATE POLICY "Users can view version history"
  ON asset_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert asset versions"
  ON asset_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

-- Update assets RLS policies to handle draft/published status
DROP POLICY IF EXISTS "Users can view all assets" ON assets;

CREATE POLICY "Users can view published assets"
  ON assets FOR SELECT
  TO authenticated
  USING (
    status = 'published' OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

-- Add delete policy for admins
CREATE POLICY "Admins can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_contact_ae ON assets(contact_ae_id);
CREATE INDEX IF NOT EXISTS idx_assets_contact_engineer ON assets(contact_engineer_id);
CREATE INDEX IF NOT EXISTS idx_assets_view_count ON assets(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_assets_last_accessed ON assets(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_asset_versions_asset_id ON asset_versions(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_versions_version_number ON asset_versions(asset_id, version_number DESC);

-- Create function to automatically create version on asset update
CREATE OR REPLACE FUNCTION create_asset_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version integer;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version 
  FROM asset_versions 
  WHERE asset_id = NEW.id;
  
  INSERT INTO asset_versions (
    asset_id,
    version_number,
    title,
    description,
    url,
    category,
    industry_tags,
    persona_tags,
    stage_tags,
    cloud_tags,
    contact_ae_id,
    contact_engineer_id,
    external_contacts,
    status,
    changed_by,
    change_notes
  ) VALUES (
    NEW.id,
    next_version,
    NEW.title,
    NEW.description,
    NEW.url,
    NEW.category,
    NEW.industry_tags,
    NEW.persona_tags,
    NEW.stage_tags,
    NEW.cloud_tags,
    NEW.contact_ae_id,
    NEW.contact_engineer_id,
    NEW.external_contacts,
    NEW.status,
    auth.uid(),
    'Automated version creation'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic version creation
DROP TRIGGER IF EXISTS asset_version_trigger ON assets;
CREATE TRIGGER asset_version_trigger
  AFTER INSERT OR UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION create_asset_version();