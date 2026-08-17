'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  bucket: 'avatars' | 'portfolio' | 'project-attachments' | 'package-images' | 'event-images';
  value?: string;
  onChange: (url: string) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  aspectRatio?: string;
  label?: string;
}

export default function ImageUpload({
  bucket,
  value,
  onChange,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  label = 'Upload Image',
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProgress(20);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      setProgress(50);

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      setProgress(80);

      if (uploadError) {
        // If bucket doesn't exist yet or storage fails, provide fallback data URL or clear error message
        console.warn('Storage upload error (bucket may need setup):', uploadError.message);
        // Create local object URL preview as fallback
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
        setProgress(100);
        return;
      }

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        onChange(publicUrlData.publicUrl);
        setProgress(100);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
          {label}
        </label>
      )}

      {value ? (
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(13,44,91,0.12)',
          aspectRatio: '16/9',
          maxHeight: '220px',
          background: 'var(--cream)',
        }}>
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(13,44,91,0.4)',
            opacity: 0,
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
          className="upload-overlay"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary btn-sm"
              style={{ background: 'white', color: 'var(--navy)' }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#EF4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'var(--cyan)' : 'rgba(13,44,91,0.18)'}`,
            borderRadius: '16px',
            padding: '32px 20px',
            textAlign: 'center',
            background: dragging ? 'rgba(0,181,200,0.04)' : 'var(--cream)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={24} color="var(--cyan)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--navy)', fontWeight: 600 }}>Uploading... {progress}%</span>
              <div style={{ width: '120px', height: '4px', background: 'rgba(13,44,91,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--cyan)', transition: 'width 0.2s' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(0,181,200,0.1)',
                color: 'var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <UploadCloud size={20} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)' }}>
                Click to upload or drag and drop
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                PNG, JPG, WEBP up to {maxSizeMB}MB
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.75rem', color: '#EF4444' }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleChange}
        style={{ display: 'none' }}
      />

      <style jsx>{`
        div:hover > .upload-overlay { opacity: 1 !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
