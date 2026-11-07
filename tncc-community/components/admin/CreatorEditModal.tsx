'use client';

import React, { useState } from 'react';
import { X, Save, UserCheck, ShieldCheck, Sparkles, Key, AlertCircle } from 'lucide-react';
import { CommunityMember } from '@/tncc-community/lib/types';
import AdminMediaUploader from './AdminMediaUploader';

interface CreatorEditModalProps {
  member?: CommunityMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: any) => Promise<void>;
}

export default function CreatorEditModal({
  member,
  isOpen,
  onClose,
  onSave,
}: CreatorEditModalProps) {
  if (!isOpen) return null;

  const isEditing = Boolean(member && member.id);

  const [form, setForm] = useState({
    id: member?.id || '',
    full_name: member?.full_name || '',
    email: member?.email || '',
    role: member?.role || 'member',
    password: '',
    occupation: member?.occupation || '',
    phone: member?.phone || '',
    gender: member?.gender || 'Male',
    age: member?.age ? String(member.age) : '',
    dob: member?.dob || '',
    location: member?.location || 'Chennai, Tamil Nadu',
    login_streak: member?.login_streak !== undefined ? String(member.login_streak) : '0',
    learning_stage: member?.learning_stage || 'Stage 0: Free Member',
    total_xp: member?.total_xp !== undefined ? String(member.total_xp) : '50',
    avatar_url: member?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: member?.bio || 'Tamil Nadu creator crafting impactful visuals and stories.',
    skills: Array.isArray(member?.skills) ? member.skills.join(', ') : 'Graphic Design, Motion Design',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) {
      setErrorMsg('Please enter both legal full name and registered email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        age: form.age ? parseInt(form.age, 10) : undefined,
        login_streak: parseInt(form.login_streak, 10) || 0,
        total_xp: parseInt(form.total_xp, 10) || 0,
        skills: skillsArray.length > 0 ? skillsArray : ['Creator'],
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save creator profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1D2430] rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl animate-scale-up border border-gray-100 dark:border-[#303846] my-auto max-h-[92vh] overflow-y-auto space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#303846] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E84020]/10 flex items-center justify-center text-[#E84020]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0D2C5B] dark:text-[#F5F7FA]">
                {isEditing ? 'Edit Creator Profile' : 'Assign New Creator'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {isEditing ? `Updating verified details for @${member?.username}` : 'Create a registered creator profile with complete credential controls.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* LEGAL FULL NAME */}
          <div>
            <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
              Legal Full Name *
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="e.g. Suganesh Subramanian"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-semibold"
            />
          </div>

          {/* EMAIL ADDRESS & SECURITY ROLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="creator@gmail.com"
                className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-blue-700 flex items-center gap-1 mb-1 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Security Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-semibold"
              >
                <option value="student">Student</option>
                <option value="member">Member</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* SET LOGIN PASSWORD */}
          <div className="p-3 bg-red-50/40 rounded-2xl border border-red-100 space-y-1">
            <label className="font-bold text-red-600 flex items-center gap-1 uppercase tracking-wider text-[11px]">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              Set Login Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEditing ? 'Leave blank to keep existing password' : '••••••••••••'}
              className="w-full px-3.5 py-2 bg-white border border-red-200 rounded-xl focus:outline-none focus:border-[#E84020] text-gray-800 text-xs font-medium"
            />
            <p className="text-[10px] text-gray-400">
              This password is set once. The member can change it via their profile settings.
            </p>
          </div>

          {/* OCCUPATION & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Occupation
              </label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                placeholder="e.g. Motion Designer & 3D Artist"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs"
              />
            </div>
          </div>

          {/* GENDER & AGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Gender
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 23"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs"
              />
            </div>
          </div>

          {/* DATE OF BIRTH & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Date of Birth
              </label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Coimbatore, Tamil Nadu"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-medium"
              />
            </div>
          </div>

          {/* LOGIN STREAK & LEARNING MODE STAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
                Login Streak
              </label>
              <input
                type="number"
                value={form.login_streak}
                onChange={(e) => setForm({ ...form, login_streak: e.target.value })}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-emerald-700 flex items-center gap-1 mb-1 uppercase tracking-wider text-[11px]">
                📈 Learning Mode Stage
              </label>
              <select
                value={form.learning_stage}
                onChange={(e) => setForm({ ...form, learning_stage: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-medium"
              >
                <option value="Stage 0: Free Member">Stage 0: Free Member</option>
                <option value="Stage 1: Creator Novice">Stage 1: Creator Novice</option>
                <option value="Stage 2: Skilled Pro">Stage 2: Skilled Pro</option>
                <option value="Stage 3: Master Director">Stage 3: Master Director</option>
              </select>
            </div>
          </div>

          {/* TOTAL XP */}
          <div>
            <label className="font-bold text-amber-700 flex items-center gap-1 mb-1 uppercase tracking-wider text-[11px]">
              ⚡ Total Experience Points (XP)
            </label>
            <input
              type="number"
              value={form.total_xp}
              onChange={(e) => setForm({ ...form, total_xp: e.target.value })}
              placeholder="50"
              className="w-full px-3.5 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-bold"
            />
          </div>

          {/* AVATAR IMAGE (AdminMediaUploader with Upload, URL & Gallery) */}
          <AdminMediaUploader
            label="Profile Avatar (Image / Photo)"
            value={form.avatar_url}
            onChange={(url) => setForm({ ...form, avatar_url: url })}
            helperText="Upload JPG/PNG, enter URL, or select from Gallery"
          />

          {/* SKILLS */}
          <div>
            <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
              Creative Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="e.g. Typography, Premiere Pro, After Effects, DaVinci"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-medium"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[11px]">
              Creator Bio
            </label>
            <textarea
              rows={2}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tamil Nadu creator crafting impactful visuals and stories."
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-gray-800 text-xs font-medium"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-white bg-[#0D2C5B] hover:bg-[#1B3F7E] font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving Profile...' : isEditing ? 'Update Creator Profile' : 'Assign Creator'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
