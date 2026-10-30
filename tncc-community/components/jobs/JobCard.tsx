'use client';

import React, { useState } from 'react';
import { CommunityJobOffer } from '../../lib/types';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  IndianRupee, 
  ExternalLink,
  X,
  CheckCircle2 
} from 'lucide-react';

interface JobCardProps {
  job: CommunityJobOffer;
}

export default function JobCard({ job }: JobCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
        <div className="space-y-4">
          {/* Company row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={job.company_logo_url}
                alt={job.company_name}
                className="w-12 h-12 rounded-2xl object-cover border border-gray-100 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-700 leading-tight">
                  {job.company_name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D2C5B]/5 text-[#0D2C5B]">
              {job.work_mode}
            </span>
          </div>

          {/* Job Title & Category */}
          <div>
            <h3 className="font-extrabold text-base text-[#0D2C5B] group-hover:text-[#E84020] transition-colors leading-snug">
              {job.title}
            </h3>
            <span className="text-xs font-semibold text-[#00B5C8]">
              {job.category}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Skills tags */}
          <div className="flex flex-wrap gap-1.5">
            {job.required_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#F8F6F1] text-gray-700 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Salary & Type */}
          <div className="pt-2 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span className="font-bold text-[#E84020]">{job.salary_range || 'Competitive'}</span>
            <span>{job.job_type} · {job.experience_level}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Posted {new Date(job.posted_date).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-gray-600 hover:text-[#0D2C5B] px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Details
            </button>
            <a
              href={job.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0D2C5B] hover:bg-[#E84020] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={job.company_logo_url}
                  alt={job.company_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-bold text-[#0D2C5B] leading-tight">{job.title}</h3>
                  <p className="text-xs text-gray-500">{job.company_name} · {job.location} ({job.work_mode})</p>
                  <p className="text-xs font-bold text-[#E84020] mt-1">{job.salary_range}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <h4 className="font-bold text-[#0D2C5B] text-sm mb-1">About the Role</h4>
                <p className="leading-relaxed">{job.description}</p>
              </div>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#0D2C5B] text-sm mb-1.5">Key Responsibilities</h4>
                  <ul className="space-y-1 list-disc pl-4 text-gray-600">
                    {job.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-bold text-[#0D2C5B] text-sm mb-1.5">Required Skills & Tools</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.required_skills?.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#F8F6F1] rounded-md font-semibold text-gray-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Direct hiring link</span>
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#E84020] hover:bg-[#FF5733] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Proceed to Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
