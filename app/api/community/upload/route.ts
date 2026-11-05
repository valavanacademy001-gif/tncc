import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// File size limits in bytes
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Upfront Content-Length check to prevent memory exhaustion and reject oversized payloads
    const contentLength = req.headers.get('content-length');
    if (contentLength) {
      const parsedLength = parseInt(contentLength, 10);
      if (!isNaN(parsedLength) && parsedLength > MAX_VIDEO_SIZE_BYTES) {
        const sizeMB = (parsedLength / (1024 * 1024)).toFixed(2);
        return NextResponse.json(
          {
            success: false,
            error: `Video file size exceeds the 50 MB limit (Selected: ${sizeMB} MB). Please upload a smaller video or share via Google Drive.`,
          },
          { status: 400 }
        );
      }
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to parse upload body: ${formErr.message || 'File may exceed body limits.'}`,
        },
        { status: 400 }
      );
    }

    const file = formData.get('file') as File | null;
    const memberId = (formData.get('member_id') as string) || 'anonymous';
    const uploadBucket = (formData.get('bucket') as string) || 'community-media';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in upload request.' },
        { status: 400 }
      );
    }

    const mimeType = file.type.toLowerCase();
    const fileSize = file.size;
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    // Validate MIME Type
    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type "${mimeType}". Allowed: JPG, PNG, WEBP (images) or MP4, WEBM, MOV (videos).`,
        },
        { status: 400 }
      );
    }

    // Validate File Size
    if (isImage && fileSize > MAX_IMAGE_SIZE_BYTES) {
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `Image file size exceeds the 1 MB limit (Selected: ${sizeMB} MB). Please choose a smaller image.`,
        },
        { status: 400 }
      );
    }

    if (isVideo && fileSize > MAX_VIDEO_SIZE_BYTES) {
      const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `Video file size exceeds the 50 MB limit (Selected: ${sizeMB} MB). Please upload a smaller video or share via Google Drive.`,
        },
        { status: 400 }
      );
    }

    const mediaType = isImage ? 'image' : 'video';
    const rawExtension = file.name.split('.').pop() || (isImage ? 'jpg' : 'mp4');
    const sanitizedExt = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;
    const storagePath = `${memberId}/${mediaType}/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try Supabase Storage upload
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

    let publicUrl: string | null = null;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const { error: uploadError } = await supabase.storage
          .from(uploadBucket)
          .upload(storagePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from(uploadBucket)
            .getPublicUrl(storagePath);
          publicUrl = urlData.publicUrl;
        } else {
          console.warn('Supabase storage upload returned error, applying fallback:', uploadError.message);
        }
      } catch (storageErr: any) {
        console.warn('Supabase storage exception, applying fallback:', storageErr.message);
      }
    }

    // Local / Dev Fallback if Supabase storage is not configured or fails
    if (!publicUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', memberId);
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localFilePath = path.join(uploadsDir, uniqueFileName);
        fs.writeFileSync(localFilePath, buffer);
        publicUrl = `/uploads/${memberId}/${uniqueFileName}`;
      } catch (localErr: any) {
        console.warn('Local file write error, using Base64 data URL for image preview:', localErr.message);
        // Base64 Data URL fallback for small images
        if (isImage) {
          publicUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
        } else {
          return NextResponse.json(
            { success: false, error: 'Storage upload failed and local fallback write was not permitted.' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicUrl,
      media_type: mediaType,
      file_name: file.name,
      file_size: fileSize,
      content_type: mimeType,
      storage_path: storagePath,
    });
  } catch (err: any) {
    console.error('Upload endpoint error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error processing file upload.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storagePath = searchParams.get('path');
    const bucket = searchParams.get('bucket') || 'community-media';

    if (!storagePath) {
      return NextResponse.json({ success: false, error: 'Path is required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      await supabase.storage.from(bucket).remove([storagePath]);
    }

    return NextResponse.json({ success: true, message: 'Media record removed successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
