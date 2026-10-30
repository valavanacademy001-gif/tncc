'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useCommunity } from '@/tncc-community/lib/community-context';
import ChallengeWinnersPodium from '@/tncc-community/components/challenges/ChallengeWinnersPodium';
import ChallengeSubmissionModal from '@/tncc-community/components/challenges/ChallengeSubmissionModal';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  UploadCloud 
} from 'lucide-react';

export default function ChallengeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { getChallengeById, currentMember } = useCommunity();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const challenge = getChallengeById(resolvedParams.id);

  if (!challenge) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-[#0D2C5B]">Challenge not found</h2>
        <Link href="/community/challenges" className="text-xs font-bold text-[#E84020] hover:underline">
          Return to Challenges
        </Link>
      </div>
    );
  }

  const isCompleted = challenge.status === 'Completed';
  const isActive = challenge.status === 'Active';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Back Link */}
      <Link
        href="/community/challenges"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0D2C5B] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Competitions</span>
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] bg-gray-900 shadow-lg">
        <img
          src={challenge.thumbnail_url}
          alt={challenge.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#E84020] text-white">
              {challenge.status}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
              {challenge.category}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFB84D] text-[#0D2C5B]">
              ⚡ +{challenge.xp_reward} Participation XP
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {challenge.title}
          </h1>
        </div>
      </div>

      {/* Winners Podium if completed */}
      {isCompleted && challenge.winners && (
        <ChallengeWinnersPodium winners={challenge.winners} />
      )}

      {/* Grid: Details & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Description, Requirements & References */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0D2C5B] mb-2">Challenge Overview</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{challenge.description}</p>
            </div>

            {/* Design Requirements */}
            {challenge.requirements && challenge.requirements.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#0D2C5B] mb-3">Design & Submission Requirements</h3>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#00B5C8] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rules & Guidelines */}
            {challenge.rules && challenge.rules.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#0D2C5B] mb-3">Competition Rules</h3>
                <ul className="space-y-2">
                  {challenge.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E84020] shrink-0 mt-2" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reference Images */}
            {challenge.reference_images && challenge.reference_images.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#0D2C5B] mb-3">Creative Reference Material</h3>
                <div className="grid grid-cols-2 gap-4">
                  {challenge.reference_images.map((ref, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200">
                      <img src={ref} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Prizes & Submission Call to Action */}
        <div className="lg:col-span-4 space-y-6">
          {/* Prizes Card */}
          <div className="bg-[#FFF8EC] rounded-3xl border border-orange-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#E84020]" />
              <h3 className="font-extrabold text-sm text-[#0D2C5B]">Prizes & XP Rewards</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-orange-100">
                <span className="text-[10px] font-extrabold text-[#F5A623] uppercase">👑 1st Place</span>
                <p className="text-xs font-bold text-[#0D2C5B] mt-0.5">{challenge.prizes.first}</p>
                <span className="text-[10px] font-bold text-[#E84020]">+{challenge.bonus_xp_first} XP Bonus</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-orange-100">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase">🥈 2nd Place</span>
                <p className="text-xs font-bold text-[#0D2C5B] mt-0.5">{challenge.prizes.second}</p>
                <span className="text-[10px] font-bold text-[#E84020]">+{challenge.bonus_xp_second} XP Bonus</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-orange-100">
                <span className="text-[10px] font-extrabold text-[#CD7F32] uppercase">🥉 3rd Place</span>
                <p className="text-xs font-bold text-[#0D2C5B] mt-0.5">{challenge.prizes.third}</p>
                <span className="text-[10px] font-bold text-[#00B5C8]">+{challenge.bonus_xp_third} XP Bonus</span>
              </div>
            </div>
          </div>

          {/* Submission Action Box */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-4 h-4 text-[#E84020]" />
                <span className="font-bold text-[#0D2C5B]">Deadline</span>
              </div>
              <p className="text-xs text-gray-600">
                {new Date(challenge.submission_deadline).toLocaleString()}
              </p>
            </div>

            {challenge.user_submitted ? (
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <p className="text-xs font-bold text-green-800">Your Entry is Recorded</p>
                <p className="text-[11px] text-green-700">+15 XP has been awarded to your profile!</p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="text-xs font-bold text-green-900 underline mt-1"
                >
                  Replace or Update Submission
                </button>
              </div>
            ) : isActive ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Your Creative Work</span>
                <span className="px-1.5 py-0.2 bg-white/20 text-[9px] font-extrabold rounded-full">
                  +15 XP
                </span>
              </button>
            ) : (
              <div className="p-3 bg-gray-100 rounded-xl text-center text-xs text-gray-500 font-medium">
                {isCompleted ? 'Competition Closed' : 'Submissions Open Soon'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <ChallengeSubmissionModal
          challengeId={challenge.id}
          challengeTitle={challenge.title}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
