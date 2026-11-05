'use client';

import React, { useState } from 'react';
import { useCommunity } from '../../lib/community-context';
import { ChallengeSubmission } from '../../lib/types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  HardDrive, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';

interface SubmissionModalProps {
  challengeId: string;
  challengeTitle: string;
  submissionDeadline?: string;
  existingSubmission?: ChallengeSubmission;
  onClose: () => void;
}

export default function ChallengeSubmissionModal({
  challengeId,
  challengeTitle,
  submissionDeadline,
  existingSubmission,
  onClose,
}: SubmissionModalProps) {
  const { submitChallenge } = useCommunity();
  const isUpdate = Boolean(existingSubmission);

  const [title, setTitle] = useState(existingSubmission?.title || '');
  const [description, setDescription] = useState(existingSubmission?.description || '');
  const [submissionType, setSubmissionType] = useState<'image' | 'video' | 'pdf' | 'gdrive' | 'portfolio'>(
    existingSubmission?.submission_type || 'image'
  );
  const [submissionUrl, setSubmissionUrl] = useState(existingSubmission?.submission_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDeadlineExpired = submissionDeadline
    ? new Date().getTime() > new Date(submissionDeadline).getTime()
    : false;

  const submissionOptions = [
    { type: 'image', label: 'Image URL', icon: ImageIcon },
    { type: 'video', label: 'Video URL', icon: Video },
    { type: 'pdf', label: 'PDF Document', icon: FileText },
    { type: 'gdrive', label: 'Google Drive Link', icon: HardDrive },
    { type: 'portfolio', label: 'Behance / Portfolio', icon: ExternalLink },
  ] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !submissionUrl.trim() || isSubmitting) return;

    if (isDeadlineExpired) {
      setErrorMessage('Submissions rejected: The competition deadline has expired.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await submitChallenge({
        challenge_id: challengeId,
        title: title.trim(),
        description: description.trim() || undefined,
        submission_type: submissionType,
        submission_url: submissionUrl.trim(),
        is_update: isUpdate,
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Submission could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0D2C5B]">
                {isUpdate ? 'Update Challenge Entry' : 'Submit Challenge Entry'}
              </h3>
              {!isUpdate && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E84020]/10 text-[#E84020]">
                  +15 XP Reward
                </span>
              )}
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

        {/* Deadline Warning Banner if expired */}
        {isDeadlineExpired && (
          <div className="p-3.5 bg-red-50 border-b border-red-200 text-red-800 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              <strong>Deadline Expired:</strong> This competition is no longer accepting new submissions or updates.
            </span>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

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
                    disabled={isDeadlineExpired || isSubmitting}
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
              disabled={isDeadlineExpired || isSubmitting}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Silappatikaram Festival Poster Series"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] disabled:opacity-60"
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
              disabled={isDeadlineExpired || isSubmitting}
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] disabled:opacity-60"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Ensure links are publicly accessible so administrators can view your creative artifact.
            </p>
          </div>

          {/* Design Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Design Statement / Concept Notes (Optional)
            </label>
            <textarea
              rows={2}
              disabled={isDeadlineExpired || isSubmitting}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your creative direction, software used, or Tamil typography choices..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#F8F6F1] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0D2C5B] resize-none disabled:opacity-60"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !submissionUrl.trim() || isDeadlineExpired || isSubmitting}
              className="px-6 py-2.5 bg-[#E84020] hover:bg-[#FF5733] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating Entry...</span>
                </>
              ) : (
                <>
                  <span>{isUpdate ? 'Update Entry' : 'Confirm Submission'}</span>
                  {!isUpdate && (
                    <span className="px-1.5 py-0.2 bg-white/20 text-[9px] font-extrabold rounded-full">
                      +15 XP
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

