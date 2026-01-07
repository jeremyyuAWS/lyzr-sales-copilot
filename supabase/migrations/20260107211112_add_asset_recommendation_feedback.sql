/*
  # Add Asset Recommendation Feedback Table

  1. New Tables
    - `asset_recommendation_feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `asset_id` (uuid, references assets)
      - `context` (text) - meeting notes or query context
      - `feedback_type` (text) - 'upvote' or 'downvote'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `asset_recommendation_feedback` table
    - Add policy for authenticated users to create their own feedback
    - Add policy for authenticated users to read their own feedback
    - Add policy for authenticated users to update their own feedback

  3. Indexes
    - Index on user_id for faster lookups
    - Index on asset_id for analytics
    - Unique constraint on user_id + asset_id + context to prevent duplicate feedback
*/

CREATE TABLE IF NOT EXISTS asset_recommendation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  context text NOT NULL,
  feedback_type text NOT NULL CHECK (feedback_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_feedback_user_id ON asset_recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_feedback_asset_id ON asset_recommendation_feedback(asset_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_asset_feedback_unique ON asset_recommendation_feedback(user_id, asset_id, context);

ALTER TABLE asset_recommendation_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own feedback"
  ON asset_recommendation_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback"
  ON asset_recommendation_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON asset_recommendation_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback"
  ON asset_recommendation_feedback FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
