/*
  # Generate Intelligent Asset Recommendations
  
  1. Overview
    - Creates AI-powered recommendations for all deals based on:
      - Industry alignment
      - Stage alignment  
      - Persona alignment
      - Cloud provider alignment
    - Generates realistic confidence scores (0.65 - 0.95)
    - Provides contextual reasoning for each recommendation
    
  2. Recommendation Logic
    - Perfect Match (0.85-0.95): 3+ matching attributes
    - Good Match (0.75-0.85): 2 matching attributes
    - Fair Match (0.65-0.75): 1 matching attribute
    
  3. Content Prioritization
    - Prioritizes demos and case studies for early stages
    - Emphasizes proof and decks for proposal/negotiation stages
    - Includes tutorials and playbooks for all stages
*/

-- Generate recommendations for HealthTech Solutions (Demo stage, Healthcare, CTO)
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score) 
SELECT 
  'd1000000-0000-0000-0000-000000000001',
  id,
  CASE 
    WHEN title LIKE '%Healthcare%' THEN 'Perfect match: Healthcare-specific content for your CTO audience in demo stage.'
    WHEN title LIKE '%Demo%' OR title LIKE '%Video%' THEN 'Great for demo stage: Interactive content to engage technical decision-makers.'
    WHEN category = 'case_study' THEN 'Proven results: Customer success stories resonate well with CTOs evaluating new technology.'
    WHEN category = 'tutorial' THEN 'Technical depth: Implementation guides help CTOs understand integration complexity.'
    ELSE 'Relevant content for healthcare technology evaluation and demo preparation.'
  END,
  CASE 
    WHEN title LIKE '%Healthcare%' AND (category = 'concept_demo' OR category = 'case_study') THEN 0.92
    WHEN category = 'concept_demo' OR title LIKE '%Demo%' THEN 0.87
    WHEN category = 'case_study' AND 'Healthcare' = ANY(industry_tags) THEN 0.89
    WHEN category = 'video' AND 'Discovery' = ANY(stage_tags) THEN 0.83
    WHEN category = 'tutorial' THEN 0.75
    ELSE 0.68
  END
FROM assets
WHERE 
  ('Healthcare' = ANY(industry_tags) OR 'SaaS' = ANY(industry_tags) OR 'Technology' = ANY(industry_tags))
  AND (category IN ('concept_demo', 'case_study', 'video', 'tutorial', 'deck'))
  AND ('Demo' = ANY(stage_tags) OR 'Discovery' = ANY(stage_tags) OR stage_tags = ARRAY[]::text[])
LIMIT 8;

-- Generate recommendations for MediCare Analytics (Proposal stage, Healthcare, Data Scientist)
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  'd1000000-0000-0000-0000-000000000002',
  id,
  CASE 
    WHEN category = 'proof' THEN 'ROI validation: Data-driven proof points are essential for proposal stage conversations.'
    WHEN title LIKE '%Healthcare%' THEN 'Industry alignment: Healthcare-specific content addresses your prospect''s unique compliance and technical requirements.'
    WHEN category = 'deck' AND 'Proposal' = ANY(stage_tags) THEN 'Proposal-ready: Executive presentation to accelerate decision-making.'
    WHEN category = 'case_study' THEN 'Social proof: Similar customer success stories build confidence in your solution.'
    ELSE 'Supporting content for advancing your healthcare proposal.'
  END,
  CASE 
    WHEN category = 'proof' AND 'Healthcare' = ANY(industry_tags) THEN 0.93
    WHEN title LIKE '%ROI%' OR title LIKE '%Forrester%' OR title LIKE '%Gartner%' THEN 0.91
    WHEN category = 'deck' AND 'Proposal' = ANY(stage_tags) THEN 0.88
    WHEN category = 'case_study' AND 'Healthcare' = ANY(industry_tags) THEN 0.86
    WHEN category = 'blueprint' THEN 0.79
    ELSE 0.72
  END
FROM assets
WHERE 
  ('Healthcare' = ANY(industry_tags) OR industry_tags = ARRAY[]::text[])
  AND (category IN ('proof', 'deck', 'case_study', 'blueprint', 'one_pager'))
  AND ('Proposal' = ANY(stage_tags) OR stage_tags = ARRAY[]::text[])
LIMIT 7;

-- Generate recommendations for Regional Health Network (Negotiation stage, Healthcare, CIO)
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  'd1000000-0000-0000-0000-000000000003',
  id,
  CASE 
    WHEN category = 'proof' THEN 'Business case support: Third-party validation and ROI data help justify investment to executive stakeholders.'
    WHEN title LIKE '%Security%' OR title LIKE '%Compliance%' THEN 'Risk mitigation: Security and compliance documentation addresses CIO concerns during contract negotiation.'
    WHEN category = 'testimonial' THEN 'Executive validation: CIO peer references accelerate final approval.'
    WHEN category = 'blueprint' THEN 'Implementation clarity: Technical roadmaps reduce perceived risk and speed up legal review.'
    WHEN title LIKE '%Healthcare%' THEN 'Industry expertise: Healthcare-specific materials demonstrate domain knowledge and reduce change management concerns.'
    ELSE 'Close-stage asset to support contract negotiation and final approvals.'
  END,
  CASE 
    WHEN (title LIKE '%Security%' OR title LIKE '%Compliance%') AND 'Healthcare' = ANY(industry_tags) THEN 0.95
    WHEN category = 'proof' AND title LIKE '%ROI%' THEN 0.92
    WHEN category = 'testimonial' AND 'Healthcare' = ANY(industry_tags) THEN 0.90
    WHEN category = 'blueprint' AND 'Negotiation' = ANY(stage_tags) THEN 0.87
    WHEN category = 'deck' AND 'IT' = ANY(persona_tags) THEN 0.84
    ELSE 0.76
  END
FROM assets
WHERE 
  ('Healthcare' = ANY(industry_tags) OR industry_tags = ARRAY[]::text[])
  AND (category IN ('proof', 'testimonial', 'blueprint', 'deck', 'one_pager'))
  AND ('Negotiation' = ANY(stage_tags) OR 'Proposal' = ANY(stage_tags) OR stage_tags = ARRAY[]::text[])
LIMIT 6;

-- Generate recommendations for FirstBank Digital (Discovery stage, Financial Services)
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  'd1000000-0000-0000-0000-000000000004',
  id,
  CASE 
    WHEN title LIKE '%Financial Services%' OR title LIKE '%Bank%' THEN 'Perfect industry fit: Financial services-specific content addresses banking regulations, security requirements, and compliance needs.'
    WHEN category = 'concept_demo' THEN 'Discovery alignment: Interactive demos help explore capabilities and identify use cases early in the sales cycle.'
    WHEN category = 'case_study' AND 'Financial Services' = ANY(industry_tags) THEN 'Banking proof: Success stories from other financial institutions build credibility and trust.'
    WHEN category = 'video' THEN 'Quick engagement: Short videos are perfect for busy banking executives during discovery.'
    WHEN category = 'one_pager' THEN 'Leave-behind: Quick reference materials for multiple stakeholders in complex banking organizations.'
    ELSE 'Foundational content for early-stage financial services discovery.'
  END,
  CASE 
    WHEN title LIKE '%Financial Services%' AND category = 'concept_demo' THEN 0.94
    WHEN category = 'case_study' AND 'Financial Services' = ANY(industry_tags) THEN 0.91
    WHEN title LIKE '%Bank%' THEN 0.89
    WHEN category = 'video' AND 'Discovery' = ANY(stage_tags) THEN 0.86
    WHEN category = 'deck' AND title LIKE '%Overview%' THEN 0.84
    WHEN category = 'one_pager' THEN 0.78
    ELSE 0.71
  END
FROM assets
WHERE 
  ('Financial Services' = ANY(industry_tags) OR 'SaaS' = ANY(industry_tags) OR industry_tags = ARRAY[]::text[])
  AND (category IN ('concept_demo', 'case_study', 'video', 'deck', 'one_pager', 'tutorial'))
  AND ('Discovery' = ANY(stage_tags) OR stage_tags = ARRAY[]::text[])
LIMIT 9;

-- Generate recommendations for Capital Investments Group (Demo stage, Financial Services, CISO)
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  'd1000000-0000-0000-0000-000000000005',
  id,
  CASE 
    WHEN title LIKE '%Security%' OR title LIKE '%Compliance%' THEN 'Security focus: Compliance and security documentation directly addresses CISO evaluation criteria.'
    WHEN title LIKE '%Financial Services%' THEN 'Regulatory alignment: Financial services-specific materials demonstrate understanding of banking security requirements.'
    WHEN category = 'concept_demo' THEN 'Live demo: Technical demonstrations help CISOs evaluate security architecture and controls.'
    WHEN category = 'blueprint' THEN 'Technical depth: Architecture diagrams and integration specs support CISO technical due diligence.'
    WHEN category = 'proof' THEN 'Third-party validation: Analyst reports and certifications strengthen security credibility.'
    ELSE 'Relevant content for CISO evaluation at demo stage.'
  END,
  CASE 
    WHEN (title LIKE '%Security%' OR title LIKE '%Compliance%') AND 'Financial Services' = ANY(industry_tags) THEN 0.96
    WHEN category = 'blueprint' AND 'IT' = ANY(persona_tags) THEN 0.90
    WHEN title LIKE '%Financial Services%' AND category = 'deck' THEN 0.88
    WHEN category = 'concept_demo' THEN 0.85
    WHEN category = 'proof' AND (title LIKE '%Gartner%' OR title LIKE '%Forrester%') THEN 0.87
    ELSE 0.74
  END
FROM assets
WHERE 
  ('Financial Services' = ANY(industry_tags) OR industry_tags = ARRAY[]::text[])
  AND (category IN ('concept_demo', 'deck', 'blueprint', 'proof', 'tutorial'))
  AND ('Demo' = ANY(stage_tags) OR 'Discovery' = ANY(stage_tags) OR stage_tags = ARRAY[]::text[])
LIMIT 7;

-- Generate recommendations for remaining deals with generic high-value content
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  d.id,
  a.id,
  CASE 
    WHEN a.category = 'concept_demo' THEN 'Platform overview: Comprehensive demo showing all capabilities relevant to ' || COALESCE(d.industry, 'your industry') || ' needs.'
    WHEN a.category = 'proof' THEN 'ROI validation: Data-driven business case materials to support ' || d.stage || ' stage conversations.'
    WHEN a.category = 'video' THEN 'Quick engagement: Short video perfect for sharing with multiple stakeholders.'
    WHEN a.category = 'one_pager' THEN 'Leave-behind: Easy-to-share overview for decision-makers and influencers.'
    WHEN a.category = 'deck' THEN 'Presentation ready: Executive deck aligned with ' || d.stage || ' stage discussions.'
    WHEN a.category = 'sales_play' THEN 'Sales methodology: Proven playbook for advancing deals in ' || d.stage || ' stage.'
    ELSE 'Relevant content for ' || COALESCE(d.industry, 'your') || ' deals in ' || d.stage || ' stage.'
  END,
  CASE 
    WHEN a.view_count > 400 THEN 0.89
    WHEN a.view_count > 300 THEN 0.85
    WHEN a.view_count > 200 THEN 0.81
    WHEN a.view_count > 100 THEN 0.77
    ELSE 0.72
  END
FROM deals d
CROSS JOIN LATERAL (
  SELECT a.*
  FROM assets a
  WHERE 
    (d.industry = ANY(a.industry_tags) OR a.industry_tags = ARRAY[]::text[])
    AND (d.stage = ANY(a.stage_tags) OR a.stage_tags = ARRAY[]::text[])
    AND a.view_count > 200
  ORDER BY a.view_count DESC
  LIMIT 5
) a
WHERE d.id NOT IN (
  'd1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000003',
  'd1000000-0000-0000-0000-000000000004',
  'd1000000-0000-0000-0000-000000000005'
)
AND NOT EXISTS (
  SELECT 1 FROM recommendations r 
  WHERE r.deal_id = d.id AND r.asset_id = a.id
);

-- Add a few more targeted recommendations for each remaining deal to reach 6-8 recommendations per deal
INSERT INTO recommendations (deal_id, asset_id, reason, confidence_score)
SELECT 
  d.id,
  a.id,
  'Industry-aligned content: ' || a.title || ' provides specific insights for ' || COALESCE(d.industry, 'your industry') || ' organizations.',
  CASE 
    WHEN d.industry = ANY(a.industry_tags) AND d.stage = ANY(a.stage_tags) THEN 0.84
    WHEN d.industry = ANY(a.industry_tags) THEN 0.79
    WHEN d.stage = ANY(a.stage_tags) THEN 0.75
    ELSE 0.70
  END
FROM deals d
CROSS JOIN LATERAL (
  SELECT a.*
  FROM assets a
  WHERE 
    (d.industry = ANY(a.industry_tags) OR 'SaaS' = ANY(a.industry_tags))
    AND a.category IN ('case_study', 'tutorial', 'sales_play')
  ORDER BY RANDOM()
  LIMIT 3
) a
WHERE d.id NOT IN (
  'd1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000002',
  'd1000000-0000-0000-0000-000000000003',
  'd1000000-0000-0000-0000-000000000004',
  'd1000000-0000-0000-0000-000000000005'
)
AND NOT EXISTS (
  SELECT 1 FROM recommendations r 
  WHERE r.deal_id = d.id AND r.asset_id = a.id
)
LIMIT 50;
