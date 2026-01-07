/*
  # Update Assets RLS Policies - Allow All Users to Create Content
  
  1. Changes
    - Update insert policy to allow all authenticated users to create content
    - Update update policy to allow users to edit their own content
    - Admins can still edit all content
    - Keep existing view policies for published content
  
  2. Security
    - Users can create their own content
    - Users can update content they created
    - Admins can update any content
    - All users can view published content
    - Only admins can see draft/archived content from others
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert assets" ON assets;
DROP POLICY IF EXISTS "Admins can update assets" ON assets;

-- Create new policies allowing all authenticated users to create content
CREATE POLICY "Authenticated users can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
  );

-- Allow users to update their own content, admins can update all
CREATE POLICY "Users can update own assets, admins can update all"
  ON assets FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  )
  WITH CHECK (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Admin'
    )
  );