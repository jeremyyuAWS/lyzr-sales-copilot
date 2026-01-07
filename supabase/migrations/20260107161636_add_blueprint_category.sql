/*
  # Add Blueprint Category to Assets

  1. Changes
    - Add 'blueprint' as a valid category option for assets table
    - This allows users to categorize technical blueprints and architecture diagrams

  2. Notes
    - Updates the category check constraint to include the new blueprint type
*/

-- Drop the existing check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'assets_category_check'
  ) THEN
    ALTER TABLE assets DROP CONSTRAINT assets_category_check;
  END IF;
END $$;

-- Add the updated check constraint with blueprint included
ALTER TABLE assets ADD CONSTRAINT assets_category_check 
  CHECK (category IN (
    'concept_demo',
    'case_study',
    'testimonial',
    'one_pager',
    'video',
    'tutorial',
    'sales_play',
    'proof',
    'deck',
    'blueprint',
    'other'
  ));