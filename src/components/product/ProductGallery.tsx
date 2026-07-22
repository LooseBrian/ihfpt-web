"use client";

import { useState, useRef } from "react";
import { SafeImage } from "@/components/shared/SafeImage";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Play, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import type { ProductVideo } from "@/lib/data";

interface ProductGalleryProps {
  images: string[];
  videos?: ProductVideo[];
  productName: string;
  isHot?: boolean;
  isBestSeller?: boolean;
}

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
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      setVideoPlaying(false);
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

  const handleVideoPlay = () => {
    setVideoPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100);
  };

  return (
    <div className="space-y-3">
      {/* ===== Main Display Area ===== */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border shadow-sm group">
        {isVideo && currentVideo ? (
          // Video player
          videoPlaying ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              playsInline
            >
              <source src={currentVideo.url} type="video/mp4" />
            </video>
          ) : (
            // Video thumbnail with play button
            <button
              onClick={handleVideoPlay}
              className="w-full h-full relative flex items-center justify-center"
            >
              <SafeImage
                src={currentVideo.thumbnail || currentVideo.url}
                alt={currentVideo.title || productName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 text-brand-600 ml-1" fill="currentColor" />
                </div>
              </div>
              {currentVideo.duration && (
                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {currentVideo.duration}
                </span>
              )}
              {currentVideo.title && (
                <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-[60%] truncate">
                  {currentVideo.title}
                </span>
              )}
            </button>
          )
        ) : (
          // Image display
          <>
            <SafeImage
              src={images[activeIndex] || images[0]}
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
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => navigate("next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}

        {/* Counter */}
        {thumbnails.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
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
                <SafeImage
                  src={isVid ? thumb.thumbnail : thumb.url}
                  alt={`thumbnail-${index}`}
                  fill
                  className="object-cover"
                />
                {isVid && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="h-5 w-5 text-white" fill="currentColor" />
                  </div>
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
