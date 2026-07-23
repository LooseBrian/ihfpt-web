"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  ImageIcon,
  VideoIcon,
  AlertCircle,
  CheckCircle2,
  Play,
  Plus,
  Info,
} from "lucide-react";

// ===== Media constraints (based on Taobao/Amazon/Made-in-China standards) =====

export const IMAGE_LIMITS = {
  maxCount: 8,
  maxSize: 5, // MB
  acceptedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  minWidth: 800,
  minHeight: 800,
  maxWidth: 10000,
  maxHeight: 10000,
  recommendedSize: "800×800 ~ 1000×1000 px",
};

export const VIDEO_LIMITS = {
  maxCount: 3,
  maxSize: 15, // MB — must match VIDEO_MAX_BASE64_SIZE (base64 storage constraint)
  acceptedFormats: ["video/mp4", "video/quicktime", "video/webm"],
  acceptedExtensions: [".mp4", ".mov", ".webm"],
  maxDuration: 300, // seconds (5 min)
  recommendedDuration: "30秒 ~ 60秒",
  minWidth: 480,
  minHeight: 360,
};

// ===== Types =====

export interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  width?: number;
  height?: number;
  size: number;
  isMain: boolean;
}

export interface UploadedVideo {
  id: string;
  url: string;
  thumbnail?: string;
  file?: File;
  duration?: number;
  size: number;
  title?: string;
}

interface MediaUploadProps {
  images: UploadedImage[];
  videos: UploadedVideo[];
  onImagesChange: (images: UploadedImage[]) => void;
  onVideosChange: (videos: UploadedVideo[]) => void;
}

// ===== Validation helpers =====

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Convert a File to a compressed base64 data URI.
 *
 * This is critical for persistence: URL.createObjectURL() generates temporary
 * blob: URLs that are invalidated on page reload. By converting to a compressed
 * data URI, the image survives in localStorage and displays correctly on the
 * product detail page even after the browser is closed and reopened.
 *
 * - Resizes to maxDim×maxDim (maintaining aspect ratio)
 * - Compresses to JPEG at the given quality
 * - Output is typically 30-100KB per image, well within localStorage limits
 */
async function fileToCompressedDataURI(file: File, maxDim = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        // Scale down to fit within maxDim×maxDim, preserving aspect ratio
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas 2D context unavailable"));
          return;
        }
        // White background for PNG transparency → JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Failed to decode image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Convert a video File to a base64 data URI.
 *
 * Like images, videos must be stored as data URIs — not blob: URLs — because
 * blob: URLs are invalidated on page reload and filtered out by handleSubmit().
 * The data URI persists in localStorage and is sent to the backend.
 *
 * Note: Base64 encoding increases size by ~33%. The PHP post_max_size and
 * Nginx client_max_body_size must be large enough to accommodate the total
 * request body (all images + videos + product data).
 */
async function fileToVideoDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to read video file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read video file"));
    reader.readAsDataURL(file);
  });
}

export const VIDEO_MAX_BASE64_SIZE = 15; // MB — max video file size for base64 storage

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(video.duration || 0);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(url);
    };
    video.src = url;
  });
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateImage(file: File, dimensions: { width: number; height: number }): ValidationResult {
  if (!IMAGE_LIMITS.acceptedFormats.includes(file.type)) {
    return { valid: false, error: `格式不支持，仅支持 JPG/PNG/WebP` };
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > IMAGE_LIMITS.maxSize) {
    return { valid: false, error: `文件过大 (${sizeMB.toFixed(1)}MB)，限制 ${IMAGE_LIMITS.maxSize}MB` };
  }
  if (dimensions.width < IMAGE_LIMITS.minWidth || dimensions.height < IMAGE_LIMITS.minHeight) {
    return { valid: false, error: `尺寸过小 (${dimensions.width}×${dimensions.height})，最小 ${IMAGE_LIMITS.minWidth}×${IMAGE_LIMITS.minHeight}px` };
  }
  if (dimensions.width > IMAGE_LIMITS.maxWidth || dimensions.height > IMAGE_LIMITS.maxHeight) {
    return { valid: false, error: `尺寸过大 (${dimensions.width}×${dimensions.height})，最大 ${IMAGE_LIMITS.maxWidth}×${IMAGE_LIMITS.maxHeight}px` };
  }
  return { valid: true };
}

function validateVideo(file: File, duration: number): ValidationResult {
  if (!VIDEO_LIMITS.acceptedFormats.includes(file.type)) {
    return { valid: false, error: `格式不支持，仅支持 MP4/MOV/WebM` };
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > VIDEO_LIMITS.maxSize) {
    return { valid: false, error: `文件过大 (${sizeMB.toFixed(1)}MB)，限制 ${VIDEO_LIMITS.maxSize}MB` };
  }
  if (duration > VIDEO_LIMITS.maxDuration) {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return { valid: false, error: `时长过长 (${mins}:${secs.toString().padStart(2, "0")})，限制 ${VIDEO_LIMITS.maxDuration / 60}分钟` };
  }
  return { valid: true };
}

// ===== Main Component =====

export function MediaUpload({
  images,
  videos,
  onImagesChange,
  onVideosChange,
}: MediaUploadProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<"image" | "video" | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // --- Image handlers ---

  const handleImageFiles = useCallback(async (files: FileList) => {
    const newErrors: Record<string, string> = {};
    const validImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      const fileId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (images.length + validImages.length >= IMAGE_LIMITS.maxCount) {
        newErrors[fileId] = `最多上传 ${IMAGE_LIMITS.maxCount} 张图片`;
        break;
      }

      const dimensions = await getImageDimensions(file);
      const validation = validateImage(file, dimensions);

      if (!validation.valid) {
        newErrors[fileId] = validation.error!;
        continue;
      }

      // Convert to compressed base64 data URI for persistence in localStorage.
      // blob: URLs from URL.createObjectURL() are invalidated on page reload,
      // causing images to disappear on the product detail page.
      let compressedUrl: string;
      try {
        compressedUrl = await fileToCompressedDataURI(file);
      } catch {
        newErrors[fileId] = "图片压缩失败，请重试";
        continue;
      }

      validImages.push({
        id: fileId,
        url: compressedUrl,
        file,
        width: dimensions.width,
        height: dimensions.height,
        size: file.size,
        isMain: images.length === 0 && validImages.length === 0,
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setTimeout(() => {
        setErrors((prev) => {
          const updated = { ...prev };
          Object.keys(newErrors).forEach((k) => delete updated[k]);
          return updated;
        });
      }, 5000);
    }

    if (validImages.length > 0) {
      onImagesChange([...images, ...validImages]);
    }
  }, [images, onImagesChange]);

  const handleVideoFiles = useCallback(async (files: FileList) => {
    const newErrors: Record<string, string> = {};
    const validVideos: UploadedVideo[] = [];

    for (const file of Array.from(files)) {
      const fileId = `vid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (videos.length + validVideos.length >= VIDEO_LIMITS.maxCount) {
        newErrors[fileId] = `最多上传 ${VIDEO_LIMITS.maxCount} 个视频`;
        break;
      }

      const duration = await getVideoDuration(file);
      const validation = validateVideo(file, duration);

      if (!validation.valid) {
        newErrors[fileId] = validation.error!;
        continue;
      }

      // Check if video is small enough for base64 storage.
      // Base64 encoding increases size by ~33%, so we check against
      // VIDEO_MAX_BASE64_SIZE to ensure it fits within PHP post_max_size.
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > VIDEO_MAX_BASE64_SIZE) {
        newErrors[fileId] = `视频过大 (${sizeMB.toFixed(1)}MB)，base64存储上限为 ${VIDEO_MAX_BASE64_SIZE}MB，请压缩后重试`;
        continue;
      }

      // Convert to base64 data URI for persistence.
      // blob: URLs from URL.createObjectURL() are invalidated on page reload
      // and filtered out by handleSubmit(), so videos must be data URIs.
      let videoUrl: string;
      try {
        videoUrl = await fileToVideoDataURI(file);
      } catch {
        newErrors[fileId] = "视频转换失败，请重试";
        continue;
      }

      validVideos.push({
        id: fileId,
        url: videoUrl,
        file,
        duration,
        size: file.size,
        title: file.name.replace(/\.[^/.]+$/, ""),
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setTimeout(() => {
        setErrors((prev) => {
          const updated = { ...prev };
          Object.keys(newErrors).forEach((k) => delete updated[k]);
          return updated;
        });
      }, 5000);
    }

    if (validVideos.length > 0) {
      onVideosChange([...videos, ...validVideos]);
    }
  }, [videos, onVideosChange]);

  // --- Remove / Set main ---

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    // If removing the main image, set the first remaining as main
    if (updated.length > 0 && !updated.some((img) => img.isMain)) {
      updated[0].isMain = true;
    }
    onImagesChange(updated);
  };

  const removeVideo = (id: string) => {
    onVideosChange(videos.filter((vid) => vid.id !== id));
  };

  const setMainImage = (id: string) => {
    onImagesChange(images.map((img) => ({ ...img, isMain: img.id === id })));
  };

  // --- Drag and drop ---

  const handleDrop = (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (type === "image") {
      handleImageFiles(files);
    } else {
      handleVideoFiles(files);
    }
  };

  // ===== Render =====

  return (
    <div className="space-y-6">
      {/* ===== Images Section ===== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-600" />
            <h3 className="font-bold text-foreground">产品图片</h3>
            <Badge variant="secondary" className="text-xs">
              {images.length} / {IMAGE_LIMITS.maxCount}
            </Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={images.length >= IMAGE_LIMITS.maxCount}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            添加图片
          </Button>
        </div>

        {/* Upload limits info */}
        <div className="flex items-start gap-1.5 mb-3 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div>
            支持 JPG / PNG / WebP 格式 · 单张 ≤ {IMAGE_LIMITS.maxSize}MB ·
            推荐尺寸 {IMAGE_LIMITS.recommendedSize}（1:1 正方形） ·
            最少 800×800px，最大 10000×10000px
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept={IMAGE_LIMITS.acceptedExtensions.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleImageFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Image grid + drop zone */}
        <div className="grid grid-cols-4 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden border-2 group bg-muted"
            >
              <Image
                src={img.url}
                alt="product"
                fill
                className="object-cover"
              />
              {img.isMain && (
                <span className="absolute top-1.5 left-1.5 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  主图
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isMain && (
                  <button
                    onClick={() => setMainImage(img.id)}
                    className="px-2 py-1 bg-white/90 text-brand-700 text-[10px] font-medium rounded hover:bg-white"
                    title="设为主图"
                  >
                    设为主图
                  </button>
                )}
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-1.5 bg-red-500/90 text-white rounded hover:bg-red-600"
                  title="删除"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded">
                {img.width}×{img.height}
              </div>
            </div>
          ))}

          {/* Drop zone (when under limit) */}
          {images.length < IMAGE_LIMITS.maxCount && (
            <div
              onClick={() => imageInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver("image"); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, "image")}
              className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver === "image"
                  ? "border-brand-500 bg-brand-50"
                  : "border-border hover:border-brand-300 hover:bg-muted/30"
              }`}
            >
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground">拖拽或点击上传</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== Videos Section ===== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-5 w-5 text-brand-600" />
            <h3 className="font-bold text-foreground">产品视频</h3>
            <Badge variant="secondary" className="text-xs">
              {videos.length} / {VIDEO_LIMITS.maxCount}
            </Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => videoInputRef.current?.click()}
            disabled={videos.length >= VIDEO_LIMITS.maxCount}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            添加视频
          </Button>
        </div>

        {/* Upload limits info */}
        <div className="flex items-start gap-1.5 mb-3 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2.5">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <div>
            支持 MP4 / MOV / WebM 格式 · 单个 ≤ {VIDEO_LIMITS.maxSize}MB ·
            推荐时长 {VIDEO_LIMITS.recommendedDuration}（最长 {VIDEO_LIMITS.maxDuration / 60}分钟） ·
            最低分辨率 480P
          </div>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept={VIDEO_LIMITS.acceptedExtensions.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleVideoFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Video grid + drop zone */}
        <div className="grid grid-cols-3 gap-3">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="relative aspect-video rounded-lg overflow-hidden border-2 group bg-black"
            >
              <video
                src={vid.url}
                className="w-full h-full object-cover"
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                  <Play className="h-5 w-5 text-brand-600 ml-0.5" fill="currentColor" />
                </div>
              </div>
              {vid.duration && (
                <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded">
                  {Math.floor(vid.duration / 60)}:{Math.floor(vid.duration % 60).toString().padStart(2, "0")}
                </span>
              )}
              <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between">
                <span className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded max-w-[70%] truncate">
                  {vid.title}
                </span>
                <button
                  onClick={() => removeVideo(vid.id)}
                  className="p-1 bg-red-500/90 text-white rounded hover:bg-red-600 shrink-0"
                  title="删除"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded">
                {formatFileSize(vid.size)}
              </div>
            </div>
          ))}

          {/* Drop zone */}
          {videos.length < VIDEO_LIMITS.maxCount && (
            <div
              onClick={() => videoInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver("video"); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, "video")}
              className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver === "video"
                  ? "border-brand-500 bg-brand-50"
                  : "border-border hover:border-brand-300 hover:bg-muted/30"
              }`}
            >
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-[10px] text-muted-foreground">拖拽或点击上传</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== Error Messages ===== */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(errors).map(([key, msg]) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700 animate-in fade-in slide-in-from-bottom-1"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* ===== Summary ===== */}
      {(images.length > 0 || videos.length > 0) && (
        <div className="flex items-center gap-4 bg-brand-50 rounded-lg p-3 text-sm">
          <span className="flex items-center gap-1.5 text-brand-700">
            <CheckCircle2 className="h-4 w-4" />
            已上传 {images.length} 张图片、{videos.length} 个视频
          </span>
          {images.length > 0 && !images.some((img) => img.isMain) && (
            <span className="flex items-center gap-1.5 text-gold-600">
              <AlertCircle className="h-4 w-4" />
              请设置一张主图
            </span>
          )}
        </div>
      )}
    </div>
  );
}
