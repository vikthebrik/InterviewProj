-- Seed: Test users + example reports for PoC
-- Run AFTER migrations 01, 02, 03

-- ─── AUTH USERS ────────────────────────────────────────────────────────────────
-- Passwords are bcrypt'd via crypt(). Extension pgcrypto is enabled by default in Supabase.
-- All reporters share: Reporter@2024
-- Executives:          Executive@2024
-- Admin:               Admin@2024
-- Root admin:          R00t@UO2024

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) VALUES

-- ── Reporters ──────────────────────────────────────────────────────────────────
('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000001','authenticated','authenticated',
 'alex.chen@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Alex Chen"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000002','authenticated','authenticated',
 'maya.johnson@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Maya Johnson"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000003','authenticated','authenticated',
 'carlos.rivera@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Carlos Rivera"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000004','authenticated','authenticated',
 'priya.patel@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Priya Patel"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000005','authenticated','authenticated',
 'jordan.kim@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Jordan Kim"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000006','authenticated','authenticated',
 'sam.okafor@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Sam Okafor"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000007','authenticated','authenticated',
 'taylor.white@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Taylor White"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000008','authenticated','authenticated',
 'riley.morgan@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Riley Morgan"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000009','authenticated','authenticated',
 'avery.brooks@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Avery Brooks"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000010','authenticated','authenticated',
 'jamie.nguyen@uoregon.edu', crypt('Reporter@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"reporter","display_name":"Jamie Nguyen"}',
 now(), now(), '', '', '', ''),

-- ── Executives ─────────────────────────────────────────────────────────────────
('00000000-0000-0000-0000-000000000000','b0000000-0000-0000-0000-000000000001','authenticated','authenticated',
 'dr.foster@uoregon.edu', crypt('Executive@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"executive","display_name":"Dr. Sarah Foster"}',
 now(), now(), '', '', '', ''),

('00000000-0000-0000-0000-000000000000','b0000000-0000-0000-0000-000000000002','authenticated','authenticated',
 'vp.operations@uoregon.edu', crypt('Executive@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"executive","display_name":"VP Marcus Williams"}',
 now(), now(), '', '', '', ''),

-- ── Admin ──────────────────────────────────────────────────────────────────────
('00000000-0000-0000-0000-000000000000','c0000000-0000-0000-0000-000000000001','authenticated','authenticated',
 'safety.admin@uoregon.edu', crypt('Admin@2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"admin","display_name":"Campus Safety Admin"}',
 now(), now(), '', '', '', ''),

-- ── Root Admin ─────────────────────────────────────────────────────────────────
('00000000-0000-0000-0000-000000000000','d0000000-0000-0000-0000-000000000001','authenticated','authenticated',
 'root.admin@uoregon.edu', crypt('R00t@UO2024', gen_salt('bf')), now(),
 '{"provider":"email","providers":["email"]}','{"role":"root_admin","display_name":"Root Administrator"}',
 now(), now(), '', '', '', '')

ON CONFLICT (id) DO NOTHING;

-- ─── PROFILES (safety net if trigger didn't fire) ──────────────────────────────
INSERT INTO public.profiles (id, display_name, role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Alex Chen',            'reporter'),
  ('a0000000-0000-0000-0000-000000000002', 'Maya Johnson',         'reporter'),
  ('a0000000-0000-0000-0000-000000000003', 'Carlos Rivera',        'reporter'),
  ('a0000000-0000-0000-0000-000000000004', 'Priya Patel',          'reporter'),
  ('a0000000-0000-0000-0000-000000000005', 'Jordan Kim',           'reporter'),
  ('a0000000-0000-0000-0000-000000000006', 'Sam Okafor',           'reporter'),
  ('a0000000-0000-0000-0000-000000000007', 'Taylor White',         'reporter'),
  ('a0000000-0000-0000-0000-000000000008', 'Riley Morgan',         'reporter'),
  ('a0000000-0000-0000-0000-000000000009', 'Avery Brooks',         'reporter'),
  ('a0000000-0000-0000-0000-000000000010', 'Jamie Nguyen',         'reporter'),
  ('b0000000-0000-0000-0000-000000000001', 'Dr. Sarah Foster',     'executive'),
  ('b0000000-0000-0000-0000-000000000002', 'VP Marcus Williams',   'executive'),
  ('c0000000-0000-0000-0000-000000000001', 'Campus Safety Admin',  'admin'),
  ('d0000000-0000-0000-0000-000000000001', 'Root Administrator',   'root_admin')
ON CONFLICT (id) DO NOTHING;

-- ─── EXAMPLE REPORTS ──────────────────────────────────────────────────────────
-- Spread across last 30 days, mix of types and statuses

INSERT INTO public.reports (id, user_id, type, description, status, contact_name, contact_email, is_anonymous, created_at) VALUES

-- Alex Chen
('e0000001-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001',
 'noise_complaint','Loud music and shouting coming from the apartment complex on Agate St around 1am. Multiple residents affected.',
 'resolved', 'Alex Chen', 'alex.chen@uoregon.edu', false,
 now() - interval '28 days'),

('e0000001-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001',
 'suspicious_activity','Unknown individual attempting to access locked bike storage behind PLC without a key, tried several times before leaving east on 13th.',
 'under_review', 'Alex Chen', 'alex.chen@uoregon.edu', false,
 now() - interval '5 days'),

-- Maya Johnson
('e0000002-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',
 'medical_emergency','Student collapsed near the EMU fountain. Appeared unresponsive. Called 911 before submitting this report — just logging for records.',
 'resolved', 'Maya Johnson', 'maya.johnson@uoregon.edu', false,
 now() - interval '21 days'),

('e0000002-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002',
 'harassment','Received repeated unwanted messages from an unknown campus email after the club fair. Have screenshots available.',
 'under_review', 'Maya Johnson', 'maya.johnson@uoregon.edu', false,
 now() - interval '3 days'),

-- Carlos Rivera
('e0000003-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000003',
 'vandalism','Graffiti found on the east wall of Lawrence Hall, approximately 2ft x 4ft tag in red spray paint.',
 'resolved', 'Carlos Rivera', 'carlos.rivera@uoregon.edu', false,
 now() - interval '18 days'),

('e0000003-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003',
 'theft','Laptop stolen from unattended table in Knight Library 2nd floor study area. MacBook Pro 14", silver. Serial # available.',
 'pending', 'Carlos Rivera', 'carlos.rivera@uoregon.edu', false,
 now() - interval '1 day'),

-- Priya Patel
('e0000004-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004',
 'fire_hazard','Exit stairwell in Bean Hall has boxes and supplies blocking the emergency exit door. Has been there for at least 3 days.',
 'resolved', 'Priya Patel', 'priya.patel@uoregon.edu', false,
 now() - interval '14 days'),

('e0000004-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000004',
 'maintenance','Broken emergency call box near the Millrace Path. Blue light is out and the button does not respond.',
 'under_review', 'Priya Patel', 'priya.patel@uoregon.edu', false,
 now() - interval '4 days'),

-- Jordan Kim
('e0000005-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000005',
 'noise_complaint','Party on campus in the dorm courtyard past 2am on a Tuesday night. Bass-heavy music audible from two buildings over.',
 'dismissed', 'Jordan Kim', 'jordan.kim@uoregon.edu', false,
 now() - interval '11 days'),

('e0000005-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000005',
 'suspicious_activity','Car circling the Walton parking structure multiple times, driver appeared to be photographing parked vehicles.',
 'pending', 'Jordan Kim', 'jordan.kim@uoregon.edu', false,
 now() - interval '2 days'),

-- Sam Okafor
('e0000006-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006',
 'incident','Aggressive altercation between two individuals near the Rec Center entrance. Security intervened before police were needed.',
 'resolved', 'Sam Okafor', 'sam.okafor@uoregon.edu', false,
 now() - interval '25 days'),

('e0000006-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000006',
 'theft','Bicycle cut from rack near Friendly Hall between 8am–12pm. Trek hybrid, blue frame, had two stickers on the frame.',
 'under_review', 'Sam Okafor', 'sam.okafor@uoregon.edu', false,
 now() - interval '6 days'),

-- Taylor White
('e0000007-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000007',
 'vandalism','Several car windows smashed in the Barnhart parking lot. At least 4 vehicles affected. Occurred overnight.',
 'resolved', 'Taylor White', 'taylor.white@uoregon.edu', false,
 now() - interval '17 days'),

('e0000007-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000007',
 'maintenance','Flooding in the basement hallway of Villard Hall after last night''s rain. Water pooling near the electrical panel.',
 'pending', 'Taylor White', 'taylor.white@uoregon.edu', false,
 now() - interval '1 day'),

-- Riley Morgan
('e0000008-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000008',
 'medical_emergency','Individual found unconscious in bathroom stall in the EMU. Emergency services called. Logging for documentation.',
 'resolved', 'Riley Morgan', 'riley.morgan@uoregon.edu', false,
 now() - interval '9 days'),

('e0000008-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000008',
 'suspicious_activity','Unknown person in maintenance uniform trying to access server room in Chapman Hall without badging in. Did not have ID visible.',
 'under_review', 'Riley Morgan', 'riley.morgan@uoregon.edu', false,
 now() - interval '2 days'),

-- Avery Brooks
('e0000009-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000009',
 'harassment','Repeated targeted comments made toward a student during class by another student. Professor did not intervene.',
 'under_review', 'Avery Brooks', 'avery.brooks@uoregon.edu', false,
 now() - interval '7 days'),

('e0000009-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000009',
 'fire_hazard','Smoke detected in the copy room on the 3rd floor of Oregon Hall. Source was an overheating printer. Area evacuated briefly.',
 'resolved', 'Avery Brooks', 'avery.brooks@uoregon.edu', false,
 now() - interval '20 days'),

-- Jamie Nguyen
('e0000010-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000010',
 'noise_complaint','Ongoing construction noise starting at 6:30am outside Straub Hall disrupting early classes and study.',
 'dismissed', 'Jamie Nguyen', 'jamie.nguyen@uoregon.edu', false,
 now() - interval '12 days'),

('e0000010-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000010',
 'incident','Scooter rider ran a red light at 13th and Alder and nearly struck a pedestrian. No injuries, rider continued without stopping.',
 'pending', 'Jamie Nguyen', 'jamie.nguyen@uoregon.edu', false,
 now() - interval '3 days'),

-- Anonymous reports (no login)
('e0000011-0000-0000-0000-000000000001', NULL,
 'suspicious_activity','Someone leaving threatening notes under dorm room doors on floor 4 of Hamilton Hall. Notes are signed "Watcher".',
 'under_review', 'Anonymous', NULL, true,
 now() - interval '4 days'),

('e0000011-0000-0000-0000-000000000002', NULL,
 'noise_complaint','Extremely loud gathering near the tennis courts every Friday after midnight. Music audible for two blocks.',
 'pending', NULL, NULL, true,
 now() - interval '1 day'),

('e0000011-0000-0000-0000-000000000003', NULL,
 'theft','Wallet stolen at the Duck Store. Noticed it missing after checking out. Had cash and student ID.',
 'pending', 'Concerned Student', 'anon.reporter@protonmail.com', true,
 now() - interval '2 days'),

('e0000011-0000-0000-0000-000000000004', NULL,
 'medical_emergency','Person found sitting alone on bench near PLC at 11pm, appeared disoriented and cold. Flagged campus security.',
 'resolved', NULL, NULL, true,
 now() - interval '8 days'),

('e0000011-0000-0000-0000-000000000005', NULL,
 'harassment','A staff member in Condon Hall has been making inappropriate comments to students during office hours. Multiple people have noticed.',
 'under_review', 'Concerned Peer', 'reachme99@gmail.com', true,
 now() - interval '5 days')

ON CONFLICT (id) DO NOTHING;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW public.mv_weekly_report_metrics;
REFRESH MATERIALIZED VIEW public.mv_monthly_media_distribution;
