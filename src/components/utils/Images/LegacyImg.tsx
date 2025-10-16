import { StaticImageData } from 'next/image';
import Image from 'next/legacy/image';
import React from 'react';
import { addPrefix } from 'src/utils/Prefixing';

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
  if (cover) {
    return (
      <Image
        onError={onError}
        alt={alt}
        src={typeof src === 'string' ? addPrefix(src) : src}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        id={id}
      />
    );
  }
  if (width || height) {
    return (
      <Image
        onError={onError}
        alt={alt}
        src={typeof src === 'string' ? addPrefix(src) : src}
        width={width}
        height={height}
        objectFit="contain"
        id={id}
      />
    );
  }
  return (
    <Image
      onError={onError}
      alt={alt}
      src={typeof src === 'string' ? addPrefix(src) : src}
      layout="fill"
      objectFit="contain"
      id={id}
    />
  );
};
