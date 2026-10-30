'use client';

import React, { useState } from 'react';
import { useCommunity } from '../../lib/community-context';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  HardDrive, 
  ExternalLink,
  CheckCircle2 
} from 'lucide-react';

interface SubmissionModalProps {
  challengeId: string;
  challengeTitle: string;
  onClose: () => void;
}

export default function ChallengeSubmissionModal({
  challengeId,
  challengeTitle,
  onClose,
}: SubmissionModalProps) {
  const { submitChallenge } = useCommunity();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionType, setSubmissionType] = useState<'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio'>('image');
  const [submissionUrl, setSubmissionUrl] = useState('');

  const submissionOptions = [
    { type: 'image', label: 'Image URL', icon: ImageIcon },
    { type: 'video', label: 'Video URL', icon: Video },
    { type: 'pdf', label: 'PDF Document', icon: FileText },
    { type: 'gdrive', label: 'Google Drive Link', icon: HardDrive },
    { type: 'portfolio', label: 'Behance / Portfolio', icon: ExternalLink },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !submissionUrl.trim()) return;

    submitChallenge({
      challenge_id: challengeId,
      title: title.trim(),
      description: description.trim() || undefined,
      submission_type: submissionType,
      submission_url: submissionUrl.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0D2C5B]">Submit Challenge Entry</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E84020]/10 text-[#E84020]">
                +15 XP Reward
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate max-w-xs">{challengeTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Submission Format Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Submission Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {submissionOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = submissionType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSubmissionType(opt.type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#0D2C5B] bg-[#0D2C5B]/5 text-[#0D2C5B]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E84020]' : 'text-gray-400'}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Project Title / Concept Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Silappatikaram Festival Poster Series"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
            />
          </div>

          {/* Submission URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {submissionType === 'gdrive'
                ? 'Public Google Drive Link *'
                : submissionType === 'portfolio'
                ? 'Behance / External Portfolio URL *'
                : 'Direct File / Artwork URL *'}
            </label>
            <input
              type="url"
              required
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B]"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Ensure Google Drive links have permission set to &quot;Anyone with the link can view&quot;.
            </p>
          </div>

          {/* Design Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Design Statement / Concept Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your creative direction, software used, or Tamil typography choices..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !submissionUrl.trim()}
              className="px-6 py-2.5 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>Confirm Submission</span>
              <span className="px-1.5 py-0.2 bg-white/20 text-[9px] font-extrabold rounded-full">
                +15 XP
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
