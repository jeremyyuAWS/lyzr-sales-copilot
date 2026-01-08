/*
  # Add tier classification to deals

  1. Changes
    - Add `tier` column to deals table (text, nullable)

  2. Notes
    - Tier field allows sales teams to classify deals by priority/size
    - Valid values: 'Tier 1', 'Tier 2', 'Tier 3'
    - Optional field that can be updated by authenticated users
*/

-- Add tier column to deals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'tier'
  ) THEN
    ALTER TABLE deals ADD COLUMN tier text;
  END IF;
END $$;