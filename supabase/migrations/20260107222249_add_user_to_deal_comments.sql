/*
  # Add user attribution to deal comments

  1. Changes
    - Add created_by column to deal_comments for user attribution
    - Add foreign key to profiles table
*/

-- Add created_by column to deal_comments
ALTER TABLE deal_comments ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_deal_comments_created_by ON deal_comments(created_by);
