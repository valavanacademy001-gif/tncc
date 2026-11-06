'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, Loader2, Sparkles, FolderOpen } from 'lucide-react';

interface AdminMediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner' | 'auto';
  placeholder?: string;
  accept?: string;
}

export default function AdminMediaUploader({
  label,
  value,
  onChange,
  helperText,
  aspectRatio = 'banner',
  placeholder = 'https://images.unsplash.com/...',
  accept = 'image/jpeg,image/png,image/webp,video/mp4',
}: AdminMediaUploaderProps) {
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'gallery'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      setLoadingGallery(true);
      const res = await fetch('/api/community/admin/media');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.media)) {
          setGalleryItems(data.media);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoadingGallery(false);
    }
  };

  useEffect(() => {
    if (activeMode === 'gallery' && galleryItems.length === 0) {
      fetchGallery();
    }
  }, [activeMode]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(15);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('member_id', 'admin_media');
      formData.append('bucket', 'community-media');

      setUploadProgress(45);

      const res = await fetch('/api/community/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload file.');
      }

      setUploadProgress(100);
      const publicUrl = data.url || data.publicUrl;
      onChange(publicUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try a different file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const samplePresets = [
    { label: 'Branding', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Typography', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Film & Color', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80' },
    { label: '3D Cyberpunk', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        {helperText && <span className="text-[11px] text-gray-400">{helperText}</span>}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMode === 'upload'
              ? 'bg-white text-[#0D2C5B] shadow-xs font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-[#E84020]" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMode === 'url'
              ? 'bg-white text-[#0D2C5B] shadow-xs font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5 text-[#00B5C8]" />
          <span>Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('gallery')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMode === 'gallery'
              ? 'bg-white text-[#0D2C5B] shadow-xs font-bold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Media Gallery</span>
        </button>
      </div>

      {/* Mode 1: File Upload Dropzone */}
      {activeMode === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#E84020] bg-orange-50/50'
              : 'border-gray-200 bg-[#FAF8F5] hover:bg-white hover:border-[#0D2C5B]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {isUploading ? (
            <div className="py-2 space-y-2 text-center w-full max-w-xs">
              <Loader2 className="w-6 h-6 animate-spin text-[#E84020] mx-auto" />
              <p className="text-xs font-bold text-[#0D2C5B]">Uploading to Community Storage...</p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E84020] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 py-1">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-[#E84020] mx-auto">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-[#0D2C5B]">
                Drag and drop your thumbnail here, or <span className="text-[#E84020] underline">browse</span>
              </p>
              <p className="text-[10px] text-gray-400">
                Supports JPG, PNG, WEBP (≤1 MB) or MP4 (≤50 MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {activeMode === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0D2C5B] text-[#0D2C5B]"
          />
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
            <span className="text-gray-400 shrink-0">Presets:</span>
            {samplePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange(preset.url)}
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-orange-50 hover:text-[#E84020] text-gray-600 border border-gray-200 transition-colors shrink-0"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Pick from Media Gallery */}
      {activeMode === 'gallery' && (
        <div className="space-y-2">
          {loadingGallery ? (
            <div className="py-6 flex items-center justify-center text-xs text-gray-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#0D2C5B]" />
              <span>Loading media library...</span>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-5 text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed">
              No media items uploaded yet. Upload via the Upload tab!
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200">
              {galleryItems.map((item) => {
                const isSelected = value === item.url;
                return (
                  <button
                    key={item.id || item.url}
                    type="button"
                    onClick={() => onChange(item.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                      isSelected
                        ? 'border-[#E84020] ring-2 ring-[#E84020]/20'
                        : 'border-transparent hover:border-[#0D2C5B]'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E84020] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {uploadError && (
        <div className="p-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Current Preview Box */}
      {value && (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 flex items-center justify-center max-h-44 group">
          <img
            src={value}
            alt="Thumbnail preview"
            className="w-full h-44 object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Active Preview
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
