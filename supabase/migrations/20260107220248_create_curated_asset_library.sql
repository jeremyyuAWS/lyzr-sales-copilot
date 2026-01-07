/*
  # Create Curated Asset Library with Rich Metadata

  1. Changes
    - Clear existing assets to start fresh
    - Create 5-10 high-quality assets per category
    - Populate all enhanced metadata fields
    - Generate realistic AE comments
    - Link related assets
    - Set proper usage metrics
    
  2. Categories Covered
    - Concept Demos
    - Case Studies
    - One-Pagers
    - Videos
    - Decks
    - Sales Plays
*/

-- Clear existing assets and comments
DELETE FROM asset_comments;
DELETE FROM linked_assets;
DELETE FROM asset_versions;
DELETE FROM recommendations WHERE asset_id IS NOT NULL;
DELETE FROM assets;

-- Insert curated concept demos
INSERT INTO assets (
  id, title, type, category, description, url, 
  industry_tags, persona_tags, stage_tags, cloud_tags,
  status, view_count, last_accessed_at, created_by,
  when_to_use, positioning_angle, common_next_steps,
  best_for_stages, best_for_personas, what_it_is_not,
  momentum_indicator, typical_placement
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Lyzr Platform Overview - Interactive Demo',
    'Demo',
    'concept_demo',
    '8-minute comprehensive overview of the Lyzr AI agent platform: capabilities, use cases, and customer success stories.',
    'https://demo.lyzr.ai/platform-overview',
    ARRAY['SaaS', 'Enterprise', 'Technology'],
    ARRAY['VP Engineering', 'CTO', 'VP Product'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['AWS', 'Azure', 'GCP'],
    'published',
    847,
    now() - interval '2 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• First-time prospect needs platform introduction\n• Multiple stakeholders need alignment (8+ person calls)\n• AE needs to explain "what is Lyzr?" in under 10 minutes\n• Customer asks about breadth of capabilities',
    'Frame Lyzr as a platform, not a point solution. Emphasize agent orchestration and flexibility over individual features. Position as "the operating system for AI agents" that integrates with their existing stack.',
    ARRAY['Custom demo with their use case', 'Technical deep dive with Solutions team', 'Architecture review call', 'ROI calculator session'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['CTO', 'VP Engineering', 'Technical Lead'],
    E'**Good for:** Platform overview, enterprise discovery, multi-stakeholder alignment\n**Not ideal for:** Deep technical validation, pricing discussions, single-feature evaluation',
    'Very High - 85% of prospects schedule custom demo after viewing',
    'First or second call, ideal as pre-meeting send'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Customer Support Automation - AI Agent Demo',
    'Demo',
    'concept_demo',
    'Live demonstration of AI agents handling tier-1 support tickets: ticket routing, auto-responses, and escalation workflows.',
    'https://demo.lyzr.ai/support-automation',
    ARRAY['SaaS', 'E-commerce', 'FinTech'],
    ARRAY['VP Customer Success', 'Head of Support', 'COO'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['AWS', 'Azure'],
    'published',
    623,
    now() - interval '5 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Support team is overwhelmed (high ticket volume pain)\n• Customer asks about automation ROI\n• Prospect has 50+ support agents\n• Looking to reduce response time SLAs',
    'Lead with the 70% ticket deflection metric. Emphasize cost savings AND customer satisfaction improvement. Position as "augmenting your team, not replacing them" to avoid internal resistance.',
    ARRAY['Calculate their ticket deflection ROI', 'Demo with their actual ticket data', 'Integration planning session', 'Proof of concept proposal'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['VP Customer Success', 'Head of Support'],
    E'**Good for:** Support automation, high-volume ticket scenarios, cost reduction plays\n**Not ideal for:** Low ticket volume (<1000/month), highly specialized support, heavily regulated industries without seeing compliance demo first',
    'High - 75% request POC with real data',
    'Mid-cycle after pain point confirmed'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Sales Copilot Demo - Deal Intelligence',
    'Demo',
    'concept_demo',
    'Real-time AI assistant for sales reps: next best actions, content recommendations, deal risk analysis, and email drafting.',
    'https://demo.lyzr.ai/sales-copilot',
    ARRAY['SaaS', 'Enterprise'],
    ARRAY['VP Sales', 'CRO', 'Sales Ops'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['Multi-Cloud'],
    'published',
    512,
    now() - interval '1 day',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Sales org has rep onboarding challenges\n• Deal pipeline visibility is poor\n• Customer mentions "coaching at scale" problem\n• Sales team uses Salesforce or HubSpot',
    'Position as "every rep gets an experienced mentor in their ear." Focus on accelerating ramp time for new hires and increasing win rates for existing team. Avoid "AI will replace reps" messaging.',
    ARRAY['Sales leadership alignment call', 'Integration scoping with their CRM', 'Pilot program with 5-10 reps', 'Change management planning'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['VP Sales', 'CRO', 'Sales Enablement'],
    E'**Good for:** Large sales orgs (50+ reps), complex sales cycles, rep enablement plays\n**Not ideal for:** Small teams (<10 reps), transactional sales, organizations resistant to AI',
    'Medium-High - 60% move to pilot discussion',
    'Early discovery when coaching needs surface'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Document Intelligence Agent Demo',
    'Demo',
    'concept_demo',
    'AI agents extracting insights from contracts, invoices, legal documents with 99% accuracy and instant processing.',
    'https://demo.lyzr.ai/document-intelligence',
    ARRAY['Legal Tech', 'Financial Services', 'Healthcare'],
    ARRAY['General Counsel', 'CFO', 'Compliance Officer'],
    ARRAY['Demo', 'Technical Validation'],
    ARRAY['Azure', 'AWS'],
    'published',
    445,
    now() - interval '3 days',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• High volume of contracts or invoices (1000+/month)\n• Manual document review is bottleneck\n• Compliance requirements need audit trails\n• Customer mentions "lost time in document review"',
    'Lead with time savings first, accuracy second. Use "99% accuracy with full audit trail" as the hook. Position as compliance-friendly and integration-ready with their doc management systems.',
    ARRAY['Document samples review', 'Accuracy validation with their docs', 'Compliance documentation review', 'Integration architecture planning'],
    ARRAY['Demo', 'Technical Validation'],
    ARRAY['General Counsel', 'CFO', 'Compliance Officer'],
    E'**Good for:** High-volume document processing, regulated industries, audit-heavy workflows\n**Not ideal for:** Low document volume, extremely specialized document types without custom training',
    'Very High - 80% request accuracy testing with their docs',
    'After confirming document processing pain'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Financial Analysis Agent - Live Demo',
    'Demo',
    'concept_demo',
    'AI-powered financial analysis: automated reporting, trend detection, anomaly alerts, and forecasting models.',
    'https://demo.lyzr.ai/financial-analysis',
    ARRAY['FinTech', 'Banking', 'Insurance'],
    ARRAY['CFO', 'Finance Director', 'VP Finance'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['AWS', 'GCP'],
    'published',
    389,
    now() - interval '6 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Month-end close takes too long\n• Manual reporting errors are frequent\n• FP&A team is understaffed\n• Real-time financial insights needed',
    'Position as "CFO copilot" not automation tool. Emphasize speed to insights and error reduction. Focus on strategic decision-making enablement rather than just efficiency.',
    ARRAY['Financial data integration assessment', 'Custom report demo with their metrics', 'Security and compliance review', 'FP&A team workshop'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['CFO', 'Finance Director'],
    E'**Good for:** Mid to large finance teams, complex reporting needs, real-time analysis requirements\n**Not ideal for:** Simple bookkeeping, very small companies, non-integrated financial systems',
    'High - 70% proceed to data integration discussion',
    'Mid-cycle when reporting pain is established'
  );

-- Insert curated case studies
INSERT INTO assets (
  id, title, type, category, description, url,
  industry_tags, persona_tags, stage_tags, cloud_tags,
  status, view_count, last_accessed_at, created_by,
  when_to_use, positioning_angle, common_next_steps,
  best_for_stages, best_for_personas, what_it_is_not,
  momentum_indicator, typical_placement
) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Fortune 500 Insurance: 40% Cost Reduction Case Study',
    'Case Study',
    'case_study',
    'How a major insurance provider reduced claims processing costs by 40% and improved customer satisfaction by 35% using Lyzr AI agents.',
    'https://lyzr.ai/case-studies/insurance-automation',
    ARRAY['Insurance', 'Financial Services'],
    ARRAY['CIO', 'VP Operations', 'CFO'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['Azure'],
    'published',
    892,
    now() - interval '4 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Late-stage deal needs ROI validation\n• CFO or procurement involved\n• Customer asks "who else has done this?"\n• Insurance or heavily regulated industry',
    'Lead with the 40% cost reduction metric immediately. Emphasize the enterprise scale (50M+ customers) and regulatory compliance success. Use the "3-month payback period" as the clincher.',
    ARRAY['Executive business review', 'CFO-level ROI modeling', 'Reference call with customer', 'Security compliance documentation'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['CFO', 'VP Operations', 'Procurement'],
    E'**Good for:** Enterprise deals, ROI justification, regulated industry social proof\n**Not ideal for:** Early discovery, SMB deals, non-insurance prospects (though financial services works)',
    'Very High - Often accelerates close by 2-4 weeks',
    'Late stage when budget/ROI concerns arise'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'SaaS Unicorn: 10x Support Efficiency Gains',
    'Case Study',
    'case_study',
    'Fast-growing SaaS company scaled from 100K to 1M users without expanding support team using Lyzr automation.',
    'https://lyzr.ai/case-studies/saas-support-scale',
    ARRAY['SaaS', 'Technology'],
    ARRAY['VP Customer Success', 'COO', 'Head of Support'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['AWS'],
    'published',
    734,
    now() - interval '1 day',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Hyper-growth company concerned about scaling support\n• Customer success team hiring challenges\n• Budget constraints prevent team expansion\n• NPS or CSAT declining due to volume',
    'Focus on "scale without headcount" narrative. Perfect for venture-backed companies watching burn rate. Emphasize the 10x multiplier and maintained CSAT score despite growth.',
    ARRAY['Support ops assessment', 'Cost avoidance calculation', 'Integration with their helpdesk', 'Pilot with subset of tickets'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['VP Customer Success', 'COO'],
    E'**Good for:** High-growth SaaS, support scaling challenges, VC-backed companies\n**Not ideal for:** Stable/slow-growth companies, white-glove support models, very early stage startups',
    'High - 65% engage in scaling conversation',
    'When growth challenges are discussed'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Healthcare Provider: HIPAA-Compliant AI Implementation',
    'Case Study',
    'case_study',
    'Large healthcare system deployed AI agents for patient scheduling and records management while maintaining full HIPAA compliance.',
    'https://lyzr.ai/case-studies/healthcare-hipaa',
    ARRAY['Healthcare', 'Medical'],
    ARRAY['CIO', 'CISO', 'Compliance Officer'],
    ARRAY['Technical Validation', 'Proposal'],
    ARRAY['Azure', 'AWS'],
    'published',
    567,
    now() - interval '2 days',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Healthcare or regulated industry prospect\n• Compliance objections raised\n• Security questionnaire phase\n• HIPAA/SOC2/ISO requirements discussed',
    'Lead with compliance-first approach. Use "HIPAA-compliant by design" messaging. Emphasize the successful audit history and enterprise healthcare customer base.',
    ARRAY['Security documentation package', 'Compliance team discussion', 'BAA (Business Associate Agreement) review', 'HIPAA controls demonstration'],
    ARRAY['Technical Validation', 'Proposal'],
    ARRAY['CISO', 'Compliance Officer', 'CIO'],
    E'**Good for:** Healthcare deals, HIPAA requirements, compliance-heavy validation\n**Not ideal for:** Non-regulated industries, prospects without compliance concerns',
    'Very High - Critical for healthcare deal progression',
    'When compliance concerns arise (often early)'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'E-commerce Leader: $2M Revenue Recovery Story',
    'Case Study',
    'case_study',
    'How an e-commerce company recovered $2M in annual revenue through AI-powered customer retention and churn prediction.',
    'https://lyzr.ai/case-studies/ecommerce-revenue',
    ARRAY['E-commerce', 'Retail'],
    ARRAY['CEO', 'CMO', 'VP Marketing'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['AWS', 'GCP'],
    'published',
    698,
    now() - interval '8 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• E-commerce or retail prospect\n• High churn rate pain point\n• Customer LTV discussion\n• Revenue growth goals mentioned',
    'Lead with the $2M revenue recovery headline. Break down into churn reduction (60%) and upsell improvement (40%). Focus on quick time-to-value (45 days to first results).',
    ARRAY['Churn analysis of their data', 'Customer LTV modeling', 'Marketing integration planning', 'Retention campaign design'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['CMO', 'VP Marketing', 'CEO'],
    E'**Good for:** E-commerce, subscription businesses, customer retention plays\n**Not ideal for:** Pure B2B sales, low-churn businesses, brand-new companies without customer data',
    'High - 70% engage in churn analysis',
    'When retention metrics are discussed'
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Manufacturing Giant: Supply Chain Optimization',
    'Case Study',
    'case_study',
    'Global manufacturer reduced supply chain costs by 25% and improved on-time delivery to 97% using predictive AI agents.',
    'https://lyzr.ai/case-studies/manufacturing-supply-chain',
    ARRAY['Manufacturing', 'Logistics'],
    ARRAY['COO', 'VP Supply Chain', 'VP Operations'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['Azure', 'Multi-Cloud'],
    'published',
    534,
    now() - interval '3 days',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Manufacturing or logistics prospect\n• Supply chain disruption pain\n• On-time delivery challenges\n• Inventory optimization needs',
    'Focus on dual benefits: cost reduction AND service level improvement. Emphasize predictive capabilities preventing disruptions before they happen. Use "97% on-time delivery" as proof.',
    ARRAY['Supply chain assessment', 'Predictive model demo with their data', 'Operations team workshop', 'Integration with ERP systems'],
    ARRAY['Demo', 'Proposal'],
    ARRAY['COO', 'VP Supply Chain', 'VP Operations'],
    E'**Good for:** Manufacturing, logistics, supply chain optimization plays\n**Not ideal for:** Service businesses, digital-only companies, very simple supply chains',
    'Medium-High - 65% request supply chain analysis',
    'When supply chain pain is mentioned'
  );

-- Continue in next part...
