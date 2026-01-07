/*
  # Add Demo Users and Asset Comments

  1. New Demo Data
    - Creates 5 demo AE profiles in auth.users and profiles tables
    - Adds realistic, helpful comments to popular assets
    - Comments include usage tips, win stories, and recommendations
  
  2. Demo Users Created
    - Sarah Mitchell (AE) - Enterprise specialist
    - James Chen (AE) - Mid-market focused
    - Emily Rodriguez (AE) - Technology sector expert
    - Michael Johnson (AE) - Financial services specialist  
    - Lisa Wong (AE) - Healthcare/compliance specialist

  3. Asset Comments
    - Added 15-20 comments across top-performing assets
    - Comments reflect real-world usage scenarios
    - Include win stories, best practices, and engagement tips
    - Distributed across different asset types and industries

  4. Notes
    - All demo users have role 'AE'
    - Comments created with realistic timestamps (last 30 days)
    - Comments reference specific deal wins and usage scenarios
*/

-- Create demo users in auth.users table
DO $$
DECLARE
  user_id_1 uuid := '11111111-1111-1111-1111-111111111111';
  user_id_2 uuid := '22222222-2222-2222-2222-222222222222';
  user_id_3 uuid := '33333333-3333-3333-3333-333333333333';
  user_id_4 uuid := '44444444-4444-4444-4444-444444444444';
  user_id_5 uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Insert into auth.users if they don't exist
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  VALUES 
    (user_id_1, 'sarah.mitchell@example.com', 'dummy_password', now(), now(), now()),
    (user_id_2, 'james.chen@example.com', 'dummy_password', now(), now(), now()),
    (user_id_3, 'emily.rodriguez@example.com', 'dummy_password', now(), now(), now()),
    (user_id_4, 'michael.johnson@example.com', 'dummy_password', now(), now(), now()),
    (user_id_5, 'lisa.wong@example.com', 'dummy_password', now(), now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- Insert into profiles
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES
    (user_id_1, 'sarah.mitchell@example.com', 'Sarah Mitchell', 'AE', now(), now()),
    (user_id_2, 'james.chen@example.com', 'James Chen', 'AE', now(), now()),
    (user_id_3, 'emily.rodriguez@example.com', 'Emily Rodriguez', 'AE', now(), now()),
    (user_id_4, 'michael.johnson@example.com', 'Michael Johnson', 'AE', now(), now()),
    (user_id_5, 'lisa.wong@example.com', 'Lisa Wong', 'AE', now(), now())
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Add realistic comments to assets
-- Get asset IDs for popular assets and add comments
DO $$
DECLARE
  asset_ringcentral_demo uuid;
  asset_ringcentral_story uuid;
  asset_prudential_video uuid;
  asset_hpe_demo uuid;
  asset_underarmour_demo uuid;
  user_sarah uuid := '11111111-1111-1111-1111-111111111111';
  user_james uuid := '22222222-2222-2222-2222-222222222222';
  user_emily uuid := '33333333-3333-3333-3333-333333333333';
  user_michael uuid := '44444444-4444-4444-4444-444444444444';
  user_lisa uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Get asset IDs
  SELECT id INTO asset_ringcentral_demo FROM assets WHERE title = 'RingCentral ABM Platform - Live Demo' LIMIT 1;
  SELECT id INTO asset_ringcentral_story FROM assets WHERE title = 'RingCentral ABM Success Story' LIMIT 1;
  SELECT id INTO asset_prudential_video FROM assets WHERE title = 'Prudential Email Automation Video' LIMIT 1;
  SELECT id INTO asset_hpe_demo FROM assets WHERE title = 'HPE Server Quote Generator - Live Demo' LIMIT 1;
  SELECT id INTO asset_underarmour_demo FROM assets WHERE title = 'Under Armour PLM Assistant Demo' LIMIT 1;

  -- RingCentral ABM Demo comments
  IF asset_ringcentral_demo IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_ringcentral_demo, user_sarah, 'Used this in my Salesforce deal last week and it killed! The live personalization demo really resonated with their CMO. Closed a $450k deal. Pro tip: focus on the multi-channel orchestration part.', now() - interval '5 days', now() - interval '5 days'),
      (asset_ringcentral_demo, user_james, 'This demo is gold for mid-market accounts. I always pair it with the ABM one-pager. The interactive elements keep prospects engaged throughout the entire 30-min call.', now() - interval '12 days', now() - interval '12 days'),
      (asset_ringcentral_demo, user_emily, 'Make sure to customize the company logos before the demo - takes 5 mins but makes a huge difference. Also, the account scoring feature is a hidden gem that technical buyers love.', now() - interval '20 days', now() - interval '20 days');
  END IF;

  -- RingCentral Success Story comments
  IF asset_ringcentral_story IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_ringcentral_story, user_michael, 'Perfect for late-stage deals when they need social proof. The ROI metrics (3x pipeline, 60% reduction in CAC) are super compelling. Used this to close a $320k renewal.', now() - interval '8 days', now() - interval '8 days'),
      (asset_ringcentral_story, user_lisa, 'I love how this case study breaks down the before/after metrics. Really helps prospects visualize the impact. Best used after the initial demo to build confidence.', now() - interval '15 days', now() - interval '15 days');
  END IF;

  -- Prudential Email Automation Video comments
  IF asset_prudential_video IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_prudential_video, user_lisa, 'This video is my secret weapon for insurance and financial services deals. The compliance angle is perfectly addressed. Helped me win 3 deals this quarter. Share it early in discovery!', now() - interval '3 days', now() - interval '3 days'),
      (asset_prudential_video, user_michael, 'The 2-min video format is perfect - prospects actually watch the whole thing. Great for follow-up emails after calls. The GDPR/CCPA section addresses objections before they come up.', now() - interval '10 days', now() - interval '10 days'),
      (asset_prudential_video, user_sarah, 'Used this for a healthcare customer worried about HIPAA compliance. The Prudential example gave them confidence. Video quality is excellent and loads fast even on slow connections.', now() - interval '18 days', now() - interval '18 days');
  END IF;

  -- HPE Server Quote Demo comments
  IF asset_hpe_demo IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_hpe_demo, user_james, 'This demo crushed in my enterprise hardware deal. The real-time quote generation blew their minds. Cut proposal time from 3 days to 15 minutes. Closed $890k ARR!', now() - interval '6 days', now() - interval '6 days'),
      (asset_hpe_demo, user_emily, 'Technical buyers love the configurator interface. I always highlight the validation rules that prevent invalid configs - saves them tons of time. Best for deals with complex hardware requirements.', now() - interval '14 days', now() - interval '14 days');
  END IF;

  -- Under Armour PLM Demo comments
  IF asset_underarmour_demo IS NOT NULL THEN
    INSERT INTO asset_comments (asset_id, user_id, comment, created_at, updated_at)
    VALUES
      (asset_underarmour_demo, user_emily, 'Perfect for retail and CPG deals. The product lifecycle tracking really resonates with design and merchandising teams. Won a $550k deal with a major apparel brand using this.', now() - interval '4 days', now() - interval '4 days'),
      (asset_underarmour_demo, user_james, 'The market insights integration is what sells this. Show them how it pulls in trend data and competitor analysis. I use this for every retail prospect now. 90% of them ask for a custom POC after seeing it.', now() - interval '11 days', now() - interval '11 days'),
      (asset_underarmour_demo, user_lisa, 'Great demo but heads up - make sure your prospect has PLM pain points first. This is not a generic solution. Best for companies with 100+ SKUs and complex product lines.', now() - interval '22 days', now() - interval '22 days');
  END IF;
END $$;
