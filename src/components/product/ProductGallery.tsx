"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
import { SafeImage } from "@/components/shared/SafeImage";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Play, ChevronLeft, ChevronRight, X, Maximize2, Video, Loader2 } from "lucide-react";
import type { ProductVideo } from "@/lib/data";

interface ProductGalleryProps {
  images: string[];
  videos?: ProductVideo[];
  productName: string;
  isHot?: boolean;
  isBestSeller?: boolean;
}

/**
 * VideoPoster — displays the first frame of a video as a "poster" image.
 *
 * Uses a muted <video> element with preload="metadata" to show the first frame.
 * This replaces the broken approach of passing a video URL to <img>/next-image,
 * which fails with "暂无图片" because images can't render video data.
 *
 * Following Amazon's pattern: the video element itself serves as the poster,
 * with a play button overlay. No separate thumbnail image is needed.
 */
function VideoPoster({
  src,
  alt,
  className,
  onLoaded,
}: {
  src: string;
  alt: string;
  className?: string;
  onLoaded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      // Seek to 0.1s to ensure a frame is displayed (some browsers
      // show a black frame at 0s for mp4 files)
      try {
        video.currentTime = 0.1;
      } catch {
        // Some browsers may not allow seeking yet
      }
      onLoaded?.();
    };

    video.addEventListener("loadeddata", handleLoaded);
    return () => video.removeEventListener("loadeddata", handleLoaded);
  }, [onLoaded]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="metadata"
      aria-label={alt}
      className={className}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

/**
 * MainVideoPlayer — Amazon-style inline video player for the main display area.
 *
 * KEY DESIGN: Uses a SINGLE always-mounted <video> element (no conditional
 * rendering) so that videoRef is never invalidated.
 *
 * States:
 * 1. Idle (poster): <video muted preload="metadata"> shows first frame + play button overlay
 * 2. Playing: <video controls> with native playback controls (seek, volume, fullscreen)
 * 3. Buffering: spinner overlay shown while video data loads
 *
 * Amazon-inspired UX:
 * - First frame as poster (no separate thumbnail image needed)
 * - Large centered play button before playback
 * - Native controls during playback for full user control
 * - After video ends, poster reappears with replay button
 *
 * CRITICAL FIX: Reset currentTime to 0 before play() to prevent the replay bug
 * where onEnded fires immediately after play() because the video is still at
 * the end position from the previous playback.
 */
const MainVideoPlayer = memo(function MainVideoPlayer({
  video,
  productName,
}: {
  video: ProductVideo;
  productName: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Track if user has clicked play at least once.
  // Prevents handleLoadedData from seeking to 0.1s after React
  // attribute changes trigger a spurious loadeddata event.
  const activatedRef = useRef(false);

  // Seek to 0.1s when metadata loads so a real frame is shown
  // (some browsers show a black frame at currentTime=0 for mp4)
  const handleLoadedData = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Only seek on initial load — skip if user has already activated playback
    if (activatedRef.current) return;
    try {
      v.currentTime = 0.1;
    } catch {
      // Some browsers may not allow seeking yet
    }
  }, []);

  // Start playback when `playing` flips to true.
  // Because the <video> is always mounted, videoRef.current is guaranteed valid.
  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;

    activatedRef.current = true;

    // CRITICAL: Reset to beginning before playing.
    // Without this, replaying after the video ends fails because the
    // video is still at the end position, causing onEnded to fire
    // immediately after play() returns.
    try {
      v.currentTime = 0;
    } catch {
      // ignore seek errors
    }

    // Manage muted/controls via DOM (not React props) to prevent
    // React attribute changes from triggering spurious video reload events.
    v.muted = false;
    v.controls = true;

    // Try unmuted first — the click on the overlay counts as a user gesture
    const playPromise = v.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Browser blocked autoplay with sound — fall back to muted
        v.muted = true;
        v.play().catch(() => {});
      });
    }
  }, [playing]);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setPlaying(false);
    // Reset to poster state via DOM
    const v = videoRef.current;
    if (v) {
      v.controls = false;
      v.muted = true;
      try {
        v.currentTime = 0.1;
      } catch {
        // ignore
      }
    }
  }, []);

  // Buffering state handlers
  const handleWaiting = useCallback(() => setBuffering(true), []);
  const handlePlaying = useCallback(() => setBuffering(false), []);
  const handleCanPlay = useCallback(() => setBuffering(false), []);

  return (
    <div className="relative w-full h-full bg-black">
      {/* ── Single always-mounted <video> element ──
          The ref is never invalidated because we never unmount this element.
          muted is static — unmuted via DOM in useEffect when playing.
          controls is NOT set as a React prop — managed via DOM to prevent
          React attribute changes from triggering spurious loadeddata events. */}
      <video
        ref={videoRef}
        src={video.url}
        muted
        playsInline
        preload="metadata"
        onLoadedData={handleLoadedData}
        onEnded={handleVideoEnd}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onCanPlay={handleCanPlay}
        className="w-full h-full object-contain"
      />

      {/* ── Buffering spinner — shown during video loading ── */}
      {playing && buffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-12 w-12 text-white/80 animate-spin" />
        </div>
      )}

      {/* ── Poster overlay — visible only when NOT playing ──
          Sits on top of the <video> first frame. Clicking it starts playback. */}
      {!playing && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 cursor-pointer group/play flex items-center justify-center"
          role="button"
          tabIndex={0}
          aria-label="播放视频"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePlay();
            }
          }}
        >
          {/* Semi-transparent overlay for play-button contrast */}
          <div className="absolute inset-0 bg-black/20 group-hover/play:bg-black/10 transition-colors" />

          {/* Large centered play button */}
          <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover/play:scale-110 transition-transform">
            <Play className="h-7 w-7 md:h-9 md:w-9 text-brand-600 ml-1" fill="currentColor" />
          </div>

          {/* Duration badge (bottom-right) */}
          {video.duration && (
            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </span>
          )}

          {/* Video title (bottom-left) */}
          {video.title && (
            <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-[60%] truncate">
              {video.title}
            </span>
          )}

          {/* "视频" badge (top-left) */}
          <div className="absolute top-3 left-3 bg-brand-600/90 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <Video className="h-3 w-3" />
            视频
          </div>
        </div>
      )}
    </div>
  );
});

export function ProductGallery({
  images,
  videos = [],
  productName,
  isHot,
  isBestSeller,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Combine: images + video thumbnails into a unified thumbnail list
  type ThumbItem =
    | { type: "image"; url: string }
    | { type: "video"; url: string; thumbnail: string; videoUrl: string; title: string; duration: string };

  const thumbnails: ThumbItem[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((v) => ({
      type: "video" as const,
      url: v.thumbnail || v.url,
      thumbnail: v.thumbnail || v.url,
      videoUrl: v.url,
      title: v.title || "视频",
      duration: v.duration || "",
    })),
  ];

  const handleThumbClick = (index: number) => {
    const item = thumbnails[index];
    setActiveIndex(index);
    if (item.type === "video") {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  };

  const currentVideo = isVideo
    ? videos[activeIndex - images.length]
    : null;

  const navigate = (dir: "prev" | "next") => {
    const total = thumbnails.length;
    if (dir === "prev") {
      const next = (activeIndex - 1 + total) % total;
      handleThumbClick(next);
    } else {
      const next = (activeIndex + 1) % total;
      handleThumbClick(next);
    }
  };

  return (
    <div className="space-y-3">
      {/* ===== Main Display Area ===== */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border shadow-sm group">
        {isVideo && currentVideo ? (
          // Video player (Amazon-style: poster frame + play button)
          // key={url} forces remount when switching between videos, resetting player state
          <MainVideoPlayer key={currentVideo.url} video={currentVideo} productName={productName} />
        ) : (
          // Image display
          <>
            <SafeImage
              src={images[activeIndex] || images[0] || "/media/product-placeholder.svg"}
              alt={productName}
              fill
              className="object-cover"
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              title="放大查看"
            >
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </>
        )}

        {/* Hot / BestSeller badges */}
        {isHot && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white gap-1 z-10">
            <TrendingUp className="h-3 w-3" />
            热销
          </Badge>
        )}
        {isBestSeller && (
          <Badge className="absolute top-4 right-4 bg-gold-500 text-white z-10">
            爆款
          </Badge>
        )}

        {/* Navigation arrows */}
        {thumbnails.length > 1 && (
          <>
            <button
              onClick={() => navigate("prev")}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => navigate("next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}

        {/* Counter */}
        {thumbnails.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full z-10">
            {activeIndex + 1} / {thumbnails.length}
          </div>
        )}
      </div>

      {/* ===== Thumbnail Strip ===== */}
      {thumbnails.length > 1 && (
        <div
          ref={thumbnailStripRef}
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
        >
          {thumbnails.map((thumb, index) => {
            const isActive = index === activeIndex;
            const isVid = thumb.type === "video";
            return (
              <button
                key={index}
                onClick={() => handleThumbClick(index)}
                className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  isActive
                    ? "border-brand-500 shadow-md"
                    : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                {isVid ? (
                  // Video thumbnail: use <video> element to show first frame
                  // (replaces broken SafeImage approach that showed "暂无图片")
                  <>
                    <VideoPoster
                      src={thumb.videoUrl}
                      alt={`thumbnail-${index}`}
                      className="absolute inset-0"
                    />
                    {/* Dark overlay with play icon */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-3.5 w-3.5 text-brand-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {/* "视频" badge */}
                    <div className="absolute top-0.5 left-0.5 bg-brand-600/90 text-white text-[9px] font-medium px-1 py-0.5 rounded flex items-center gap-0.5">
                      <Video className="h-2 w-2" />
                      视频
                    </div>
                    {/* Duration badge */}
                    {thumb.duration && (
                      <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] px-1 rounded">
                        {thumb.duration}
                      </span>
                    )}
                  </>
                ) : (
                  // Image thumbnail
                  <SafeImage
                    src={thumb.url}
                    alt={`thumbnail-${index}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ===== Lightbox (full-screen image viewer) ===== */}
      {lightboxOpen && !isVideo && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <SafeImage
              src={images[activeIndex] || images[0]}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("prev"); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("next"); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {activeIndex + 1} / {thumbnails.length}
          </span>
        </div>
      )}
    </div>
  );
}
