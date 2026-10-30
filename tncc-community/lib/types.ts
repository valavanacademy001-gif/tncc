export type MemberRole = 'member' | 'admin';

export interface CommunityMember {
  id: string;
  member_id: string; // e.g. TNCC-2026-018
  username: string;
  full_name: string;
  email?: string;
  password?: string;
  avatar_url: string;
  cover_url: string;
  bio: string;
  location: string;
  skills: string[];
  instagram_url?: string;
  linkedin_url?: string;
  behance_url?: string;
  youtube_url?: string;
  website_url?: string;
  total_xp: number;
  role: MemberRole;
  created_at: string;
  posts_count?: number;
  wins_count?: number;
  challenges_count?: number;
  followers_count?: number;
  following_count?: number;
}

export type MediaAspectRatio = 'square' | 'portrait' | 'landscape';

export interface CommunityPost {
  id: string;
  member_id: string;
  author: {
    username: string;
    full_name: string;
    avatar_url: string;
    location: string;
    total_xp: number;
    followers_count?: number;
  };
  caption: string;
  media_url?: string;
  media_type: 'image' | 'video' | 'none';
  aspect_ratio: MediaAspectRatio;
  hashtags: string[];
  category: 'All' | 'Showcase' | 'Discussion' | 'Graphic Design' | 'Video Editing' | 'Photography' | 'AI Art' | 'Branding';
  is_showcase: boolean;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  created_at: string;
  is_liked?: boolean;
  is_saved?: boolean;
  is_following?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  member_id: string;
  author: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  comment_text: string;
  created_at: string;
}

export type ResourceCategory = 'Downloads' | 'Useful Websites' | 'Feeds / Videos' | 'Blog Posts';

export interface CommunityResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  resource_type: string;
  thumbnail_url: string;
  external_url: string;
  is_google_drive: boolean;
  download_count: number;
  published_date: string;
}

export type ChallengeStatus = 'Upcoming' | 'Active' | 'Submission Closed' | 'Completed';

export interface ChallengeWinner {
  position: 'first' | 'second' | 'third';
  member: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  submitted_work_url: string;
  xp_bonus: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  reference_images: string[];
  requirements: string[];
  rules: string[];
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  xp_reward: number;
  bonus_xp_first: number;
  bonus_xp_second: number;
  bonus_xp_third: number;
  start_date: string;
  submission_deadline: string;
  status: ChallengeStatus;
  submissions_count?: number;
  user_submitted?: boolean;
  winners?: {
    first?: ChallengeWinner;
    second?: ChallengeWinner;
    third?: ChallengeWinner;
  };
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  member_id: string;
  author?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
  title: string;
  description?: string;
  submission_type: 'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio';
  submission_url: string;
  preview_url?: string;
  submitted_at: string;
}

export interface XPTransaction {
  id: string;
  member_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  created_at: string;
}

export interface PortfolioProject {
  id: string;
  member_id: string;
  post_id?: string;
  title: string;
  category: string;
  preview_url: string;
  description?: string;
  behance_url?: string;
  is_featured: boolean;
  is_hidden: boolean;
  created_at: string;
}

export interface CommunityJobOffer {
  id: string;
  company_name: string;
  company_logo_url: string;
  title: string;
  category: string;
  location: string;
  work_mode: 'Remote' | 'On-site' | 'Hybrid';
  job_type: 'Full-time' | 'Part-time' | 'Freelance' | 'Contract';
  salary_range?: string;
  description: string;
  required_skills: string[];
  experience_level: string;
  responsibilities: string[];
  application_url: string;
  posted_date: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  banner_url: string;
  event_date: string;
  event_time: string;
  location: string;
  is_online: boolean;
  registration_url: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface CommunityNotification {
  id: string;
  title: string;
  message: string;
  type: 'xp_earned' | 'like' | 'comment' | 'challenge_update' | 'system';
  is_read: boolean;
  created_at: string;
}
