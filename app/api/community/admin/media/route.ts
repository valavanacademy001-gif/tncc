import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  media_type: 'image' | 'video';
  file_size?: number;
  created_at: string;
  category?: string;
}

// Curated stock / default admin assets for high availability
const DEFAULT_MEDIA_ASSETS: MediaItem[] = [
  {
    id: 'asset-1',
    name: 'TNCC Creative Ecosystem Banner',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 245000,
    created_at: '2026-10-25T10:00:00Z',
    category: 'Banners',
  },
  {
    id: 'asset-2',
    name: 'Tamil Typography Risograph Poster',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 420000,
    created_at: '2026-10-26T12:00:00Z',
    category: 'Showcases',
  },
  {
    id: 'asset-3',
    name: 'Indie Film Valparai Color Grade',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 512000,
    created_at: '2026-10-27T08:30:00Z',
    category: 'Showcases',
  },
  {
    id: 'asset-4',
    name: 'Madurai Temple 3D Cyberpunk Render',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 680000,
    created_at: '2026-10-28T14:15:00Z',
    category: 'Showcases',
  },
  {
    id: 'asset-5',
    name: 'Chennai Typography Masterclass Cover',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 380000,
    created_at: '2026-10-29T11:00:00Z',
    category: 'Events',
  },
  {
    id: 'asset-6',
    name: 'Design System Figma Resource Cover',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    file_size: 290000,
    created_at: '2026-10-30T16:45:00Z',
    category: 'Resources',
  },
];

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const mediaList: MediaItem[] = [...DEFAULT_MEDIA_ASSETS];

    // 1. Try listing from Supabase Storage community-media bucket
    try {
      const { data: files, error } = await supabase.storage
        .from('community-media')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (!error && Array.isArray(files)) {
        files.forEach((f) => {
          if (f.name && !f.name.startsWith('.')) {
            const { data: urlData } = supabase.storage
              .from('community-media')
              .getPublicUrl(f.name);

            const isVideo = f.name.endsWith('.mp4') || f.name.endsWith('.webm') || f.name.endsWith('.mov');
            mediaList.unshift({
              id: f.id || f.name,
              name: f.name,
              url: urlData.publicUrl,
              media_type: isVideo ? 'video' : 'image',
              file_size: f.metadata?.size,
              created_at: f.created_at || new Date().toISOString(),
              category: 'Uploads',
            });
          }
        });
      }
    } catch {
      // Storage bucket not provisioned
    }

    // 2. Scan public/uploads directory if present
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (fs.existsSync(uploadsDir)) {
        const scanDir = (dir: string) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const ent of entries) {
            const fullPath = path.join(dir, ent.name);
            if (ent.isDirectory()) {
              scanDir(fullPath);
            } else if (!ent.name.startsWith('.')) {
              const relPath = path.relative(path.join(process.cwd(), 'public'), fullPath);
              const isVideo = ent.name.endsWith('.mp4') || ent.name.endsWith('.webm');
              const stats = fs.statSync(fullPath);
              mediaList.unshift({
                id: `local-${ent.name}`,
                name: ent.name,
                url: `/${relPath.replace(/\\/g, '/')}`,
                media_type: isVideo ? 'video' : 'image',
                file_size: stats.size,
                created_at: stats.birthtime.toISOString(),
                category: 'Local Uploads',
              });
            }
          }
        };
        scanDir(uploadsDir);
      }
    } catch {
      // Ignore local filesystem scan issues
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const uniqueList = mediaList.filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    return NextResponse.json({
      success: true,
      media: uniqueList,
      total: uniqueList.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list media assets' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName') || searchParams.get('name');
    const fileUrl = searchParams.get('url');

    if (!fileName && !fileUrl) {
      return NextResponse.json({ success: false, error: 'File name or URL required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. If Supabase storage file
    if (fileName) {
      try {
        await supabase.storage.from('community-media').remove([fileName]);
      } catch {
        // ignore
      }
    }

    // 2. If local /uploads/ file
    if (fileUrl && fileUrl.startsWith('/uploads/')) {
      const localPath = path.join(process.cwd(), 'public', fileUrl);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    return NextResponse.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

