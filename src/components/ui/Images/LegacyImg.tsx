import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { addPrefix } from '@/src/utils/Prefixing';

interface LegacyImgProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  cover?: boolean;
  onError?: () => void;
  id?: string;
}

export const LegacyImg = ({
  src,
  alt,
  width,
  height,
  cover = false,
  onError = () => {},
  id = '',
}: LegacyImgProps) => {
  const resolvedSrc = typeof src === 'string' ? addPrefix(src) : src;

  if (cover) {
    return (
      <Image
        onError={onError}
        alt={alt}
        src={resolvedSrc}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        id={id}
      />
    );
  }
  if (width || height) {
    return (
      <Image
        onError={onError}
        alt={alt}
        src={resolvedSrc}
        width={width}
        height={height}
        style={{ objectFit: 'contain' }}
        id={id}
      />
    );
  }
  return (
    <Image
      onError={onError}
      alt={alt}
      src={resolvedSrc}
      fill
      style={{ objectFit: 'contain' }}
      id={id}
    />
  );
};
