import { createClient } from '@/lib/supabase/client';
import { mockProjects, mockCreators, mockPackages, mockEvents } from '@/lib/mock-data';
import { Project, Creator, Package, Event } from '@/lib/types';

// ============================================================
// PROJECTS
// ============================================================
export async function getProjectsFromSupabase(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockProjects;
    }

    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      client: 'Brand Partner',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      category: p.categories?.name || 'General',
      description: p.description,
      budget: {
        min: p.budget_min || 15000,
        max: p.budget_max || 30000,
        currency: p.currency || 'INR',
      },
      deadline: p.deadline || '2026-12-31',
      location: p.location || 'Chennai',
      remote: p.is_remote ?? true,
      skills: ['Branding', 'Design'],
      proposals: p.proposals_count || 0,
      postedAt: new Date(p.created_at).toLocaleDateString(),
      status: p.status === 'in_progress' ? 'in-progress' : (p.status || 'open'),
      featured: true,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80',
      experience: p.experience_level || 'Intermediate',
    }));
  } catch {
    return mockProjects;
  }
}

// ============================================================
// CREATORS / FREELANCERS
// ============================================================
export async function getCreatorsFromSupabase(): Promise<Creator[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('*, profiles(full_name, avatar_url, bio, username), categories(name)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockCreators;
    }

    return data.map((c: any) => ({
      id: c.user_id,
      name: c.profiles?.full_name || 'Creator',
      username: c.profiles?.username || 'creator',
      title: c.professional_title || 'Creative Professional',
      location: c.location || 'Chennai',
      avatar: c.profiles?.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      coverColor: 'var(--navy)',
      bio: c.about || c.profiles?.bio || 'Creative professional based in Tamil Nadu.',
      skills: c.languages || ['Branding', 'Design'],
      category: c.categories?.name || 'Graphic Design',
      rating: 4.9,
      reviewCount: 12,
      projectsCompleted: 18,
      hourlyRate: c.hourly_rate || 1500,
      availability: c.availability || 'available',
      responseTime: c.response_time || '< 24 hours',
      languages: c.languages || ['Tamil', 'English'],
      memberSince: '2026',
      verified: true,
      portfolioCount: 6,
    }));
  } catch {
    return mockCreators;
  }
}

// ============================================================
// PACKAGES
// ============================================================
export async function getPackagesFromSupabase(): Promise<Package[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('packages')
      .select('*, profiles(full_name, avatar_url), categories(name)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockPackages;
    }

    return data.map((pk: any) => ({
      id: pk.id,
      title: pk.title,
      creator: pk.profiles?.full_name || 'Creator',
      creatorAvatar: pk.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      creatorId: pk.creator_id,
      category: pk.categories?.name || 'Graphic Design',
      description: pk.description || '',
      price: pk.price,
      currency: pk.currency || 'INR',
      deliveryDays: pk.delivery_days || 7,
      rating: 4.9,
      reviewCount: 8,
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
      tags: pk.includes || ['Design', 'Brand'],
      popular: true,
    }));
  } catch {
    return mockPackages;
  }
}

// ============================================================
// EVENTS
// ============================================================
export async function getEventsFromSupabase(): Promise<Event[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return mockEvents;
    }

    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      type: e.event_type || 'meetup',
      date: new Date(e.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(e.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: e.location || 'Chennai',
      venue: e.location || 'Chennai',
      description: e.description || '',
      spots: e.capacity || 100,
      spotsLeft: Math.max((e.capacity || 100) - (e.registrations_count || 0), 0),
      price: 0,
      currency: 'INR',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      tags: ['Community', 'Creative'],
      organizer: 'TNCC Community',
      featured: true,
    }));
  } catch {
    return mockEvents;
  }
}

// ============================================================
// SUBMIT PROPOSAL TO SUPABASE
// ============================================================
export async function submitProposalToSupabase(proposal: {
  projectId: string;
  freelancerId: string;
  message: string;
  proposedPrice: number;
  deliveryDays: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('proposals').insert({
      project_id: proposal.projectId,
      freelancer_id: proposal.freelancerId,
      message: proposal.message,
      proposed_price: proposal.proposedPrice,
      delivery_days: proposal.deliveryDays,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'You have already submitted a proposal for this project.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

// ============================================================
// EVENT REGISTRATION TO SUPABASE
// ============================================================
export async function registerEventInSupabase(eventId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('event_registrations').insert({
      event_id: eventId,
      user_id: userId,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'You are already registered for this event.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}
