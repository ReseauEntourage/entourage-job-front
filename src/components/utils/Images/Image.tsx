import NextImage from 'next/image';
import React from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  objectPosition?: string;
}

export const Image = ({
  src,
  alt,
  width,
  height,
  fill = false,
  objectPosition,
}: ImageProps) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      style={{
        objectFit: 'contain',
        objectPosition: objectPosition || 'center',
      }}
    />
  );
};
