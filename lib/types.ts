// ============================================================
// TNCC TypeScript Definitions
// ============================================================

export interface Creator {
  id: string;
  name: string;
  username: string;
  title: string;
  location: string;
  avatar: string;
  coverColor: string;
  bio: string;
  skills: string[];
  category: string;
  rating: number;
  reviewCount: number;
  projectsCompleted: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: string;
  languages: string[];
  memberSince: string;
  verified: boolean;
  portfolioCount: number;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  category: string;
  description: string;
  budget: { min: number; max: number; currency: string };
  deadline: string;
  location: string;
  remote: boolean;
  skills: string[];
  proposals: number;
  postedAt: string;
  status: 'open' | 'in-progress' | 'completed';
  featured: boolean;
  image: string;
  experience: string;
}

export interface Package {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  creatorId: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  popular: boolean;
}

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  spots: number;
  spotsLeft: number;
  price: number;
  currency: string;
  image: string;
  tags: string[];
  organizer: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  creatorCount: number;
  color: string;
  bgColor: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  type: 'creator' | 'employer' | 'community';
}

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  message: string;
  bidAmount: number;
  deliveryDays: number;
  portfolioLinks: string[];
  submittedAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}
