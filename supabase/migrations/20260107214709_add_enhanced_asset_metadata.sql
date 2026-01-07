/*
  # Add Enhanced Asset Metadata

  1. Schema Changes
    - Add when_to_use field (text) - guidance on when to use this asset
    - Add positioning_angle field (text) - how AEs should position it
    - Add common_next_steps field (text array) - typical follow-up actions
    - Add best_for_stages field (text array) - most effective deal stages
    - Add best_for_personas field (text array) - most effective personas
    - Add what_it_is_not field (text) - anti-patterns and misuse prevention
    - Add related_asset_ids field (uuid array) - similar/complementary assets
    - Add momentum_indicator field (text) - typical impact/next meeting likelihood
    - Add typical_placement field (text) - when in sales cycle to use
    
  2. Notes
    - All new fields are nullable to support gradual rollout
    - Arrays support multiple values for flexibility
    - Text fields use markdown for rich formatting
*/

-- Add new metadata columns to assets table
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS when_to_use text,
ADD COLUMN IF NOT EXISTS positioning_angle text,
ADD COLUMN IF NOT EXISTS common_next_steps text[],
ADD COLUMN IF NOT EXISTS best_for_stages text[],
ADD COLUMN IF NOT EXISTS best_for_personas text[],
ADD COLUMN IF NOT EXISTS what_it_is_not text,
ADD COLUMN IF NOT EXISTS related_asset_ids uuid[],
ADD COLUMN IF NOT EXISTS momentum_indicator text,
ADD COLUMN IF NOT EXISTS typical_placement text;
