import {
  CommunityMember,
  CommunityPost,
  PostComment,
  CommunityResource,
  CommunityChallenge,
  ChallengeSubmission,
  PortfolioProject,
  CommunityJobOffer,
  CommunityEvent,
  XPTransaction,
  CommunityNotification,
  MemberRole,
} from './types';
import { xpEngine } from './xp-engine';
import { checkIsAdmin } from './admin-config';

// Initial realistic seed members across Tamil Nadu
export const INITIAL_MEMBERS: CommunityMember[] = [
  {
    id: 'mem-1',
    member_id: 'TNCC-2026-001',
    username: 'karthik_visuals',
    full_name: 'Karthik Subramanian',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Brand identity designer & typography enthusiast from Chennai. Building soulful Tamil typefaces.',
    location: 'Chennai, Tamil Nadu',
    skills: ['Brand Identity', 'Typography', 'Tamil Lettering', 'Illustrator'],
    instagram_url: 'https://instagram.com/karthik_visuals',
    behance_url: 'https://behance.net/karthikvisuals',
    website_url: 'https://karthik.design',
    total_xp: 840,
    role: 'member',
    created_at: '2026-01-10T10:00:00Z',
    posts_count: 14,
    wins_count: 3,
    challenges_count: 8,
  },
  {
    id: 'mem-2',
    member_id: 'TNCC-2026-002',
    username: 'ananya_frames',
    full_name: 'Ananya Raghavan',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cinema colorist & motion designer from Coimbatore. Passionate about narrative pacing and neo-noir palettes.',
    location: 'Coimbatore, Tamil Nadu',
    skills: ['Color Grading', 'DaVinci Resolve', 'Motion Graphics', 'Cinematography'],
    instagram_url: 'https://instagram.com/ananya_frames',
    behance_url: 'https://behance.net/ananyaframes',
    total_xp: 720,
    role: 'member',
    created_at: '2026-01-15T11:30:00Z',
    posts_count: 11,
    wins_count: 2,
    challenges_count: 6,
  },
  {
    id: 'mem-3',
    member_id: 'TNCC-2026-003',
    username: 'sundar_pixels',
    full_name: 'Sundaramoorthy M.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    bio: 'Generative AI artist & 3D visualizer based in Madurai. Exploring Tamil folklore through Midjourney & Blender.',
    location: 'Madurai, Tamil Nadu',
    skills: ['AI Art', 'Midjourney', 'Blender 3D', 'Concept Art'],
    instagram_url: 'https://instagram.com/sundar_pixels',
    behance_url: 'https://behance.net/sundarpixels',
    total_xp: 610,
    role: 'member',
    created_at: '2026-02-01T08:00:00Z',
    posts_count: 9,
    wins_count: 1,
    challenges_count: 5,
  },
  {
    id: 'mem-current',
    member_id: 'TNCC-2026-007',
    username: 'naveen_creator',
    full_name: 'Naveen Kumar',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    bio: 'Graphic designer & digital creator from Tiruchirappalli. Love poster design, packaging & creative meetups.',
    location: 'Trichy, Tamil Nadu',
    skills: ['Poster Design', 'Photoshop', 'Packaging Design', 'UI/UX'],
    instagram_url: 'https://instagram.com/naveen_creator',
    behance_url: 'https://behance.net/naveencreations',
    linkedin_url: 'https://linkedin.com/in/naveen-creator',
    total_xp: 245,
    role: 'member',
    created_at: '2026-02-12T09:15:00Z',
    posts_count: 4,
    wins_count: 1,
    challenges_count: 3,
  },
  {
    id: 'mem-4',
    member_id: 'TNCC-2026-004',
    username: 'priya_designs',
    full_name: 'Priya Dharshini',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    bio: 'Product designer & design systems specialist from Coimbatore. Creating accessible digital interfaces.',
    location: 'Coimbatore, Tamil Nadu',
    skills: ['UI/UX', 'Figma', 'Design Systems', 'Mobile Apps'],
    instagram_url: 'https://instagram.com/priya_designs',
    behance_url: 'https://behance.net/priyadharshini',
    total_xp: 580,
    role: 'member',
    created_at: '2026-02-18T10:00:00Z',
    posts_count: 7,
    wins_count: 1,
    challenges_count: 4,
  },
  {
    id: 'mem-5',
    member_id: 'TNCC-2026-005',
    username: 'vicky_films',
    full_name: 'Vigneshwaran K.',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    bio: 'Indie filmmaker & commercial cinematographer from Tirunelveli. Dedicated to South Indian grassroots stories.',
    location: 'Tirunelveli, Tamil Nadu',
    skills: ['Cinematography', 'Video Editing', 'DaVinci Resolve', 'Directing'],
    instagram_url: 'https://instagram.com/vicky_films',
    behance_url: 'https://behance.net/vigneshwarank',
    total_xp: 520,
    role: 'member',
    created_at: '2026-02-22T14:30:00Z',
    posts_count: 6,
    wins_count: 1,
    challenges_count: 4,
  },
  {
    id: 'mem-6',
    member_id: 'TNCC-2026-006',
    username: 'meera_letters',
    full_name: 'Meera Natesan',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    bio: 'Traditional and digital Tamil calligrapher from Thanjavur. Reviving classical temple inscriptions.',
    location: 'Thanjavur, Tamil Nadu',
    skills: ['Tamil Lettering', 'Calligraphy', 'Illustration', 'Print Design'],
    instagram_url: 'https://instagram.com/meera_letters',
    behance_url: 'https://behance.net/meeranatesan',
    total_xp: 480,
    role: 'member',
    created_at: '2026-03-01T08:00:00Z',
    posts_count: 5,
    wins_count: 0,
    challenges_count: 3,
  },
  {
    id: 'mem-7',
    member_id: 'TNCC-2026-008',
    username: 'ashwin_3d',
    full_name: 'Ashwin Kumar',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    bio: '3D environment artist & motion graphic designer based in Chennai. Creating octane renders and futuristic scenes.',
    location: 'Chennai, Tamil Nadu',
    skills: ['Blender 3D', 'Motion Graphics', 'Octane Render', 'After Effects'],
    instagram_url: 'https://instagram.com/ashwin_3d',
    behance_url: 'https://behance.net/ashwin3d',
    total_xp: 450,
    role: 'member',
    created_at: '2026-03-05T12:00:00Z',
    posts_count: 5,
    wins_count: 0,
    challenges_count: 3,
  },
  {
    id: 'mem-8',
    member_id: 'TNCC-2026-009',
    username: 'divya_brand',
    full_name: 'Divya Bharathi',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    bio: 'Brand identity strategist and retail packaging specialist from Salem. Building sustainable D2C brand narratives.',
    location: 'Salem, Tamil Nadu',
    skills: ['Branding', 'Packaging Design', 'Logo Design', 'Typography'],
    instagram_url: 'https://instagram.com/divya_brand',
    behance_url: 'https://behance.net/divyabharathi',
    total_xp: 390,
    role: 'member',
    created_at: '2026-03-10T09:00:00Z',
    posts_count: 4,
    wins_count: 0,
    challenges_count: 2,
  },
  {
    id: 'mem-9',
    member_id: 'TNCC-2026-010',
    username: 'harish_lens',
    full_name: 'Harish Balaji',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    bio: 'Documentary and street photographer from Madurai. Capturing authentic heritage culture and bustling temple festivals.',
    location: 'Madurai, Tamil Nadu',
    skills: ['Photography', 'Street Photography', 'Lightroom', 'Editorial'],
    instagram_url: 'https://instagram.com/harish_lens',
    behance_url: 'https://behance.net/harishbalaji',
    total_xp: 340,
    role: 'member',
    created_at: '2026-03-14T15:00:00Z',
    posts_count: 4,
    wins_count: 0,
    challenges_count: 2,
  },
  {
    id: 'mem-10',
    member_id: 'TNCC-2026-011',
    username: 'kavitha_art',
    full_name: 'Kavitha S.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    bio: 'Visual artist & digital concept illustrator based in Erode. Blending surrealism with ancient Tamil Dravidian motifs.',
    location: 'Erode, Tamil Nadu',
    skills: ['Illustration', 'Concept Art', 'AI Art', 'Photoshop'],
    instagram_url: 'https://instagram.com/kavitha_art',
    behance_url: 'https://behance.net/kavithas',
    total_xp: 290,
    role: 'member',
    created_at: '2026-03-18T11:00:00Z',
    posts_count: 3,
    wins_count: 0,
    challenges_count: 2,
  },
  {
    id: 'mem-11',
    member_id: 'TNCC-2026-012',
    username: 'saravanan_edit',
    full_name: 'Saravanan P.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    bio: 'Commercial video editor and motion colorist from Vellore. Fast-paced OTT trailers, brand reels, and music videos.',
    location: 'Vellore, Tamil Nadu',
    skills: ['Video Editing', 'Premiere Pro', 'After Effects', 'Sound Design'],
    instagram_url: 'https://instagram.com/saravanan_edit',
    behance_url: 'https://behance.net/saravananp',
    total_xp: 210,
    role: 'member',
    created_at: '2026-03-22T16:00:00Z',
    posts_count: 3,
    wins_count: 0,
    challenges_count: 1,
  },
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    member_id: 'mem-1',
    author: {
      username: 'karthik_visuals',
      full_name: 'Karthik Subramanian',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      location: 'Chennai, Tamil Nadu',
      total_xp: 840,
    },
    caption: 'Experimental Tamil typography poster: "முயற்சி தன் மெய்வருத்தக் கூலி தரும்". Crafted using custom glyph ligatures in Illustrator and finished with vintage risograph grain textures. What do you all think?',
    media_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'portrait',
    hashtags: ['#TamilTypography', '#PosterDesign', '#TNCCShowcase', '#Illustrator'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 48,
    comments_count: 6,
    saves_count: 14,
    created_at: '2026-10-28T14:20:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-2',
    member_id: 'mem-2',
    author: {
      username: 'ananya_frames',
      full_name: 'Ananya Raghavan',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      location: 'Coimbatore, Tamil Nadu',
      total_xp: 720,
    },
    caption: 'Color grade breakdown for our recent indie short shot in Valparai tea estates. Moody teal-orange palette converted into muted filmic tones with Kodachrome 64 emulations. Link to raw project files in resources!',
    media_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#ColorGrading', '#DaVinciResolve', '#Cinematography', '#TamilCinema'],
    category: 'Video Editing',
    is_showcase: true,
    likes_count: 36,
    comments_count: 4,
    saves_count: 9,
    created_at: '2026-10-29T09:40:00Z',
    is_liked: true,
    is_saved: true,
  },
  {
    id: 'post-3',
    member_id: 'mem-3',
    author: {
      username: 'sundar_pixels',
      full_name: 'Sundaramoorthy M.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      location: 'Madurai, Tamil Nadu',
      total_xp: 610,
    },
    caption: 'Quick question for creators: Which AI upscaler are you finding cleanest for 300 DPI print output — Magnific, Topaz Gigapixel, or Krea? Testing for our upcoming Madurai art gallery exhibition.',
    media_type: 'none',
    aspect_ratio: 'square',
    hashtags: ['#CreativeDiscussion', '#AIArt', '#PrintTech', '#CreatorsCommunity'],
    category: 'Discussion',
    is_showcase: false,
    likes_count: 22,
    comments_count: 11,
    saves_count: 5,
    created_at: '2026-10-29T16:15:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-4',
    member_id: 'mem-current',
    author: {
      username: 'naveen_creator',
      full_name: 'Naveen Kumar',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      location: 'Trichy, Tamil Nadu',
      total_xp: 245,
    },
    caption: 'Rebranded a traditional filter coffee roastery from Kumbakonam. Aimed for clean modern minimalism while keeping the heritage copper brass aesthetic alive.',
    media_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'square',
    hashtags: ['#Branding', '#PackagingDesign', '#KumbakonamCoffee', '#Showcase'],
    category: 'Branding',
    is_showcase: true,
    likes_count: 29,
    comments_count: 5,
    saves_count: 8,
    created_at: '2026-10-30T04:30:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-5',
    member_id: 'mem-3',
    author: {
      username: 'sundar_pixels',
      full_name: 'Sundaramoorthy M.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      location: 'Madurai, Tamil Nadu',
      total_xp: 610,
    },
    caption: 'Mythological AI Art: "வீர வாள் வீரன் — Ancient Tamil Chola Warrior". Rendered via Midjourney v6 + Blender 3D lighting pass.',
    media_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#TamilFolklore', '#Midjourney', '#AIArt', '#Blender3D', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 53,
    comments_count: 8,
    saves_count: 17,
    created_at: '2026-10-27T18:00:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-6',
    member_id: 'mem-4',
    author: {
      username: 'priya_designs',
      full_name: 'Priya Dharshini',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      location: 'Coimbatore, Tamil Nadu',
      total_xp: 580,
    },
    caption: 'Fintech mobile app design system crafted in Figma for Tamil Nadu micro-retailers. High-contrast typography & bilingual flow.',
    media_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#UIUX', '#DesignSystems', '#Figma', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 42,
    comments_count: 5,
    saves_count: 12,
    created_at: '2026-10-26T11:00:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-7',
    member_id: 'mem-5',
    author: {
      username: 'vicky_films',
      full_name: 'Vigneshwaran K.',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      location: 'Tirunelveli, Tamil Nadu',
      total_xp: 520,
    },
    caption: 'Cinematic color frames from our independent short film shot around the Tamirabarani river basin. Graded with custom film halation.',
    media_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#Cinematography', '#ColorGrading', '#TamilFilms', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 38,
    comments_count: 4,
    saves_count: 11,
    created_at: '2026-10-25T14:00:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-8',
    member_id: 'mem-6',
    author: {
      username: 'meera_letters',
      full_name: 'Meera Natesan',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      location: 'Thanjavur, Tamil Nadu',
      total_xp: 480,
    },
    caption: 'Classical Tamil calligraphy lettering: "யாதும் ஊரே யாவரும் கேளிர்". Hand-inked on handmade rice paper and vectorized.',
    media_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'square',
    hashtags: ['#TamilLettering', '#Calligraphy', '#HandLettering', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 61,
    comments_count: 9,
    saves_count: 22,
    created_at: '2026-10-24T16:30:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-9',
    member_id: 'mem-7',
    author: {
      username: 'ashwin_3d',
      full_name: 'Ashwin Kumar',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      location: 'Chennai, Tamil Nadu',
      total_xp: 450,
    },
    caption: 'Futuristic sci-fi corridor modeled in Blender and rendered with Octane. Exploring neo-cyberpunk lighting with Dravidian architectural motifs.',
    media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#Blender3D', '#3DArt', '#OctaneRender', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 49,
    comments_count: 7,
    saves_count: 15,
    created_at: '2026-10-23T18:45:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-10',
    member_id: 'mem-8',
    author: {
      username: 'divya_brand',
      full_name: 'Divya Bharathi',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      location: 'Salem, Tamil Nadu',
      total_xp: 390,
    },
    caption: 'Organic mango preserves packaging and custom typography identity designed for a Salem agro-heritage cooperative brand.',
    media_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'square',
    hashtags: ['#PackagingDesign', '#Branding', '#SalemMango', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 36,
    comments_count: 3,
    saves_count: 9,
    created_at: '2026-10-22T12:15:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-11',
    member_id: 'mem-9',
    author: {
      username: 'harish_lens',
      full_name: 'Harish Balaji',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      location: 'Madurai, Tamil Nadu',
      total_xp: 340,
    },
    caption: 'Golden hour street capture near the Madurai Meenakshi Temple towers. Shot on Fuji X-T4 with Kodak Portra 400 simulation.',
    media_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#StreetPhotography', '#Madurai', '#FujiFilm', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 55,
    comments_count: 6,
    saves_count: 19,
    created_at: '2026-10-21T09:30:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-12',
    member_id: 'mem-10',
    author: {
      username: 'kavitha_art',
      full_name: 'Kavitha S.',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      location: 'Erode, Tamil Nadu',
      total_xp: 290,
    },
    caption: 'Surrealist Tamil folk deity concept illustration in Procreate & Photoshop. Exploring vibrant turmeric and vermilion color palettes.',
    media_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'portrait',
    hashtags: ['#ConceptArt', '#Illustration', '#DigitalArt', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 31,
    comments_count: 4,
    saves_count: 8,
    created_at: '2026-10-20T15:20:00Z',
    is_liked: false,
    is_saved: false,
  },
  {
    id: 'post-13',
    member_id: 'mem-11',
    author: {
      username: 'saravanan_edit',
      full_name: 'Saravanan P.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      location: 'Vellore, Tamil Nadu',
      total_xp: 210,
    },
    caption: 'Rapid speed-ramp commercial edit for an indie electronic music festival in Vellore. Cut to the beat with dynamic zoom transitions.',
    media_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    aspect_ratio: 'landscape',
    hashtags: ['#VideoEditing', '#MotionDesign', '#MusicReel', '#TNCCShowcase'],
    category: 'Showcase',
    is_showcase: true,
    likes_count: 27,
    comments_count: 2,
    saves_count: 6,
    created_at: '2026-10-19T17:10:00Z',
    is_liked: false,
    is_saved: false,
  },
];

export const INITIAL_RESOURCES: CommunityResource[] = [
  {
    id: 'res-1',
    title: 'Tamil Display Typography Pack (5 Free Fonts)',
    description: 'High-contrast Tamil display fonts tailored for film posters, YouTube thumbnails, and modern branding. Free for commercial & personal projects.',
    category: 'Downloads',
    resource_type: 'Font Pack',
    thumbnail_url: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=800&q=80',
    external_url: 'https://drive.google.com/drive/folders/tncc-tamil-fonts-pack',
    is_google_drive: true,
    download_count: 1420,
    published_date: '2026-10-15',
  },
  {
    id: 'res-2',
    title: 'Cinematic DaVinci Resolve LUTs — Tamil Film Grade Pack',
    description: '10 custom .cube 3D LUTs crafted to replicate warm Kodachrome and moody Chennai neo-noir tones for indie short films.',
    category: 'Downloads',
    resource_type: 'LUTs Pack',
    thumbnail_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    external_url: 'https://drive.google.com/drive/folders/tncc-cinematic-luts',
    is_google_drive: true,
    download_count: 890,
    published_date: '2026-10-18',
  },
  {
    id: 'res-3',
    title: 'Fontshare — 100% Free High-Quality Modern Typefaces',
    description: 'Professional font service by the Indian Type Foundry offering free, world-class fonts for editorial and web design.',
    category: 'Useful Websites',
    resource_type: 'Curated Tool',
    thumbnail_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    external_url: 'https://www.fontshare.com',
    is_google_drive: false,
    download_count: 654,
    published_date: '2026-10-20',
  },
  {
    id: 'res-4',
    title: 'Photoshop 2026 Masterclass: Risograph & Vintage Texture Systems',
    description: 'Full 45-minute deep dive on constructing non-destructive halftone patterns, offset print errors, and paper textures.',
    category: 'Feeds / Videos',
    resource_type: 'Video Tutorial',
    thumbnail_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    external_url: 'https://youtube.com/watch?v=sample-tncc-masterclass',
    is_google_drive: false,
    download_count: 512,
    published_date: '2026-10-22',
  },
  {
    id: 'res-5',
    title: 'How to Price Your Creative Work as a Tamil Nadu Freelancer',
    description: 'Comprehensive guide covering day rates, value-based quoting, GST considerations, and client contract red flags.',
    category: 'Blog Posts',
    resource_type: 'Editorial Guide',
    thumbnail_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    external_url: 'https://medium.com/@tncc/freelance-pricing-guide-tamilnadu',
    is_google_drive: false,
    download_count: 1104,
    published_date: '2026-10-25',
  },
];

export const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'chal-1',
    title: 'Social Media Poster Design Challenge — Tamil Heritage Reimagined',
    description: 'Reimagine a classic Tamil literary work, temple festival, or folk art form as a cutting-edge minimalist festival poster.',
    category: 'Poster Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    reference_images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
    ],
    requirements: [
      'Dimensions: 1080x1350px (Portrait 4:5)',
      'Include Tamil typography or bilingual phrasing',
      'Original vector or raster artwork (no raw AI without human art direction)',
      'Provide exported PNG/JPG and brief design concept statement',
    ],
    rules: [
      'One submission per member',
      'Work must be created specifically for this TNCC challenge',
      'Submissions close sharp at midnight on deadline',
      'Community voting + jury evaluation determines the winners',
    ],
    prizes: {
      first: '₹10,000 Cash + TNCC Golden Trophy + 100 XP',
      second: '₹5,000 Cash + TNCC Certificate + 60 XP',
      third: '₹2,500 Cash + TNCC Certificate + 30 XP',
    },
    xp_reward: 15,
    bonus_xp_first: 100,
    bonus_xp_second: 60,
    bonus_xp_third: 30,
    start_date: '2026-10-20',
    submission_deadline: '2026-11-15T23:59:59Z',
    status: 'Active',
    submissions_count: 42,
    user_submitted: true,
  },
  {
    id: 'chal-2',
    title: 'YouTube Thumbnail Design Challenge — Tech & Cinema',
    description: 'Create an irresistible high-CTR thumbnail for a fictional tech review or cinema critique video with high visual hook.',
    category: 'Thumbnail Design',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    reference_images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    ],
    requirements: [
      '1280x720px (16:9 ratio)',
      'Strong focal character/subject and readable text at mobile size',
      'Maximum 3-4 key focal words',
    ],
    rules: [
      'Clean typography hierarchy',
      'JPG/PNG format under 2MB',
    ],
    prizes: {
      first: '₹7,500 + 100 XP',
      second: '₹3,500 + 60 XP',
      third: '₹1,500 + 30 XP',
    },
    xp_reward: 15,
    bonus_xp_first: 100,
    bonus_xp_second: 60,
    bonus_xp_third: 30,
    start_date: '2026-11-01',
    submission_deadline: '2026-11-25T23:59:59Z',
    status: 'Upcoming',
    submissions_count: 0,
  },
  {
    id: 'chal-3',
    title: 'Minimalist Coffee Brand Identity Challenge',
    description: 'Design a complete brand logo, identity mark, and coffee cup mockup for a modern South Indian filter coffee house.',
    category: 'Branding & Logo',
    thumbnail_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    reference_images: [],
    requirements: ['Logo mark', 'Color palette', '1 realistic packaging mockup'],
    rules: ['Original design only'],
    prizes: {
      first: '₹12,000 + 100 XP',
      second: '₹6,000 + 60 XP',
      third: '₹3,000 + 30 XP',
    },
    xp_reward: 15,
    bonus_xp_first: 100,
    bonus_xp_second: 60,
    bonus_xp_third: 30,
    start_date: '2026-09-01',
    submission_deadline: '2026-09-30T23:59:59Z',
    status: 'Completed',
    submissions_count: 67,
    winners: {
      first: {
        position: 'first',
        member: {
          id: 'mem-1',
          username: 'karthik_visuals',
          full_name: 'Karthik Subramanian',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        submitted_work_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        xp_bonus: 100,
      },
      second: {
        position: 'second',
        member: {
          id: 'mem-current',
          username: 'naveen_creator',
          full_name: 'Naveen Kumar',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        },
        submitted_work_url: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80',
        xp_bonus: 60,
      },
      third: {
        position: 'third',
        member: {
          id: 'mem-3',
          username: 'sundar_pixels',
          full_name: 'Sundaramoorthy M.',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        submitted_work_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        xp_bonus: 30,
      },
    },
  },
];

export const INITIAL_JOBS: CommunityJobOffer[] = [
  {
    id: 'job-1',
    company_name: 'Madras Creative Studio',
    company_logo_url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=200&q=80',
    title: 'Senior Motion Graphic Designer',
    category: 'Motion Graphics',
    location: 'Chennai, Tamil Nadu',
    work_mode: 'Hybrid',
    job_type: 'Full-time',
    salary_range: '₹6,00,000 – ₹9,50,000 / yr',
    description: 'We are looking for an inventive motion designer skilled in After Effects, Cinema 4D/Blender, and 2D kinetic typography for high-impact brand commercial films.',
    required_skills: ['After Effects', 'Cinema 4D', 'Kinetic Typography', 'Premiere Pro'],
    experience_level: '3-5 years',
    responsibilities: [
      'Lead motion graphics for national television commercials and OTT brand campaigns',
      'Collaborate directly with creative director and copywriters',
      'Develop motion design systems and style frames',
    ],
    application_url: 'https://madrascreative.com/careers/motion-designer',
    posted_date: '2026-10-24',
  },
  {
    id: 'job-2',
    company_name: 'Kongu Digital Media',
    company_logo_url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=200&q=80',
    title: 'Visual Identity & Graphic Designer',
    category: 'Graphic Designer',
    location: 'Coimbatore, Tamil Nadu',
    work_mode: 'On-site',
    job_type: 'Full-time',
    salary_range: '₹4,00,000 – ₹6,00,000 / yr',
    description: 'Seeking a talented graphic designer with sharp visual eye for packaging, D2C brand assets, and multi-channel campaign collateral.',
    required_skills: ['Illustrator', 'Photoshop', 'Packaging Design', 'Typography'],
    experience_level: '2-4 years',
    responsibilities: [
      'Craft packaging artworks and die-cuts for retail brands',
      'Build comprehensive brand guideline decks',
    ],
    application_url: 'https://kongudigital.com/apply',
    posted_date: '2026-10-26',
  },
  {
    id: 'job-3',
    company_name: 'Aura Cinema Works',
    company_logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
    title: 'Video Editor & Colorist',
    category: 'Video Editor',
    location: 'Chennai, Tamil Nadu',
    work_mode: 'Remote',
    job_type: 'Freelance',
    salary_range: '₹35,000 – ₹60,000 / project',
    description: 'Editing and color grading independent web series and music videos for digital distribution.',
    required_skills: ['DaVinci Resolve', 'Final Cut Pro', 'Color Grading', 'Sound Design'],
    experience_level: '2+ years',
    responsibilities: [
      'Deliver final color master and sound sync for 4k deliverables',
      'Conform edits from Premiere/FCP into DaVinci',
    ],
    application_url: 'https://auracinema.in/jobs/colorist',
    posted_date: '2026-10-28',
  },
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'event-1',
    title: 'TNCC Chennai Creators Meetup & Portfolio Review 2026',
    description: 'Join 150+ designers, video editors, and indie filmmakers for an afternoon of live critique, lightning talks, and networking.',
    banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-11-20',
    event_time: '04:00 PM – 08:00 PM IST',
    location: 'IIT Madras Research Park, Taramani, Chennai',
    is_online: false,
    registration_url: 'https://lu.ma/tncc-chennai-meetup-2026',
    status: 'Upcoming',
  },
  {
    id: 'event-2',
    title: 'Virtual Masterclass: Next-Gen Typography & AI in Creative Direction',
    description: 'Interactive live session with award-winning Tamil typography designers on modern type systems and AI generative workflows.',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    event_date: '2026-12-05',
    event_time: '06:00 PM – 07:30 PM IST',
    location: 'Zoom / YouTube Live',
    is_online: true,
    registration_url: 'https://lu.ma/tncc-typography-masterclass',
    status: 'Upcoming',
  },
];

// Persistent Database Layer with Indexed Storage and Memory Sync
const STORAGE_PREFIX = 'tncc_comm_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error saving ${key} to storage:`, err);
  }
}

export class CommunityDatabase {
  private members: CommunityMember[] = INITIAL_MEMBERS;
  private posts: CommunityPost[] = INITIAL_POSTS;
  private resources: CommunityResource[] = INITIAL_RESOURCES;
  private challenges: CommunityChallenge[] = INITIAL_CHALLENGES;
  private jobs: CommunityJobOffer[] = INITIAL_JOBS;
  private events: CommunityEvent[] = INITIAL_EVENTS;
  private comments: PostComment[] = [];
  private submissions: ChallengeSubmission[] = [];
  private xpTransactions: XPTransaction[] = [];
  private currentMemberId: string = 'mem-current';
  private followingIds: string[] = ['mem-1', 'mem-2'];

  constructor() {
    this.init();
  }

  public init() {
    this.members = loadFromStorage('members', INITIAL_MEMBERS);
    
    // Seed follower counts guarantee for all members
    const seedFollowers: Record<string, { followers: number; following: number }> = {
      'mem-1': { followers: 1420, following: 184 },
      'mem-2': { followers: 980, following: 210 },
      'mem-3': { followers: 840, following: 145 },
      'mem-current': { followers: 320, following: 78 },
      'mem-4': { followers: 670, following: 156 },
      'mem-5': { followers: 510, following: 132 },
      'mem-6': { followers: 480, following: 110 },
      'mem-7': { followers: 390, following: 95 },
      'mem-8': { followers: 360, following: 82 },
      'mem-9': { followers: 330, following: 74 },
      'mem-10': { followers: 310, following: 68 },
      'mem-11': { followers: 280, following: 55 },
    };

    let membersUpdated = false;
    this.members = this.members.map((m) => {
      const defaultCounts = seedFollowers[m.id] || { followers: 240, following: 60 };
      if (m.followers_count === undefined || m.following_count === undefined) {
        membersUpdated = true;
        return {
          ...m,
          followers_count: m.followers_count ?? defaultCounts.followers,
          following_count: m.following_count ?? defaultCounts.following,
        };
      }
      return m;
    });
    if (membersUpdated) {
      saveToStorage('members', this.members);
    }

    this.posts = loadFromStorage('posts', INITIAL_POSTS);
    this.resources = loadFromStorage('resources', INITIAL_RESOURCES);
    this.challenges = loadFromStorage('challenges', INITIAL_CHALLENGES);
    this.jobs = loadFromStorage('jobs', INITIAL_JOBS);
    this.events = loadFromStorage('events', INITIAL_EVENTS);
    this.comments = loadFromStorage('comments', []);
    this.submissions = loadFromStorage('submissions', []);
    this.xpTransactions = loadFromStorage('xpTransactions', []);
    this.currentMemberId = loadFromStorage('currentMemberId', 'mem-current');
    this.followingIds = loadFromStorage('followingIds', ['mem-1', 'mem-2']);
  }

  // --- Current Member ---
  public getCurrentMember(): CommunityMember {
    const found = this.members.find((m) => m.id === this.currentMemberId);
    return found || this.members[0];
  }

  public setCurrentMemberId(id: string): void {
    this.currentMemberId = id;
    saveToStorage('currentMemberId', id);
  }

  public updateProfile(updated: Partial<CommunityMember>): CommunityMember {
    const current = this.getCurrentMember();
    const newMember = { ...current, ...updated, updated_at: new Date().toISOString() };
    this.members = this.members.map((m) => (m.id === current.id ? newMember : m));
    saveToStorage('members', this.members);

    // Update author data in their posts as well
    this.posts = this.posts.map((p) => {
      if (p.member_id === current.id) {
        return {
          ...p,
          author: {
            ...p.author,
            full_name: newMember.full_name,
            avatar_url: newMember.avatar_url,
            location: newMember.location,
            followers_count: newMember.followers_count,
          },
        };
      }
      return p;
    });
    saveToStorage('posts', this.posts);

    return newMember;
  }

  // --- Authentication & User Management ---
  public registerMember(data: {
    full_name: string;
    username: string;
    email: string;
    password?: string;
    location?: string;
    skills?: string[];
  }): CommunityMember {
    const cleanEmail = data.email.trim().toLowerCase();
    const isAdmin = checkIsAdmin(cleanEmail);

    // Check if member with this email or username already exists
    const existingIndex = this.members.findIndex(
      (m) =>
        (m.email && m.email.toLowerCase() === cleanEmail) ||
        m.username.toLowerCase() === data.username.toLowerCase().trim()
    );

    if (existingIndex !== -1) {
      // Update existing
      this.members[existingIndex] = {
        ...this.members[existingIndex],
        full_name: data.full_name.trim(),
        username: data.username.trim(),
        email: cleanEmail,
        password: data.password || this.members[existingIndex].password,
        location: data.location?.trim() || this.members[existingIndex].location,
        skills: data.skills && data.skills.length > 0 ? data.skills : this.members[existingIndex].skills,
        role: isAdmin ? 'admin' : 'member',
      };
      this.currentMemberId = this.members[existingIndex].id;
      saveToStorage('members', this.members);
      saveToStorage('currentMemberId', this.currentMemberId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tncc_active_user_email', cleanEmail);
      }
      return this.members[existingIndex];
    }

    const newMemberId = `mem-user-${Date.now()}`;
    const newMember: CommunityMember = {
      id: newMemberId,
      member_id: `TNCC-2026-${String(this.members.length + 1).padStart(3, '0')}`,
      username: data.username.trim().replace(/^@/, ''),
      full_name: data.full_name.trim(),
      email: cleanEmail,
      password: data.password,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      cover_url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`,
      bio: 'Tamil Nadu creator crafting impactful visuals and stories.',
      location: data.location?.trim() || 'Chennai, Tamil Nadu',
      skills: data.skills && data.skills.length > 0 ? data.skills : ['Graphic Design', 'Creator'],
      total_xp: isAdmin ? 990 : 50,
      role: isAdmin ? 'admin' : 'member',
      created_at: new Date().toISOString(),
      posts_count: 0,
      wins_count: 0,
      challenges_count: 0,
      followers_count: 0,
      following_count: 0,
    };

    this.members = [newMember, ...this.members];
    this.currentMemberId = newMember.id;
    saveToStorage('members', this.members);
    saveToStorage('currentMemberId', this.currentMemberId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tncc_active_user_email', cleanEmail);
    }
    return newMember;
  }

  public loginMember(
    emailOrUsername: string,
    password?: string
  ): { success: boolean; member?: CommunityMember; error?: string } {
    const clean = emailOrUsername.trim().toLowerCase();
    const isAdmin = checkIsAdmin(clean);

    // Look for existing member
    let member = this.members.find(
      (m) =>
        (m.email && m.email.toLowerCase() === clean) ||
        m.username.toLowerCase() === clean ||
        m.username.toLowerCase() === clean.replace(/^@/, '')
    );

    // If logging in with the authorized admin email (suganeshsugu07@gmail.com) and not in list yet:
    if (!member && isAdmin) {
      member = this.registerMember({
        full_name: 'Suganesh',
        username: 'suganesh_admin',
        email: 'suganeshsugu07@gmail.com',
        password: password || 'admin123',
        location: 'Tamil Nadu',
        skills: ['Community Administrator', 'Creative Direction'],
      });
    }

    if (!member) {
      return {
        success: false,
        error: 'No creator account found with this email. Please click "Create Free Member Profile" below to sign up.',
      };
    }

    // Verify password if one was set during registration
    if (member.password && password && member.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.',
      };
    }

    // Synchronize role with admin authorization
    const roleIsAdmin = checkIsAdmin(member.email || clean);
    member.role = roleIsAdmin ? 'admin' : 'member';
    if (!member.email && clean.includes('@')) {
      member.email = clean;
    }

    this.currentMemberId = member.id;
    saveToStorage('members', this.members);
    saveToStorage('currentMemberId', this.currentMemberId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tncc_active_user_email', member.email || clean);
      localStorage.removeItem('tncc_admin_demo');
    }

    return {
      success: true,
      member,
    };
  }

  // --- Follow System ---
  public getFollowingIds(): string[] {
    return this.followingIds;
  }

  public isFollowing(memberIdOrUsername: string): boolean {
    const member = this.members.find(
      (m) => m.id === memberIdOrUsername || m.username.toLowerCase() === memberIdOrUsername.toLowerCase()
    );
    if (!member) return false;
    return this.followingIds.includes(member.id);
  }

  public toggleFollow(memberIdOrUsername: string): { isFollowing: boolean; targetMember?: CommunityMember } {
    const member = this.members.find(
      (m) => m.id === memberIdOrUsername || m.username.toLowerCase() === memberIdOrUsername.toLowerCase()
    );
    if (!member) return { isFollowing: false };

    const isAlreadyFollowing = this.followingIds.includes(member.id);
    if (isAlreadyFollowing) {
      this.followingIds = this.followingIds.filter((id) => id !== member.id);
      member.followers_count = Math.max(0, (member.followers_count || 1) - 1);
    } else {
      this.followingIds.push(member.id);
      member.followers_count = (member.followers_count || 0) + 1;
    }

    const current = this.getCurrentMember();
    if (current && current.id !== member.id) {
      current.following_count = this.followingIds.length;
    }

    saveToStorage('followingIds', this.followingIds);
    saveToStorage('members', this.members);

    this.posts = this.posts.map((p) => {
      if (p.member_id === member.id || p.author.username === member.username) {
        return {
          ...p,
          author: {
            ...p.author,
            followers_count: member.followers_count,
          },
          is_following: !isAlreadyFollowing,
        };
      }
      return p;
    });
    saveToStorage('posts', this.posts);

    return {
      isFollowing: !isAlreadyFollowing,
      targetMember: member,
    };
  }

  // --- Members & Leaderboard ---
  public getMembers(): CommunityMember[] {
    return [...this.members].sort((a, b) => b.total_xp - a.total_xp);
  }

  public getMemberByUsername(username: string): CommunityMember | undefined {
    return this.members.find((m) => m.username.toLowerCase() === username.toLowerCase());
  }

  // --- Posts & Feed ---
  public getPosts(): CommunityPost[] {
    return this.posts.map((p) => {
      const member = this.members.find((m) => m.id === p.member_id || m.username === p.author.username);
      const followersCount = member?.followers_count ?? p.author.followers_count ?? 240;
      const isFollowing = member ? this.followingIds.includes(member.id) : false;
      return {
        ...p,
        author: {
          ...p.author,
          followers_count: followersCount,
        },
        is_following: isFollowing,
      };
    });
  }

  public createPost(data: {
    caption: string;
    media_url?: string;
    media_type: 'image' | 'video' | 'none';
    aspect_ratio: 'square' | 'portrait' | 'landscape';
    hashtags: string[];
    category: CommunityPost['category'];
    is_showcase: boolean;
  }): { post: CommunityPost; xpAwarded: number } {
    const current = this.getCurrentMember();
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      member_id: current.id,
      author: {
        username: current.username,
        full_name: current.full_name,
        avatar_url: current.avatar_url,
        location: current.location,
        total_xp: current.total_xp,
      },
      caption: data.caption,
      media_url: data.media_url,
      media_type: data.media_type,
      aspect_ratio: data.aspect_ratio,
      hashtags: data.hashtags,
      category: data.category,
      is_showcase: data.is_showcase,
      likes_count: 0,
      comments_count: 0,
      saves_count: 0,
      created_at: new Date().toISOString(),
      is_liked: false,
      is_saved: false,
    };

    this.posts = [newPost, ...this.posts];
    saveToStorage('posts', this.posts);

    // Award +10 XP for publishing an approved creative post
    const xpReward = xpEngine.getPostCreationXP();
    this.awardXP(current.id, xpReward, 'Published Community Post', newPost.id);

    return { post: newPost, xpAwarded: xpReward };
  }

  public toggleLike(postId: string): { post: CommunityPost; liked: boolean; xpEarned: boolean } {
    const current = this.getCurrentMember();
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');

    const post = this.posts[postIndex];
    const isNowLiked = !post.is_liked;
    const newLikesCount = Math.max(0, post.likes_count + (isNowLiked ? 1 : -1));

    this.posts[postIndex] = {
      ...post,
      is_liked: isNowLiked,
      likes_count: newLikesCount,
    };
    saveToStorage('posts', this.posts);

    let xpEarned = false;
    // Anti-farming check: Cannot like own post to earn XP!
    if (isNowLiked && xpEngine.canEarnLikeXP(post.member_id, current.id)) {
      const xpAmount = xpEngine.getLikeReceivedXP();
      const transactionId = `like-${postId}-${current.id}`;
      if (!xpEngine.isDuplicateTransaction(this.xpTransactions, post.member_id, 'Received Like on Post', transactionId)) {
        this.awardXP(post.member_id, xpAmount, 'Received Like on Post', transactionId);
        xpEarned = true;
      }
    }

    return { post: this.posts[postIndex], liked: isNowLiked, xpEarned };
  }

  public toggleSave(postId: string): boolean {
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return false;

    const post = this.posts[postIndex];
    const isNowSaved = !post.is_saved;
    this.posts[postIndex] = {
      ...post,
      is_saved: isNowSaved,
      saves_count: Math.max(0, post.saves_count + (isNowSaved ? 1 : -1)),
    };
    saveToStorage('posts', this.posts);
    return isNowSaved;
  }

  // --- Comments ---
  public getComments(postId: string): PostComment[] {
    return this.comments.filter((c) => c.post_id === postId);
  }

  public addComment(postId: string, text: string): PostComment {
    const current = this.getCurrentMember();
    const comment: PostComment = {
      id: `comm-${Date.now()}`,
      post_id: postId,
      member_id: current.id,
      author: {
        username: current.username,
        full_name: current.full_name,
        avatar_url: current.avatar_url,
      },
      comment_text: text,
      created_at: new Date().toISOString(),
    };

    this.comments = [...this.comments, comment];
    saveToStorage('comments', this.comments);

    // Update comments count on post
    const postIndex = this.posts.findIndex((p) => p.id === postId);
    if (postIndex !== -1) {
      this.posts[postIndex].comments_count += 1;
      saveToStorage('posts', this.posts);
    }

    return comment;
  }

  // --- Resources ---
  public getResources(): CommunityResource[] {
    return [...this.resources];
  }

  // --- Challenges ---
  public getChallenges(): CommunityChallenge[] {
    return [...this.challenges];
  }

  public getChallengeById(id: string): CommunityChallenge | undefined {
    return this.challenges.find((c) => c.id === id);
  }

  public submitChallenge(data: {
    challenge_id: string;
    title: string;
    description?: string;
    submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
    submission_url: string;
  }): { submission: ChallengeSubmission; xpAwarded: number } {
    const current = this.getCurrentMember();
    const submission: ChallengeSubmission = {
      id: `sub-${Date.now()}`,
      challenge_id: data.challenge_id,
      member_id: current.id,
      author: {
        username: current.username,
        full_name: current.full_name,
        avatar_url: current.avatar_url,
      },
      title: data.title,
      description: data.description,
      submission_type: data.submission_type,
      submission_url: data.submission_url,
      submitted_at: new Date().toISOString(),
    };

    this.submissions = [submission, ...this.submissions];
    saveToStorage('submissions', this.submissions);

    // Update challenge submissions count & flag user_submitted
    const chalIndex = this.challenges.findIndex((c) => c.id === data.challenge_id);
    if (chalIndex !== -1) {
      this.challenges[chalIndex].submissions_count = (this.challenges[chalIndex].submissions_count || 0) + 1;
      this.challenges[chalIndex].user_submitted = true;
      saveToStorage('challenges', this.challenges);
    }

    // Award +15 XP for challenge participation (if not already participated)
    const xpReward = xpEngine.getChallengeParticipationXP();
    const actionKey = `challenge-part-${data.challenge_id}`;
    if (!xpEngine.isDuplicateTransaction(this.xpTransactions, current.id, 'Challenge Participation', actionKey)) {
      this.awardXP(current.id, xpReward, 'Challenge Participation', actionKey);
    }

    return { submission, xpAwarded: xpReward };
  }

  public getSubmissionsForChallenge(challengeId: string): ChallengeSubmission[] {
    return this.submissions.filter((s) => s.challenge_id === challengeId);
  }

  // --- Portfolio & Automatic Integration ---
  public getPortfolioProjectsForMember(memberId: string): PortfolioProject[] {
    // 1. Get all posts where is_showcase === true for this member
    const showcasePosts = this.posts.filter((p) => p.member_id === memberId && (p.is_showcase || p.category === 'Showcase'));
    
    // Map them to PortfolioProjects
    const autoProjects: PortfolioProject[] = showcasePosts.map((p) => ({
      id: `port-${p.id}`,
      member_id: p.member_id,
      post_id: p.id,
      title: p.caption.slice(0, 50) + (p.caption.length > 50 ? '...' : ''),
      category: p.category === 'Showcase' ? 'Visual Arts' : p.category,
      preview_url: p.media_url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
      description: p.caption,
      is_featured: true,
      is_hidden: false,
      created_at: p.created_at,
    }));

    return autoProjects;
  }

  // --- Jobs & Events ---
  public getJobs(): CommunityJobOffer[] {
    return [...this.jobs];
  }

  public getEvents(): CommunityEvent[] {
    return [...this.events];
  }

  // --- XP System & Audit ---
  public awardXP(memberId: string, amount: number, reason: string, referenceId?: string): void {
    const tx: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      member_id: memberId,
      amount,
      reason,
      reference_id: referenceId,
      created_at: new Date().toISOString(),
    };

    this.xpTransactions = [tx, ...this.xpTransactions];
    saveToStorage('xpTransactions', this.xpTransactions);

    // Update member's total XP
    const memIndex = this.members.findIndex((m) => m.id === memberId);
    if (memIndex !== -1) {
      this.members[memIndex].total_xp += amount;
      saveToStorage('members', this.members);
    }
  }

  public getXPTransactionsForMember(memberId: string): XPTransaction[] {
    return this.xpTransactions.filter((tx) => tx.member_id === memberId);
  }

  // --- Admin: Resource Management ---
  public addResource(resource: Omit<CommunityResource, 'id'>): CommunityResource {
    const newRes: CommunityResource = {
      ...resource,
      id: `res-${Date.now()}`,
      download_count: resource.download_count ?? 0,
      published_date: resource.published_date || new Date().toISOString().split('T')[0],
    };
    this.resources = [newRes, ...this.resources];
    saveToStorage('resources', this.resources);
    return newRes;
  }

  public updateResource(id: string, data: Partial<CommunityResource>): CommunityResource {
    const index = this.resources.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Resource not found');
    const updated = { ...this.resources[index], ...data };
    this.resources[index] = updated;
    saveToStorage('resources', this.resources);
    return updated;
  }

  public deleteResource(id: string): boolean {
    const prevLen = this.resources.length;
    this.resources = this.resources.filter((r) => r.id !== id);
    saveToStorage('resources', this.resources);
    return this.resources.length < prevLen;
  }

  // --- Admin: Job Offers Management ---
  public addJob(job: Omit<CommunityJobOffer, 'id'>): CommunityJobOffer {
    const newJob: CommunityJobOffer = {
      ...job,
      id: `job-${Date.now()}`,
      posted_date: job.posted_date || new Date().toISOString().split('T')[0],
    };
    this.jobs = [newJob, ...this.jobs];
    saveToStorage('jobs', this.jobs);
    return newJob;
  }

  public updateJob(id: string, data: Partial<CommunityJobOffer>): CommunityJobOffer {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) throw new Error('Job offer not found');
    const updated = { ...this.jobs[index], ...data };
    this.jobs[index] = updated;
    saveToStorage('jobs', this.jobs);
    return updated;
  }

  public deleteJob(id: string): boolean {
    const prevLen = this.jobs.length;
    this.jobs = this.jobs.filter((j) => j.id !== id);
    saveToStorage('jobs', this.jobs);
    return this.jobs.length < prevLen;
  }

  // --- Admin: Events Management ---
  public addEvent(event: Omit<CommunityEvent, 'id'>): CommunityEvent {
    const newEvent: CommunityEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      status: event.status || 'Upcoming',
    };
    this.events = [newEvent, ...this.events];
    saveToStorage('events', this.events);
    return newEvent;
  }

  public updateEvent(id: string, data: Partial<CommunityEvent>): CommunityEvent {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = { ...this.events[index], ...data };
    this.events[index] = updated;
    saveToStorage('events', this.events);
    return updated;
  }

  public deleteEvent(id: string): boolean {
    const prevLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    saveToStorage('events', this.events);
    return this.events.length < prevLen;
  }

  // --- Admin: Challenges & Winner Management ---
  public addChallenge(chal: Omit<CommunityChallenge, 'id'>): CommunityChallenge {
    const newChal: CommunityChallenge = {
      ...chal,
      id: `chal-${Date.now()}`,
      submissions_count: 0,
      user_submitted: false,
      status: chal.status || 'Active',
    };
    this.challenges = [newChal, ...this.challenges];
    saveToStorage('challenges', this.challenges);
    return newChal;
  }

  public updateChallenge(id: string, data: Partial<CommunityChallenge>): CommunityChallenge {
    const index = this.challenges.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Challenge not found');
    const updated = { ...this.challenges[index], ...data };
    this.challenges[index] = updated;
    saveToStorage('challenges', this.challenges);
    return updated;
  }

  public deleteChallenge(id: string): boolean {
    const prevLen = this.challenges.length;
    this.challenges = this.challenges.filter((c) => c.id !== id);
    saveToStorage('challenges', this.challenges);
    return this.challenges.length < prevLen;
  }

  public getAllSubmissions(): ChallengeSubmission[] {
    return [...this.submissions];
  }

  public pickChallengeWinner(
    challengeId: string,
    position: 'first' | 'second' | 'third',
    submissionId: string
  ): CommunityChallenge {
    const chalIndex = this.challenges.findIndex((c) => c.id === challengeId);
    if (chalIndex === -1) throw new Error('Challenge not found');

    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');

    const winnerMember = this.members.find((m) => m.id === sub.member_id);
    const challenge = this.challenges[chalIndex];

    const bonusXP =
      position === 'first'
        ? challenge.bonus_xp_first
        : position === 'second'
        ? challenge.bonus_xp_second
        : challenge.bonus_xp_third;

    const winnerData = {
      position,
      member: {
        id: sub.member_id,
        username: sub.author?.username || winnerMember?.username || 'creator',
        full_name: sub.author?.full_name || winnerMember?.full_name || 'Creator',
        avatar_url: sub.author?.avatar_url || winnerMember?.avatar_url || '',
      },
      submitted_work_url: sub.submission_url,
      xp_bonus: bonusXP,
    };

    const currentWinners = challenge.winners || {};
    challenge.winners = {
      ...currentWinners,
      [position]: winnerData,
    };

    // If first place is awarded, mark challenge as Completed
    if (position === 'first') {
      challenge.status = 'Completed';
    }

    this.challenges[chalIndex] = challenge;
    saveToStorage('challenges', this.challenges);

    // Increment winner count on member and award bonus XP
    if (winnerMember) {
      winnerMember.wins_count = (winnerMember.wins_count || 0) + 1;
      saveToStorage('members', this.members);
      this.awardXP(
        winnerMember.id,
        bonusXP,
        `Challenge Winner (${position.toUpperCase()} Place): ${challenge.title}`,
        challengeId
      );
    }

    return challenge;
  }

  // --- Admin: User & Member Management ---
  public updateMemberRole(memberId: string, role: MemberRole): CommunityMember {
    const index = this.members.findIndex((m) => m.id === memberId);
    if (index === -1) throw new Error('Member not found');
    this.members[index].role = role;
    saveToStorage('members', this.members);
    return this.members[index];
  }

  public deleteMember(memberId: string): boolean {
    const prevLen = this.members.length;
    this.members = this.members.filter((m) => m.id !== memberId);
    saveToStorage('members', this.members);
    return this.members.length < prevLen;
  }

  // --- Admin: Reports & Analytics ---
  public getAdminReports() {
    const totalMembers = this.members.length;
    const totalPosts = this.posts.length;
    const totalResources = this.resources.length;
    const totalJobs = this.jobs.length;
    const totalEvents = this.events.length;
    const totalChallenges = this.challenges.length;
    const totalSubmissions = this.submissions.length;
    const totalXpAwarded = this.xpTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    const activeChallenges = this.challenges.filter((c) => c.status === 'Active').length;
    const completedChallenges = this.challenges.filter((c) => c.status === 'Completed').length;
    const totalDownloads = this.resources.reduce((acc, r) => acc + (r.download_count || 0), 0);

    return {
      totalMembers,
      totalPosts,
      totalResources,
      totalJobs,
      totalEvents,
      totalChallenges,
      totalSubmissions,
      totalXpAwarded,
      activeChallenges,
      completedChallenges,
      totalDownloads,
      recentTransactions: this.xpTransactions.slice(0, 8),
    };
  }
}

export const communityDb = new CommunityDatabase();
