/*
  # Add Meeting Notes to Deal Context

  1. Changes
    - Add `meeting_notes` column to `deal_context` table
      - Type: text
      - Default: empty string
      - Purpose: Store meeting notes, call summaries, and contextual information for AI discovery

  2. Notes
    - This field enables AEs to paste meeting notes that can be used for better asset recommendations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'deal_context' AND column_name = 'meeting_notes'
  ) THEN
    ALTER TABLE deal_context ADD COLUMN meeting_notes text DEFAULT '';
  END IF;
END $$;
