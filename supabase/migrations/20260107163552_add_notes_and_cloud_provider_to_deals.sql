/*
  # Add notes and cloud provider to deals

  1. Changes
    - Add `notes` column to deals table (text, nullable)
    - Add `cloud_provider` column to deals table (text, nullable)
  
  2. Notes
    - Notes field allows sales reps to add custom notes about the deal
    - Cloud provider field captures the customer's cloud platform preference
    - Both fields are optional and can be updated by authenticated users
*/

-- Add notes column to deals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'notes'
  ) THEN
    ALTER TABLE deals ADD COLUMN notes text;
  END IF;
END $$;

-- Add cloud_provider column to deals table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deals' AND column_name = 'cloud_provider'
  ) THEN
    ALTER TABLE deals ADD COLUMN cloud_provider text;
  END IF;
END $$;