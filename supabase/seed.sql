-- ============================================================
-- TNCC Seed Data — Tamil Nadu Creators Club
-- Realistic development data for testing
-- Run AFTER 001_initial_schema.sql
-- NOTE: Replace placeholder UUIDs with actual auth.users IDs
--       after creating test accounts in Supabase Auth.
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================

INSERT INTO categories (id, name, slug, description) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Graphic Design', 'graphic-design', 'Visual communication and print design'),
  ('c1000000-0000-0000-0000-000000000002', 'Brand Identity', 'brand-identity', 'Logo, brand guidelines, and visual identity systems'),
  ('c1000000-0000-0000-0000-000000000003', 'UI/UX Design', 'ui-ux-design', 'User interface and experience design for apps and websites'),
  ('c1000000-0000-0000-0000-000000000004', 'Web Development', 'web-development', 'Frontend and full-stack web development'),
  ('c1000000-0000-0000-0000-000000000005', 'Video Editing', 'video-editing', 'Post-production and video editing services'),
  ('c1000000-0000-0000-0000-000000000006', 'Motion Graphics', 'motion-graphics', 'Animated graphics and motion design'),
  ('c1000000-0000-0000-0000-000000000007', 'Photography', 'photography', 'Professional photography services'),
  ('c1000000-0000-0000-0000-000000000008', 'Illustration', 'illustration', 'Digital and traditional illustration'),
  ('c1000000-0000-0000-0000-000000000009', 'Animation', 'animation', '2D and 3D animation'),
  ('c1000000-0000-0000-0000-000000000010', 'Social Media', 'social-media', 'Social media design and strategy'),
  ('c1000000-0000-0000-0000-000000000011', 'Content Creation', 'content-creation', 'Written and multimedia content creation'),
  ('c1000000-0000-0000-0000-000000000012', 'Marketing', 'marketing', 'Digital marketing and advertising'),
  ('c1000000-0000-0000-0000-000000000013', 'Music Production', 'music-production', 'Audio production and sound design')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SKILLS
-- ============================================================

INSERT INTO skills (id, name, slug, category_id) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'Photoshop', 'photoshop', 'c1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000002', 'Illustrator', 'illustrator', 'c1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000003', 'Figma', 'figma', 'c1000000-0000-0000-0000-000000000003'),
  ('s1000000-0000-0000-0000-000000000004', 'After Effects', 'after-effects', 'c1000000-0000-0000-0000-000000000006'),
  ('s1000000-0000-0000-0000-000000000005', 'Premiere Pro', 'premiere-pro', 'c1000000-0000-0000-0000-000000000005'),
  ('s1000000-0000-0000-0000-000000000006', 'Blender', 'blender', 'c1000000-0000-0000-0000-000000000009'),
  ('s1000000-0000-0000-0000-000000000007', 'Branding', 'branding', 'c1000000-0000-0000-0000-000000000002'),
  ('s1000000-0000-0000-0000-000000000008', 'Typography', 'typography', 'c1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000009', 'Logo Design', 'logo-design', 'c1000000-0000-0000-0000-000000000002'),
  ('s1000000-0000-0000-0000-000000000010', 'Social Media Design', 'social-media-design', 'c1000000-0000-0000-0000-000000000010'),
  ('s1000000-0000-0000-0000-000000000011', 'UI Design', 'ui-design', 'c1000000-0000-0000-0000-000000000003'),
  ('s1000000-0000-0000-0000-000000000012', 'Motion Design', 'motion-design', 'c1000000-0000-0000-0000-000000000006'),
  ('s1000000-0000-0000-0000-000000000013', 'Photography', 'photography-skill', 'c1000000-0000-0000-0000-000000000007'),
  ('s1000000-0000-0000-0000-000000000014', 'Video Editing', 'video-editing-skill', 'c1000000-0000-0000-0000-000000000005'),
  ('s1000000-0000-0000-0000-000000000015', 'React', 'react', 'c1000000-0000-0000-0000-000000000004'),
  ('s1000000-0000-0000-0000-000000000016', 'Next.js', 'nextjs', 'c1000000-0000-0000-0000-000000000004'),
  ('s1000000-0000-0000-0000-000000000017', 'Copywriting', 'copywriting', 'c1000000-0000-0000-0000-000000000011'),
  ('s1000000-0000-0000-0000-000000000018', 'Product Photography', 'product-photography', 'c1000000-0000-0000-0000-000000000007'),
  ('s1000000-0000-0000-0000-000000000019', 'Indesign', 'indesign', 'c1000000-0000-0000-0000-000000000001'),
  ('s1000000-0000-0000-0000-000000000020', 'Content Strategy', 'content-strategy', 'c1000000-0000-0000-0000-000000000011')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- NOTE: The following seed data uses placeholder profile IDs.
-- To use this with real authentication, you need to:
-- 1. Create accounts in Supabase Auth (Dashboard → Auth → Users)
-- 2. Replace the placeholder UUIDs below with the actual user IDs
-- 3. Re-run the seed for profiles, freelancer_profiles, etc.
--
-- For initial testing without auth, run the INSERT statements
-- commented out below, or use Supabase's table editor.
-- ============================================================

-- ============================================================
-- SAMPLE PROJECTS (public data, no auth required for read)
-- Requires: valid client_id UUIDs from auth users
-- ============================================================

-- These are example INSERT statements to run AFTER creating
-- real auth users. Replace UUIDs with actual user IDs:

/*
-- Example after creating users in Supabase Auth:

INSERT INTO profiles (id, full_name, username, location, bio) VALUES
  ('PUT_REAL_UUID_HERE', 'Karthik Selvam', 'karthikselvam', 'Chennai', 'Brand designer specializing in startup identities'),
  ('PUT_REAL_UUID_HERE', 'Deepika Rajan', 'deepikarajan', 'Vellore', 'Content creator and social media strategist'),
  ('PUT_REAL_UUID_HERE', 'Priya Natarajan', 'priyanatarajan', 'Coimbatore', 'UI/UX designer with 4 years experience'),
  ('PUT_REAL_UUID_HERE', 'Arun Kumar', 'arunkumar', 'Madurai', 'Motion graphics and video editor'),
  ('PUT_REAL_UUID_HERE', 'Meena Krishnamurthy', 'meenakrishna', 'Trichy', 'Illustrator and character designer'),
  ('PUT_REAL_UUID_HERE', 'Vijay Prakash', 'vijayprakash', 'Salem', 'Full-stack developer and web designer'),
  ('PUT_REAL_UUID_HERE', 'Anitha Subramaniam', 'anithasubra', 'Tiruppur', 'Fashion and lifestyle photographer'),
  ('PUT_REAL_UUID_HERE', 'Bala Murugan', 'balamurugan', 'Erode', 'Logo designer and brand strategist'),
  ('PUT_REAL_UUID_HERE', 'Kavitha Ramesh', 'kavitharamesh', 'Tirunelveli', 'Social media designer and content creator'),
  ('PUT_REAL_UUID_HERE', 'Senthil Nathan', 'senthilnathan', 'Chennai', 'Animation and 3D artist')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (client_id, title, category_id, description, budget_min, budget_max, deadline, location, status) VALUES
  ('CLIENT_UUID_1', 'Brand Identity for Organic Food Startup', 'c1000000-0000-0000-0000-000000000002', 'We need a complete brand identity for our organic food startup based in Chennai. This includes logo, color palette, typography, business cards, and brand guidelines. We want a fresh, earthy, and modern feel.', 15000, 25000, '2026-09-30', 'Chennai', 'open'),
  ('CLIENT_UUID_1', 'E-commerce Website for Traditional Jewelry', 'c1000000-0000-0000-0000-000000000004', 'Looking for an experienced web developer to build a full e-commerce website for our traditional Tamil jewelry brand. Must include product listings, cart, payments (Razorpay), and admin panel.', 40000, 80000, '2026-10-15', 'Coimbatore', 'open'),
  ('CLIENT_UUID_2', 'Product Video for Mobile App Launch', 'c1000000-0000-0000-0000-000000000005', 'We are launching a fintech mobile app and need a 60-second product explainer video. The video should be modern, engaging, and highlight key features. Looking for someone with motion graphics skills.', 12000, 20000, '2026-09-15', 'Chennai', 'open'),
  ('CLIENT_UUID_2', 'Social Media Templates for Restaurant Chain', 'c1000000-0000-0000-0000-000000000010', 'Seeking a social media designer to create a set of 30 Instagram post templates for our restaurant chain. Must match our existing brand (dark wood, gold accents). Editable in Canva.', 8000, 15000, '2026-09-20', 'Madurai', 'open'),
  ('CLIENT_UUID_3', 'Photography for Textile Showroom Launch', 'c1000000-0000-0000-0000-000000000007', 'Need professional photographs for our newly renovated silk saree showroom in Kanchipuram. This includes interior shots, product photography, and lifestyle photos with models.', 20000, 35000, '2026-09-10', 'Kanchipuram', 'open'),
  ('CLIENT_UUID_3', 'UI Design for EdTech Platform', 'c1000000-0000-0000-0000-000000000003', 'We are building a Tamil language learning platform and need a skilled UI/UX designer. The platform needs to work for students aged 6-14. Looking for clean, engaging, child-friendly design.', 30000, 50000, '2026-10-31', 'Chennai', 'open'),
  ('CLIENT_UUID_4', 'Illustration Set for Childrenbook', 'c1000000-0000-0000-0000-000000000008', 'We are publishing a Tamil childrens book about folklore stories. Need 15 full-page illustrations in a colorful, warm art style. Watercolor or digital that looks like watercolor preferred.', 25000, 45000, '2026-10-30', 'Trichy', 'open'),
  ('CLIENT_UUID_4', 'Motion Graphic Ads for Diwali Campaign', 'c1000000-0000-0000-0000-000000000006', 'We need 5 short animated advertisements (15 seconds each) for our Diwali campaign. Products are traditional lights and diyas. Must be vibrant, festive, and suitable for Instagram and Facebook.', 18000, 30000, '2026-09-25', 'Salem', 'open'),
  ('CLIENT_UUID_5', 'Brand Refresh for Coimbatore Manufacturing Company', 'c1000000-0000-0000-0000-000000000002', 'Our 20-year-old manufacturing company needs a brand refresh. We want to modernize our logo, update our brand colors, and create new marketing collateral. Must retain some connection to our heritage.', 35000, 60000, '2026-11-15', 'Coimbatore', 'open'),
  ('CLIENT_UUID_5', 'Website Redesign for Logistics Company', 'c1000000-0000-0000-0000-000000000004', 'Looking for a talented web developer to redesign our outdated corporate website. The new site needs to be modern, fast, and include a shipment tracking portal. Integration with our existing CRM is needed.', 50000, 90000, '2026-11-30', 'Chennai', 'open'),
  ('CLIENT_UUID_6', 'Event Photography for Tech Conference', 'c1000000-0000-0000-0000-000000000007', 'We are hosting a 2-day tech conference in Chennai with 500+ attendees. Need an experienced event photographer for both days. Should cover keynotes, networking sessions, and award ceremony.', 15000, 25000, '2026-09-05', 'Chennai', 'open'),
  ('CLIENT_UUID_6', 'Packaging Design for Handmade Soaps', 'c1000000-0000-0000-0000-000000000001', 'We make handmade natural soaps and need packaging design for 12 variants. Labels must be print-ready and convey natural, artisanal quality. Should look premium enough for gifting market.', 10000, 18000, '2026-09-28', 'Tiruppur', 'open'),
  ('CLIENT_UUID_7', 'Content Writing for Ayurveda Brand', 'c1000000-0000-0000-0000-000000000011', 'Looking for a bilingual (Tamil and English) content writer for our Ayurveda wellness brand. Need website content (10 pages), 20 blog posts, and product descriptions for 50 products.', 20000, 35000, '2026-10-20', 'Erode', 'open'),
  ('CLIENT_UUID_7', 'Animation for NGO Awareness Campaign', 'c1000000-0000-0000-0000-000000000009', 'An NGO in Tirunelveli needs a 2-minute animated video about water conservation for rural Tamil Nadu. Must be in Tamil, simple to understand, and suitable for village-level screenings.', 15000, 25000, '2026-09-30', 'Tirunelveli', 'open'),
  ('CLIENT_UUID_8', '3D Product Renders for Furniture Brand', 'c1000000-0000-0000-0000-000000000009', 'We manufacture premium wooden furniture and need 3D photorealistic renders of 20 products for our e-commerce catalog. We will provide technical drawings and material references.', 30000, 55000, '2026-10-15', 'Vellore', 'open')
ON CONFLICT DO NOTHING;

INSERT INTO events (organizer_id, title, event_type, start_date, end_date, location, is_online, capacity, description, status) VALUES
  ('ORGANIZER_UUID_1', 'TNCC Design Meetup Chennai — August Edition', 'meetup', '2026-08-25 18:00:00+05:30', '2026-08-25 21:00:00+05:30', 'The Hub, Nungambakkam, Chennai', FALSE, 80, 'Monthly meetup for designers and creatives in Chennai. This edition focuses on branding for D2C brands. Three speakers, networking, and design portfolio reviews.', 'upcoming'),
  ('ORGANIZER_UUID_1', 'Figma Workshop: Advanced Prototyping', 'workshop', '2026-09-06 10:00:00+05:30', '2026-09-06 17:00:00+05:30', 'NASSCOM CoE, Taramani, Chennai', FALSE, 40, 'Full-day hands-on Figma workshop covering advanced auto-layout, component systems, interactive prototyping, and developer handoff. Suitable for intermediate designers.', 'upcoming'),
  ('ORGANIZER_UUID_2', 'Freelancer Finance Masterclass', 'workshop', '2026-09-12 11:00:00+05:30', '2026-09-12 14:00:00+05:30', 'Online (Zoom)', TRUE, 200, 'How to price your creative work, manage invoices, handle taxes as a freelancer in India, and build recurring income streams. Guest speaker: CA specializing in creative professionals.', 'upcoming'),
  ('ORGANIZER_UUID_2', 'Tamil Nadu Creators Summit 2026', 'conference', '2026-10-18 09:00:00+05:30', '2026-10-19 18:00:00+05:30', 'Chennai Trade Centre, Nandambakkam', FALSE, 500, 'The flagship annual gathering of Tamil Nadu creative professionals. Two days of talks, workshops, exhibitions, and networking. Features top creators from across Tamil Nadu.', 'upcoming'),
  ('ORGANIZER_UUID_3', 'Brand Photography Masterclass', 'workshop', '2026-09-20 10:00:00+05:30', '2026-09-20 16:00:00+05:30', 'KG Foto Studio, RS Puram, Coimbatore', FALSE, 25, 'A practical masterclass on product and brand photography. Learn lighting setups, color grading, and how to create compelling product images that sell. Bring your camera.', 'upcoming'),
  ('ORGANIZER_UUID_3', 'Motion Graphics Bootcamp — After Effects', 'workshop', '2026-09-27 09:30:00+05:30', '2026-09-28 17:30:00+05:30', 'Design District, Anna Nagar, Chennai', FALSE, 30, 'Two-day intensive bootcamp covering After Effects fundamentals to advanced techniques. Topics: kinetic typography, logo animation, explainer video production, and export for social media.', 'upcoming'),
  ('ORGANIZER_UUID_4', 'Coimbatore Creatives Mixer', 'meetup', '2026-09-05 17:30:00+05:30', '2026-09-05 20:30:00+05:30', 'Cheran Towers Rooftop, Race Course, Coimbatore', FALSE, 60, 'Monthly casual networking event for Coimbatore creatives. Bring your portfolio. A great chance to connect with other designers, photographers, and content creators in the region.', 'upcoming'),
  ('ORGANIZER_UUID_4', 'Logo Design Challenge — 48hrs', 'hackathon', '2026-10-03 09:00:00+05:30', '2026-10-05 09:00:00+05:30', 'Online (Discord + Figma)', TRUE, 150, 'A 48-hour creative challenge where participants design a logo for a fictional Tamil Nadu brand. Judged by industry professionals. Prizes worth ₹50,000. Open to all skill levels.', 'upcoming')
ON CONFLICT DO NOTHING;
*/

-- ============================================================
-- DIRECT INSERT for categories and skills ONLY
-- (Categories and skills don't require auth users)
-- These are safe to run immediately after schema creation.
-- ============================================================

-- Already inserted above. To verify, run:
-- SELECT * FROM categories;
-- SELECT * FROM skills;
