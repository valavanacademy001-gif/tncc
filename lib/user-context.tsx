'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'freelancer' | 'employer' | null;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  location: string;
  roles: UserRole[];
  activeRole: UserRole;
  freelancerOnboardingComplete: boolean;
  employerOnboardingComplete: boolean;
  isAuthenticated: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@tncc.in',
  username: 'demouser',
  avatar: '',
  location: 'Chennai',
  roles: ['freelancer'],
  activeRole: 'freelancer',
  freelancerOnboardingComplete: true,
  employerOnboardingComplete: false,
  isAuthenticated: false,
};

interface UserContextType {
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;
  addRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  isFreelancer: boolean;
  isEmployer: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'tncc_active_role';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth state as single source of truth
  useEffect(() => {
    const supabase = createClient();

    // Helper to synchronize member profile from Supabase user session
    const syncUserProfile = async (authUser: any) => {
      try {
        let name = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';
        let username = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user';
        let avatar = authUser.user_metadata?.avatar_url || '';
        let location = authUser.user_metadata?.location || 'Chennai';
        let onboardingComplete = true;

        // Try querying profiles and community_members in Supabase
        try {
          const { data: member } = await supabase
            .from('community_members')
            .select('*')
            .or(`user_id.eq.${authUser.id},email.ilike.${authUser.email}`)
            .maybeSingle();

          if (member) {
            name = member.full_name || name;
            username = member.username || username;
            avatar = member.avatar_url || avatar;
            location = member.location || location;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .maybeSingle();

          if (profile) {
            name = profile.full_name || name;
            username = profile.username || username;
            avatar = profile.avatar_url || avatar;
            location = profile.location || location;
            onboardingComplete = profile.onboarding_complete ?? true;
          }
        } catch {
          // Table fallback
        }

        const savedRole = (typeof window !== 'undefined' ? localStorage.getItem(ROLE_STORAGE_KEY) : null) as UserRole;
        const activeRole: UserRole = savedRole || 'freelancer';

        setUserState({
          id: authUser.id,
          name,
          email: authUser.email || '',
          username,
          avatar,
          location,
          roles: ['freelancer', 'employer'],
          activeRole,
          freelancerOnboardingComplete: onboardingComplete,
          employerOnboardingComplete: onboardingComplete,
          isAuthenticated: true,
        });
      } catch (err) {
        console.error('Error synchronizing user profile:', err);
      }
    };

    // Fetch initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncUserProfile(session.user);
        } else {
          setUserState(DEFAULT_USER);
        }
      } catch (err) {
        console.error('Session sync error:', err);
        setUserState(DEFAULT_USER);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes (single source of truth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUserState(DEFAULT_USER);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tncc_active_user_email');
          localStorage.removeItem('tncc_current_member_id');
          localStorage.removeItem('tncc_admin_session');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUser = (partial: Partial<UserProfile>) => {
    setUserState(prev => ({ ...prev, ...partial }));
  };

  const switchRole = (role: UserRole) => {
    setUserState(prev => ({ ...prev, activeRole: role }));
    if (typeof window !== 'undefined' && role) {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    }
  };

  const addRole = (role: UserRole) => {
    setUserState(prev => {
      const roles = prev.roles.includes(role) ? prev.roles : [...prev.roles, role];
      return { ...prev, roles, activeRole: role };
    });
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    } finally {
      setUserState(DEFAULT_USER);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tncc_active_user_email');
        localStorage.removeItem('tncc_current_member_id');
        localStorage.removeItem('tncc_admin_session');
        localStorage.removeItem('tncc_user');
        localStorage.removeItem('tncc_session');
      }
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      switchRole,
      addRole,
      logout,
      isFreelancer: user.activeRole === 'freelancer',
      isEmployer: user.activeRole === 'employer',
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
