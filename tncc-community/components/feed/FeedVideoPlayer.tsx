'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ExternalLink,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { parseGoogleDriveUrl } from '@/lib/media/google-drive';

// Global reference to ensure only one feed video plays at a time
let currentlyPlayingVideo: HTMLVideoElement | null = null;

interface FeedVideoPlayerProps {
  src: string;
  poster?: string;
  aspectRatioClass?: string;
  onDoubleTap?: () => void;
}

export default function FeedVideoPlayer({
  src,
  poster,
  aspectRatioClass = 'aspect-[16/9] max-h-[480px]',
  onDoubleTap,
}: FeedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDriveInteractive, setIsDriveInteractive] = useState(false);

  const lastTapRef = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const gdrive = parseGoogleDriveUrl(src);

  // Manage viewport-based muted autoplay for native HTML5 video
  useEffect(() => {
    if (gdrive.isGoogleDrive) return; // Google Drive iframe handles its own playback policy

    const videoElement = videoRef.current;
    const containerElement = containerRef.current;
    if (!videoElement || !containerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Pause any previously playing feed video
            if (currentlyPlayingVideo && currentlyPlayingVideo !== videoElement) {
              currentlyPlayingVideo.pause();
            }

            videoElement.muted = isMuted;
            videoElement
              .play()
              .then(() => {
                currentlyPlayingVideo = videoElement;
                setIsPlaying(true);
              })
              .catch(() => {
                // Autoplay blocked by browser policy; wait for manual user play
                setIsPlaying(false);
              });
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
            videoElement.pause();
            setIsPlaying(false);
            if (currentlyPlayingVideo === videoElement) {
              currentlyPlayingVideo = null;
            }
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(containerElement);

    return () => {
      observer.disconnect();
      if (currentlyPlayingVideo === videoElement) {
        currentlyPlayingVideo = null;
      }
    };
  }, [gdrive.isGoogleDrive, isMuted]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
        currentlyPlayingVideo.pause();
      }
      video
        .play()
        .then(() => {
          currentlyPlayingVideo = video;
          setIsPlaying(true);
        })
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
      if (currentlyPlayingVideo === video) {
        currentlyPlayingVideo = null;
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newFraction = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = newFraction * video.duration;
  };

  // Double tap handler
  const handleContainerTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (onDoubleTap) onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // If Google Drive link: render official responsive iframe or preview card
  if (gdrive.isGoogleDrive && gdrive.fileId) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full bg-black/90 overflow-hidden flex items-center justify-center select-none ${aspectRatioClass}`}
        onDoubleClick={onDoubleTap}
        onTouchEnd={handleContainerTouchEnd}
      >
        {isDriveInteractive ? (
          <iframe
            src={`https://drive.google.com/file/d/${gdrive.fileId}/preview`}
            title="Google Drive Video Player"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-[#0D2C5B]/80 to-black/90">
            {/* Google Drive Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-4 border border-white/20">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Google Drive Video</span>
            </div>

            <button
              type="button"
              onClick={() => setIsDriveInteractive(true)}
              className="w-14 h-14 rounded-full bg-[#E84020] hover:bg-[#FF5733] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 mb-4 group cursor-pointer"
              title="Play Google Drive Video"
            >
              <Play className="w-6 h-6 fill-white ml-1" />
            </button>

            <p className="text-xs text-gray-300 max-w-sm">
              Click play to stream directly via Google Drive viewer.
            </p>

            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-white mt-3 underline transition-colors"
            >
              <span>Open in Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // Native HTML5 Video Player
  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black overflow-hidden flex items-center justify-center select-none group cursor-pointer ${aspectRatioClass}`}
      onDoubleClick={onDoubleTap}
      onTouchEnd={handleContainerTouchEnd}
      onClick={() => setShowControls((prev) => !prev)}
    >
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          <p className="text-xs font-medium">Video could not be played.</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#E84020] underline flex items-center gap-1"
          >
            <span>Open external link</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            muted={isMuted}
            loop
            onTimeUpdate={handleTimeUpdate}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />

          {/* Center Play/Pause button when paused or hovered */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white shadow-xl">
                <Play className="w-6 h-6 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Player Overlay Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 transition-opacity duration-200 ${
              showControls ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-[#E84020] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-[#E84020] transition-colors p-1"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-[#E84020] transition-colors p-1 flex items-center gap-1 text-[11px]"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-red-400" />
                      <span className="text-[10px] text-gray-300">Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] text-gray-300">Sound ON</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hover:text-[#E84020] transition-colors p-1"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
