import NextImage from 'next/image';
import React from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  objectPosition?: string;
  cover?: boolean;
}

export const Image = ({
  src,
  alt,
  width,
  height,
  fill = false,
  objectPosition,
  cover = false,
}: ImageProps) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      fill={fill || cover}
      width={width}
      height={height}
      style={{
        objectFit: cover ? 'cover' : 'contain',
        objectPosition: objectPosition || 'center',
      }}
    />
  );
};
