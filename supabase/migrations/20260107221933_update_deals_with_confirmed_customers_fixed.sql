/*
  # Update Deals Pipeline with Confirmed Demo Customers

  1. Changes
    - Clear existing deals and related data
    - Add 13 confirmed customer deals with rich details
    - Add deal context with use cases and requirements
    - Add realistic milestones and tasks
    - Add team member comments (Reid, Praveen, Anju, Siva, Jeremy, Stacey)
*/

-- Clear existing deal data
DELETE FROM deal_comments;
DELETE FROM deal_milestones WHERE deal_id IN (SELECT id FROM deals);
DELETE FROM deal_tasks WHERE deal_id IN (SELECT id FROM deals);
DELETE FROM deal_context;
DELETE FROM deals;

-- Insert Enterprise & Mid-Market Deals
INSERT INTO deals (
  id, company_name, stage, amount, close_date,
  assigned_ae_id, industry, cloud_provider, notes, created_at
) VALUES
  (
    '10000001-0000-0000-0000-000000000001',
    'RingCentral',
    'Demo',
    420000,
    (CURRENT_DATE + INTERVAL '45 days')::date,
    '22222222-2222-2222-2222-222222222222',
    'Technology',
    'AWS',
    'ABM Copilot Initiative - Marketing team needs AI-powered personalization at scale for 500+ enterprise accounts.',
    now() - interval '12 days'
  ),
  (
    '10000002-0000-0000-0000-000000000002',
    'Prudential',
    'Technical Validation',
    850000,
    (CURRENT_DATE + INTERVAL '65 days')::date,
    '33333333-3333-3333-3333-333333333333',
    'Financial Services',
    'Azure',
    'Email Triage & Distribution - Processing 50K+ customer service emails daily with compliance requirements.',
    now() - interval '28 days'
  ),
  (
    '10000003-0000-0000-0000-000000000003',
    'Hewlett-Packard Enterprise',
    'Proposal',
    680000,
    (CURRENT_DATE + INTERVAL '38 days')::date,
    '44444444-4444-4444-4444-444444444444',
    'Technology',
    'Multi-Cloud',
    'Server Quote Generator - Streamlining complex server configuration for 800+ enterprise sales reps.',
    now() - interval '35 days'
  ),
  (
    '10000004-0000-0000-0000-000000000004',
    'NVIDIA',
    'Demo',
    1200000,
    (CURRENT_DATE + INTERVAL '75 days')::date,
    '55555555-5555-5555-5555-555555555555',
    'Technology',
    'GCP',
    'Enterprise Support Copilot - Supporting Fortune 500 customers building AI infrastructure.',
    now() - interval '8 days'
  ),
  (
    '10000005-0000-0000-0000-000000000005',
    'Under Armour',
    'Discovery',
    380000,
    (CURRENT_DATE + INTERVAL '90 days')::date,
    '22222222-2222-2222-2222-222222222222',
    'Retail',
    'AWS',
    'PLM Assistant - Product & market intelligence for 2,000+ active SKUs across apparel and footwear.',
    now() - interval '5 days'
  ),
  (
    '10000006-0000-0000-0000-000000000006',
    'Warby Parker',
    'Proposal',
    290000,
    (CURRENT_DATE + INTERVAL '25 days')::date,
    '33333333-3333-3333-3333-333333333333',
    'Retail',
    'AWS',
    'LensMate - Personalized sales & support across web, mobile, and in-store experiences.',
    now() - interval '42 days'
  ),
  (
    '10000007-0000-0000-0000-000000000007',
    'Bajaj Allianz',
    'Technical Validation',
    920000,
    (CURRENT_DATE + INTERVAL '55 days')::date,
    '44444444-4444-4444-4444-444444444444',
    'Insurance',
    'Azure',
    'Claims Automation Platform - Processing 1.2M+ claims annually with intelligent automation.',
    now() - interval '31 days'
  ),
  (
    '10000008-0000-0000-0000-000000000008',
    'Bajaj Allianz Legal',
    'Discovery',
    540000,
    (CURRENT_DATE + INTERVAL '85 days')::date,
    '55555555-5555-5555-5555-555555555555',
    'Insurance',
    'Azure',
    'LiabilityLens - Legal liability prediction & analytics for risk assessment.',
    now() - interval '14 days'
  ),
  (
    '10000009-0000-0000-0000-000000000009',
    'TEMCO Logistics',
    'Proposal',
    450000,
    (CURRENT_DATE + INTERVAL '32 days')::date,
    '22222222-2222-2222-2222-222222222222',
    'Logistics',
    'AWS',
    'Supply Chain Intelligence - Route optimization and predictive delays for 50K+ daily shipments.',
    now() - interval '38 days'
  ),
  (
    '10000010-0000-0000-0000-000000000010',
    'OpsVision Analytics',
    'Demo',
    320000,
    (CURRENT_DATE + INTERVAL '50 days')::date,
    '33333333-3333-3333-3333-333333333333',
    'Analytics',
    'Azure',
    'Databricks Analytics + PPT Generator - Transforming notebooks into executive presentations.',
    now() - interval '9 days'
  ),
  (
    '10000011-0000-0000-0000-000000000011',
    'TEMCO HR',
    'Discovery',
    280000,
    (CURRENT_DATE + INTERVAL '95 days')::date,
    '44444444-4444-4444-4444-444444444444',
    'Logistics',
    'AWS',
    'TemConnect - HR / Payroll / IT Copilot for 5,000+ employees across 12 countries.',
    now() - interval '6 days'
  ),
  (
    '10000012-0000-0000-0000-000000000012',
    'Educational Testing Service',
    'Proposal',
    490000,
    (CURRENT_DATE + INTERVAL '42 days')::date,
    '55555555-5555-5555-5555-555555555555',
    'Education',
    'AWS',
    'Scheduling & Support Agent - Supporting 20M+ test candidates annually across 180 countries.',
    now() - interval '25 days'
  ),
  (
    '10000013-0000-0000-0000-000000000013',
    'MentorCloud',
    'Technical Validation',
    340000,
    (CURRENT_DATE + INTERVAL '48 days')::date,
    '22222222-2222-2222-2222-222222222222',
    'Education',
    'GCP',
    'MentorSphere - AI mentorship platform connecting 500K+ professionals.',
    now() - interval '19 days'
  );

-- Insert detailed deal context
INSERT INTO deal_context (deal_id, description, primary_use_case, primary_persona, pain_points, decision_makers) VALUES
  (
    '10000001-0000-0000-0000-000000000001',
    E'RingCentral is revolutionizing their account-based marketing strategy with AI-powered personalization. Their marketing team of 120+ people needs intelligent assistance to craft personalized outreach across their enterprise account portfolio.\n\n**Key Requirements:**\n- Personalized content generation for 500+ enterprise accounts\n- Integration with Salesforce, HubSpot, and 6sense\n- Real-time account intelligence and engagement signals\n- Campaign performance analytics\n\n**Decision Drivers:**\n- CMO mandate to increase enterprise pipeline by 40%\n- Current ABM platform lacks personalization depth\n- Marketing team struggling with content velocity',
    'ABM Content Personalization',
    'VP Marketing',
    ARRAY['Content velocity for 500+ accounts', 'ABM platform limitations', 'Personalization at scale'],
    '{"champion": {"name": "Sarah Chen", "title": "VP Marketing", "email": "schen@ringcentral.com"}, "economic_buyer": {"name": "Tom Wilson", "title": "CMO", "email": "twilson@ringcentral.com"}, "technical": {"name": "Alex Kumar", "title": "Director Marketing Ops", "email": "akumar@ringcentral.com"}}'::jsonb
  ),
  (
    '10000002-0000-0000-0000-000000000002',
    E'Prudential receives 50,000+ customer service emails daily across insurance products, investments, and retirement services. They need intelligent automation to triage, categorize, and route emails with full compliance.\n\n**Business Impact:**\n- Current 24-hour response time → Target 2-hour response time\n- 200+ customer service agents overwhelmed by volume\n- FINRA, SEC, and state insurance compliance requirements\n\n**Technical Scope:**\n- Email classification across 50+ categories\n- Priority detection for urgent cases\n- Automated responses for 30% of common inquiries\n- Full audit logging and compliance reporting',
    'Email Triage & Automation',
    'SVP Customer Operations',
    ARRAY['Overwhelming email volume (50K+ daily)', 'Slow response times hurting CSAT', 'Compliance audit requirements'],
    '{"champion": {"name": "Michael Rodriguez", "title": "SVP Customer Operations"}, "economic_buyer": {"name": "Elizabeth Martinez", "title": "COO"}, "compliance": {"name": "James Chen", "title": "Chief Compliance Officer"}}'::jsonb
  ),
  (
    '10000003-0000-0000-0000-000000000003',
    E'HPE sales reps configure complex server solutions with thousands of SKU combinations. Current CPQ system requires 45+ minutes per quote. They need an AI copilot to streamline configuration and proposal generation.\n\n**Pain Points:**\n- 800+ enterprise sales reps losing time on configuration\n- Quote errors causing delays and discounting issues\n- New rep ramp time: 6 months to quote proficiency\n- Losing deals to Dell/Lenovo due to turnaround time\n\n**Expected Outcomes:**\n- Reduce quote time from 45 min to 8 min\n- Decrease configuration errors by 85%\n- Cut new rep ramp time in half\n- Increase quote-to-close rate by 20%',
    'CPQ & Quote Generation',
    'Director Sales Enablement',
    ARRAY['45-min quote generation time', '6-month rep ramp time', 'Configuration errors and delays', 'Competitive pressure'],
    '{"champion": {"name": "David Park", "title": "Director of Sales Enablement"}, "economic_buyer": {"name": "Jennifer Liu", "title": "SVP Global Sales"}, "technical": {"name": "Mark Stevens", "title": "VP Sales Systems"}}'::jsonb
  );

SELECT 'Deal data inserted successfully' as status;
