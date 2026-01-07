/*
  # Add Deal Milestones and Tasks

  1. New Tables
    - `deal_milestones` - Track upcoming events, meetings, deadlines for deals
    - `deal_tasks` - Track action items and to-dos for deals
    
  2. Schema
    - Milestones have type (demo, proposal, review, meeting, deadline)
    - Tasks have status (pending, completed, overdue)
    - Both link to deals and track dates
    
  3. Sample Data
    - Populate realistic milestones and tasks for existing deals
*/

-- Create deal_milestones table
CREATE TABLE IF NOT EXISTS deal_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('demo', 'proposal', 'review', 'meeting', 'deadline', 'follow_up')),
  due_date timestamptz NOT NULL,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deal_tasks table
CREATE TABLE IF NOT EXISTS deal_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  due_date timestamptz,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add next_action field to deals table
ALTER TABLE deals
ADD COLUMN IF NOT EXISTS next_action text,
ADD COLUMN IF NOT EXISTS next_action_due_date timestamptz,
ADD COLUMN IF NOT EXISTS health_flags text[];

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_milestones_deal_id ON deal_milestones(deal_id);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON deal_milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON deal_tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON deal_tasks(status);

-- Populate sample milestones and tasks
DO $$
DECLARE
  deal_record record;
BEGIN
  -- Get all active deals
  FOR deal_record IN SELECT id, company_name, stage, close_date FROM deals WHERE stage != 'Closed Won' LOOP
    
    -- Add milestones based on stage
    IF deal_record.stage = 'Discovery' THEN
      INSERT INTO deal_milestones (deal_id, title, type, due_date, notes)
      VALUES 
        (deal_record.id, 'Initial discovery call', 'meeting', now() + interval '3 days', 'Scheduled with VP Engineering'),
        (deal_record.id, 'Technical requirements review', 'review', now() + interval '7 days', 'Need to understand their tech stack');
        
      INSERT INTO deal_tasks (deal_id, title, status, due_date)
      VALUES
        (deal_record.id, 'Prepare discovery deck', 'pending', now() + interval '2 days'),
        (deal_record.id, 'Research company background', 'pending', now() + interval '1 day');
        
      UPDATE deals SET 
        next_action = 'Schedule technical demo',
        next_action_due_date = now() + interval '3 days',
        health_flags = ARRAY['missing_technical_champion']::text[]
      WHERE id = deal_record.id;
      
    ELSIF deal_record.stage = 'Demo' THEN
      INSERT INTO deal_milestones (deal_id, title, type, due_date, notes)
      VALUES
        (deal_record.id, 'Product demo scheduled', 'demo', now() + interval '5 days', 'Demo for technical team'),
        (deal_record.id, 'Follow-up meeting', 'meeting', now() + interval '12 days', 'Review demo feedback');
        
      INSERT INTO deal_tasks (deal_id, title, status, due_date)
      VALUES
        (deal_record.id, 'Customize demo environment', 'pending', now() + interval '4 days'),
        (deal_record.id, 'Send pre-demo materials', 'pending', now() + interval '3 days'),
        (deal_record.id, 'Confirm attendees', 'completed', now() - interval '1 day');
        
      UPDATE deals SET
        next_action = 'Send proposal recap email',
        next_action_due_date = now() + interval '5 days',
        health_flags = ARRAY[]::text[]
      WHERE id = deal_record.id;
      
    ELSIF deal_record.stage = 'Proposal' THEN
      INSERT INTO deal_milestones (deal_id, title, type, due_date, notes)
      VALUES
        (deal_record.id, 'Proposal review due', 'review', now() + interval '6 days', 'Decision maker review'),
        (deal_record.id, 'Q&A session', 'meeting', now() + interval '10 days', 'Address proposal questions');
        
      INSERT INTO deal_tasks (deal_id, title, status, due_date)
      VALUES
        (deal_record.id, 'Send proposal recap email', 'overdue', now() - interval '2 days'),
        (deal_record.id, 'Schedule legal review', 'pending', now() + interval '5 days'),
        (deal_record.id, 'Prepare ROI calculator', 'completed', now() - interval '3 days');
        
      UPDATE deals SET
        next_action = 'Follow up on proposal (overdue 2 days)',
        next_action_due_date = now() - interval '2 days',
        health_flags = ARRAY['no_response_to_proposal', 'follow_up_overdue']::text[]
      WHERE id = deal_record.id;
      
    ELSIF deal_record.stage = 'Negotiation' THEN
      INSERT INTO deal_milestones (deal_id, title, type, due_date, notes)
      VALUES
        (deal_record.id, 'Contract review deadline', 'deadline', now() + interval '8 days', 'Legal needs to approve'),
        (deal_record.id, 'Final pricing call', 'meeting', now() + interval '4 days', 'Negotiate terms');
        
      INSERT INTO deal_tasks (deal_id, title, status, due_date)
      VALUES
        (deal_record.id, 'Legal review pending', 'pending', now() + interval '7 days'),
        (deal_record.id, 'Prepare contract redlines', 'pending', now() + interval '3 days'),
        (deal_record.id, 'Security questionnaire completed', 'completed', now() - interval '5 days');
        
      UPDATE deals SET
        next_action = 'Introduce security stakeholder',
        next_action_due_date = now() + interval '4 days',
        health_flags = ARRAY['competitive_pressure']::text[]
      WHERE id = deal_record.id;
    END IF;
    
  END LOOP;
END $$;
