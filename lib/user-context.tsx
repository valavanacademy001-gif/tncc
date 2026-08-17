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

const STORAGE_KEY = 'tncc_user_profile';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth state
  useEffect(() => {
    const supabase = createClient();

    // Fetch initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const authUser = session.user;
          // Fetch profile and roles
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          const { data: rolesData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', authUser.id);

          const userRoles = rolesData?.map(r => r.role as UserRole) || ['freelancer'];

          setUserState(prev => ({
            ...prev,
            id: authUser.id,
            name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            username: profile?.username || authUser.email?.split('@')[0] || 'user',
            avatar: profile?.avatar_url || '',
            location: profile?.location || 'Chennai',
            roles: userRoles,
            activeRole: prev.activeRole || userRoles[0] || 'freelancer',
            freelancerOnboardingComplete: profile?.onboarding_complete || false,
            isAuthenticated: true,
          }));
        } else {
          // Check local storage fallback
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setUserState(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error('Session sync error:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = session.user;
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id);

        const userRoles = rolesData?.map(r => r.role as UserRole) || ['freelancer'];

        setUserState(prev => ({
          ...prev,
          id: authUser.id,
          name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          username: profile?.username || authUser.email?.split('@')[0] || 'user',
          avatar: profile?.avatar_url || '',
          location: profile?.location || 'Chennai',
          roles: userRoles,
          activeRole: prev.activeRole || userRoles[0] || 'freelancer',
          freelancerOnboardingComplete: profile?.onboarding_complete || false,
          isAuthenticated: true,
        }));
      } else if (event === 'SIGNED_OUT') {
        setUserState(DEFAULT_USER);
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const setUser = (partial: Partial<UserProfile>) => {
    setUserState(prev => ({ ...prev, ...partial }));
  };

  const switchRole = (role: UserRole) => {
    setUserState(prev => ({ ...prev, activeRole: role }));
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
    } catch {
      // fallback
    } finally {
      setUserState(DEFAULT_USER);
      localStorage.removeItem(STORAGE_KEY);
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
