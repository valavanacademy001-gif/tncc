'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import {
  ShieldCheck,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Trophy,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Award,
  ExternalLink,
  Search,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Filter,
  Eye,
  RefreshCw,
  Check,
  X,
  MessageSquare,
  Loader2,
  Gift,
  AlertTriangle,
  XCircle,
  Image as ImageIcon,
  UserPlus,
  Copy,
  CheckCheck,
  UploadCloud,
  FolderOpen,
} from 'lucide-react';
import {
  CommunityResource,
  CommunityJobOffer,
  CommunityEvent,
  CommunityChallenge,
  MemberRole,
  ResourceCategory,
} from '@/tncc-community/lib/types';
import AdminMediaUploader from '@/tncc-community/components/admin/AdminMediaUploader';
import CreatorEditModal from '@/tncc-community/components/admin/CreatorEditModal';

export default function AdminDashboardClient() {
  const {
    isAdmin,
    currentMember,
    toggleAdminMode,
    allMembers,
    resources,
    challenges,
    jobs,
    events,
    posts,
    addResource,
    updateResource,
    deleteResource,
    addJob,
    updateJob,
    deleteJob,
    addEvent,
    updateEvent,
    deleteEvent,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    pickChallengeWinner,
    reviewSubmission,
    getAllSubmissions,
    updateMemberRole,
    saveMember,
    deleteMember,
    awardBonusXP,
    getAdminReports,
  } = useCommunity();

  const [activeTab, setActiveTab] = useState<
    'reports' | 'users' | 'resources' | 'events' | 'challenges' | 'jobs' | 'referrals' | 'media'
  >('reports');

  // Media Gallery state
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoadingMedia(true);
      const res = await fetch('/api/community/admin/media');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.media)) {
          setMediaItems(data.media);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin media:', e);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleUploadMediaFile = async (file: File) => {
    if (!file) return;
    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('member_id', 'admin_media');
      formData.append('bucket', 'community-media');

      const res = await fetch('/api/community/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          fetchMedia();
        }
      }
    } catch (err) {
      console.error('Media upload error:', err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const copyToClipboard = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    }
  };

  const handleDeleteMedia = async (item: any) => {
    if (!confirm(`Delete media asset "${item.name}"?`)) return;
    try {
      const q = item.id?.startsWith('local-')
        ? `url=${encodeURIComponent(item.url)}`
        : `fileName=${encodeURIComponent(item.name)}`;
      const res = await fetch(`/api/community/admin/media?${q}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (e) {
      console.error('Delete media error:', e);
    }
  };

  // Referral management state
  const [adminReferrals, setAdminReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchAdminReferrals = async () => {
    try {
      const res = await fetch('/api/community/admin/referrals');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminReferrals(data.referrals || []);
          setReferralStats(data.stats || null);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch admin referrals:', e);
    }
  };

  useEffect(() => {
    fetchAdminReferrals();
    fetchMedia();
  }, []);

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('All');

  // Modals state
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState<any | null>(null);

  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<CommunityResource | null>(null);

  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<CommunityJobOffer | null>(null);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<CommunityChallenge | null>(null);

  const [selectedChallengeForSubmissions, setSelectedChallengeForSubmissions] =
    useState<CommunityChallenge | null>(null);

  const [showXPModal, setShowXPModal] = useState(false);
  const [xpTargetMember, setXpTargetMember] = useState<any>(null);
  const [xpAmount, setXpAmount] = useState('50');
  const [xpReason, setXpReason] = useState('Staff Merit Award');

  // Async loading & feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Resource Form State
  const [resForm, setResForm] = useState<{
    title: string;
    category: ResourceCategory;
    resource_type: string;
    description: string;
    external_url: string;
    thumbnail_url: string;
    is_google_drive: boolean;
  }>({
    title: '',
    category: 'Downloads',
    resource_type: 'Font Pack',
    description: '',
    external_url: 'https://drive.google.com/open?id=demo',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    is_google_drive: true,
  });

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company_name: '',
    company_logo_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=120&q=80',
    category: 'Video Editing',
    location: 'Chennai, Tamil Nadu',
    work_mode: 'Hybrid' as 'Remote' | 'On-site' | 'Hybrid',
    job_type: 'Freelance' as 'Full-time' | 'Part-time' | 'Freelance' | 'Contract',
    salary_range: '₹30,000 - ₹50,000 / project',
    description: '',
    required_skills: 'Premiere Pro, After Effects, DaVinci',
    experience_level: 'Mid-Senior (2+ years)',
    responsibilities: 'Produce 10 short-form reels monthly, color grading, kinetic typography',
    application_url: 'https://wa.me/919876543210',
  });

  // Event Form State
  const [evtForm, setEvtForm] = useState({
    title: '',
    description: '',
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-11-15',
    event_time: '6:00 PM - 8:30 PM',
    location: 'Anna Nagar, Chennai / Google Meet',
    is_online: true,
    registration_url: 'https://meet.google.com/tncc-demo',
    status: 'Upcoming' as 'Upcoming' | 'Ongoing' | 'Completed',
  });

  // Challenge Form State
  const [chalForm, setChalForm] = useState({
    title: '',
    description: '',
    category: 'Design & Motion',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    first_prize: '₹15,000 Cash + 200 XP',
    second_prize: '₹7,500 Cash + 100 XP',
    third_prize: '₹3,000 Cash + 50 XP',
    xp_reward: 15,
    bonus_xp_first: 200,
    bonus_xp_second: 100,
    bonus_xp_third: 50,
    submission_deadline: '2026-11-20',
    status: 'Active' as 'Upcoming' | 'Active' | 'Submission Closed' | 'Completed',
  });

  const reports = getAdminReports();
  const allSubmissions = getAllSubmissions();

  // Handle Resource Submit
  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      updateResource(editingResource.id, {
        title: resForm.title,
        category: resForm.category,
        resource_type: resForm.resource_type,
        description: resForm.description,
        external_url: resForm.external_url,
        thumbnail_url: resForm.thumbnail_url,
        is_google_drive: resForm.is_google_drive,
      });
    } else {
      addResource({
        title: resForm.title,
        category: resForm.category,
        resource_type: resForm.resource_type,
        description: resForm.description,
        external_url: resForm.external_url,
        thumbnail_url: resForm.thumbnail_url,
        is_google_drive: resForm.is_google_drive,
        download_count: 0,
        published_date: new Date().toISOString().split('T')[0],
      });
    }
    setShowResourceModal(false);
    setEditingResource(null);
  };

  // Handle Job Submit
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = jobForm.required_skills.split(',').map((s) => s.trim()).filter(Boolean);
    const respArray = jobForm.responsibilities.split(',').map((r) => r.trim()).filter(Boolean);
    if (editingJob) {
      updateJob(editingJob.id, {
        title: jobForm.title,
        company_name: jobForm.company_name,
        company_logo_url: jobForm.company_logo_url,
        category: jobForm.category,
        location: jobForm.location,
        work_mode: jobForm.work_mode,
        job_type: jobForm.job_type,
        salary_range: jobForm.salary_range,
        description: jobForm.description,
        required_skills: skillsArray,
        experience_level: jobForm.experience_level,
        responsibilities: respArray,
        application_url: jobForm.application_url,
      });
    } else {
      addJob({
        title: jobForm.title,
        company_name: jobForm.company_name,
        company_logo_url: jobForm.company_logo_url,
        category: jobForm.category,
        location: jobForm.location,
        work_mode: jobForm.work_mode,
        job_type: jobForm.job_type,
        salary_range: jobForm.salary_range,
        description: jobForm.description,
        required_skills: skillsArray,
        experience_level: jobForm.experience_level,
        responsibilities: respArray,
        application_url: jobForm.application_url,
        posted_date: new Date().toISOString().split('T')[0],
      });
    }
    setShowJobModal(false);
    setEditingJob(null);
  };

  // Handle Event Submit
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: evtForm.title,
        description: evtForm.description,
        banner_url: evtForm.banner_url,
        event_date: evtForm.event_date,
        event_time: evtForm.event_time,
        location: evtForm.location,
        is_online: evtForm.is_online,
        registration_url: evtForm.registration_url,
        status: evtForm.status,
      });
    } else {
      addEvent({
        title: evtForm.title,
        description: evtForm.description,
        banner_url: evtForm.banner_url,
        event_date: evtForm.event_date,
        event_time: evtForm.event_time,
        location: evtForm.location,
        is_online: evtForm.is_online,
        registration_url: evtForm.registration_url,
        status: evtForm.status,
      });
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  // Handle Challenge Submit
  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChallenge) {
      updateChallenge(editingChallenge.id, {
        title: chalForm.title,
        description: chalForm.description,
        category: chalForm.category,
        thumbnail_url: chalForm.thumbnail_url,
        prizes: {
          first: chalForm.first_prize,
          second: chalForm.second_prize,
          third: chalForm.third_prize,
        },
        bonus_xp_first: Number(chalForm.bonus_xp_first),
        bonus_xp_second: Number(chalForm.bonus_xp_second),
        bonus_xp_third: Number(chalForm.bonus_xp_third),
        submission_deadline: chalForm.submission_deadline,
        status: chalForm.status,
      });
    } else {
      addChallenge({
        title: chalForm.title,
        description: chalForm.description,
        category: chalForm.category,
        thumbnail_url: chalForm.thumbnail_url,
        reference_images: [chalForm.thumbnail_url],
        requirements: ['Original creative work', 'Tamil cultural relevance', 'High resolution file'],
        rules: ['Strictly original designs', 'Submit before deadline', 'TNCC ethics apply'],
        prizes: {
          first: chalForm.first_prize,
          second: chalForm.second_prize,
          third: chalForm.third_prize,
        },
        xp_reward: Number(chalForm.xp_reward),
        bonus_xp_first: Number(chalForm.bonus_xp_first),
        bonus_xp_second: Number(chalForm.bonus_xp_second),
        bonus_xp_third: Number(chalForm.bonus_xp_third),
        start_date: new Date().toISOString().split('T')[0],
        submission_deadline: chalForm.submission_deadline,
        status: chalForm.status,
      });
    }
    setShowChallengeModal(false);
    setEditingChallenge(null);
  };

  // Award XP Submit
  const handleAwardXPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (xpTargetMember) {
      awardBonusXP(xpTargetMember.id, Number(xpAmount), xpReason);
      setShowXPModal(false);
      setXpTargetMember(null);
    }
  };

  const filteredMembers = allMembers.filter((m) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      m.full_name.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q)
    );
  });

  const isAuthorizedAdmin =
    isAdmin ||
    currentMember?.role === 'admin' ||
    currentMember?.email?.toLowerCase() === 'suganeshsugu07@gmail.com' ||
    currentMember?.email?.toLowerCase() === 'suganeshsugu07@gmailcom' ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('tncc_active_user_email')?.toLowerCase() === 'suganeshsugu07@gmail.com' ||
       localStorage.getItem('tncc_admin_session') === 'true' ||
       document.cookie.includes('tncc_admin_session=true')));

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center mb-4 text-amber-700 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0D2C5B]">Administrator Access Restricted</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mt-2">
          This management workspace is strictly restricted to authorized administrative personnel (<span className="font-semibold text-gray-700">suganeshsugu07@gmail.com</span>).
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/community/auth?mode=login"
            className="px-5 py-2.5 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Sign In as Admin
          </Link>
          <Link
            href="/community"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Back to Community Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner & Verified Admin Badge */}
      <div className="bg-gradient-to-r from-[#0D2C5B] via-[#1B3F7E] to-[#0D2C5B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              TNCC Administration Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Community Management & Reports
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
              Real-time administrative control over members, creative resources, studio hiring gigs,
              offline events, and competition winners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-[#0D2C5B] flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#0D2C5B]" />
              <span>Admin: suganeshsugu07@gmail.com</span>
            </div>
            <Link
              href="/community"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>View User Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs - Responsive Scroll with hidden scrollbar */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-1 border-t border-white/10 pt-4 no-scrollbar">
          {[
            { id: 'reports', name: 'Admin Reports', icon: BarChart3, count: null },
            { id: 'users', name: 'User Management', icon: Users, count: allMembers.length },
            { id: 'resources', name: 'Resource Management', icon: BookOpen, count: resources.length },
            { id: 'events', name: 'Event Management', icon: Calendar, count: events.length },
            { id: 'challenges', name: 'Challenges & Winners', icon: Trophy, count: challenges.length },
            { id: 'jobs', name: 'Hiring & Jobs', icon: Briefcase, count: jobs.length },
            { id: 'referrals', name: 'Referrals & Earn', icon: Gift, count: adminReferrals.length },
            { id: 'media', name: 'Media Gallery', icon: ImageIcon, count: mediaItems.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0D2C5B] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E84020]' : ''}`} />
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-gray-100 text-[#0D2C5B]' : 'bg-white/20 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          TAB 1: ADMIN REPORTS & ANALYTICS
          ============================================================ */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-[#1D2430] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-[#303846] shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Members
              </span>
              <p className="text-2xl font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA] mt-1">{reports.totalMembers}</p>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1 inline-block">
                ↑ Statewide Tamil Nadu
              </span>
            </div>
            <div className="bg-white dark:bg-[#1D2430] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-[#303846] shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Creative Posts
              </span>
              <p className="text-2xl font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA] mt-1">{reports.totalPosts}</p>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 inline-block">
                Verified portfolio pieces
              </span>
            </div>
            <div className="bg-white dark:bg-[#1D2430] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-[#303846] shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total XP Awarded
              </span>
              <p className="text-2xl font-extrabold text-[#E84020] mt-1">
                ⚡ {reports.totalXpAwarded}
              </p>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
                Merit recognized
              </span>
            </div>
            <div className="bg-white dark:bg-[#1D2430] p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-[#303846] shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Bounties
              </span>
              <p className="text-2xl font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA] mt-1">
                {reports.activeChallenges}
              </p>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1 inline-block">
                {reports.totalSubmissions} submissions entered
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Resource Downloads
              </span>
              <p className="text-2xl font-extrabold text-[#00B5C8] mt-1">
                {reports.totalDownloads}
              </p>
              <span className="text-[10px] text-gray-400 font-bold mt-1 inline-block">
                {reports.totalResources} assets live
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Studio Jobs
              </span>
              <p className="text-2xl font-extrabold text-[#0D2C5B] mt-1">{reports.totalJobs}</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
                Direct hiring leads
              </span>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="bg-[#F8F6F1] p-5 rounded-2xl border border-orange-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#0D2C5B]">Quick Administrative Shortcuts</h3>
              <p className="text-xs text-gray-500">Instant shortcuts to update community portals.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setEditingResource(null);
                  setShowResourceModal(true);
                }}
                className="px-3.5 py-1.5 bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Resource
              </button>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setShowJobModal(true);
                }}
                className="px-3.5 py-1.5 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Post Job
              </button>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventModal(true);
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-[#0D2C5B] border border-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Event
              </button>
              <button
                onClick={() => setActiveTab('challenges')}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Declare Challenge Winner
              </button>
            </div>
          </div>

          {/* Recent XP Audit Trail */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-base text-[#0D2C5B] mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#E84020]" />
              Recent XP Audit & Merit Transactions
            </h3>
            <div className="divide-y divide-gray-100">
              {reports.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0D2C5B]">{tx.reason}</span>
                    <span className="text-gray-400 text-[11px] block">
                      Member ID: {tx.member_id} · {new Date(tx.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#E84020] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    +{tx.amount} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: USER MANAGEMENT
          ============================================================ */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1D2430] rounded-2xl border border-gray-100 dark:border-[#303846] p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-[#0D2C5B] dark:text-[#F5F7FA]">Verified Creator Directory</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage roles, award merit XP, and moderate community members.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search creator by name or city..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-[#171C24] text-[#0D2C5B] dark:text-[#F5F7FA] border border-gray-200 dark:border-[#303846] rounded-xl focus:outline-none focus:border-[#0D2C5B] dark:focus:border-[#00B5C8]"
                />
              </div>
              <button
                onClick={() => {
                  setEditingCreator(null);
                  setShowCreatorModal(true);
                }}
                className="px-3.5 py-2 bg-[#0D2C5B] dark:bg-[#00B5C8] hover:bg-[#1B3F7E] text-white dark:text-[#101318] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Assign New Creator</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#171C24] text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-[#303846]">
                <tr>
                  <th className="p-3">Creator</th>
                  <th className="p-3">Member ID</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Total XP</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.avatar_url}
                          alt={member.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-[#0D2C5B]">{member.full_name}</p>
                          <p className="text-[11px] text-gray-400">@{member.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{member.member_id}</td>
                    <td className="p-3 text-gray-600">{member.location}</td>
                    <td className="p-3">
                      <span className="font-extrabold text-[#E84020]">⚡ {member.total_xp} XP</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          member.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-[#0D2C5B] border border-blue-100'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCreator(member);
                            setShowCreatorModal(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-[#0D2C5B] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Creator Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setXpTargetMember(member);
                            setShowXPModal(true);
                          }}
                          className="px-2.5 py-1 bg-[#E84020]/10 hover:bg-[#E84020] text-[#E84020] hover:text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          + Award XP
                        </button>
                        <button
                          onClick={() =>
                            updateMemberRole(
                              member.id,
                              member.role === 'admin' ? 'member' : 'admin'
                            )
                          }
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-[11px] transition-colors"
                        >
                          {member.role === 'admin' ? 'Make Member' : 'Make Admin'}
                        </button>
                        {member.id !== 'mem-current' && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${member.full_name} from community?`)) {
                                deleteMember(member.id);
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: RESOURCE MANAGEMENT
          ============================================================ */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-[#0D2C5B]">Design & Creator Resources</h2>
              <p className="text-xs text-gray-500">
                Publish free Figma templates, fonts, brush packs, and video presets for Tamil creators.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingResource(null);
                setResForm({
                  title: '',
                  category: 'Downloads',
                  resource_type: 'Font Pack',
                  description: '',
                  external_url: 'https://drive.google.com/open?id=demo',
                  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                  is_google_drive: true,
                });
                setShowResourceModal(true);
              }}
              className="px-4 py-2 bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0D2C5B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={res.thumbnail_url}
                      alt={res.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D2C5B] uppercase">
                    {res.category} · {res.resource_type}
                  </span>
                  <h4 className="font-bold text-sm text-[#0D2C5B] mt-1.5">{res.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{res.description}</p>
                  <p className="text-[11px] text-gray-400 mt-2 font-mono">
                    {res.download_count} Downloads {res.is_google_drive ? '· Google Drive' : ''}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={res.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#00B5C8] flex items-center gap-1 hover:underline"
                  >
                    <span>View / Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingResource(res);
                        setResForm({
                          title: res.title,
                          category: res.category,
                          resource_type: res.resource_type,
                          description: res.description,
                          external_url: res.external_url,
                          thumbnail_url: res.thumbnail_url,
                          is_google_drive: res.is_google_drive,
                        });
                        setShowResourceModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-[#0D2C5B] rounded"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${res.title}"?`)) {
                          deleteResource(res.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: EVENT MANAGEMENT
          ============================================================ */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-[#0D2C5B]">Community Events & Workshops</h2>
              <p className="text-xs text-gray-500">
                Organize Tamil Nadu offline meetups, studio tours, and online creative teardowns.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEvtForm({
                  title: '',
                  description: '',
                  banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
                  event_date: '2026-11-20',
                  event_time: '6:00 PM - 8:00 PM',
                  location: 'Coimbatore / Google Meet',
                  is_online: true,
                  registration_url: 'https://meet.google.com/tncc-demo',
                  status: 'Upcoming',
                });
                setShowEventModal(true);
              }}
              className="px-4 py-2 bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Schedule Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0D2C5B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                      {evt.status}
                    </span>
                    <span className="text-xs text-gray-400">{evt.event_date} · {evt.event_time}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#0D2C5B]">{evt.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{evt.description}</p>
                  <p className="text-xs text-gray-400 mt-2">📍 {evt.location}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={evt.registration_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#00B5C8] flex items-center gap-1 hover:underline"
                  >
                    <span>RSVP Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingEvent(evt);
                        setEvtForm({
                          title: evt.title,
                          description: evt.description,
                          banner_url: evt.banner_url,
                          event_date: evt.event_date,
                          event_time: evt.event_time,
                          location: evt.location,
                          is_online: evt.is_online,
                          registration_url: evt.registration_url,
                          status: evt.status,
                        });
                        setShowEventModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-[#0D2C5B] rounded"
                      title="Edit Event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cancel "${evt.title}"?`)) {
                          deleteEvent(evt.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                      title="Cancel Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5: CHALLENGES & WINNER MANAGEMENT
          ============================================================ */}
      {activeTab === 'challenges' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-[#0D2C5B]">
                Challenges, Submissions & Winner Selection
              </h2>
              <p className="text-xs text-gray-500">
                Review submitted creator works, declare 1st/2nd/3rd place winners, and credit cash bounty & XP rewards.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingChallenge(null);
                setChalForm({
                  title: '',
                  description: '',
                  category: 'Design & Motion',
                  thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                  first_prize: '₹15,000 Cash + 200 XP',
                  second_prize: '₹7,500 Cash + 100 XP',
                  third_prize: '₹3,000 Cash + 50 XP',
                  xp_reward: 15,
                  bonus_xp_first: 200,
                  bonus_xp_second: 100,
                  bonus_xp_third: 50,
                  submission_deadline: '2026-11-30',
                  status: 'Active',
                });
                setShowChallengeModal(true);
              }}
              className="px-4 py-2 bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Launch Challenge</span>
            </button>
          </div>

          <div className="space-y-4">
            {challenges.map((chal) => {
              const subs = allSubmissions.filter((s) => s.challenge_id === chal.id);
              return (
                <div
                  key={chal.id}
                  className="p-5 rounded-2xl border border-gray-200 hover:border-[#0D2C5B] transition-all bg-[#FDFCFB]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={chal.thumbnail_url}
                        alt={chal.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              chal.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-[#E84020]'
                            }`}
                          >
                            {chal.status}
                          </span>
                          <span className="text-xs text-gray-400">Deadline: {chal.submission_deadline}</span>
                        </div>
                        <h4 className="font-bold text-base text-[#0D2C5B] mt-1">{chal.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          1st Prize: <strong className="text-amber-600">{chal.prizes?.first}</strong> · Submissions: <strong>{subs.length}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => setSelectedChallengeForSubmissions(chal)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#0D2C5B] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Review Submissions ({subs.length})</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingChallenge(chal);
                          setChalForm({
                            title: chal.title,
                            description: chal.description,
                            category: chal.category,
                            thumbnail_url: chal.thumbnail_url,
                            first_prize: chal.prizes?.first || '',
                            second_prize: chal.prizes?.second || '',
                            third_prize: chal.prizes?.third || '',
                            xp_reward: chal.xp_reward,
                            bonus_xp_first: chal.bonus_xp_first,
                            bonus_xp_second: chal.bonus_xp_second,
                            bonus_xp_third: chal.bonus_xp_third,
                            submission_deadline: chal.submission_deadline,
                            status: chal.status,
                          });
                          setShowChallengeModal(true);
                        }}
                        className="p-2 text-gray-500 hover:text-[#0D2C5B] rounded-lg border border-gray-200"
                        title="Edit Challenge"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete challenge "${chal.title}"? This action cannot be undone.`)) {
                            deleteChallenge(chal.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-lg border border-gray-200 transition-colors"
                        title="Delete Challenge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Declared Winners Display if available */}
                  {(chal.winners?.first || chal.winners?.second || chal.winners?.third) && (
                    <div className="mt-4 space-y-2">
                      {chal.winners?.first && (
                        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center font-extrabold text-xs text-[#0D2C5B]">
                            👑
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-[#0D2C5B]">
                              1st Place: {chal.winners.first.member.full_name} (@{chal.winners.first.member.username})
                            </span>
                            <span className="text-gray-500 block text-[11px]">
                              Awarded +{chal.winners.first.xp_bonus} XP · Work: {chal.winners.first.submitted_work_url}
                            </span>
                          </div>
                        </div>
                      )}
                      {chal.winners?.second && (
                        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center font-extrabold text-xs text-slate-800">
                            🥈
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-slate-800">
                              2nd Place: {chal.winners.second.member.full_name} (@{chal.winners.second.member.username})
                            </span>
                            <span className="text-gray-500 block text-[11px]">
                              Awarded +{chal.winners.second.xp_bonus} XP · Work: {chal.winners.second.submitted_work_url}
                            </span>
                          </div>
                        </div>
                      )}
                      {chal.winners?.third && (
                        <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center font-extrabold text-xs text-amber-900">
                            🥉
                          </div>
                          <div className="text-xs">
                            <span className="font-bold text-amber-900">
                              3rd Place: {chal.winners.third.member.full_name} (@{chal.winners.third.member.username})
                            </span>
                            <span className="text-gray-500 block text-[11px]">
                              Awarded +{chal.winners.third.xp_bonus} XP · Work: {chal.winners.third.submitted_work_url}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 6: HIRING & JOBS MANAGEMENT
          ============================================================ */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-lg text-[#0D2C5B]">Client Gigs & Studio Hiring Posts</h2>
              <p className="text-xs text-gray-500">
                Add, manage, and verify freelance opportunities and full-time creative positions.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingJob(null);
                setJobForm({
                  title: '',
                  company_name: '',
                  company_logo_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=120&q=80',
                  category: 'Motion Design',
                  location: 'Chennai, Tamil Nadu',
                  work_mode: 'Remote',
                  job_type: 'Freelance',
                  salary_range: '₹25,000 / project',
                  description: '',
                  required_skills: 'Premiere Pro, DaVinci Resolve',
                  experience_level: 'Mid (1+ years)',
                  responsibilities: 'Short-form editing and brand reels',
                  application_url: 'https://wa.me/919876543210',
                });
                setShowJobModal(true);
              }}
              className="px-4 py-2 bg-[#0D2C5B] hover:bg-[#1B3F7E] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post Job / Gig</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0D2C5B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#E84020]">
                      {job.job_type} · {job.work_mode}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">{job.salary_range}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#0D2C5B]">{job.title}</h4>
                  <p className="text-xs text-gray-500">{job.company_name} · 📍 {job.location}</p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{job.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#00B5C8] flex items-center gap-1 hover:underline"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setJobForm({
                          title: job.title,
                          company_name: job.company_name,
                          company_logo_url: job.company_logo_url,
                          category: job.category,
                          location: job.location,
                          work_mode: job.work_mode,
                          job_type: job.job_type,
                          salary_range: job.salary_range || '',
                          description: job.description,
                          required_skills: job.required_skills.join(', '),
                          experience_level: job.experience_level,
                          responsibilities: job.responsibilities.join(', '),
                          application_url: job.application_url,
                        });
                        setShowJobModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-[#0D2C5B] rounded"
                      title="Edit Job"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${job.title}"?`)) {
                          deleteJob(job.id);
                        }
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 7: REFERRALS & EARN MANAGEMENT
          ============================================================ */}
      {activeTab === 'referrals' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Stats Cards */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-[#0D2C5B]">Referral & Earn Overview</h3>
              <p className="text-xs text-gray-500">
                Monitor referral signups, qualifying activities, and automated +50 XP bonus rewards.
              </p>
            </div>
            <button
              onClick={fetchAdminReferrals}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0D2C5B] text-white hover:bg-[#1B3F7E] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Records</span>
            </button>
          </div>

          {/* Metric Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Referrals</span>
              <p className="text-2xl font-black text-[#0D2C5B]">{referralStats?.total_referrals ?? adminReferrals.length}</p>
              <p className="text-[11px] text-gray-400">All registered referrals</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Activity</span>
              <p className="text-2xl font-black text-amber-500">{referralStats?.pending_referrals ?? 0}</p>
              <p className="text-[11px] text-gray-400">Zero XP issued (normal)</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rewarded (+50 XP)</span>
              <p className="text-2xl font-black text-emerald-600">{referralStats?.successful_referrals ?? 0}</p>
              <p className="text-[11px] text-gray-400">Qualifying activity confirmed</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total XP Distributed</span>
              <p className="text-2xl font-black text-[#E84020]">+{referralStats?.total_xp_distributed ?? 0} XP</p>
              <p className="text-[11px] text-gray-400">Credited to referrers</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suspicious Activity</span>
              <p className="text-2xl font-black text-purple-600">{referralStats?.suspicious_activity ?? 0}</p>
              <p className="text-[11px] text-gray-400">Accounts flagged for audit</p>
            </div>
          </div>

          {/* Referrals List Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#0D2C5B]">Audit Trail & Attribution Records</h4>
              <span className="text-xs text-gray-400">{adminReferrals.length} Total</span>
            </div>

            {adminReferrals.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-xs">
                No referral records found yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                      <th className="p-3.5">Referrer ID</th>
                      <th className="p-3.5">Referred Member ID</th>
                      <th className="p-3.5">Code Used</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Qualifying Event</th>
                      <th className="p-3.5">Reward XP</th>
                      <th className="p-3.5">Date Created</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminReferrals.map((r: any) => (
                      <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-3.5 font-mono text-[11px] text-[#0D2C5B] font-bold">{r.referrer_member_id}</td>
                        <td className="p-3.5 font-mono text-[11px] text-gray-700">{r.referred_member_id}</td>
                        <td className="p-3.5 font-mono font-bold text-[#E84020]">{r.referral_code}</td>
                        <td className="p-3.5">
                          {r.status === 'rewarded' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Rewarded
                            </span>
                          ) : r.status === 'pending_activity' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Pending Activity
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 capitalize text-gray-600">
                          {r.qualifying_activity_type ? `${r.qualifying_activity_type} (${r.qualifying_activity_id?.slice(0, 8)}...)` : 'None yet'}
                        </td>
                        <td className="p-3.5 font-bold text-[#0D2C5B]">
                          {r.status === 'rewarded' ? `+${r.reward_xp} XP` : '0 XP (Pending)'}
                        </td>
                        <td className="p-3.5 text-gray-400 text-[11px]">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right">
                          {r.status === 'pending_activity' && (
                            <button
                              disabled={isRejecting}
                              onClick={async () => {
                                const reason = prompt('Reason for rejection:', 'Suspicious duplicate or bot activity');
                                if (!reason) return;
                                setIsRejecting(true);
                                try {
                                  const res = await fetch(`/api/community/admin/referrals/${r.id}/reject`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ reason }),
                                  });
                                  if (res.ok) {
                                    fetchAdminReferrals();
                                  }
                                } finally {
                                  setIsRejecting(false);
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-40"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 8: MEDIA GALLERY (ADMIN ONLY)
          ============================================================ */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-[#0D2C5B]">Community Media Asset Library</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload creative banners, posters, stock clips, and copy public URLs with 1-click clipboard feedback.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="file"
                ref={mediaFileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadMediaFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                accept="image/png,image/jpeg,image/webp,video/mp4"
              />
              <button
                type="button"
                onClick={() => mediaFileInputRef.current?.click()}
                disabled={isUploadingMedia}
                className="px-4 py-2 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUploadingMedia ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload New Asset</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={fetchMedia}
                className="p-2 text-gray-500 hover:text-[#0D2C5B] hover:bg-gray-100 rounded-xl transition-all"
                title="Refresh Media Gallery"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Assets', count: mediaItems.length },
                { id: 'image', label: 'Images', count: mediaItems.filter((m) => m.media_type === 'image').length },
                { id: 'video', label: 'Videos', count: mediaItems.filter((m) => m.media_type === 'video').length },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setMediaFilter(filter.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mediaFilter === filter.id
                      ? 'bg-[#0D2C5B] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      mediaFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Search assets by file name..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B]"
              />
            </div>
          </div>

          {/* Media Grid */}
          {loadingMedia ? (
            <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#0D2C5B]" />
              <span className="text-xs">Loading media assets from storage...</span>
            </div>
          ) : mediaItems.filter((item) => {
              if (mediaFilter !== 'all' && item.media_type !== mediaFilter) return false;
              if (mediaSearch) {
                const q = mediaSearch.toLowerCase();
                return item.name?.toLowerCase().includes(q) || item.url?.toLowerCase().includes(q);
              }
              return true;
            }).length === 0 ? (
            <div className="py-14 text-center border-2 border-dashed border-gray-200 rounded-2xl p-6">
              <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">No media assets found</p>
              <p className="text-[11px] text-gray-400 mt-1">Upload images or videos to populate your admin gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaItems
                .filter((item) => {
                  if (mediaFilter !== 'all' && item.media_type !== mediaFilter) return false;
                  if (mediaSearch) {
                    const q = mediaSearch.toLowerCase();
                    return item.name?.toLowerCase().includes(q) || item.url?.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((item) => {
                  const isCopied = copiedUrl === item.url;
                  return (
                    <div
                      key={item.id || item.url}
                      className="group bg-gray-50 border border-gray-200 hover:border-[#0D2C5B] rounded-2xl overflow-hidden transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-gray-900/10 overflow-hidden">
                        {item.media_type === 'video' ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                            onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}

                        <span
                          className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase backdrop-blur-md shadow-xs ${
                            item.media_type === 'video'
                              ? 'bg-purple-600/90 text-white'
                              : 'bg-black/60 text-white'
                          }`}
                        >
                          {item.media_type}
                        </span>

                        {item.category && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/90 text-gray-800 shadow-xs">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-2">
                        <div>
                          <p className="text-xs font-bold text-[#0D2C5B] truncate" title={item.name}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {item.file_size ? `${Math.round(item.file_size / 1024)} KB` : 'Cloud Asset'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.url)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy URL</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          MODAL 1: RESOURCE CREATE/EDIT
          ============================================================ */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#0D2C5B] mb-1">
              {editingResource ? 'Edit Resource' : 'Publish New Resource'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Add assets directly to the community library.
            </p>

            <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={resForm.title}
                  onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                  placeholder="e.g. Tamil Nadu Heritage Vector Icon Pack"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={resForm.category}
                    onChange={(e) => setResForm({ ...resForm, category: e.target.value as ResourceCategory })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Downloads">Downloads</option>
                    <option value="Useful Websites">Useful Websites</option>
                    <option value="Feeds / Videos">Feeds / Videos</option>
                    <option value="Blog Posts">Blog Posts</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Resource Type</label>
                  <input
                    type="text"
                    value={resForm.resource_type}
                    onChange={(e) => setResForm({ ...resForm, resource_type: e.target.value })}
                    placeholder="e.g. Font Pack, PSD Mockup, LUTs, AI Tool"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Resource / Download URL</label>
                <input
                  type="url"
                  required
                  value={resForm.external_url}
                  onChange={(e) => setResForm({ ...resForm, external_url: e.target.value })}
                  placeholder="Google Drive, Dropbox, or website link"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <AdminMediaUploader
                label="Preview Image / Thumbnail"
                value={resForm.thumbnail_url}
                onChange={(url) => setResForm({ ...resForm, thumbnail_url: url })}
                aspectRatio="banner"
                helperText="Upload, paste direct image URL, or pick from gallery"
              />

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={resForm.description}
                  onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
                  placeholder="What is included in this resource?"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="res_google_drive"
                  checked={resForm.is_google_drive}
                  onChange={(e) => setResForm({ ...resForm, is_google_drive: e.target.checked })}
                  className="rounded text-[#0D2C5B]"
                />
                <label htmlFor="res_google_drive" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Hosted on Google Drive (Displays special Google Drive badge)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-[#0D2C5B] hover:bg-[#1B3F7E] font-bold"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: JOB CREATE/EDIT
          ============================================================ */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#0D2C5B] mb-1">
              {editingJob ? 'Edit Job Opening' : 'Post New Creative Gig'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Help regional brands and studios hire Tamil creators.
            </p>

            <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior YouTube Video Editor"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company / Studio</label>
                  <input
                    type="text"
                    required
                    value={jobForm.company_name}
                    onChange={(e) => setJobForm({ ...jobForm, company_name: e.target.value })}
                    placeholder="e.g. Pixel Craft Studios"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Compensation / Budget</label>
                  <input
                    type="text"
                    value={jobForm.salary_range}
                    onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                    placeholder="e.g. ₹35,000 / month"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mode</label>
                  <select
                    value={jobForm.work_mode}
                    onChange={(e) => setJobForm({ ...jobForm, work_mode: e.target.value as any })}
                    className="w-full px-2.5 py-2 border rounded-xl"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Type</label>
                  <select
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value as any })}
                    className="w-full px-2.5 py-2 border rounded-xl"
                  >
                    <option>Freelance</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Chennai"
                    className="w-full px-2.5 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Application Link (WhatsApp / Form)</label>
                <input
                  type="url"
                  required
                  value={jobForm.application_url}
                  onChange={(e) => setJobForm({ ...jobForm, application_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Required Skills</label>
                <input
                  type="text"
                  value={jobForm.required_skills}
                  onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                  placeholder="Premiere, Photoshop, After Effects"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <AdminMediaUploader
                label="Company Logo / Project Image"
                value={jobForm.company_logo_url}
                onChange={(url) => setJobForm({ ...jobForm, company_logo_url: url })}
                aspectRatio="square"
                helperText="Upload logo, paste direct URL, or pick from gallery"
              />

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-[#0D2C5B] hover:bg-[#1B3F7E] font-bold"
                >
                  Publish Gig
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: REVIEW SUBMISSIONS & PICK WINNER
          ============================================================ */}
      {selectedChallengeForSubmissions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Winner Selection
                </span>
                <h3 className="font-bold text-base text-[#0D2C5B] mt-1">
                  {selectedChallengeForSubmissions.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallengeForSubmissions(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* List of submissions for this challenge */}
            {allSubmissions.filter((s) => s.challenge_id === selectedChallengeForSubmissions.id).length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No submissions entered yet for this challenge.
              </div>
            ) : (
              <div className="space-y-4">
                {allSubmissions
                  .filter((s) => s.challenge_id === selectedChallengeForSubmissions.id)
                  .map((sub, idx) => {
                    const status = sub.status || 'pending';
                    const isWinner =
                      selectedChallengeForSubmissions.winners?.first?.member.id === sub.member_id
                        ? '1st Place Winner'
                        : selectedChallengeForSubmissions.winners?.second?.member.id === sub.member_id
                        ? '2nd Place Winner'
                        : selectedChallengeForSubmissions.winners?.third?.member.id === sub.member_id
                        ? '3rd Place Winner'
                        : null;

                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl border border-gray-200 bg-[#FDFCFB] space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500 shrink-0 mt-0.5">
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-xs text-[#0D2C5B]">{sub.title}</p>
                                <span
                                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                    status === 'approved'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {status}
                                </span>
                                {isWinner && (
                                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-[#0D2C5B]">
                                    🏆 {isWinner}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                By {sub.author?.full_name} (@{sub.author?.username}) · {sub.submission_type}
                              </p>
                              {sub.admin_feedback && (
                                <p className="text-[11px] text-gray-600 bg-gray-100/80 px-2 py-1 rounded-md mt-1.5 border border-gray-200 inline-block">
                                  💬 <strong>Reviewer Feedback:</strong> {sub.admin_feedback}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
                            <a
                              href={sub.submission_url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 text-[11px] font-semibold text-[#00B5C8] hover:bg-cyan-50 rounded-lg flex items-center gap-1"
                              title="Inspect submitted creative artifact"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </a>

                            {/* Approve / Reject buttons */}
                            <button
                              onClick={() => reviewSubmission(sub.id, 'approved', feedbackText || sub.admin_feedback)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                                status === 'approved'
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                              }`}
                              title="Approve Submission"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => reviewSubmission(sub.id, 'rejected', feedbackText || sub.admin_feedback)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all flex items-center gap-1 ${
                                status === 'rejected'
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'
                              }`}
                              title="Reject Submission"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveFeedbackId(activeFeedbackId === sub.id ? null : sub.id);
                                setFeedbackText(sub.admin_feedback || '');
                              }}
                              className="px-2 py-1 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 flex items-center gap-1"
                              title="Add/Edit Admin Feedback"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Feedback</span>
                            </button>

                            {/* Declare Winner buttons */}
                            <button
                              onClick={() => {
                                if (confirm(`Award 1st Place (+${selectedChallengeForSubmissions.bonus_xp_first} XP) to ${sub.author?.full_name}?`)) {
                                  pickChallengeWinner(
                                    selectedChallengeForSubmissions.id,
                                    'first',
                                    sub.id
                                  );
                                  setSelectedChallengeForSubmissions(null);
                                }
                              }}
                              className="px-2 py-1 bg-amber-400 hover:bg-amber-500 text-[#0D2C5B] font-extrabold text-[10px] rounded-lg shadow-sm"
                              title="Declare 1st Place Winner"
                            >
                              🏆 1st
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Award 2nd Place (+${selectedChallengeForSubmissions.bonus_xp_second} XP) to ${sub.author?.full_name}?`)) {
                                  pickChallengeWinner(
                                    selectedChallengeForSubmissions.id,
                                    'second',
                                    sub.id
                                  );
                                  setSelectedChallengeForSubmissions(null);
                                }
                              }}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] rounded-lg"
                              title="Declare 2nd Place Winner"
                            >
                              🥈 2nd
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Award 3rd Place (+${selectedChallengeForSubmissions.bonus_xp_third} XP) to ${sub.author?.full_name}?`)) {
                                  pickChallengeWinner(
                                    selectedChallengeForSubmissions.id,
                                    'third',
                                    sub.id
                                  );
                                  setSelectedChallengeForSubmissions(null);
                                }
                              }}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] rounded-lg"
                              title="Declare 3rd Place Winner"
                            >
                              🥉 3rd
                            </button>
                          </div>
                        </div>

                        {/* Inline Feedback Drawer if active */}
                        {activeFeedbackId === sub.id && (
                          <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                            <input
                              type="text"
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Write admin review note or feedback..."
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                            />
                            <button
                              onClick={() => {
                                reviewSubmission(sub.id, (sub.status as any) || 'pending', feedbackText);
                                setActiveFeedbackId(null);
                              }}
                              className="px-3 py-1.5 bg-[#0D2C5B] text-white rounded-lg text-xs font-bold hover:bg-[#1B3F7E]"
                            >
                              Save Feedback
                            </button>
                            <button
                              onClick={() => setActiveFeedbackId(null)}
                              className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedChallengeForSubmissions(null)}
                className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 4: AWARD BONUS XP TO CREATOR
          ============================================================ */}
      {showXPModal && xpTargetMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-scale-up space-y-4">
            <h3 className="font-bold text-base text-[#0D2C5B]">
              Award Merit XP to {xpTargetMember.full_name}
            </h3>
            <form onSubmit={handleAwardXPSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">XP Amount</label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-sm text-[#E84020]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Reason / Citation</label>
                <input
                  type="text"
                  required
                  value={xpReason}
                  onChange={(e) => setXpReason(e.target.value)}
                  placeholder="e.g. Featured Artwork Recognition"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowXPModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-gray-600 bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl text-white bg-[#E84020] hover:bg-[#FF5733] font-bold"
                >
                  Credit XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 5: EVENT CREATE/EDIT
          ============================================================ */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#0D2C5B] mb-1">
              {editingEvent ? 'Edit Community Event' : 'Create New Event'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Schedule workshops, meetups, and creative webinars for Tamil creators.
            </p>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={evtForm.title}
                  onChange={(e) => setEvtForm({ ...evtForm, title: e.target.value })}
                  placeholder="e.g. TNCC Offline Meetup: Chennai Film Creators"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <AdminMediaUploader
                label="Event Banner Image"
                value={evtForm.banner_url}
                onChange={(url) => setEvtForm({ ...evtForm, banner_url: url })}
                aspectRatio="banner"
                helperText="Upload event graphic, paste image URL, or pick from gallery"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={evtForm.event_date}
                    onChange={(e) => setEvtForm({ ...evtForm, event_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={evtForm.event_time}
                    onChange={(e) => setEvtForm({ ...evtForm, event_time: e.target.value })}
                    placeholder="e.g. 6:00 PM - 8:30 PM"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={evtForm.location}
                    onChange={(e) => setEvtForm({ ...evtForm, location: e.target.value })}
                    placeholder="e.g. Anna Nagar, Chennai / Google Meet"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={evtForm.status}
                    onChange={(e) => setEvtForm({ ...evtForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Registration / RSVP Link</label>
                <input
                  type="url"
                  required
                  value={evtForm.registration_url}
                  onChange={(e) => setEvtForm({ ...evtForm, registration_url: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={evtForm.description}
                  onChange={(e) => setEvtForm({ ...evtForm, description: e.target.value })}
                  placeholder="Agenda, speakers, prerequisites..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="evt_online"
                  checked={evtForm.is_online}
                  onChange={(e) => setEvtForm({ ...evtForm, is_online: e.target.checked })}
                  className="rounded text-[#0D2C5B]"
                />
                <label htmlFor="evt_online" className="text-xs text-gray-700 font-medium cursor-pointer">
                  Online Event (Displays Virtual Meeting tag)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-[#0D2C5B] hover:bg-[#1B3F7E] font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 6: CHALLENGE CREATE/EDIT
          ============================================================ */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-[#0D2C5B] mb-1">
              {editingChallenge ? 'Edit Creative Challenge' : 'Launch New Bounty Challenge'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Inspire community competition with cash rewards, merit badges, and XP.
            </p>

            <form onSubmit={handleSaveChallenge} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Challenge Title</label>
                <input
                  type="text"
                  required
                  value={chalForm.title}
                  onChange={(e) => setChalForm({ ...chalForm, title: e.target.value })}
                  placeholder="e.g. Tamil Typography Risograph Poster Challenge"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <AdminMediaUploader
                label="Challenge Banner / Thumbnail"
                value={chalForm.thumbnail_url}
                onChange={(url) => setChalForm({ ...chalForm, thumbnail_url: url })}
                aspectRatio="banner"
                helperText="Upload banner graphic, paste URL, or pick from gallery"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={chalForm.category}
                    onChange={(e) => setChalForm({ ...chalForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Design & Motion">Design & Motion</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="3D & Generative AI">3D & Generative AI</option>
                    <option value="Tamil Typography">Tamil Typography</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={chalForm.submission_deadline}
                    onChange={(e) => setChalForm({ ...chalForm, submission_deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2">
                <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                  🏆 Prize Pool & Bonus XP Rewards
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 block text-[10px] mb-0.5">🥇 1st Place</label>
                    <input
                      type="text"
                      value={chalForm.first_prize}
                      onChange={(e) => setChalForm({ ...chalForm, first_prize: e.target.value })}
                      placeholder="₹15,000 + 200 XP"
                      className="w-full px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block text-[10px] mb-0.5">🥈 2nd Place</label>
                    <input
                      type="text"
                      value={chalForm.second_prize}
                      onChange={(e) => setChalForm({ ...chalForm, second_prize: e.target.value })}
                      placeholder="₹7,500 + 100 XP"
                      className="w-full px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block text-[10px] mb-0.5">🥉 3rd Place</label>
                    <input
                      type="text"
                      value={chalForm.third_prize}
                      onChange={(e) => setChalForm({ ...chalForm, third_prize: e.target.value })}
                      placeholder="₹3,000 + 50 XP"
                      className="w-full px-2 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="font-bold text-gray-600 block text-[10px]">Participation XP</label>
                    <input
                      type="number"
                      value={chalForm.xp_reward}
                      onChange={(e) => setChalForm({ ...chalForm, xp_reward: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#E84020]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-600 block text-[10px]">Status</label>
                    <select
                      value={chalForm.status}
                      onChange={(e) => setChalForm({ ...chalForm, status: e.target.value as any })}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="Active">Active</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Submission Closed">Submission Closed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Challenge Brief / Description</label>
                <textarea
                  rows={3}
                  value={chalForm.description}
                  onChange={(e) => setChalForm({ ...chalForm, description: e.target.value })}
                  placeholder="Rules, theme guidelines, deliverables..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowChallengeModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-[#0D2C5B] hover:bg-[#1B3F7E] font-bold"
                >
                  Save Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 7: ASSIGN / EDIT CREATOR PROFILE
          ============================================================ */}
      <CreatorEditModal
        member={editingCreator}
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        onSave={async (data) => {
          await saveMember(data);
        }}
      />
    </div>
  );
}
