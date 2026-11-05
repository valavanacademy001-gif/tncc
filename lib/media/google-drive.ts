/**
 * Google Drive Media Parser & Preview Helper
 * Supports direct embedding and previewing of public Google Drive image & video links.
 */

export interface GoogleDriveMediaInfo {
  isGoogleDrive: boolean;
  fileId: string | null;
  isFolder: boolean;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  originalUrl: string;
}

// Regex patterns to capture fileId from different Google Drive link formats
const GOOGLE_DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/uc\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i,
  /docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i,
  /drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+)/i,
];

const GOOGLE_DRIVE_FOLDER_PATTERN = /drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i;

/**
 * Parses any Google Drive URL and extracts the file ID and preview links.
 */
export function parseGoogleDriveUrl(rawUrl: string): GoogleDriveMediaInfo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      isGoogleDrive: false,
      fileId: null,
      isFolder: false,
      embedUrl: null,
      thumbnailUrl: null,
      originalUrl: rawUrl || '',
    };
  }

  const trimmed = rawUrl.trim();

  // Check if folder
  const folderMatch = trimmed.match(GOOGLE_DRIVE_FOLDER_PATTERN);
  if (folderMatch) {
    return {
      isGoogleDrive: true,
      fileId: folderMatch[1],
      isFolder: true,
      embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`,
      thumbnailUrl: null,
      originalUrl: trimmed,
    };
  }

  // Check file patterns
  for (const pattern of GOOGLE_DRIVE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        isGoogleDrive: true,
        fileId,
        isFolder: false,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
        originalUrl: trimmed,
      };
    }
  }

  return {
    isGoogleDrive: false,
    fileId: null,
    isFolder: false,
    embedUrl: null,
    thumbnailUrl: null,
    originalUrl: trimmed,
  };
}

/**
 * Quick boolean check if a URL is a Google Drive link
 */
export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return /drive\.google\.com|docs\.google\.com/i.test(url);
}

/**
 * Returns the best image preview URL for a given media URL.
 * If Google Drive, returns the high-res thumbnail. Otherwise returns the raw URL.
 */
export function resolvePreviewImageUrl(url?: string): string {
  if (!url) return '';
  const gdrive = parseGoogleDriveUrl(url);
  if (gdrive.isGoogleDrive && gdrive.thumbnailUrl) {
    return gdrive.thumbnailUrl;
  }
  return url;
}

/**
 * Returns the best embed player URL for a given video URL.
 * If Google Drive, returns the official /preview embed URL. Otherwise returns the raw URL.
 */
export function resolveVideoSource(url?: string): { isEmbed: boolean; sourceUrl: string } {
  if (!url) return { isEmbed: false, sourceUrl: '' };
  const gdrive = parseGoogleDriveUrl(url);
  if (gdrive.isGoogleDrive && gdrive.embedUrl) {
    return { isEmbed: true, sourceUrl: gdrive.embedUrl };
  }
  return { isEmbed: false, sourceUrl: url };
}
