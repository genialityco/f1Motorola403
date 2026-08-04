"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';

type MediaAssetProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
};

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg']);

function getExtension(src: string) {
  const cleanSrc = src.split('?')[0].split('#')[0];
  const lastDotIndex = cleanSrc.lastIndexOf('.');

  if (lastDotIndex < 0) {
    return '';
  }

  return cleanSrc.slice(lastDotIndex + 1).toLowerCase();
}

export function MediaAsset({ src, alt, className = '', sizes = '100vw', priority = false, objectFit = 'cover' }: MediaAssetProps) {
  const [hasError, setHasError] = useState(false);
  const extension = useMemo(() => getExtension(src), [src]);
  const isVideo = VIDEO_EXTENSIONS.has(extension);

  if (hasError || !src) {
    return (
      <div className={`media-asset__fallback ${className}`.trim()} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        className={`media-asset__video ${className}`.trim()}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        onError={() => setHasError(true)}
      >
        <source src={src} type={`video/${extension}`} />
      </video>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={() => setHasError(true)}
      className={`media-asset__image media-asset--${objectFit} ${className}`.trim()}
    />
  );
}
