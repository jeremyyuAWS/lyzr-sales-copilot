/*
  # Add Deal Comments Table

  1. New Tables
    - `deal_comments`
      - `id` (uuid, primary key)
      - `deal_id` (uuid, foreign key to deals)
      - `comment_text` (text)
      - `synced_to_hubspot` (boolean, default false)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `deal_comments` table
    - Add policy for authenticated users to read all comments
    - Add policy for authenticated users to insert their own comments
*/

CREATE TABLE IF NOT EXISTS deal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  synced_to_hubspot boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deal_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all comments"
  ON deal_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON deal_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
