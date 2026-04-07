-- 75 additional reports across 30 days
-- Status distribution: recent=pending, older=resolved/dismissed
-- Run AFTER 04_seed.sql

INSERT INTO public.reports (id, user_id, type, description, status, contact_name, contact_email, is_anonymous, created_at) VALUES

-- ── DAY 1 (all pending, weekend – noise/medical heavy) ────────────────────────
('f0000100-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','noise_complaint',
 'House party on Hilyard St running past 3am, bass audible from two blocks. Multiple neighbors already called non-emergency line.','pending','Alex Chen','alex.chen@uoregon.edu',false, now() - interval '1 day 2 hours'),

('f0000100-0000-0000-0000-000000000002',NULL,'medical_emergency',
 'Person found unresponsive in the EMU restroom on the second floor. 911 called. Logging for campus records.','pending',NULL,NULL,true, now() - interval '1 day 5 hours'),

('f0000100-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000003','theft',
 'Laptop and AirPods taken from unattended bag at Knight Library north reading room, table by window. Black MacBook Air.','pending','Carlos Rivera','carlos.rivera@uoregon.edu',false, now() - interval '1 day 9 hours'),

-- ── DAY 2 (pending) ────────────────────────────────────────────────────────────
('f0000200-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','suspicious_activity',
 'Unknown vehicle with no plates parked in the Walton garage upper deck for 3 consecutive days. No permit visible.','pending','Maya Johnson','maya.johnson@uoregon.edu',false, now() - interval '2 days 7 hours'),

('f0000200-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000004','harassment',
 'Student received aggressive DMs from a profile using the UO club email list. Screenshots attached to follow-up email.','pending','Priya Patel','priya.patel@uoregon.edu',false, now() - interval '2 days 14 hours'),

('f0000200-0000-0000-0000-000000000003',NULL,'noise_complaint',
 'DJ event in Fenton Hall courtyard went until 1am with no sound barrier. Affected study rooms on floors 2 and 3.','pending','Concerned Resident','dorm.noise@gmail.com',true, now() - interval '2 days 20 hours'),

-- ── DAY 3 (pending) ────────────────────────────────────────────────────────────
('f0000300-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000005','maintenance',
 'Elevator in Straub Hall has been stuck between floors 1 and 2 since Tuesday morning. Facility ticket 4421 submitted but no response.','pending','Jordan Kim','jordan.kim@uoregon.edu',false, now() - interval '3 days 6 hours'),

('f0000300-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000006','vandalism',
 'Restroom in McKenzie Hall 1st floor has graffiti covering the south wall. Offensive content — needs immediate removal.','pending','Sam Okafor','sam.okafor@uoregon.edu',false, now() - interval '3 days 11 hours'),

-- ── DAY 4 (mix pending/under_review) ──────────────────────────────────────────
('f0000400-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000007','theft',
 'Campus bike stolen from rack outside the Education building. Trek Marlin 5, matte black, serial number filed with UOPD.','under_review','Taylor White','taylor.white@uoregon.edu',false, now() - interval '4 days 3 hours'),

('f0000400-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000008','suspicious_activity',
 'Individual in PPE and a hardhat attempted to access the server closet in Price Science Commons without a key card or escort.','pending','Riley Morgan','riley.morgan@uoregon.edu',false, now() - interval '4 days 15 hours'),

('f0000400-0000-0000-0000-000000000003',NULL,'incident',
 'Fight broke out near the food carts on 13th and Kincaid. Two individuals involved, one appeared injured. UOPD arrived quickly.','under_review',NULL,NULL,true, now() - interval '4 days 19 hours'),

-- ── DAY 5 ─────────────────────────────────────────────────────────────────────
('f0000500-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000009','fire_hazard',
 'Smoke detector in Onyx Bridge stairwell 3 has been beeping continuously for 48 hours. Possible low battery or malfunction.','under_review','Avery Brooks','avery.brooks@uoregon.edu',false, now() - interval '5 days 8 hours'),

('f0000500-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000010','noise_complaint',
 'Construction crew starting demolition work at 6am directly outside the Lillis Business Complex, violating the 7am city ordinance.','pending','Jamie Nguyen','jamie.nguyen@uoregon.edu',false, now() - interval '5 days 12 hours'),

-- ── DAY 6 ─────────────────────────────────────────────────────────────────────
('f0000600-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','medical_emergency',
 'Student had a seizure in Cascade Hall dining area during lunch. Dining staff called 911. Student transported. Logging for records.','under_review','Alex Chen','alex.chen@uoregon.edu',false, now() - interval '6 days 12 hours'),

('f0000600-0000-0000-0000-000000000002',NULL,'theft',
 'Wallet left on cafeteria table was taken within 10 minutes. Had cash, student ID, and Visa card. Reported to UOPD.','pending','Anonymous','',true, now() - interval '6 days 17 hours'),

-- ── DAY 7 (Friday – noise heavy) ──────────────────────────────────────────────
('f0000700-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','noise_complaint',
 'Loud outdoor party at the Theta house on 15th, still going at 2:30am Friday night. Called non-emergency 3x with no response.','under_review','Maya Johnson','maya.johnson@uoregon.edu',false, now() - interval '7 days 3 hours'),

('f0000700-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','vandalism',
 'Slashed tire found on a car in lot 12A near the Rec Center. Appears intentional — only one car affected, no other damage nearby.','under_review','Carlos Rivera','carlos.rivera@uoregon.edu',false, now() - interval '7 days 8 hours'),

('f0000700-0000-0000-0000-000000000003',NULL,'suspicious_activity',
 'Person photographing keypad entry points around the HEDCO Education building repeatedly over two days. No clear purpose observed.','under_review',NULL,NULL,true, now() - interval '7 days 16 hours'),

-- ── DAY 8 ─────────────────────────────────────────────────────────────────────
('f0000800-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','harassment',
 'TA in PHYS 252 made repeated derogatory comments during office hours directed at a specific student. Three witnesses.','under_review','Priya Patel','priya.patel@uoregon.edu',false, now() - interval '8 days 9 hours'),

('f0000800-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000005','maintenance',
 'Broken window latch on the 4th floor of PLC — window has been stuck open for a week during cold weather. Facilities unresponsive.','under_review','Jordan Kim','jordan.kim@uoregon.edu',false, now() - interval '8 days 14 hours'),

-- ── DAY 10 ────────────────────────────────────────────────────────────────────
('f0001000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006','theft',
 'Catalytic converter stolen from a faculty vehicle in the Lot 12 faculty lot overnight. Third incident in this lot this month.','under_review','Sam Okafor','sam.okafor@uoregon.edu',false, now() - interval '10 days 7 hours'),

('f0001000-0000-0000-0000-000000000002',NULL,'fire_hazard',
 'Overflowing trash can near the emergency exit in Streisinger Hall caught fire briefly. Extinguished by a passerby. Area cleared.','resolved',NULL,NULL,true, now() - interval '10 days 18 hours'),

-- ── DAY 11 ────────────────────────────────────────────────────────────────────
('f0001100-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000007','incident',
 'Student fell from a skateboard near the amphitheater and hit their head. Conscious and responsive. Taken to student health by friend.','resolved','Taylor White','taylor.white@uoregon.edu',false, now() - interval '11 days 10 hours'),

('f0001100-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000008','noise_complaint',
 'Drumline practice session running until 9:30pm in the EMU ballroom with doors open. Audible in the library across the path.','dismissed','Riley Morgan','riley.morgan@uoregon.edu',false, now() - interval '11 days 13 hours'),

-- ── DAY 13 ────────────────────────────────────────────────────────────────────
('f0001300-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000009','suspicious_activity',
 'Individual loitering outside Hayward Field access gate for over 90 minutes, attempting to engage athletes as they exit.','under_review','Avery Brooks','avery.brooks@uoregon.edu',false, now() - interval '13 days 6 hours'),

('f0001300-0000-0000-0000-000000000002',NULL,'harassment',
 'Received anonymous threatening notes slid under my dorm door three nights in a row. RA aware. Requesting formal documentation.','under_review','Dorm Resident','safe.report@protonmail.com',true, now() - interval '13 days 20 hours'),

('f0001300-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000010','maintenance',
 'Water fountain near the gender-neutral restroom on floor 3 of the EMU has been broken for two weeks. Work order #5511 ignored.','resolved','Jamie Nguyen','jamie.nguyen@uoregon.edu',false, now() - interval '13 days 14 hours'),

-- ── DAY 14 ────────────────────────────────────────────────────────────────────
('f0001400-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','vandalism',
 'Tagged walls found in the tunnel connecting the EMU to the Erb Memorial Union parking structure. UO-branded graffiti removed.','resolved','Alex Chen','alex.chen@uoregon.edu',false, now() - interval '14 days 9 hours'),

('f0001400-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000002','theft',
 'MacBook Pro stolen from the 24-hour study room in the Knight Library. Laptop was left alone for under 5 minutes.','resolved','Maya Johnson','maya.johnson@uoregon.edu',false, now() - interval '14 days 16 hours'),

-- ── DAY 15 ────────────────────────────────────────────────────────────────────
('f0001500-0000-0000-0000-000000000001',NULL,'medical_emergency',
 'Diabetic student collapsed in Villard Hall lecture hall during class. Instructor called 911. Student recovered, no transport needed.','resolved',NULL,NULL,true, now() - interval '15 days 11 hours'),

('f0001500-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','fire_hazard',
 'Candles found burning unattended in a dorm room in Carson Hall during a room check. Fire code violation. Resident warned.','dismissed','Carlos Rivera','carlos.rivera@uoregon.edu',false, now() - interval '15 days 15 hours'),

-- ── DAY 16 ────────────────────────────────────────────────────────────────────
('f0001600-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','incident',
 'Two students arguing escalated to a physical altercation outside the Duck Store. Security separated them. No injuries reported.','resolved','Priya Patel','priya.patel@uoregon.edu',false, now() - interval '16 days 13 hours'),

('f0001600-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000005','suspicious_activity',
 'Person observed accessing multiple parked cars in the 13th Street garage using a device that may have been a signal repeater.','resolved','Jordan Kim','jordan.kim@uoregon.edu',false, now() - interval '16 days 18 hours'),

('f0001600-0000-0000-0000-000000000003',NULL,'noise_complaint',
 'Music blasting from one of the apartments above the UO bookstore parking until 4am on a Thursday. Multiple people affected.','dismissed','Neighbor','neighboralert@gmail.com',true, now() - interval '16 days 22 hours'),

-- ── DAY 17 ────────────────────────────────────────────────────────────────────
('f0001700-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006','harassment',
 'Targeted racist graffiti found on a student''s assigned locker in the Rec Center. Student photographed and reported to UOPD.','resolved','Sam Okafor','sam.okafor@uoregon.edu',false, now() - interval '17 days 8 hours'),

('f0001700-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000007','maintenance',
 'Security camera outside the Agate Hall main entrance has been offline for 6 days. Facilities says it is a low priority.','resolved','Taylor White','taylor.white@uoregon.edu',false, now() - interval '17 days 14 hours'),

-- ── DAY 18 ────────────────────────────────────────────────────────────────────
('f0001800-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000008','theft',
 'Student had phone grabbed from their hands near the corner of 13th and Kincaid. Attacker ran east toward the park blocks.','resolved','Riley Morgan','riley.morgan@uoregon.edu',false, now() - interval '18 days 16 hours'),

('f0001800-0000-0000-0000-000000000002',NULL,'incident',
 'Driver ran red light on 18th Ave and nearly struck two cyclists in the crosswalk. License plate noted: Oregon 7XZ-281.','dismissed',NULL,NULL,true, now() - interval '18 days 20 hours'),

-- ── DAY 19 ────────────────────────────────────────────────────────────────────
('f0001900-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000009','noise_complaint',
 'Persistent construction noise from the new building on 18th St starts at 6am daily including weekends. Violates city permit.','resolved','Avery Brooks','avery.brooks@uoregon.edu',false, now() - interval '19 days 7 hours'),

('f0001900-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000010','vandalism',
 'Bathroom mirror shattered in the Fenton Hall 2nd floor men''s room. Appears to have been struck deliberately. Hazardous.','resolved','Jamie Nguyen','jamie.nguyen@uoregon.edu',false, now() - interval '19 days 11 hours'),

-- ── DAY 20 ────────────────────────────────────────────────────────────────────
('f0002000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','suspicious_activity',
 'Person photographing staff entrances and keycard readers at the CAMWS data center building. Refused to explain when approached.','resolved','Alex Chen','alex.chen@uoregon.edu',false, now() - interval '20 days 9 hours'),

('f0002000-0000-0000-0000-000000000002',NULL,'fire_hazard',
 'Chemical smell coming from the 3rd floor bathroom in Klamath Hall. Strong enough to cause headache. Ventilation may be blocked.','resolved',NULL,NULL,true, now() - interval '20 days 16 hours'),

-- ── DAY 21 ────────────────────────────────────────────────────────────────────
('f0002100-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','medical_emergency',
 'Athlete collapsed during open-field practice at Pape Field. Trainer responded immediately. Transported via ambulance.','resolved','Maya Johnson','maya.johnson@uoregon.edu',false, now() - interval '21 days 14 hours'),

('f0002100-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','harassment',
 'Professor publicly mocked a student''s accent during a recorded lecture. Student filed formal complaint and requests safety documentation.','resolved','Carlos Rivera','carlos.rivera@uoregon.edu',false, now() - interval '21 days 18 hours'),

-- ── DAY 22 ────────────────────────────────────────────────────────────────────
('f0002200-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','theft',
 'Backpack stolen from an unlocked car on Agate Street. Included laptop, passport, and course materials. Police report filed.','resolved','Priya Patel','priya.patel@uoregon.edu',false, now() - interval '22 days 8 hours'),

('f0002200-0000-0000-0000-000000000002',NULL,'noise_complaint',
 'Repeated disturbances from the apartment on 17th and Mill — shouting and music from 11pm to 3am on multiple nights.','dismissed','Anonymous Neighbor','',true, now() - interval '22 days 12 hours'),

('f0002200-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000005','maintenance',
 'Exit sign above Room 104 in Lawrence Hall has been dark for three weeks. Fire safety issue. Facilities ticket 6002 still open.','resolved','Jordan Kim','jordan.kim@uoregon.edu',false, now() - interval '22 days 19 hours'),

-- ── DAY 23 ────────────────────────────────────────────────────────────────────
('f0002300-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006','incident',
 'Unauthorized individual found sleeping in an unlocked Gerlinger Hall classroom overnight. Security escorted off premises.','resolved','Sam Okafor','sam.okafor@uoregon.edu',false, now() - interval '23 days 7 hours'),

('f0002300-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000007','suspicious_activity',
 'Unknown drone spotted hovering above the new sciences building construction site for 20 minutes with no visible operator.','dismissed','Taylor White','taylor.white@uoregon.edu',false, now() - interval '23 days 13 hours'),

-- ── DAY 24 ────────────────────────────────────────────────000000────────────────
('f0002400-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000008','vandalism',
 'Keyed car found in the Knight Library parking lot. Long scratch along the driver side. Security footage requested.','resolved','Riley Morgan','riley.morgan@uoregon.edu',false, now() - interval '24 days 10 hours'),

('f0002400-0000-0000-0000-000000000002',NULL,'medical_emergency',
 'Student found in distress near the UO counseling center entrance. Student health services alerted. No further details shared.','resolved',NULL,NULL,true, now() - interval '24 days 16 hours'),

-- ── DAY 25 ────────────────────────────────────────────────────────────────────
('f0002500-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000009','noise_complaint',
 'Band rehearsal in the music building overflowing into the courtyard until 10pm. Lectures in adjacent rooms disrupted.','dismissed','Avery Brooks','avery.brooks@uoregon.edu',false, now() - interval '25 days 13 hours'),

('f0002500-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000010','theft',
 'Espresso machine stolen from the graduate student lounge in PLC. Valued at $800. No forced entry visible.','resolved','Jamie Nguyen','jamie.nguyen@uoregon.edu',false, now() - interval '25 days 18 hours'),

-- ── DAY 26 ────────────────────────────────────────────────────────────────────
('f0002600-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','fire_hazard',
 'Smoke seen coming from the HVAC unit on the roof of Condon Hall. Facilities dispatched. Unit shut down for inspection.','resolved','Alex Chen','alex.chen@uoregon.edu',false, now() - interval '26 days 9 hours'),

('f0002600-0000-0000-0000-000000000002',NULL,'harassment',
 'Flyers with threatening anti-LGBTQ+ content found posted in the Gender Equity Center hallway. Photographed and removed by staff.','resolved','Safe Space','campus.ally@uoregon.edu',true, now() - interval '26 days 14 hours'),

-- ── DAY 27 ────────────────────────────────────────────────────────────────────
('f0002700-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','incident',
 'Student confronted a staff member aggressively over a grade dispute outside the registrar. Situation de-escalated by security.','resolved','Maya Johnson','maya.johnson@uoregon.edu',false, now() - interval '27 days 11 hours'),

('f0002700-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','maintenance',
 'Broken gate arm in the East Campus garage has been down since last Monday, allowing free entry. Security concerns raised.','resolved','Carlos Rivera','carlos.rivera@uoregon.edu',false, now() - interval '27 days 15 hours'),

('f0002700-0000-0000-0000-000000000003',NULL,'suspicious_activity',
 'Individual distributing unmarked pamphlets near the EMU entrance making students uncomfortable. Content appeared extremist.','dismissed',NULL,NULL,true, now() - interval '27 days 19 hours'),

-- ── DAY 28 ────────────────────────────────────────────────────────────────────
('f0002800-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','vandalism',
 'UO public art installation near Autzen footbridge spray-painted overnight. Repair estimate requested from Facilities.','dismissed','Priya Patel','priya.patel@uoregon.edu',false, now() - interval '28 days 8 hours'),

('f0002800-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000005','noise_complaint',
 'Loud leaf blowers used outside classroom windows during 8am finals period. Blowers eventually moved after faculty request.','dismissed','Jordan Kim','jordan.kim@uoregon.edu',false, now() - interval '28 days 12 hours'),

-- ── DAY 29 ────────────────────────────────────────────────────────────────────
('f0002900-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006','theft',
 'Three musical instruments gone missing from the locked storage room in the Frohnmayer Music building. No signs of forced entry.','resolved','Sam Okafor','sam.okafor@uoregon.edu',false, now() - interval '29 days 10 hours'),

('f0002900-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000007','medical_emergency',
 'Student with known allergy had anaphylactic reaction in the dining hall. EpiPen used. Transported to PeaceHealth. Recovering.','resolved','Taylor White','taylor.white@uoregon.edu',false, now() - interval '29 days 15 hours'),

('f0002900-0000-0000-0000-000000000003',NULL,'fire_hazard',
 'Stairwell sprinkler head in Chapman Hall found leaking, creating a slip hazard. Facilities arrived within the hour.','resolved',NULL,NULL,true, now() - interval '29 days 20 hours'),

-- ── DAY 30 (oldest) ────────────────────────────────────────────────────────────
('f0003000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000008','incident',
 'Student reported being followed from the library to their off-campus apartment. Details passed to UOPD case file #2024-1122.','resolved','Riley Morgan','riley.morgan@uoregon.edu',false, now() - interval '30 days 9 hours'),

('f0003000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000009','harassment',
 'Anonymous emails sent to multiple students in the School of Law with threatening content. IT tracing IP. UOPD notified.','resolved','Avery Brooks','avery.brooks@uoregon.edu',false, now() - interval '30 days 13 hours'),

('f0003000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000010','suspicious_activity',
 'Unfamiliar person tailgating through the secured entrance to the CIS building three consecutive mornings between 7:45-8am.','dismissed','Jamie Nguyen','jamie.nguyen@uoregon.edu',false, now() - interval '30 days 17 hours')

ON CONFLICT (id) DO NOTHING;

-- Refresh materialized views to include new data
REFRESH MATERIALIZED VIEW public.mv_weekly_report_metrics;
REFRESH MATERIALIZED VIEW public.mv_monthly_media_distribution;
