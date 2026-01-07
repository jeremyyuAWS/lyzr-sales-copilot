/*
  # Populate Enhanced Asset Metadata and Generate Comments

  1. Updates
    - Adds comprehensive metadata to all existing assets
    - Generates realistic, helpful AE comments for popular assets
    - Sets when_to_use, positioning_angle, and other guidance fields
    
  2. Data Added
    - Usage guidance for each asset type
    - Positioning angles and talk tracks
    - Common next steps and related assets
    - Structured AE comments with context
*/

-- Update RingCentral ABM Platform Demo
UPDATE assets 
SET 
  when_to_use = E'**Best used when:**\n• Early Discovery with marketing or sales ops buyers\n• Customer asks "how do you do account-based marketing?"\n• AE needs to show platform breadth and multi-channel capabilities\n• Prospect is evaluating ABM solutions and needs to see it in action',
  positioning_angle = 'Frame this as a platform play, not a point solution. Emphasize the account intelligence layer and how it orchestrates campaigns across channels. Focus on "personalization at scale" rather than just "ABM tool."',
  common_next_steps = ARRAY['Live demo tailored to their tech stack', 'ABM strategy consultation call', 'Case study from similar industry', 'ROI calculator for their account list size'],
  best_for_stages = ARRAY['Discovery', 'Demo'],
  best_for_personas = ARRAY['Marketing Ops', 'VP Marketing', 'Sales Ops'],
  what_it_is_not = E'**Good for:** Platform overview, showing ABM orchestration capabilities\n**Not ideal for:** Deep technical integration discussions, pricing conversations, single-channel marketing needs',
  momentum_indicator = 'High - 75% of prospects request custom demo after viewing',
  typical_placement = 'First or second call, after initial discovery'
WHERE title = 'RingCentral ABM Platform - Live Demo';

-- Update RingCentral ABM Success Story
UPDATE assets
SET
  when_to_use = E'**Best used when:**\n• Late Discovery or Demo stage - need social proof\n• Prospect has budget concerns or ROI questions\n• Customer asks "who else has done this?"\n• Dealing with procurement or finance stakeholders',
  positioning_angle = 'Lead with the 3x pipeline and 60% CAC reduction metrics. Emphasize that RingCentral is a similar enterprise SaaS company. Focus on time-to-value (90 days to full deployment).',
  common_next_steps = ARRAY['Executive business review', 'Custom ROI projection for their business', 'Reference call with RingCentral team', 'Pricing proposal'],
  best_for_stages = ARRAY['Demo', 'Proposal'],
  best_for_personas = ARRAY['VP Marketing', 'CFO', 'Procurement'],
  what_it_is_not = E'**Good for:** ROI justification, enterprise social proof, late-stage validation\n**Not ideal for:** Early discovery, technical deep-dives, small business prospects',
  momentum_indicator = 'Medium-High - Often accelerates deal closure by 2-3 weeks',
  typical_placement = 'After initial demo, before proposal'
WHERE title = 'RingCentral ABM Success Story';

-- Update Prudential Email Automation Video
UPDATE assets
SET
  when_to_use = E'**Best used when:**\n• Financial services or insurance vertical\n• Compliance concerns (GDPR, CCPA, HIPAA) are raised\n• Customer needs to see AI in production at scale\n• Short attention span - need quick, compelling proof point',
  positioning_angle = 'Lead with the compliance angle first, then the scale (500K emails/month). Position as "AI that passes audit" not just "AI that works." Emphasize the approval workflow for regulated industries.',
  common_next_steps = ARRAY['Compliance documentation review', 'Security questionnaire completion', 'Demo with compliance team present', 'Case study from another regulated industry'],
  best_for_stages = ARRAY['Discovery', 'Technical Validation'],
  best_for_personas = ARRAY['VP Customer Success', 'Compliance Officer', 'Legal'],
  what_it_is_not = E'**Good for:** Financial services deals, compliance validation, quick video proof\n**Not ideal for:** Non-regulated industries, deep technical architecture discussions',
  momentum_indicator = 'High - Frequently moves compliance objections to next stage',
  typical_placement = 'Early-to-mid cycle when compliance questions arise'
WHERE title = 'Prudential Email Automation Video';

-- Update HPE Server Quote Generator Demo
UPDATE assets
SET
  when_to_use = E'**Best used when:**\n• Customer has complex hardware/configuration needs\n• Long quote turnaround time is a known pain point\n• Dealing with technical buyers who value accuracy\n• Enterprise deal with multi-SKU, multi-location requirements',
  positioning_angle = 'Focus on "15 minutes instead of 3 days" and the reduction in configuration errors. Position as revenue acceleration tool, not just efficiency. Emphasize the validation layer that prevents invalid configs.',
  common_next_steps = ARRAY['Custom POC with their product catalog', 'Integration discussion with their CPQ system', 'ROI calculation on sales cycle reduction', 'Technical architecture review'],
  best_for_stages = ARRAY['Demo', 'Technical Validation'],
  best_for_personas = ARRAY['VP Sales', 'Sales Ops', 'RevOps'],
  what_it_is_not = E'**Good for:** Complex B2B sales, hardware/manufacturing, quote-heavy industries\n**Not ideal for:** Simple product catalogs, low-SKU businesses, services companies',
  momentum_indicator = 'Very High - 90% request POC after seeing this demo',
  typical_placement = 'Mid-cycle demo after pain point is confirmed'
WHERE title = 'HPE Server Quote Generator - Live Demo';

-- Update Under Armour PLM Assistant Demo
UPDATE assets
SET
  when_to_use = E'**Best used when:**\n• Retail, CPG, or apparel industry\n• Customer has 100+ SKUs and complex product lifecycles\n• Design and merchandising teams are key stakeholders\n• Manual product data management is causing delays',
  positioning_angle = 'Lead with "product intelligence, not just data management." Emphasize the trend analysis and competitive insights, not just PLM features. Position as strategic tool for product teams, not IT tool.',
  common_next_steps = ARRAY['Workshop with product/design team', 'Integration assessment with existing PLM', 'Retailanalytics deep dive', 'Custom demo with their product line'],
  best_for_stages = ARRAY['Discovery', 'Demo'],
  best_for_personas = ARRAY['VP Product', 'Chief Merchandising Officer', 'Design Lead'],
  what_it_is_not = E'**Good for:** Retail/CPG with complex product lines, design-led organizations\n**Not ideal for:** Low-SKU businesses, service companies, simple inventory management needs',
  momentum_indicator = 'High - 80% of qualified prospects request custom POC',
  typical_placement = 'First demo after qualifying product complexity'
WHERE title = 'Under Armour PLM Assistant Demo';

-- Generate more AE comments for various assets
DO $$
DECLARE
  asset_ringcentral_demo uuid;
  asset_prudential uuid;
  asset_hpe uuid;
  asset_lyzr_platform uuid;
  user_arkojit uuid := '11111111-1111-1111-1111-111111111111';
  user_sarah uuid := '11111111-1111-1111-1111-111111111111';
  user_emily uuid := '33333333-3333-3333-3333-333333333333';
  user_michael uuid := '44444444-4444-4444-4444-444444444444';
  user_lisa uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Get additional asset IDs
  SELECT id INTO asset_ringcentral_demo FROM assets WHERE title = 'RingCentral ABM Platform - Live Demo' LIMIT 1;
  SELECT id INTO asset_prudential FROM assets WHERE title = 'Prudential Email Automation Video' LIMIT 1;
  SELECT id INTO asset_hpe FROM assets WHERE title = 'HPE Server Quote Generator - Live Demo' LIMIT 1;
  SELECT id INTO asset_lyzr_platform FROM assets WHERE title = 'Lyzr Platform Overview Video' LIMIT 1;

  -- Add more structured comments for Lyzr Platform if exists
  IF asset_lyzr_platform IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_lyzr_platform, user_sarah, 'Perfect first-call asset. I send this before every initial meeting so prospects come prepared with questions. Cuts discovery time in half. Just make sure to follow up with a specific use case demo.', now() - interval '2 days', now() - interval '2 days'),
      (asset_lyzr_platform, user_emily, 'Use this when you have multiple stakeholders who need alignment on what Lyzr does. Saved me in an 8-person discovery call - everyone got on the same page fast. Best paired with the use case deck afterward.', now() - interval '9 days', now() - interval '9 days'),
      (asset_lyzr_platform, user_michael, 'Great for enterprise deals where you need exec buy-in. The platform positioning resonates better than jumping straight to features. Won 2 deals this quarter by leading with this.', now() - interval '16 days', now() - interval '16 days');
  END IF;

  -- Add comments for other top assets
  IF asset_prudential IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_prudential, user_emily, 'My secret weapon for any regulated industry. Even non-insurance prospects love seeing how we handle compliance. The 2-minute length is perfect - they actually watch the whole thing.', now() - interval '7 days', now() - interval '7 days')
    ON CONFLICT DO NOTHING;
  END IF;

  IF asset_hpe IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_hpe, user_michael, 'This demo consistently gets the biggest reaction. The real-time quote generation makes jaws drop. Just make sure your prospect has quote complexity first - don''t show this to simple B2C companies.', now() - interval '13 days', now() - interval '13 days')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
