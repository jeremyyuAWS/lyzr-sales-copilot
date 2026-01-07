/*
  # Add Recommendation Feedback System

  1. New Tables
    - `recommendation_feedback`
      - `id` (uuid, primary key)
      - `recommendation_id` (uuid, foreign key to recommendations)
      - `deal_id` (uuid, foreign key to deals)
      - `asset_id` (uuid, foreign key to assets)
      - `user_id` (uuid, references profiles)
      - `vote` (text, 'up' or 'down')
      - `feedback_reason` (text, optional reason for downvote)
      - `feedback_notes` (text, additional notes)
      - `created_at` (timestamp)

  2. Security
    - No RLS for demo mode
    - All users can submit feedback

  3. Purpose
    - Track which recommendations AEs find helpful
    - Collect feedback on why recommendations aren't useful
    - Improve AI recommendation engine over time
*/

CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id uuid REFERENCES recommendations(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  user_id uuid,
  vote text NOT NULL CHECK (vote IN ('up', 'down')),
  feedback_reason text,
  feedback_notes text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_recommendation 
  ON recommendation_feedback(recommendation_id);

CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_deal 
  ON recommendation_feedback(deal_id);

-- Disable RLS for demo mode
ALTER TABLE recommendation_feedback DISABLE ROW LEVEL SECURITY;