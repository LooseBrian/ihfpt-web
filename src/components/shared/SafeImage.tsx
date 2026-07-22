"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { IMAGE_PLACEHOLDER_DATAURI } from "@/lib/product-images";

/**
 * A drop-in replacement for next/image that gracefully handles broken
 * image URLs by falling back to a placeholder.
 *
 * Usage: same as <Image />, just swap the import.
 *   import { SafeImage } from "@/components/shared/SafeImage";
 *   <SafeImage src={product.image} alt={product.name} fill className="..." />
 */
export function SafeImage(props: ImageProps) {
  const [errored, setErrored] = useState(false);

  // When the image fails to load, render a plain <img> with the placeholder
  // so next/image's loader doesn't keep retrying the broken URL.
  if (errored) {
    const { alt = "", className, fill, style } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={IMAGE_PLACEHOLDER_DATAURI}
        alt={alt}
        className={className as string | undefined}
        style={{
          // When fill was requested, make the <img> behave like next/image fill
          ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : {}),
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      onError={() => setErrored(true)}
    />
  );
}
