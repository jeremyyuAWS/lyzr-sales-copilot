/*
  # Add Asset Comments and Enhanced Usage Tracking

  1. New Tables
    - `asset_comments`
      - `id` (uuid, primary key)
      - `asset_id` (uuid, references assets)
      - `user_id` (uuid, references profiles)
      - `comment` (text) - AE feedback and insights about the asset
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `asset_comments` table
    - All authenticated users can read comments
    - Users can create, update, and delete their own comments
    - Admins can delete any comment

  3. Indexes
    - Index on asset_id for faster lookups
    - Index on user_id for user-specific queries
    - Index on created_at for sorting by recency

  4. Purpose
    - Allow AEs to share insights and feedback about assets
    - Enable collaborative knowledge sharing about asset effectiveness
    - Track which assets are most discussed and valued by the team
*/

CREATE TABLE IF NOT EXISTS asset_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_comments_asset_id ON asset_comments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_comments_user_id ON asset_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_asset_comments_created_at ON asset_comments(created_at DESC);

ALTER TABLE asset_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all comments"
  ON asset_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own comments"
  ON asset_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON asset_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON asset_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment"
  ON asset_comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );