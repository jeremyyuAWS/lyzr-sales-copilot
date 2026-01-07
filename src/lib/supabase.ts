import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'AE' | 'Admin' | 'Sales Engineer' | 'Sales Leadership';
  created_at: string;
  updated_at: string;
};

export type Deal = {
  id: string;
  company_name: string;
  amount: number;
  stage: 'Discovery' | 'Demo' | 'Proposal' | 'Negotiation' | 'Closed Won';
  close_date: string;
  assigned_ae_id: string;
  industry: string;
  notes?: string | null;
  cloud_provider?: string | null;
  next_action?: string | null;
  next_action_due_date?: string | null;
  health_flags?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type DealContext = {
  id: string;
  deal_id: string;
  description: string;
  primary_use_case: string;
  cloud_provider: 'AWS' | 'Azure' | 'GCP' | 'Multi-Cloud' | null;
  primary_persona: string;
  created_at: string;
  updated_at: string;
};

export type ExternalContact = {
  name: string;
  email: string;
  company: string;
  role: string;
};

export type AssetCategory =
  | 'concept_demo'
  | 'case_study'
  | 'testimonial'
  | 'one_pager'
  | 'video'
  | 'tutorial'
  | 'sales_play'
  | 'proof'
  | 'deck'
  | 'blueprint'
  | 'other';

export type AssetStatus = 'draft' | 'published' | 'archived';

export type Asset = {
  id: string;
  title: string;
  type: 'Demo' | 'Case Study' | 'Deck' | 'Proof';
  category: AssetCategory;
  description: string;
  url: string;
  industry_tags: string[];
  persona_tags: string[];
  stage_tags: string[];
  cloud_tags: string[];
  contact_ae_id: string | null;
  contact_engineer_id: string | null;
  external_contacts: ExternalContact[];
  status: AssetStatus;
  view_count: number;
  last_accessed_at: string | null;
  when_to_use?: string | null;
  positioning_angle?: string | null;
  common_next_steps?: string[] | null;
  best_for_stages?: string[] | null;
  best_for_personas?: string[] | null;
  what_it_is_not?: string | null;
  related_asset_ids?: string[] | null;
  momentum_indicator?: string | null;
  typical_placement?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type AssetVersion = {
  id: string;
  asset_id: string;
  version_number: number;
  title: string;
  description: string;
  url: string;
  category: AssetCategory;
  industry_tags: string[];
  persona_tags: string[];
  stage_tags: string[];
  cloud_tags: string[];
  contact_ae_id: string | null;
  contact_engineer_id: string | null;
  external_contacts: ExternalContact[];
  status: AssetStatus;
  changed_by: string;
  change_notes: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  user_id: string;
  deal_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Recommendation = {
  id: string;
  deal_id: string;
  asset_id: string;
  reason: string;
  confidence_score: number;
  created_at: string;
};
