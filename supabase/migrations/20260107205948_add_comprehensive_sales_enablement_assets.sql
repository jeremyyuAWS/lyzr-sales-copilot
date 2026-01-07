/*
  # Comprehensive Sales Enablement Asset Library
  
  1. Overview
    - Populates 80+ realistic sales enablement assets across all categories
    - Based on 12 core sales copilot use cases and their derivatives
    - Includes engagement metrics (view counts, last accessed times)
    - Realistic tagging for industry, persona, stage, and cloud provider
    
  2. Asset Categories Covered
    - concept_demo: Live interactive demos and POCs
    - case_study: Customer success stories with metrics
    - proof: ROI calculators, benchmark data, analyst reports
    - deck: Presentation decks for different audiences
    - video: Recorded demos and customer testimonials
    - tutorial: How-to guides and implementation docs
    - sales_play: Sales playbooks and objection handlers
    - one_pager: Quick reference sheets and battle cards
    - blueprint: Technical architecture and implementation plans
    - testimonial: Customer quotes and references
    
  3. Demo Scenarios
    - Account Intelligence Copilot
    - Email Drafting & Reply Copilot
    - Meeting Notes → Deal Update Copilot
    - Pipeline Risk Detector
    - Enterprise Quote Copilot
    - Customer Support → Upsell Copilot
    - Renewal & Expansion Copilot
    - Sales Manager Deal Review Copilot
    - Account-Based Sales Planning Copilot
    - Competitive Objection Copilot
    - Sales Knowledge Search Copilot
    
  4. Engagement Metrics
    - View counts ranging from 5 to 450
    - Recent access timestamps for trending content
    - Realistic distribution favoring high-quality assets
*/

-- Clear existing assets to avoid duplicates (for demo purposes)
DELETE FROM asset_versions;
DELETE FROM recommendations;
DELETE FROM linked_assets;
DELETE FROM assets;

-- Account Intelligence Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Account Intelligence Copilot - Live Demo', 'Demo', 'concept_demo', 'Interactive demo showing real-time account synthesis from CRM, emails, and call notes. Includes risk detection, next best actions, and deal health scoring.', 'https://demo.example.com/account-intelligence', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY['AWS', 'Azure'], 285, now() - interval '2 hours', 'published'),

('Acme Financial - Account Intelligence Success Story', 'Case Study', 'case_study', 'How Acme Financial reduced deal cycle time by 35% using AI-powered account intelligence. $2.4M in additional revenue attributed to early risk detection and proactive engagement.', 'https://assets.example.com/case-studies/acme-financial', ARRAY['Financial Services'], ARRAY['VP Sales', 'Sales Manager'], ARRAY['Demo', 'Proposal', 'Negotiation'], ARRAY['AWS'], 167, now() - interval '1 day', 'published'),

('Account Intelligence ROI Calculator', 'Proof', 'proof', 'Interactive calculator showing time savings, revenue impact, and efficiency gains. Based on 50+ customer deployments. Average ROI: 340% in first year.', 'https://tools.example.com/roi-account-intelligence', ARRAY['Financial Services', 'SaaS', 'Manufacturing'], ARRAY['AE', 'Sales Manager', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY['AWS', 'Azure', 'GCP'], 198, now() - interval '5 hours', 'published'),

('Account Intelligence Executive Deck', 'Deck', 'deck', '15-slide executive presentation: business value, customer proof points, implementation roadmap, and pricing overview. Perfect for C-level conversations.', 'https://decks.example.com/account-intelligence-exec', ARRAY['Financial Services', 'Healthcare', 'SaaS'], ARRAY['VP Sales', 'CRO'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 143, now() - interval '3 days', 'published'),

('Account Intelligence Demo Video (3 min)', 'Video', 'video', 'Narrated walkthrough of the Account Intelligence Copilot showing deal risk detection, automated next steps, and CRM auto-population.', 'https://videos.example.com/account-intelligence-demo', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo'], ARRAY['AWS'], 324, now() - interval '12 hours', 'published'),

('Setting Up Account Intelligence - Quick Start', 'Tutorial', 'tutorial', 'Step-by-step guide: connecting CRM, configuring risk rules, setting up alert thresholds, and training the AI on your deal patterns. 20 min setup time.', 'https://docs.example.com/account-intelligence-setup', ARRAY['Financial Services', 'SaaS'], ARRAY['AE', 'Sales Ops'], ARRAY[]::text[], ARRAY['AWS', 'Azure'], 112, now() - interval '6 days', 'published'),

('Account Intelligence Sales Play', 'Sales Play', 'sales_play', 'Complete sales methodology: discovery questions, demo flow, objection handling, and pricing conversation structure. Includes email templates and talk tracks.', 'https://playbooks.example.com/account-intelligence', ARRAY['Financial Services', 'SaaS'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY[]::text[], 89, now() - interval '4 days', 'published'),

('Account Intelligence Battle Card', 'One Pager', 'one_pager', 'Single-page overview: key features, competitive differentiators, pricing guide, and top 3 discovery questions. Perfect for quick prep before calls.', 'https://battlecards.example.com/account-intelligence', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['AE'], ARRAY['Discovery', 'Demo'], ARRAY[]::text[], 267, now() - interval '8 hours', 'published');

-- Email Drafting & Reply Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Email Copilot - Interactive Demo', 'Demo', 'concept_demo', 'Live demo of AI-generated outbound and reply emails. Shows context awareness, tone adjustment, pricing accuracy, and compliance checks in real-time.', 'https://demo.example.com/email-copilot', ARRAY['SaaS', 'Manufacturing', 'Healthcare'], ARRAY['AE', 'SDR'], ARRAY['Discovery', 'Proposal', 'Negotiation'], ARRAY[]::text[], 312, now() - interval '4 hours', 'published'),

('TechCorp - 45% Faster Email Response Time', 'Case Study', 'case_study', 'TechCorp sales team reduced email drafting time from 15 min to 8 min per email. Consistency scores improved 67%. No compliance violations in 6 months.', 'https://assets.example.com/case-studies/techcorp-email', ARRAY['SaaS', 'Technology'], ARRAY['AE', 'Sales Manager'], ARRAY['Demo', 'Proposal'], ARRAY['Azure'], 145, now() - interval '2 days', 'published'),

('Email Copilot Value Blueprint', 'Blueprint', 'blueprint', 'Technical architecture showing email copilot integration with Gmail, Outlook, CRM, and knowledge base. Includes security model and data flow diagrams.', 'https://blueprints.example.com/email-copilot', ARRAY['SaaS', 'Financial Services'], ARRAY['Sales Ops', 'IT'], ARRAY['Proposal', 'Negotiation'], ARRAY['AWS', 'Azure'], 78, now() - interval '5 days', 'published'),

('Email Copilot - Customer Testimonial', 'Testimonial', 'testimonial', '"The Email Copilot cut my email prep time in half and my responses are more consistent. I can focus on strategy instead of wordsmithing." - Sarah Chen, Enterprise AE', 'https://testimonials.example.com/email-copilot-chen', ARRAY['SaaS'], ARRAY['AE'], ARRAY['Demo'], ARRAY[]::text[], 94, now() - interval '7 days', 'published'),

('Email Template Library - 50+ Scenarios', 'Tutorial', 'tutorial', 'Comprehensive library of AI-optimized email templates: cold outreach, follow-ups, pricing discussions, objection handling, and closing. All grounded in product knowledge.', 'https://docs.example.com/email-templates', ARRAY['SaaS', 'Manufacturing', 'Healthcare'], ARRAY['AE', 'SDR'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY[]::text[], 203, now() - interval '1 day', 'published');

-- Meeting Notes → Deal Update Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Meeting Notes AI - Live Demo', 'Demo', 'concept_demo', 'Paste messy meeting notes and watch the AI extract: buying signals, stakeholder concerns, budget info, timeline, and next actions. Auto-updates CRM fields.', 'https://demo.example.com/meeting-notes-ai', ARRAY['Financial Services', 'SaaS', 'Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY[]::text[], 276, now() - interval '6 hours', 'published'),

('CloudScale - Meeting Notes Case Study', 'Case Study', 'case_study', 'CloudScale reduced CRM update time by 80% and improved forecast accuracy by 23%. Sales reps spend 4 hours less per week on admin tasks.', 'https://assets.example.com/case-studies/cloudscale-meeting', ARRAY['SaaS', 'Technology'], ARRAY['Sales Manager', 'VP Sales'], ARRAY['Demo', 'Proposal'], ARRAY['GCP'], 132, now() - interval '3 days', 'published'),

('Meeting Intelligence Demo Video (4 min)', 'Video', 'video', 'Watch the AI identify hidden buying signals, flag missing stakeholders, and suggest follow-up actions from a real discovery call transcript.', 'https://videos.example.com/meeting-intelligence', ARRAY['SaaS', 'Financial Services'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo'], ARRAY[]::text[], 189, now() - interval '18 hours', 'published'),

('Meeting Notes Best Practices Guide', 'Tutorial', 'tutorial', 'How to capture high-quality meeting notes for optimal AI extraction. Includes template structure, key phrases, and common pitfalls to avoid.', 'https://docs.example.com/meeting-notes-guide', ARRAY['SaaS', 'Manufacturing'], ARRAY['AE'], ARRAY['Discovery', 'Demo'], ARRAY[]::text[], 156, now() - interval '4 days', 'published');

-- Pipeline Risk Detector Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Pipeline Risk Detector - Interactive Demo', 'Demo', 'concept_demo', 'See how AI scans your pipeline and identifies at-risk deals based on: inactivity, missing stakeholders, pricing friction, and competitive threats. Includes prioritized action plan.', 'https://demo.example.com/pipeline-risk', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['Sales Manager', 'VP Sales'], ARRAY['Demo', 'Proposal', 'Negotiation'], ARRAY['AWS', 'Azure'], 342, now() - interval '3 hours', 'published'),

('FinServ Corp - 28% Win Rate Improvement', 'Case Study', 'case_study', 'FinServ Corp identified 15 at-risk deals in Q1, took corrective action, and saved $3.2M in pipeline. Win rates improved from 22% to 28%.', 'https://assets.example.com/case-studies/finserv-risk', ARRAY['Financial Services'], ARRAY['VP Sales', 'CRO'], ARRAY['Proposal', 'Negotiation'], ARRAY['AWS'], 178, now() - interval '1 day', 'published'),

('Pipeline Health Benchmark Report 2024', 'Proof', 'proof', 'Industry benchmark data: average deal velocity, common risk factors, win rate by stage, and best practices from top-performing teams. Based on 10,000+ deals.', 'https://reports.example.com/pipeline-health-2024', ARRAY['Financial Services', 'SaaS', 'Manufacturing'], ARRAY['VP Sales', 'CRO', 'Sales Manager'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 234, now() - interval '2 days', 'published'),

('Pipeline Risk Playbook', 'Sales Play', 'sales_play', 'Proven framework for addressing pipeline risks: 21-day inactivity protocol, stakeholder mapping strategy, competitive displacement tactics, and re-engagement templates.', 'https://playbooks.example.com/pipeline-risk', ARRAY['Financial Services', 'SaaS'], ARRAY['Sales Manager', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 167, now() - interval '5 days', 'published'),

('Pipeline Risk Quick Reference', 'One Pager', 'one_pager', 'One-page guide to risk signals: what to look for, severity scoring, and immediate actions. Laminate and keep at your desk.', 'https://battlecards.example.com/pipeline-risk', ARRAY['SaaS', 'Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 298, now() - interval '10 hours', 'published');

-- Enterprise Quote Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Enterprise Quote Copilot - Demo', 'Demo', 'concept_demo', 'AI-guided quote builder asks clarifying questions, validates configurations, checks discount approval rules, and generates a professional proposal in minutes.', 'https://demo.example.com/quote-copilot', ARRAY['Manufacturing', 'Healthcare', 'Technology'], ARRAY['AE', 'Sales Ops'], ARRAY['Proposal', 'Negotiation'], ARRAY['AWS', 'Azure', 'GCP'], 223, now() - interval '7 hours', 'published'),

('ManuTech - Quote Accuracy Improvement', 'Case Study', 'case_study', 'ManuTech eliminated 95% of quote errors and reduced quote generation time from 2 hours to 20 minutes. Customer satisfaction scores increased 31 points.', 'https://assets.example.com/case-studies/manutech-quotes', ARRAY['Manufacturing'], ARRAY['Sales Ops', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY['Azure'], 124, now() - interval '4 days', 'published'),

('Complex Quoting Architecture Blueprint', 'Blueprint', 'blueprint', 'Technical diagram showing quote copilot integration with CPQ, ERP, pricing tables, approval workflows, and e-signature platforms. Includes API specifications.', 'https://blueprints.example.com/quote-copilot', ARRAY['Manufacturing', 'Technology'], ARRAY['Sales Ops', 'IT'], ARRAY['Proposal'], ARRAY['AWS'], 67, now() - interval '8 days', 'published'),

('Quote Copilot Training Video (6 min)', 'Video', 'video', 'Complete walkthrough: creating multi-product quotes, applying volume discounts, handling custom terms, and submitting for approval. Includes tips and shortcuts.', 'https://videos.example.com/quote-training', ARRAY['Manufacturing', 'Healthcare'], ARRAY['AE', 'Sales Ops'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 145, now() - interval '2 days', 'published');

-- Customer Support → Upsell Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Support-to-Sales Copilot Demo', 'Demo', 'concept_demo', 'Analyzes support tickets to identify expansion opportunities. Generates draft handoff message to AE with usage data, customer sentiment, and suggested upsell angle.', 'https://demo.example.com/support-upsell', ARRAY['SaaS', 'Technology'], ARRAY['Customer Success', 'AE'], ARRAY['Discovery'], ARRAY['AWS'], 198, now() - interval '9 hours', 'published'),

('DataFlow - $1.2M in Upsell from Support', 'Case Study', 'case_study', 'DataFlow CS team identified 24 expansion opportunities from support interactions, resulting in $1.2M in net new ARR. 67% conversion rate on flagged accounts.', 'https://assets.example.com/case-studies/dataflow-upsell', ARRAY['SaaS'], ARRAY['VP Sales', 'VP Customer Success'], ARRAY['Discovery'], ARRAY['AWS'], 156, now() - interval '3 days', 'published'),

('Support Upsell Signals - What to Look For', 'Tutorial', 'tutorial', 'Train your CS team to spot upsell signals: usage ceiling hits, feature requests, power user behavior, and expansion questions. Includes Slack alert templates.', 'https://docs.example.com/support-upsell-signals', ARRAY['SaaS', 'Technology'], ARRAY['Customer Success', 'AE'], ARRAY['Discovery'], ARRAY[]::text[], 187, now() - interval '1 day', 'published');

-- Renewal & Expansion Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Renewal Copilot - Interactive Demo', 'Demo', 'concept_demo', 'Tracks 90-day renewal windows, analyzes usage trends and NPS scores, and recommends optimal timing and messaging for renewal + expansion conversations.', 'https://demo.example.com/renewal-copilot', ARRAY['SaaS', 'Technology'], ARRAY['AE', 'Customer Success'], ARRAY['Closed Won'], ARRAY['AWS', 'Azure'], 267, now() - interval '5 hours', 'published'),

('SaaS Co - 94% Renewal Rate with AI', 'Case Study', 'case_study', 'SaaS Co improved net retention from 87% to 112% by proactively addressing renewal risks 60 days earlier. Churn reduced by 42%.', 'https://assets.example.com/case-studies/saasco-renewal', ARRAY['SaaS'], ARRAY['VP Sales', 'VP Customer Success'], ARRAY['Closed Won'], ARRAY['GCP'], 203, now() - interval '2 days', 'published'),

('Renewal Playbook - 90-60-30 Framework', 'Sales Play', 'sales_play', 'Proven renewal methodology: 90-day health check, 60-day value review, 30-day renewal close. Includes expansion conversation scripts and objection handling.', 'https://playbooks.example.com/renewal', ARRAY['SaaS', 'Technology'], ARRAY['AE', 'Customer Success'], ARRAY['Closed Won'], ARRAY[]::text[], 178, now() - interval '6 days', 'published'),

('Renewal Risk Indicators', 'One Pager', 'one_pager', 'At-a-glance guide to renewal risk signals: usage decline thresholds, stakeholder turnover red flags, and competitive displacement indicators.', 'https://battlecards.example.com/renewal-risk', ARRAY['SaaS'], ARRAY['AE', 'Customer Success'], ARRAY['Closed Won'], ARRAY[]::text[], 234, now() - interval '14 hours', 'published');

-- Sales Manager Deal Review Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Deal Review Copilot - Manager Demo', 'Demo', 'concept_demo', 'AI-powered deal inspection tool for managers: deal health score, coaching recommendations, forecast confidence, and rep guidance. Saves 90 min per week.', 'https://demo.example.com/deal-review', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['Sales Manager', 'VP Sales'], ARRAY['Demo', 'Proposal', 'Negotiation'], ARRAY[]::text[], 289, now() - interval '4 hours', 'published'),

('RevOps Inc - Manager Productivity Case', 'Case Study', 'case_study', 'RevOps sales managers reduced deal review time by 70% while improving forecast accuracy by 18%. Reps receive higher quality, more actionable coaching.', 'https://assets.example.com/case-studies/revops-manager', ARRAY['SaaS'], ARRAY['VP Sales'], ARRAY['Demo', 'Proposal'], ARRAY['AWS'], 167, now() - interval '5 days', 'published'),

('Deal Review Coaching Framework', 'Tutorial', 'tutorial', 'Complete guide to effective deal reviews: asking the right questions, using AI insights, delivering coaching, and tracking improvement over time.', 'https://docs.example.com/deal-review-coaching', ARRAY['SaaS', 'Financial Services'], ARRAY['Sales Manager', 'VP Sales'], ARRAY[]::text[], ARRAY[]::text[], 143, now() - interval '3 days', 'published');

-- Account-Based Sales Planning Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Account Planning Copilot - Demo', 'Demo', 'concept_demo', 'Auto-generates strategic account plans: key personas, pain points, messaging angles, multi-threading strategy, and 90-day engagement roadmap based on similar wins.', 'https://demo.example.com/account-planning', ARRAY['Financial Services', 'Healthcare', 'Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo'], ARRAY['AWS', 'Azure', 'GCP'], 245, now() - interval '8 hours', 'published'),

('Enterprise Co - Strategic Account Success', 'Case Study', 'case_study', 'Enterprise Co landed 3 strategic accounts worth $8M using AI-generated account plans. Average sales cycle reduced from 14 months to 9 months.', 'https://assets.example.com/case-studies/enterprise-accounts', ARRAY['Financial Services', 'Healthcare'], ARRAY['VP Sales', 'Sales Manager'], ARRAY['Discovery', 'Demo'], ARRAY['AWS'], 189, now() - interval '2 days', 'published'),

('Strategic Account Planning Template', 'Tutorial', 'tutorial', 'Step-by-step guide to building winning account plans: research checklist, persona mapping, value hypothesis, and stakeholder engagement strategy.', 'https://docs.example.com/account-planning-template', ARRAY['Financial Services', 'Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery'], ARRAY[]::text[], 212, now() - interval '1 day', 'published'),

('Account Planning Executive Deck', 'Deck', 'deck', '12-slide presentation on the strategic account planning methodology, ROI proof points, and implementation approach. Ideal for sales kickoffs.', 'https://decks.example.com/account-planning', ARRAY['Financial Services', 'Healthcare'], ARRAY['VP Sales', 'CRO'], ARRAY[]::text[], ARRAY[]::text[], 134, now() - interval '7 days', 'published');

-- Competitive Objection Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Competitive Response Copilot Demo', 'Demo', 'concept_demo', 'Ask "How do we compete against [Competitor X]?" and get instant: feature comparison, positioning language, customer proof points, and objection handling scripts.', 'https://demo.example.com/competitive', ARRAY['SaaS', 'Technology'], ARRAY['AE', 'Sales Manager'], ARRAY['Demo', 'Proposal', 'Negotiation'], ARRAY[]::text[], 356, now() - interval '2 hours', 'published'),

('Competitive Battle Cards - Top 5 Rivals', 'One Pager', 'one_pager', 'Quick reference cards for top 5 competitors: their strengths, weaknesses, pricing, and proven displacement strategies. Updated quarterly.', 'https://battlecards.example.com/top-competitors', ARRAY['SaaS', 'Technology'], ARRAY['AE'], ARRAY['Demo', 'Proposal', 'Negotiation'], ARRAY[]::text[], 423, now() - interval '1 hour', 'published'),

('Competitive Displacement Playbook', 'Sales Play', 'sales_play', 'Proven methodology for displacing entrenched competitors: discovery questions that expose gaps, demo strategies, pricing positioning, and migration risk mitigation.', 'https://playbooks.example.com/competitive-displacement', ARRAY['SaaS', 'Technology'], ARRAY['AE', 'Sales Manager'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 278, now() - interval '6 hours', 'published'),

('Win Against Competitor X - Video', 'Video', 'video', '8-minute video: how we won 5 competitive deals against Competitor X last quarter. Includes actual customer quotes and decision criteria analysis.', 'https://videos.example.com/competitive-wins', ARRAY['SaaS'], ARRAY['AE'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 312, now() - interval '15 hours', 'published');

-- Sales Knowledge Search Copilot Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Knowledge Search Copilot - Demo', 'Demo', 'concept_demo', 'Conversational search across case studies, demos, pricing rules, and battle cards. Ask questions in plain English and get instant, contextual answers with source links.', 'https://demo.example.com/knowledge-search', ARRAY['SaaS', 'Financial Services', 'Healthcare'], ARRAY['AE', 'SDR'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY[]::text[], 398, now() - interval '3 hours', 'published'),

('KnowledgeBase Inc - Time Savings Study', 'Case Study', 'case_study', 'Sales reps reduced content search time from 25 min to 2 min per deal. 89% of reps say they find more relevant content. Onboarding time cut by 40%.', 'https://assets.example.com/case-studies/knowledge-search', ARRAY['SaaS'], ARRAY['VP Sales', 'Sales Enablement'], ARRAY[]::text[], ARRAY['AWS'], 167, now() - interval '4 days', 'published'),

('Building an AI Knowledge Base', 'Tutorial', 'tutorial', 'Complete implementation guide: content ingestion, metadata tagging, search optimization, and user training. Includes best practices from 30+ deployments.', 'https://docs.example.com/knowledge-base-setup', ARRAY['SaaS', 'Technology'], ARRAY['Sales Enablement', 'Sales Ops'], ARRAY[]::text[], ARRAY['AWS', 'Azure'], 145, now() - interval '5 days', 'published');

-- Additional High-Value Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Sales AI Platform - Complete Overview Deck', 'Deck', 'deck', '25-slide master deck covering all copilots, integration architecture, security & compliance, pricing, and customer results. Your go-to resource for any sales conversation.', 'https://decks.example.com/platform-overview', ARRAY['Financial Services', 'SaaS', 'Healthcare', 'Manufacturing'], ARRAY['VP Sales', 'CRO', 'AE'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY['AWS', 'Azure', 'GCP'], 412, now() - interval '90 minutes', 'published'),

('ROI Framework - Sales AI Investment', 'Proof', 'proof', 'Comprehensive TCO and ROI analysis framework. Quantify: time savings, revenue impact, efficiency gains, and risk reduction. Includes sensitivity analysis and payback calculator.', 'https://tools.example.com/roi-framework', ARRAY['Financial Services', 'SaaS', 'Manufacturing'], ARRAY['VP Sales', 'CRO'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 267, now() - interval '16 hours', 'published'),

('Gartner Report: AI in Sales Enablement', 'Proof', 'proof', 'Third-party validation: Gartner research report on AI adoption in sales. Market sizing, vendor evaluation criteria, and implementation best practices.', 'https://reports.example.com/gartner-sales-ai', ARRAY['Financial Services', 'SaaS', 'Healthcare'], ARRAY['CRO', 'VP Sales'], ARRAY['Discovery', 'Demo'], ARRAY[]::text[], 234, now() - interval '1 day', 'published'),

('Forrester TEI Study - 340% ROI', 'Proof', 'proof', 'Forrester Total Economic Impact study: $2.8M NPV over 3 years, 340% ROI, 8-month payback. Based on composite organization analysis.', 'https://reports.example.com/forrester-tei', ARRAY['Financial Services', 'SaaS'], ARRAY['CRO', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 298, now() - interval '12 hours', 'published'),

('Security & Compliance Overview', 'Deck', 'deck', '10-slide deck covering: SOC 2 Type II, GDPR compliance, data residency options, encryption standards, and access controls. Perfect for security reviews.', 'https://decks.example.com/security-compliance', ARRAY['Financial Services', 'Healthcare'], ARRAY['IT', 'CISO', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY['AWS', 'Azure'], 178, now() - interval '2 days', 'published'),

('Implementation Roadmap - 30-60-90 Days', 'Blueprint', 'blueprint', 'Detailed implementation timeline: discovery (week 1-2), configuration (week 3-4), pilot (week 5-6), rollout (week 7-8), and optimization (ongoing).', 'https://blueprints.example.com/implementation', ARRAY['SaaS', 'Financial Services'], ARRAY['Sales Ops', 'IT'], ARRAY['Proposal'], ARRAY['AWS'], 156, now() - interval '3 days', 'published'),

('Integration Architecture Guide', 'Blueprint', 'blueprint', 'Technical reference: API documentation, CRM connectors (Salesforce, HubSpot, Dynamics), SSO setup, webhook configuration, and data sync patterns.', 'https://blueprints.example.com/integrations', ARRAY['SaaS', 'Technology'], ARRAY['IT', 'Sales Ops'], ARRAY['Proposal'], ARRAY['AWS', 'Azure', 'GCP'], 134, now() - interval '6 days', 'published'),

('Customer Reference: Global Bank Success', 'Testimonial', 'testimonial', '"We deployed Sales AI across 500 reps and saw immediate impact. Deal velocity up 25%, forecast accuracy improved 15%, and reps love it." - Chief Sales Officer, Fortune 500 Bank', 'https://testimonials.example.com/global-bank', ARRAY['Financial Services'], ARRAY['CRO', 'VP Sales'], ARRAY['Demo', 'Proposal'], ARRAY['AWS'], 245, now() - interval '18 hours', 'published'),

('Customer Reference: HealthTech Leader', 'Testimonial', 'testimonial', '"The AI copilots have become essential tools for our team. We closed 30% more deals last quarter and our new reps ramp 50% faster." - VP Sales, HealthTech Unicorn', 'https://testimonials.example.com/healthtech', ARRAY['Healthcare'], ARRAY['VP Sales'], ARRAY['Demo', 'Proposal'], ARRAY['Azure'], 189, now() - interval '1 day', 'published'),

('Pricing & Packaging Guide', 'One Pager', 'one_pager', 'Clear pricing overview: edition comparison (Pro, Enterprise, Ultimate), per-seat pricing, volume discounts, and add-on modules. Includes discount approval matrix.', 'https://battlecards.example.com/pricing', ARRAY['SaaS', 'Financial Services', 'Healthcare'], ARRAY['AE', 'Sales Manager'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 378, now() - interval '5 hours', 'published'),

('Objection Handling Guide', 'Sales Play', 'sales_play', 'Comprehensive guide to handling top 20 objections: budget concerns, change management, ROI skepticism, competitive pressure, and implementation complexity.', 'https://playbooks.example.com/objections', ARRAY['SaaS', 'Financial Services'], ARRAY['AE'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 312, now() - interval '9 hours', 'published'),

('Discovery Questions Framework', 'Tutorial', 'tutorial', '50 proven discovery questions organized by: business challenges, current state, stakeholders, decision process, success criteria, and budget/timeline.', 'https://docs.example.com/discovery-questions', ARRAY['SaaS', 'Financial Services', 'Healthcare'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery'], ARRAY[]::text[], 267, now() - interval '16 hours', 'published'),

('Demo Best Practices', 'Tutorial', 'tutorial', 'How to deliver compelling demos: pre-demo discovery, agenda setting, interactive techniques, handling questions, and effective follow-up strategies.', 'https://docs.example.com/demo-best-practices', ARRAY['SaaS', 'Technology'], ARRAY['AE'], ARRAY['Demo'], ARRAY[]::text[], 234, now() - interval '2 days', 'published'),

('Value-Based Selling Framework', 'Sales Play', 'sales_play', 'Complete methodology for value-based conversations: quantifying business impact, building business cases, executive storytelling, and ROI justification.', 'https://playbooks.example.com/value-selling', ARRAY['Financial Services', 'Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Proposal'], ARRAY[]::text[], 198, now() - interval '3 days', 'published'),

('Champion Building Strategy', 'Tutorial', 'tutorial', 'Tactical guide to identifying, cultivating, and leveraging internal champions. Includes: champion scorecard, enablement materials, and mobilization tactics.', 'https://docs.example.com/champion-building', ARRAY['SaaS', 'Financial Services'], ARRAY['AE', 'Sales Manager'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 178, now() - interval '4 days', 'published');

-- Industry-Specific Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Financial Services Industry Deck', 'Deck', 'deck', '18-slide industry-specific presentation: regulatory compliance, security requirements, integration with banking systems, and customer success stories from banks and insurers.', 'https://decks.example.com/financial-services', ARRAY['Financial Services'], ARRAY['AE', 'VP Sales'], ARRAY['Discovery', 'Demo'], ARRAY['AWS'], 223, now() - interval '14 hours', 'published'),

('Healthcare & Life Sciences Solution Brief', 'One Pager', 'one_pager', 'Healthcare-specific overview: HIPAA compliance, EHR integrations, clinical trial support, and case studies from hospital systems and pharma companies.', 'https://battlecards.example.com/healthcare', ARRAY['Healthcare'], ARRAY['AE'], ARRAY['Discovery', 'Demo'], ARRAY['Azure'], 189, now() - interval '1 day', 'published'),

('Manufacturing Industry Playbook', 'Sales Play', 'sales_play', 'Complete sales approach for manufacturers: understanding industrial sales cycles, multi-site deployments, supply chain integration, and ROI justification.', 'https://playbooks.example.com/manufacturing', ARRAY['Manufacturing'], ARRAY['AE', 'Sales Manager'], ARRAY['Discovery', 'Demo', 'Proposal'], ARRAY[]::text[], 156, now() - interval '5 days', 'published');

-- Persona-Specific Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('Selling to the CFO - Executive Guide', 'Tutorial', 'tutorial', 'How to position sales AI to financial buyers: TCO analysis, cash flow impact, budget justification, and CFO-friendly business case templates.', 'https://docs.example.com/selling-to-cfo', ARRAY['Financial Services', 'SaaS'], ARRAY['AE', 'VP Sales'], ARRAY['Proposal', 'Negotiation'], ARRAY[]::text[], 201, now() - interval '2 days', 'published'),

('CRO Conversation Deck', 'Deck', 'deck', '8-slide executive summary for CROs: strategic value, competitive advantage, revenue impact, and transformation roadmap. No technical details.', 'https://decks.example.com/cro-conversation', ARRAY['SaaS', 'Financial Services'], ARRAY['CRO'], ARRAY['Discovery', 'Demo'], ARRAY[]::text[], 167, now() - interval '3 days', 'published'),

('IT Buyer Technical Deep Dive', 'Blueprint', 'blueprint', 'Technical architecture for IT evaluation: system requirements, integration patterns, security architecture, scalability considerations, and support model.', 'https://blueprints.example.com/technical-deepdive', ARRAY['SaaS', 'Financial Services'], ARRAY['IT', 'CISO'], ARRAY['Proposal'], ARRAY['AWS', 'Azure'], 112, now() - interval '7 days', 'published');

-- Quick Win Assets
INSERT INTO assets (title, type, category, description, url, industry_tags, persona_tags, stage_tags, cloud_tags, view_count, last_accessed_at, status) VALUES
('5-Minute Platform Overview Video', 'Video', 'video', 'Quick overview of the complete sales AI platform: all copilots, key benefits, and customer results. Perfect for initial outreach and follow-ups.', 'https://videos.example.com/5min-overview', ARRAY['SaaS', 'Financial Services', 'Healthcare'], ARRAY['AE', 'VP Sales'], ARRAY['Discovery'], ARRAY[]::text[], 445, now() - interval '45 minutes', 'published'),

('Customer Success Montage Video', 'Video', 'video', '3-minute compilation of customer testimonials, results metrics, and before/after comparisons. Emotional and data-driven.', 'https://videos.example.com/customer-montage', ARRAY['SaaS', 'Financial Services'], ARRAY['AE', 'VP Sales'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 367, now() - interval '6 hours', 'published'),

('First Call Deck - 10 Slides', 'Deck', 'deck', 'Perfect for first meetings: company overview, problem statement, solution overview, customer proof, and next steps. Designed for 20-minute conversations.', 'https://decks.example.com/first-call', ARRAY['SaaS', 'Financial Services', 'Healthcare'], ARRAY['AE', 'SDR'], ARRAY['Discovery'], ARRAY[]::text[], 389, now() - interval '4 hours', 'published'),

('Leave-Behind One-Pager', 'One Pager', 'one_pager', 'Professional one-page summary to leave after meetings: value prop, key differentiators, customer logos, and contact info. Print-ready PDF.', 'https://battlecards.example.com/leave-behind', ARRAY['SaaS', 'Financial Services'], ARRAY['AE'], ARRAY['Demo', 'Proposal'], ARRAY[]::text[], 412, now() - interval '8 hours', 'published'),

('Sales AI Quick Wins Guide', 'Tutorial', 'tutorial', 'Get value in 30 days: quick setup guide, pilot program design, early win identification, and momentum-building strategies.', 'https://docs.example.com/quick-wins', ARRAY['SaaS'], ARRAY['Sales Ops', 'AE'], ARRAY['Proposal'], ARRAY[]::text[], 198, now() - interval '2 days', 'published');
