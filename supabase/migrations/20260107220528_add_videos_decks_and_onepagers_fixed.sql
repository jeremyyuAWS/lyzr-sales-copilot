/*
  # Add Videos, Decks, One-Pagers, and Sales Plays

  1. Adds
    - Video assets with rich metadata
    - Deck assets
    - One-pager assets
    - Sales play assets
    
  2. All include
    - Complete usage guidance
    - Positioning angles
    - Next steps
    - Usage signals
*/

-- Insert curated videos
INSERT INTO assets (
  id, title, type, category, description, url,
  industry_tags, persona_tags, stage_tags, cloud_tags,
  status, view_count, last_accessed_at, created_by,
  when_to_use, positioning_angle, common_next_steps,
  best_for_stages, best_for_personas, what_it_is_not,
  momentum_indicator, typical_placement
) VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'Customer Testimonial: Global Bank CIO (3 min)',
    'Video',
    'video',
    'CIO of top-10 global bank shares their AI transformation journey with Lyzr: challenges, implementation, and results.',
    'https://lyzr.ai/videos/bank-cio-testimonial',
    ARRAY['Banking', 'Financial Services'],
    ARRAY['CIO', 'CTO', 'VP Engineering'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['Azure', 'Multi-Cloud'],
    'published',
    923,
    now() - interval '3 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Banking or financial services prospect\n• Need C-level peer validation\n• Late-stage deal needs executive buy-in\n• Customer asks "has anyone like us done this?"',
    'Let the CIO tell the story - their credibility sells itself. 3-minute length is perfect for busy executives. Position as "peer to peer" validation, not vendor marketing.',
    ARRAY['Executive sponsor introduction', 'Reference call offer', 'Financial services case study', 'Security documentation review'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['CIO', 'CTO', 'CEO'],
    E'**Good for:** Enterprise financial services, C-level validation, late-stage deals\n**Not ideal for:** Non-finance prospects, early discovery, technical evaluation',
    'Very High - 85% of banking deals use this',
    'Late stage when executive validation needed'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'Product Walkthrough: AI Agent Builder (5 min)',
    'Video',
    'video',
    'Step-by-step guide to building custom AI agents: no-code interface, testing tools, and deployment process.',
    'https://lyzr.ai/videos/agent-builder-walkthrough',
    ARRAY['SaaS', 'Technology', 'Enterprise'],
    ARRAY['Product Manager', 'Technical Lead', 'VP Product'],
    ARRAY['Demo', 'Technical Validation'],
    ARRAY['AWS', 'Azure', 'GCP'],
    'published',
    671,
    now() - interval '1 day',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Technical evaluation phase\n• Product team wants self-service\n• "How hard is this to customize?" question\n• Between demo and POC phase',
    'Emphasize no-code approach first, then show power features for developers. Position as "business user friendly with developer escape hatches." Highlight iteration speed.',
    ARRAY['Hands-on workshop session', 'POC environment setup', 'Custom agent building session', 'Technical architecture review'],
    ARRAY['Demo', 'Technical Validation'],
    ARRAY['Product Manager', 'Technical Lead'],
    E'**Good for:** Technical evaluation, customization discussions, POC prep\n**Not ideal for:** Executive audiences, pricing discussions, non-technical stakeholders',
    'High - 75% request hands-on workshop',
    'Between demo and POC'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'ROI Calculator Explanation Video (4 min)',
    'Video',
    'video',
    'CFO-friendly breakdown of AI automation ROI: cost savings, efficiency gains, revenue impact, and payback period calculation.',
    'https://lyzr.ai/videos/roi-calculator',
    ARRAY['SaaS', 'Enterprise', 'Technology'],
    ARRAY['CFO', 'Finance Director', 'Procurement'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['Multi-Cloud'],
    'published',
    445,
    now() - interval '5 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• CFO or finance involved in deal\n• Budget justification needed\n• "Show me the numbers" request\n• Procurement approval phase',
    'Lead with conservative assumptions to build credibility. Walk through each cost component clearly. End with sensitivity analysis showing ROI even in worst-case scenarios.',
    ARRAY['Custom ROI model for their business', 'CFO presentation', 'Budget planning session', 'Financial approval documentation'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['CFO', 'Finance Director', 'Procurement'],
    E'**Good for:** Financial justification, CFO engagement, budget approval\n**Not ideal for:** Early discovery, technical audiences, non-financial stakeholders',
    'High - 80% proceed to custom ROI modeling',
    'When budget/ROI questions arise'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'Security & Compliance Overview (6 min)',
    'Video',
    'video',
    'Comprehensive overview of Lyzr security architecture: SOC 2, ISO 27001, HIPAA compliance, data encryption, and audit capabilities.',
    'https://lyzr.ai/videos/security-compliance',
    ARRAY['Healthcare', 'Financial Services', 'Enterprise'],
    ARRAY['CISO', 'Security Director', 'Compliance Officer'],
    ARRAY['Technical Validation', 'Proposal'],
    ARRAY['Azure', 'AWS'],
    'published',
    589,
    now() - interval '2 days',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Security review phase\n• CISO involvement\n• Compliance concerns raised\n• Security questionnaire in progress',
    'Position Lyzr as "security by design not bolt-on." Emphasize enterprise-grade controls and successful audits. Use specific compliance certifications as proof points.',
    ARRAY['Security documentation package', 'CISO meeting', 'Penetration test results', 'Compliance audit reports'],
    ARRAY['Technical Validation', 'Proposal'],
    ARRAY['CISO', 'Security Director', 'Compliance Officer'],
    E'**Good for:** Security validation, regulated industries, enterprise deals\n**Not ideal for:** SMB deals, early discovery, non-technical audiences',
    'Very High - Critical for security approval',
    'During security review phase'
  );

-- Insert curated decks (using 'c' prefix for decks)
INSERT INTO assets (
  id, title, type, category, description, url,
  industry_tags, persona_tags, stage_tags, cloud_tags,
  status, view_count, last_accessed_at, created_by,
  when_to_use, positioning_angle, common_next_steps,
  best_for_stages, best_for_personas, what_it_is_not,
  momentum_indicator, typical_placement
) VALUES
  (
    'c1111111-1111-1111-1111-111111111111',
    'Executive Business Review Deck',
    'Deck',
    'deck',
    'C-suite focused presentation: market trends, business value, customer success stories, and implementation roadmap.',
    'https://lyzr.ai/decks/executive-business-review',
    ARRAY['SaaS', 'Enterprise', 'Technology'],
    ARRAY['CEO', 'CFO', 'COO'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['Multi-Cloud'],
    'published',
    512,
    now() - interval '6 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Executive sponsor meeting scheduled\n• Board-level presentation needed\n• Strategic initiative positioning\n• Final approval stage',
    'Keep it high-level and business-focused. Lead with market context, not features. Use peer company logos prominently. End with clear business outcomes and timeline.',
    ARRAY['Executive Q&A session', 'Board presentation support', 'Strategic planning workshop', 'Contract negotiation'],
    ARRAY['Proposal', 'Negotiation'],
    ARRAY['CEO', 'CFO', 'COO'],
    E'**Good for:** C-suite engagement, strategic discussions, final approvals\n**Not ideal for:** Technical audiences, early discovery, detailed feature discussions',
    'Very High - Often final step before signature',
    'Executive approval stage'
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'Technical Architecture Deep Dive',
    'Deck',
    'deck',
    'Detailed technical presentation: system architecture, integration patterns, scalability, security controls, and API documentation.',
    'https://lyzr.ai/decks/technical-architecture',
    ARRAY['SaaS', 'Technology', 'Enterprise'],
    ARRAY['CTO', 'VP Engineering', 'Solutions Architect'],
    ARRAY['Technical Validation', 'Demo'],
    ARRAY['AWS', 'Azure', 'GCP'],
    'published',
    634,
    now() - interval '12 hours',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Technical evaluation deep dive\n• Architecture review scheduled\n• CTO or VP Engineering meeting\n• Integration planning needed',
    'Start with high-level architecture diagram, then drill into specifics. Emphasize cloud-native design and API-first approach. Address scalability and security proactively.',
    ARRAY['Hands-on technical workshop', 'Integration planning session', 'POC scoping', 'Security architecture review'],
    ARRAY['Technical Validation', 'Demo'],
    ARRAY['CTO', 'VP Engineering', 'Solutions Architect'],
    E'**Good for:** Technical validation, architecture discussions, integration planning\n**Not ideal for:** Executive audiences, non-technical stakeholders, early discovery',
    'High - 80% proceed to POC after this',
    'Technical validation phase'
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'AI Strategy & Roadmap Workshop Deck',
    'Deck',
    'deck',
    'Interactive workshop materials for AI strategy planning: current state assessment, use case prioritization, and phased implementation roadmap.',
    'https://lyzr.ai/decks/ai-strategy-workshop',
    ARRAY['Enterprise', 'Technology'],
    ARRAY['CIO', 'VP Digital Transformation', 'VP Product'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['Multi-Cloud'],
    'published',
    378,
    now() - interval '4 days',
    '11111111-1111-1111-1111-111111111111',
    E'**Best used when:**\n• Customer building AI strategy\n• Multiple use cases being considered\n• Needs help prioritizing initiatives\n• Early strategic partnership discussions',
    'Position as strategic advisor, not just vendor. Help them think through their AI roadmap. Use framework to demonstrate thought leadership. Creates multi-year relationship opportunity.',
    ARRAY['Follow-up strategy workshop', 'Use case prioritization', 'Multi-phase proposal', 'Strategic partnership discussion'],
    ARRAY['Discovery', 'Demo'],
    ARRAY['CIO', 'VP Digital Transformation'],
    E'**Good for:** Strategic engagements, enterprise transformations, multi-use case deals\n**Not ideal for:** Single-use case deals, tactical projects, price-driven buyers',
    'Medium-High - 70% expand scope after workshop',
    'Early strategic discussions'
  );

-- Continue with one-pagers and sales plays in next migration...
